import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import type { Simulation } from '@/data/simulations';

// ─── Types ────────────────────────────────────────────────────
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPersona?: string;  // persona name if from a specific character
}

interface ScoreResult {
  score: number;        // 0–100
  xpEarned: number;
  verdict: string;      // e.g. "Expert Performance"
  strengths: string[];
  improvements: string[];
  keyDecisions: string[];
}

interface SimEngineProps {
  sim: Simulation;
  onClose: () => void;
  onComplete: (score: ScoreResult) => void;
}

// ─── Constants ─────────────────────────────────────────────────
const DIFF_COLOR: Record<string, string> = {
  Starter: '#22C98A', Practitioner: '#4A90F5',
  Expert: '#F5B81A', Elite: '#F0622A',
};
const TYPE_LABEL: Record<string, string> = {
  incident:'🚨 INCIDENT', architecture:'🏗️ ARCHITECTURE', negotiation:'🤝 NEGOTIATION',
  audit:'🔍 AUDIT', crisis:'⚡ CRISIS', design:'✏️ DESIGN', review:'🔎 REVIEW',
  investigation:'🔬 INVESTIGATION', pitch:'🎤 PITCH', triage:'📋 TRIAGE',
  roleplay:'🎭 ROLEPLAY', analysis:'📊 ANALYSIS', ethics:'⚖️ ETHICS', coaching:'👥 COACHING',
};

// ─── Simulation Engine ─────────────────────────────────────────
export default function SimEngine({ sim, onClose, onComplete }: SimEngineProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'brief' | 'active' | 'scoring' | 'results'>('brief');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sim.durationMin * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [activePersona, setActivePersona] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Countdown timer
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [timerActive]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setPhase('scoring');
    computeScore();
  };

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  // ── Start Simulation ──────────────────────────────────────────
  const startSim = async () => {
    setPhase('active');
    setTimerActive(true);
    setLoading(true);

    const systemPrompt = buildSystemPrompt();
    const openingMsg = await callClaude(systemPrompt, [
      { role: 'user', content: 'START_SIMULATION' }
    ]);

    setMessages([{
      role: 'assistant',
      content: openingMsg,
      timestamp: new Date(),
      isPersona: sim.aiPersonas[0]?.name,
    }]);
    setLoading(false);
  };

  // ── Build System Prompt ───────────────────────────────────────
  const buildSystemPrompt = () => `You are running a professional AI career simulation for Aladiah Academy — the world's most rigorous AI certification platform. Motto: "Solo Excelencia."

SIMULATION: ${sim.title}
TYPE: ${sim.type.toUpperCase()}
DIFFICULTY: ${sim.difficulty}
STUDENT ROLE: ${sim.roleContext}
COMPANY: ${sim.companyContext}

SCENARIO:
${sim.scenario}

SUCCESS CRITERIA (what the student must achieve):
${sim.successCriteria.map((c,i) => `${i+1}. ${c}`).join('\n')}

PERSONAS YOU PLAY:
${sim.aiPersonas.map(p => `• ${p.name} (${p.role}): ${p.personality}`).join('\n')}

TOOLS IN THIS SIMULATION:
${sim.tools.join(', ')}

SIMULATION RULES:
1. You play ALL personas listed above. Rotate between them naturally based on context.
2. Start by setting the scene vividly — describe the urgency, the environment, the stakes. Make it feel REAL.
3. Each turn: respond in character as the relevant persona, then present the student with a clear decision point, challenge, or question.
4. Track the student's decisions. If they make a technically wrong call, the persona should push back realistically.
5. Escalate pressure over time — production systems degrade, executives get more impatient, stakes increase.
6. Use ACTUAL technical details (real AWS service names, real Kubernetes commands, real tool names).
7. After 8–12 turns, naturally bring the scenario to a resolution point.
8. Format: Begin each response with [PERSONA NAME — ROLE] in bold. Use markdown for code blocks, CLI commands, dashboards.
9. Keep each response under 300 words but make every word count.
10. If student asks for a tool output, simulate it realistically (fake but plausible kubectl output, AWS CLI output, etc.)

When student types START_SIMULATION: Open with the most dramatic, vivid, urgent scene-setting you can. Drop them into the middle of the action. No preamble.`;

  // ── Call Claude via Supabase proxy ───────────────────────────
  const callClaude = async (
    system: string,
    conversation: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<string> => {
    try {
      const res = await fetch(
        'https://vgujnkxylipfwmkpwzvb.supabase.co/functions/v1/ai-proxy',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWpua3h5bGlwZndta3B3enZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzYyMTUsImV4cCI6MjA4OTcxMjIxNX0.wpP8ZK0dtEegUu3r1f--sIkNHN1GnHTzvIstVAi1k20',
          },
          body: JSON.stringify({ system, messages: conversation, max_tokens: 600 }),
        }
      );
      const data = await res.json();
      return data?.content?.[0]?.text || '[No response]';
    } catch {
      return '⚠️ Connection error. Please check your network and try again.';
    }
  };

  // ── Send Message ──────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setTurnCount(t => t + 1);

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMsg, timestamp: new Date() },
    ];
    setMessages(newMessages);
    setLoading(true);

    // Build conversation history for Claude
    const history = newMessages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const reply = await callClaude(buildSystemPrompt(), history);
    const persona = sim.aiPersonas[turnCount % sim.aiPersonas.length];

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
      isPersona: persona?.name,
    }]);
    setLoading(false);

    // Auto-complete after 12 turns or if scenario naturally resolved
    if (turnCount >= 11 || reply.toLowerCase().includes('simulation complete') || reply.toLowerCase().includes('well done') || reply.toLowerCase().includes('excellent work')) {
      setTimeout(() => {
        setTimerActive(false);
        setPhase('scoring');
        computeScore();
      }, 2000);
    }
  };

  // ── Compute Score ─────────────────────────────────────────────
  const computeScore = async () => {
    setLoading(true);
    const transcript = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');

    const evaluationPrompt = `You are a senior AI career evaluator at Aladiah Academy. Evaluate this simulation transcript.

SIMULATION: ${sim.title} (${sim.difficulty} difficulty)
SUCCESS CRITERIA:
${sim.successCriteria.map((c,i) => `${i+1}. ${c}`).join('\n')}

TRANSCRIPT:
${transcript.slice(-4000)}

Evaluate the student's performance and respond ONLY with valid JSON (no markdown, no preamble):
{
  "score": <number 0-100>,
  "verdict": "<one of: Needs Practice / Good Start / Solid Performance / Expert Performance / Elite Performance>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<specific area to improve 1>", "<specific area to improve 2>"],
  "keyDecisions": ["<notable decision made by student>", "<another decision>"]
}

Be honest and rigorous. Aladiah Academy holds students to elite standards.`;

    try {
      const raw = await callClaude(evaluationPrompt, [{ role: 'user', content: 'Evaluate now.' }]);
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      const xpEarned = Math.round((parsed.score / 100) * sim.xp);
      const result: ScoreResult = { ...parsed, xpEarned };
      setScore(result);
      setPhase('results');
      onComplete(result);
    } catch {
      const fallback: ScoreResult = {
        score: 75, xpEarned: Math.round(0.75 * sim.xp),
        verdict: 'Solid Performance',
        strengths: ['Engaged with the scenario professionally', 'Demonstrated domain knowledge'],
        improvements: ['Continue practicing under time pressure'],
        keyDecisions: ['Participated in the simulation'],
      };
      setScore(fallback);
      setPhase('results');
      onComplete(fallback);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ═══ RENDER ═══════════════════════════════════════════════════

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:2000,
      background:'rgba(0,0,0,.92)',
      display:'flex', flexDirection:'column',
      fontFamily:'"JetBrains Mono",ui-monospace,monospace',
    }}>
      {/* ── TOP BAR ── */}
      <div style={{
        display:'flex', alignItems:'center', gap:12, padding:'0 20px',
        height:52, flexShrink:0,
        background:'rgba(8,20,52,.95)',
        borderBottom:'1px solid rgba(74,144,245,.2)',
      }}>
        <button onClick={onClose} style={{background:'none',border:'1px solid rgba(255,255,255,.15)',borderRadius:6,color:'#8596AD',fontSize:11,padding:'4px 10px',cursor:'pointer',fontFamily:'inherit'}}>
          {t('se.exit')}
        </button>
        <div style={{flex:1, display:'flex', alignItems:'center', gap:10}}>
          <span style={{fontSize:10,fontWeight:700,color:DIFF_COLOR[sim.difficulty],letterSpacing:1,background:`${DIFF_COLOR[sim.difficulty]}18`,padding:'2px 8px',borderRadius:4,border:`1px solid ${DIFF_COLOR[sim.difficulty]}44`}}>
            {sim.difficulty.toUpperCase()}
          </span>
          <span style={{fontSize:11,color:'#60a5fa',fontWeight:700}}>{TYPE_LABEL[sim.type]}</span>
          <span style={{fontSize:12,color:'#EDF2F7',fontWeight:600}}>{sim.title}</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          {phase === 'active' && (
            <div style={{
              fontFamily:'monospace', fontSize:16, fontWeight:700,
              color: timeLeft < 120 ? '#F0622A' : timeLeft < 300 ? '#F5B81A' : '#22C98A',
              minWidth:52, textAlign:'center',
            }}>
              {formatTime(timeLeft)}
            </div>
          )}
          <div style={{fontSize:10,color:'#4A5E7A'}}>
            TURN {turnCount}/12 · {sim.xp} XP
          </div>
          {phase === 'active' && (
            <button onClick={() => { setTimerActive(false); setPhase('scoring'); computeScore(); }}
              style={{background:'none',border:'1px solid rgba(240,98,42,.4)',borderRadius:6,color:'#F0622A',fontSize:10,padding:'4px 10px',cursor:'pointer',fontFamily:'inherit'}}>
              END SIM
            </button>
          )}
        </div>
      </div>

      {/* ── BRIEF PHASE ── */}
      {phase === 'brief' && (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24, overflowY:'auto'}}>
          <div style={{
            maxWidth:680, width:'100%',
            background:'rgba(8,20,52,.9)',
            border:'1px solid rgba(74,144,245,.25)',
            borderRadius:16, padding:'2rem',
            boxShadow:'0 0 80px rgba(74,144,245,.08)',
          }}>
            {/* Header */}
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:20}}>
              <div style={{
                width:44, height:44, borderRadius:10,
                background:`${DIFF_COLOR[sim.difficulty]}22`,
                border:`1px solid ${DIFF_COLOR[sim.difficulty]}55`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18,
              }}>
                {sim.type === 'incident' ? '🚨' : sim.type === 'architecture' ? '🏗️' : sim.type === 'audit' ? '🔍' : sim.type === 'pitch' ? '🎤' : sim.type === 'crisis' ? '⚡' : sim.type === 'ethics' ? '⚖️' : '🎯'}
              </div>
              <div>
                <div style={{fontSize:10,color:DIFF_COLOR[sim.difficulty],fontWeight:700,letterSpacing:1,marginBottom:2}}>
                  {sim.difficulty.toUpperCase()} · MODULE {sim.module} · SIM {sim.index}
                </div>
                <div style={{fontSize:16,fontWeight:700,color:'#EDF2F7'}}>{sim.title}</div>
                <div style={{fontSize:11,color:'#8596AD'}}>{sim.subtitle}</div>
              </div>
            </div>

            {/* Company & Role */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16}}>
              <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:8,padding:'10px 12px'}}>
                <div style={{fontSize:9,color:'#4A5E7A',letterSpacing:1,marginBottom:4}}>{t('se.your_role')}</div>
                <div style={{fontSize:11,color:'#EDF2F7',fontWeight:600}}>{sim.roleContext}</div>
              </div>
              <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:8,padding:'10px 12px'}}>
                <div style={{fontSize:9,color:'#4A5E7A',letterSpacing:1,marginBottom:4}}>{t('se.company')}</div>
                <div style={{fontSize:11,color:'#EDF2F7',fontWeight:600}}>{sim.companyContext}</div>
              </div>
            </div>

            {/* Scenario */}
            <div style={{
              background:'rgba(74,144,245,.05)',
              border:'1px solid rgba(74,144,245,.15)',
              borderLeft:'3px solid #4A90F5',
              borderRadius:'0 8px 8px 0', padding:'14px 16px', marginBottom:16,
            }}>
              <div style={{fontSize:9,color:'#4A90F5',letterSpacing:1,fontWeight:700,marginBottom:6}}>{t('se.briefing')}</div>
              <div style={{fontSize:12,color:'#CBD5E1',lineHeight:1.7}}>{sim.scenario}</div>
            </div>

            {/* Personas */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:9,color:'#4A5E7A',letterSpacing:1,marginBottom:8}}>{t('se.people')}</div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                {sim.aiPersonas.map((p,i) => (
                  <div key={i} style={{
                    background:'rgba(255,255,255,.03)',
                    border:'1px solid rgba(255,255,255,.07)',
                    borderRadius:8, padding:'8px 10px',
                    flex:'1 1 140px', minWidth:140,
                  }}>
                    <div style={{fontSize:11,color:'#EDF2F7',fontWeight:700}}>{p.name}</div>
                    <div style={{fontSize:9,color:'#4A90F5',marginBottom:3}}>{p.role}</div>
                    <div style={{fontSize:9,color:'#4A5E7A',lineHeight:1.5}}>{p.personality}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Criteria */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:9,color:'#4A5E7A',letterSpacing:1,marginBottom:8}}>{t('se.success')}</div>
              {sim.successCriteria.map((c,i) => (
                <div key={i} style={{display:'flex', gap:8, alignItems:'flex-start', marginBottom:5}}>
                  <div style={{width:16,height:16,border:'1px solid #22C98A',borderRadius:3,flexShrink:0,marginTop:1}}/>
                  <div style={{fontSize:11,color:'#8596AD',lineHeight:1.5}}>{c}</div>
                </div>
              ))}
            </div>

            {/* Meta row */}
            <div style={{display:'flex', gap:12, marginBottom:20}}>
              {[
                {label:'Duration', value:`${sim.durationMin} min`},
                {label:'XP Reward', value:`${sim.xp} XP`},
                {label:'Type', value:sim.type.charAt(0).toUpperCase()+sim.type.slice(1)},
                {label:'Tools', value:`${sim.tools.length} tools`},
              ].map((item,i) => (
                <div key={i} style={{
                  flex:1, textAlign:'center',
                  background:'rgba(255,255,255,.03)',
                  border:'1px solid rgba(255,255,255,.06)',
                  borderRadius:8, padding:'8px 4px',
                }}>
                  <div style={{fontSize:13,fontWeight:700,color:'#EDF2F7'}}>{item.value}</div>
                  <div style={{fontSize:9,color:'#4A5E7A'}}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Start */}
            <button onClick={startSim} style={{
              width:'100%', padding:'14px 0',
              background:'linear-gradient(90deg,#1d4ed8,#4A90F5)',
              border:'none', borderRadius:10, color:'#fff',
              fontSize:13, fontWeight:700, cursor:'pointer',
              fontFamily:'inherit', letterSpacing:.5,
              boxShadow:'0 0 30px rgba(74,144,245,.4)',
            }}>
              {t('se.launch')}
            </button>
          </div>
        </div>
      )}

      {/* ── ACTIVE PHASE ── */}
      {phase === 'active' && (
        <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
          {/* Personas bar */}
          <div style={{
            display:'flex', gap:8, padding:'6px 16px',
            background:'rgba(8,20,52,.7)',
            borderBottom:'1px solid rgba(74,144,245,.1)',
            flexShrink:0,
          }}>
            {sim.aiPersonas.map((p,i) => (
              <div key={i} onClick={() => setActivePersona(i)} style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'4px 10px', borderRadius:20,
                background: activePersona === i ? 'rgba(74,144,245,.2)' : 'transparent',
                border: `1px solid ${activePersona === i ? 'rgba(74,144,245,.4)' : 'transparent'}`,
                cursor:'pointer', transition:'all .2s',
              }}>
                <div style={{
                  width:22, height:22, borderRadius:'50%',
                  background:`hsl(${i*80+220},60%,45%)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:9, fontWeight:700, color:'#fff',
                }}>
                  {p.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{fontSize:9,color:'#EDF2F7',fontWeight:600}}>{p.name}</div>
                  <div style={{fontSize:8,color:'#4A5E7A'}}>{p.role}</div>
                </div>
              </div>
            ))}
            <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:8}}>
              <div style={{fontSize:9,color:'#4A5E7A'}}>{t('se.tools')}</div>
              {sim.tools.slice(0,4).map((t,i) => (
                <span key={i} style={{fontSize:8,color:'#4A90F5',background:'rgba(74,144,245,.1)',padding:'2px 6px',borderRadius:3}}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:12}}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display:'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap:10, alignItems:'flex-start',
              }}>
                {/* Avatar */}
                <div style={{
                  width:32, height:32, borderRadius:'50%', flexShrink:0,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg,#4A90F5,#7AB5FF)'
                    : msg.isPersona
                      ? `hsl(${(sim.aiPersonas.findIndex(p=>p.name===msg.isPersona)*80+220)},60%,45%)`
                      : '#374151',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700, color:'#fff',
                }}>
                  {msg.role === 'user' ? 'YOU' : (msg.isPersona?.slice(0,2).toUpperCase() || 'AI')}
                </div>
                {/* Bubble */}
                <div style={{
                  maxWidth:'78%',
                  background: msg.role === 'user'
                    ? 'rgba(74,144,245,.15)'
                    : 'rgba(8,20,52,.8)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(74,144,245,.25)' : 'rgba(255,255,255,.07)'}`,
                  borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                  padding:'10px 14px',
                }}>
                  {msg.isPersona && msg.role === 'assistant' && (
                    <div style={{fontSize:9,color:'#4A90F5',fontWeight:700,marginBottom:5,letterSpacing:1}}>
                      {msg.isPersona.toUpperCase()} · {sim.aiPersonas.find(p=>p.name===msg.isPersona)?.role}
                    </div>
                  )}
                  <div style={{
                    fontSize:12, color:'#CBD5E1', lineHeight:1.7,
                    whiteSpace:'pre-wrap',
                    fontFamily: msg.content.includes('```') ? 'monospace' : 'inherit',
                  }}>
                    {msg.content}
                  </div>
                  <div style={{fontSize:8,color:'#4A5E7A',marginTop:4,textAlign: msg.role === 'user' ? 'right' : 'left'}}>
                    {msg.timestamp.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                <div style={{
                  width:32, height:32, borderRadius:'50%',
                  background:`hsl(${activePersona*80+220},60%,45%)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700, color:'#fff', flexShrink:0,
                }}>
                  {sim.aiPersonas[activePersona]?.name.slice(0,2).toUpperCase()}
                </div>
                <div style={{
                  background:'rgba(8,20,52,.8)',
                  border:'1px solid rgba(255,255,255,.07)',
                  borderRadius:'4px 12px 12px 12px',
                  padding:'12px 16px',
                  display:'flex', gap:4, alignItems:'center',
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width:5, height:5, borderRadius:'50%',
                      background:'#4A90F5',
                      animation:'typing-dot 1.2s ease-in-out infinite',
                      animationDelay:`${i*0.2}s`,
                    }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding:'12px 16px', flexShrink:0,
            background:'rgba(8,20,52,.9)',
            borderTop:'1px solid rgba(74,144,245,.15)',
          }}>
            <div style={{display:'flex', gap:8, alignItems:'flex-end'}}>
              <div style={{flex:1, position:'relative'}}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={t('se.placeholder').replace('{role}', sim.roleContext)}
                  disabled={loading}
                  rows={2}
                  style={{
                    width:'100%', resize:'none',
                    background:'rgba(255,255,255,.04)',
                    border:'1px solid rgba(74,144,245,.2)',
                    borderRadius:8, color:'#EDF2F7',
                    fontSize:12, padding:'10px 12px',
                    fontFamily:'inherit', outline:'none',
                    boxSizing:'border-box',
                    transition:'border-color .2s',
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  height:52, padding:'0 18px',
                  background: loading || !input.trim() ? 'rgba(74,144,245,.2)' : 'linear-gradient(90deg,#1d4ed8,#4A90F5)',
                  border:'none', borderRadius:8,
                  color: loading || !input.trim() ? '#4A5E7A' : '#fff',
                  fontSize:11, fontWeight:700, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  fontFamily:'inherit', whiteSpace:'nowrap',
                  transition:'all .2s',
                }}
              >
                {t('se.send')}
              </button>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:6}}>
              <div style={{fontSize:9,color:'#4A5E7A'}}>
                {t('se.turn').replace('{n}', String(turnCount))}
              </div>
              <div style={{fontSize:9,color:'#4A5E7A'}}>
                {sim.tools.join(' · ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCORING PHASE ── */}
      {phase === 'scoring' && (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{textAlign:'center'}}>
            <div style={{
              width:80, height:80, borderRadius:'50%',
              border:'3px solid #4A90F5',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 20px',
              animation:'spin 2s linear infinite',
            }}>
              <div style={{fontSize:28}}>🎓</div>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:'#EDF2F7',marginBottom:8}}>
              {t('se.evaluating')}
            </div>
            <div style={{fontSize:12,color:'#8596AD'}}>
              {t('se.reviewing')}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === 'results' && score && (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24, overflowY:'auto'}}>
          <div style={{maxWidth:580, width:'100%'}}>
            {/* Score header */}
            <div style={{
              textAlign:'center', marginBottom:24,
              background:'rgba(8,20,52,.9)',
              border:'1px solid rgba(74,144,245,.2)',
              borderRadius:16, padding:'2rem',
            }}>
              {/* Score ring */}
              <div style={{position:'relative', width:120, height:120, margin:'0 auto 16px'}}>
                <svg viewBox="0 0 120 120" width="120" height="120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8"/>
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke={score.score >= 90 ? '#22C98A' : score.score >= 75 ? '#4A90F5' : score.score >= 60 ? '#F5B81A' : '#F0622A'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${score.score * 3.14} 314`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div style={{
                  position:'absolute', inset:0,
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                }}>
                  <div style={{fontSize:28,fontWeight:800,color:'#EDF2F7'}}>{score.score}</div>
                  <div style={{fontSize:9,color:'#4A5E7A'}}>/ 100</div>
                </div>
              </div>

              <div style={{
                fontSize:18, fontWeight:700,
                color: score.score >= 90 ? '#22C98A' : score.score >= 75 ? '#4A90F5' : score.score >= 60 ? '#F5B81A' : '#F0622A',
                marginBottom:6,
              }}>
                {score.verdict}
              </div>
              <div style={{
                display:'inline-block',
                background:'rgba(245,184,26,.15)', border:'1px solid rgba(245,184,26,.3)',
                borderRadius:20, padding:'4px 16px',
                fontSize:13, fontWeight:700, color:'#F5B81A',
              }}>
                {t('se.xp').replace('{n}', String(score.xpEarned))}
              </div>
            </div>

            {/* Breakdown */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12}}>
              <div style={{
                background:'rgba(34,201,138,.06)', border:'1px solid rgba(34,201,138,.2)',
                borderRadius:12, padding:'14px 16px',
              }}>
                <div style={{fontSize:9,color:'#22C98A',fontWeight:700,letterSpacing:1,marginBottom:10}}>{t('se.strengths')}</div>
                {score.strengths.map((s,i) => (
                  <div key={i} style={{display:'flex', gap:6, marginBottom:6, alignItems:'flex-start'}}>
                    <span style={{color:'#22C98A',fontSize:10,marginTop:1}}>✓</span>
                    <span style={{fontSize:11,color:'#CBD5E1',lineHeight:1.5}}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{
                background:'rgba(240,98,42,.06)', border:'1px solid rgba(240,98,42,.2)',
                borderRadius:12, padding:'14px 16px',
              }}>
                <div style={{fontSize:9,color:'#F0622A',fontWeight:700,letterSpacing:1,marginBottom:10}}>{t('se.improve')}</div>
                {score.improvements.map((s,i) => (
                  <div key={i} style={{display:'flex', gap:6, marginBottom:6, alignItems:'flex-start'}}>
                    <span style={{color:'#F0622A',fontSize:10,marginTop:1}}>↑</span>
                    <span style={{fontSize:11,color:'#CBD5E1',lineHeight:1.5}}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key decisions */}
            <div style={{
              background:'rgba(74,144,245,.05)', border:'1px solid rgba(74,144,245,.15)',
              borderRadius:12, padding:'14px 16px', marginBottom:16,
            }}>
              <div style={{fontSize:9,color:'#4A90F5',fontWeight:700,letterSpacing:1,marginBottom:10}}>{t('se.key_decisions')}</div>
              {score.keyDecisions.map((d,i) => (
                <div key={i} style={{fontSize:11,color:'#8596AD',marginBottom:5,lineHeight:1.5}}>
                  <span style={{color:'#4A90F5'}}>›</span> {d}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{display:'flex', gap:10}}>
              <button onClick={onClose} style={{
                flex:1, padding:'13px 0',
                background:'rgba(255,255,255,.05)',
                border:'1px solid rgba(255,255,255,.12)',
                borderRadius:10, color:'#8596AD',
                fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
              }}>
                {t('se.back_sims')}
              </button>
              <button onClick={() => {
                setPhase('brief'); setMessages([]); setTurnCount(0);
                setTimeLeft(sim.durationMin*60); setScore(null);
              }} style={{
                flex:2, padding:'13px 0',
                background:'linear-gradient(90deg,#1d4ed8,#4A90F5)',
                border:'none', borderRadius:10, color:'#fff',
                fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                boxShadow:'0 0 24px rgba(74,144,245,.4)',
              }}>
                {t('se.retry')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typing-dot {
          0%,60%,100%{transform:translateY(0)}
          30%{transform:translateY(-6px)}
        }
        @keyframes spin {
          from{transform:rotate(0deg)} to{transform:rotate(360deg)}
        }
        textarea:focus { border-color: rgba(74,144,245,.5) !important; }
        *::-webkit-scrollbar{width:4px}
        *::-webkit-scrollbar-thumb{background:rgba(74,144,245,.2);border-radius:4px}
      `}</style>
    </div>
  );
}
