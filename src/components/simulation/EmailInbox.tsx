import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Circle, AlertTriangle, Clock, Reply, BookOpen, Youtube, ExternalLink, Shield, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimEmail } from './SimulationTypes';
import { RISK_YOUTUBE_RECOMMENDATIONS } from './DailyEmails';

interface EmailInboxProps {
  emails: SimEmail[];
  onMarkRead: (id: string) => void;
  onReplyEmail?: (emailId: string, reply: string) => void;
}

const priorityConfig: Record<string, { icon: any; color: string; label: string }> = {
  high: { icon: AlertTriangle, color: 'text-destructive', label: 'Urgent' },
  normal: { icon: Mail, color: 'text-primary', label: 'Normal' },
  low: { icon: Clock, color: 'text-muted-foreground', label: 'Low' },
};

// Risk guidance for common email scenarios
const RISK_GUIDANCE: Record<string, { steps: string[]; riskCategory: string }> = {
  'security': {
    steps: [
      '1. Log the risk in the Risk Register with impact assessment',
      '2. Assign an owner (typically the Security Engineer)',
      '3. Define mitigation actions and timeline',
      '4. Escalate to stakeholders if impact is Critical',
      '5. Track in daily standups until resolved',
      '6. Update risk status as mitigation progresses',
    ],
    riskCategory: 'security_vulnerability',
  },
  'blocker': {
    steps: [
      '1. Identify the blocker\'s root cause and affected stories',
      '2. Add to the Risk Register as an impediment',
      '3. Escalate immediately — don\'t wait for the next standup',
      '4. Find workarounds or re-sequence work',
      '5. Communicate impact to the Product Owner',
      '6. Follow up until the blocker is resolved',
    ],
    riskCategory: 'blocker',
  },
  'scope': {
    steps: [
      '1. Acknowledge the request respectfully',
      '2. Assess impact on current sprint goal',
      '3. Discuss with the team — can it fit without removing something?',
      '4. If it can\'t fit, negotiate: add to next sprint or swap stories',
      '5. Document the decision and communicate to stakeholders',
      '6. Protect the sprint goal — that\'s your job as SM',
    ],
    riskCategory: 'scope_creep',
  },
  'absence': {
    steps: [
      '1. Assess which stories are affected',
      '2. Check if any team member can pick up critical work',
      '3. Re-prioritize if needed — focus on sprint goal',
      '4. Update the board to reflect reality',
      '5. Communicate to PO about any impact on commitments',
      '6. Plan for knowledge transfer when they return',
    ],
    riskCategory: 'team_absence',
  },
};

function detectEmailCategory(email: SimEmail): string | null {
  const text = (email.subject + ' ' + email.body).toLowerCase();
  if (text.includes('security') || text.includes('vulnerability') || text.includes('iam') || text.includes('penetration')) return 'security';
  if (text.includes('blocker') || text.includes('blocked') || text.includes('quota') || text.includes('failure')) return 'blocker';
  if (text.includes('scope') || text.includes('urgent') && text.includes('requirement') || text.includes('compliance requirement')) return 'scope';
  if (text.includes('sick') || text.includes('absent') || text.includes('calling in')) return 'absence';
  return null;
}

const EmailInbox = ({ emails, onMarkRead, onReplyEmail }: EmailInboxProps) => {
  const [selectedEmail, setSelectedEmail] = useState<SimEmail | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const unreadCount = emails.filter(e => !e.read).length;

  const openEmail = (email: SimEmail) => {
    setSelectedEmail(email);
    setShowGuidance(false);
    setShowReply(false);
    setReplyText('');
    if (!email.read) onMarkRead(email.id);
  };

  const category = selectedEmail ? detectEmailCategory(selectedEmail) : null;
  const guidance = category ? RISK_GUIDANCE[category] : null;
  const videos = guidance ? RISK_YOUTUBE_RECOMMENDATIONS[guidance.riskCategory] || [] : [];

  if (selectedEmail) {
    const cfg = priorityConfig[selectedEmail.priority] || priorityConfig.normal;
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-4 border-b bg-card flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(null)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h2 className="font-display font-bold text-sm">{selectedEmail.subject}</h2>
            <p className="text-xs text-muted-foreground">From: {selectedEmail.from} • Day {selectedEmail.day} • {selectedEmail.timestamp}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="max-w-2xl mx-auto bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {selectedEmail.from[0]}
              </div>
              <div>
                <p className="font-semibold text-sm">{selectedEmail.from}</p>
                <p className="text-xs text-muted-foreground">to: Scrum Master (You)</p>
              </div>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</div>
          </div>

          {/* Action buttons */}
          <div className="max-w-2xl mx-auto flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowReply(!showReply)}>
              <Reply className="w-3 h-3 mr-1" /> Reply
            </Button>
            {guidance && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowGuidance(!showGuidance)}>
                <BookOpen className="w-3 h-3 mr-1" /> SM Guidance
              </Button>
            )}
            {guidance && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowGuidance(!showGuidance)}>
                <Shield className="w-3 h-3 mr-1" /> How to Register This Risk
              </Button>
            )}
          </div>

          {/* Reply section */}
          <AnimatePresence>
            {showReply && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="max-w-2xl mx-auto overflow-hidden"
              >
                <div className="bg-card border rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground">Reply as Scrum Master:</p>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full h-24 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="text-xs" onClick={() => {
                      if (onReplyEmail && replyText.trim()) {
                        onReplyEmail(selectedEmail.id, replyText);
                        setReplyText('');
                        setShowReply(false);
                      }
                    }} disabled={!replyText.trim()}>
                      <Send className="w-3 h-3 mr-1" /> Send Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowReply(false)}>Cancel</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Risk guidance panel */}
          <AnimatePresence>
            {showGuidance && guidance && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="max-w-2xl mx-auto overflow-hidden"
              >
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-4">
                  <div>
                    <p className="text-sm font-bold flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-primary" /> Scrum Master Action Guide
                    </p>
                    <div className="space-y-1">
                      {guidance.steps.map((step, i) => (
                        <p key={i} className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                      ))}
                    </div>
                  </div>

                  {/* How to register the risk */}
                  <div className="border-t border-primary/20 pt-3">
                    <p className="text-xs font-bold flex items-center gap-1 mb-2">
                      <Shield className="w-3 h-3 text-primary" /> How to Register This Risk
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Go to the <strong>Risk Register</strong> tab and create an entry with:</p>
                      <p>• <strong>Risk:</strong> Describe what could go wrong</p>
                      <p>• <strong>Impact:</strong> High / Medium / Low</p>
                      <p>• <strong>Owner:</strong> Who is responsible for mitigation</p>
                      <p>• <strong>Mitigation:</strong> What actions will reduce the risk</p>
                      <p>• <strong>Status:</strong> Open → Mitigated → Closed</p>
                    </div>
                  </div>

                  {/* Related YouTube videos */}
                  {videos.length > 0 && (
                    <div className="border-t border-primary/20 pt-3">
                      <p className="text-xs font-bold flex items-center gap-1 mb-2">
                        <Youtube className="w-3 h-3 text-destructive" /> Learn More
                      </p>
                      <div className="space-y-2">
                        {videos.map((v, i) => (
                          <a
                            key={i}
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg bg-card hover:bg-muted transition-colors text-xs"
                          >
                            <Youtube className="w-4 h-4 text-destructive flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium">{v.title}</p>
                              <p className="text-muted-foreground">{v.reason}</p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Inbox
          </h2>
          {unreadCount > 0 && (
            <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full font-bold">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Project Nebula communications</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No emails yet</p>
            <p className="text-xs">Emails will appear as the simulation progresses</p>
          </div>
        ) : (
          <AnimatePresence>
            {emails.map((email, i) => {
              const cfg = priorityConfig[email.priority] || priorityConfig.normal;
              const Icon = cfg.icon;
              const emailCategory = detectEmailCategory(email);
              return (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => openEmail(email)}
                  className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${!email.read ? 'bg-primary/5' : ''}`}
                >
                  {!email.read && <Circle className="w-2 h-2 fill-primary text-primary flex-shrink-0" />}
                  {email.read && <div className="w-2" />}
                  <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${!email.read ? 'font-bold' : 'font-medium'}`}>
                        {email.subject}
                      </p>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        {emailCategory && <Shield className="w-3 h-3 text-primary" />}
                        <span className="text-[10px] text-muted-foreground">Day {email.day}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {email.from} — {email.body.slice(0, 80)}...
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default EmailInbox;
