// =============================================================================
// Build AI Scrum Master Professional Certification v2 — the authoritative
// master curriculum, fully separate from the live production course.
// Seeds 18 modules + 162 lessons + 18 quizzes from the reference code
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
