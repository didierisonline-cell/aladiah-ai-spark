import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, 
  Loader2, BookOpen, CheckCircle
} from 'lucide-react';

import professorDidierImg from '@/assets/professor-didier.png';
import professorCarmenImg from '@/assets/professor-carmen.png';
import professorRafaelImg from '@/assets/professor-rafael.png';
import professorLuciaImg from '@/assets/professor-lucia.png';

// 4 Dominican professors with distinct personalities
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [script, setScript] = useState<string>('');
  const [isTextOnlyMode, setIsTextOnlyMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const professor = professors[orderIndex % professors.length];

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const generateAudio = async () => {
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
            lessonContent: {
              mainPoints: [description, `This lesson covers ${title} in detail.`]
            },
            professorIndex: orderIndex,
            courseTitle: courseTitle || 'Aladiah Academy Course',
            chapterTitle: chapterTitle || 'Module'
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setScript(data.script);
      setHasStarted(true);

      if (data.mode === 'text' || !data.audioBase64) {
        setIsTextOnlyMode(true);
        setReadingProgress(0);
        toast({
          title: 'Text Lesson Mode',
          description: 'Audio is temporarily unavailable. Please read the lesson below.',
        });
        return;
      }

      // Audio mode
      const audioDataUrl = `data:audio/mpeg;base64,${data.audioBase64}`;
      setAudioUrl(audioDataUrl);
      setIsTextOnlyMode(false);

      const audio = new Audio(audioDataUrl);
      audioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(100);
      });

      await audio.play();
      setIsPlaying(true);
    } catch (error: any) {
      console.error('Error generating lesson:', error);
      toast({
        title: 'Lesson Generation Error',
        description: error.message || 'Failed to generate lesson. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markTextLessonComplete = () => {
    setReadingProgress(100);
    setProgress(100);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      {/* Classroom Scene */}
      <div className={`aspect-video bg-gradient-to-br ${professor.color} relative flex items-end justify-center overflow-hidden`}>
        {/* Classroom Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/30" />
        <div className="absolute top-4 left-6 right-6 h-16 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 flex items-center px-4">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
            ))}
          </div>
          <p className="ml-4 text-white/70 text-xs font-mono truncate">{title}</p>
        </div>

        {/* Professor Character */}
        <motion.div
          className="relative z-10 w-40 h-40 sm:w-52 sm:h-52 mb-0"
          animate={isPlaying ? {
            y: [0, -6, 0],
            rotate: [0, -1, 1, 0],
          } : {}}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
        >
          <img 
            src={professor.image} 
            alt={professor.name}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          {/* Speech bubble when playing */}
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

        {/* Audio Visualization Bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center gap-[2px] px-4 pb-1">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white/50 rounded-full"
                animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.03 }}
              />
            ))}
          </div>
        )}

        {/* Pre-start Overlay */}
        {!hasStarted && !isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <img src={professor.image} alt={professor.name} className="w-28 h-28 object-contain mb-4 drop-shadow-xl" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1 text-center px-4">{title}</h2>
            <p className="text-white/70 text-sm text-center max-w-md mb-2 px-4">{description}</p>
            <p className="text-white/50 text-xs italic mb-5">"{professor.catchphrase}"</p>
            <Button onClick={generateAudio} variant="coral" size="lg" className="gap-2">
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
      </div>

      {/* Controls */}
      <CardContent className="p-4">
        {hasStarted && isTextOnlyMode && (
          <>
            <div className="mb-4 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">Text Lesson Mode</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Audio is temporarily unavailable. Please read the lesson below and mark it as complete when finished.
              </p>
            </div>
            
            <div className="mb-4 p-4 bg-background rounded-lg border max-h-64 overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {script.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3 text-sm leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Progress value={readingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {readingProgress >= 100 ? 'Reading Complete!' : 'Read the lesson above and mark as complete'}
              </p>
            </div>

            <div className="flex justify-center mb-4">
              <Button
                variant="coral"
                size="lg"
                onClick={markTextLessonComplete}
                disabled={readingProgress >= 100}
                className="gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {readingProgress >= 100 ? 'Lesson Read' : 'Mark Lesson as Read'}
              </Button>
            </div>
          </>
        )}

        {hasStarted && !isTextOnlyMode && (
          <>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="ghost" size="icon" onClick={restart} disabled={isLoading}>
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                variant="coral"
                size="lg"
                onClick={togglePlayPause}
                disabled={isLoading}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleMute} disabled={isLoading}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
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
        {script && !isTextOnlyMode && (
          <details className="mt-4">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              View Transcript
            </summary>
            <div className="mt-2 p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">{script}</div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
