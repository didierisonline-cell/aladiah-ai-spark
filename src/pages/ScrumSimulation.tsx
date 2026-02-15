import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, Users, Calendar, Trophy, ArrowRight, ChevronLeft, 
  MessageSquare, Star, AlertTriangle, CheckCircle, Loader2 
} from 'lucide-react';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';

const TEAM_MEMBERS: Record<string, { role: string; avatar: string }> = {
  "Sean": { role: "Product Owner", avatar: "👔" },
  "Sebastian": { role: "QA Engineer", avatar: "🔍" },
  "Christo": { role: "QA Engineer", avatar: "🧪" },
  "Maya": { role: "Senior Developer", avatar: "👩‍💻" },
  "James": { role: "Developer", avatar: "💻" },
  "Priya": { role: "Developer", avatar: "🌟" },
  "Carlos": { role: "Developer", avatar: "⚙️" },
  "Aisha": { role: "Business Analyst", avatar: "📋" },
  "Narrator": { role: "System", avatar: "📢" },
  "Scrum Master (You)": { role: "You", avatar: "🎯" },
};

const SPRINT_SCHEDULE = [
  { day: 1, weekday: "Wednesday", ceremonies: ["Sprint Planning"], description: "Sprint Planning Day" },
  { day: 2, weekday: "Thursday", ceremonies: ["Daily Scrum"], description: "First Development Day" },
  { day: 3, weekday: "Friday", ceremonies: ["Daily Scrum", "Backlog Refinement"], description: "Dev + Refinement" },
  { day: 4, weekday: "Monday", ceremonies: ["Daily Scrum"], description: "Week 2 Starts" },
  { day: 5, weekday: "Tuesday", ceremonies: ["Daily Scrum"], description: "Mid-Sprint Check" },
  { day: 6, weekday: "Wednesday", ceremonies: ["Daily Scrum", "Backlog Refinement"], description: "2nd Refinement" },
  { day: 7, weekday: "Thursday", ceremonies: ["Daily Scrum"], description: "Development Push" },
  { day: 8, weekday: "Friday", ceremonies: ["Daily Scrum"], description: "Final Push" },
  { day: 9, weekday: "Monday", ceremonies: ["Daily Scrum", "Sprint Review"], description: "Sprint Review" },
  { day: 10, weekday: "Tuesday", ceremonies: ["Sprint Retrospective"], description: "Retrospective" },
];

interface Message {
  id?: string;
  speaker: string;
  content: string;
  role: string;
}

interface DayScore {
  facilitation_score: number;
  communication_score: number;
  artifact_score: number;
  decision_score: number;
  total_score: number;
  feedback: string;
}

const ScrumSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dayScore, setDayScore] = useState<DayScore | null>(null);
  const [allScores, setAllScores] = useState<DayScore[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [simStatus, setSimStatus] = useState<'idle' | 'active' | 'completed'>('idle');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkExistingSimulation();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkExistingSimulation = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/auth'); return; }

    const { data: sims } = await supabase
      .from('scrum_simulations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (sims && sims.length > 0) {
      const sim = sims[0];
      setSimulationId(sim.id);
      setCurrentDay(sim.current_day);
      setSimStatus(sim.status as any);

      // Load existing messages for current day
      const { data: msgs } = await supabase
        .from('simulation_messages')
        .select('*')
        .eq('simulation_id', sim.id)
        .eq('day', sim.current_day)
        .order('created_at', { ascending: true });

      if (msgs && msgs.length > 0) {
        setMessages(msgs.map(m => ({
          id: m.id,
          speaker: m.speaker || 'Narrator',
          content: m.content,
          role: m.role,
        })));
      }

      // Load scores
      const { data: scores } = await supabase
        .from('simulation_scores')
        .select('*')
        .eq('simulation_id', sim.id)
        .order('day');
      
      if (scores) setAllScores(scores as DayScore[]);
    }
  };

  const callSimulation = async (action: string, extra: any = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrum-simulation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, simulation_id: simulationId, day: currentDay, ...extra }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Simulation error');
    }

    return res.json();
  };

  const startSimulation = async () => {
    setLoading(true);
    try {
      const result = await callSimulation('start');
      if (result.simulation) {
        setSimulationId(result.simulation.id);
        setCurrentDay(1);
        setSimStatus('active');
      }
      if (result.messages) {
        setMessages(result.messages.map((m: any) => ({ speaker: m.speaker, content: m.content, role: 'team_member' })));
      }
      if (result.actions_available) setActions(result.actions_available);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');
    setMessages(prev => [...prev, { speaker: 'Scrum Master (You)', content: msg, role: 'user' }]);
    setLoading(true);

    try {
      const result = await callSimulation('message', { 
        message: msg, 
        ceremony: SPRINT_SCHEDULE[currentDay - 1]?.ceremonies[0]?.toLowerCase().replace(/ /g, '_') 
      });
      if (result.messages) {
        setMessages(prev => [...prev, ...result.messages.map((m: any) => ({ speaker: m.speaker, content: m.content, role: 'team_member' }))]);
      }
      if (result.actions_available) setActions(result.actions_available);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const endDay = async () => {
    setLoading(true);
    try {
      const result = await callSimulation('end_day');
      if (result.score) {
        setDayScore(result.score);
        setAllScores(prev => [...prev, result.score]);
      }
      if (result.messages) {
        setMessages(prev => [...prev, ...result.messages.map((m: any) => ({ speaker: m.speaker, content: m.content, role: 'team_member' }))]);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const startNextDay = async () => {
    const nextDay = currentDay + 1;
    if (nextDay > 10) {
      setSimStatus('completed');
      return;
    }
    setCurrentDay(nextDay);
    setMessages([]);
    setDayScore(null);
    setActions([]);
    setLoading(true);

    try {
      // Update simulationId to use the new one
      const result = await callSimulation('start_day', { day: nextDay, simulation_id: simulationId });
      if (result.messages) {
        setMessages(result.messages.map((m: any) => ({ speaker: m.speaker, content: m.content, role: 'team_member' })));
      }
      if (result.actions_available) setActions(result.actions_available);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const dayInfo = SPRINT_SCHEDULE[currentDay - 1];

  // Idle state - start screen
  if (simStatus === 'idle' && !simulationId) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/courses" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <img src={aladiahLogo} alt="Aladiah" className="h-16 w-auto object-contain mix-blend-multiply" />
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-6xl mb-6">🏃‍♂️</div>
            <h1 className="text-4xl font-display font-bold mb-4">Live Scrum Project</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Step into the role of Scrum Master for a 2-week sprint. Lead a team of 8 professionals
              through Sprint Planning, Daily Scrums, Backlog Refinement, Sprint Review, and Retrospective.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(TEAM_MEMBERS).filter(([k]) => k !== 'Narrator' && k !== 'Scrum Master (You)').map(([name, info]) => (
                <Card key={name} className="p-3 text-center">
                  <div className="text-2xl mb-1">{info.avatar}</div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">{info.role}</p>
                </Card>
              ))}
            </div>
            <Button size="lg" variant="coral" onClick={startSimulation} disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Start Sprint Simulation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  // Completed state
  if (simStatus === 'completed') {
    const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.total_score, 0) / allScores.length) : 0;
    const avgFacilitation = allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.facilitation_score, 0) / allScores.length) : 0;
    const avgCommunication = allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.communication_score, 0) / allScores.length) : 0;
    const avgArtifact = allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.artifact_score, 0) / allScores.length) : 0;
    const avgDecision = allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.decision_score, 0) / allScores.length) : 0;
    const grade = avgScore >= 90 ? 'A' : avgScore >= 80 ? 'B' : avgScore >= 70 ? 'C' : avgScore >= 60 ? 'D' : 'F';
    const strengths = [
      { label: 'Facilitation', score: avgFacilitation },
      { label: 'Communication', score: avgCommunication },
      { label: 'Artifacts', score: avgArtifact },
      { label: 'Decision Making', score: avgDecision },
    ].sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/courses" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <img src={aladiahLogo} alt="Aladiah" className="h-16 w-auto object-contain mix-blend-multiply" />
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold mb-2">Sprint Complete! 🎉</h1>
            <p className="text-lg text-muted-foreground">You've completed a full 2-week sprint simulation</p>
          </motion.div>

          {/* Certificate Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="mb-8 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-3xl font-display font-bold text-accent">{grade}</span>
                </div>
                <h2 className="text-2xl font-display font-bold mb-1">Scrum Master Simulation</h2>
                <p className="text-sm text-muted-foreground mb-4">Certificate of Completion</p>
                <div className="text-4xl font-display font-bold text-primary mb-1">{avgScore}/100</div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" /> Skills Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strengths.map((skill, i) => (
                  <div key={skill.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{i === 0 ? '💪 ' : ''}{skill.label}</span>
                      <span className="font-bold">{skill.score}/100</span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                    {i === 0 && <p className="text-xs text-muted-foreground mt-1">Your strongest area</p>}
                    {i === strengths.length - 1 && skill.score < 70 && (
                      <p className="text-xs text-secondary mt-1">Focus area for improvement</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Scores */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="font-display font-bold text-lg mb-3">Daily Performance</h3>
            <div className="space-y-3 mb-8">
              {allScores.map((score, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Day {i + 1} — {SPRINT_SCHEDULE[i]?.weekday}</span>
                    <span className={`font-bold ${score.total_score >= 75 ? 'text-primary' : score.total_score >= 50 ? 'text-secondary' : 'text-destructive'}`}>
                      {score.total_score}/100
                    </span>
                  </div>
                  {score.feedback && <p className="text-sm text-muted-foreground mt-2">{score.feedback}</p>}
                </Card>
              ))}
            </div>
          </motion.div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setSimStatus('idle'); setSimulationId(null); setAllScores([]); setMessages([]); }}>
              Start New Simulation
            </Button>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </div>
        </main>
      </div>
    );
  }

  // Active simulation
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/courses" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Day {currentDay}/10 — {dayInfo?.weekday}</span>
            </div>
            <div className="flex items-center gap-1">
              {dayInfo?.ceremonies.map(c => (
                <span key={c} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{c}</span>
              ))}
            </div>
          </div>
          <Progress value={(currentDay / 10) * 100} className="w-24 h-2" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Team sidebar */}
        <aside className="w-64 border-r bg-muted/20 p-4 hidden lg:block">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Team</h3>
          <div className="space-y-2">
            {Object.entries(TEAM_MEMBERS).filter(([k]) => k !== 'Narrator' && k !== 'Scrum Master (You)').map(([name, info]) => (
              <div key={name} className="flex items-center gap-2 p-2 rounded-lg bg-card text-sm">
                <span>{info.avatar}</span>
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{info.role}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Scores summary */}
          {allScores.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2"><Star className="w-4 h-4" /> Scores</h3>
              {allScores.map((s, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>Day {i + 1}</span>
                  <span className="font-semibold">{s.total_score}/100</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Day banner */}
          <div className="px-4 py-3 bg-primary/5 border-b">
            <p className="text-sm font-semibold text-primary">{dayInfo?.description}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => {
                const member = TEAM_MEMBERS[msg.speaker] || { role: 'Unknown', avatar: '💬' };
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                      {member.avatar}
                    </div>
                    <div className={`max-w-[70%] ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card border'} rounded-2xl px-4 py-3`}>
                      {!isUser && (
                        <p className="text-xs font-semibold mb-1 text-muted-foreground">
                          {msg.speaker} • {member.role}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
                <div className="bg-card border rounded-2xl px-4 py-3">
                  <p className="text-sm text-muted-foreground">Team is responding...</p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Day score overlay */}
          {dayScore && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 border-t bg-card">
              <div className="max-w-lg mx-auto">
                <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" /> Day {currentDay} Score
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { label: 'Facilitation', val: dayScore.facilitation_score },
                    { label: 'Communication', val: dayScore.communication_score },
                    { label: 'Artifacts', val: dayScore.artifact_score },
                    { label: 'Decisions', val: dayScore.decision_score },
                  ].map(s => (
                    <div key={s.label} className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-bold">{s.val}<span className="text-sm text-muted-foreground">/25</span></p>
                    </div>
                  ))}
                </div>
                <p className="text-lg font-bold text-center mb-2">Total: {dayScore.total_score}/100</p>
                {dayScore.feedback && <p className="text-sm text-muted-foreground mb-4">{dayScore.feedback}</p>}
                <Button className="w-full" onClick={startNextDay} disabled={loading}>
                  {currentDay >= 10 ? 'Complete Sprint' : `Start Day ${currentDay + 1}`}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Quick actions */}
          {actions.length > 0 && !dayScore && (
            <div className="px-4 py-2 border-t bg-muted/20 flex gap-2 flex-wrap">
              {actions.map((action, i) => (
                <Button key={i} variant="outline" size="sm" onClick={() => sendMessage(action)} disabled={loading}>
                  {action}
                </Button>
              ))}
            </div>
          )}

          {/* Input area */}
          {!dayScore && (
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2 max-w-3xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="As Scrum Master, what do you say or do?"
                  className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={loading}
                />
                <Button onClick={() => sendMessage()} disabled={loading || !input.trim()} size="icon" className="rounded-xl h-12 w-12">
                  <Send className="w-5 h-5" />
                </Button>
                <Button onClick={endDay} variant="outline" className="rounded-xl" disabled={loading || messages.length < 3}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  End Day
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrumSimulation;
