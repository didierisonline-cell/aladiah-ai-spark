import { useState, useCallback, useEffect, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { useLanguage } from "@/contexts/LanguageContext";
type ConvStatus = "idle"|"connecting"|"connected"|"error";
type PanelState = "collapsed"|"bubble"|"expanded";
interface TranscriptEntry { role:"user"|"agent"; message:string; timestamp:Date; }
interface Props { lessonTitle?:string; lessonTopic?:string; studentName?:string; onSessionEnd?:(t:TranscriptEntry[])=>void; mode?:"professor"|"enrollment"; }
const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string;
const LABELS: Record<string, Record<string, string>> = {
  en: { ask: "Ask Prof. Didier", start: "Start Conversation", end: "End Session", speaking: "Prof. Didier is speaking...", listening: "Listening...", connecting: "Connecting...", failed: "Connection failed" },
  es: { ask: "Preguntar al Prof. Didier", start: "Iniciar Conversación", end: "Terminar", speaking: "Prof. Didier está hablando...", listening: "Escuchando...", connecting: "Conectando...", failed: "Conexión fallida" },
  fr: { ask: "Demander au Prof. Didier", start: "Démarrer la Conversation", end: "Terminer", speaking: "Prof. Didier parle...", listening: "Écoute...", connecting: "Connexion...", failed: "Échec de connexion" },
  de: { ask: "Prof. Didier fragen", start: "Gespräch starten", end: "Beenden", speaking: "Prof. Didier spricht...", listening: "Zuhören...", connecting: "Verbinden...", failed: "Verbindung fehlgeschlagen" },
  zh: { ask: "问迪迪埃教授", start: "开始对话", end: "结束", speaking: "迪迪埃教授正在讲话...", listening: "聆听中...", connecting: "连接中...", failed: "连接失败" },
  ar: { ask: "اسأل الأستاذ ديدييه", start: "بدء المحادثة", end: "إنهاء", speaking: "الأستاذ ديدييه يتحدث...", listening: "استماع...", connecting: "جارٍ الاتصال...", failed: "فشل الاتصال" },
  ja: { ask: "ディディエ先生に質問", start: "会話を開始", end: "終了", speaking: "ディディエ先生が話しています...", listening: "聞いています...", connecting: "接続中...", failed: "接続失敗" },
};
function getL(lang: string, key: string) { return (LABELS[lang] || LABELS.en)[key] || LABELS.en[key]; }
function Bars({ active, size=16 }: { active:boolean; size?:number }) {
  const h = [.5,.9,.65,1.1,.75,1,.6];
  return (<div style={{display:"flex",alignItems:"center",gap:2,height:size}}>{h.map((v,i)=>(<div key={i} style={{width:2.5,borderRadius:2,background:"rgba(96,165,250,0.9)",height:active?`${v*size*.85}px`:"3px",transition:"height 0.12s ease",animation:active?`pb 0.${5+i}s ease-in-out infinite alternate`:"none",animationDelay:`${i*.06}s`}}/>))}<style>{`@keyframes pb{from{transform:scaleY(.35)}to{transform:scaleY(1.15)}}`}</style></div>);
}
export default function ProfDidierFloat({ lessonTitle="Aladiah Academy", lessonTopic="Project Management & Scrum", studentName="Student", onSessionEnd, mode="enrollment" }: Props) {
  const { language } = useLanguage();
  const [panel, setPanel] = useState<PanelState>("bubble");
  const [status, setStatus] = useState<ConvStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [unread, setUnread] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const isLive = status === "connected";
  const conversation = useConversation({
    onConnect: () => { setStatus("connected"); timerRef.current = setInterval(()=>setDuration(d=>d+1),1000); },
    onDisconnect: () => { setStatus("idle"); if(timerRef.current)clearInterval(timerRef.current); if(transcript.length>0)onSessionEnd?.(transcript); },
    onMessage: ({message,source}:{message:string;source:string}) => { setTranscript(p=>[...p,{role:source==="ai"?"agent":"user",message,timestamp:new Date()}]); if(panel!=="expanded")setUnread(n=>n+1); },
    onError: () => setStatus("error"),
  });
  useEffect(()=>{setIsSpeaking(conversation.isSpeaking);},[conversation.isSpeaking]);
  useEffect(()=>{transcriptRef.current?.scrollTo({top:9999,behavior:"smooth"});},[transcript]);
  useEffect(()=>{if(panel==="expanded")setUnread(0);},[panel]);
  useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current);},[]);
  const startSession = useCallback(async()=>{
    setStatus("connecting"); setTranscript([]); setDuration(0);
    try {
      await navigator.mediaDevices.getUserMedia({audio:true});
      // Language-native first messages for authentic accent from the start
      const firstMessages: Record<string, string> = {
        en: "Hello! I'm Professor Didier. How can I help you today?",
        es: "¡Hola! Soy el Profesor Didier. ¿En qué puedo ayudarte hoy?",
        fr: "Bonjour ! Je suis le Professeur Didier. Comment puis-je vous aider aujourd'hui ?",
        de: "Hallo! Ich bin Professor Didier. Wie kann ich Ihnen heute helfen?",
        zh: "你好！我是迪迪埃教授。今天有什么可以帮助你的吗？",
        ar: "مرحباً! أنا البروفيسور ديدييه. كيف يمكنني مساعدتك اليوم؟",
        ja: "こんにちは！ディディエ教授です。今日はどのようにお手伝いしましょうか？",
      };
      // LaSean Pickens for EN/ES, deep native voices for other languages
      const DIDIER_VOICES: Record<string, string> = {
        en: "bQxW1c7YCr6VQgQhw8KX", es: "bQxW1c7YCr6VQgQhw8KX",
        fr: "IBGoh6rlxdauchOCULhL", de: "WPbK7Qv9rbyhvUDiwJ0A",
        zh: "pU9NaAwkoR3v0Mrg3uKz", ar: "Ojb0nFbyzZn95u0i5a5p",
        ja: "Mv8AjrYZCBkdsmDHNwcB",
      };
      await conversation.startSession({
        agentId: AGENT_ID,
        overrides: {
          agent: {
            language,
            firstMessage: firstMessages[language] || firstMessages.en,
          },
          tts: {
            voiceId: DIDIER_VOICES[language] || DIDIER_VOICES.en,
            stability: 0.71,
            similarityBoost: 0.55,
          },
        }
      });
    } catch { setStatus("error"); }
  },[conversation]);
  const endSession = useCallback(async()=>{ await conversation.endSession(); if(timerRef.current)clearInterval(timerRef.current); },[conversation]);
  const fmt = (s:number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const base: React.CSSProperties = {position:"fixed",bottom:24,right:24,zIndex:9999,fontFamily:"system-ui,-apple-system,sans-serif"};
  const askLabel = getL(language, "ask");
  if(panel==="collapsed") return (<div style={base}><button onClick={()=>setPanel("bubble")} style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#1e40af,#3b82f6)",border:"none",cursor:"pointer",color:"#fff",fontSize:18,fontWeight:700,boxShadow:"0 4px 14px rgba(59,130,246,0.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>D</button>{unread>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}</div>);
  if(panel==="bubble") return (<div style={base}><div onClick={()=>setPanel("expanded")} style={{display:"flex",alignItems:"center",gap:10,background:"linear-gradient(135deg,#0f172a,#0d1b3e)",border:"1px solid rgba(96,165,250,0.25)",borderRadius:999,padding:"10px 16px",cursor:"pointer",boxShadow:isLive?"0 0 0 1px rgba(96,165,250,0.35),0 8px 24px rgba(30,64,175,0.3)":"0 4px 20px rgba(0,0,0,0.4)"}}><div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1e40af,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0,position:"relative"}}>D{isLive&&<span style={{position:"absolute",bottom:0,right:0,width:8,height:8,borderRadius:"50%",background:"#22c55e",border:"1.5px solid #0f172a"}}/>}</div><span style={{fontSize:13,color:"#94a3b8",whiteSpace:"nowrap"}}>{isLive?(isSpeaking?getL(language,"speaking"):getL(language,"listening")):askLabel}</span>{isLive?<Bars active={isSpeaking}/>:<span style={{fontSize:14}}>🎙</span>}{isLive&&<span style={{fontSize:12,color:"#60a5fa",fontVariantNumeric:"tabular-nums",fontWeight:500}}>{fmt(duration)}</span>}{unread>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}</div></div>);
  return (<div style={{...base,width:360}}><div style={{background:"linear-gradient(160deg,#0f172a 0%,#0d1b3e 100%)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:18,boxShadow:"0 0 0 1px rgba(96,165,250,0.12),0 20px 60px rgba(15,23,42,0.8)",overflow:"hidden"}}><div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:"1px solid rgba(96,165,250,0.1)"}}><div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#1e40af,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"#fff",flexShrink:0,position:"relative"}}>D{isLive&&<span style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"#22c55e",border:"2px solid #0f172a"}}/>}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600,color:"#f1f5f9"}}>Prof. Didier</div><div style={{fontSize:11,color:"#475569",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lessonTitle}</div></div>{isLive&&<span style={{fontSize:12,color:"#60a5fa",fontVariantNumeric:"tabular-nums",fontWeight:500,marginRight:4}}>{fmt(duration)}</span>}<button onClick={()=>setPanel("bubble")} style={{background:"none",border:"none",cursor:"pointer",color:"#475569",fontSize:16,lineHeight:1,padding:4}}>—</button><button onClick={()=>setPanel("collapsed")} style={{background:"none",border:"none",cursor:"pointer",color:"#475569",fontSize:16,lineHeight:1,padding:4}}>✕</button></div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px 16px",background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(96,165,250,0.07)",minHeight:48}}><Bars active={isLive&&isSpeaking} size={20}/><span style={{fontSize:12,color:"#475569"}}>{isLive?(isSpeaking?getL(language,"speaking"):getL(language,"listening")):status==="connecting"?getL(language,"connecting"):status==="error"?getL(language,"failed"):"Session not started"}</span></div><div ref={transcriptRef} style={{height:transcript.length>0?200:0,overflowY:"auto",transition:"height 0.3s ease",padding:transcript.length>0?"10px 14px":0}}>{transcript.map((e,i)=>(<div key={i} style={{marginBottom:10}}><span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:e.role==="agent"?"#60a5fa":"#64748b",marginRight:6}}>{e.role==="agent"?"Prof. Didier":"You"}</span><span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.55}}>{e.message}</span></div>))}</div><div style={{padding:"12px 14px",display:"flex",gap:8}}>{!isLive&&status!=="connecting"?(<button onClick={startSession} style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>{getL(language,"start")}</button>):status==="connecting"?(<button disabled style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",background:"rgba(96,165,250,0.12)",color:"#60a5fa",fontSize:13,fontWeight:600,cursor:"not-allowed"}}>{getL(language,"connecting")}</button>):(<button onClick={endSession} style={{flex:1,padding:"10px 0",borderRadius:10,border:"1px solid rgba(239,68,68,0.35)",background:"rgba(239,68,68,0.1)",color:"#f87171",fontSize:13,fontWeight:600,cursor:"pointer"}}>{getL(language,"end")}</button>)}</div><div style={{padding:"0 14px 12px"}}><span style={{background:"rgba(96,165,250,0.1)",color:"#60a5fa",border:"1px solid rgba(96,165,250,0.15)",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:600}}>{lessonTitle.length>35?lessonTitle.slice(0,35)+"...":lessonTitle}</span></div></div></div>);
}
