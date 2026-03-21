import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, X, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BACKEND = "http://localhost:3001";

// Professor → HeyGen avatar ID mapping
// Update these with real HeyGen avatar IDs from your account
const PROFESSOR_AVATARS: Record<string, { avatarId: string; voiceId: string; name: string; color: string }> = {
  professor: { avatarId: "Daisy-inskirt-20220818", voiceId: "1bd001e7e50f421d891986aad5158bc8", name: "Professor Didier", color: "from-blue-600 to-cyan-500" },
  career:    { avatarId: "Daisy-inskirt-20220818", voiceId: "2d5b0e6cf36f460aa7fc47e3eee4ba54", name: "Bettyna", color: "from-pink-500 to-rose-500" },
  interview: { avatarId: "Eric_public_pro2_20230608", voiceId: "1bd001e7e50f421d891986aad5158bc8", name: "Charly", color: "from-slate-600 to-blue-700" },
  resume:    { avatarId: "Eric_public_pro2_20230608", voiceId: "2d5b0e6cf36f460aa7fc47e3eee4ba54", name: "Juan Carlos", color: "from-orange-500 to-amber-500" },
  scrum:     { avatarId: "Daisy-inskirt-20220818", voiceId: "1bd001e7e50f421d891986aad5158bc8", name: "Maria", color: "from-emerald-500 to-teal-500" },
};

interface Props {
  agentKey?: string;
  lessonText?: string;
  language?: string;
  onClose?: () => void;
}

const HeyGenAvatar = ({ agentKey = "professor", lessonText, language = "English", onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "ready" | "speaking" | "error">("idle");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const professor = PROFESSOR_AVATARS[agentKey] || PROFESSOR_AVATARS.professor;

  const startSession = useCallback(async () => {
    setStatus("connecting");
    try {
      // 1. Create session
      const newRes = await fetch(`${BACKEND}/heygen/session/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: professor.avatarId, voiceId: professor.voiceId })
      });
      const newData = await newRes.json();
      const sid = newData.data?.session_id;
      if (!sid) throw new Error("No session ID");
      setSessionId(sid);

      // 2. Set up WebRTC
      const pc = new RTCPeerConnection();
      peerRef.current = pc;

      pc.ontrack = (e) => {
        if (videoRef.current && e.streams[0]) {
          videoRef.current.srcObject = e.streams[0];
        }
      };

      pc.onicecandidate = async ({ candidate }) => {
        if (candidate && sid) {
          await fetch(`${BACKEND}/heygen/session/ice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: sid, candidate })
          });
        }
      };

      // 3. Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 4. Start session with SDP
      const startRes = await fetch(`${BACKEND}/heygen/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, sdpOffer: offer })
      });
      const startData = await startRes.json();
      if (startData.data?.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(startData.data.sdp));
      }

      setStatus("ready");

      // 5. Auto-speak lesson text if provided
      if (lessonText) {
        setTimeout(() => speakText(sid, lessonText), 1500);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [professor, lessonText]);

  const speakText = async (sid: string, text: string) => {
    setStatus("speaking");
    await fetch(`${BACKEND}/heygen/session/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, text })
    });
    setStatus("ready");
  };

  const askQuestion = async () => {
    if (!question.trim() || !sessionId) return;
    const q = question.trim();
    setQuestion("");
    setMessages(m => [...m, { role: "student", text: q }]);
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND}/heygen/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, sessionId, agentKey, language })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "professor", text: data.response }]);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const stopSession = useCallback(async () => {
    if (sessionId) {
      await fetch(`${BACKEND}/heygen/session/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
    }
    peerRef.current?.close();
    setSessionId(null);
    setStatus("idle");
    onClose?.();
  }, [sessionId, onClose]);

  useEffect(() => { return () => { peerRef.current?.close(); }; }, []);

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-950 rounded-2xl overflow-hidden">
      {/* Video */}
      <div className="relative flex-1 bg-gray-900 flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className={"w-full h-full object-cover " + (status === "idle" || status === "connecting" ? "hidden" : "")} />
        {(status === "idle" || status === "connecting" || status === "error") && (
          <div className="flex flex-col items-center gap-4 p-8">
            <div className={"w-24 h-24 rounded-full bg-gradient-to-br " + professor.color + " flex items-center justify-center text-4xl font-bold text-white"}>
              {professor.name[0]}
            </div>
            <p className="text-white font-semibold text-lg">{professor.name}</p>
            {status === "idle" && (
              <Button onClick={startSession} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                <Volume2 className="w-4 h-4 mr-2" /> Start Live Session
              </Button>
            )}
            {status === "connecting" && <div className="flex items-center gap-2 text-white/70"><Loader2 className="w-5 h-5 animate-spin" /> Connecting avatar...</div>}
            {status === "error" && <p className="text-red-400">Connection failed. <button onClick={startSession} className="underline">Retry</button></p>}
          </div>
        )}
        {status === "ready" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>
        )}
        {onClose && (
          <button onClick={stopSession} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat */}
      {status === "ready" && (
        <div className="border-t border-white/10 bg-gray-900 p-3">
          <div className="max-h-32 overflow-y-auto mb-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={"text-sm " + (m.role === "student" ? "text-blue-300 text-right" : "text-white/80")}>
                <span className={"font-semibold " + (m.role === "student" ? "text-blue-400" : "text-secondary")}>{m.role === "student" ? "You" : professor.name}: </span>
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && askQuestion()} placeholder="Ask your professor..." className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm" />
            <Button onClick={askQuestion} disabled={isLoading || !question.trim()} size="sm" className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeyGenAvatar;