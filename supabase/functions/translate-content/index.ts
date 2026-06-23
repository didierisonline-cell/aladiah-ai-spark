import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// ============================================================================
// translate-content — batch AI translation of course content into the
// platform's supported languages, written into the `translations` JSONB on
// courses / chapters / videos.
//
// Source of truth for English content:
//   - title:       base `title` column (fallback translations.en.title)
//   - description: base `description` column (fallback translations.en.description)
//   - transcript:  translations.en.transcript  (videos only; no base column)
//
// Writes target language under translations[lang] = { title, description, transcript }.
//
// IDEMPOTENT: a (row, lang, field) already present is skipped unless overwrite=true.
// RESUMABLE: processes up to `limit` AI calls per invocation and returns how many
//            work items remain, so you can re-invoke until remaining = 0.
// HUMAN-TRIGGERED: deployed by you; you invoke it deliberately (no auto-run).
//
// POST body (all optional):
//   courseId   string   translate one course; omit for ALL courses
//   languages  string[] default the 6 non-English supported langs
//   target     'videos'|'chapters'|'courses'|'all'   default 'all'
//   fields     ('title'|'description'|'transcript')[] default all three
//   overwrite  boolean  re-translate even if present (default false)
//   limit      number   max AI calls this invocation (default 15)
//   dryRun     boolean  report the work plan without calling the model or writing
// ============================================================================

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  es: "Spanish", zh: "Simplified Chinese", ar: "Arabic", fr: "French",
  de: "German", ja: "Japanese", pt: "Portuguese", hi: "Hindi", ko: "Korean",
  it: "Italian", ru: "Russian", nl: "Dutch", pl: "Polish", tr: "Turkish",
  sw: "Swahili", yo: "Yoruba", ha: "Hausa", ig: "Igbo", vi: "Vietnamese", th: "Thai",
};

const DEFAULT_LANGS = ["es", "zh", "ar", "fr", "de", "ja"];
const DEFAULT_FIELDS = ["title", "description", "transcript"] as const;

type Field = "title" | "description" | "transcript";

// One Anthropic call: translate the given English fields into one target language.
async function translateFields(
  apiKey: string,
  langCode: string,
  source: Partial<Record<Field, string>>,
): Promise<Partial<Record<Field, string>>> {
  const langName = LANG_NAMES[langCode] || langCode;
  const payloadIn = JSON.stringify(source);
  const prompt = `Translate the JSON values below from English into ${langName}.

STRICT RULES (this is a paid certification course — accuracy and fidelity matter):
- Translate MEANING faithfully. Do NOT add, remove, summarize, or invent any content.
- Keep ALL facts, numbers, percentages, dollar amounts, dates, and proper nouns exactly as-is.
- Do NOT translate brand/product names or names of people: "Aladiah Academy", "Prof. Didier", "Scrum", "Scrum Master", "Sprint", "Jira", "Agile", "Kanban", "SAFe", certification names (CSM, PSM, PMI-ACP), and similar industry terms stay in their standard form for ${langName} (transliterate only where that is the established convention).
- Preserve the EXACT structure: keep line breaks, blank lines, headings, capitalization style of headings, and any list formatting in the "transcript" field.
- Return ONLY the keys that were provided, as a single valid JSON object with the same keys. No commentary, no markdown fences.

Input JSON:
${payloadIn}`;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8000,
      system: "You are a professional localization translator. Return ONLY a valid JSON object with the same keys you were given. No markdown.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  // Surface API failures instead of silently writing nothing.
  if (!r.ok || d?.error) {
    throw new Error("anthropic_error status=" + r.status + " body=" + JSON.stringify(d?.error || d).slice(0, 300));
  }
  let t = (d?.content?.[0]?.text || "").trim().replace(/^```[\w]*\n?/, "").replace(/```$/, "");
  if (!t) throw new Error("empty_model_text resp=" + JSON.stringify(d).slice(0, 200));
  let parsed: Partial<Record<Field, string>>;
  try {
    parsed = JSON.parse(t);
  } catch {
    throw new Error("non_json_response for " + langCode + ": " + t.slice(0, 200));
  }
  const got = Object.keys(source).filter((k) => (parsed as any)[k]);
  if (got.length === 0) {
    throw new Error("no_expected_keys_returned keys=" + Object.keys(parsed).join(",") + " text=" + t.slice(0, 150));
  }
  return parsed;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    // Admin guard: this function spends AI credits and writes content, so require a
    // shared secret. Set TRANSLATE_ADMIN_SECRET in the function's env and pass it as
    // the x-admin-secret header. If the secret env is unset, the function refuses to run.
    const adminSecret = Deno.env.get("TRANSLATE_ADMIN_SECRET") || "";
    if (!adminSecret || req.headers.get("x-admin-secret") !== adminSecret) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const courseId: string | undefined = body.courseId;
    const chapterId: string | undefined = body.chapterId; // pilot one module (videos scope)
    const languages: string[] = Array.isArray(body.languages) && body.languages.length ? body.languages : DEFAULT_LANGS;
    const target: string = body.target || "all";
    const fields: Field[] = Array.isArray(body.fields) && body.fields.length ? body.fields : [...DEFAULT_FIELDS];
    const overwrite: boolean = !!body.overwrite;
    const limit: number = Number.isFinite(body.limit) ? body.limit : 15;
    const offset: number = Number.isFinite(body.offset) ? body.offset : 0;
    const dryRun: boolean = !!body.dryRun;

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY") || "";
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    if (!apiKey && !dryRun) throw new Error("ANTHROPIC_API_KEY not set");

    // Resolve course scope.
    let courseIds: string[] = [];
    if (courseId) {
      courseIds = [courseId];
    } else {
      const { data } = await supabase.from("courses").select("id");
      courseIds = (data || []).map((c: any) => c.id);
    }

    // Gather rows to consider, per requested target type.
    type Row = { table: "courses" | "chapters" | "videos"; id: string; translations: any; src: Partial<Record<Field, string>> };
    const rows: Row[] = [];

    const wantCourses = target === "all" || target === "courses";
    const wantChapters = target === "all" || target === "chapters";
    const wantVideos = target === "all" || target === "videos";

    if (wantCourses) {
      const { data } = await supabase.from("courses").select("id, title, description, translations").in("id", courseIds);
      (data || []).forEach((c: any) => rows.push({
        table: "courses", id: c.id, translations: c.translations || {},
        src: { title: c.title, description: c.description },
      }));
    }
    if (wantChapters) {
      const { data } = await supabase.from("chapters").select("id, title, description, translations, course_id").in("course_id", courseIds);
      (data || []).forEach((c: any) => rows.push({
        table: "chapters", id: c.id, translations: c.translations || {},
        src: { title: c.title, description: c.description },
      }));
    }
    if (wantVideos) {
      // videos has no direct course_id; go via chapters. A chapterId narrows to one module.
      let chapterIds: string[];
      if (chapterId) {
        chapterIds = [chapterId];
      } else {
        const { data: chs } = await supabase.from("chapters").select("id").in("course_id", courseIds);
        chapterIds = (chs || []).map((c: any) => c.id);
      }
      if (chapterIds.length) {
        const { data } = await supabase.from("videos").select("id, title, description, translations, chapter_id, order_index").in("chapter_id", chapterIds).order("order_index");
        (data || []).forEach((v: any) => {
          const tr = v.translations || {};
          rows.push({
            table: "videos", id: v.id, translations: tr,
            src: {
              title: v.title,
              description: v.description || tr?.en?.description || "",
              transcript: tr?.en?.transcript || "",
            },
          });
        });
      }
    }

    // Build the work list: one item per (row, lang) that still needs >=1 field.
    type WorkItem = { row: Row; lang: string; need: Field[] };
    const work: WorkItem[] = [];
    for (const row of rows) {
      for (const lang of languages) {
        if (lang === "en") continue;
        const existing = row.translations?.[lang] || {};
        const need: Field[] = [];
        for (const f of fields) {
          const srcVal = (row.src[f] || "").trim();
          if (!srcVal) continue;                 // nothing to translate for this field
          if (!overwrite && existing[f]) continue; // already translated
          need.push(f);
        }
        if (need.length) work.push({ row, lang, need });
      }
    }

    const totalRemaining = work.length;
    if (dryRun) {
      return new Response(JSON.stringify({
        dryRun: true, rows: rows.length, workItems: totalRemaining,
        sample: work.slice(0, 5).map(w => ({ table: w.row.table, id: w.row.id, lang: w.lang, need: w.need })),
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Process up to `limit` work items this invocation. Group writes by row so a
    // row touched in multiple langs in this batch is written once at the end.
    const slice = work.slice(offset, offset + limit);
    const pending: Record<string, Row> = {};   // id -> row (mutated translations)
    let done = 0;
    const errors: any[] = [];

    for (const item of slice) {
      try {
        const source: Partial<Record<Field, string>> = {};
        item.need.forEach(f => { source[f] = item.row.src[f]; });
        const out = await translateFields(apiKey, item.lang, source);
        const merged = { ...(item.row.translations?.[item.lang] || {}) };
        item.need.forEach(f => { if (out[f]) merged[f] = out[f]; });
        item.row.translations = { ...(item.row.translations || {}), [item.lang]: merged };
        pending[item.row.table + ":" + item.row.id] = item.row;
        done++;
      } catch (e) {
        errors.push({ table: item.row.table, id: item.row.id, lang: item.lang, error: String(e) });
      }
    }

    // Persist mutated rows.
    for (const key of Object.keys(pending)) {
      const row = pending[key];
      const { error } = await supabase.from(row.table).update({ translations: row.translations }).eq("id", row.id);
      if (error) errors.push({ table: row.table, id: row.id, error: error.message });
    }

    return new Response(JSON.stringify({
      processedWorkItems: done,
      totalWorkItems: totalRemaining,
      nextOffset: offset + slice.length,
      rowsWritten: Object.keys(pending).length,
      languages, target, fields, overwrite, limit, offset,
      errors,
    }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
