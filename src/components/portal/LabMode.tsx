import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FlaskConical, Send, ArrowLeft, Lightbulb, BookOpen,
  CheckCircle, XCircle, Sparkles, Target, TrendingUp
} from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

interface LabModeProps {
  topic: string;
  studentContext: {
    courseProgress: number;
    points: number;
    streak: number;
    weakAreas: string[];
  };
  onExit: () => void;
}

const LabMode = ({ topic, studentContext, onExit }: LabModeProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [phase, setPhase] = useState<'breakdown' | 'interactive'>('breakdown');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-start with topic breakdown
  useEffect(() => {
    startLabBreakdown();
  }, []);

  const streamAI = useCallback(async (allMessages: Msg[], mode: string) => {
    setIsStreaming(true);
    let assistantSoFar = '';

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          studentContext: {
            ...studentContext,
            labTopic: topic,
          },
          mode,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }

      // Extract suggestions from the response
      extractSuggestions(assistantSoFar);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again! 🙏' }]);
    } finally {
      setIsStreaming(false);
    }
  }, [studentContext, topic]);

  const extractSuggestions = (response: string) => {
    const newSuggestions: string[] = [];
    if (response.toLowerCase().includes('sprint') && !response.toLowerCase().includes('sprint planning in detail')) {
      newSuggestions.push('Tell me more about Sprint Planning');
    }
    if (response.toLowerCase().includes('scrum master')) {
      newSuggestions.push('What are the key responsibilities of a Scrum Master?');
    }
    if (response.toLowerCase().includes('backlog')) {
      newSuggestions.push('How do I prioritize a Product Backlog?');
    }
    if (response.toLowerCase().includes('retrospective')) {
      newSuggestions.push('Show me a Retrospective exercise');
    }
    if (response.toLowerCase().includes('practice') || response.toLowerCase().includes('exercise')) {
      newSuggestions.push('Give me a practice scenario');
    }
    if (newSuggestions.length === 0) {
      newSuggestions.push('Give me a practice question on this');
      newSuggestions.push('Explain this with a real-world example');
    }
    setSuggestions(newSuggestions.slice(0, 3));
  };

  const startLabBreakdown = async () => {
    const systemMsg: Msg = {
      role: 'user',
      content: `I want to enter Lab Mode to deeply learn about: "${topic}". Break this topic down for me step by step. Start with the fundamentals, give me clear definitions, real-world analogies, and then check my understanding with a question. Adapt to my level — I'm at ${studentContext.courseProgress}% course progress.`,
    };
    setMessages([systemMsg]);
    await streamAI([systemMsg], 'lab_interactive');
    setPhase('interactive');
  };

  const sendMessage = useCallback(async (text?: string) => {
    const content = text || input.trim();
    if (!content || isStreaming) return;
    const userMsg: Msg = { role: 'user', content };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setSuggestions([]);
    await streamAI(allMessages, 'lab_interactive');
  }, [input, isStreaming, messages, streamAI]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      {/* Lab Mode Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                Lab Mode
                <Badge variant="secondary" className="text-[10px]">ACTIVE</Badge>
              </h2>
              <p className="text-sm text-muted-foreground truncate max-w-[250px] md:max-w-none">
                Topic: {topic}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onExit}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Exit Lab
          </Button>
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="h-[500px] flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                }`}>
                  {m.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Smart Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && !isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-4 pb-2"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-medium text-muted-foreground">Smart suggestions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5 px-3"
                    onClick={() => sendMessage(s)}
                  >
                    <Lightbulb className="w-3 h-3 mr-1 text-accent" />
                    {s}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a follow-up, answer questions, or explore deeper..."
              disabled={isStreaming}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isStreaming || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default LabMode;
