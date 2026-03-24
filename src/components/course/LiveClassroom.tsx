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
      toast({ title: "🎙️ Live Class Started!", description: `${professorName} is ready for you.` });
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
      // Safari requires explicit audio constraints — { audio: true } throws "Invalid constraint"
      await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      await conversation.startSession({
        agentId: "agent_8801kkd1edrbet2rhmnsjynyk80q",
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
  }, [conversation, toast]);

  const endClass = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

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

        {/* Professor Avatar */}
        <div className="flex flex-col items-center py-10 px-6">
          <div className={`relative w-32 h-32 rounded-full mb-6 flex items-center justify-center text-5xl font-bold text-white shadow-2xl transition-all ${isActive ? "bg-gradient-to-br from-secondary to-orange-500 ring-4 ring-secondary/40 ring-offset-4 ring-offset-[#0a0f1e]" : "bg-gradient-to-br from-blue-600 to-cyan-500"}`}>
            {professorName[0]}
            {isActive && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-[#0a0f1e] flex items-center justify-center">
                {conversation.isSpeaking ? <Volume2 className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
              </div>
            )}
          </div>

          <h3 className="text-white font-bold text-xl mb-1">{professorName}</h3>
          <p className="text-white/50 text-sm mb-2">Live Interactive Professor</p>

          {isActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${conversation.isSpeaking ? "bg-secondary/20 text-secondary" : "bg-green-500/20 text-green-400"}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${conversation.isSpeaking ? "bg-secondary" : "bg-green-400"}`} />
                {conversation.isSpeaking ? `${professorName} is speaking...` : "Your turn — speak now"}
              </div>
            </motion.div>
          )}

          {/* Lesson context */}
          {!isActive && !showQuizCTA && (
            <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 text-center">
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-gradient-to-r from-secondary/20 to-orange-500/20 border border-secondary/30 rounded-2xl p-5 mb-6 text-center">
                <CheckCircle className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-1">Lesson Complete! 🎉</h3>
                <p className="text-white/60 text-sm mb-4">Lock in your learning — take the quiz now while it&apos;s fresh</p>
                <Button onClick={() => { onClose(); setTimeout(() => document.querySelector("[data-quiz-btn]")?.dispatchEvent(new MouseEvent("click")), 100); }} className="bg-secondary hover:bg-secondary/80 text-white font-bold px-8">
                  Take the Quiz Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action button */}
          {!showQuizCTA && (
            !isActive ? (
              <Button onClick={startClass} disabled={isConnecting} size="lg" className="bg-secondary hover:bg-secondary/80 text-white font-bold px-10 py-4 text-base rounded-2xl shadow-lg">
                {isConnecting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting...</> : <><Phone className="w-5 h-5 mr-2" /> Start Live Class</>}
              </Button>
            ) : (
              <Button onClick={endClass} variant="destructive" size="lg" className="px-10 py-4 text-base rounded-2xl">
                <PhoneOff className="w-5 h-5 mr-2" /> End Class
              </Button>
            )
          )}

          <p className="text-white/30 text-xs mt-4 text-center max-w-sm">
            {isActive ? `Speak naturally in ${language} — ${professorName} will guide you through the lesson` : "Real-time voice conversation • Speak in your language"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveClassroom;
