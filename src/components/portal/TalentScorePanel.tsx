
const DIMS = [
  {label:'AI Readiness',pct:94,val:940,col:'linear-gradient(90deg,#F5B81A,#F7D060)',rank:'Top 5%',bc:{bg:'rgba(245,184,26,0.12)',c:'#F5B81A',b:'rgba(245,184,26,0.28)'}},
  {label:'Technical Skills',pct:88,val:880,col:'linear-gradient(90deg,#4A90F5,#7AB5FF)',rank:'Top 12%',bc:{bg:'rgba(74,144,245,0.14)',c:'#4A90F5',b:'rgba(74,144,245,0.28)'}},
  {label:'Delivery',pct:90,val:900,col:'linear-gradient(90deg,#F0622A,#F5895E)',rank:'Top 8%',bc:{bg:'rgba(240,98,42,0.14)',c:'#F0622A',b:'rgba(240,98,42,0.28)'}},
  {label:'Leadership',pct:80,val:800,col:'linear-gradient(90deg,#4A90F5,#7AB5FF)',rank:'Top 20%',bc:{bg:'rgba(74,144,245,0.14)',c:'#4A90F5',b:'rgba(74,144,245,0.28)'}},
  {label:'Communication',pct:85,val:850,col:'linear-gradient(90deg,#22C98A,#5EEAB8)',rank:'Top 15%',bc:{bg:'rgba(34,201,138,0.12)',c:'#22C98A',b:'rgba(34,201,138,0.28)'}},
  {label:'Professionalism',pct:96,val:960,col:'linear-gradient(90deg,#F5B81A,#F7D060)',rank:'Top 3%',bc:{bg:'rgba(245,184,26,0.12)',c:'#F5B81A',b:'rgba(245,184,26,0.28)'}},
  {label:'Innovation',pct:78,val:780,col:'linear-gradient(90deg,#F0622A,#F5895E)',rank:'Top 22%',bc:{bg:'rgba(74,144,245,0.14)',c:'#4A90F5',b:'rgba(74,144,245,0.28)'}},
  {label:'Consulting Aptitude',pct:72,val:720,col:'linear-gradient(90deg,#4A90F5,#7AB5FF)',rank:'Top 28%',bc:{bg:'rgba(74,144,245,0.14)',c:'#4A90F5',b:'rgba(74,144,245,0.28)'}},
  {label:'Teamwork',pct:85,val:850,col:'linear-gradient(90deg,#22C98A,#5EEAB8)',rank:'Top 14%',bc:{bg:'rgba(34,201,138,0.12)',c:'#22C98A',b:'rgba(34,201,138,0.28)'}},
  {label:'Reliability',pct:92,val:920,col:'linear-gradient(90deg,#F5B81A,#F7D060)',rank:'Top 6%',bc:{bg:'rgba(245,184,26,0.12)',c:'#F5B81A',b:'rgba(245,184,26,0.28)'}},
];
const TalentScorePanel = () => (
  <div>
    <div style={{background:'var(--card)',border:'1px solid rgba(245,184,26,0.28)',borderRadius:'0.75rem',padding:'1.75rem',marginBottom:'1.25rem'}}>
      <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:'2rem',alignItems:'center',flexWrap:'wrap' as any}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'5rem',fontWeight:800,color:'#F5B81A',lineHeight:1}}>874</div>
          <div style={{fontSize:'13px',color:'var(--muted-foreground)'}}>/1000</div>
          <span style={{display:'inline-block',marginTop:'0.5rem',fontSize:'11px',fontWeight:700,padding:'3px 12px',borderRadius:'999px',background:'rgba(245,184,26,0.12)',color:'#F5B81A',border:'1px solid rgba(245,184,26,0.28)'}}>Expert Level</span>
        </div>
        <div>
          <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--muted-foreground)',marginBottom:'0.65rem'}}>Score Breakdown — All 10 Dimensions</div>
          {DIMS.map(d=>(
            <div key={d.label} style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}>
              <span style={{fontSize:'12px',color:'var(--muted-foreground)',width:'145px',flexShrink:0}}>{d.label}</span>
              <div style={{flex:1,height:'6px',background:'rgba(255,255,255,0.05)',borderRadius:'3px',overflow:'hidden'}}><div style={{height:'100%',width:`${d.pct}%`,background:d.col,borderRadius:'3px'}}/></div>
              <span style={{fontSize:'11px',fontWeight:700,color:'var(--foreground)',width:'32px',textAlign:'right'}}>{d.val}</span>
              <span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'999px',whiteSpace:'nowrap',background:d.bc.bg,color:d.bc.c,border:`1px solid ${d.bc.b}`}}>{d.rank}</span>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'var(--muted-foreground)',marginBottom:'0.5rem'}}>Global Rank</div>
          <div style={{fontSize:'2rem',fontWeight:800,color:'#22C98A'}}>Top 8%</div>
          <div style={{fontSize:'11px',color:'var(--muted-foreground)'}}>of all Aladiah students</div>
        </div>
      </div>
    </div>
    {/* Certs earned */}
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.5rem',marginBottom:'1.25rem'}}>
      <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span>🏅</span>Certifications Earned</div>
      {[
        {code:'AEX',name:'Aladiah Certified Expert™',spec:'AI Agent Engineer',date:'May 26, 2026',id:'ACE-2026-0047',col:'#F5B81A',bg:'rgba(245,184,26,0.12)',border:'rgba(245,184,26,0.3)'},
        {code:'APR',name:'Aladiah Professional™',spec:'Scrum Master',date:'Mar 12, 2026',id:'APR-2026-0021',col:'#C0C0C0',bg:'rgba(192,192,192,0.1)',border:'rgba(192,192,192,0.3)'},
      ].map(c=>(
        <div key={c.code} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'0.85rem',background:c.bg,border:`1px solid ${c.border}`,borderRadius:'0.65rem',marginBottom:'0.6rem'}}>
          <div style={{width:'40px',height:'40px',borderRadius:'50%',background:c.bg,border:`2px solid ${c.col}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:'11px',fontWeight:800,color:c.col,flexShrink:0}}>{c.code}</div>
          <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:700,color:c.col}}>{c.name}</div><div style={{fontSize:'11px',color:'var(--muted-foreground)'}}>{c.spec} · Verified {c.date} · ID: {c.id}</div></div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {['🔗 Share','📄 Download'].map(b=><button key={b} style={{fontSize:'11px',fontWeight:600,padding:'4px 12px',borderRadius:'0.45rem',background:'transparent',border:'1px solid var(--border)',color:'var(--muted-foreground)',cursor:'pointer'}}>{b}</button>)}
          </div>
        </div>
      ))}
      <div style={{marginTop:'0.75rem',padding:'0.75rem',background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)',borderRadius:'0.45rem',fontSize:'12px',color:'var(--muted-foreground)'}}>
        Next: <strong style={{color:'#4A90F5'}}>Aladiah Master™ (AMS)</strong> — Complete L600 Enterprise Simulation to unlock.
      </div>
    </div>
    {/* Public profile */}
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.5rem'}}>
      <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span>🌐</span>Public Profile Preview</div>
      <div style={{background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.5rem',marginBottom:'1rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.25rem'}}>
          <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'linear-gradient(135deg,#4A90F5,#7AB5FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:700,color:'#fff'}}>D9</div>
          <div><div style={{fontSize:'15px',fontWeight:700,color:'var(--foreground)'}}>D9 · AI Engineer</div><div style={{fontSize:'12px',color:'var(--muted-foreground)'}}>🇩🇴 Dominican Republic · Aladiah Academy Class of 2026</div></div>
          <div style={{marginLeft:'auto',textAlign:'right'}}><div style={{fontSize:'2rem',fontWeight:800,color:'#F5B81A',lineHeight:1}}>874</div><div style={{fontSize:'10px',color:'var(--muted-foreground)'}}>/1000 Talent Score™</div></div>
        </div>
        <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap'}}>
          {[['Aladiah Certified Expert™','rgba(245,184,26,0.12)','#F5B81A','rgba(245,184,26,0.28)'],['AI Agent Engineer','rgba(74,144,245,0.14)','#4A90F5','rgba(74,144,245,0.28)'],['Available Now','rgba(34,201,138,0.12)','#22C98A','rgba(34,201,138,0.28)']].map(([t,bg,c,b])=>(
            <span key={t} style={{fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'999px',background:bg,color:c,border:`1px solid ${b}`}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{display:'flex',gap:'0.65rem'}}>
        {['📤 Share','✏️ Edit','🔗 Copy Link'].map(b=><button key={b} style={{fontSize:'12px',fontWeight:700,padding:'6px 14px',borderRadius:'0.45rem',background:'transparent',border:'1px solid var(--border)',color:'var(--foreground)',cursor:'pointer'}}>{b}</button>)}
      </div>
    </div>
  </div>
);
export default TalentScorePanel;
