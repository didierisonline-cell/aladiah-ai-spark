// =============================================================================
// <Certificate /> — the seal-branded credential surface, shared by the public
// verification page (/verify/:code) and the student portal. Pure presentation:
// it renders whatever issued snapshot it is handed (holder, program, competency
// list, issue date, verification code). No data fetching, no claims of its own.
//
// Printable: wrap is tagged `.cert-printable`; <CertificatePrintStyles/> isolates
// it for print/PDF (browser "Save as PDF"). The official seal is the brand seal
// from the vault (public/brand/official/official-seal.svg).
// =============================================================================

const C = {
  ink: '#0B111E', panel: '#0E1626', line: '#1E2D47', fg: '#EDF2F7', fm: '#8596AD',
  gold: '#F5B81A', blue: '#4A90F5',
};

export interface CertificateData {
  holderName?: string | null;
  credentialName: string;
  courseTitle?: string | null;
  competencies: string[];
  issuedAt: string;            // ISO timestamp
  verificationCode: string;
  overallScore?: number | null;
}

/** Humanize a competency slug for display (e.g. "scrum-fundamentals" → "Scrum Fundamentals"). */
function prettyCompetency(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function CertificatePrintStyles() {
  return (
    <style>{`
      @media print {
        body * { visibility: hidden !important; }
        .cert-printable, .cert-printable * { visibility: visible !important; }
        .cert-printable { position: absolute !important; inset: 0 !important; margin: 0 !important;
          box-shadow: none !important; border-radius: 0 !important; }
        .cert-noprint { display: none !important; }
      }
    `}</style>
  );
}

export default function Certificate({ data }: { data: CertificateData }) {
  const verifyUrl =
    (typeof window !== 'undefined' ? window.location.origin : 'https://aladiahacademy.com') +
    '/verify/' + data.verificationCode;

  return (
    <div
      className="cert-printable"
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${C.panel}, ${C.ink})`,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        padding: '44px 48px 36px',
        maxWidth: 820,
        margin: '0 auto',
        color: C.fg,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* gold corner glows */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,184,26,.10), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -90, left: -90, width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,144,245,.10), transparent 70%)', pointerEvents: 'none' }} />

      {/* gold rule frame */}
      <div style={{ position: 'absolute', inset: 12, border: `1px solid rgba(245,184,26,.22)`, borderRadius: 12, pointerEvents: 'none' }} />

      {/* header: seal + academy */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <img
          src="/brand/official/official-seal.svg"
          alt="Aladiah Academy seal"
          width={96}
          height={96}
          style={{ filter: 'drop-shadow(0 0 18px rgba(245,184,26,.4))', marginBottom: 14 }}
        />
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.gold, fontWeight: 700, textTransform: 'uppercase' }}>
          Aladiah Academy
        </div>
        <div style={{ fontSize: 10, letterSpacing: 2, color: C.fm, marginTop: 4, textTransform: 'uppercase' }}>
          Intelligence • Purpose • Impact
        </div>
      </div>

      {/* body */}
      <div style={{ position: 'relative', textAlign: 'center', marginTop: 26 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.fm, textTransform: 'uppercase' }}>
          This certifies that
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: C.fg, margin: '10px 0 4px', letterSpacing: '-0.5px' }}>
          {data.holderName?.trim() || 'Aladiah Learner'}
        </div>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.fm, textTransform: 'uppercase', margin: '14px 0 8px' }}>
          has earned the credential
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>
          {data.credentialName}
        </div>
        {data.courseTitle ? (
          <div style={{ fontSize: 13, color: C.fm, marginTop: 6 }}>{data.courseTitle}</div>
        ) : null}
      </div>

      {/* competencies */}
      {data.competencies?.length ? (
        <div style={{ position: 'relative', marginTop: 26 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.fm, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
            Demonstrated competencies
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {data.competencies.map((c) => (
              <span key={c} style={{
                fontSize: 12, fontWeight: 600, color: C.fg,
                background: 'rgba(74,144,245,.10)', border: `1px solid rgba(74,144,245,.28)`,
                borderRadius: 20, padding: '6px 14px',
              }}>
                {prettyCompetency(c)}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* footer: date / verification */}
      <div style={{
        position: 'relative', marginTop: 30, paddingTop: 18, borderTop: `1px solid ${C.line}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.fm, textTransform: 'uppercase' }}>Issued</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.fg }}>{formatDate(data.issuedAt)}</div>
          {typeof data.overallScore === 'number' ? (
            <div style={{ fontSize: 11, color: C.fm, marginTop: 2 }}>Overall score: {data.overallScore}%</div>
          ) : null}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.fm, textTransform: 'uppercase' }}>Verification</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, fontFamily: 'monospace', letterSpacing: 1 }}>
            {data.verificationCode}
          </div>
          <div style={{ fontSize: 10, color: C.fm, marginTop: 2 }}>{verifyUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
    </div>
  );
}
