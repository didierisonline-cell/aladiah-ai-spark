import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, 
  Loader2, BookOpen, CheckCircle, MessageCircleQuestion, Send, X
} from 'lucide-react';

import professorDidierImg from '@/assets/professor-didier.png';
import professorCarmenImg from '@/assets/professor-carmen.png';
import professorRafaelImg from '@/assets/professor-rafael.png';
import professorLuciaImg from '@/assets/professor-lucia.png';
import classroomBg from '@/assets/classroom-bg.jpg';

const professors = [
  {
    id: "professor_didier",
    name: "Professor Didier",
    image: professorDidierImg,
    color: "from-blue-600 to-cyan-500",
    specialty: "Scrum Fundamentals",
    catchphrase: "¡Mira! Let me show you something amazing..."
  },
  {
    id: "professor_carmen",
    name: "Profesora Carmen Valdez",
    image: professorCarmenImg,
    color: "from-purple-600 to-pink-500",
    specialty: "Practical Applications",
    catchphrase: "In real business, this is how we do it..."
  },
  {
    id: "professor_rafael",
    name: "Professor Rafael Jiménez",
    image: professorRafaelImg,
    color: "from-orange-500 to-red-500",
    specialty: "Team Dynamics",
    catchphrase: "¡Dimelo! Let's have some fun with this..."
  },
  {
    id: "professor_lucia",
    name: "Profesora Lucía Fernández",
    image: professorLuciaImg,
    color: "from-green-600 to-teal-500",
    specialty: "Career Development",
    catchphrase: "Mijo, let me share some wisdom with you..."
  }
];

interface VideoPlayerProps {
  videoId: string;
  title: string;
  description: string;
  orderIndex: number;
  onComplete: () => void;
  isCompleted: boolean;
  courseTitle?: string;
  chapterTitle?: string;
}

interface QAMessage {
  role: 'student' | 'professor';
  content: string;
}

const VideoPlayer = ({ 
  videoId, 
  title, 
  description, 
  orderIndex,
  onComplete, 
  isCompleted,
  courseTitle,
  chapterTitle
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [script, setScript] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  
  // Audio element ref for ElevenLabs playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Q&A state
  const [showQA, setShowQA] = useState(false);
  const [qaMessages, setQaMessages] = useState<QAMessage[]>([]);
  const [qaInput, setQaInput] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const qaScrollRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const professor = professors[orderIndex % professors.length];

  // Scroll Q&A to bottom
  useEffect(() => {
    if (qaScrollRef.current) {
      qaScrollRef.current.scrollTop = qaScrollRef.current.scrollHeight;
    }
  }, [qaMessages]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (audio && audio.duration > 0) {
        const pct = Math.round((audio.currentTime / audio.duration) * 100);
        setProgress(pct);
      }
    }, 500);
  }, []);

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const generateAndSpeak = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson-audio`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            videoId,
            lessonTitle: title,
            lessonContent: { mainPoints: [description, `This lesson covers ${title} in detail.`] },
            professorIndex: orderIndex,
            courseTitle: courseTitle || 'Aladiah Academy Course',
            chapterTitle: chapterTitle || 'Module'
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const lessonScript = data.script || '';
      setScript(lessonScript);
      setHasStarted(true);

      if (data.mode === 'audio' && data.audioBase64) {
        // Play real ElevenLabs audio
        const audioUrl = `data:audio/mpeg;base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        audio.volume = isMuted ? 0 : 1;
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          setProgress(100);
          stopProgressTracking();
        };

        audio.onerror = () => {
          toast({
            title: 'Audio Playback Error',
            description: 'Could not play audio. Showing transcript instead.',
            variant: 'destructive',
          });
          setIsPlaying(false);
          stopProgressTracking();
        };

        await audio.play();
        setIsPlaying(true);
        startProgressTracking();
      } else {
        // Text-only fallback — use browser TTS
        fallbackToTTS(lessonScript);
      }
    } catch (error: any) {
      console.error('Error generating lesson:', error);
      toast({
        title: 'Lesson Generation Error',
        description: error.message || 'Failed to generate lesson.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Browser TTS fallback for when ElevenLabs is unavailable
  const fallbackToTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio && audio.src) {
      // ElevenLabs audio mode
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        setIsPaused(true);
        stopProgressTracking();
      } else {
        audio.play();
        setIsPlaying(true);
        setIsPaused(false);
        startProgressTracking();
      }
    } else {
      // Browser TTS fallback
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
        setIsPaused(true);
      } else if (isPaused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        setIsPaused(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : 1;
      }
      return next;
    });
  };

  const restart = () => {
    const audio = audioRef.current;
    if (audio && audio.src) {
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      setProgress(0);
      startProgressTracking();
    } else {
      window.speechSynthesis.cancel();
      if (script) fallbackToTTS(script);
      setProgress(0);
    }
  };

  const pauseAndAsk = () => {
    if (isPlaying) {
      const audio = audioRef.current;
      if (audio && audio.src) {
        audio.pause();
        stopProgressTracking();
      } else {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
      setIsPaused(true);
    }
    setShowQA(true);
  };

  const closeQA = () => {
    setShowQA(false);
    if (isPaused) {
      const audio = audioRef.current;
      if (audio && audio.src) {
        audio.play();
        startProgressTracking();
      } else {
        window.speechSynthesis.resume();
      }
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const askQuestion = async () => {
    if (!qaInput.trim() || qaLoading) return;
    
    const question = qaInput.trim();
    setQaInput('');
    setQaMessages(prev => [...prev, { role: 'student', content: question }]);
    setQaLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lesson-qa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            question,
            lessonTitle: title,
            lessonScript: script,
            professorName: professor.name,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setQaMessages(prev => [...prev, { role: 'professor', content: data.answer }]);
    } catch (error: any) {
      setQaMessages(prev => [...prev, { 
        role: 'professor', 
        content: "Sorry, I couldn't process your question right now. Try again in a moment!" 
      }]);
    } finally {
      setQaLoading(false);
    }
  };

  const markComplete = () => {
    setProgress(100);
  };

  return (
    <Card className="overflow-hidden">
      {/* Classroom Scene with Background */}
      <div className="aspect-video relative flex items-end justify-center overflow-hidden">
        <img 
          src={classroomBg} 
          alt="Classroom" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

        {/* Lesson title bar */}
        <div className="absolute top-4 left-6 right-6 h-12 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center px-4 z-10">
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/30" />
            ))}
          </div>
          <p className="ml-4 text-white/80 text-xs font-mono truncate flex-1">{title}</p>
          {hasStarted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={pauseAndAsk}
              className="text-white/80 hover:text-white hover:bg-white/20 gap-1 text-xs h-8"
            >
              <MessageCircleQuestion className="w-4 h-4" />
              Ask Question
            </Button>
          )}
        </div>

        {/* Professor Character */}
        <motion.div
          className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 mb-0"
          animate={isPlaying ? {
            y: [0, -8, 0],
            rotate: [0, -1.5, 1.5, 0],
          } : {}}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
        >
          <img 
            src={professor.image} 
            alt={professor.name}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-8 -right-4 bg-white rounded-xl px-3 py-1.5 shadow-lg"
              >
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-0 left-6 w-3 h-3 bg-white transform rotate-45 translate-y-1.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Audio Visualizer */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center gap-[2px] px-4 pb-1">
            {[...Array(32)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white/40 rounded-full"
                animate={{ height: [4, Math.random() * 24 + 4, 4] }}
                transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.02 }}
              />
            ))}
          </div>
        )}

        {/* Pre-start Overlay */}
        {!hasStarted && !isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <img src={professor.image} alt={professor.name} className="w-28 h-28 object-contain mb-4 drop-shadow-xl" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1 text-center px-4">{title}</h2>
            <p className="text-white/70 text-sm text-center max-w-md mb-2 px-4">{description}</p>
            <p className="text-white/50 text-xs italic mb-5">"{professor.catchphrase}"</p>
            <Button onClick={generateAndSpeak} variant="coral" size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Start Lesson with {professor.name.split(' ').pop()}
            </Button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
            <motion.img
              src={professor.image}
              alt={professor.name}
              className="w-24 h-24 object-contain mb-4"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
            <p className="text-white font-medium text-sm">Preparing your lesson...</p>
            <p className="text-white/50 text-xs">{professor.name} is getting ready</p>
          </div>
        )}

        {/* Completed Badge */}
        {isCompleted && !isPlaying && hasStarted && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
              <CheckCircle className="w-4 h-4" />
              Completed
            </div>
          </div>
        )}

        {/* Q&A Panel Overlay */}
        <AnimatePresence>
          {showQA && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-full sm:w-80 bg-background/95 backdrop-blur-md z-30 flex flex-col border-l"
            >
              <div className="flex items-center justify-between p-3 border-b bg-primary/5">
                <div className="flex items-center gap-2">
                  <MessageCircleQuestion className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">Ask {professor.name.split(' ').pop()}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={closeQA} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div ref={qaScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                {qaMessages.length === 0 && (
                  <div className="text-center text-muted-foreground text-xs py-8">
                    <MessageCircleQuestion className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Lesson paused. Ask anything about this topic!</p>
                  </div>
                )}
                {qaMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === 'student' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {msg.role === 'professor' && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <img src={professor.image} alt="" className="w-4 h-4 rounded-full" />
                          <span className="text-xs font-medium text-primary">{professor.name.split(' ').pop()}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {qaLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-muted-foreground text-xs">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t flex gap-2">
                <Input
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                  placeholder="Type your question..."
                  className="text-sm h-9"
                  disabled={qaLoading}
                />
                <Button onClick={askQuestion} size="icon" disabled={qaLoading || !qaInput.trim()} className="h-9 w-9 shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <CardContent className="p-4">
        {hasStarted && (
          <>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {progress >= 100 ? 'Lesson Complete!' : `${progress}% complete`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="ghost" size="icon" onClick={restart}>
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                variant="coral"
                size="lg"
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mark Complete for text fallback */}
            {!isPlaying && progress < 95 && (
              <div className="flex justify-center mb-3">
                <Button variant="outline" size="sm" onClick={markComplete} className="gap-2 text-xs">
                  <BookOpen className="w-4 h-4" />
                  Mark Lesson as Read
                </Button>
              </div>
            )}
          </>
        )}

        {/* Professor Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={professor.image} alt={professor.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
            <div>
              <p className="font-medium text-sm">{professor.name}</p>
              <p className="text-xs text-muted-foreground">{professor.specialty}</p>
            </div>
          </div>
          
          {progress >= 95 && !isCompleted && (
            <Button onClick={onComplete} variant="coral" size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete & Take Quiz
            </Button>
          )}
        </div>

        {/* Transcript */}
        {script && (
          <details className="mt-4">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              View Transcript
            </summary>
            <div className="mt-2 p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">{script}</div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
