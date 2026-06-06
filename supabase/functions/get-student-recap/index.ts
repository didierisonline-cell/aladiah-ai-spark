// =============================================================================
// get-student-recap — Prof. Didier greeting/recap, Step 1+2 (EDGE FUNCTION)
// =============================================================================
// Read-only aggregation that returns the personalized Prof. Didier briefing for
// the AUTHENTICATED student, as the Option-A contract: the raw buckets the
// briefing derives from PLUS the composed top-level fields (mode, first_message,
// recommendation, since_last_login, …). NO writes, NO voice, NO UI, NO deploy.
// The function only RETURNS first_message — it never starts a voice session.
//
// AUTH: verify_jwt = true (Supabase default; no config.toml block). The caller's
// JWT scopes every read via RLS, so it returns ONLY the caller's own rows
// (profiles / user_progress / student_learning_profiles / student_points) plus
// public course metadata. No service-role key is used.
//
// first_message is composed SERVER-SIDE, TEMPLATE-PER-MODE, in the student's
// preferred_language (en/es/fr templates; English fallback). No LLM call yet —
// LLM warmth (consolidating StudentPortal.generateProfGreeting) comes later,
// inside this same function.
//
// DEPENDENCY: requires the companion migration `prof_didier_recap_columns` to be
// applied first — it reads profiles.onboarding_completed / last_login_at /
// last_prof_didier_briefing_at / prof_didier_voice_muted. Until applied, those
// columns 404 from PostgREST.
//
// DRAFT — reviewable only. Not deployed.
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// -----------------------------------------------------------------------------
// first_message / recommendation templates. Template-only (no LLM). Supported
// languages: en, es, fr — anything else falls back to English. Add languages here.
// -----------------------------------------------------------------------------
type Mode = "onboarding" | "daily_briefing" | "upgrade_coach";

const SUPPORTED_LANGS = new Set(["en", "es", "fr"]);
const pickLang = (l: string | null | undefined): string =>
  l && SUPPORTED_LANGS.has(l) ? l : "en";

const NAME_FALLBACK: Record<string, string> = {
  en: "there",
  es: "estudiante",
  fr: "cher étudiant",
};

const RECOMMENDATION: Record<Mode, Record<string, (course: string) => string>> = {
  onboarding: {
    en: (c) => `Start with Lesson 1 of ${c}.`,
    es: (c) => `Comienza con la Lección 1 de ${c}.`,
    fr: (c) => `Commencez par la Leçon 1 de ${c}.`,
  },
  daily_briefing: {
    en: (c) => `Continue your next lesson in ${c}.`,
    es: (c) => `Continúa con tu próxima lección en ${c}.`,
    fr: (c) => `Poursuivez avec votre prochaine leçon de ${c}.`,
  },
  upgrade_coach: {
    en: (_c) => `Unlock all courses to keep building your skills.`,
    es: (_c) => `Desbloquea todos los cursos para seguir desarrollando tus habilidades.`,
    fr: (_c) => `Débloquez tous les cours pour continuer à développer vos compétences.`,
  },
};

interface MsgVars {
  name: string;
  course: string;
  lessons: number;
  recommendation: string;
}

const FIRST_MESSAGE: Record<Mode, Record<string, (v: MsgVars) => string>> = {
  onboarding: {
    en: (v) =>
      `Congratulations, ${v.name}! You've chosen ${v.course}. I'm Prof. Didier, and I'll guide you through Module 1 — lesson by lesson, all the way to your first chapter quiz. ${v.recommendation} Let's begin.`,
    es: (v) =>
      `¡Felicidades, ${v.name}! Has elegido ${v.course}. Soy el Profesor Didier y te guiaré por el Módulo 1, lección por lección, hasta tu primer examen del capítulo. ${v.recommendation} Empecemos.`,
    fr: (v) =>
      `Félicitations, ${v.name} ! Vous avez choisi ${v.course}. Je suis le Professeur Didier et je vous guiderai à travers le Module 1, leçon par leçon, jusqu'à votre premier quiz. ${v.recommendation} Commençons.`,
  },
  daily_briefing: {
    en: (v) =>
      `Welcome back, ${v.name}! Since your last visit you completed ${v.lessons} lesson${v.lessons === 1 ? "" : "s"}. ${v.recommendation} Let's keep your momentum going.`,
    es: (v) =>
      `¡Bienvenido de nuevo, ${v.name}! Desde tu última visita completaste ${v.lessons} lección${v.lessons === 1 ? "" : "es"}. ${v.recommendation} Sigamos con tu impulso.`,
    fr: (v) =>
      `Bon retour, ${v.name} ! Depuis votre dernière visite, vous avez terminé ${v.lessons} leçon${v.lessons === 1 ? "" : "s"}. ${v.recommendation} Gardons cet élan.`,
  },
  upgrade_coach: {
    en: (v) =>
      `Outstanding work, ${v.name} — you completed Module 1 of ${v.course}. This is where careers are built. ${v.recommendation} Earn your certifications and move toward your next role. I'm with you for the journey ahead.`,
    es: (v) =>
      `Excelente trabajo, ${v.name}: completaste el Módulo 1 de ${v.course}. Aquí es donde se construyen las carreras. ${v.recommendation} Obtén tus certificaciones y avanza hacia tu próximo puesto. Estoy contigo en el camino.`,
    fr: (v) =>
      `Travail remarquable, ${v.name} — vous avez terminé le Module 1 de ${v.course}. C'est ici que se construisent les carrières. ${v.recommendation} Obtenez vos certifications et avancez vers votre prochain poste. Je vous accompagne.`,
  },
};

const composeRecommendation = (mode: Mode, lang: string, course: string): string =>
  (RECOMMENDATION[mode][lang] ?? RECOMMENDATION[mode].en)(course);

const composeFirstMessage = (mode: Mode, lang: string, vars: MsgVars): string =>
  (FIRST_MESSAGE[mode][lang] ?? FIRST_MESSAGE[mode].en)(vars);

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
    if (req.method !== "GET" && req.method !== "POST") {
      return json({ error: "GET or POST only" }, 405);
    }

    // ---- Auth: read the caller from their JWT; scope all reads to them via RLS ----
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Missing Authorization bearer" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !anonKey) {
      return json({ error: "Supabase env not configured" }, 500);
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json({ error: "Invalid or expired session" }, 401);
    const userId = user.id;

    // ---- Profile: name, language, recap-state columns, free-course status ----
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "full_name, preferred_language, tier, free_course_id, free_course_completed, " +
          "onboarding_completed, last_login_at, last_prof_didier_briefing_at, prof_didier_voice_muted",
      )
      .eq("user_id", userId)
      .maybeSingle();

    // ---- Free-course title (public course metadata) ----
    let freeCourseTitle: string | null = null;
    if (profile?.free_course_id) {
      const { data: fc } = await supabase
        .from("courses")
        .select("title")
        .eq("id", profile.free_course_id)
        .maybeSingle();
      freeCourseTitle = fc?.title ?? null;
    }

    // ---- Progress completions (score+quiz_id for since-last-login metrics) ----
    const { data: progressRows } = await supabase
      .from("user_progress")
      .select("completed_at, score, quiz_id")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    type ProgRow = { completed_at: string; score: number | null; quiz_id: string | null };
    const completions = (progressRows ?? []) as ProgRow[];
    const lessonsCompleted = completions.length;

    // Consecutive-day streak ending today (mirrors StudentPortal's computation).
    const streakDays = (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const seen = new Set<string>();
      let s = 0;
      for (const row of completions) {
        const d = new Date(row.completed_at);
        d.setHours(0, 0, 0, 0);
        const key = d.toISOString().slice(0, 10);
        if (seen.has(key)) continue;
        seen.add(key);
        const expected = new Date(today);
        expected.setDate(today.getDate() - s);
        if (d.getTime() === expected.getTime()) s++;
        else break;
      }
      return s;
    })();

    // ---- Competency: PER-PROGRAM learning-profile row (course_id = free_course_id).
    //      Per-program entries carry human-readable `topic` labels (SLUG_LABELS); the
    //      cross-program (course_id IS NULL) row only has raw Axis-2 keys. Skip the
    //      query entirely if the student has no free_course_id (return empty areas). ----
    let weakAreas: unknown[] = [];
    let strongAreas: unknown[] = [];
    if (profile?.free_course_id) {
      const { data: learning } = await supabase
        .from("student_learning_profiles")
        .select("weak_areas, strong_areas")
        .eq("user_id", userId)
        .eq("course_id", profile.free_course_id)
        .maybeSingle();
      weakAreas = (learning?.weak_areas as unknown[]) ?? [];
      strongAreas = (learning?.strong_areas as unknown[]) ?? [];
    }

    // ---- Points (graceful if RLS hides them) ----
    const { data: pointsRows } = await supabase
      .from("student_points")
      .select("points")
      .eq("user_id", userId);
    const totalPoints = (pointsRows ?? []).reduce(
      (sum, r: { points: number | null }) => sum + (r.points ?? 0),
      0,
    );

    // =========================================================================
    // Option-A contract: derive the composed top-level fields from the buckets.
    // =========================================================================
    const language = profile?.preferred_language ?? "en";
    const templateLang = pickLang(language);
    const studentName = profile?.full_name ?? null;
    const displayName = studentName || NAME_FALLBACK[templateLang];
    const courseTitle = freeCourseTitle ?? "your program";

    // mode: upgrade_coach ⇐ free_course_completed; onboarding ⇐ onboarding_completed
    // === false; else daily_briefing.
    const mode: Mode = profile?.free_course_completed
      ? "upgrade_coach"
      : profile?.onboarding_completed === false
        ? "onboarding"
        : "daily_briefing";

    const lastLoginAt = profile?.last_login_at ?? null;
    const isFirstTime = !lastLoginAt;
    const now = new Date();
    const daysSinceLastLogin = lastLoginAt
      ? Math.floor((now.getTime() - new Date(lastLoginAt).getTime()) / 86_400_000)
      : null;

    // since_last_login: activity after the PREVIOUS login (this function is
    // read-only and does not advance last_login_at). Empty for first-timers.
    const sinceRows = lastLoginAt
      ? completions.filter((r) => new Date(r.completed_at) > new Date(lastLoginAt))
      : [];
    const sinceLessonsCompleted = sinceRows.length;
    const quizzesTaken = sinceRows.filter((r) => r.quiz_id != null).length;
    const sinceScores = sinceRows
      .map((r) => r.score)
      .filter((s): s is number => typeof s === "number");
    const bestQuizScore = sinceScores.length ? Math.max(...sinceScores) : null;

    // weak_areas as human labels (the rollup entries carry a `topic` label).
    const weakAreaLabels = (weakAreas as Array<{ topic?: string; competency?: string }>)
      .map((w) => w?.topic ?? w?.competency ?? null)
      .filter((x): x is string => typeof x === "string")
      .slice(0, 3);

    const currentCourse = profile?.free_course_id
      ? { id: profile.free_course_id, title: freeCourseTitle }
      : null;
    // current_lesson needs per-lesson (videos) data that this read does not gather;
    // it stays null until the briefing UI/step wires next-lesson resolution.
    const currentLesson: { id: string; title: string } | null = null;

    const recommendation = composeRecommendation(mode, templateLang, courseTitle);
    const firstMessage = composeFirstMessage(mode, templateLang, {
      name: displayName,
      course: courseTitle,
      lessons: sinceLessonsCompleted,
      recommendation,
    });

    // ---- Response: Option-A composed contract (top level) + raw buckets ----
    return json({
      ok: true,
      userId,

      // ---- composed Option-A contract ----
      mode,
      is_first_time: isFirstTime,
      voice_muted: profile?.prof_didier_voice_muted ?? false,
      student_name: studentName,
      language,
      last_login_at: lastLoginAt,
      days_since_last_login: daysSinceLastLogin,
      last_briefing_at: profile?.last_prof_didier_briefing_at ?? null,
      current_course: currentCourse,
      current_lesson: currentLesson,
      since_last_login: {
        lessons_completed: sinceLessonsCompleted,
        quizzes_taken: quizzesTaken,
        best_quiz_score: bestQuizScore,
        weak_areas: weakAreaLabels,
      },
      recommendation,
      first_message: firstMessage,

      // ---- raw buckets retained (source data; backward-compatible) ----
      student: {
        name: studentName,
        preferredLanguage: language,
        tier: profile?.tier ?? null,
        onboardingCompleted: profile?.onboarding_completed ?? false,
        voiceMuted: profile?.prof_didier_voice_muted ?? false,
        lastLoginAt,
        lastBriefingAt: profile?.last_prof_didier_briefing_at ?? null,
        isReturning: !!lastLoginAt,
      },
      freeCourse: {
        courseId: profile?.free_course_id ?? null,
        title: freeCourseTitle,
        completed: profile?.free_course_completed ?? false,
      },
      progress: {
        lessonsCompleted,
        streakDays,
        totalPoints,
      },
      competency: {
        weakAreas,
        strongAreas,
      },
    });
  } catch (e) {
    console.error("get-student-recap error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return json({ ok: false, error: message }, 500);
  }
});
