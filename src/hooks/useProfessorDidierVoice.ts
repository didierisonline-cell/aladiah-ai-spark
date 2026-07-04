import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';

export type ProfessorStatus = 'idle' | 'connecting' | 'speaking' | 'listening' | 'disconnecting';

export interface VoiceSessionContext {
  lessonTitle: string;
  lessonDescription: string;
  moduleTitle: string;
  programTitle: string;
  progress: number;
  language: string;
  studentName?: string;
  boardTopic?: string;
  boardStep?: number;
}

export interface UseProfessorDidierVoiceReturn {
  status: ProfessorStatus;
  isConnected: boolean;
  isSpeaking: boolean;
  captions: string[];
  elapsedMs: number;
  connect: (ctx: VoiceSessionContext) => Promise<void>;
  disconnect: () => Promise<void>;
  clearCaptions: () => void;
}

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string;

const VOICES: Record<string, string> = {
  English: 'bQxW1c7YCr6VQgQhw8KX',
  Spanish: 'bQxW1c7YCr6VQgQhw8KX',
  French:  'IBGoh6rlxdauchOCULhL',
  German:  'WPbK7Qv9rbyhvUDiwJ0A',
  Chinese: 'pU9NaAwkoR3v0Mrg3uKz',
  Arabic:  'Ojb0nFbyzZn95u0i5a5p',
  Japanese:'Mv8AjrYZCBkdsmDHNwcB',
};

const LANG_CODES: Record<string, string> = {
  English: 'en', Spanish: 'es', French: 'fr',
  German: 'de', Chinese: 'zh', Arabic: 'ar', Japanese: 'ja',
};

const FIRST_MESSAGES: Record<string, (t: string) => string> = {
  English: t => `Hello! Welcome to today's class on "${t}". I'm Professor Didier, and I'll be guiding you through this lesson. Let's get started!`,
  Spanish: t => `¡Hola! Bienvenidos a la clase de hoy sobre "${t}". Soy el Profesor Didier. ¡Empecemos!`,
  French:  t => `Bonjour! Bienvenue au cours d'aujourd'hui sur « ${t} ». Je suis le Professeur Didier. Allons-y!`,
  German:  t => `Hallo! Willkommen zur heutigen Unterrichtsstunde über „${t}". Ich bin Professor Didier. Legen wir los!`,
  Chinese: t => `你好！欢迎来到今天关于"${t}"的课程。我是迪迪埃教授，我们开始吧！`,
  Arabic:  t => `مرحباً! أهلاً بكم في درس اليوم حول "${t}". أنا البروفيسور ديدييه. هيا نبدأ!`,
  Japanese:t => `こんにちは！今日の「${t}」の授業へようこそ。ディディエ教授です。さあ、始めましょう！`,
};

async function fetchSignedUrl(): Promise<string | null> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      }
    );
    const data = await res.json();
    return data.signed_url ?? null;
  } catch {
    return null;
  }
}

export function useProfessorDidierVoice(): UseProfessorDidierVoiceReturn {
  const [baseStatus, setBaseStatus] = useState<ProfessorStatus>('idle');
  const [captions, setCaptions] = useState<string[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const sessionStartTime = useRef<number | null>(null);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('[LiveClass] onConnect fired');
      sessionStartTime.current = Date.now();
      elapsedTimer.current = setInterval(() => {
        if (sessionStartTime.current) setElapsedMs(Date.now() - sessionStartTime.current);
      }, 1000);
      setBaseStatus('listening');
    },
    onMessage: (props: any) => {
      if (props.source === 'ai' && props.message) {
        setCaptions(prev => [...prev.slice(-4), props.message]);
      }
    },
    onDisconnect: (details: any) => {
      const elapsed = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
      const code = details?.code ?? 'unknown';
      const reason = details?.reason ?? '';
      const wasClean = details?.wasClean ?? false;
      let likelyCause = 'unknown';
      if (code === 1000) likelyCause = 'clean_close';
      else if (code === 1001) likelyCause = 'going_away';
      else if (code === 1006) likelyCause = elapsed < 10000 ? 'auth_or_key_error' : 'network_drop';
      console.log(`[LiveClass] onDisconnect code=${code} reason=${reason} wasClean=${wasClean} elapsedMs=${elapsed} likelyCause=${likelyCause}`);
      sessionStartTime.current = null;
      if (elapsedTimer.current) { clearInterval(elapsedTimer.current); elapsedTimer.current = null; }
      setElapsedMs(0);
      setBaseStatus('idle');
    },
    onError: (error: any) => {
      console.error('[LiveClass] onError:', error);
      setBaseStatus('idle');
    },
    onStatusChange: ({ status: s }: { status: string }) => {
      console.log('[LiveClass] status changed:', s);
    },
  });

  useEffect(() => () => {
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);
  }, []);

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

  const connect = useCallback(async (ctx: VoiceSessionContext) => {
    setBaseStatus('connecting');
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
      } catch (micError: any) {
        setBaseStatus('idle');
        throw micError;
      }

      const lang = ctx.language || 'English';
      const prompt = `You are Professor Didier, an expert ${ctx.programTitle} instructor at Aladiah Academy. You are leading a private live 1-on-1 class session.

CURRENT LESSON: ${ctx.lessonTitle}
MODULE: ${ctx.moduleTitle}
PROGRAM: ${ctx.programTitle}
DESCRIPTION: ${ctx.lessonDescription}
STUDENT PROGRESS: ${ctx.progress}%
BOARD TOPIC: ${ctx.boardTopic || ctx.lessonTitle}
MODE: live_classroom

INSTRUCTIONS:
1. Greet the student warmly and introduce today's topic
2. Teach the content clearly with examples and real-world scenarios
3. Speak in ${lang}. Follow the student's language if they switch
4. Keep it conversational — this is a live 1-on-1 session, not a lecture
5. After key concepts, ask the student a question to check understanding
6. Refer to the board visuals when explaining concepts: "As you can see on the board..."
7. This is a private classroom — never mention views, likes, or public audiences`;

      const firstMessage = (FIRST_MESSAGES[lang] || FIRST_MESSAGES.English)(ctx.lessonTitle);

      const signedUrl = await fetchSignedUrl();
      const opts: any = {
        overrides: {
          agent: {
            language: LANG_CODES[lang] || 'en',
            prompt: { prompt },
            firstMessage,
          },
          tts: {
            voiceId: VOICES[lang] || VOICES.English,
            stability: 0.71,
            similarityBoost: 0.55,
          },
        },
      };
      if (signedUrl) {
        opts.signedUrl = signedUrl;
      } else {
        opts.agentId = AGENT_ID;
      }

      await conversation.startSession(opts);
      stream.getTracks().forEach(t => t.stop());
    } catch (error: any) {
      setBaseStatus('idle');
      throw error;
    }
  }, [conversation]);

  const disconnect = useCallback(async () => {
    setBaseStatus('disconnecting');
    await conversation.endSession();
  }, [conversation]);

  const clearCaptions = useCallback(() => setCaptions([]), []);

  const status: ProfessorStatus = isConnected
    ? (isSpeaking ? 'speaking' : 'listening')
    : baseStatus;

  return { status, isConnected, isSpeaking, captions, elapsedMs, connect, disconnect, clearCaptions };
}
