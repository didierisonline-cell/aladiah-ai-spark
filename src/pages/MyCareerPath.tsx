import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PortalShell from '@/components/portal/PortalShell';
import { RESOURCE_TRACKS } from '@/data/resourcesData';

const DS = {
  bg:'#0B111E', card:'#111D30', card2:'#142035', border:'#1E2D47',
  fg:'#EDF2F7', fm:'#8596AD', fd:'#4A5E7A',
  blue:'#4A90F5', orange:'#F0622A', green:'#22C98A', gold:'#F5B81A', purple:'#9B59B6',
};

const SALARY_DATA: Record<string, Record<string, {min:number;max:number;currency:string;symbol:string}>> = {
  'AI Cloud Engineer':{'United States':{min:130000,max:220000,currency:'USD',symbol:'$'},'Canada':{min:110000,max:175000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:85000,max:140000,currency:'GBP',symbol:'£'},'Germany':{min:75000,max:130000,currency:'EUR',symbol:'€'},'France':{min:65000,max:110000,currency:'EUR',symbol:'€'},'Netherlands':{min:75000,max:125000,currency:'EUR',symbol:'€'},'Australia':{min:120000,max:190000,currency:'AUD',symbol:'A$'},'Singapore':{min:90000,max:160000,currency:'SGD',symbol:'S$'},'UAE':{min:180000,max:320000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:1800000,max:3600000,currency:'DOP',symbol:'RD$'}},
  'AI Agent Engineer':{'United States':{min:145000,max:240000,currency:'USD',symbol:'$'},'Canada':{min:115000,max:185000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:90000,max:150000,currency:'GBP',symbol:'£'},'Germany':{min:80000,max:135000,currency:'EUR',symbol:'€'},'France':{min:70000,max:115000,currency:'EUR',symbol:'€'},'Netherlands':{min:80000,max:130000,currency:'EUR',symbol:'€'},'Australia':{min:125000,max:200000,currency:'AUD',symbol:'A$'},'Singapore':{min:95000,max:170000,currency:'SGD',symbol:'S$'},'UAE':{min:200000,max:360000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:2000000,max:4000000,currency:'DOP',symbol:'RD$'}},
  'AI Security Engineer':{'United States':{min:140000,max:230000,currency:'USD',symbol:'$'},'Canada':{min:115000,max:180000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:90000,max:148000,currency:'GBP',symbol:'£'},'Germany':{min:78000,max:132000,currency:'EUR',symbol:'€'},'France':{min:68000,max:112000,currency:'EUR',symbol:'€'},'Netherlands':{min:78000,max:128000,currency:'EUR',symbol:'€'},'Australia':{min:122000,max:195000,currency:'AUD',symbol:'A$'},'Singapore':{min:92000,max:165000,currency:'SGD',symbol:'S$'},'UAE':{min:195000,max:345000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:1900000,max:3800000,currency:'DOP',symbol:'RD$'}},
  'AI MLOps Engineer':{'United States':{min:135000,max:225000,currency:'USD',symbol:'$'},'Canada':{min:112000,max:178000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:88000,max:145000,currency:'GBP',symbol:'£'},'Germany':{min:76000,max:128000,currency:'EUR',symbol:'€'},'France':{min:66000,max:110000,currency:'EUR',symbol:'€'},'Netherlands':{min:76000,max:126000,currency:'EUR',symbol:'€'},'Australia':{min:120000,max:192000,currency:'AUD',symbol:'A$'},'Singapore':{min:90000,max:162000,currency:'SGD',symbol:'S$'},'UAE':{min:190000,max:340000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:1850000,max:3700000,currency:'DOP',symbol:'RD$'}},
  'AI DevOps Engineer':{'United States':{min:128000,max:215000,currency:'USD',symbol:'$'},'Canada':{min:108000,max:172000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:82000,max:138000,currency:'GBP',symbol:'£'},'Germany':{min:73000,max:125000,currency:'EUR',symbol:'€'},'France':{min:63000,max:106000,currency:'EUR',symbol:'€'},'Netherlands':{min:73000,max:122000,currency:'EUR',symbol:'€'},'Australia':{min:118000,max:188000,currency:'AUD',symbol:'A$'},'Singapore':{min:88000,max:158000,currency:'SGD',symbol:'S$'},'UAE':{min:185000,max:330000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:1750000,max:3500000,currency:'DOP',symbol:'RD$'}},
  'AI Data Engineer':{'United States':{min:125000,max:210000,currency:'USD',symbol:'$'},'Canada':{min:105000,max:168000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:80000,max:135000,currency:'GBP',symbol:'£'},'Germany':{min:70000,max:122000,currency:'EUR',symbol:'€'},'France':{min:62000,max:104000,currency:'EUR',symbol:'€'},'Netherlands':{min:72000,max:120000,currency:'EUR',symbol:'€'},'Australia':{min:115000,max:185000,currency:'AUD',symbol:'A$'},'Singapore':{min:85000,max:155000,currency:'SGD',symbol:'S$'},'UAE':{min:180000,max:320000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:1700000,max:3400000,currency:'DOP',symbol:'RD$'}},
  'AI Governance Professional':{'United States':{min:130000,max:210000,currency:'USD',symbol:'$'},'Canada':{min:108000,max:170000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:85000,max:140000,currency:'GBP',symbol:'£'},'Germany':{min:74000,max:126000,currency:'EUR',symbol:'€'},'France':{min:65000,max:108000,currency:'EUR',symbol:'€'},'Netherlands':{min:74000,max:123000,currency:'EUR',symbol:'€'},'Australia':{min:118000,max:188000,currency:'AUD',symbol:'A$'},'Singapore':{min:88000,max:158000,currency:'SGD',symbol:'S$'},'UAE':{min:185000,max:330000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:1800000,max:3500000,currency:'DOP',symbol:'RD$'}},
};

const DEFAULT_SALARY: Record<string,{min:number;max:number;currency:string;symbol:string}> = {
  'United States':{min:120000,max:200000,currency:'USD',symbol:'$'},'Canada':{min:100000,max:165000,currency:'CAD',symbol:'CA$'},'United Kingdom':{min:78000,max:132000,currency:'GBP',symbol:'£'},'Germany':{min:68000,max:118000,currency:'EUR',symbol:'€'},'France':{min:60000,max:100000,currency:'EUR',symbol:'€'},'Netherlands':{min:70000,max:115000,currency:'EUR',symbol:'€'},'Australia':{min:112000,max:180000,currency:'AUD',symbol:'A$'},'Singapore':{min:82000,max:150000,currency:'SGD',symbol:'S$'},'UAE':{min:175000,max:310000,currency:'AED',symbol:'AED'},'Dominican Republic':{min:1600000,max:3200000,currency:'DOP',symbol:'RD$'},
};

const FLAGS: Record<string,string> = {'United States':'🇺🇸','Canada':'🇨🇦','United Kingdom':'🇬🇧','Germany':'🇩🇪','France':'🇫🇷','Netherlands':'🇳🇱','Australia':'🇦🇺','Singapore':'🇸🇬','UAE':'🇦🇪','Dominican Republic':'🇩🇴'};
const COUNTRIES = Object.keys(FLAGS);

const fmt = (n:number, sym:string) => n>=1000000?`${sym}${(n/1000000).toFixed(1)}M`:n>=1000?`${sym}${(n/1000).toFixed(0)}K`:`${sym}${n}`;

const JOB_TITLES: Record<string,string[]> = {
  'AI Cloud Engineer':['AI Cloud Engineer','Cloud Infrastructure Engineer','ML Platform Engineer','Cloud Architect'],
  'AI Agent Engineer':['AI Engineer','LLM Engineer','Generative AI Engineer','AI Application Developer'],
  'AI Security Engineer':['AI Security Engineer','ML Security Researcher','AI Red Team Engineer','LLM Security Specialist'],
  'AI MLOps Engineer':['MLOps Engineer','ML Platform Engineer','ML Infrastructure Engineer','AI Operations Engineer'],
  'AI DevOps Engineer':['AI DevOps Engineer','Platform Engineer','Site Reliability Engineer','DevSecOps Engineer'],
  'AI Data Engineer':['AI Data Engineer','Data Platform Engineer','Feature Engineer','ML Data Engineer'],
  'AI Governance Professional':['AI Governance Lead','Responsible AI Manager','AI Risk Officer','AI Compliance Manager'],
};

const SCHOOL_MAP: Record<string,{color:string;icon:string;school:string}> = {
  '⚙️ AI Engineering':{color:DS.blue,icon:'⚙️',school:'AI Engineering'},
  '💼 AI Business':{color:DS.orange,icon:'💼',school:'AI Business'},
  '⚖️ Governance & Risk':{color:DS.green,icon:'⚖️',school:'Governance & Risk'},
  '🎨 Human-AI Experience':{color:DS.purple,icon:'🎨',school:'Human-AI Experience'},
};

export default function MyCareerPath() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const [courses,setCourses] = useState<any[]>([]);
  const [chapters,setChapters] = useState<any[]>([]);
  const [selectedId,setSelectedId] = useState<string|null>(null);
  const [activeTab,setActiveTab] = useState<'path'|'resources'|'glossary'|'salary'>('path');
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    if(!user) return;
    const saved = localStorage.getItem(`career-path-${user.id}`);
    if(saved) { setSelectedId(saved); loadChapters(saved); }
    supabase.from('courses').select('id,title,description').eq('is_published',true).order('title')
      .then(({data})=>{ if(data) setCourses(data); setLoading(false); });
  },[user]);

  const loadChapters = async (id:string) => {
    const {data} = await supabase.from('chapters').select('id,title,description,order_index').eq('course_id',id).order('order_index');
    setChapters(data||[]);
  };

  const select = (id:string) => {
    setSelectedId(id); setActiveTab('path');
    if(user) localStorage.setItem(`career-path-${user.id}`,id);
    loadChapters(id);
  };

  const course = courses.find(c=>c.id===selectedId);
  const track = RESOURCE_TRACKS.find(t=>t.programs[0]===course?.title);
  const salary = course ? (SALARY_DATA[course.title]||DEFAULT_SALARY) : null;
  const jobs = course ? (JOB_TITLES[course.title]||['AI Professional','AI Specialist']) : [];

  const bySchool: Record<string,any[]> = {};
  courses.forEach(c=>{
    const t = RESOURCE_TRACKS.find(t=>t.programs[0]===c.title);
    const s = t?.school||'⚙️ AI Engineering';
    if(!bySchool[s]) bySchool[s]=[];
    bySchool[s].push({...c,track:t});
  });

  const tabBtn = (id:string,label:string) => (
    <button onClick={()=>setActiveTab(id as any)} style={{padding:'8px 18px',fontSize:12,fontWeight:activeTab===id?700:500,color:activeTab===id?DS.blue:DS.fm,borderBottom:activeTab===id?`2px solid ${DS.blue}`:'2px solid transparent',background:'transparent',border:'none',cursor:'pointer',whiteSpace:'nowrap' as const}}>{label}</button>
  );

  return (
    <PortalShell background={DS.bg}>
        <main style={{padding:'2rem',background:DS.bg,minWidth:0}}>
          <div style={{marginBottom:'1.75rem'}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase' as const,color:DS.fm,marginBottom:'.3rem'}}>CAREER FOCUS</div>
            <h1 style={{fontSize:'1.75rem',fontWeight:800,margin:0}}>My Career Path</h1>
            <p style={{fontSize:13,color:DS.fm,marginTop:'.3rem'}}>Choose your target program. See your full roadmap, resources, glossary, and global salary data — all in one place.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:'1.5rem',alignItems:'start'}}>
            {/* Program list */}
            <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'1rem',overflow:'hidden',position:'sticky' as const,top:90}}>
              <div style={{padding:'1rem 1.25rem',borderBottom:`1px solid ${DS.border}`}}>
                <div style={{fontSize:11,fontWeight:700,color:DS.fg}}>Select your program</div>
                <div style={{fontSize:10,color:DS.fm,marginTop:2}}>28 AI workforce programs</div>
              </div>
              <div style={{maxHeight:'calc(100vh - 220px)',overflowY:'auto' as const,padding:'.5rem 0'}}>
                {loading ? <div style={{padding:'2rem',textAlign:'center' as const,color:DS.fm,fontSize:12}}>Loading...</div> :
                  Object.entries(bySchool).map(([school,list])=>{
                    const sm = SCHOOL_MAP[school]||{color:DS.blue,icon:'📚',school};
                    return <div key={school}>
                      <div style={{padding:'.5rem 1.25rem .25rem',fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase' as const,color:sm.color,opacity:.8}}>{sm.icon} {sm.school}</div>
                      {list.map(c=>{
                        const act = c.id===selectedId;
                        return <button key={c.id} onClick={()=>select(c.id)}
                          style={{width:'100%',textAlign:'left' as const,padding:'.6rem 1.25rem',background:act?`${sm.color}18`:'transparent',border:'none',borderLeft:`3px solid ${act?sm.color:'transparent'}`,cursor:'pointer',transition:'all .15s',display:'flex',alignItems:'center',gap:'.5rem'}}
                          onMouseEnter={e=>{if(!act)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)';}}
                          onMouseLeave={e=>{if(!act)(e.currentTarget as HTMLElement).style.background='transparent';}}>
                          <span style={{fontSize:14,flexShrink:0}}>{c.track?.icon||'📖'}</span>
                          <span style={{fontSize:12,fontWeight:act?700:500,color:act?sm.color:DS.fg,flex:1,lineHeight:1.3}}>{c.title}</span>
                        </button>;
                      })}
                    </div>;
                  })
                }
              </div>
            </div>

            {/* Content */}
            {!course ? (
              <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'1rem',padding:'4rem 2rem',textAlign:'center' as const}}>
                <div style={{fontSize:48,marginBottom:'1rem'}}>🎯</div>
                <div style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'.5rem'}}>Choose your career target</div>
                <div style={{fontSize:13,color:DS.fm,maxWidth:360,margin:'0 auto'}}>Select a program on the left to see your full learning roadmap, salary data, resources, and everything you need to succeed.</div>
              </div>
            ) : (
              <div>
                {/* Hero */}
                <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'1rem',padding:'1.5rem',marginBottom:'1rem'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'1rem'}}>
                    <div style={{fontSize:40,flexShrink:0}}>{track?.icon||'📖'}</div>
                    <div style={{flex:1}}>
                      <h2 style={{fontSize:'1.3rem',fontWeight:800,margin:'0 0 .4rem'}}>{course.title}</h2>
                      <p style={{fontSize:13,color:DS.fm,margin:'0 0 .75rem',lineHeight:1.6}}>{course.description}</p>
                      <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                        <span style={{fontSize:11,padding:'3px 10px',borderRadius:99,background:'rgba(74,144,245,.12)',color:DS.blue,fontWeight:600}}>{chapters.length} modules</span>
                        <span style={{fontSize:11,padding:'3px 10px',borderRadius:99,background:'rgba(245,184,26,.12)',color:DS.gold,fontWeight:600}}>Aladiah Certified™</span>
                        <span style={{fontSize:11,padding:'3px 10px',borderRadius:99,background:'rgba(34,201,138,.12)',color:DS.green,fontWeight:600}}>{track?.school||'AI Engineering'}</span>
                      </div>
                    </div>
                    <button onClick={()=>navigate(`/portal/course/${course.id}`)} style={{padding:'10px 20px',background:DS.blue,border:'none',borderRadius:'.6rem',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap' as const,flexShrink:0}}>Start Learning →</button>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{display:'flex',borderBottom:`1px solid ${DS.border}`,marginBottom:'1.25rem',overflowX:'auto' as const}}>
                  {tabBtn('path','🗺️ Learning Path')}
                  {tabBtn('resources','📖 Resources')}
                  {tabBtn('glossary','📚 Glossary')}
                  {tabBtn('salary','💰 Salary & Jobs')}
                </div>

                {/* Path tab */}
                {activeTab==='path' && (
                  <div>
                    {chapters.length===0 ? (
                      <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'.75rem',padding:'2.5rem',textAlign:'center' as const}}>
                        <div style={{fontSize:32,marginBottom:'.75rem'}}>📋</div>
                        <div style={{fontSize:14,fontWeight:700,marginBottom:'.4rem'}}>Modules loading...</div>
                        <div style={{fontSize:12,color:DS.fm,marginBottom:'1rem'}}>Content for this program is being prepared.</div>
                        <button onClick={()=>navigate(`/portal/course/${course.id}`)} style={{padding:'8px 20px',background:DS.blue,border:'none',borderRadius:'.5rem',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>Go to Course Page</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{fontSize:12,color:DS.fm,marginBottom:'1rem'}}>{chapters.length} modules · Complete in order for best results</div>
                        {chapters.map((ch,i)=>(
                          <div key={ch.id} onClick={()=>navigate(`/portal/course/${course.id}`)}
                            style={{display:'flex',gap:'1rem',alignItems:'flex-start',background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'.75rem',padding:'1rem 1.25rem',marginBottom:'.75rem',cursor:'pointer',transition:'all .15s'}}
                            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=DS.blue+'50';(e.currentTarget as HTMLElement).style.transform='translateX(3px)';}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=DS.border;(e.currentTarget as HTMLElement).style.transform='none';}}>
                            <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(74,144,245,.15)',border:'2px solid rgba(74,144,245,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:DS.blue,flexShrink:0}}>{i+1}</div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:13,fontWeight:700,marginBottom:'.25rem',color:DS.fg}}>{ch.title}</div>
                              {ch.description&&<div style={{fontSize:11,color:DS.fm,lineHeight:1.5,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as any}}>{ch.description}</div>}
                            </div>
                            <span style={{fontSize:18,color:DS.fd,alignSelf:'center'}}>→</span>
                          </div>
                        ))}
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'.75rem',marginTop:'1.5rem'}}>
                          {[{icon:'🧪',label:'Labs',desc:'Apply everything learned',go:()=>navigate('/portal/simulations')},{icon:'🎮',label:'Simulations',desc:'Live AI-graded exercises',go:()=>navigate('/portal/simulations')},{icon:'📋',label:'Case Studies',desc:'Real-world incidents',go:()=>navigate('/portal/resources')}].map(x=>(
                            <button key={x.label} onClick={x.go} style={{padding:'1rem',background:DS.card2,border:`1px solid ${DS.border}`,borderRadius:'.75rem',cursor:'pointer',textAlign:'left' as const,transition:'all .15s'}}
                              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=DS.blue+'60';}}
                              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=DS.border;}}>
                              <div style={{fontSize:24,marginBottom:'.5rem'}}>{x.icon}</div>
                              <div style={{fontSize:12,fontWeight:700,color:DS.fg,marginBottom:'.2rem'}}>{x.label}</div>
                              <div style={{fontSize:10,color:DS.fm}}>{x.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Resources tab */}
                {activeTab==='resources' && (
                  <div>
                    {!track ? <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'.75rem',padding:'2rem',textAlign:'center' as const,color:DS.fm,fontSize:13}}>Resources being curated.</div> : (
                      <div>
                        <div style={{fontSize:12,color:DS.fm,marginBottom:'1rem'}}>{track.resources.length} curated resources</div>
                        {track.resources.map((r,i)=>(
                          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                            style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.9rem 1.1rem',background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'.65rem',textDecoration:'none',transition:'all .15s',marginBottom:'.6rem'}}
                            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=DS.blue+'50';}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=DS.border;}}>
                            <div style={{padding:'3px 10px',borderRadius:99,fontSize:9,fontWeight:700,background:'rgba(74,144,245,.12)',color:DS.blue,flexShrink:0}}>{r.type}</div>
                            <div style={{fontSize:13,fontWeight:600,color:DS.fg,flex:1}}>{r.label}</div>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              {r.free&&<span style={{fontSize:9,padding:'2px 7px',borderRadius:99,background:'rgba(34,201,138,.12)',color:DS.green,fontWeight:700}}>FREE</span>}
                              <span style={{fontSize:16,color:DS.fd}}>↗</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Glossary tab */}
                {activeTab==='glossary' && (
                  <div>
                    {!track?.glossary?.length ? <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'.75rem',padding:'2rem',textAlign:'center' as const,color:DS.fm,fontSize:13}}>Glossary being built.</div> : (
                      <div>
                        <div style={{fontSize:12,color:DS.fm,marginBottom:'1rem'}}>{track.glossary.length} key terms</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.65rem'}}>
                          {track.glossary.map((g,i)=>(
                            <div key={i} style={{padding:'1rem',background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'.65rem'}}>
                              <div style={{fontSize:12,fontWeight:800,color:DS.blue,marginBottom:'.35rem',fontFamily:'monospace'}}>{g.term}</div>
                              <div style={{fontSize:11,color:DS.fm,lineHeight:1.55}}>{g.def}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Salary tab */}
                {activeTab==='salary' && salary && (
                  <div>
                    <div style={{marginBottom:'1.5rem'}}>
                      <div style={{fontSize:11,fontWeight:700,color:DS.fg,marginBottom:'.75rem'}}>Job titles you will qualify for</div>
                      <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                        {jobs.map(t=><span key={t} style={{padding:'5px 14px',borderRadius:99,background:'rgba(74,144,245,.1)',border:'1px solid rgba(74,144,245,.25)',color:DS.blue,fontSize:12,fontWeight:600}}>{t}</span>)}
                      </div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:DS.fg,marginBottom:'.75rem'}}>Annual salary by country</div>
                    <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:'1rem',overflow:'hidden'}}>
                      <div style={{display:'grid',gridTemplateColumns:'1.8fr 1fr 1fr 2fr',padding:'.65rem 1.25rem',background:'rgba(255,255,255,.03)',borderBottom:`1px solid ${DS.border}`}}>
                        {['Country','Min','Max','Range'].map(h=><div key={h} style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase' as const,color:DS.fm}}>{h}</div>)}
                      </div>
                      {COUNTRIES.map((c,i)=>{
                        const s=salary[c]||DEFAULT_SALARY[c]; if(!s) return null;
                        const mx=Math.max(...COUNTRIES.map(x=>(salary[x]||DEFAULT_SALARY[x])?.max||0));
                        const pct=Math.round((s.max/mx)*100);
                        return <div key={c}
                          style={{display:'grid',gridTemplateColumns:'1.8fr 1fr 1fr 2fr',padding:'.9rem 1.25rem',borderBottom:i<COUNTRIES.length-1?`1px solid ${DS.border}`:'none',alignItems:'center'}}
                          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.03)';}}
                          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';}}>
                          <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
                            <span style={{fontSize:18}}>{FLAGS[c]}</span>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:DS.fg}}>{c}</div>
                              <div style={{fontSize:10,color:DS.fm}}>{s.currency}/year</div>
                            </div>
                            {s.max===mx&&<span style={{fontSize:9,padding:'1px 6px',borderRadius:99,background:'rgba(245,184,26,.15)',color:DS.gold,fontWeight:700}}>TOP</span>}
                          </div>
                          <div style={{fontSize:12,color:DS.fm}}>{fmt(s.min,s.symbol)}</div>
                          <div style={{fontSize:13,fontWeight:700,color:DS.green}}>{fmt(s.max,s.symbol)}</div>
                          <div style={{paddingRight:'1rem'}}>
                            <div style={{height:6,borderRadius:99,background:'rgba(255,255,255,.06)',overflow:'hidden'}}>
                              <div style={{height:'100%',width:`${pct}%`,borderRadius:99,background:`linear-gradient(90deg,${DS.blue},${DS.green})`}}/>
                            </div>
                            <div style={{fontSize:10,color:DS.fm,marginTop:3}}>{fmt(s.min,s.symbol)} – {fmt(s.max,s.symbol)}</div>
                          </div>
                        </div>;
                      })}
                    </div>
                    <div style={{marginTop:'1rem',padding:'.75rem 1rem',background:'rgba(74,144,245,.06)',border:'1px solid rgba(74,144,245,.15)',borderRadius:'.6rem',fontSize:11,color:DS.fm,lineHeight:1.6}}>
                      📊 <strong style={{color:DS.fg}}>Sources:</strong> LinkedIn Salary, Glassdoor, Levels.fyi, Indeed (2024–2025). Ranges reflect total compensation. DR figures in Dominican Pesos (RD$).
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
    </PortalShell>
  );
}
