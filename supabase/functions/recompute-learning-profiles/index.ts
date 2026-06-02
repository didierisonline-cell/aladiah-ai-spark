// =============================================================================
// recompute-learning-profiles  —  Part 3 / Phase 2, Step 3 (rollup function)
// =============================================================================
// Service-role, single-user recompute of strengths/weaknesses from the raw
// per-question grain (quiz_attempt_answers) into student_learning_profiles.
//
// Built from the LOCKED Step-3 spec committed at 3bde00f (PHASE2_ANALYTICS_PLAN.md,
// "Step-3 implementation spec — recompute-learning-profiles (LOCKED)").
//
// DRAFT — reviewable only. NOT deployed, NOT wired to any trigger/cron yet (that is
// step 4). Invocation auth (who may recompute whom) is finalized in step 4; tonight
// this trusts its caller (service-role / internal) and recomputes the userId it is given.
//
// Why a direct Postgres connection (not the supabase-js client): the spec requires a
// single transaction that (a) takes pg_advisory_xact_lock(hashtext(userId)), (b) reads
// the grain, (c) ON CONFLICT-upserts per-program rows, and (d) read-then-writes the
// NULL-course cross-program row. PostgREST issues each call in its own transaction and
// exposes neither advisory locks nor "read-then-write under the same lock", so we use a
// raw pg transaction via SUPABASE_DB_URL. Service role / DB owner bypasses RLS (same
// privilege posture as admin-analytics).
//
// TODO(types): quiz_attempt_answers is absent from src/integrations/supabase/types.ts
// (types not regenerated after migration 20260531201551). Its row shape is hand-declared
// below (AnswerJoinRow). Regenerate Supabase types and drop the local declaration later.
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// -----------------------------------------------------------------------------
// Tunable constants (spec §3). Changing a verdict is a one-line edit here.
// -----------------------------------------------------------------------------
const WEAK_MAX_ACCURACY = 0.70; // weak if accuracy < this
const STRONG_MIN_ACCURACY = 0.90; // strong if accuracy >= this
const MIN_SAMPLE = 3; // require attempts >= this to classify (else neutral)
const WINDOW_N = 50; // most-recent answer ROWS per competency (answers, not attempts)
const TREND_CAP = 30; // max trend points (matches legacy hook)
// WINDOW_DAYS — reserved future tunable. The 90-day secondary bound was intentionally
// DROPPED for now (spec Decision 3): the profile reflects RECENT mastery, not all-time.
// const WINDOW_DAYS = 90;

// -----------------------------------------------------------------------------
// Axis-1 slug -> Axis-2 meta-category. SOURCE OF TRUTH: COMPETENCY_TAXONOMY.md §3
// (status CONFIRMED as of commit af24261). Mirrored here; keep in sync with §3.
// An Axis-1 slug not present here is logged and SKIPPED from the cross-program roll
// (no invented bucket) — see warn+skip in the cross-program section.
// -----------------------------------------------------------------------------
const AXIS2: Record<string, string> = {
  "scrum:framework": "foundations",
  "scrum:empiricism": "foundations",
  "scrum:roles": "roles-accountabilities",
  "scrum:events": "process-execution",
  "scrum:artifacts": "artifacts-tooling",
  "scrum:team-dynamics": "people-leadership",
  "scrum:stakeholders": "stakeholder-engagement",
  "scrum:delivery-metrics": "measurement-outcomes",
};

// Human labels for the legacy `topic` field. Mirrored from COMPETENCY_TAXONOMY.md §2
// (Axis-1 registry labels). Fallback to the slug itself if unmapped.
const SLUG_LABELS: Record<string, string> = {
  "scrum:framework": "Scrum Framework Fundamentals",
  "scrum:roles": "Accountabilities & Roles",
  "scrum:events": "Scrum Events",
  "scrum:artifacts": "Artifacts & Commitments",
  "scrum:empiricism": "Empiricism & Agile Principles",
  "scrum:team-dynamics": "Team Dynamics & Facilitation",
  "scrum:stakeholders": "Stakeholder & Organizational Engagement",
  "scrum:delivery-metrics": "Delivery & Flow Metrics",
};

// -----------------------------------------------------------------------------
// Hand-declared row type for the confirmed read query (see TODO(types) above).
// timestamptz decodes to Date via deno-postgres; uuid -> string; int/bool as-is.
// -----------------------------------------------------------------------------
// `type` (not `interface`) on purpose: deno-postgres `queryObject<T>` expects T to be
// assignable to Record<string, unknown>; a type alias satisfies that, an interface does
// not (interfaces have no implicit index signature). Defensive — deno check unavailable locally.
type AnswerJoinRow = {
  answer_id: string;
  competency: string; // non-null by the WHERE filter
  is_correct: boolean;
  attempt_id: string;
  attempted_at: Date;
  quiz_id: string;
  attempt_score: number;
  course_id: string | null;
};

interface TrendPoint {
  date: string;
  accuracy: number;
}

// weak_areas / strong_areas entry shape (spec "Profile shape"). For per-program rows
// `competency` is the Axis-1 slug; for the cross-program row entries are keyed by
// metaCategory (competency = null, topic = metaCategory key).
interface AreaEntry {
  competency: string | null;
  topic: string;
  metaCategory: string | null;
  accuracy: number; // 0..1, 4dp
  score: number; // 0..100 legacy mirror = round(accuracy*100)
  attempts: number; // windowed count of answers
  lastTested: string; // ISO
  trend: TrendPoint[]; // per-competency, capped TREND_CAP
}

interface LegacyTrendPoint {
  date: string;
  score: number;
  quizId: string;
}

// -----------------------------------------------------------------------------
// Helpers (all deterministic — same input → byte-identical output).
// -----------------------------------------------------------------------------
const round4 = (x: number) => Math.round(x * 10000) / 10000;

// Most-recent-first ordering of answer rows: created_at DESC, then id DESC (spec §2).
function byRecentDesc(a: AnswerJoinRow, b: AnswerJoinRow): number {
  const dt = b.attempted_at.getTime() - a.attempted_at.getTime();
  if (dt !== 0) return dt;
  return a.answer_id < b.answer_id ? 1 : a.answer_id > b.answer_id ? -1 : 0;
}

// Per-competency trend: bucket the windowed rows by attempt → {date, accuracy},
// sorted by date ASC, capped to the most-recent TREND_CAP.
function perCompetencyTrend(windowRows: AnswerJoinRow[]): TrendPoint[] {
  const byAttempt = new Map<string, { date: Date; correct: number; total: number }>();
  for (const r of windowRows) {
    const b = byAttempt.get(r.attempt_id) ??
      { date: r.attempted_at, correct: 0, total: 0 };
    b.total += 1;
    if (r.is_correct) b.correct += 1;
    byAttempt.set(r.attempt_id, b);
  }
  const pts = [...byAttempt.values()].map((b) => ({
    date: b.date.toISOString(),
    accuracy: round4(b.correct / b.total),
  }));
  // newest first, keep TREND_CAP, then present oldest→newest
  pts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return pts.slice(0, TREND_CAP).reverse();
}

// Legacy top-level quiz_accuracy_trend: one point per distinct attempt in scope,
// {date, score, quizId}, most-recent TREND_CAP, presented oldest→newest.
function legacyTrend(rows: AnswerJoinRow[]): LegacyTrendPoint[] {
  const byAttempt = new Map<string, LegacyTrendPoint & { _d: number }>();
  for (const r of rows) {
    if (!byAttempt.has(r.attempt_id)) {
      byAttempt.set(r.attempt_id, {
        date: r.attempted_at.toISOString(),
        score: r.attempt_score,
        quizId: r.quiz_id,
        _d: r.attempted_at.getTime(),
      });
    }
  }
  const pts = [...byAttempt.values()];
  pts.sort((a, b) => b._d - a._d); // newest first
  return pts.slice(0, TREND_CAP).reverse().map(({ _d: _drop, ...p }) => p);
}

// Window + aggregate a set of rows grouped by a key (competency or metaCategory),
// then classify into weak/strong entries. `keyOf` returns the grouping key;
// `labelOf`/`slugOf`/`metaOf` shape the entry fields.
function buildAreas(
  rows: AnswerJoinRow[],
  keyOf: (r: AnswerJoinRow) => string,
  shape: (key: string) => { competency: string | null; topic: string; metaCategory: string | null },
): { weak: AreaEntry[]; strong: AreaEntry[] } {
  const groups = new Map<string, AnswerJoinRow[]>();
  for (const r of rows) {
    const k = keyOf(r);
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(r);
  }

  const weak: AreaEntry[] = [];
  const strong: AreaEntry[] = [];

  for (const [key, groupRows] of groups) {
    const windowRows = [...groupRows].sort(byRecentDesc).slice(0, WINDOW_N);
    const attempts = windowRows.length;
    if (attempts === 0) continue;
    const correct = windowRows.reduce((n, r) => n + (r.is_correct ? 1 : 0), 0);
    const accuracy = correct / attempts;
    const lastTested = windowRows
      .reduce((m, r) => (r.attempted_at > m ? r.attempted_at : m), windowRows[0].attempted_at)
      .toISOString();

    // Classify (spec §3). Mutually exclusive by construction; neutral if under-sampled.
    let bucket: "weak" | "strong" | null = null;
    if (attempts >= MIN_SAMPLE) {
      if (accuracy < WEAK_MAX_ACCURACY) bucket = "weak";
      else if (accuracy >= STRONG_MIN_ACCURACY) bucket = "strong";
    }
    if (bucket === null) continue; // neutral band or under-sampled → neither list

    const s = shape(key);
    const entry: AreaEntry = {
      competency: s.competency,
      topic: s.topic,
      metaCategory: s.metaCategory,
      accuracy: round4(accuracy),
      score: Math.round(accuracy * 100),
      attempts,
      lastTested,
      trend: perCompetencyTrend(windowRows),
    };
    (bucket === "weak" ? weak : strong).push(entry);
  }

  // Deterministic sort + defensive cap (spec §6). weak: accuracy ASC, key ASC.
  const keyStr = (e: AreaEntry) => e.competency ?? e.metaCategory ?? e.topic;
  weak.sort((a, b) => a.accuracy - b.accuracy || (keyStr(a) < keyStr(b) ? -1 : 1));
  strong.sort((a, b) => b.accuracy - a.accuracy || (keyStr(a) < keyStr(b) ? -1 : 1));
  return { weak: weak.slice(0, 50), strong: strong.slice(0, 50) };
}

// -----------------------------------------------------------------------------
// Confirmed read query (spec §1). 3-hop join to reach course_id; competency NOT NULL.
// -----------------------------------------------------------------------------
const READ_SQL = `
  SELECT qaa.id AS answer_id, qaa.competency, qaa.is_correct,
         qa.id AS attempt_id, qa.created_at AS attempted_at, qa.quiz_id,
         qa.score AS attempt_score, ch.course_id
  FROM public.quiz_attempt_answers qaa
  JOIN public.quiz_attempts qa ON qa.id = qaa.attempt_id
  JOIN public.quizzes        q  ON q.id  = qa.quiz_id
  JOIN public.chapters       ch ON ch.id = q.chapter_id
  WHERE qa.user_id = $1 AND qaa.competency IS NOT NULL
  ORDER BY qaa.competency, qa.created_at DESC, qaa.id DESC
`;

const UPSERT_PER_PROGRAM = `
  INSERT INTO public.student_learning_profiles
    (user_id, course_id, weak_areas, strong_areas, quiz_accuracy_trend)
  VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb)
  ON CONFLICT (user_id, course_id)
  DO UPDATE SET weak_areas          = EXCLUDED.weak_areas,
                strong_areas        = EXCLUDED.strong_areas,
                quiz_accuracy_trend = EXCLUDED.quiz_accuracy_trend
`;

// -----------------------------------------------------------------------------
// Core: recompute one user inside one advisory-locked transaction.
// Returns a summary (no PII beyond counts) for the HTTP response / logs.
// -----------------------------------------------------------------------------
async function recompute(client: Client, userId: string) {
  await client.queryArray("BEGIN");
  try {
    // Guard the WHOLE recompute (read + all writes) against a concurrent run for the
    // same user (submit-trigger racing the nightly sweep). Transaction-scoped; released
    // on COMMIT/ROLLBACK. Also the only safe way to make the NULL-course read-then-write
    // atomic, since ON CONFLICT cannot target course_id IS NULL (spec Decision 1 / S3).
    await client.queryArray({
      text: "SELECT pg_advisory_xact_lock(hashtext($1))",
      args: [userId],
    });

    const { rows } = await client.queryObject<AnswerJoinRow>({ text: READ_SQL, args: [userId] });

    // ---- Per-program rolls: group by course_id (skip rows with NULL course_id;
    //      those are mis-seeded chapters and contribute to cross-program only). ----
    const byCourse = new Map<string, AnswerJoinRow[]>();
    for (const r of rows) {
      if (r.course_id === null) continue;
      (byCourse.get(r.course_id) ?? byCourse.set(r.course_id, []).get(r.course_id)!).push(r);
    }

    const courseSummaries: Array<{ courseId: string; weak: number; strong: number }> = [];
    for (const [courseId, courseRows] of byCourse) {
      const { weak, strong } = buildAreas(
        courseRows,
        (r) => r.competency,
        (slug) => ({
          competency: slug,
          topic: SLUG_LABELS[slug] ?? slug,
          metaCategory: AXIS2[slug] ?? null,
        }),
      );
      const trend = legacyTrend(courseRows);
      await client.queryArray({
        text: UPSERT_PER_PROGRAM,
        args: [userId, courseId, JSON.stringify(weak), JSON.stringify(strong), JSON.stringify(trend)],
      });
      courseSummaries.push({ courseId, weak: weak.length, strong: strong.length });
    }

    // ---- Cross-program roll: keyed by Axis-2 metaCategory over ALL rows.
    //      Unmapped slug → warn + skip (no invented bucket). ----
    const unmapped = new Set<string>();
    const mappedRows = rows.filter((r) => {
      const m = AXIS2[r.competency];
      if (!m) { unmapped.add(r.competency); return false; }
      return true;
    });
    if (unmapped.size > 0) {
      console.warn(
        `recompute-learning-profiles: ${unmapped.size} unmapped competency slug(s) skipped from ` +
        `cross-program roll (not in COMPETENCY_TAXONOMY.md §3): ${[...unmapped].join(", ")}`,
      );
    }
    const cross = buildAreas(
      mappedRows,
      (r) => AXIS2[r.competency],
      // TODO(axis2-labels): topic is the raw §3 key (no live UI reader yet). When the
      // cross-program UI is built, add human-readable Axis-2 labels to
      // COMPETENCY_TAXONOMY.md §3 and mirror them here (option B). Tracked pin.
      (meta) => ({ competency: null, topic: meta, metaCategory: meta }),
    );
    const crossTrend = legacyTrend(rows); // all attempts, regardless of course

    // NULL-course row: ON CONFLICT cannot match (NULLs distinct, plain UNIQUE,
    // no partial index — confirmed live). Read-then-write, atomic under the lock above.
    const existing = await client.queryObject<{ id: string }>({
      text: "SELECT id FROM public.student_learning_profiles WHERE user_id = $1 AND course_id IS NULL",
      args: [userId],
    });
    if (existing.rows.length > 0) {
      await client.queryArray({
        text: `UPDATE public.student_learning_profiles
               SET weak_areas = $2::jsonb, strong_areas = $3::jsonb, quiz_accuracy_trend = $4::jsonb
               WHERE id = $1`,
        args: [
          existing.rows[0].id,
          JSON.stringify(cross.weak),
          JSON.stringify(cross.strong),
          JSON.stringify(crossTrend),
        ],
      });
    } else {
      await client.queryArray({
        text: `INSERT INTO public.student_learning_profiles
                 (user_id, course_id, weak_areas, strong_areas, quiz_accuracy_trend)
               VALUES ($1, NULL, $2::jsonb, $3::jsonb, $4::jsonb)`,
        args: [
          userId,
          JSON.stringify(cross.weak),
          JSON.stringify(cross.strong),
          JSON.stringify(crossTrend),
        ],
      });
    }

    await client.queryArray("COMMIT");
    return {
      userId,
      answerRows: rows.length,
      perProgram: courseSummaries,
      crossProgram: { weak: cross.weak.length, strong: cross.strong.length },
      unmappedSlugs: [...unmapped],
    };
  } catch (e) {
    await client.queryArray("ROLLBACK");
    throw e;
  }
}

// -----------------------------------------------------------------------------
// Step-4 artifact #3 — "drain" mode. Batch-process the profile_recompute_queue: for each
// queued user run the PROVEN single-user recompute() (its own advisory-locked txn), then
// DELETE that user's queue row on success. A single user's failure is logged and skipped —
// it stays queued for the next drain and never aborts the batch. recompute() is reused
// unchanged; this only adds a loop + queue read/delete around it.
// -----------------------------------------------------------------------------
const DRAIN_BATCH_CAP = 100; // max users per drain run; any leftover drains next ~3-min cycle

async function drainQueue(client: Client) {
  // user_id is the PRIMARY KEY of profile_recompute_queue (one row per user), so DISTINCT
  // is implicit. Oldest-first + LIMIT keeps a single run bounded.
  const { rows: queued } = await client.queryObject<{ user_id: string }>({
    text: `SELECT user_id FROM public.profile_recompute_queue
           ORDER BY enqueued_at ASC
           LIMIT $1`,
    args: [DRAIN_BATCH_CAP],
  });

  const results: Array<{ userId: string; ok: boolean; error?: string }> = [];
  const usersFailed: string[] = [];
  let usersDrained = 0;

  for (const { user_id } of queued) {
    try {
      await recompute(client, user_id); // proven path; manages its own BEGIN/COMMIT + lock
      // Plain delete on success (spec §3 step-4). A submit that RE-enqueues during this
      // recompute is safe to lose here — recompute is a full overwrite and the nightly
      // sweep reconciles; the optional enqueued_at-guarded delete is deferred.
      await client.queryArray({
        text: `DELETE FROM public.profile_recompute_queue WHERE user_id = $1`,
        args: [user_id],
      });
      results.push({ userId: user_id, ok: true });
      usersDrained++;
    } catch (e) {
      const error = e instanceof Error ? e.message : "Unknown error";
      console.error(`drain: recompute failed for ${user_id} (left queued):`, error);
      results.push({ userId: user_id, ok: false, error });
      usersFailed.push(user_id);
    }
  }

  return {
    mode: "drain" as const,
    batchCap: DRAIN_BATCH_CAP,
    queued: queued.length,
    usersDrained,
    usersFailed, // ids left queued for retry
    results, // per-user { userId, ok, error? }
  };
}

// -----------------------------------------------------------------------------
// HTTP entry. Two modes:
//   • POST { userId }        — single-user recompute (UNCHANGED from step 3).
//   • POST { mode: "drain" } — batch-drain the recompute queue (step-4 artifact #3).
// Invocation auth (locked step-4): verify_jwt=true, cron sends a service-role bearer; no
// strict service-role-only rejection yet (preserves the anon-key test path).
// -----------------------------------------------------------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    if (req.method !== "POST") return json({ error: "POST only" }, 405);

    const body = await req.json().catch(() => ({}));

    // ---- "drain" mode (step-4 artifact #3) — additive; no userId required. Reuses the
    //      same Client(dbUrl) setup and the proven recompute(). The single-user path below
    //      this block is unchanged. ----
    if (body?.mode === "drain") {
      const dbUrl = Deno.env.get("SUPABASE_DB_URL");
      if (!dbUrl) return json({ error: "SUPABASE_DB_URL not configured" }, 500);
      const client = new Client(dbUrl);
      await client.connect();
      try {
        const summary = await drainQueue(client);
        return json({ ok: true, ...summary });
      } finally {
        await client.end();
      }
    }

    // ---- single-user mode (UNCHANGED): POST { userId } ----
    const userId: unknown = body?.userId;
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof userId !== "string" || !uuidRe.test(userId)) {
      return json({ error: "Body must include a valid userId (uuid)" }, 400);
    }

    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) return json({ error: "SUPABASE_DB_URL not configured" }, 500);

    const client = new Client(dbUrl);
    await client.connect();
    try {
      const summary = await recompute(client, userId);
      return json({ ok: true, ...summary });
    } finally {
      await client.end();
    }
  } catch (e) {
    console.error("recompute-learning-profiles error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return json({ ok: false, error: message }, 500);
  }
});
