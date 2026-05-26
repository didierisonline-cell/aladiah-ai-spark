import { useNavigate } from 'react-router-dom';

const SCHOOLS = [
  {id:'engineering',name:'School of AI Engineering',icon:'ENG',count:8,
   bg:'linear-gradient(90deg,#0D2E6B,#112966,#0a1f50)',nameColor:'#7AB5FF',
   tagBg:'rgba(74,144,245,0.14)',tagColor:'#4A90F5',tagBorder:'rgba(74,144,245,0.28)',pillBorder:'rgba(74,144,245,0.3)'},
  {id:'business',name:'School of AI Business Transformation',icon:'BIZ',count:8,
   bg:'linear-gradient(90deg,#5C1C08,#4D1807,#3D1106)',nameColor:'#F5895E',
   tagBg:'rgba(240,98,42,0.14)',tagColor:'#F0622A',tagBorder:'rgba(240,98,42,0.28)',pillBorder:'rgba(240,98,42,0.3)'},
  {id:'governance',name:'School of Governance & Risk',icon:'GOV',count:7,
   bg:'linear-gradient(90deg,#4A3000,#3E2800,#321F00)',nameColor:'#F7C53A',
   tagBg:'rgba(245,184,26,0.12)',tagColor:'#F5B81A',tagBorder:'rgba(245,184,26,0.28)',pillBorder:'rgba(245,184,26,0.3)'},
  {id:'humanai',name:'School of Human-AI Experience',icon:'HAI',count:5,
   bg:'linear-gradient(90deg,#053D25,#043120,#031F14)',nameColor:'#5EEAB8',
   tagBg:'rgba(34,201,138,0.12)',tagColor:'#22C98A',tagBorder:'rgba(34,201,138,0.28)',pillBorder:'rgba(34,201,138,0.3)'},
];

const PROGS = [
  {n:1,t:'AI Cloud Engineer',s:'engineering',w:32},
  {n:2,t:'AI Agent Engineer',s:'engineering',w:30},
  {n:3,t:'AI Data Engineer',s:'engineering',w:28},
  {n:4,t:'AI DevOps Engineer',s:'engineering',w:28},
  {n:5,t:'AI Security Engineer',s:'engineering',w:26},
  {n:6,t:'AI MLOps Engineer',s:'engineering',w:28},
  {n:7,t:'AI Solutions Architect',s:'engineering',w:32},
  {n:8,t:'AI Platform Engineer',s:'engineering',w:26},
  {n:9,t:'AI Solutions Consultant',s:'business',w:30},
  {n:10,t:'AI Product Manager',s:'business',w:28},
  {n:11,t:'AI Business Operations',s:'business',w:24},
  {n:12,t:'AI Sales Engineer',s:'business',w:24},
  {n:13,t:'AI Business Analyst',s:'business',w:26},
  {n:14,t:'AI Transformation Manager',s:'business',w:28},
  {n:15,t:'AI Program Manager',s:'business',w:28},
  {n:16,t:'AI Enterprise Architect',s:'business',w:32},
  {n:17,t:'AI Governance Professional',s:'governance',w:26},
  {n:18,t:'Responsible AI Specialist',s:'governance',w:24},
  {n:19,t:'AI Compliance Officer',s:'governance',w:24},
  {n:20,t:'AI Risk Manager',s:'governance',w:24},
  {n:21,t:'AI Auditor',s:'governance',w:22},
  {n:22,t:'AI Policy Designer',s:'governance',w:22},
  {n:23,t:'AI Ethics Specialist',s:'governance',w:20},
  {n:24,t:'AI UX Designer',s:'humanai',w:26},
  {n:25,t:'Conversation Designer',s:'humanai',w:24},
  {n:26,t:'Human-AI Interaction Specialist',s:'humanai',w:24},
  {n:27,t:'AI Workflow Designer',s:'humanai',w:22},
  {n:28,t:'AI Experience Architect',s:'humanai',w:28},
];

const SIMS = [
  {t:'Live Sprint Simulation: Agile Delivery',c:'Scrum Master',d:'2-week sprint',a:'#F0622A',tags:['Jira','Sprint Planning'],cs:false},
  {t:'SAFe PI Planning Simulation',c:'AI Program Manager',d:'3-day intensive',a:'#F0622A',tags:['SAFe','PI Planning'],cs:false},
  {t:'IT Merger: Rogers-Shaw Integration',c:'AI Solutions Architect',d:'4-week project',a:'#4A90F5',tags:['AWS','Architecture'],cs:true},
  {t:'AI Agent Deployment: Enterprise Ops',c:'AI Agent Engineer',d:'3-week project',a:'#4A90F5',tags:['LangGraph','MCP','RAG'],cs:true},
  {t:'AI Governance Audit: Financial Institution',c:'AI Governance Professional',d:'2-week audit',a:'#F5B81A',tags:['EU AI Act','NIST RMF'],cs:true},
  {t:'National AI Literacy Program: Government',c:'AI Transformation Manager',d:'3-week engagement',a:'#F0622A',tags:['Change Mgmt','OKRs'],cs:true},
  {t:'Data Pipeline: Retail AI Platform',c:'AI Data Engineer',d:'3-week build',a:'#4A90F5',tags:['dbt','Snowflake'],cs:true},
  {t:'B2B SaaS AI Product Launch',c:'AI Product Manager',d:'4-week cycle',a:'#F0622A',tags:['PRD','Discovery'],cs:true},
  {t:'Cloud Security Incident Response',c:'AI Security Engineer',d:'2-week exercise',a:'#4A90F5',tags:['Incident Response'],cs:true},
  {t:'Conversation Design: AI Customer Service Bot',c:'Conversation Designer',d:'2-week sprint',a:'#22C98A',tags:['Dialogue Design','NLU'],cs:true},
];

const FL = [
  {t:'Scrum Master Certification Course',d:'8 weeks',a:'#4A90F5'},
  {t:'Project Management Professional',d:'12 weeks',a:'#4A90F5'},
  {t:'AI Tools for Managers',d:'6 weeks',a:'#F0622A'},
  {t:'Cybersecurity Professional',d:'10 weeks',a:'#F0622A'},
  {t:'Solution Architect',d:'12 weeks',a:'#4A90F5'},
  {t:'Data Analytics Professional',d:'8 weeks',a:'#F0622A'},
  {t:'DevOps & Cloud Engineering',d:'10 weeks',a:'#4A90F5'},
  {t:'Business Analysis Professional',d:'8 weeks',a:'#F0622A'},
];

interface Props { progressData?: Record<string,any>; }

const CoursesSection = ({progressData={}}:Props) => {
  const nav = useNavigate();
  const card: React.CSSProperties = {background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.75rem',overflow:'hidden',marginBottom:'1.5rem'};
  const hdr: React.CSSProperties = {display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1.5rem',borderBottom:'1px solid var(--border)'};
  const ttl = (s:string) => ({fontSize:'14px',fontWeight:700,color:'var(--foreground)'} as React.CSSProperties);
  const sub = {fontSize:'12px',color:'var(--muted-foreground)',marginLeft:'4px'} as React.CSSProperties;
  const lnk = {fontSize:'12px',fontWeight:700,color:'hsl(var(--primary))',background:'none',border:'none',cursor:'pointer'} as React.CSSProperties;

  return (
    <div>
      {/* AI WORKFORCE PROGRAMS */}
      <div style={card}>
        <div style={hdr}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={ttl('')}>AI Workforce Programs</span>
            <span style={sub}>- 28 programs - 4 schools - All-Access Pass</span>
          </div>
          <button onClick={()=>nav('/courses')} style={lnk}>Browse All Schools</button>
        </div>
        {SCHOOLS.map(sc=>{
          const progs = PROGS.filter(p=>p.s===sc.id);
          return (
            <div key={sc.id}>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.65rem 1.5rem',background:sc.bg,borderBottom:'1px solid rgba(0,0,0,0.2)',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(255,255,255,0.07),transparent)',pointerEvents:'none'}}/>
                <div style={{width:'32px',height:'32px',borderRadius:'0.55rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:800,flexShrink:0,background:'rgba(0,0,0,0.25)',border:`1px solid ${sc.pillBorder}`,position:'relative',zIndex:1,color:sc.nameColor}}>{sc.icon}</div>
                <span style={{fontSize:'12px',fontWeight:800,textTransform:'uppercase' as const,letterSpacing:'0.5px',color:sc.nameColor,textShadow:'0 1px 8px rgba(0,0,0,0.4)',position:'relative',zIndex:1}}>{sc.name}</span>
                <span style={{marginLeft:'auto',fontSize:'11px',fontWeight:700,padding:'2px 10px',borderRadius:'999px',color:'rgba(255,255,255,0.85)',background:'rgba(0,0,0,0.25)',border:`1px solid ${sc.pillBorder}`,position:'relative',zIndex:1}}>{sc.count} programs</span>
              </div>
              {progs.map(pg=>{
                const pd = progressData[`prog_${pg.n}`]||{};
                const pct = pd.progress||0;
                const cl = pd.completedLessons||0;
                const tl = pd.totalLessons||(pg.w*2);
                return (
                  <div key={pg.n} style={{padding:'1rem 1.5rem 0',borderBottom:'1px solid rgba(255,255,255,0.04)',cursor:'pointer'}} onClick={()=>nav('/courses')}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'0.75rem',minWidth:0}}>
                        <span style={{fontSize:'12px',fontWeight:600,color:'var(--muted-foreground)',flexShrink:0,width:'20px'}}>{pg.n}</span>
                        <span style={{fontSize:'14px',fontWeight:500,color:'var(--foreground)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{pg.t}</span>
                        <span style={{fontSize:'10px',fontWeight:700,padding:'1px 7px',borderRadius:'999px',flexShrink:0,color:sc.tagColor,background:sc.tagBg,border:`1px solid ${sc.tagBorder}`}}>NEW</span>
                      </div>
                      <button style={lnk}>Start</button>
                    </div>
                    <div style={{height:'5px',background:'rgba(240,98,42,0.2)',margin:'0 -1.5rem',overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#F0622A,#F5895E)'}}/>
                    </div>
                    <div style={{fontSize:'11px',color:'var(--muted-foreground)',padding:'0.4rem 0 0.85rem'}}>{pct}% complete - {cl}/{tl} lessons - L100-L700</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ENTERPRISE SIMULATION LAB */}
      <div style={card}>
        <div style={hdr}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={ttl('')}>Enterprise Simulation Lab</span>
            <span style={sub}>- L600 - Unlock at program completion</span>
          </div>
          <span style={{fontSize:'10px',fontWeight:800,color:'#F5B81A'}}>NEW STANDARD</span>
        </div>
        <div style={{padding:'0.75rem 1.5rem',background:'rgba(74,144,245,0.04)',borderBottom:'1px solid var(--border)'}}>
          <p style={{fontSize:'12px',color:'var(--muted-foreground)',lineHeight:1.6,margin:0}}>Every certification has a dedicated enterprise simulation at L600. Complete L100-L500 to unlock.</p>
        </div>
        {SIMS.map((sm,i)=>(
          <div key={i} style={{display:'flex',alignItems:'stretch',borderBottom:'1px solid rgba(255,255,255,0.04)',opacity:sm.cs?0.6:1}}>
            <div style={{width:'4px',background:sm.a,flexShrink:0}}/>
            <div style={{flex:1,padding:'1rem 1.25rem'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.2rem'}}>{sm.t}</div>
              <div style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase' as const,color:'var(--muted-foreground)',marginBottom:'0.5rem'}}>{sm.c} - L600 ENTERPRISE SIMULATION</div>
              <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap' as const,marginBottom:'0.35rem'}}>
                {sm.tags.map(tg=><span key={tg} style={{fontSize:'10px',fontWeight:600,padding:'1px 7px',borderRadius:'0.35rem',background:'var(--muted)',border:'1px solid var(--border)',color:'var(--muted-foreground)'}}>{tg}</span>)}
              </div>
              <div style={{fontSize:'11px',color:'var(--muted-foreground)'}}>{sm.d}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column' as const,alignItems:'center',justifyContent:'center',padding:'1rem',borderLeft:'1px solid rgba(255,255,255,0.08)',minWidth:'110px',gap:'6px'}}>
              {sm.cs
                ? <span style={{fontSize:'9px',fontWeight:800,textTransform:'uppercase' as const,padding:'3px 8px',borderRadius:'999px',background:'rgba(245,184,26,0.12)',color:'#F5B81A',border:'1px solid rgba(245,184,26,0.28)'}}>COMING SOON</span>
                : <span style={{fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'999px',background:'rgba(255,255,255,0.04)',color:'var(--muted-foreground)',border:'1px solid rgba(255,255,255,0.1)'}}>Locked</span>
              }
              <span style={{fontSize:'10px',color:'var(--muted-foreground)',textAlign:'center' as const}}>{sm.cs?'In development':'Complete L100-L500'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FOUNDATION LIBRARY */}
      <div style={card}>
        <div style={hdr}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={ttl('')}>Foundation Library</span>
            <span style={sub}>- Original programs - Aladiah Associate - Always available</span>
          </div>
          <span style={{fontSize:'10px',fontWeight:600,color:'var(--muted-foreground)'}}>8 COURSES</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1px',background:'var(--border)'}}>
          {FL.map((c,i)=>(
            <div key={i} style={{background:'var(--card)',padding:'1.5rem',cursor:'pointer'}} onClick={()=>nav('/courses')}>
              <div style={{width:'42px',height:'42px',borderRadius:'0.65rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',marginBottom:'0.9rem',background:c.a+'22',border:'1px solid '+c.a+'44'}}>{'>'}</div>
              <div style={{fontSize:'13px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.35rem'}}>{c.t}</div>
              <div style={{fontSize:'11px',color:'var(--muted-foreground)',marginBottom:'0.75rem'}}>{c.d} - Online</div>
              <button style={{width:'100%',padding:'0.5rem',borderRadius:'0.45rem',fontSize:'12px',fontWeight:700,color:'#fff',background:c.a,border:'none',cursor:'pointer'}} onClick={e=>{e.stopPropagation();nav('/courses');}}>Start Course</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
