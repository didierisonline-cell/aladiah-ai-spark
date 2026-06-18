import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Phone, PhoneOff, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceTutorProps {
  studentName?: string;
  courseProgress?: number;
}

const VoiceTutor = ({ studentName, courseProgress }: VoiceTutorProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const conversation = useConversation({
    onConnect: () => {
      toast({ title: t('mentor.v.connected_title'), description: t('mentor.v.connected_desc') });
    },
    onDisconnect: () => {
      toast({ title: t('mentor.v.call_ended'), description: t('mentor.v.call_ended_desc') });
    },
    onError: (error) => {
      console.error('Voice tutor error:', error);
      toast({ title: t('mentor.v.conn_error'), description: t('mentor.v.conn_error_desc'), variant: 'destructive' });
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
        toast({ title: t('mentor.v.mic_required'), description: t('mentor.v.mic_required_desc'), variant: 'destructive' });
      } else {
        toast({ title: t('mentor.v.conn_failed'), description: error.message || t('mentor.v.conn_failed_desc'), variant: 'destructive' });
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
              <h3 className="font-semibold text-foreground text-sm">{t('mentor.v.title')}</h3>
              <p className="text-xs text-muted-foreground">{t('mentor.v.subtitle')}</p>
            </div>
          </div>
          {isActive && (
            <Badge variant="secondary" className="animate-pulse text-xs">
              {conversation.isSpeaking ? t('mentor.v.speaking') : t('mentor.v.listening')}
            </Badge>
          )}
        </div>

        {isActive && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${conversation.isSpeaking ? 'bg-secondary animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs text-muted-foreground">
                {conversation.isSpeaking ? t('mentor.v.prof_speaking') : t('mentor.v.your_turn')}
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
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('mentor.v.connecting')}</>
            ) : (
              <><Phone className="w-4 h-4 mr-2" /> {t('mentor.v.start')}</>
            )}
          </Button>
        ) : (
          <Button onClick={stopConversation} variant="destructive" className="w-full">
            <PhoneOff className="w-4 h-4 mr-2" /> {t('mentor.v.end')}
          </Button>
        )}

        <p className="text-[11px] text-muted-foreground text-center mt-2">
          {isActive ? t('mentor.v.hint_active') : t('mentor.v.hint_idle')}
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceTutor;
