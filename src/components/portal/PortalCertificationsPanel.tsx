
const PortalCertificationsPanel = () => (
  <div>
    <div style={{marginBottom:'1.5rem'}}>
      <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--muted-foreground)',marginBottom:'0.75rem'}}>✅ Earned</div>
      {[{code:'AEX',name:'Aladiah Certified Expert™',spec:'AI Agent Engineer',date:'May 26, 2026',id:'ACE-2026-0047',col:'#F5B81A',bg:'rgba(245,184,26,0.12)',bdr:'rgba(245,184,26,0.3)'},{code:'APR',name:'Aladiah Professional™',spec:'Scrum Master',date:'Mar 12, 2026',id:'APR-2026-0021',col:'#C0C0C0',bg:'rgba(192,192,192,0.1)',bdr:'rgba(192,192,192,0.3)'}].map(c=>(
        <div key={c.code} style={{display:'grid',gridTemplateColumns:'56px 1fr auto',gap:'1.25rem',alignItems:'center',background:'var(--card)',border:`1px solid ${c.bdr}`,borderRadius:'0.75rem',padding:'1.25rem 1.5rem',marginBottom:'0.6rem'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:c.bg,border:`2px solid ${c.col}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:'11px',fontWeight:800,color:c.col}}>{c.code}</div>
          <div><div style={{fontSize:'14px',fontWeight:700,color:c.col}}>{c.name}</div><div style={{fontSize:'12px',color:'var(--muted-foreground)'}}>{c.spec} · Verified {c.date} · ID: {c.id}</div></div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {['🔗 Share','📄 Download'].map(b=><button key={b} style={{fontSize:'11px',fontWeight:600,padding:'5px 12px',borderRadius:'0.45rem',background:'transparent',border:'1px solid var(--border)',color:'var(--muted-foreground)',cursor:'pointer'}}>{b}</button>)}
          </div>
        </div>
      ))}
    </div>
    <div style={{marginBottom:'1.5rem'}}>
      <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--muted-foreground)',marginBottom:'0.75rem'}}>🔄 In Progress</div>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.5rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'rgba(245,184,26,0.1)',border:'2px dashed #F5B81A',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:'11px',fontWeight:800,color:'#F5B81A',flexShrink:0}}>AMS</div>
          <div><div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)'}}>Aladiah Master™</div><div style={{fontSize:'12px',color:'var(--muted-foreground)'}}>L600 Enterprise Simulation required · Oral defense · Peer evaluation</div></div>
        </div>
        <div style={{marginBottom:'0.75rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'var(--muted-foreground)',marginBottom:'4px'}}><span>Requirements progress</span><span>60%</span></div>
          <div style={{height:'5px',background:'rgba(255,255,255,0.06)',borderRadius:'3px',overflow:'hidden'}}><div style={{height:'100%',width:'60%',background:'linear-gradient(90deg,#F0622A,#F5895E)'}}/></div>
        </div>
        {[{r:'Complete L600 Enterprise Simulation',d:false},{r:'Submit capstone with oral defense',d:false},{r:'3 peer evaluation scores of 80%+',d:false},{r:'Aladiah Expert (AEX) — verified',d:true},{r:'Minimum Talent Score of 750',d:true}].map((x,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'12px',color:x.d?'#22C98A':'var(--muted-foreground)',padding:'0.25rem 0'}}><span>{x.d?'✅':'⬜'}</span>{x.r}</div>
        ))}
      </div>
    </div>
    <div>
      <div style={{fontSize:'10px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--muted-foreground)',marginBottom:'0.75rem'}}>🔒 Locked — Complete Previous Levels to Unlock</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
        {[{code:'AAR',name:'Architect',req:'Requires Master level'},{code:'AOP',name:'Operator',req:'Production AI deployment'},{code:'AFW',name:'Fellow',req:'Nomination only'}].map(c=>(
          <div key={c.code} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',padding:'1.25rem',opacity:0.5,textAlign:'center'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'50%',margin:'0 auto 0.65rem',background:'rgba(255,255,255,0.04)',border:'2px dashed var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:'10px',fontWeight:800,color:'#4A5E7A'}}>{c.code}</div>
            <div style={{fontSize:'12px',fontWeight:700,color:'var(--muted-foreground)'}}>{c.name}</div>
            <div style={{fontSize:'10px',color:'#4A5E7A',marginTop:'2px'}}>{c.req}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default PortalCertificationsPanel;
