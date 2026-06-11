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
    // Idempotency — never duplicate, never touch the live course.
    const { data: existing } = await db.from('courses').select('id').eq('title', FLAGSHIP_V2_NAME).limit(1);
    if (existing && existing.length) return { ok: false, error: 'Flagship v2 already exists — delete it first to rebuild.' };

    // 1) Course (unpublished + flagship → invisible to students, visible to founder dashboards)
    const { data: course, error: cErr } = await db.from('courses')
      .insert({ title: FLAGSHIP_V2_NAME, description: 'Authoritative master curriculum — 18 modules, full asset coverage. Reference model for all programs.', is_published: false, is_flagship: true })
      .select('id').single();
    if (cErr || !course) return { ok: false, error: cErr?.message || 'Course insert failed (is_flagship migration applied?)' };
    const courseId = course.id as string;

    // 2) 18 modules
    const chapterRows = FLAG.map((m, i) => ({ course_id: courseId, title: `Module ${m.no}: ${m.title}`, order_index: i, description: m.phase }));
    const { data: chapters, error: chErr } = await db.from('chapters').insert(chapterRows).select('id, order_index');
    if (chErr || !chapters) return { ok: false, error: chErr?.message || 'Chapters insert failed', courseId };
    const byIdx = new Map<number, string>((chapters as any[]).map((c) => [c.order_index, c.id]));

    // 3) 162 lessons + 18 quizzes
    const videoRows: any[] = [];
    const quizRows: any[] = [];
    FLAG.forEach((m, i) => {
      const chId = byIdx.get(i);
      if (!chId) return;
      lessonTitles(m).forEach((t, k) => videoRows.push({ chapter_id: chId, title: t, order_index: k, video_url: '' }));
      quizRows.push({ chapter_id: chId, quiz_type: 'chapter_end' });
    });
    const { error: vErr } = await db.from('videos').insert(videoRows);
    if (vErr) return { ok: false, error: `Lessons insert failed: ${vErr.message}`, courseId };
    const { error: qErr } = await db.from('quizzes').insert(quizRows);
    if (qErr) return { ok: false, error: `Quizzes insert failed: ${qErr.message}`, courseId };

    // 4) Draft all assets (sims/portfolios/interview/mentor/capstone/cert)
    const gen = await generateAllAssets(courseId, FLAGSHIP_V2_NAME, author);
    await logAudit('build_flagship_v2', 'simulations', null, courseId, author, { modules: chapterRows.length, lessons: videoRows.length, quizzes: quizRows.length, assets: gen.total });

    return { ok: true, courseId, modules: chapterRows.length, lessons: videoRows.length, quizzes: quizRows.length, assets: gen.total, byType: gen.byType };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Build failed' };
  }
}
