import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalShell from '@/components/portal/PortalShell';
import SimEngine from '@/components/SimEngine';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import {
  ALL_SIMULATIONS, PROGRAMS, SCHOOLS,
  getSimsForProgram, type Simulation, type SimType,
} from '@/data/simulations';
import simBg from '@/assets/sim-bg.png';

// ─── Design System ─────────────────────────────────────────────
const DS = {
  bg:'#060E1C', card:'rgba(8,20,52,.82)', border:'rgba(74,144,245,.18)',
  fg:'#EDF2F7', fm:'#8596AD', fd:'#2A3A52',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', gold:'#F5B81A', green:'#22C98A',
  purple:'#A78BFA',
};

const DIFF_META = {
  Starter:      { color:'#22C98A', bg:'rgba(34,201,138,.12)',  label:'Starter'      },
  Practitioner: { color:'#4A90F5', bg:'rgba(74,144,245,.12)',  label:'Practitioner' },
  Expert:       { color:'#F5B81A', bg:'rgba(245,184,26,.12)',  label:'Expert'       },
  Elite:        { color:'#F0622A', bg:'rgba(240,98,42,.12)',   label:'Elite'        },
};

const TYPE_ICONS: Record<string, string> = {
  incident:'🚨', architecture:'🏗️', negotiation:'🤝', audit:'🔍',
  crisis:'⚡', design:'✏️', review:'🔎', investigation:'🔬',
  pitch:'🎤', triage:'📋', roleplay:'🎭', analysis:'📊',
  ethics:'⚖️', coaching:'👥',
};

const completedSims: Record<string, number> = {};

// ─── Component ─────────────────────────────────────────────────
export default function PortalSimulations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeSim, setActiveSim] = useState<Simulation | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<string>('All');
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [selectedDiff, setSelectedDiff] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'program'>('program');
  const [completedMap, setCompletedMap] = useState<Record<string, number>>(completedSims);

  const filteredSims = useMemo(() => {
    let sims = ALL_SIMULATIONS;
    if (selectedSchool !== 'All') {
      const schoolPrograms = PROGRAMS.filter(p => p.school === selectedSchool).map(p => p.key);
      sims = sims.filter(s => schoolPrograms.includes(s.programKey));
    }
    if (selectedProgram !== 'All') {
      sims = sims.filter(s => s.programKey === selectedProgram);
    }
    if (selectedModule > 0) {
      sims = sims.filter(s => s.module === selectedModule);
    }
    if (selectedDiff !== 'All') {
      sims = sims.filter(s => s.difficulty === selectedDiff);
    }
    if (selectedType !== 'All') {
      sims = sims.filter(s => s.type === selectedType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      sims = sims.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.tags.some(tag => tag.includes(q))
      );
    }
    return sims;
  }, [selectedSchool, selectedProgram, selectedModule, selectedDiff, selectedType, searchQuery]);

  const completedCount = Object.keys(completedMap).length;
  const totalXP = Object.values(completedMap).reduce((a,b) => a+b, 0);

  const programsForSchool = selectedSchool === 'All'
    ? PROGRAMS
    : PROGRAMS.filter(p => p.school === selectedSchool);

  const handleComplete = (simId: string, xpEarned: number) => {
    setCompletedMap(prev => ({ ...prev, [simId]: xpEarned }));
  };

  if (activeSim) {
    return (
      <SimEngine
        sim={activeSim}
        onClose={() => setActiveSim(null)}
        onComplete={result => {
          handleComplete(activeSim.id, result.xpEarned);
          // Persist result to DB (fire-and-forget; local state updates regardless)
          if (user) {
            supabase.from('simulation_attempts').insert({
              user_id: user.id,
              sim_id: activeSim.id,
              program_key: activeSim.programKey,
              module_num: activeSim.module,
              sim_index: activeSim.index,
              sim_title: activeSim.title,
              sim_type: activeSim.type,
              difficulty: activeSim.difficulty,
              xp_available: activeSim.xp,
              score: result.score,
              xp_earned: result.xpEarned,
              verdict: result.verdict,
              strengths: result.strengths,
              improvements: result.improvements,
              key_decisions: result.keyDecisions,
            });
          }
          setActiveSim(null);
        }}
      />
    );
  }

  return (
    <PortalShell background={DS.bg}>
        <div style={{ flex:1, minHeight:'calc(100vh - 70px)', overflowX:'hidden' }}>

          {/* ── HERO BANNER ────────────────────────────────────── */}
          <div style={{
            position:'relative', height:340,
            backgroundImage:`url(${simBg})`,
            backgroundSize:'cover', backgroundPosition:'center right',
            overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(105deg, rgba(4,8,20,.95) 0%, rgba(4,8,20,.85) 45%, rgba(4,8,20,.4) 100%)',
            }}/>
            <div style={{ position:'relative', zIndex:2, padding:'44px 48px' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(74,144,245,.15)',
                border:'1px solid rgba(74,144,245,.35)',
                borderRadius:20, padding:'4px 14px',
                fontSize:10, color:DS.blue, fontWeight:700,
                letterSpacing:2, marginBottom:16,
              }}>
                {t('sim.badge')}
              </div>

              <h1 style={{
                fontSize:40, fontWeight:900, color:'#fff',
                lineHeight:1.1, marginBottom:12, letterSpacing:'-1px',
              }}>
                {t('sim.h1a')}<br/>
                <span style={{
                  background:'linear-gradient(90deg,#4A90F5,#A78BFA)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                }}>{t('sim.h1b')}</span>
              </h1>

              <p style={{ fontSize:14, color:'rgba(255,255,255,.6)', maxWidth:480, lineHeight:1.6, marginBottom:24 }}>
                {t('sim.sub')}
              </p>

              <div style={{ display:'flex', gap:20 }}>
                {[
                  { val:'2,800', labelKey:'sim.stat0', color:DS.blue },
                  { val:'28',    labelKey:'sim.stat1', color:DS.purple },
                  { val:`${completedCount}`, labelKey:'sim.stat2', color:DS.green },
                  { val:`${totalXP.toLocaleString()}`, labelKey:'sim.stat3', color:DS.gold },
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontSize:22, fontWeight:800, color:stat.color }}>{stat.val}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', letterSpacing:1 }}>{t(stat.labelKey)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding:'0 32px 40px' }}>

            {/* ── SCHOOL TABS ──────────────────────────────────── */}
            <div style={{
              display:'flex', gap:8, overflowX:'auto', paddingBottom:4,
              margin:'20px 0 16px', scrollbarWidth:'none',
            }}>
              {[{label:t('sim.all_schools'),color:'#8596AD',bg:'rgba(133,150,173,.12)'}, ...SCHOOLS.map(s => ({label:s.label,color:s.color,bg:s.bg}))].map((s, i) => (
                <button key={i}
                  onClick={() => { setSelectedSchool(i === 0 ? 'All' : SCHOOLS[i-1].label); setSelectedProgram('All'); setSelectedModule(0); }}
                  style={{
                    flexShrink:0, padding:'8px 16px',
                    background: (i === 0 ? selectedSchool === 'All' : selectedSchool === SCHOOLS[i-1]?.label) ? s.bg : 'transparent',
                    border:`1px solid ${(i === 0 ? selectedSchool === 'All' : selectedSchool === SCHOOLS[i-1]?.label) ? s.color : 'rgba(255,255,255,.08)'}`,
                    borderRadius:20, color:(i === 0 ? selectedSchool === 'All' : selectedSchool === SCHOOLS[i-1]?.label) ? s.color : DS.fm,
                    fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                    transition:'all .2s', whiteSpace:'nowrap',
                  }}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* ── FILTER BAR ───────────────────────────────────── */}
            <div style={{
              display:'flex', gap:10, alignItems:'center',
              padding:'12px 16px',
              background:'rgba(8,20,52,.7)',
              border:'1px solid rgba(74,144,245,.12)',
              borderRadius:12, marginBottom:24,
              flexWrap:'wrap',
            }}>
              <div style={{ flex:'1 1 200px', position:'relative' }}>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:12, color:DS.fd }}>🔍</span>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('sim.search')}
                  style={{
                    width:'100%', background:'rgba(255,255,255,.04)',
                    border:'1px solid rgba(255,255,255,.08)', borderRadius:8,
                    color:DS.fg, fontSize:12, padding:'8px 10px 8px 28px',
                    fontFamily:'inherit', outline:'none', boxSizing:'border-box',
                  }}
                />
              </div>

              <select
                value={selectedProgram}
                onChange={e => { setSelectedProgram(e.target.value); setSelectedModule(0); }}
                style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, color:DS.fg, fontSize:12, padding:'8px 10px', fontFamily:'inherit', cursor:'pointer', flexShrink:0 }}>
                <option value="All">{t('sim.all_programs')}</option>
                {programsForSchool.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>

              <select
                value={selectedModule}
                onChange={e => setSelectedModule(Number(e.target.value))}
                style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, color:DS.fg, fontSize:12, padding:'8px 10px', fontFamily:'inherit', cursor:'pointer', flexShrink:0 }}>
                <option value={0}>{t('sim.all_modules')}</option>
                {Array.from({length:10}, (_,i) => <option key={i+1} value={i+1}>{t('sim.module')} {i+1}</option>)}
              </select>

              <select
                value={selectedDiff}
                onChange={e => setSelectedDiff(e.target.value)}
                style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, color:DS.fg, fontSize:12, padding:'8px 10px', fontFamily:'inherit', cursor:'pointer', flexShrink:0 }}>
                <option value="All">{t('sim.all_levels')}</option>
                {['Starter','Practitioner','Expert','Elite'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, color:DS.fg, fontSize:12, padding:'8px 10px', fontFamily:'inherit', cursor:'pointer', flexShrink:0 }}>
                <option value="All">{t('sim.all_types')}</option>
                {Object.entries(TYPE_ICONS).map(([type,icon]) => <option key={type} value={type}>{icon} {t('sim.type_'+type)}</option>)}
              </select>

              <div style={{ fontSize:11, color:DS.fm, flexShrink:0, marginLeft:'auto' }}>
                <span style={{ color:DS.blue, fontWeight:700 }}>{filteredSims.length.toLocaleString()}</span> {t('sim.count_label')}
              </div>

              <div style={{ display:'flex', gap:4 }}>
                {([['grid','⊞'],['program','☰']] as [string,string][]).map(([mode, icon]) => (
                  <button key={mode} onClick={() => setViewMode(mode as any)}
                    style={{
                      padding:'6px 10px', background: viewMode === mode ? DS.bd : 'transparent',
                      border:`1px solid ${viewMode === mode ? DS.bb : 'rgba(255,255,255,.08)'}`,
                      borderRadius:6, color: viewMode === mode ? DS.blue : DS.fm,
                      fontSize:13, cursor:'pointer', fontFamily:'inherit',
                    }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* ── PROGRAM VIEW ─────────────────────────────────── */}
            {viewMode === 'program' && selectedProgram === 'All' ? (
              <ProgramView
                programs={programsForSchool}
                completedMap={completedMap}
                onSelectSim={setActiveSim}
                selectedModule={selectedModule}
              />
            ) : (
              <div>
                {filteredSims.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'60px 0', color:DS.fm }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{t('sim.no_results')}</div>
                    <div style={{ fontSize:12, marginTop:4, color:DS.fd }}>{t('sim.no_results_sub')}</div>
                  </div>
                ) : (
                  <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',
                    gap:14,
                  }}>
                    {filteredSims.slice(0, 60).map(sim => (
                      <SimCard key={sim.id} sim={sim} completed={completedMap[sim.id]} onStart={() => setActiveSim(sim)} />
                    ))}
                  </div>
                )}
                {filteredSims.length > 60 && (
                  <div style={{ textAlign:'center', marginTop:20, color:DS.fm, fontSize:12 }}>
                    {t('sim.showing_pre')}{filteredSims.length.toLocaleString()}{t('sim.showing_post')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    </PortalShell>
  );
}

// ─── Program View ──────────────────────────────────────────────
function ProgramView({ programs, completedMap, onSelectSim, selectedModule }: {
  programs: typeof PROGRAMS;
  completedMap: Record<string,number>;
  onSelectSim: (s: Simulation) => void;
  selectedModule: number;
}) {
  const { t } = useLanguage();
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {programs.map(prog => {
        const sims = selectedModule > 0
          ? getSimsForProgram(prog.key).filter(s => s.module === selectedModule)
          : getSimsForProgram(prog.key);
        const done = sims.filter(s => completedMap[s.id]).length;
        const isExpanded = expandedProgram === prog.key;

        return (
          <div key={prog.key} style={{
            background:'rgba(8,20,52,.7)',
            border:`1px solid ${isExpanded ? prog.color + '44' : 'rgba(255,255,255,.07)'}`,
            borderRadius:14, overflow:'hidden',
            transition:'border-color .2s',
          }}>
            <div
              onClick={() => setExpandedProgram(isExpanded ? null : prog.key)}
              style={{
                display:'flex', alignItems:'center', gap:12, padding:'14px 18px',
                cursor:'pointer', userSelect:'none',
                background: isExpanded ? `${prog.color}08` : 'transparent',
              }}>
              <div style={{
                width:38, height:38, borderRadius:10, flexShrink:0,
                background:`${prog.color}18`, border:`1px solid ${prog.color}44`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18,
              }}>
                {prog.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:DS.fg }}>{prog.label}</div>
                <div style={{ fontSize:10, color:DS.fm, marginTop:1 }}>
                  {sims.length}{t('sim.prog_sims')}
                </div>
              </div>
              <div style={{ width:100, marginRight:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:9, color:DS.fm }}>{done}/{sims.length} {t('sim.done')}</span>
                  <span style={{ fontSize:9, color:prog.color }}>{Math.round(done/sims.length*100)}%</span>
                </div>
                <div style={{ height:3, background:'rgba(255,255,255,.06)', borderRadius:2 }}>
                  <div style={{ height:'100%', width:`${done/sims.length*100}%`, background:prog.color, borderRadius:2, transition:'width .3s' }}/>
                </div>
              </div>
              <div style={{ fontSize:18, color:DS.fm, transition:'transform .2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>⌄</div>
            </div>

            {isExpanded && (
              <div style={{ borderTop:`1px solid rgba(255,255,255,.05)`, padding:'12px 18px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
                  {(selectedModule > 0 ? [selectedModule] : Array.from({length:10},(_,i)=>i+1)).map(mod => {
                    const modSims = sims.filter(s => s.module === mod);
                    const modDone = modSims.filter(s => completedMap[s.id]).length;
                    return (
                      <ModuleCard
                        key={mod}
                        moduleNum={mod}
                        sims={modSims}
                        done={modDone}
                        color={prog.color}
                        onSelectSim={onSelectSim}
                        completedMap={completedMap}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Module Card ───────────────────────────────────────────────
function ModuleCard({ moduleNum, sims, done, color, onSelectSim, completedMap }: {
  moduleNum: number;
  sims: Simulation[];
  done: number;
  color: string;
  onSelectSim: (s: Simulation) => void;
  completedMap: Record<string,number>;
}) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background:'rgba(255,255,255,.02)',
      border:`1px solid rgba(255,255,255,.06)`,
      borderRadius:10, overflow:'hidden',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
          cursor:'pointer',
        }}>
        <div style={{
          width:26, height:26, borderRadius:6, flexShrink:0,
          background:`${color}18`, border:`1px solid ${color}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:10, fontWeight:700, color,
        }}>
          {moduleNum}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, fontWeight:600, color:DS.fg }}>{t('sim.module')} {moduleNum}</div>
          <div style={{ fontSize:9, color:DS.fm }}>{done}/{sims.length} · {sims[0]?.difficulty ? t('sim.diff_'+sims[0].difficulty) : ''}</div>
        </div>
        <div style={{ display:'flex', gap:2 }}>
          {sims.slice(0,10).map((s,i) => (
            <div key={i} style={{
              width:5, height:5, borderRadius:'50%',
              background: completedMap[s.id] ? color : 'rgba(255,255,255,.1)',
            }}/>
          ))}
        </div>
        <div style={{ fontSize:12, color:DS.fm, transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition:'transform .2s' }}>⌄</div>
      </div>

      {expanded && (
        <div style={{ borderTop:'1px solid rgba(255,255,255,.04)', padding:'8px 10px', display:'flex', flexDirection:'column', gap:4 }}>
          {sims.map(sim => (
            <div
              key={sim.id}
              onClick={() => onSelectSim(sim)}
              style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'8px 10px', borderRadius:7,
                background: completedMap[sim.id] ? `${color}08` : 'rgba(255,255,255,.02)',
                border:`1px solid ${completedMap[sim.id] ? color+'22' : 'rgba(255,255,255,.04)'}`,
                cursor:'pointer', transition:'all .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${color}12`)}
              onMouseLeave={e => (e.currentTarget.style.background = completedMap[sim.id] ? `${color}08` : 'rgba(255,255,255,.02)')}
            >
              <span style={{ fontSize:13 }}>{TYPE_ICONS[sim.type] || '🎯'}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:DS.fg, fontWeight:completedMap[sim.id] ? 600 : 400 }}>{sim.title}</div>
                <div style={{ fontSize:9, color:DS.fm, marginTop:1 }}>{sim.durationMin}min · {sim.xp}XP</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{
                  fontSize:8, fontWeight:700, padding:'2px 6px', borderRadius:3,
                  color:DIFF_META[sim.difficulty].color,
                  background:DIFF_META[sim.difficulty].bg,
                }}>
                  {sim.difficulty.slice(0,4).toUpperCase()}
                </span>
                {completedMap[sim.id] ? (
                  <span style={{ fontSize:11, color:color }}>✓</span>
                ) : (
                  <span style={{ fontSize:9, color:DS.blue }}>▶</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sim Card (grid view) ──────────────────────────────────────
function SimCard({ sim, completed, onStart }: {
  sim: Simulation;
  completed?: number;
  onStart: () => void;
}) {
  const { t } = useLanguage();
  const prog = PROGRAMS.find(p => p.key === sim.programKey);
  const diff = DIFF_META[sim.difficulty];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(8,20,52,.95)' : 'rgba(8,20,52,.7)',
        border:`1px solid ${hovered ? (prog?.color || DS.blue)+'55' : 'rgba(255,255,255,.07)'}`,
        borderRadius:14, padding:'16px',
        transition:'all .2s', cursor:'pointer',
        boxShadow: hovered ? `0 0 24px ${(prog?.color||DS.blue)}18` : 'none',
      }}
      onClick={onStart}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
        <div style={{
          width:36, height:36, borderRadius:8, flexShrink:0,
          background:`${prog?.color || DS.blue}18`,
          border:`1px solid ${prog?.color || DS.blue}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16,
        }}>
          {TYPE_ICONS[sim.type] || '🎯'}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, color:prog?.color || DS.blue, fontWeight:700, marginBottom:2 }}>
            {prog?.icon} {prog?.label}
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:DS.fg, lineHeight:1.3 }}>{sim.title}</div>
        </div>
        {completed && <span style={{ fontSize:14, color:prog?.color || DS.green }}>✓</span>}
      </div>

      <div style={{ fontSize:11, color:DS.fm, lineHeight:1.5, marginBottom:12 }}>{sim.subtitle}</div>

      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
        <span style={{ fontSize:8, fontWeight:700, padding:'2px 7px', borderRadius:3, color:diff.color, background:diff.bg, border:`1px solid ${diff.color}33` }}>
          {t('sim.diff_'+sim.difficulty).toUpperCase()}
        </span>
        <span style={{ fontSize:8, fontWeight:700, padding:'2px 7px', borderRadius:3, color:'#8596AD', background:'rgba(133,150,173,.12)' }}>
          {t('sim.mod')} {sim.module}
        </span>
        {sim.tags.slice(0,3).map((tag,i) => (
          <span key={i} style={{ fontSize:8, padding:'2px 7px', borderRadius:3, color:DS.fm, background:'rgba(255,255,255,.05)' }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:12 }}>
          <span style={{ fontSize:10, color:DS.fm }}>⏱ {sim.durationMin}min</span>
          <span style={{ fontSize:10, color:DS.fm }}>⭐ {sim.xp} XP</span>
          <span style={{ fontSize:10, color:DS.fm }}>👥 {sim.aiPersonas.length} personas</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onStart(); }}
          style={{
            padding:'5px 14px',
            background: hovered ? `linear-gradient(90deg,${prog?.color||DS.blue}cc,${prog?.color||DS.blue})` : 'transparent',
            border:`1px solid ${hovered ? 'transparent' : (prog?.color||DS.blue)+'44'}`,
            borderRadius:6, color: hovered ? '#fff' : (prog?.color||DS.blue),
            fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
            transition:'all .2s',
          }}>
          {completed ? t('sim.retry') : t('sim.launch')}
        </button>
      </div>
    </div>
  );
}
