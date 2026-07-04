import { useState, useCallback } from 'react';
import { StudentContext } from './types';

const LANG_CODES: Record<string, string> = {
  English: 'en', Spanish: 'es', French: 'fr',
  German: 'de', Chinese: 'zh', Arabic: 'ar', Japanese: 'ja',
};

export function useStudentContext(initial: Partial<StudentContext> = {}) {
  const [ctx, setCtx] = useState<StudentContext>({
    name: initial.name || 'Student',
    progress: initial.progress ?? 0,
    language: initial.language || 'English',
    languageCode: initial.languageCode || LANG_CODES[initial.language || 'English'] || 'en',
  });

  const setLanguage = useCallback((lang: string) => {
    setCtx(prev => ({ ...prev, language: lang, languageCode: LANG_CODES[lang] || 'en' }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setCtx(prev => ({ ...prev, progress: Math.max(0, Math.min(100, progress)) }));
  }, []);

  return { ctx, setLanguage, setProgress };
}
