// =============================================================================
// Build AI Scrum Master Professional Certification v2 — the authoritative
// master curriculum, fully separate from the live production course.
// Seeds the reference spec (18 modules + 162 lessons target). LIVE/migration currently seeds 72 lessons — see /founder/truth + FLAGSHIP_SCRUM_READINESS_AUDIT.md.
// curriculum, then drafts all assets. Runs in the founder's browser (RLS admin).
// =============================================================================
import { db } from '@/services/aos/_internal';
import { AI_SCRUM_MASTER_CURRICULUM as FLAG } from '@/services/agents/curriculum/programs/aiScrumMasterFull';
import { generateAllAssets } from './productBuilder';
import { logAudit } from './contentStore';
import { FLAGSHIP_V2_NAME } from './courses';

// 9 lesson titles per module → 162 total. Draws from the module's lessons,
// readings and videos; pads to exactly 9.
function lessonTitles(m: typeof FLAG[number]): string[] {
  const pool = [...m.lessons.map((l) => l.title), ...m.readings, ...m.videos].filter(Boolean);
  return Array.from({ length: 9 }, (_, k) => pool[k] || `${m.title} — Lesson ${k + 1}`);
}

export interface FlagshipResult {
  ok: boolean; error?: string; courseId?: string;
  modules?: number; lessons?: number; quizzes?: number; assets?: number; byType?: Record<string, number>;
}

// Upgrade the v2 flagship to v3: version bump + Enterprise Transformation
// Command Center capstone + the new asset types (labs/executive/co-pilot/
// employer). Idempotent; preserves all existing assets.
export async function upgradeToFlagshipV3(author: string): Promise<FlagshipResult & { upgraded?: boolean }> {
  try {
    const { data: course } = await db.from('courses').select('id').eq('title', FLAGSHIP_V2_NAME).maybeSingle();
    if (!course?.id) return { ok: false, error: 'Build Flagship v2 first.' };
    const courseId = course.id as string;

    try { await db.from('courses').update({ flagship_version: 'v3', curriculum_version: 'v3.0' }).eq('id', courseId); } catch { /* columns */ }

    // Enterprise Agile Transformation Command Center capstone (idempotent by title).
    const capTitle = 'Enterprise Agile Transformation Command Center';
    const { data: capEx } = await db.from('program_capstones').select('id').eq('course_id', courseId).eq('title', capTitle).maybeSingle();
    if (!capEx) {
      await db.from('program_capstones').insert({
        course_id: courseId, title: capTitle, author, status: 'draft', is_published: false, version: 1,
        completion_pct: 60, readiness_score: 60, ai_generated: true,
        project_type: 'enterprise_transformation', business_domain: 'Enterprise Agile', estimated_hours: 90, difficulty_level: 'capstone',
        brief: '90-day enterprise agile transformation: lead 6 teams through a delivery crisis, a quality crisis, and organizational resistance; present outcomes to the board.',
        rubric: { duration_days: 90, teams: 6, stakeholders: ['CEO', 'CTO', 'CPO', 'VP Engineering', 'PMO', 'Board'], crises: ['delivery', 'quality', 'organizational_resistance'], deliverable: 'board_presentation' },
      });
    }

    // Fill all asset types (idempotent — capstone skipped since one now exists;
    // generates labs/executive/co-pilot/employer + any missing of the rest).
    const gen = await generateAllAssets(courseId, FLAGSHIP_V2_NAME, author);
    await logAudit('upgrade_flagship_v3', 'simulations', null, courseId, author, { assets: gen.total, byType: gen.byType });
    return { ok: true, courseId, assets: gen.total, byType: gen.byType, upgraded: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Upgrade failed' };
  }
}

export async function buildFlagshipV2(author: string): Promise<FlagshipResult> {
  try {
    // 1) Course — get-or-create (idempotent; rerun reuses the same flagship course)
    let courseId: string;
    const { data: existing } = await db.from('courses').select('id').eq('title', FLAGSHIP_V2_NAME).maybeSingle();
    if (existing?.id) {
      courseId = existing.id as string;
    } else {
      const { data: course, error: cErr } = await db.from('courses')
        .insert({
          title: FLAGSHIP_V2_NAME,
          description: 'Authoritative master curriculum — 18 modules, full asset coverage. Reference model for all programs.',
          is_published: false, is_flagship: true,
          flagship_version: 'v2', curriculum_version: 'v1.0', launch_status: 'internal', launch_score: 0,
          target_market: 'Agile teams · Scrum Masters · Delivery leads',
          target_salary_low: 95000, target_salary_high: 160000, owner: author,
        })
        .select('id').single();
      if (cErr || !course) return { ok: false, error: cErr?.message || 'Course insert failed (is_flagship migration applied?)' };
      courseId = course.id as string;
    }

    // 2) Modules — seed only if none exist yet (no duplicate chapters on rerun)
    let chapters = ((await db.from('chapters').select('id, order_index').eq('course_id', courseId).order('order_index')).data ?? []) as any[];
    if (chapters.length === 0) {
      const chapterRows = FLAG.map((m, i) => ({ course_id: courseId, title: `Module ${m.no}: ${m.title}`, order_index: i, description: m.phase }));
      const { data: ins, error: chErr } = await db.from('chapters').insert(chapterRows).select('id, order_index');
      if (chErr || !ins) return { ok: false, error: chErr?.message || 'Chapters insert failed', courseId };
      chapters = ins as any[];
    }
    const byIdx = new Map<number, string>(chapters.map((c) => [c.order_index, c.id]));
    const chapIds = chapters.map((c) => c.id);

    // 3) Lessons — seed only if none exist yet
    let lessons = (await db.from('videos').select('id', { count: 'exact', head: true }).in('chapter_id', chapIds)).count ?? 0;
    if (!lessons) {
      const videoRows: any[] = [];
      FLAG.forEach((m, i) => { const chId = byIdx.get(i); if (!chId) return; lessonTitles(m).forEach((t, k) => videoRows.push({ chapter_id: chId, title: t, order_index: k, video_url: '' })); });
      const { error: vErr } = await db.from('videos').insert(videoRows);
      if (vErr) return { ok: false, error: `Lessons insert failed: ${vErr.message}`, courseId };
      lessons = videoRows.length;
    }

    // 4) Quizzes — seed only if none exist yet
    let quizzes = (await db.from('quizzes').select('id', { count: 'exact', head: true }).in('chapter_id', chapIds).eq('quiz_type', 'chapter_end')).count ?? 0;
    if (!quizzes) {
      const quizRows = chapIds.map((id) => ({ chapter_id: id, quiz_type: 'chapter_end' }));
      const { error: qErr } = await db.from('quizzes').insert(quizRows);
      if (qErr) return { ok: false, error: `Quizzes insert failed: ${qErr.message}`, courseId };
      quizzes = quizRows.length;
    }

    // 5) Assets — generation is idempotent (skips existing; fills gaps only)
    const gen = await generateAllAssets(courseId, FLAGSHIP_V2_NAME, author);
    await logAudit('build_flagship_v2', 'simulations', null, courseId, author, { modules: chapters.length, lessons, quizzes, assets: gen.total });

    return { ok: true, courseId, modules: chapters.length, lessons, quizzes, assets: gen.total, byType: gen.byType };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Build failed' };
  }
}
