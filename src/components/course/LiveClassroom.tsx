import { useState, useCallback } from "react";
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

const CROWN_FLAGS = ["\u{1F1FA}\u{1F1F8}", "\u{1F1EA}\u{1F1F8}", "\u{1F1EB}\u{1F1F7}", "\u{1F1E9}\u{1F1EA}", "\u{1F1E8}\u{1F1F3}", "\u{1F1F8}\u{1F1E6}", "\u{1F1EF}\u{1F1F5}"];

const LiveClassroom = ({
  title, description, chapterTitle, courseTitle,
  agentKey = "professor", language = "English",
  onComplete, onClose
}: Props) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showQuizCTA, setShowQuizCTA] = useState(false);
  const { toast } = useToast();
  const professorName = PROFESSOR_NAMES[agentKey] || "Professor Didier";

  const conversation = useConversation({
    onConnect: () => {
      toast({ title: "\u{1F399}\uFE0F Live Class Started!", description: `${professorName} is ready for you.` });
    },
    onDisconnect: () => {
      setShowQuizCTA(true);
      onComplete();
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
      try {
        await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
      } catch {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      await conversation.startSession({ agentId: "agent_8801kkd1edrbet2rhmnsjynyk80q" });
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        toast({ title: "Microphone required", description: "Please allow microphone access.", variant: "destructive" });
      } else {
        toast({ title: "Failed to connect", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const endClass = useCallback(async () => { await conversation.endSession(); }, [conversation]);

  const crownFlags = ["\u{1F1FA}\u{1F1F8}", "\u{1F1EA}\u{1F1F8}", "\u{1F1EB}\u{1F1F7}", "\u{1F1E9}\u{1F1EA}", "\u{1F1E8}\u{1F1F3}", "\u{1F1F8}\u{1F1E6}", "\u{1F1EF}\u{1F1F5}"];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0a0f1e] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
            <p className="text-white/40 text-sm">{chapterTitle} \u2022 {courseTitle}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center py-10 px-6">
          <div className="relative mb-8" style={{ width: 220, height: 220 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: isActive ? "radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,146,60,0.2) 50%, transparent 75%)" : "radial-gradient(circle, rgba(251,191,36,0.2) 0%, rgba(59,130,246,0.1) 50%, transparent 75%)", transform: "scale(1.3)", transition: "background 0.5s ease" }} />
            <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute" style={{ width: 2, height: 18, background: isActive ? "rgba(251,191,36,0.5)" : "rgba(251,191,36,0.2)", left: "50%", top: "50%", transformOrigin: "0 -90px", transform: `rotate(${i * 30}deg) translateX(-50%)`, borderRadius: 2 }} />
              ))}
            </motion.div>
            {crownFlags.map((flag, i) => {
              const angle = (i / crownFlags.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 88;
              const x = Math.cos(angle) * radius + 110 - 18;
              const y = Math.sin(angle) * radius + 110 - 18;
              return (
                <motion.div key={i} className="absolute flex items-center justify-center" style={{ left: x, top: y, width: 36, height: 36, fontSize: 22, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }} animate={{ scale: isActive ? [1, 1.2, 1] : 1, y: isActive ? [0, -3, 0] : 0 }} transition={{ duration: 2, repeat: isActive ? Infinity : 0, delay: i * 0.2, ease: "easeInOut" }}>
                  {flag}
                </motion.div>
              );
            })}
            <div className="absolute" style={{ left: 110 - 52, top: 110 - 52, width: 104, height: 104 }}>
              <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl transition-all duration-500 ${isActive ? "bg-gradient-to-br from-amber-400 to-orange-500 ring-4 ring-amber-400/50 ring-offset-4 ring-offset-[#0a0f1e]" : "bg-gradient-to-br from-blue-600 to-cyan-500"}`}>
                {professorName[0]}
              </div>
              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-[#0a0f1e] flex items-center justify-center">
                  {conversation.isSpeaking ? <Volume2 className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
                </motion.div>
              )}
            </div>
          </div>

          <h3 className="text-white font-bold text-xl mb-1">{professorName}</h3>
          <p className="text-white/50 text-sm mb-2">Live Interactive Professor</p>

          {isActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${conversation.isSpeaking ? "bg-amber-500/20 text-amber-400" : "bg-green-500/20 text-green-400"}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${conversation.isSpeaking ? "bg-amber-400" : "bg-green-400"}`} />
                {conversation.isSpeaking ? `${professorName} is speaking...` : "Your turn \u2014 speak now"}
              </div>
            </motion.div>
          )}

          {!isActive && !showQuizCTA && (
            <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 text-center">
              <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{description}</p>
            </div>
          )}

          {isActive && (
            <div className="flex gap-1 items-end h-12 mb-6">
              {[...Array(16)].map((_, i) => (
                <motion.div key={i} className={`w-1.5 rounded-full ${conversation.isSpeaking ? "bg-amber-400" : "bg-blue-400"}`} animate={{ height: conversation.isSpeaking ? [4, Math.random() * 36 + 8, 4] : 4 }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }} />
              ))}
            </div>
          )}

          <AnimatePresence>
            {showQuizCTA && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-5 mb-6 text-center">
                <CheckCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">Lesson Complete! \u{1F389}</h3>
                <p className="text-white/60 text-sm mb-4">Lock in your learning \u2014 take the quiz now while it&apos;s fresh</p>
                <Button onClick={() => { onClose(); setTimeout(() => document.querySelector("[data-quiz-btn]")?.dispatchEvent(new MouseEvent("click")), 100); }} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8">
                  Take the Quiz Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showQuizCTA && (
            !isActive ? (
              <Button onClick={startClass} disabled={isConnecting} size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-10 py-4 text-base rounded-2xl shadow-lg border-0">
                {isConnecting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting...</> : <><Phone className="w-5 h-5 mr-2" /> Start Live Class</>}
              </Button>
            ) : (
              <Button onClick={endClass} variant="destructive" size="lg" className="px-10 py-4 text-base rounded-2xl">
                <PhoneOff className="w-5 h-5 mr-2" /> End Class
              </Button>
            )
          )}

          <p className="text-white/30 text-xs mt-4 text-center max-w-sm">
            {isActive ? `Speak naturally in ${language} \u2014 ${professorName} will guide you through the lesson` : "Real-time voice conversation \u2022 Speak in your language"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveClassroom;
