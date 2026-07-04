import { useCallback } from 'react';
import { ClassroomEvent, VoiceCommand, StudentPrompt } from './types';

interface UseInteractionEngineOptions {
  onEvent: (event: ClassroomEvent) => void;
  onQuickCommand?: (cmd: string) => void;
}

// Default voice commands — program-agnostic.
// Programs can override by passing their own VOICE_COMMANDS.
export const DEFAULT_VOICE_COMMANDS: VoiceCommand[] = [
  { label: 'Repeat that',           intent: 'REPEAT' },
  { label: 'Explain another way',   intent: 'REPHRASE' },
  { label: 'Show me an example',    intent: 'EXAMPLE' },
  { label: 'Quiz me on this',       intent: 'QUIZ' },
  { label: 'What should I focus on?', intent: 'FOCUS' },
];

export function useInteractionEngine({ onEvent, onQuickCommand }: UseInteractionEngineOptions) {
  const handleVoiceCommand = useCallback((intent: string) => {
    if (intent === 'BOARD_NEXT') onEvent({ type: 'BOARD_NEXT' });
    else if (intent === 'BOARD_PREV') onEvent({ type: 'BOARD_PREV' });
    else if (intent === 'BOARD_RESET') onEvent({ type: 'BOARD_RESET' });
    else {
      onEvent({ type: 'VOICE_COMMAND', intent });
      onQuickCommand?.(intent);
    }
  }, [onEvent, onQuickCommand]);

  const handleStudentPrompt = useCallback((intent: string) => {
    onEvent({ type: 'STUDENT_PROMPT', intent });
  }, [onEvent]);

  return { handleVoiceCommand, handleStudentPrompt };
}
