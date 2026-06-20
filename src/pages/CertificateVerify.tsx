// =============================================================================
// /verify/:code — PUBLIC certificate verification. Anyone (employer, recruiter)
// can confirm an Aladiah credential. Calls the PII-free verify_certificate RPC;
// renders the seal-branded certificate when valid, an honest "not found" panel
// otherwise. Honestly reports when the schema isn't applied yet.
// =============================================================================
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Certificate, { CertificateData, CertificatePrintStyles } from '@/components/Certificate';

type State =
  | { phase: 'loading' }
  | { phase: 'not_installed' }
  | { phase: 'invalid' }
  | { phase: 'valid'; data: CertificateData };

const BG = '#0B111E';

export default function CertificateVerify() {
  const { code } = useParams<{ code: string }>();
  const [state, setState] = useState<State>({ phase: 'loading' });

  useEffect(() => {
    let active = true;
    (async () => {
      if (!code) { setState({ phase: 'invalid' }); return; }
      try {
        const { data, error } = await supabase.rpc('verify_certificate' as any, { p_code: code });
        if (!active) return;
        if (error) {
          const notInstalled = /function|does not exist|not find|schema cache/i.test(error.message || '');
          setState({ phase: notInstalled ? 'not_installed' : 'invalid' });
          return;
        }
        const r = (data as any) || {};
        if (!r.valid) { setState({ phase: 'invalid' }); return; }
        setState({
          phase: 'valid',
          data: {
            holderName: r.holder_name,
            credentialName: r.credential_name,
            courseTitle: r.course_title,
            competencies: Array.isArray(r.competencies) ? r.competencies : [],
            issuedAt: r.issued_at,
            verificationCode: r.verification_code,
          },
        });
      } catch {
        if (active) setState({ phase: 'invalid' });
      }
    })();
    return () => { active = false; };
  }, [code]);

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#EDF2F7', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", padding: '48px 20px' }}>
      <CertificatePrintStyles />
      <div className="cert-noprint" style={{ textAlign: 'center', marginBottom: 28 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/brand/official/official-mark.svg" alt="" width={26} height={26} />
          <span style={{ fontWeight: 800, letterSpacing: 1, color: '#EDF2F7' }}>ALADIAH ACADEMY</span>
        </Link>
        <div style={{ fontSize: 12, color: '#8596AD', marginTop: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
          Credential Verification
        </div>
      </div>

      {state.phase === 'loading' && (
        <p style={{ textAlign: 'center', color: '#8596AD' }}>Verifying credential…</p>
      )}

      {state.phase === 'not_installed' && (
        <Panel
          tone="#F5B81A"
          title="Verification is not available yet"
          body="The certificate service has not been activated on this environment. If you reached this page from a real credential link, please check back shortly."
        />
      )}

      {state.phase === 'invalid' && (
        <Panel
          tone="#F0622A"
          title="No valid certificate found"
          body={`We couldn't verify a certificate for code “${code}”. It may be mistyped, revoked, or not issued by Aladiah Academy.`}
        />
      )}

      {state.phase === 'valid' && (
        <>
          <div className="cert-noprint" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 18 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,201,138,.12)', border: '1px solid rgba(34,201,138,.35)', color: '#22C98A', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontWeight: 700 }}>
              ✓ Verified authentic credential
            </span>
          </div>
          <Certificate data={state.data} />
          <div className="cert-noprint" style={{ textAlign: 'center', marginTop: 22 }}>
            <button onClick={() => window.print()} style={btn}>📄 Print / Save as PDF</button>
          </div>
        </>
      )}
    </div>
  );
}

const btn: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, padding: '10px 20px', borderRadius: 10,
  background: 'rgba(74,144,245,.12)', border: '1px solid rgba(74,144,245,.35)',
  color: '#4A90F5', cursor: 'pointer', fontFamily: 'inherit',
};

function Panel({ tone, title, body }: { tone: string; title: string; body: string }) {
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', background: '#0E1626', border: `1px solid ${tone}40`, borderRadius: 16, padding: '40px 32px' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🔎</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: tone, marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#8596AD', lineHeight: 1.6 }}>{body}</div>
      <Link to="/" className="cert-noprint" style={{ display: 'inline-block', marginTop: 22, fontSize: 13, color: '#4A90F5', textDecoration: 'none' }}>
        ← Back to Aladiah Academy
      </Link>
    </div>
  );
}
