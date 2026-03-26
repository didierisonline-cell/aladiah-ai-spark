import { useState, useCallback, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useConversation } from "@elevenlabs/react";
import { X, Phone, PhoneOff, Loader2, Volume2, Mic, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  videoId: string;
  title: string;
  description: string;
  chapterTitle: string;
  courseTitle: string;
  agentKey?: string;
  language?: string;
  onComplete: () => void;
  onClose: () => void;
}

const PROFESSOR_NAMES: Record<string, string> = {
  professor: "Professor Didier",
  career: "Bettyna",
  interview: "Charly",
  resume: "Juan Carlos",
  scrum: "Maria",
};

const LANG_LABELS: Record<string, { startClass: string; askProf: string; speakNaturally: string }> = {
  English: { startClass: 'Start Live Class', pauseClass: 'Stop Class', resumeClass: 'Start Over', endQuiz: 'End & Quiz', askProf: 'Ask Prof. Didier', speakNaturally: 'Speak naturally in English' },
  Spanish: { startClass: 'Iniciar Clase en Vivo', pauseClass: 'Pausar Clase', resumeClass: 'Empezar de nuevo', endQuiz: 'Terminar y Quiz', askProf: 'Preguntar al Prof. Didier', speakNaturally: 'Habla naturalmente en Español' },
  French: { startClass: 'Démarrer le Cours', pauseClass: 'Pause', resumeClass: 'Recommencer', endQuiz: 'Terminer et Quiz', askProf: 'Demander au Prof. Didier', speakNaturally: 'Parlez naturellement en Français' },
  German: { startClass: 'Live-Kurs starten', pauseClass: 'Pause', resumeClass: 'Neu starten', endQuiz: 'Beenden und Quiz', askProf: 'Prof. Didier fragen', speakNaturally: 'Sprechen Sie natürlich auf Deutsch' },
  Chinese: { startClass: '开始直播课', pauseClass: '暂停', resumeClass: '重新开始', endQuiz: '结束并测验', askProf: '问迪迪埃教授', speakNaturally: '用中文自然交流' },
  Arabic: { startClass: 'بدء الدرس المباشر', pauseClass: 'إيقاف مؤقت', resumeClass: 'ابدأ من جديد', endQuiz: 'إنهاء واختبار', askProf: 'اسأل الأستاذ ديدييه', speakNaturally: 'تحدث بشكل طبيعي بالعربية' },
  Japanese: { startClass: 'ライブ授業を開始', pauseClass: '一時停止', resumeClass: 'やり直す', endQuiz: '終了してクイズ', askProf: 'ディディエ先生に質問', speakNaturally: '日本語で自然に話してください' },
};

const LANG_OPTIONS = [
  { code: 'English', flag: '🇺🇸', label: 'EN' },
  { code: 'Spanish', flag: '🇪🇸', label: 'ES' },
  { code: 'French', flag: '🇫🇷', label: 'FR' },
  { code: 'German', flag: '🇩🇪', label: 'DE' },
  { code: 'Chinese', flag: '🇨🇳', label: 'ZH' },
  { code: 'Arabic', flag: '🇸🇦', label: 'AR' },
  { code: 'Japanese', flag: '🇯🇵', label: 'JA' },
];

const LiveClassroom = ({
  title, description, chapterTitle, courseTitle,
  agentKey = "professor", language = "English",
  onComplete, onClose
}: Props) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const langCodeToName: Record<string, string> = {
    en: "English", es: "Spanish", fr: "French",
    de: "German", zh: "Chinese", ar: "Arabic", ja: "Japanese"
  };
  const [selectedLanguage, setSelectedLanguage] = useState(
    langCodeToName[globalLanguage] || language || "English"
  );

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const langMap: Record<string, string> = {
      'English': 'en', 'Spanish': 'es', 'French': 'fr',
      'German': 'de', 'Chinese': 'zh', 'Arabic': 'ar', 'Japanese': 'ja'
    };
    if (langMap[lang]) setGlobalLanguage(langMap[lang] as any);
  };
  const [showQuizCTA, setShowQuizCTA] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [classEnded, setClassEnded] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [showCC, setShowCC] = useState(true);
  const sessionStartTime = useRef<number | null>(null);
  const { toast } = useToast();
  const professorName = PROFESSOR_NAMES[agentKey] || "Professor Didier";

  const conversation = useConversation({
    onConnect: () => {
      sessionStartTime.current = Date.now();
      toast({ title: "🎙️ Live Class Started!", description: `${professorName} is ready for you.` });
    },
    onMessage: (props: any) => {
      if (props.source === 'ai' && props.message) {
        setCaptions(prev => [...prev.slice(-4), props.message]);
      }
    },
    onDisconnect: () => {
      const duration = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
      if (sessionStarted && duration > 30000) {
        setShowQuizCTA(true);
        onComplete();
      }
    },
    onError: (error) => {
      console.error("Voice error:", error);
      toast({ title: "Connection error", description: "Could not connect. Please try again.", variant: "destructive" });
    },
  });

  const isActive = conversation.status === "connected";

  const startClass = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      setSessionStarted(true);
      const langMap: Record<string, string> = {
        English: "en", Spanish: "es", French: "fr",
        German: "de", Chinese: "zh", Arabic: "ar", Japanese: "ja"
      };
      const lessonPrompt = `You are Professor Didier, an expert Scrum Master and Project Management instructor at Aladiah Academy. You are teaching a live class.

LESSON: ${title}
CHAPTER: ${chapterTitle}
COURSE: ${courseTitle}
DESCRIPTION: ${description}

INSTRUCTIONS:
1. Start by greeting the student warmly and introducing today's topic: "${title}"
2. Focus ONLY on the content described above — do not go off topic
3. Teach the material clearly, using examples and real-world scenarios
4. If the student asks about something unrelated, politely redirect: "Great question! Let's cover that after we finish today's lesson on ${title}."
5. Speak in ${selectedLanguage}. If the student switches languages, follow their lead.
6. Keep explanations concise and engaging — this is a live interactive class, not a lecture
7. After covering the key points, ask the student questions to check understanding
8. Encourage the student to take the quiz after class`;

      await conversation.startSession({
        agentId: "agent_2001kmf3cdyaem4t7fej8z81jp1b",
        overrides: {
          agent: {
            language: langMap[selectedLanguage] || "en",
            prompt: { prompt: lessonPrompt },
            firstMessage: `Hello! Welcome to today's class on "${title}". I'm Professor Didier, and I'll be guiding you through this lesson. Let's get started!`,
          }
        }
      });
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        toast({ title: "Microphone required", description: "Please allow microphone access.", variant: "destructive" });
      } else {
        toast({ title: "Failed to connect", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, toast, title, chapterTitle, courseTitle, description, selectedLanguage]);

  const endClass = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const pauseClass = useCallback(async () => {
    await conversation.endSession();
    setIsPaused(true);
  }, [conversation]);

  const resumeClass = useCallback(async () => {
    setIsPaused(false);
    setSessionStarted(false);
    try {
      const langMap: Record<string, string> = {
        English: "en", Spanish: "es", French: "fr",
        German: "de", Chinese: "zh", Arabic: "ar", Japanese: "ja"
      };
      await conversation.startSession({
        agentId: "agent_2001kmf3cdyaem4t7fej8z81jp1b",
        overrides: {
          agent: {
            language: langMap[selectedLanguage] || "en",
            prompt: { prompt: `You are Professor Didier continuing a live class on "${title}" (${chapterTitle}, ${courseTitle}). ${description}. Resume teaching from where you left off. Speak in ${selectedLanguage}.` },
            firstMessage: `Welcome back! Let's continue our lesson on "${title}".`,
          }
        }
      });
      setSessionStarted(true);
    } catch (e) {
      console.error(e);
    }
  }, [conversation, title, chapterTitle, courseTitle, description, selectedLanguage]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0a0f1e] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
            <p className="text-white/40 text-sm">{chapterTitle} • {courseTitle}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cinematic Board */}
        <div className="w-full rounded-t-2xl overflow-hidden relative" style={{minHeight: 200}}>
          <div className="absolute inset-0" style={{backgroundImage: 'url(/yaounde-monument.png)', backgroundSize: 'cover', backgroundPosition: 'center top'}}>
            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(1px 1px at 20% 15%, white 0%, transparent 100%), radial-gradient(1px 1px at 80% 25%, white 0%, transparent 100%), radial-gradient(1.5px 1.5px at 50% 10%, white 0%, transparent 100%), radial-gradient(1px 1px at 35% 40%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 70% 35%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 15% 60%, rgba(255,255,255,0.3) 0%, transparent 100%)', opacity: 0.8}} />
            <div className="absolute bottom-0 left-0 right-0 h-20 opacity-25" style={{background: 'linear-gradient(180deg, transparent, #0a1628)', borderTop: '1px solid rgba(255,255,255,0.05)'}} />
          </div>
          <div className="relative z-10 flex flex-col items-center pt-6 pb-4 px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl ${isActive ? "bg-gradient-to-br from-secondary to-orange-500 ring-2 ring-secondary/50" : "bg-gradient-to-br from-blue-600 to-cyan-500"}`}>
                {professorName[0]}
                {isActive && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-[#060d1f] flex items-center justify-center">
                  {conversation.isSpeaking ? <Volume2 className="w-2 h-2 text-white" /> : <Mic className="w-2 h-2 text-white" />}
                </div>}
              </div>
              <div>
                <p className="text-white font-bold">{professorName}</p>
                <p className="text-blue-300 text-xs">Live Interactive Professor</p>
              </div>
              {isActive && <div className="flex items-center gap-1 bg-red-500/20 border border-red-400/40 rounded-full px-2 py-0.5 ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-red-300 text-xs font-bold">LIVE</span>
              </div>}
            </div>
            {isActive && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-2 ${conversation.isSpeaking ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-green-500/20 text-green-400 border border-green-400/30"}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${conversation.isSpeaking ? "bg-secondary" : "bg-green-400"}`} />
                {conversation.isSpeaking ? `${professorName} is speaking...` : "Your turn — speak now"}
              </div>
            )}

            {/* Subtitle / CC board */}
            <div className="w-full relative">
              {isActive && (
                <button
                  onClick={() => setShowCC(!showCC)}
                  className="absolute -top-6 right-0 text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/50 hover:text-white/80 transition-colors z-10"
                >
                  CC {showCC ? 'ON' : 'OFF'}
                </button>
              )}
              <div className="w-full bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 min-h-12 border border-white/10" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {isActive && showCC && captions.length > 0 ? (
                  <div className="space-y-1">
                    {captions.map((cap, i) => (
                      <p key={i} className="text-sm text-center leading-relaxed" style={{ color: i === captions.length - 1 ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                        {cap}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-white text-sm text-center leading-relaxed">
                    {description || title || 'Ready to start your live class'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-4">
          {!isActive && !showQuizCTA && (
            <div className="w-full bg-white/5 rounded-2xl p-4 mb-4 text-center">
              <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{description}</p>
            </div>
          )}

          {/* Voice waveform when active */}
          {isActive && (
            <div className="flex gap-1 items-end h-12 mb-6">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 rounded-full ${conversation.isSpeaking ? "bg-secondary" : "bg-blue-400"}`}
                  animate={{ height: conversation.isSpeaking ? [4, Math.random() * 36 + 8, 4] : 4 }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                />
              ))}
            </div>
          )}

          {/* Quiz CTA */}
          <AnimatePresence>
            {showQuizCTA && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-gradient-to-r from-secondary/20 to-orange-500/20 border border-secondary/30 rounded-2xl p-5 mb-6 text-center relative">
                <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-sm">✕</button>
                <CheckCircle className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">Lesson Complete! 🎉</h3>
                <p className="text-white/60 text-sm mb-4">Lock in your learning — take the quiz now while it&apos;s fresh</p>
                <Button onClick={() => { onClose(); setTimeout(() => document.querySelector("[data-quiz-btn]")?.dispatchEvent(new MouseEvent("click")), 100); }} className="bg-secondary hover:bg-secondary/80 text-white font-bold px-8">
                  Take the Quiz Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Language switcher */}
          {!isActive && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
              {LANG_OPTIONS.map(l => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', border: '1px solid',
                    borderColor: selectedLanguage === l.code ? 'rgba(96,165,250,0.6)' : 'rgba(255,255,255,0.15)',
                    background: selectedLanguage === l.code ? 'rgba(96,165,250,0.15)' : 'transparent',
                    color: selectedLanguage === l.code ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          )}

          {/* Action button */}
          {!showQuizCTA && (
            classEnded ? (
              <Button onClick={endClass} variant="destructive" size="lg" className="px-10 py-4 text-base rounded-2xl">
                <PhoneOff className="w-5 h-5 mr-2" /> End Class & Take Quiz
              </Button>
            ) : !isActive && !isPaused ? (
              <Button onClick={startClass} disabled={isConnecting} size="lg" className="bg-secondary hover:bg-secondary/80 text-white font-bold px-10 py-4 text-base rounded-2xl shadow-lg">
                {isConnecting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting...</> : <><Phone className="w-5 h-5 mr-2" />{LANG_LABELS[selectedLanguage]?.startClass || "Start Live Class"}</>}
              </Button>
            ) : isPaused ? (
              <div className="flex gap-3">
                <Button onClick={resumeClass} size="lg" className="bg-secondary hover:bg-secondary/80 text-white font-bold px-10 py-4 text-base rounded-2xl">
                  <Phone className="w-5 h-5 mr-2" />{LANG_LABELS[selectedLanguage]?.resumeClass || "Start Over"}
                </Button>
                <Button onClick={endClass} variant="destructive" size="lg" className="px-6 py-4 text-base rounded-2xl">
                  {LANG_LABELS[selectedLanguage]?.endQuiz || "End & Quiz"}
                </Button>
              </div>
            ) : (
              <Button onClick={pauseClass} size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-10 py-4 text-base rounded-2xl">
                <PhoneOff className="w-5 h-5 mr-2" />{LANG_LABELS[selectedLanguage]?.pauseClass || "Stop Class"}
              </Button>
            )
          )}

          <p className="text-white/30 text-xs mt-4 text-center max-w-sm">
            {isActive ? `${LANG_LABELS[selectedLanguage]?.speakNaturally || "Speak naturally"} — ${professorName} will guide you through the lesson` : "Real-time voice conversation • Speak in your language"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveClassroom;
