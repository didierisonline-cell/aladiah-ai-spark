import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enrollment-chat`;

const suggestedQuestions = [
  "What certifications does the program cover?",
  "How long is the program?",
  "What's included in the $1,999 price?",
  "I'm new to Scrum — is this for me?",
];

const SHOW_DELAY_MS = 2 * 60 * 1000; // 2 minutes

export default function EnrollmentChatbot() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show chatbot after 2 minutes on site
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Send greeting when first opened
  useEffect(() => {
    if (open && !hasGreeted && messages.length === 0) {
      setHasGreeted(true);
      sendMessage("Hi, I'm interested in learning more about the program.");
    }
  }, [open, hasGreeted, messages.length]);

  const streamChat = useCallback(async (allMessages: Msg[], onDelta: (t: string) => void, onDone: () => void) => {
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429 || resp.status === 402) {
        onDelta("I'm a bit busy right now. Please try again in a moment!");
        onDone();
        return;
      }
      throw new Error('Stream failed');
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buf.indexOf('\n')) !== -1) {
        let line = buf.slice(0, idx);
        buf = buf.slice(idx + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6).trim();
        if (json === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(json);
          const c = parsed.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch { buf = line + '\n' + buf; break; }
      }
    }
    onDone();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: Msg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    
    // Don't show the initial greeting as a user message
    const isGreeting = text === "Hi, I'm interested in learning more about the program." && messages.length === 0;
    
    if (!isGreeting) {
      setMessages(newMessages);
    }
    setIsLoading(true);
    setInput('');

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat(isGreeting ? [userMsg] : newMessages, upsert, () => setIsLoading(false));
    } catch {
      upsert("Sorry, something went wrong. Please try again!");
      setIsLoading(false);
    }
  }, [messages, streamChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
  };

  if (!visible) return null;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 p-0"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-foreground/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Aladiah Advisor</p>
                <p className="text-xs opacity-80">Ask about our programs</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[340px]">
              {messages.length === 0 && !isLoading && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>Your enrollment advisor is ready!</p>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}>
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none [&>p]:m-0 [&>p+p]:mt-1.5">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested questions after first assistant message */}
              {messages.length === 1 && messages[0].role === 'assistant' && !isLoading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about our programs..."
                className="flex-1 text-sm h-9"
                disabled={isLoading}
              />
              <Button type="submit" size="sm" disabled={!input.trim() || isLoading} className="h-9 w-9 p-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
