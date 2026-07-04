import { useState, useCallback } from 'react';
import { LessonState, ClassroomEvent } from './types';

interface UseLessonOrchestratorOptions {
  totalModules: number;
  lessonsPerModule: number[];
  totalBoardSteps: number;
  onEvent?: (event: ClassroomEvent) => void;
}

export function useLessonOrchestrator({
  totalModules,
  lessonsPerModule,
  totalBoardSteps,
  onEvent,
}: UseLessonOrchestratorOptions) {
  const [state, setState] = useState<LessonState>({
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    boardStep: 0,
    totalSteps: totalBoardSteps,
  });

  const dispatch = useCallback((event: ClassroomEvent) => {
    setState(prev => {
      switch (event.type) {
        case 'BOARD_NEXT':
          return { ...prev, boardStep: Math.min(prev.boardStep + 1, prev.totalSteps - 1) };
        case 'BOARD_PREV':
          return { ...prev, boardStep: Math.max(prev.boardStep - 1, 0) };
        case 'BOARD_RESET':
          return { ...prev, boardStep: 0 };
        case 'BOARD_GOTO':
          return { ...prev, boardStep: Math.max(0, Math.min(event.step, prev.totalSteps - 1)) };
        case 'LESSON_NEXT': {
          const maxLessons = lessonsPerModule[prev.currentModuleIndex] ?? 1;
          if (prev.currentLessonIndex < maxLessons - 1) {
            return { ...prev, currentLessonIndex: prev.currentLessonIndex + 1, boardStep: 0 };
          } else if (prev.currentModuleIndex < totalModules - 1) {
            return { ...prev, currentModuleIndex: prev.currentModuleIndex + 1, currentLessonIndex: 0, boardStep: 0 };
          }
          return prev;
        }
        case 'LESSON_PREV': {
          if (prev.currentLessonIndex > 0) {
            return { ...prev, currentLessonIndex: prev.currentLessonIndex - 1, boardStep: 0 };
          } else if (prev.currentModuleIndex > 0) {
            const prevModule = prev.currentModuleIndex - 1;
            const lastLesson = (lessonsPerModule[prevModule] ?? 1) - 1;
            return { ...prev, currentModuleIndex: prevModule, currentLessonIndex: lastLesson, boardStep: 0 };
          }
          return prev;
        }
        default:
          return prev;
      }
    });
    onEvent?.(event);
  }, [totalModules, lessonsPerModule, onEvent]);

  return { state, dispatch };
}
