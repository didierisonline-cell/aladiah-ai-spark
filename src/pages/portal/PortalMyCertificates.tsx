// =============================================================================
// /portal/certificates — the student's Aladiah-ISSUED credentials (distinct from
// /portal/certifications, which is the external-cert upload vault). Reads the
// owner-scoped certificates table (RLS), opens a full seal-branded certificate,
// and offers a verify link. Honest empty / not-yet-available states — no fake
// or placeholder certificates are ever shown.
// =============================================================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalShell from '@/components/portal/PortalShell';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Certificate, { CertificateData, CertificatePrintStyles } from '@/components/Certificate';

const DS = { bg: '#0B111E', card: '#111D30', border: '#1E2D47', fg: '#EDF2F7', fm: '#8596AD', gold: '#F5B81A', blue: '#4A90F5', green: '#22C98A' };

interface Row {
  id: string;
  credential_name: string;
  competencies: string[];
  overall_score: number | null;
  holder_name: string | null;
  verification_code: string;
  status: string;
  issued_at: string;
  course_id: string;
  courses?: { title: string | null } | null;
}

type Load =
  | { phase: 'loading' }
  | { phase: 'not_installed' }
  | { phase: 'error'; msg: string }
  | { phase: 'ready'; rows: Row[] };

export default function PortalMyCertificates() {
  const { user } = useAuth();
  const [load, setLoad] = useState<Load>({ phase: 'loading' });
  const [open, setOpen] = useState<Row | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('certificates' as any)
        .select('id,credential_name,competencies,overall_score,holder_name,verification_code,status,issued_at,course_id, courses(title)')
        .eq('user_id', user.id)
        .eq('status', 'issued')
        .order('issued_at', { ascending: false });
      if (!active) return;
      if (error) {
        const notInstalled = /relation|does not exist|not find|schema cache/i.test(error.message || '');
        setLoad(notInstalled ? { phase: 'not_installed' } : { phase: 'error', msg: error.message });
        return;
      }
      setLoad({ phase: 'ready', rows: (data as any as Row[]) || [] });
    })();
    return () => { active = false; };
  }, [user?.id]);

  const toCertData = (r: Row): CertificateData => ({
    holderName: r.holder_name,
    credentialName: r.credential_name,
    courseTitle: r.courses?.title ?? null,
    competencies: Array.isArray(r.competencies) ? r.competencies : [],
    issuedAt: r.issued_at,
    verificationCode: r.verification_code,
    overallScore: r.overall_score,
  });

  const copyVerify = (code: string) => {
    const url = window.location.origin + '/verify/' + code;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 1800);
    }).catch(() => {});
  };

  return (
    <PortalShell background={DS.bg}>
      <div style={{ flex: 1, padding: '40px 48px', minHeight: 'calc(100vh - 70px)' }}>
        <CertificatePrintStyles />

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: DS.gold, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>ALADIAH CREDENTIALS</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: DS.fg, margin: '0 0 10px', letterSpacing: '-0.5px' }}>My Certificates</h1>
          <p style={{ color: DS.fm, fontSize: 14, margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
            Credentials you've earned at Aladiah Academy. Each one is independently verifiable by employers via its verification code.
          </p>
        </div>

        {load.phase === 'loading' && <p style={{ color: DS.fm }}>Loading your certificates…</p>}

        {load.phase === 'not_installed' && (
          <EmptyCard
            icon="🎓"
            title="Certificates are coming online"
            body="The credential service is being activated. Once live, every Aladiah certificate you earn will appear here, ready to share and verify."
          />
        )}

        {load.phase === 'error' && (
          <EmptyCard icon="⚠️" title="Couldn't load certificates" body={load.msg} tone="#F0622A" />
        )}

        {load.phase === 'ready' && load.rows.length === 0 && (
          <EmptyCard
            icon="🎓"
            title="No certificates yet"
            body="You haven't earned a certificate yet. Complete every chapter quiz in a course to earn its credential — it will appear here automatically."
            cta={{ label: 'Go to My Academy →', to: '/portal/courses' }}
          />
        )}

        {load.phase === 'ready' && load.rows.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
            {load.rows.map((r) => (
              <div key={r.id} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: 14, padding: '22px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <img src="/brand/official/official-seal.svg" alt="" width={42} height={42} style={{ filter: 'drop-shadow(0 0 10px rgba(245,184,26,.35))' }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: DS.gold, lineHeight: 1.25 }}>{r.credential_name}</div>
                    {r.courses?.title ? <div style={{ fontSize: 12, color: DS.fm }}>{r.courses.title}</div> : null}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: DS.fm, marginBottom: 4 }}>
                  Issued {new Date(r.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 12, color: DS.fm, fontFamily: 'monospace', marginBottom: 16 }}>
                  {r.verification_code}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => setOpen(r)} style={btn(DS.blue)}>Open</button>
                  <button onClick={() => copyVerify(r.verification_code)} style={btn(DS.fm)}>
                    {copied === r.verification_code ? '✓ Link copied' : '🔗 Copy verify link'}
                  </button>
                  <Link to={`/verify/${r.verification_code}`} style={{ ...btn(DS.fm), textDecoration: 'none', display: 'inline-block' }}>
                    Verify page ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate viewer modal */}
      {open && (
        <div onClick={() => setOpen(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,15,.78)', zIndex: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 860 }}>
            <div className="cert-noprint" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 10 }}>
              <button onClick={() => window.print()} style={btn(DS.blue)}>📄 Print / PDF</button>
              <button onClick={() => setOpen(null)} style={btn(DS.fm)}>✕ Close</button>
            </div>
            <Certificate data={toCertData(open)} />
          </div>
        </div>
      )}
    </PortalShell>
  );
}

const btn = (color: string): React.CSSProperties => ({
  fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 9,
  background: 'transparent', border: `1px solid ${color}55`, color, cursor: 'pointer', fontFamily: 'inherit',
});

function EmptyCard({ icon, title, body, cta, tone = '#4A90F5' }: { icon: string; title: string; body: string; cta?: { label: string; to: string }; tone?: string }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,rgba(74,144,245,.06),rgba(245,184,26,.04))', border: `2px dashed ${tone}40`, borderRadius: 18, padding: '54px 40px', textAlign: 'center', maxWidth: 620 }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 19, fontWeight: 800, color: '#EDF2F7', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#8596AD', lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>{body}</div>
      {cta ? (
        <Link to={cta.to} style={{ display: 'inline-block', marginTop: 22, fontSize: 13, fontWeight: 700, color: '#4A90F5', textDecoration: 'none' }}>{cta.label}</Link>
      ) : null}
    </div>
  );
}
