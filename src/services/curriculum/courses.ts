// =============================================================================
// Course resolution for FOUNDER surfaces — includes published programs AND
// flagship master curricula (is_flagship). Defensive: if is_flagship isn't
// applied yet, that query is skipped and only published courses are returned.
// Student-facing pages (PortalCourses) deliberately keep is_published only.
// =============================================================================
import { db } from '@/services/aos/_internal';

export const FLAGSHIP_V2_NAME = 'AI Scrum Master Professional Certification v2';

export interface ManagedCourse { id: string; title: string; is_flagship?: boolean }

/** Published programs + flagship master curricula, de-duped. */
export async function listManagedCourses(): Promise<ManagedCourse[]> {
  const out = new Map<string, ManagedCourse>();
  try {
    const { data } = await db.from('courses').select('id, title').eq('is_published', true).order('title');
    (data ?? []).forEach((c: any) => out.set(c.id, c));
  } catch { /* ignore */ }
  try {
    const { data } = await db.from('courses').select('id, title, is_flagship').eq('is_flagship', true);
    (data ?? []).forEach((c: any) => out.set(c.id, { ...c, is_flagship: true }));
  } catch { /* is_flagship column not applied yet */ }
  return [...out.values()];
}
