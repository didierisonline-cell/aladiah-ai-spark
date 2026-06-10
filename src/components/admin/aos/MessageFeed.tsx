import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { AgentMessage, MessageType } from '@/types/aos';

const TYPE_STYLES: Record<MessageType, string> = {
  message: 'bg-slate-100 text-slate-700 border-slate-200',
  task_request: 'bg-blue-100 text-blue-700 border-blue-200',
  report: 'bg-green-100 text-green-700 border-green-200',
  alert: 'bg-red-100 text-red-700 border-red-200',
  response: 'bg-purple-100 text-purple-700 border-purple-200',
};

const MessageFeed = ({ messages }: { messages: AgentMessage[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Communication Layer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[460px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No agent messages yet.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-medium text-foreground flex items-center gap-1">
                  {m.from_agent}
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  {m.to_agent}
                </p>
                <Badge className={`text-[9px] border ${TYPE_STYLES[m.message_type]}`}>
                  {m.message_type}
                </Badge>
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
