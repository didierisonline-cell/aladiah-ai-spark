
import { useLanguage } from '@/contexts/LanguageContext';

const PortalCareerPanel = () => {
  const { t } = useLanguage();
  return (
  <div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem',marginBottom:'1.25rem'}}>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderTop:'2px solid #4A90F5',borderRadius:'0.75rem',padding:'1.5rem'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span>🎯</span>{t('cpanel.career_title')}</div>
        <p style={{fontSize:'12px',color:'var(--muted-foreground)',lineHeight:1.6,marginBottom:'1rem'}}>{t('cpanel.career_sub')}</p>
        {[{role:'AI Agent Engineer',salary:'$130–200K/yr',market:'High demand globally',fit:'strong',c:'#4A90F5'},{role:'AI Solutions Consultant',salary:'$110–160K/yr',market:'Growing fast LATAM+Africa',fit:'strong',c:'#4A90F5'},{role:'AI Transformation Manager',salary:'$130–190K/yr',market:'Enterprise-led demand',fit:'good',c:'#F0622A'}].map(r=>(
          <div key={r.role} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem',border:'1px solid var(--border)',borderRadius:'0.45rem',marginBottom:'0.5rem',background:'rgba(74,144,245,0.04)'}}>
            <div><div style={{fontSize:'13px',fontWeight:700,color:'var(--foreground)'}}>{r.role}</div><div style={{fontSize:'11px',color:'var(--muted-foreground)'}}>{r.salary} · {r.market}</div></div>
            <span style={{fontSize:'10px',fontWeight:700,padding:'3px 9px',borderRadius:'999px',background:r.c+'1a',color:r.c,border:`1px solid ${r.c}44`,whiteSpace:'nowrap'}}>{r.fit==='strong'?t('cpanel.strong_fit'):t('cpanel.good_fit')}</span>
          </div>
        ))}
      </div>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderTop:'2px solid #F0622A',borderRadius:'0.75rem',padding:'1.5rem'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span>📊</span>{t('cpanel.skill_title')}</div>
        <p style={{fontSize:'12px',color:'var(--muted-foreground)',lineHeight:1.6,marginBottom:'1rem'}}>{t('cpanel.skill_sub')}</p>
        {[{s:'LangGraph / Agent Frameworks',p:45,col:'linear-gradient(90deg,#F0622A,#F5895E)',st:'in_progress'},{s:'RAG Systems',p:0,col:'linear-gradient(90deg,#4A90F5,#7AB5FF)',st:'not_started'},{s:'MCP Protocol',p:0,col:'linear-gradient(90deg,#4A90F5,#7AB5FF)',st:'not_started'},{s:'Python Advanced',p:72,col:'linear-gradient(90deg,#22C98A,#5EEAB8)',st:'good'},{s:'AWS Bedrock',p:0,col:'linear-gradient(90deg,#4A90F5,#7AB5FF)',st:'not_started'}].map(x=>(
          <div key={x.s} style={{marginBottom:'0.75rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',marginBottom:'3px'}}><span style={{color:'var(--foreground)',fontWeight:500}}>{x.s}</span><span style={{color:x.p>0?'#22C98A':'var(--muted-foreground)'}}>{x.st==='in_progress'?t('cpanel.in_progress'):x.st==='not_started'?t('cpanel.not_started'):x.st}</span></div>
            <div style={{height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',width:`${x.p}%`,background:x.col}}/></div>
          </div>
        ))}
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem',marginBottom:'1.25rem'}}>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.5rem'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span>🎤</span>{t('cpanel.interview_title')}</div>
        <p style={{fontSize:'12px',color:'var(--muted-foreground)',lineHeight:1.6,marginBottom:'1rem'}}>{t('cpanel.interview_sub')}</p>
        {['🤖 AI Agent Engineer Interview (30 min)','💼 Consulting Behavioral Interview (45 min)','🏗️ System Design Interview (60 min)'].map((b,i)=>(
          <button key={i} style={{width:'100%',textAlign:'left',background:i===0?'rgba(74,144,245,0.06)':'var(--muted)',border:`1px solid ${i===0?'rgba(74,144,245,0.28)':'var(--border)'}`,borderRadius:'0.45rem',padding:'0.65rem 0.9rem',color:i===0?'var(--foreground)':'var(--muted-foreground)',fontFamily:'inherit',fontSize:'12px',cursor:'pointer',marginBottom:'0.45rem',display:'block'}}>{b}</button>
        ))}
        <button style={{width:'100%',padding:'0.6rem',borderRadius:'0.45rem',fontSize:'12px',fontWeight:700,color:'#fff',background:'#4A90F5',border:'none',cursor:'pointer',marginTop:'0.35rem'}}>{t('cpanel.launch_btn')}</button>
      </div>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.5rem'}}>
        <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span>📄</span>{t('cpanel.resume_title')}</div>
        <p style={{fontSize:'12px',color:'var(--muted-foreground)',lineHeight:1.6,marginBottom:'1rem'}}>{t('cpanel.resume_sub')}</p>
        <div style={{background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'0.45rem',padding:'1rem',marginBottom:'1rem'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.25rem'}}>{t('cpanel.resume_preview')}</div>
          <div style={{fontSize:'10px',color:'var(--muted-foreground)',lineHeight:1.7}}>D9 · AI Engineer<br/>Aladiah Academy Class 2026<br/>Talent Score: 874/1000 · Expert Level<br/>Certs: AEX, APR · Skills: LangGraph, RAG, MCP...</div>
        </div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <button style={{flex:1,padding:'0.5rem',borderRadius:'0.45rem',fontSize:'12px',fontWeight:700,color:'#fff',background:'#4A90F5',border:'none',cursor:'pointer'}}>{t('cpanel.pdf_btn')}</button>
          <button style={{flex:1,padding:'0.5rem',borderRadius:'0.45rem',fontSize:'12px',fontWeight:700,color:'var(--foreground)',background:'transparent',border:'1px solid var(--border)',cursor:'pointer'}}>{t('cpanel.linkedin_btn')}</button>
        </div>
      </div>
    </div>
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.5rem'}}>
      <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span>💰</span>{t('cpanel.salary_title')}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[{v:'$130–200K',m:'United States',n:'USD · Remote-friendly',c:'#F5B81A'},{v:'€80–130K',m:'Germany / EU',n:'EUR · High demand',c:'#4A90F5'},{v:'$18–45K',m:'Dominican Republic',n:'USD · Growing fast',c:'#F0622A'},{v:'$12–35K',m:'Nigeria / Ghana',n:'USD · Emerging market',c:'#22C98A'}].map(s=>(
          <div key={s.m} style={{background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1rem',textAlign:'center'}}>
            <div style={{fontSize:'1.3rem',fontWeight:800,color:s.c,lineHeight:1,marginBottom:'3px'}}>{s.v}</div>
            <div style={{fontSize:'11px',color:'var(--muted-foreground)',marginBottom:'2px'}}>{s.m}</div>
            <div style={{fontSize:'10px',color:'#4A5E7A'}}>{s.n}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};
export default PortalCareerPanel;
