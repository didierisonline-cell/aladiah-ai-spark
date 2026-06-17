
import { useLanguage } from '@/contexts/LanguageContext';

const PortalPortfolioPanel = () => {
  const { t } = useLanguage();
  return (
  <div>
    <div style={{background:'rgba(245,184,26,0.06)',border:'1px solid rgba(245,184,26,0.28)',borderRadius:'0.75rem',padding:'1rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
      <span style={{fontSize:'20px'}}>🏆</span>
      <div><strong style={{color:'#F5B81A',fontSize:'13px'}}>{t('portpanel.capstone_title')}</strong><br/><span style={{fontSize:'12px',color:'var(--muted-foreground)'}}>{t('portpanel.capstone_sub')}</span></div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem',marginBottom:'1.25rem'}}>
      {[{title:'AI-Powered Sprint Velocity Predictor',course:'AI-Powered Scrum Master Professional Certification',date:'Feb 2026',desc:'ML model predicting sprint velocity based on historical data, team size, and complexity. Deployed as a Jira plugin.',skills:['Python','Scikit-learn','Jira API','FastAPI'],status:'done',col:'#22C98A'},{title:'Customer Service AI Agent',course:'AI Mastery',date:'Mar 2026',desc:'Multi-turn customer service agent using LangGraph with RAG retrieval. 40% ticket deflection in test.',skills:['LangGraph','RAG','Pinecone','OpenAI'],status:'review',col:'#F0622A'},{title:'AI Governance Framework',course:'Capstone Draft',date:'May 2026',desc:'Complete AI governance framework for a fictional financial institution — risk register, policy documents, board presentation.',skills:['EU AI Act','NIST RMF','Risk','Policy'],status:'progress',col:'#4A90F5'}].map(p=>(
        <div key={p.title} style={{background:'var(--card)',border:'1px solid var(--border)',borderTop:`3px solid ${p.col}`,borderRadius:'0.75rem',padding:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
            <div><div style={{fontSize:'13px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.18rem'}}>{p.title}</div><div style={{fontSize:'11px',color:'var(--muted-foreground)'}}>{p.course} · {p.date}</div></div>
            <span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'999px',background:p.col+'1a',color:p.col,border:`1px solid ${p.col}44`,whiteSpace:'nowrap'}}>{p.status==='done'?t('portpanel.done'):p.status==='review'?t('portpanel.review'):t('portpanel.progress')}</span>
          </div>
          <p style={{fontSize:'12px',color:'var(--muted-foreground)',lineHeight:1.6,marginBottom:'0.85rem'}}>{p.desc}</p>
          <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',marginBottom:'0.85rem'}}>
            {p.skills.map(s=><span key={s} style={{fontSize:'10px',fontWeight:600,padding:'2px 7px',borderRadius:'0.35rem',background:'var(--muted)',border:'1px solid var(--border)',color:'var(--muted-foreground)'}}>{s}</span>)}
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button style={{flex:1,padding:'5px',borderRadius:'0.45rem',fontSize:'11px',fontWeight:600,color:'var(--foreground)',background:'transparent',border:'1px solid var(--border)',cursor:'pointer'}}>{t('portpanel.github')}</button>
            <button style={{flex:1,padding:'5px',borderRadius:'0.45rem',fontSize:'11px',fontWeight:600,color:'var(--foreground)',background:'transparent',border:'1px solid var(--border)',cursor:'pointer'}}>{t('portpanel.demo')}</button>
          </div>
        </div>
      ))}
    </div>
    <div style={{background:'var(--card)',border:'1px dashed var(--border)',borderRadius:'0.75rem',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'22px',marginBottom:'0.5rem'}}>➕</div>
      <div style={{fontSize:'13px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.25rem'}}>{t('portpanel.add_title')}</div>
      <div style={{fontSize:'12px',color:'var(--muted-foreground)',marginBottom:'0.85rem'}}>{t('portpanel.add_sub')}</div>
      <button style={{padding:'0.6rem 1.4rem',borderRadius:'0.45rem',fontSize:'12px',fontWeight:700,color:'#fff',background:'#4A90F5',border:'none',cursor:'pointer'}}>{t('portpanel.add_btn')}</button>
    </div>
  </div>
  );
};
export default PortalPortfolioPanel;
