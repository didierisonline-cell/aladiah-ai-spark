import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, Trophy, ArrowRight, Users, Pause, Play, Sparkles, X, Youtube, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Message, DayScore, TEAM_MEMBERS, SPRINT_SCHEDULE } from './SimulationTypes';
import { RISK_YOUTUBE_RECOMMENDATIONS } from './DailyEmails';
import { supabase } from '@/integrations/supabase/client';

interface MeetingRoomProps {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  currentDay: number;
  dayScore: DayScore | null;
  actions: string[];
  onSendMessage: (text?: string) => void;
  onEndDay: () => void;
  onStartNextDay: () => void;
}

// Daily ceremony YouTube recommendations
const CEREMONY_VIDEOS: Record<string, { title: string; query: string; duration: string }[]> = {
  "Sprint Planning": [
    { title: "Sprint Planning Meeting — Complete Guide", query: "sprint planning meeting step by step guide scrum", duration: "12 min" },
    { title: "How to Write Effective Sprint Goals", query: "how to write sprint goal examples scrum", duration: "8 min" },
  ],
  "Daily StandUp": [
    { title: "Running Effective Daily Standups", query: "effective daily standup meeting tips scrum master", duration: "7 min" },
    { title: "Common Daily Standup Anti-Patterns", query: "daily standup anti-patterns what not to do", duration: "10 min" },
  ],
  "Backlog Refinement": [
    { title: "Backlog Refinement Best Practices", query: "backlog refinement grooming session best practices", duration: "9 min" },
    { title: "Story Point Estimation Techniques", query: "story point estimation techniques planning poker", duration: "11 min" },
  ],
  "Sprint Review": [
    { title: "How to Run a Sprint Review", query: "sprint review meeting guide stakeholders demo", duration: "10 min" },
    { title: "Sprint Review vs Sprint Demo", query: "sprint review vs demo difference scrum", duration: "6 min" },
  ],
  "Retrospective": [
    { title: "Sprint Retrospective Formats That Work", query: "sprint retrospective formats techniques scrum master", duration: "12 min" },
    { title: "Facilitating Difficult Retrospectives", query: "facilitating difficult retrospective conversations agile", duration: "9 min" },
  ],
  "Scrum of Scrums": [
    { title: "Scrum of Scrums Explained", query: "scrum of scrums meeting explained scaled agile", duration: "8 min" },
  ],
};

const MeetingRoom = ({
  messages, input, setInput, loading, currentDay, dayScore,
  actions, onSendMessage, onEndDay, onStartNextDay,
}: MeetingRoomProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dayInfo = SPRINT_SCHEDULE[currentDay - 1];
  const [isPaused, setIsPaused] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showVideos, setShowVideos] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get relevant videos for today's ceremonies
  const todayVideos = dayInfo?.ceremonies.flatMap(c => CEREMONY_VIDEOS[c] || []) || [];

  // Get risk-related videos
  const riskVideos = Object.values(RISK_YOUTUBE_RECOMMENDATIONS).flat().slice(0, 3);

  const askAIDuringPause = async () => {
    if (!aiQuestion.trim() || aiLoading) return;
    setAiLoading(true);
    setAiAnswer('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const recentContext = messages.slice(-5).map(m => `[${m.speaker}]: ${m.content}`).join('\n');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `I'm in a Scrum simulation (Day ${currentDay}, ${dayInfo?.ceremonies.join(', ')}). Here's the recent meeting context:\n\n${recentContext}\n\nMy question: ${aiQuestion}` }
          ],
          studentContext: { currentTopic: `Scrum Simulation Day ${currentDay}`, courseProgress: 50, labTopic: dayInfo?.description },
          mode: 'lab_interactive',
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { fullText += content; setAiAnswer(fullText); }
          } catch { /* partial */ }
        }
      }
    } catch {
      setAiAnswer('Sorry, I couldn\'t process that. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Day ceremony banner */}
      <div className="px-4 py-3 bg-primary/5 border-b flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{dayInfo?.description}</p>
          <div className="flex items-center gap-1 mt-1">
            {dayInfo?.ceremonies.map(c => (
              <span key={c} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] h-7"
            onClick={() => setShowVideos(!showVideos)}
          >
            <Youtube className="w-3 h-3 mr-1 text-destructive" />
            Videos
          </Button>
          <span className="text-xs text-muted-foreground">Day {currentDay}/8</span>
          <Progress value={(currentDay / 8) * 100} className="w-16 h-1.5" />
        </div>
      </div>

      {/* YouTube recommendations panel */}
      <AnimatePresence>
        {showVideos && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-card overflow-hidden"
          >
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground">📹 Recommended Learning Videos</p>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setShowVideos(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {todayVideos.map((v, i) => (
                  <a
                    key={i}
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs"
                  >
                    <Youtube className="w-4 h-4 text-destructive flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{v.title}</p>
                      <p className="text-muted-foreground">{v.duration}</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  </a>
                ))}
                {riskVideos.map((v, i) => (
                  <a
                    key={`risk-${i}`}
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors text-xs"
                  >
                    <Youtube className="w-4 h-4 text-destructive flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{v.title}</p>
                      <p className="text-muted-foreground">{v.reason}</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team roster bar */}
      <div className="px-4 py-2 border-b bg-muted/20 flex items-center gap-2 overflow-x-auto">
        <Users className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        {Object.entries(TEAM_MEMBERS).filter(([k]) => k !== 'Narrator' && k !== 'Scrum Master (You)').map(([name, info]) => (
          <div key={name} className="flex items-center gap-1 px-2 py-1 rounded-full bg-card border text-[10px] flex-shrink-0" title={info.role}>
            <span>{info.avatar}</span>
            <span className="font-medium">{name}</span>
          </div>
        ))}
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
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base ${isUser ? 'bg-primary/10' : 'bg-muted'}`}>
                  {member.avatar}
                </div>
                <div className={`max-w-[75%] ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card border'} rounded-2xl px-4 py-3`}>
                  {!isUser && (
                    <p className="text-[10px] font-bold mb-1 text-muted-foreground uppercase tracking-wider">
                      {msg.speaker} • {member.role}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
            <div className="bg-card border rounded-2xl px-4 py-3">
              <p className="text-sm text-muted-foreground italic">Team is responding...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Pause & Ask AI Panel */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t bg-accent/5 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> Meeting Paused — Ask Your AI Mentor
                </p>
                <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => { setIsPaused(false); setAiAnswer(''); setAiQuestion(''); }}>
                  <Play className="w-3 h-3 mr-1" /> Resume
                </Button>
              </div>
              {aiAnswer && (
                <div className="bg-card border rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {aiAnswer}
                </div>
              )}
              {aiLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" /> AI Mentor is thinking...
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={e => setAiQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && askAIDuringPause()}
                  placeholder="Ask about what's happening in this meeting..."
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={aiLoading}
                />
                <Button size="sm" onClick={askAIDuringPause} disabled={aiLoading || !aiQuestion.trim()}>
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day score overlay */}
      {dayScore && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 border-t bg-card">
          <div className="max-w-lg mx-auto">
            <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" /> Day {currentDay} Score
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { label: 'Facilitation', val: dayScore.facilitation_score },
                { label: 'Communication', val: dayScore.communication_score },
                { label: 'Artifacts', val: dayScore.artifact_score },
                { label: 'Decisions', val: dayScore.decision_score },
              ].map(s => (
                <div key={s.label} className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-display font-bold">{s.val}<span className="text-sm text-muted-foreground">/25</span></p>
                </div>
              ))}
            </div>
            <p className="text-lg font-bold text-center mb-2">Total: {dayScore.total_score}/100</p>
            {dayScore.feedback && <p className="text-sm text-muted-foreground mb-4">{dayScore.feedback}</p>}
            <Button className="w-full" onClick={onStartNextDay} disabled={loading}>
              {currentDay >= 8 ? 'Complete Sprint' : `Start Day ${currentDay + 1}`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick actions + Pause button */}
      {!dayScore && (
        <div className="px-4 py-2 border-t bg-muted/20 flex gap-2 flex-wrap items-center">
          <Button
            variant={isPaused ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs"
          >
            {isPaused ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
            {isPaused ? 'Resume' : 'Pause & Ask AI'}
          </Button>
          {actions.length > 0 && !isPaused && actions.map((action, i) => (
            <Button key={i} variant="outline" size="sm" onClick={() => onSendMessage(action)} disabled={loading} className="text-xs">
              {action}
            </Button>
          ))}
        </div>
      )}

      {/* Input area */}
      {!dayScore && !isPaused && (
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSendMessage()}
              placeholder="As Scrum Master, what do you say or do?"
              className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={loading}
            />
            <Button onClick={() => onSendMessage()} disabled={loading || !input.trim()} size="icon" className="rounded-xl h-12 w-12">
              <Send className="w-5 h-5" />
            </Button>
            <Button onClick={onEndDay} variant="outline" className="rounded-xl" disabled={loading || messages.length < 3}>
              <CheckCircle className="w-4 h-4 mr-2" />
              End Day
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
