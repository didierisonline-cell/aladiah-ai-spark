import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Phone, PhoneOff, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceTutorProps {
  studentName?: string;
  courseProgress?: number;
}

const VoiceTutor = ({ studentName, courseProgress }: VoiceTutorProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      toast({ title: '🎙️ Connected!', description: 'You can now speak with Professor Didier.' });
    },
    onDisconnect: () => {
      toast({ title: 'Call ended', description: 'Voice session disconnected.' });
    },
    onError: (error) => {
      console.error('Voice tutor error:', error);
      toast({ title: 'Connection error', description: 'Could not connect to voice tutor. Please try again.', variant: 'destructive' });
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Safari requires explicit audio constraints — { audio: true } throws "Invalid constraint"
      await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation-token');
      if (error || !data?.token) {
        throw new Error(error?.message || 'No token received');
      }

      await conversation.startSession({
        conversationToken: data.token,
      });
    } catch (error: any) {
      console.error('Failed to start voice session:', error);
      if (error.name === 'NotAllowedError') {
        toast({ title: 'Microphone access required', description: 'Please enable microphone access to use voice tutoring.', variant: 'destructive' });
      } else {
        toast({ title: 'Connection failed', description: error.message || 'Could not start voice session.', variant: 'destructive' });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isActive = conversation.status === 'connected';

  return (
    <Card className={`overflow-hidden transition-all ${isActive ? 'border-secondary shadow-lg ring-2 ring-secondary/20' : 'border-border'}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-secondary/20 animate-pulse' : 'bg-primary/10'}`}>
              <Volume2 className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Voice AI Tutor</h3>
              <p className="text-xs text-muted-foreground">Talk with Professor Didier</p>
            </div>
          </div>
          {isActive && (
            <Badge variant="secondary" className="animate-pulse text-xs">
              {conversation.isSpeaking ? '🗣️ Speaking...' : '👂 Listening...'}
            </Badge>
          )}
        </div>

        {isActive && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${conversation.isSpeaking ? 'bg-secondary animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs text-muted-foreground">
                {conversation.isSpeaking ? 'Professor Didier is speaking' : 'Your turn to speak'}
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all ${conversation.isSpeaking ? 'bg-secondary' : 'bg-primary/30'}`}
                  style={{
                    height: conversation.isSpeaking ? `${Math.random() * 20 + 8}px` : '4px',
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {!isActive ? (
          <Button
            onClick={startConversation}
            disabled={isConnecting}
            className="w-full"
            variant="coral"
          >
            {isConnecting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</>
            ) : (
              <><Phone className="w-4 h-4 mr-2" /> Start Voice Session</>
            )}
          </Button>
        ) : (
          <Button onClick={stopConversation} variant="destructive" className="w-full">
            <PhoneOff className="w-4 h-4 mr-2" /> End Session
          </Button>
        )}

        <p className="text-[11px] text-muted-foreground text-center mt-2">
          {isActive ? 'Speak naturally — ask any Scrum or career question' : 'Real-time voice conversation powered by ElevenLabs'}
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceTutor;
