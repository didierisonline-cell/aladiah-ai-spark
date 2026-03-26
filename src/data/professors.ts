export interface Professor {
  id: string;
  name: string;
  fullName: string;
  origin: string;
  country: string;
  flag: string;
  language: string;
  languageCode: string;
  title: string;
  specialty: string;
  vibe: string;
  color: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  greeting: string;
  catchphrase: string;
  systemPrompt: string;
  emoji: string;
  avatar: string;
}

export const PROFESSORS: Professor[] = [
  {
    id: 'didier',
    name: 'Prof. Didier',
    fullName: 'Professor Didier Thomas',
    origin: 'Denver, Colorado',
    country: 'United States',
    flag: '🇺🇸',
    language: 'English',
    languageCode: 'en',
    title: 'Founder & Lead Professor',
    specialty: 'Scrum · PMP · Agile · Project Management',
    vibe: 'Warm, Socratic, results-driven',
    color: '#1e3a8a',
    bgColor: 'rgba(30,58,138,0.1)',
    borderColor: 'rgba(96,165,250,0.4)',
    accentColor: '#3b82f6',
    greeting: "Let's build your career — starting right now.",
    catchphrase: "Every great PM started exactly where you are.",
    systemPrompt: `You are Professor Didier, founder of Aladiah Academy. You teach Scrum, Agile, and Project Management through live interactive voice classes. You are warm, confident, and Socratic. You guide students through questions, real-world examples, and structured teaching. You are the primary professor for all courses.`,
    emoji: '👨‍🏫',
    avatar: '/professors/didier.jpg',
  },
];

export const getProfessorById = (id: string): Professor => {
  return PROFESSORS.find(p => p.id === id) || PROFESSORS[0];
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', professorId: 'james' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', professorId: 'dubeignet' },
  { code: 'zh', name: '中文', flag: '🇨🇳', professorId: 'wei' },
  { code: 'es', name: 'Español', flag: '🇩🇴', professorId: 'valentina' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦', professorId: 'karim' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', professorId: 'jisoo' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', professorId: 'sofia' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', professorId: 'james' },
];
