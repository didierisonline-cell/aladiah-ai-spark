import { useEffect, useState, useCallback } from 'react';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';

// Founder capstone review queue. Approving a submission is the gate that lets the
// student claim their certificate (issue_course_certificate checks status='approved').
// Backed by 20260621020000_completion_engine.sql (capstone_submissions, admin RLS).

const sb = supabase as any;
const DS = { card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD', blue:'#4A90F5', gold:'#F5B81A', green:'#22C98A', red:'#F0622A' };

type Sub = {
  id: string; user_id: string; course_id: string; narrative: string | null;
  artifacts: { label: string; url: string }[]; status: string; submitted_at: string;
  courses?: { title: string };
};

export default function CapstoneReview() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      const { data, error } = await sb.from('capstone_submissions')
        .select('id,user_id,course_id,narrative,artifacts,status,submitted_at,courses(title)')
        .order('submitted_at', { ascending: true });
      if (error) throw error;
      setSubs(data || []);
    } catch (e: any) { setErr(e?.message || 'Failed to load submissions'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const review = async (id: string, status: 'approved' | 'revisions_requested') => {
    setBusy(id); setErr(null);
    try {
      const { error } = await sb.from('capstone_submissions')
        .update({ status, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      await load();
    } catch (e: any) { setErr(e?.message || 'Update failed'); }
    finally { setBusy(null); }
  };

  const pending = subs.filter((s) => s.status === 'submitted');
  const decided = subs.filter((s) => s.status !== 'submitted');

  const Row = ({ s }: { s: Sub }) => (
    <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: 12, padding: 18, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 800, color: DS.fg, fontSize: 15 }}>{s.courses?.title || 'Program'}</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: s.status === 'approved' ? DS.green : s.status === 'revisions_requested' ? DS.gold : DS.blue }}>
          {s.status}
        </span>
      </div>
      <div style={{ fontSize: 11, color: DS.fm, marginBottom: 8 }}>student {s.user_id.slice(0, 8)}… · submitted {new Date(s.submitted_at).toLocaleDateString()}</div>
      {s.narrative && <div style={{ fontSize: 13, color: DS.fg, lineHeight: 1.5, marginBottom: 10, whiteSpace: 'pre-wrap' }}>{s.narrative}</div>}
      {(s.artifacts || []).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {s.artifacts.map((a, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: DS.fm }}>{a.label || 'artifact'}:</span>{' '}
              {a.url ? <a href={a.url} target="_blank" rel="noreferrer" style={{ color: DS.blue }}>{a.url}</a> : <span style={{ color: DS.fm }}>—</span>}
            </div>
          ))}
        </div>
      )}
      {s.status === 'submitted' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => review(s.id, 'approved')} disabled={busy === s.id}
            style={{ background: DS.green, color: '#04231A', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            {busy === s.id ? '…' : 'Approve'}
          </button>
          <button onClick={() => review(s.id, 'revisions_requested')} disabled={busy === s.id}
            style={{ background: 'transparent', color: DS.gold, border: `1px solid ${DS.gold}`, borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Request revisions
          </button>
        </div>
      )}
    </div>
  );

  return (
    <FounderShell>
      <div style={{ padding: '40px 48px' }}>
        <div style={{ fontSize: 10, color: DS.gold, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>CREDENTIAL GATE</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: DS.fg, margin: '0 0 6px' }}>Capstone Review</h1>
        <p style={{ color: DS.fm, fontSize: 14, margin: '0 0 28px', maxWidth: 560, lineHeight: 1.6 }}>
          Approving a capstone lets the student claim their certificate (they must also have passed every module exam).
        </p>
        {err && <div style={{ color: DS.red, fontSize: 13, marginBottom: 14 }}>{err}</div>}
        {loading ? <div style={{ color: DS.fm }}>Loading…</div> : (
          <>
            <div style={{ fontSize: 12, color: DS.fm, fontWeight: 700, marginBottom: 10 }}>PENDING ({pending.length})</div>
            {pending.length ? pending.map((s) => <Row key={s.id} s={s} />) : <div style={{ color: DS.fm, fontSize: 13, marginBottom: 24 }}>No capstones awaiting review.</div>}
            {decided.length > 0 && <>
              <div style={{ fontSize: 12, color: DS.fm, fontWeight: 700, margin: '24px 0 10px' }}>DECIDED ({decided.length})</div>
              {decided.map((s) => <Row key={s.id} s={s} />)}
            </>}
          </>
        )}
      </div>
    </FounderShell>
  );
}
