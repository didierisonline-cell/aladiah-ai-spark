import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowRight, ChevronLeft, Loader2, Trophy, Star,
  MessageSquare, LayoutGrid, Mail, AlertTriangle, BarChart3, Cloud
} from 'lucide-react';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';
import {
  Message, DayScore, BoardStory, SimEmail, RiskItem, ExecutiveReport,
  TEAM_MEMBERS, SPRINT_SCHEDULE, INITIAL_BACKLOG
} from '@/components/simulation/SimulationTypes';
import MeetingRoom from '@/components/simulation/MeetingRoom';
import JiraBoard from '@/components/simulation/JiraBoard';
import EmailInbox from '@/components/simulation/EmailInbox';
import RiskBoard from '@/components/simulation/RiskBoard';
import ReportsDashboard from '@/components/simulation/ReportsDashboard';
import SimulationGlossary from '@/components/simulation/SimulationGlossary';
import { DAILY_RISK_EMAILS } from '@/components/simulation/DailyEmails';
import { Progress } from '@/components/ui/progress';
import BackToPortal from '@/components/portal/BackToPortal';

type SimTab = 'meeting' | 'jira' | 'email' | 'risks' | 'reports';

const TABS: { id: SimTab; label: string; icon: any }[] = [
  { id: 'meeting', label: 'Meeting Room', icon: MessageSquare },
  { id: 'jira', label: 'Jira Board', icon: LayoutGrid },
  { id: 'email', label: 'Inbox', icon: Mail },
  { id: 'risks', label: 'Risk Register', icon: AlertTriangle },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

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
  const [activeTab, setActiveTab] = useState<SimTab>('meeting');

  // Simulation data
  const [stories, setStories] = useState<BoardStory[]>([...INITIAL_BACKLOG]);
  const [emails, setEmails] = useState<SimEmail[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [executiveReports, setExecutiveReports] = useState<ExecutiveReport[]>([]);

  useEffect(() => { checkExistingSimulation(); }, []);

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

      const { data: msgs } = await supabase
        .from('simulation_messages')
        .select('*')
        .eq('simulation_id', sim.id)
        .eq('day', sim.current_day)
        .order('created_at', { ascending: true });

      if (msgs && msgs.length > 0) {
        setMessages(msgs.map(m => ({
          id: m.id, speaker: m.speaker || 'Narrator', content: m.content, role: m.role,
        })));
      }

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

  const processAIResult = useCallback((result: any) => {
    if (result.board_updates) {
      setStories(prev => {
        const updated = [...prev];
        for (const upd of result.board_updates) {
          const idx = updated.findIndex(s => s.id === upd.story_id);
          if (idx >= 0) updated[idx] = { ...updated[idx], status: upd.to };
        }
        return updated;
      });
    }
    if (result.emails) {
      setEmails(prev => [
        ...result.emails.map((e: any, i: number) => ({
          ...e,
          id: `email-${Date.now()}-${i}`,
          day: currentDay,
          read: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })),
        ...prev,
      ]);
    }
    if (result.risks) {
      setRisks(prev => [
        ...prev,
        ...result.risks.map((r: any, i: number) => ({
          ...r,
          id: `risk-${Date.now()}-${i}`,
          day: currentDay,
          status: r.status || 'open',
        })),
      ]);
    }
    if (result.executive_report) {
      setExecutiveReports(prev => [...prev, { ...result.executive_report, day: currentDay }]);
    }
  }, [currentDay]);

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
      processAIResult(result);
      // Inject pre-written Day 1 risk emails
      const dayEmails = DAILY_RISK_EMAILS[1] || [];
      setEmails(prev => [
        ...dayEmails.map((e, i) => ({ ...e, id: `preset-1-${i}`, read: false, timestamp: '9:00 AM' })),
        ...prev,
      ]);
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
      processAIResult(result);
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
      processAIResult(result);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const startNextDay = async () => {
    const nextDay = currentDay + 1;
    if (nextDay > 8) { setSimStatus('completed'); return; }
    setCurrentDay(nextDay);
    setMessages([]);
    setDayScore(null);
    setActions([]);
    setLoading(true);

    // Inject pre-written risk emails for the new day
    const dayEmails = DAILY_RISK_EMAILS[nextDay] || [];
    if (dayEmails.length > 0) {
      setEmails(prev => [
        ...dayEmails.map((e, i) => ({ ...e, id: `preset-${nextDay}-${i}`, read: false, timestamp: '8:30 AM' })),
        ...prev,
      ]);
    }

    try {
      const result = await callSimulation('start_day', { day: nextDay, simulation_id: simulationId });
      if (result.messages) {
        setMessages(result.messages.map((m: any) => ({ speaker: m.speaker, content: m.content, role: 'team_member' })));
      }
      if (result.actions_available) setActions(result.actions_available);
      processAIResult(result);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const markEmailRead = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const handleReplyEmail = (emailId: string, reply: string) => {
    // Send the reply as a message in the simulation context
    sendMessage(`[Email Reply] RE: ${emails.find(e => e.id === emailId)?.subject || 'email'} — ${reply}`);
  };

  const unreadEmails = emails.filter(e => !e.read).length;
  const openRisks = risks.filter(r => r.status === 'open').length;

  // ===== IDLE STATE =====
  if (simStatus === 'idle' && !simulationId) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/courses" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <img src={aladiahLogo} alt="Aladiah" className="h-16 w-auto object-contain mix-blend-multiply" />
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <BackToPortal />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Cloud className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-3">Project Nebula</h1>
            <p className="text-xl text-muted-foreground mb-2">On-Premises to AWS Cloud Migration</p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-8">
              Step into the role of Scrum Master for an enterprise cloud migration program.
              Lead a team of 7 through an 8-day sprint — including Sprint Planning, Daily StandUps,
              Backlog Refinement, Sprint Review, and Retrospective. Manage a real Jira board,
              handle emails, track risks, and produce executive reports.
            </p>

            {/* Sprint overview */}
            <Card className="mb-8 text-left max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-sm mb-3">🎯 Sprint Goal</h3>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  "Provision secure AWS infrastructure and migrate the Authentication Service while
                  validating deployment automation, monitoring, and security controls."
                </p>
                <h3 className="font-display font-bold text-sm mb-3">👥 Your Team</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {Object.entries(TEAM_MEMBERS).filter(([k]) => k !== 'Narrator' && k !== 'Scrum Master (You)').map(([name, info]) => (
                    <div key={name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-xs">
                      <span className="text-lg">{info.avatar}</span>
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-muted-foreground">{info.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-display font-bold text-sm mb-3">📋 What You'll Use</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {TABS.map(tab => (
                    <div key={tab.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 text-xs">
                      <tab.icon className="w-4 h-4 text-primary" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button size="xl" variant="coral" onClick={startSimulation} disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Launch Sprint Simulation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  // ===== COMPLETED STATE =====
  if (simStatus === 'completed') {
    const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.total_score, 0) / allScores.length) : 0;
    const grade = avgScore >= 90 ? 'A' : avgScore >= 80 ? 'B' : avgScore >= 70 ? 'C' : avgScore >= 60 ? 'D' : 'F';
    const skills = [
      { label: 'Facilitation', score: allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.facilitation_score, 0) / allScores.length) : 0 },
      { label: 'Communication', score: allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.communication_score, 0) / allScores.length) : 0 },
      { label: 'Artifacts', score: allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.artifact_score, 0) / allScores.length) : 0 },
      { label: 'Decision Making', score: allScores.length > 0 ? Math.round(allScores.reduce((s, sc) => s + sc.decision_score, 0) / allScores.length) : 0 },
    ].sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/courses" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <img src={aladiahLogo} alt="Aladiah" className="h-16 w-auto object-contain mix-blend-multiply" />
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold mb-2">Sprint Complete! 🎉</h1>
            <p className="text-lg text-muted-foreground">Project Nebula — AWS Cloud Migration Sprint</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="mb-8 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="mb-8">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-display font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" /> Skills Report
                </h3>
                {skills.map((skill, i) => (
                  <div key={skill.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{i === 0 ? '💪 ' : ''}{skill.label}</span>
                      <span className="font-bold">{skill.score}/100</span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setSimStatus('idle'); setSimulationId(null); setAllScores([]); setMessages([]); setStories([...INITIAL_BACKLOG]); setEmails([]); setRisks([]); setExecutiveReports([]); }}>
              Start New Simulation
            </Button>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </div>
        </main>
      </div>
    );
  }

  // ===== ACTIVE SIMULATION =====
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top header */}
      <header className="border-b bg-card z-50 flex-shrink-0">
        <div className="px-4 py-2 flex items-center justify-between">
          <Link to="/courses" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-3 h-3" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-primary" />
            <span className="text-sm font-display font-bold">Project Nebula</span>
            <span className="text-xs text-muted-foreground">Day {currentDay}/8 • {SPRINT_SCHEDULE[currentDay - 1]?.weekday}</span>
          </div>
          <Progress value={(currentDay / 8) * 100} className="w-20 h-1.5" />
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="border-b bg-card flex-shrink-0 px-2 flex items-center gap-1 overflow-x-auto">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const badge = tab.id === 'email' && unreadEmails > 0 ? unreadEmails
            : tab.id === 'risks' && openRisks > 0 ? openRisks
            : null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 relative ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              {badge && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] rounded-full flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'meeting' && (
          <MeetingRoom
            messages={messages}
            input={input}
            setInput={setInput}
            loading={loading}
            currentDay={currentDay}
            dayScore={dayScore}
            actions={actions}
            onSendMessage={sendMessage}
            onEndDay={endDay}
            onStartNextDay={startNextDay}
          />
        )}
        {activeTab === 'jira' && (
          <JiraBoard stories={stories} currentDay={currentDay} onStoriesChange={setStories} />
        )}
        {activeTab === 'email' && (
          <EmailInbox emails={emails} onMarkRead={markEmailRead} onReplyEmail={handleReplyEmail} />
        )}
        {activeTab === 'risks' && (
          <RiskBoard risks={risks} currentDay={currentDay} />
        )}
        {activeTab === 'reports' && (
          <ReportsDashboard
            stories={stories}
            scores={allScores}
            executiveReports={executiveReports}
            risks={risks}
            currentDay={currentDay}
          />
        )}
      </div>
      {/* Floating Glossary */}
      <SimulationGlossary currentDay={currentDay} simulationId={simulationId} />
    </div>
  );
};

export default ScrumSimulation;
