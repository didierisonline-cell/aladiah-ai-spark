import PortalShell from '@/components/portal/PortalShell';
import FlagshipCompletion from '@/components/portal/FlagshipCompletion';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', gold:'#F5B81A', green:'#22C98A', purple:'#A78BFA', orange:'#F0622A',
};

const PLATFORM_EXAMPLES = [
  { name:'AWS',          icon:'☁️', color:'#FF9900' },
  { name:'Google Cloud', icon:'🌐', color:'#4285F4' },
  { name:'Microsoft',    icon:'🪟', color:'#00A4EF' },
  { name:'Coursera',     icon:'📚', color:'#0056D2' },
  { name:'PMI',          icon:'📋', color:'#1A5276'  },
  { name:'Scrum.org',    icon:'🔄', color:'#2E86AB'  },
  { name:'Salesforce',   icon:'☁️', color:'#00A1E0'  },
  { name:'Databricks',   icon:'⚡', color:'#FF3621'  },
  { name:'Anthropic',    icon:'🤖', color:'#C084FC'  },
  { name:'Other',        icon:'🏅', color:'#F5B81A'  },
];

export default function PortalCertifications() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const PLATFORM_EXAMPLES = [
    { name:'AWS',          icon:'☁️', color:'#FF9900' },
    { name:'Google Cloud', icon:'🌐', color:'#4285F4' },
    { name:'Microsoft',    icon:'🪟', color:'#00A4EF' },
    { name:'Coursera',     icon:'📚', color:'#0056D2' },
    { name:'PMI',          icon:'📋', color:'#1A5276'  },
    { name:'Scrum.org',    icon:'🔄', color:'#2E86AB'  },
    { name:'Salesforce',   icon:'☁️', color:'#00A1E0'  },
    { name:'Databricks',   icon:'⚡', color:'#FF3621'  },
    { name:'Anthropic',    icon:'🤖', color:'#C084FC'  },
    { name:t('pcert.other'), icon:'🏅', color:'#F5B81A'  },
  ];

  const FEATURES = [
    { icon:'📤', titleKey:'pcert.f0_title', descKey:'pcert.f0_desc' },
    { icon:'✅', titleKey:'pcert.f1_title', descKey:'pcert.f1_desc' },
    { icon:'👔', titleKey:'pcert.f2_title', descKey:'pcert.f2_desc' },
    { icon:'🌐', titleKey:'pcert.f3_title', descKey:'pcert.f3_desc' },
  ];

  return (
    <PortalShell background={DS.bg}>
        <div style={{ flex: 1, padding: '40px 48px', minHeight: 'calc(100vh - 70px)' }}>

          {/* Page header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 10, color: DS.gold, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
              {t('pcert.label')}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: DS.fg, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
              {t('pcert.title')}
            </h1>
            <p style={{ color: DS.fm, fontSize: 14, margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
              {t('pcert.sub')}
            </p>
          </div>

          {/* Real Aladiah program completion + certificate */}
          <FlagshipCompletion />

          {/* Main placeholder card */}
          <div style={{
            background: 'linear-gradient(135deg,rgba(74,144,245,.08),rgba(167,139,250,.06))',
            border: '2px dashed rgba(74,144,245,.3)',
            borderRadius: 20, padding: '60px 48px',
            textAlign: 'center', marginBottom: 32,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 220, height: 220,
              borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,184,26,.06),transparent 70%)',
              pointerEvents: 'none',
            }}/>
            <div style={{
              position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
              borderRadius: '50%', background: 'radial-gradient(circle,rgba(74,144,245,.06),transparent 70%)',
              pointerEvents: 'none',
            }}/>

            <div style={{
              width: 72, height: 72, borderRadius: 18, margin: '0 auto 20px',
              background: 'rgba(74,144,245,.12)', border: '1px solid rgba(74,144,245,.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30,
            }}>
              📤
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: DS.fg, marginBottom: 8 }}>
              {t('pcert.upload_h')}
            </div>
            <div style={{ fontSize: 13, color: DS.fm, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.6 }}>
              {t('pcert.upload_sub')}
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,184,26,.12)', border: '1px solid rgba(245,184,26,.3)',
              borderRadius: 20, padding: '8px 20px',
              fontSize: 12, fontWeight: 700, color: DS.gold,
              letterSpacing: 1,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: DS.gold, display: 'inline-block', animation: 'pulse 2s infinite' }}/>
              {t('pcert.coming_soon')}
            </div>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14, marginBottom: 36 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: DS.card, border: `1px solid ${DS.border}`,
                borderRadius: 12, padding: '18px 20px',
              }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DS.fg, marginBottom: 6 }}>{t(f.titleKey)}</div>
                <div style={{ fontSize: 12, color: DS.fm, lineHeight: 1.5 }}>{t(f.descKey)}</div>
              </div>
            ))}
          </div>

          {/* Supported platforms */}
          <div style={{
            background: DS.card, border: `1px solid ${DS.border}`,
            borderRadius: 14, padding: '24px 28px',
          }}>
            <div style={{ fontSize: 11, color: DS.fm, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
              {t('pcert.platforms')}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {PLATFORM_EXAMPLES.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 8, padding: '7px 14px',
                  fontSize: 12, color: DS.fm, fontWeight: 500,
                }}>
                  <span style={{ fontSize: 14 }}>{p.icon}</span>
                  {p.name}
                </div>
              ))}
            </div>
          </div>

        </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </PortalShell>
  );
}
