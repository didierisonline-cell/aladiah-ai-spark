import { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, CheckCheck } from 'lucide-react';
import { AgentMessage, MessageType } from '@/types/aos';
import { setMessageStatus } from '@/services/aos/communication';

const TYPE_STYLES: Record<MessageType, string> = {
  message: 'bg-slate-100 text-slate-700 border-slate-200',
  task_request: 'bg-blue-100 text-blue-700 border-blue-200',
  report: 'bg-green-100 text-green-700 border-green-200',
  alert: 'bg-red-100 text-red-700 border-red-200',
  response: 'bg-purple-100 text-purple-700 border-purple-200',
};

/** Bus events (subject 'event:*' to broadcast) live in the Event Feed, not here. */
const isBusEvent = (m: AgentMessage) => m.to_agent === 'broadcast' && (m.subject ?? '').startsWith('event:');

const MessageFeed = ({ messages, onChange }: { messages: AgentMessage[]; onChange?: () => void }) => {
  const [busyId, setBusyId] = useState<string | null>(null);
  const visible = messages.filter((m) => !isBusEvent(m));

  const mark = useCallback(async (m: AgentMessage, status: 'read' | 'processed') => {
    setBusyId(m.id);
    try {
      await setMessageStatus(m.id, status);
      onChange?.();
    } finally {
      setBusyId(null);
    }
  }, [onChange]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Communication Layer</CardTitle>
        <p className="text-[12px] text-muted-foreground">
          Agent-to-agent messages. Bus events stream in the Event Feed instead.
        </p>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[460px] overflow-y-auto">
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">No agent messages yet.</p>
        ) : (
          visible.map((m) => (
            <div key={m.id} className={`rounded-lg border border-border/60 p-3 ${m.status === 'unread' ? 'bg-muted/40' : 'bg-muted/10'}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-medium text-foreground flex items-center gap-1">
                  {m.from_agent}
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  {m.to_agent}
                </p>
                <span className="flex items-center gap-1.5">
                  <Badge className={`text-[9px] border ${TYPE_STYLES[m.message_type]}`}>
                    {m.message_type}
                  </Badge>
                  {m.status === 'unread' && (
                    <Button
                      size="sm" variant="ghost" className="h-6 px-1.5"
                      onClick={() => mark(m, 'read')} disabled={busyId === m.id}
                      title="Mark read" aria-label="Mark message read"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  )}
                  {m.status === 'read' && (
                    <Button
                      size="sm" variant="ghost" className="h-6 px-1.5"
                      onClick={() => mark(m, 'processed')} disabled={busyId === m.id}
                      title="Mark processed" aria-label="Mark message processed"
                    >
                      <CheckCheck className="w-3 h-3" />
                    </Button>
                  )}
                </span>
              </div>
              {m.subject && <p className="text-xs font-medium text-foreground">{m.subject}</p>}
              {m.body && <p className="text-[11px] text-muted-foreground mt-0.5">{m.body}</p>}
              <p className="text-[10px] text-muted-foreground/70 mt-1">
                {new Date(m.created_at).toLocaleString()} · {m.status}
                {m.requires_response && ' · needs response'}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MessageFeed;
