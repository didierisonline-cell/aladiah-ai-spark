import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalShell from '@/components/portal/PortalShell';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { displayNameFromEmail, initialsFromEmail } from '@/lib/avatar';

const DS = {
  bg:'#0B111E', card:'#111D30', muted:'#18243A', border:'#1E2D47',
  fg:'#EDF2F7', fm:'#8596AD', fd:'#4A5E7A',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
  r:'.75rem',
};


const COUNTRIES = [
  '🇩🇴 Dominican Republic','🇺🇸 United States','🇨🇦 Canada','🇬🇧 United Kingdom',
  '🇫🇷 France','🇩🇪 Germany','🇪🇸 Spain','🇮🇹 Italy','🇧🇷 Brazil','🇲🇽 Mexico',
  '🇦🇷 Argentina','🇨🇴 Colombia','🇵🇪 Peru','🇻🇪 Venezuela','🇨🇱 Chile',
  '🇨🇲 Cameroon','🇳🇬 Nigeria','🇬🇭 Ghana','🇰🇪 Kenya','🇸🇳 Senegal',
  '🇨🇮 Côte d\'Ivoire','🇪🇹 Ethiopia','🇿🇦 South Africa','🇪🇬 Egypt','🇲🇦 Morocco',
  '🇯🇵 Japan','🇨🇳 China','🇰🇷 South Korea','🇮🇳 India','🇵🇭 Philippines',
  '🇻🇳 Vietnam','🇹🇭 Thailand','🇮🇩 Indonesia','🇦🇺 Australia','🇳🇿 New Zealand',
];

const LANGUAGES = [
  { flag:'🇺🇸', label:'English', code:'en' },
  { flag:'🇪🇸', label:'Español', code:'es' },
  { flag:'🇫🇷', label:'Français', code:'fr' },
  { flag:'🇩🇪', label:'Deutsch', code:'de' },
  { flag:'🇨🇳', label:'中文', code:'zh' },
  { flag:'🇸🇦', label:'العربية', code:'ar' },
  { flag:'🇯🇵', label:'日本語', code:'ja' },
  { flag:'🇧🇷', label:'Português', code:'pt' },
  { flag:'🇮🇳', label:'हिन्दी', code:'hi' },
  { flag:'🇰🇷', label:'한국어', code:'ko' },
  { flag:'🇮🇹', label:'Italiano', code:'it' },
  { flag:'🇷🇺', label:'Русский', code:'ru' },
  { flag:'🇳🇱', label:'Nederlands', code:'nl' },
  { flag:'🇵🇱', label:'Polski', code:'pl' },
  { flag:'🇹🇷', label:'Türkçe', code:'tr' },
  { flag:'🇰🇪', label:'Kiswahili', code:'sw' },
  { flag:'🇻🇳', label:'Tiếng Việt', code:'vi' },
  { flag:'🇹🇭', label:'ภาษาไทย', code:'th' },
  { flag:'🇳🇬', label:'Yorùbá', code:'yo' },
  { flag:'🇳🇬', label:'Hausa', code:'ha' },
  { flag:'🇳🇬', label:'Igbo', code:'ig' },
];

const NOTIFICATIONS_KEYS = [
  { key:'course_reminders', labelKey:'portal.settings.notif_course', subKey:'portal.settings.notif_course_sub', default:true },
  { key:'new_lesson', labelKey:'portal.settings.notif_lesson', subKey:'portal.settings.notif_lesson_sub', default:true },
  { key:'certification', labelKey:'portal.settings.notif_cert', subKey:'portal.settings.notif_cert_sub', default:true },
  { key:'community', labelKey:'portal.settings.notif_community', subKey:'portal.settings.notif_community_sub', default:false },
  { key:'jobs', labelKey:'portal.settings.notif_jobs', subKey:'portal.settings.notif_jobs_sub', default:true },
  { key:'weekly_email', labelKey:'portal.settings.notif_email', subKey:'portal.settings.notif_email_sub', default:true },
];

// Toggle switch component
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <div onClick={onChange} style={{
    width:44, height:24, borderRadius:999, cursor:'pointer',
    background: on ? DS.blue : DS.muted,
    border: `1px solid ${on ? DS.blue : DS.border}`,
    position:'relative', flexShrink:0, transition:'all .2s',
  }}>
    <div style={{
      width:18, height:18, borderRadius:'50%', background:'#fff',
      position:'absolute', top:2,
      left: on ? 22 : 3,
      transition:'left .2s',
      boxShadow:'0 1px 4px rgba(0,0,0,.3)',
    }}/>
  </div>
);

// Form input style
const inputStyle: React.CSSProperties = {
  width:'100%', background:DS.muted, border:`1px solid ${DS.border}`,
  borderRadius:'.5rem', padding:'.65rem .9rem', color:DS.fg,
  fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", fontSize:13,
  outline:'none', boxSizing:'border-box',
};

const labelStyle: React.CSSProperties = {
  display:'block', fontSize:10, fontWeight:700, letterSpacing:1,
  textTransform:'uppercase', color:DS.fm, marginBottom:'.38rem',
};

const cardStyle: React.CSSProperties = {
  background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r,
  padding:'1.5rem', marginBottom:'1rem',
};

const sectionTitle = (label: string): React.CSSProperties => ({
  fontSize:13, fontWeight:700, color:DS.fg,
  marginBottom:'1rem', paddingBottom:'.65rem',
  borderBottom:`1px solid ${DS.border}`,
});

export default function PortalSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const initials = initialsFromEmail(user?.email, user?.user_metadata?.full_name);
  const displayName = displayNameFromEmail(user?.email, user?.user_metadata?.full_name);

  // Form state
  const [name, setName] = useState(displayName);
  const [country, setCountry] = useState('🇩🇴 Dominican Republic');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [selectedLang, setSelectedLang] = useState(language || 'en');
  const [notifications, setNotifications] = useState<Record<string,boolean>>(
    Object.fromEntries(NOTIFICATIONS_KEYS.map(n => [n.key, n.default]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');

  // Days remaining (mock — {daysRemaining} {t('portal.settings.days')})
  const daysRemaining = 31;
  const cyclePercent = Math.round((daysRemaining / 30) * 100);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { full_name: name } });
      setSaved('profile');
      setTimeout(() => setSaved(''), 2000);
    } catch {}
    setSaving(false);
  };

  const handleSaveLang = () => {
    setLanguage(selectedLang as any);
    setSaved('lang');
    setTimeout(() => setSaved(''), 2000);
  };

  const handleLogout = () => {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (key) localStorage.removeItem(key);
    navigate('/');
    supabase.auth.signOut().catch(() => {});
  };

  const handleUpgradeAnnual = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/create-checkout', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_PRICE_ANNUAL || import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR,
          email: user.email, tier:'t2', userId: user.id,
          successUrl:`${window.location.origin}/portal?payment=success`,
          cancelUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
  };

  const handleBillingHistory = () => {
    window.open('https://billing.stripe.com/p/login/test_eVq9AL0OuaMWazPgo41VK00', '_blank');
  };


  return (
    <PortalShell background={DS.bg}>

        {/* ── Main ── */}
        <main style={{ padding:'2rem', background:DS.bg, overflowY:'auto' }}>
          <div style={{ marginBottom:'1.75rem' }}>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, margin:0 }}>{t('portal.settings.title')}</h1>
            <div style={{ fontSize:13, color:DS.fm, marginTop:'.2rem' }}>{t('portal.settings.subtitle')}</div>
          </div>

          {/* 2-col grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', alignItems:'start' }}>

            {/* ── LEFT COLUMN ── */}
            <div>
              {/* Profile */}
              <div style={cardStyle}>
                <div style={sectionTitle('👤 Profile')}>👤 Profile</div>

                <div style={{ marginBottom:'1rem' }}>
                  <label style={labelStyle}>Display Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = DS.blue}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = DS.border} />
                </div>

                <div style={{ marginBottom:'1rem' }}>
                  <label style={labelStyle}>Email</label>
                  <input value={user?.email || ''} readOnly
                    style={{ ...inputStyle, opacity:.7, cursor:'not-allowed' }} />
                </div>

                <div style={{ marginBottom:'1rem' }}>
                  <label style={labelStyle}>Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)}
                    style={{ ...inputStyle, appearance:'none', cursor:'pointer' }}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom:'1rem' }}>
                  <label style={labelStyle}>LinkedIn Profile URL</label>
                  <input value={linkedin} onChange={e => setLinkedin(e.target.value)}
                    type="url" placeholder="https://linkedin.com/in/..."
                    style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = DS.blue}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = DS.border} />
                </div>

                <div style={{ marginBottom:'1.25rem' }}>
                  <label style={labelStyle}>GitHub Username</label>
                  <input value={github} onChange={e => setGithub(e.target.value)}
                    placeholder="yourusername" style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = DS.blue}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = DS.border} />
                </div>

                <button onClick={handleSaveProfile} disabled={saving}
                  style={{ fontSize:13, fontWeight:700, padding:'.55rem 1.25rem', borderRadius:'.5rem', background:DS.blue, color:'#fff', border:'none', cursor:'pointer', transition:'all .2s' }}>
                  {saved === 'profile' ? '✓ Saved!' : saving ? t('portal.settings.saving') : t('portal.settings.save_profile')}
                </button>
              </div>

              {/* Language & Region */}
              <div style={cardStyle}>
                <div style={sectionTitle('🌐 Language & Region')}>🌐 Language & Region</div>
                <div style={{ marginBottom:'1.25rem' }}>
                  <label style={labelStyle}>Portal Language</label>
                  <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)}
                    style={{ ...inputStyle, appearance:'none', cursor:'pointer' }}>
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSaveLang}
                  style={{ fontSize:13, fontWeight:700, padding:'.55rem 1.25rem', borderRadius:'.5rem', background:DS.blue, color:'#fff', border:'none', cursor:'pointer' }}>
                  {saved === 'lang' ? '✓ Saved!' : t('portal.settings.save_pref')}
                </button>
              </div>

              {/* Notifications */}
              <div style={cardStyle}>
                <div style={sectionTitle('🔔 Notifications')}>🔔 Notifications</div>
                <div style={{ display:'flex', flexDirection:'column' as const }}>
                  {NOTIFICATIONS_KEYS.map((notif, i) => (
                    <div key={notif.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.65rem 0', borderBottom: i < NOTIFICATIONS_KEYS.length-1 ? `1px solid rgba(255,255,255,.04)` : 'none' }}>
                      <div>
                        <div style={{ fontSize:13, color:DS.fg, fontWeight:500 }}>{t(notif.labelKey)}</div>
                        <div style={{ fontSize:11, color:DS.fm, marginTop:2 }}>{t(notif.subKey)}</div>
                      </div>
                      <Toggle
                        on={notifications[notif.key]}
                        onChange={() => setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div>
              {/* Subscription */}
              <div style={{ ...cardStyle, borderTop:`2px solid ${DS.gold}` }}>
                <div style={sectionTitle('💳 Subscription')}>💳 Subscription</div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:DS.gold }}>Aladiah All-Access Pass™</div>
                    <div style={{ fontSize:12, color:DS.fm }}>$99.99/month · Renews June 26, 2026</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:999, background:DS.grd, color:DS.green, border:'1px solid rgba(34,201,138,.28)' }}>Active</span>
                </div>

                {/* Days remaining bar */}
                <div style={{ background:DS.muted, border:`1px solid ${DS.border}`, borderRadius:'.45rem', padding:'.85rem', marginBottom:'1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                    <span style={{ color:DS.fm }}>{t('portal.settings.days_remaining')}</span>
                    <span style={{ color:DS.fg, fontWeight:600 }}>{daysRemaining} days</span>
                  </div>
                  <div style={{ height:5, background:'rgba(255,255,255,.06)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${cyclePercent}%`, background:`linear-gradient(90deg,${DS.orange},#F5895E)`, borderRadius:3 }}/>
                  </div>
                </div>

                {/* Subscription buttons */}
                <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' as const }}>
                  <button onClick={handleUpgradeAnnual}
                    style={{ fontSize:12, fontWeight:700, padding:'.5rem 1rem', borderRadius:'.5rem', background:DS.gold, color:'#0B111E', border:'none', cursor:'pointer' }}>
                    {t('portal.settings.upgrade_annual')}
                  </button>
                  <button onClick={handleBillingHistory}
                    style={{ fontSize:12, fontWeight:600, padding:'.5rem 1rem', borderRadius:'.5rem', background:'transparent', color:DS.fg, border:`1px solid ${DS.border}`, cursor:'pointer' }}>
                    {t('portal.settings.billing')}
                  </button>
                  <button style={{ fontSize:12, fontWeight:600, padding:'.5rem 1rem', borderRadius:'.5rem', background:'transparent', color:DS.orange, border:`1px solid ${DS.ob}`, cursor:'pointer' }}>
                    {t('portal.settings.cancel')}
                  </button>
                </div>
              </div>

              {/* Account Actions */}
              <div style={{ ...cardStyle, borderColor:'rgba(240,98,42,.25)' }}>
                <div style={{ fontSize:13, fontWeight:700, color:DS.orange, marginBottom:'1rem', paddingBottom:'.65rem', borderBottom:'1px solid rgba(240,98,42,.2)' }}>⚠️ Account Actions</div>
                <div style={{ display:'flex', flexDirection:'column' as const, gap:'.5rem' }}>
                  {[
                    { icon:'📤', label:'Export My Data', action: () => alert('Data export coming soon'), danger:false },
                    { icon:'🔑', label:'Change Password', action: async () => { if (user?.email) await supabase.auth.resetPasswordForEmail(user.email); alert('Password reset email sent!'); }, danger:false },
                    { icon:'🗑️', label:'Delete Account', action: () => { if (window.confirm('Are you sure? This cannot be undone.')) handleLogout(); }, danger:true },
                  ].map(btn => (
                    <button key={btn.label} onClick={btn.action}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:'.65rem', padding:'.75rem 1rem', borderRadius:'.5rem', background:'rgba(255,255,255,.02)', border:`1px solid ${btn.danger ? DS.ob : DS.border}`, color: btn.danger ? DS.orange : DS.fg, fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'left', transition:'all .15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.05)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.02)'}>
                      <span>{btn.icon}</span> {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign out */}
              <div style={{ marginTop:'.25rem' }}>
                <button onClick={handleLogout}
                  style={{ width:'100%', padding:'.65rem', borderRadius:'.5rem', background:'transparent', color:DS.fm, border:`1px solid ${DS.border}`, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  {t('portal.settings.sign_out')}
                </button>
              </div>
            </div>
          </div>
        </main>
    </PortalShell>
  );
}
