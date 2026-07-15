import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

const PROGRAMS = {
  engineering: [
    {icon:'☁️',name:'AI Cloud Engineer',desc:'AWS/Azure/GCP · IaC · Kubernetes · Serverless AI',weeks:32},
    {icon:'🤖',name:'AI Agent Engineer',desc:'LLMs · LangGraph · RAG · MCP · Multi-agent systems',weeks:30},
    {icon:'📊',name:'AI Data Engineer',desc:'dbt · Snowflake · Kafka · Feature engineering',weeks:28},
    {icon:'🔧',name:'AI DevOps Engineer',desc:'CI/CD · Docker · GitOps · AI pipeline automation',weeks:28},
    {icon:'🛡️',name:'AI Security Engineer',desc:'Zero trust · AI threat modeling · Red teaming',weeks:26},
    {icon:'🧬',name:'AI MLOps Engineer',desc:'Model serving · Drift detection · Experiment tracking',weeks:28},
    {icon:'🏗️',name:'AI Solutions Architect',desc:'Enterprise AI design · Multi-cloud · Integration',weeks:32},
    {icon:'⚙️',name:'AI Platform Engineer',desc:'Internal developer platforms · AI toolchains',weeks:26},
  ],
  business: [
    {icon:'🧠',name:'AI Solutions Consultant',desc:'Client engagement · RFP · AI strategy delivery',weeks:30},
    {icon:'📱',name:'AI Product Manager',desc:'Roadmapping · AI UX · Metric frameworks',weeks:28},
    {icon:'⚡',name:'AI Business Operations',desc:'Process automation · AI workflow design',weeks:24},
    {icon:'💰',name:'AI Sales Engineer',desc:'Technical sales · POC design · Demo mastery',weeks:24},
    {icon:'📋',name:'AI Business Analyst',desc:'Requirements · Data storytelling · Stakeholders',weeks:26},
    {icon:'🔄',name:'AI Transformation Manager',desc:'Change management · Adoption · OKRs',weeks:28},
    {icon:'🗓️',name:'AI Program Manager',desc:'SAFe · Delivery · Exec reporting',weeks:28},
    {icon:'🏛️',name:'AI Enterprise Architect',desc:'EA frameworks · Capability modeling',weeks:32},
  ],
  governance: [
    {icon:'⚖️',name:'AI Governance Professional',desc:'Frameworks · Committees · AI policy design',weeks:26},
    {icon:'🛡️',name:'Responsible AI',desc:'Bias · Fairness · Explainability · Harm reduction',weeks:24},
    {icon:'📜',name:'AI Compliance',desc:'EU AI Act · NIST RMF · ISO 42001 · GDPR',weeks:24},
    {icon:'⚠️',name:'AI Risk Management',desc:'Risk registers · Controls · Threat modeling',weeks:24},
    {icon:'🔍',name:'AI Auditing',desc:'Technical audits · Third-party assessment',weeks:22},
    {icon:'📝',name:'AI Policy Design',desc:'Policy drafting · Regulatory engagement',weeks:22},
    {icon:'🤝',name:'AI Ethics',desc:'Ethical frameworks · Stakeholder impact',weeks:20},
  ],
  humanai: [
    {icon:'🎨',name:'AI UX Designer',desc:'Human-centered AI · Usability · Interaction patterns',weeks:26},
    {icon:'💬',name:'Conversation Designer',desc:'Dialogue flows · NLU · Chatbot/voice design',weeks:24},
    {icon:'🔬',name:'Human-AI Interaction',desc:'Cognitive load · Trust · Behavior research',weeks:24},
    {icon:'🔄',name:'AI Workflow Designer',desc:'Process redesign for human-AI collaboration',weeks:22},
    {icon:'🏛️',name:'AI Experience Architect',desc:'End-to-end AI journey design at enterprise scale',weeks:28},
  ],
};

export default function Schools() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const SCHOOLS = [
    {
      id:'engineering', num:'01', labelKey:'schools.label_eng', color:DS.blue, colorD:DS.bd, colorB:DS.bb,
      descKey:'schools.eng_desc',
      outcomes: [t('schools.eng_out0'), t('schools.eng_out1'), t('schools.eng_out2')],
      programs: PROGRAMS.engineering,
    },
    {
      id:'business', num:'02', labelKey:'schools.label_biz', color:DS.orange, colorD:DS.od, colorB:DS.ob,
      descKey:'schools.biz_desc',
      outcomes: [t('schools.biz_out0'), t('schools.biz_out1'), t('schools.biz_out2')],
      programs: PROGRAMS.business,
    },
    {
      id:'governance', num:'03', labelKey:'schools.label_gov', color:DS.gold, colorD:DS.gd, colorB:DS.gb,
      descKey:'schools.gov_desc',
      outcomes: [t('schools.gov_out0'), t('schools.gov_out1'), t('schools.gov_out2')],
      programs: PROGRAMS.governance,
    },
    {
      id:'humanai', num:'04', labelKey:'schools.label_hax', color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)',
      descKey:'schools.hax_desc',
      outcomes: [t('schools.hax_out0'), t('schools.hax_out1'), t('schools.hax_out2')],
      programs: PROGRAMS.humanai,
    },
  ];

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(74,144,245,.07) 0%,transparent 65%)', top: -200, right: -100 }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.bd, border: `1px solid ${DS.bb}`, color: DS.blue, marginBottom: '1rem' }}>{t('mvp.schools.badge')}</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>
              {t('schools.h1a')}<br /><span style={{ color: DS.blue }}>{t('schools.h1b')}</span>
            </h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72, marginBottom: '1rem' }}>{t('mvp.schools.sub')}</p>
            <div style={{ display: 'inline-block', fontSize: 12, color: DS.gold, background: DS.gd, border: `1px solid ${DS.gb}`, borderRadius: '.5rem', padding: '.5rem .85rem', lineHeight: 1.6, maxWidth: 560, marginBottom: '2rem' }}>
              {t('mvp.schools.roadmap_note')}
            </div>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {SCHOOLS.map(s => (
                <a key={s.id} href={`#${s.id}`} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: s.id === 'engineering' ? DS.blue : 'transparent', color: s.id === 'engineering' ? '#fff' : DS.fg, border: s.id === 'engineering' ? 'none' : `1px solid ${DS.border}`, textDecoration: 'none', transition: 'all .2s' }}>{t(s.labelKey)}</a>
              ))}
            </div>
          </div>
        </section>

        {/* Schools */}
        {SCHOOLS.map((school, si) => (
          <section key={school.id} id={school.id} style={{ padding: '5rem 0', background: si % 2 === 1 ? 'rgba(24,36,58,.22)' : 'transparent' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>{t('schools.school_label')}{school.num}</div>
                  <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '.45rem', color: school.color }}>{t(school.labelKey)}</h2>
                  <p style={{ fontSize: 14, color: DS.fm, lineHeight: 1.7, marginBottom: '1.5rem' }}>{t(school.descKey)}</p>
                  <div style={{ background: school.colorD, border: `1px solid ${school.colorB}`, borderRadius: '.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: 12, color: school.color, fontWeight: 700, marginBottom: '.5rem' }}>{t('schools.career_outcomes')}</div>
                    <div style={{ fontSize: 12, color: DS.fm }}>{school.outcomes.map((o,i) => <div key={i}>{o}</div>)}</div>
                  </div>
                  <button onClick={() => navigate('/pricing')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: school.color, color: school.id === 'governance' ? '#0B111E' : '#fff', border: 'none', cursor: 'pointer', transition: 'all .2s' }}>{t('schools.explore_btn')}</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {school.programs.map(prog => (
                    <div key={prog.name} onClick={() => navigate('/pricing')} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.5rem', transition: 'all .2s', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = school.colorB; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.border; (e.currentTarget as HTMLElement).style.transform = ''; }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
                        <span style={{ fontSize: 20 }}>{prog.icon}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.05em', color: DS.fm, background: 'rgba(133,150,173,.12)', border: '1px solid rgba(133,150,173,.25)', borderRadius: 999, padding: '2px 8px', textTransform: 'uppercase' as const }}>{t('mvp.schools.coming_soon')}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: DS.fg, marginBottom: '.25rem' }}>{prog.name}</div>
                      <div style={{ fontSize: 11, color: DS.fm, lineHeight: 1.5 }}>{prog.desc}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: school.color, marginTop: '.65rem', letterSpacing: '.5px' }}>{t('schools.level_range')}{prog.weeks}{t('schools.weeks_suffix')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <div style={{ background: DS.card, borderTop: `1px solid ${DS.border}`, borderBottom: `1px solid ${DS.border}`, padding: '4.5rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.85rem' }}>{t('schools.cta_label')}</div>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 800, marginBottom: '.75rem' }}>{t('mvp.schools.cta_h2a')}<br /><span style={{ color: DS.gold }}>{t('schools.cta_price')}</span></h2>
            <p style={{ fontSize: 14, color: DS.fm, maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>{t('mvp.schools.cta_sub')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/pricing')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.gold, color: '#0B111E', border: 'none', cursor: 'pointer' }}>{t('schools.pricing_btn')}</button>
              <button onClick={() => navigate('/auth')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>{t('schools.free_btn')}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
