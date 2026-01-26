import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, 
  Loader2, User, BookOpen, CheckCircle
} from 'lucide-react';

// 4 Dominican professors with distinct personalities
const professors = [
  {
    id: "professor_miguel",
    name: "Professor Miguel Santos",
    avatar: "👨‍🏫",
    color: "from-blue-500 to-cyan-500",
    specialty: "Scrum Fundamentals",
    catchphrase: "¡Mira! Let me show you something amazing..."
  },
  {
    id: "professor_carmen",
    name: "Profesora Carmen Valdez",
    avatar: "👩‍🏫",
    color: "from-purple-500 to-pink-500",
    specialty: "Practical Applications",
    catchphrase: "In real business, this is how we do it..."
  },
  {
    id: "professor_rafael",
    name: "Professor Rafael Jiménez",
    avatar: "🧑‍🏫",
    color: "from-orange-500 to-red-500",
    specialty: "Team Dynamics",
    catchphrase: "¡Dimelo! Let's have some fun with this..."
  },
  {
    id: "professor_lucia",
    name: "Profesora Lucía Fernández",
    avatar: "👩‍💼",
    color: "from-green-500 to-teal-500",
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

  // Determine professor based on video order (rotating through 4 professors)
  const professor = professors[orderIndex % professors.length];

  useEffect(() => {
    return () => {
      // Cleanup audio URL on unmount
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
              mainPoints: [
                description,
                `This lesson covers ${title} in detail.`
              ]
            },
            professorIndex: orderIndex,
            courseTitle: courseTitle || 'Aladiah Academy Course',
            chapterTitle: chapterTitle || 'Module'
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setScript(data.script);
      setHasStarted(true);

      // Check if we got audio or text-only mode
      if (data.mode === 'text' || !data.audioBase64) {
        // Text-only mode
        setIsTextOnlyMode(true);
        setReadingProgress(0);
        toast({
          title: 'Text Lesson Mode',
          description: 'Audio is temporarily unavailable. Please read the lesson below.',
        });
        return;
      }

      // Audio mode - convert base64 to audio blob
      const binaryString = atob(data.audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      
      setAudioUrl(url);
      setIsTextOnlyMode(false);

      // Create and play audio
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

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
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
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
      {/* Video/Audio Display Area */}
      <div className={`aspect-video bg-gradient-to-br ${professor.color} relative flex flex-col items-center justify-center p-8`}>
        {/* Professor Avatar */}
        <motion.div
          animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }}
          className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 text-6xl"
        >
          {professor.avatar}
        </motion.div>

        {/* Professor Info */}
        <h3 className="text-2xl font-display font-bold text-white mb-1">
          {professor.name}
        </h3>
        <p className="text-white/80 text-sm mb-4">
          {professor.specialty}
        </p>

        {/* Audio Visualization */}
        {isPlaying && (
          <motion.div 
            className="flex items-end gap-1 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white/60 rounded-full"
                animate={{ height: [8, Math.random() * 24 + 8, 8] }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  delay: i * 0.05,
                  ease: "easeInOut" 
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Status Overlay */}
        {!hasStarted && !isLoading && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
            <BookOpen className="w-16 h-16 text-white mb-4" />
            <h2 className="text-2xl font-display font-bold text-white mb-2">{title}</h2>
            <p className="text-white/80 text-center max-w-md mb-6">{description}</p>
            <p className="text-white/60 text-sm italic mb-4">"{professor.catchphrase}"</p>
            <Button 
              onClick={generateAudio}
              variant="coral" 
              size="lg"
              className="gap-2"
            >
              <Play className="w-5 h-5" />
              Start Lesson with {professor.name.split(' ')[1]}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
            <p className="text-white font-medium">Preparing your lesson...</p>
            <p className="text-white/60 text-sm">{professor.name} is getting ready</p>
          </div>
        )}

        {isCompleted && !isPlaying && hasStarted && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
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
            {/* Text-Only Mode Content */}
            <div className="mb-4 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">Text Lesson Mode</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Audio is temporarily unavailable. Please read the lesson below and mark it as complete when finished.
              </p>
            </div>
            
            {/* Text Lesson Content */}
            <div className="mb-4 p-4 bg-background rounded-lg border max-h-64 overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {script.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Reading Progress */}
            <div className="mb-4">
              <Progress value={readingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {readingProgress >= 100 ? 'Reading Complete!' : 'Read the lesson above and mark as complete'}
              </p>
            </div>

            {/* Mark Complete Button */}
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
            {/* Progress Bar */}
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={restart}
                disabled={isLoading}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                variant="coral"
                size="lg"
                onClick={togglePlayPause}
                disabled={isLoading}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                disabled={isLoading}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </>
        )}

        {/* Lesson Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{professor.avatar}</span>
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

        {/* Transcript (collapsible) - only show in audio mode */}
        {script && !isTextOnlyMode && (
          <details className="mt-4">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              View Transcript
            </summary>
            <div className="mt-2 p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
              {script}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
