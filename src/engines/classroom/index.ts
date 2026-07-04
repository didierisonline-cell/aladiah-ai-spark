export { default as ProfessorPresenceEngine } from './ProfessorPresenceEngine';
export { default as AvisCanvasEngine } from './AvisCanvasEngine';
export { useLessonOrchestrator } from './useLessonOrchestrator';
export { useStudentContext } from './useStudentContext';
export { useInteractionEngine, DEFAULT_VOICE_COMMANDS } from './useInteractionEngine';
export type {
  ClassroomProgram, ClassroomLesson, ClassroomModule,
  StudentContext, CanvasContent, CanvasStep, LessonState,
  VoiceStatus, VoiceCommand, StudentPrompt, ClassroomEvent,
} from './types';
