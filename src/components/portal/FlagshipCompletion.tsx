import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Student-facing completion + certificate flow for flagship programs.
// Backed by migration 20260621020000_completion_engine.sql:
//   course_completion_status(course) · issue_course_certificate(course) ·
//   capstone_submissions · course_certificates.
// Hybrid completion bar: pass every chapter_end exam + approved capstone -> certificate.

const DS = {
  card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', gold:'#F5B81A', green:'#22C98A',
};

// supabase generated types don't yet include the new tables/RPCs; build is esbuild (no tsc).
const sb = supabase as any;

type Status = {
  exams_total: number; exams_passed: number; exams_complete: boolean;
  capstone_status: string; capstone_approved: boolean;
  certificate_issued: boolean; eligible: boolean;
};
type Course = { id: string; title: string; curriculum_version?: string };
type Cert = { certificate_number: string; competency_snapshot: string[]; credential_name: string; issued_at: string };

export default function FlagshipCompletion() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [certs, setCerts] = useState<Record<string, Cert>>({});
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Record<string, { narrative: string; artifacts: string }>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setErr(null);
    try {
      const { data: cs } = await sb.from('courses')
        .select('id,title,curriculum_version').eq('is_flagship', true);
      const list: Course[] = cs || [];
      setCourses(list);
      const st: Record<string, Status> = {};
      await Promise.all(list.map(async (c) => {
        const { data } = await sb.rpc('course_completion_status', { p_course: c.id });
        if (data && !data.error) st[c.id] = data as Status;
      }));
      setStatus(st);
      const { data: cc } = await sb.from('course_certificates')
        .select('course_id,certificate_number,competency_snapshot,credential_name,issued_at')
        .eq('user_id', user.id);
      const cm: Record<string, Cert> = {};
      (cc || []).forEach((r: any) => { cm[r.course_id] = r; });
      setCerts(cm);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load completion status');
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const submitCapstone = async (courseId: string) => {
    if (!user) return;
    setBusy(courseId); setErr(null);
    try {
      const d = draft[courseId] || { narrative: '', artifacts: '' };
      const artifacts = d.artifacts.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
        const [label, ...rest] = line.split('|');
        return { label: (label || '').trim(), url: rest.join('|').trim() };
      });
      const { error } = await sb.from('capstone_submissions').upsert({
        user_id: user.id, course_id: courseId, narrative: d.narrative,
        artifacts, status: 'submitted', updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' });
      if (error) throw error;
      await load();
    } catch (e: any) { setErr(e?.message || 'Submission failed'); }
    finally { setBusy(null); }
  };

  const claim = async (courseId: string) => {
    setBusy(courseId); setErr(null);
    try {
      const { error } = await sb.rpc('issue_course_certificate', { p_course: courseId });
      if (error) throw error;
      await load();
    } catch (e: any) { setErr(e?.message || 'Could not issue certificate'); }
    finally { setBusy(null); }
  };

  if (loading) return <div style={{ color: DS.fm, padding: '8px 0 24px' }}>Loading your program progress…</div>;
  if (!courses.length) return null;

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontSize: 10, color: DS.gold, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
        YOUR ALADIAH PROGRAM CERTIFICATE
      </div>
      {err && <div style={{ color: '#F0622A', fontSize: 12, marginBottom: 12 }}>{err}</div>}

      {courses.map((c) => {
        const s = status[c.id];
        const cert = certs[c.id];
        if (!s) return null;
        const pct = s.exams_total ? Math.round((s.exams_passed / s.exams_total) * 100) : 0;
        const d = draft[c.id] || { narrative: '', artifacts: '' };

        return (
          <div key={c.id} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: DS.fg, marginBottom: 14 }}>{c.title}</div>

            {/* Exams progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: DS.fm, marginBottom: 6 }}>
              <span>Module exams passed</span>
              <span style={{ color: s.exams_complete ? DS.green : DS.fg, fontWeight: 700 }}>
                {s.exams_passed} / {s.exams_total}
              </span>
            </div>
            <div style={{ height: 8, background: '#0B111E', borderRadius: 6, overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: s.exams_complete ? DS.green : DS.blue }} />
            </div>

            {cert ? (
              <div style={{ border: `1px solid ${DS.green}`, borderRadius: 12, padding: 18, background: 'rgba(34,201,138,0.06)' }}>
                <div style={{ fontSize: 12, color: DS.green, fontWeight: 700, marginBottom: 6 }}>✓ CERTIFICATE ISSUED</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: DS.fg }}>{cert.credential_name}</div>
                <div style={{ fontSize: 12, color: DS.fm, margin: '6px 0' }}>
                  Certificate № <strong style={{ color: DS.fg }}>{cert.certificate_number}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {(cert.competency_snapshot || []).map((slug) => (
                    <span key={slug} style={{ fontSize: 10, color: DS.blue, border: `1px solid ${DS.border}`, borderRadius: 20, padding: '3px 9px' }}>{slug}</span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Capstone */}
                <div style={{ fontSize: 12, color: DS.fm, marginBottom: 6 }}>
                  Capstone status:{' '}
                  <strong style={{ color: s.capstone_approved ? DS.green : DS.gold }}>
                    {s.capstone_status === 'none' ? 'not submitted' : s.capstone_status}
                  </strong>
                </div>

                {!s.capstone_approved && (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      placeholder="Capstone narrative — the transformation recommendation and why it should be funded…"
                      value={d.narrative}
                      onChange={(e) => setDraft({ ...draft, [c.id]: { ...d, narrative: e.target.value } })}
                      style={{ width: '100%', minHeight: 70, background: '#0B111E', border: `1px solid ${DS.border}`, borderRadius: 8, color: DS.fg, padding: 10, fontSize: 13, marginBottom: 8 }}
                    />
                    <textarea
                      placeholder="Portfolio artifacts, one per line:  Label | https://link"
                      value={d.artifacts}
                      onChange={(e) => setDraft({ ...draft, [c.id]: { ...d, artifacts: e.target.value } })}
                      style={{ width: '100%', minHeight: 70, background: '#0B111E', border: `1px solid ${DS.border}`, borderRadius: 8, color: DS.fg, padding: 10, fontSize: 13, marginBottom: 8 }}
                    />
                    <button
                      onClick={() => submitCapstone(c.id)}
                      disabled={busy === c.id}
                      style={{ background: DS.blue, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      {busy === c.id ? 'Saving…' : s.capstone_status === 'none' ? 'Submit capstone for review' : 'Resubmit capstone'}
                    </button>
                    <div style={{ fontSize: 11, color: DS.fm, marginTop: 6 }}>
                      After all module exams pass and your capstone is approved, claim your certificate here.
                    </div>
                  </div>
                )}

                {s.eligible && (
                  <button
                    onClick={() => claim(c.id)}
                    disabled={busy === c.id}
                    style={{ marginTop: 14, background: DS.green, color: '#04231A', border: 'none', borderRadius: 8, padding: '11px 18px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
                  >
                    {busy === c.id ? 'Issuing…' : '🎓 Claim your certificate'}
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
