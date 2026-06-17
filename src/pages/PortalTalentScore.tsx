import { useNavigate } from 'react-router-dom';
import PortalShell from '@/components/portal/PortalShell';
import { useAuth } from '@/hooks/useAuth';
import { useTalentScore } from '@/hooks/useTalentScore';
import { useIdentity } from '@/hooks/useIdentity';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};


export default function PortalTalentScore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initials } = useIdentity();
  const { t } = useLanguage();
  const pathname = '/portal/talent-score';

  // Single source of truth — same hook/formula the dashboard uses.
  const { overall, max, dimensions } = useTalentScore(user?.id);
  const C = 2 * Math.PI * 60; // ring circumference (r=60)
  const filled = max > 0 ? (overall / max) * C : 0;

  return (
    <PortalShell background={DS.bg}>
        {/* Main */}
        <main style={{ padding: '2rem', background: DS.bg }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: DS.fm, marginBottom: '.25rem' }}>{t('ts.label')}</div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('ts.title')}</h1>
            <div style={{ fontSize: 13, color: DS.fm, marginTop: '.2rem' }}>{t('ts.sub')}</div>
          </div>

          {/* Score Display */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '2rem', textAlign: 'center' as const }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.fm, marginBottom: '1rem' }}>{t('ts.overall')}</div>
              {/* Ring */}
              <div style={{ position: 'relative' as const, width: 140, height: 140, margin: '0 auto 1rem' }}>
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="12"/>
                  <circle cx="70" cy="70" r="60" fill="none" stroke={DS.gold} strokeWidth="12" strokeDasharray={`${filled} ${C}`} strokeLinecap="round"/>
                </svg>
                <div style={{ position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: DS.gold, lineHeight: 1 }}>{overall}</div>
                  <div style={{ fontSize: 9, color: DS.fm, letterSpacing: .5 }}>/ {max}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: DS.fm, lineHeight: 1.5 }}>{t('ts.empty')}</div>
            </div>
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.5rem' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1.25rem' }}>{t('ts.breakdown')}</div>
              {dimensions.map(d => (
                <div key={d.label} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
                    <span style={{ fontSize: 12, color: DS.fm }}>{t(d.labelKey)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.score} / {d.max}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(d.score/d.max)*100}%`, background: d.color, borderRadius: 3 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to improve */}
          <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.5rem', borderLeft: `3px solid ${DS.blue}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1rem' }}>{t('ts.improve')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon:'📚', actionKey:'ts.action0', pointsKey:'ts.pts0', color:DS.blue },
                { icon:'✅', actionKey:'ts.action1', pointsKey:'ts.pts1', color:DS.green },
                { icon:'🏅', actionKey:'ts.action2', pointsKey:'ts.pts2', color:DS.gold },
                { icon:'🏢', actionKey:'ts.action3', pointsKey:'ts.pts3', color:DS.orange },
              ].map(item => (
                <div key={item.actionKey} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '1rem', background: 'rgba(255,255,255,.03)', border: `1px solid ${DS.border}`, borderRadius: '.5rem' }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t(item.actionKey)}</div>
                    <div style={{ fontSize: 11, color: item.color, fontWeight: 600 }}>{t(item.pointsKey)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => navigate('/portal/courses')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.blue, color: '#fff', border: 'none', cursor: 'pointer' }}>{t('ts.start_btn')}</button>
            </div>
          </div>
        </main>
    </PortalShell>
  );
}
