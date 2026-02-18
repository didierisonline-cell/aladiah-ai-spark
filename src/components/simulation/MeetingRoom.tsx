import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, Trophy, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Message, DayScore, TEAM_MEMBERS, SPRINT_SCHEDULE } from './SimulationTypes';

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

const MeetingRoom = ({
  messages, input, setInput, loading, currentDay, dayScore,
  actions, onSendMessage, onEndDay, onStartNextDay,
}: MeetingRoomProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dayInfo = SPRINT_SCHEDULE[currentDay - 1];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          <span className="text-xs text-muted-foreground">Day {currentDay}/8</span>
          <Progress value={(currentDay / 8) * 100} className="w-16 h-1.5" />
        </div>
      </div>

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

      {/* Quick actions */}
      {actions.length > 0 && !dayScore && (
        <div className="px-4 py-2 border-t bg-muted/20 flex gap-2 flex-wrap">
          {actions.map((action, i) => (
            <Button key={i} variant="outline" size="sm" onClick={() => onSendMessage(action)} disabled={loading} className="text-xs">
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
