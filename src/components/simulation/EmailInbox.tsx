import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Circle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimEmail } from './SimulationTypes';

interface EmailInboxProps {
  emails: SimEmail[];
  onMarkRead: (id: string) => void;
}

const priorityConfig: Record<string, { icon: any; color: string; label: string }> = {
  high: { icon: AlertTriangle, color: 'text-destructive', label: 'Urgent' },
  normal: { icon: Mail, color: 'text-primary', label: 'Normal' },
  low: { icon: Clock, color: 'text-muted-foreground', label: 'Low' },
};

const EmailInbox = ({ emails, onMarkRead }: EmailInboxProps) => {
  const [selectedEmail, setSelectedEmail] = useState<SimEmail | null>(null);
  const unreadCount = emails.filter(e => !e.read).length;

  const openEmail = (email: SimEmail) => {
    setSelectedEmail(email);
    if (!email.read) onMarkRead(email.id);
  };

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
        <div className="flex-1 p-6 overflow-y-auto">
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
                      <span className="text-[10px] text-muted-foreground ml-2 flex-shrink-0">Day {email.day}</span>
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
