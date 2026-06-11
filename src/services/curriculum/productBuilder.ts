// =============================================================================
// Product Builder — auto-generates DRAFT curriculum assets into the content
// tables, tied to a program's real Supabase modules (chapters). Founder reviews,
// edits, and publishes via the Authoring Center; the Curriculum Excellence
// Dashboard then measures it. For the flagship (AI Scrum Master) it pulls richer
// text from the reference code curriculum. Everything lands as status='draft'.
// =============================================================================
import { db } from '@/services/aos/_internal';
import { AI_SCRUM_MASTER_CURRICULUM as FLAG } from '@/services/agents/curriculum/programs/aiScrumMasterFull';
import { AssetType, metaFor } from './contentStore';

const base = (courseId: string, author: string, extra: Record<string, any>) => ({
  course_id: courseId, author, status: 'draft', is_published: false, version: 1,
  completion_pct: 60, readiness_score: 60, ...extra,
});

export async function generateAssets(courseId: string, courseTitle: string, type: AssetType, author: string): Promise<{ created: number; error?: string }> {
  const isFlag = /scrum master/i.test(courseTitle);
  let chaps: any[] = [];
  try {
    const { data } = await db.from('chapters').select('id, title, order_index').eq('course_id', courseId).order('order_index');
    chaps = data ?? [];
  } catch { /* ignore */ }

  const rows: Record<string, any>[] = [];
  const flagAt = (i: number) => (isFlag ? FLAG[i] : undefined);

  if (type === 'simulations') {
    chaps.forEach((ch, i) => {
      (['beginner', 'intermediate', 'advanced'] as const).forEach((level) => {
        const f = flagAt(i)?.simulations?.[level];
        rows.push(base(courseId, author, {
          chapter_id: ch.id, level, order_index: i,
          title: f?.title ? `${f.title}` : `${ch.title} — ${level} simulation`,
          scenario: f ? { company: f.company, conflict: f.conflict, decisionPoints: f.decisionPoints } : {},
        }));
      });
    });
  } else if (type === 'portfolios') {
    chaps.forEach((ch, i) => rows.push(base(courseId, author, {
      chapter_id: ch.id, order_index: i,
      title: `${ch.title} — portfolio`, deliverable: flagAt(i)?.portfolioDeliverable ?? `${ch.title} deliverable`,
    })));
  } else if (type === 'interview') {
    chaps.forEach((ch, i) => rows.push(base(courseId, author, {
      chapter_id: ch.id, order_index: i, kind: 'behavioral',
      title: `${ch.title} — interview prep`,
      questions: flagAt(i)?.interviewPrep ? [...(flagAt(i)!.interviewPrep.behavioral || []), ...(flagAt(i)!.interviewPrep.scenario || [])] : [],
    })));
  } else if (type === 'mentor') {
    chaps.forEach((ch, i) => rows.push(base(courseId, author, {
      chapter_id: ch.id, order_index: i,
      title: `${ch.title} — AI mentor`, prompt: flagAt(i)?.aiMentorActivities?.[0] ?? `Coach the student through ${ch.title}.`,
      activity: flagAt(i)?.aiMentorActivities?.join(' · ') ?? '',
    })));
  } else if (type === 'capstones') {
    rows.push(base(courseId, author, { title: `${courseTitle} Capstone`, brief: `Integrate every competency from ${courseTitle} into one capstone deliverable.` }));
  } else if (type === 'certifications') {
    rows.push(base(courseId, author, { credential_name: `${courseTitle} Professional Certification`, passing_score: 85, exam_blueprint: {}, completion_logic: {} }));
  }

  if (!rows.length) return { created: 0, error: type !== 'capstones' && type !== 'certifications' ? 'No modules (chapters) found for this program — add modules first.' : undefined };
  try {
    const { error } = await db.from(metaFor(type).table).insert(rows);
    if (error) throw error;
    return { created: rows.length };
  } catch (e: any) {
    return { created: 0, error: e?.message || 'Generate failed (is the migration applied?)' };
  }
}
