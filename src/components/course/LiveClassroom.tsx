import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, X, Loader2, Volume2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BACKEND = "http://localhost:3001";

interface Message {
  role: "professor" | "student";
  text: string;
}

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
  quizUrl?: string;
}

const PROFESSOR_AVATARS: Record<string, { avatarId: string; name: string; color: string }> = {
  professor: { avatarId: "Armando_Suit_Front_public", name: "Professor Didier", color: "from-blue-600 to-cyan-500" },
  career:    { avatarId: "Adriana_Business_Front_public", name: "Bettyna", color: "from-pink-500 to-rose-500" },
  interview: { avatarId: "Adrian_public_2_20240312", name: "Charly", color: "from-slate-600 to-blue-700" },
  resume:    { avatarId: "Aditya_public_1", name: "Juan Carlos", color: "from-orange-500 to-amber-500" },
  scrum:     { avatarId: "Abigail_expressive_2024112501", name: "Maria", color: "from-emerald-500 to-teal-500" },
};

type Phase = "intro" | "teaching" | "questioning" | "answering" | "concluding" | "done";

const LiveClassroom = ({
  videoId, title, description, chapterTitle, courseTitle,
  agentKey = "professor", language = "English",
  onComplete, onClose, quizUrl
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuizCTA, setShowQuizCTA] = useState(false);
  const recognitionRef = useRef<any>(null);
  const professor = PROFESSOR_AVATARS[agentKey] || PROFESSOR_AVATARS.professor;

  const speak = useCallback(async (text: string, sid: string) => {
    setIsSpeaking(true);
    setMessages(m => [...m, { role: "professor", text }]);
    try {
      await fetch(`${BACKEND}/heygen/session/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, text })
      });
    } catch (e) { console.error(e); }
    setTimeout(() => setIsSpeaking(false), text.length * 60);
  }, []);

  const askClaude = useCallback(async (studentMessage: string, currentPhase: Phase, sid: string) => {
    setIsLoading(true);
    const systemContext = `You are ${professor.name}, a live interactive professor at Aladiah Academy teaching "${title}" from the course "${courseTitle}".

LESSON CONTENT: ${description}

TEACHING STYLE: Fully conversational and Socratic. You teach in short segments (2-3 sentences max), then ask the student a question to check understanding. Guide them through the lesson content step by step.

CURRENT PHASE: ${currentPhase}
RULES:
- Keep each response under 60 words for voice delivery
- Always end with either a question OR a clear next instruction
- If student answers correctly: praise them briefly and continue to next concept
- If student answers incorrectly: gently correct and re-explain simply
- After covering all key concepts: conclude the lesson, congratulate the student, and tell them to take the quiz NOW
- When concluding: say "Excellent work! You have completed this lesson. Now take the quiz to lock in your learning — click the quiz button on your screen right now!"
- Respond in ${language}`;

    try {
      const res = await fetch(`${BACKEND}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: studentMessage,
          agentKey,
          language,
          history: messages.map(m => ({ role: m.role === "professor" ? "assistant" : "user", content: m.text })),
          system: systemContext
        })
      });
      const data = await res.json();
      const response = data.response;

      if (response.toLowerCase().includes("take the quiz") || response.toLowerCase().includes("quiz button")) {
        setPhase("done");
        setShowQuizCTA(true);
        onComplete();
      } else if (currentPhase === "teaching") {
        setPhase("questioning");
      } else {
        setPhase("teaching");
      }

      await speak(response, sid);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  }, [professor, title, courseTitle, description, language, agentKey, messages, speak, onComplete]);

  const startSession = useCallback(async () => {
    setConnecting(true);
    try {
      const newRes = await fetch(`${BACKEND}/heygen/session/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: professor.avatarId })
      });
      const newData = await newRes.json();
      const sid = newData.data?.session_id;
      if (!sid) throw new Error("No session");
      setSessionId(sid);

      const pc = new RTCPeerConnection();
      peerRef.current = pc;
      pc.ontrack = (e) => { if (videoRef.current && e.streams[0]) videoRef.current.srcObject = e.streams[0]; };
      pc.onicecandidate = async ({ candidate }) => {
        if (candidate) await fetch(`${BACKEND}/heygen/session/ice`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid, candidate })
        });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const startRes = await fetch(`${BACKEND}/heygen/session/start`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, sdpOffer: offer })
      });
      const startData = await startRes.json();
      if (startData.data?.sdp) await pc.setRemoteDescription(new RTCSessionDescription(startData.data.sdp));

      setConnected(true);
      setConnecting(false);
      setPhase("intro");

      setTimeout(async () => {
        const intro = `Welcome! I am ${professor.name} and today we are covering ${title}. Let me start by asking you — what do you already know about this topic?`;
        await speak(intro, sid);
        setPhase("teaching");
      }, 2000);
    } catch (e) {
      console.error(e);
      setConnecting(false);
    }
  }, [professor, title, speak]);

  const handleStudentMessage = async (text: string) => {
    if (!text.trim() || !sessionId || isLoading) return;
    setMessages(m => [...m, { role: "student", text }]);
    setInput("");
    await askClaude(text, phase, sessionId);
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "French" ? "fr-FR" : language === "Spanish" ? "es-ES" : "en-US";
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      handleStudentMessage(transcript);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => { return () => { peerRef.current?.close(); }; }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-full max-h-[90vh] flex gap-4">

        {/* Avatar Panel */}
        <div className="flex-1 relative bg-gray-950 rounded-2xl overflow-hidden flex flex-col">
          {connected ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${professor.color} flex items-center justify-center text-5xl font-bold text-white shadow-2xl`}>
                {professor.name[0]}
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-bold mb-1">{professor.name}</h3>
                <p className="text-white/50 text-sm mb-6">Live Interactive Professor</p>
                <p className="text-white/70 text-sm mb-6 max-w-xs">"{title}"</p>
                {connecting ? (
                  <div className="flex items-center gap-2 text-white/60"><Loader2 className="w-5 h-5 animate-spin" />Connecting...</div>
                ) : (
                  <Button onClick={startSession} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base">
                    <Volume2 className="w-5 h-5 mr-2" /> Start Live Class
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Status bar */}
          {connected && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Live</span>
              </div>
              {isSpeaking && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1">
                  <span className="text-blue-400 text-xs">Professor speaking...</span>
                </div>
              )}
            </div>
          )}

          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black transition-all">
            <X className="w-4 h-4" />
          </button>

          {/* Quiz CTA */}
          <AnimatePresence>
            {showQuizCTA && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <div className="bg-gradient-to-r from-secondary to-orange-500 rounded-2xl p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-white mx-auto mb-2" />
                  <h3 className="text-white font-bold text-lg mb-1">Lesson Complete!</h3>
                  <p className="text-white/80 text-sm mb-3">Lock in your learning — take the quiz now</p>
                  <Button onClick={() => window.location.href = quizUrl || "#quiz"} className="bg-white text-secondary font-bold px-6">
                    Take the Quiz Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Panel */}
        <div className="w-80 flex flex-col bg-gray-900 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-white/40 text-xs mt-1">{chapterTitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "student" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.role === "student" ? "bg-blue-600 text-white" : "bg-white/10 text-white/90"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-3 py-2">
                  <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {connected && !showQuizCTA && (
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2 mb-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleStudentMessage(input)}
                  placeholder="Type your response..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 text-sm"
                  disabled={isSpeaking || isLoading}
                />
                <Button onClick={() => handleStudentMessage(input)} disabled={!input.trim() || isSpeaking || isLoading} size="sm" className="bg-blue-600 hover:bg-blue-700 shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <button
                onClick={isListening ? stopVoice : startVoice}
                disabled={isSpeaking || isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
              >
                {isListening ? <><MicOff className="w-4 h-4" /> Stop Listening</> : <><Mic className="w-4 h-4" /> Speak to Professor</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClassroom;
