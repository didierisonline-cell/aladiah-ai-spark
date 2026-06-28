// =============================================================================
// profDidierMessage — CLIENT-SIDE Prof. Didier greeting composer
// =============================================================================
// Root-cause fix for the "stale Spanish Prof. Didier card" bug.
//
// Previously the card text came from `get-student-recap.first_message`, composed
// SERVER-SIDE from `profiles.preferred_language` (a stored DB value) and only in
// en/es/fr. That meant a student whose stored preference was Spanish saw Spanish
// copy regardless of the UI language they selected, and de/ar/zh/hi/pt students
// silently fell back to English. The message also never reacted to an in-session
// language switch, because it was fetched once and cached on the recap payload.
//
// This composer rebuilds the same per-mode templates on the CLIENT, keyed to the
// SELECTED UI language (LanguageContext), across all 8 launch languages. The
// StudentPortal renders it from the recap's raw data buckets (mode, course,
// since_last_login.lessons_completed), so it re-renders instantly on a language
// switch with no refetch and never surfaces a stored-preference language.
//
// Protected terms (never translated): Prof. Didier, Aladiah.
// =============================================================================

export type ProfMode = 'onboarding' | 'daily_briefing' | 'upgrade_coach';

export const PROF_MSG_LANGS = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'zh', 'hi'] as const;

export interface ProfMsgVars {
  name: string;
  course: string;
  lessons: number;
}

// "your program" fallback when no course title is resolvable.
const COURSE_FALLBACK: Record<string, string> = {
  en: 'your program',
  es: 'tu programa',
  fr: 'votre programme',
  pt: 'o seu programa',
  de: 'dein Programm',
  ar: 'برنامجك',
  zh: '你的项目',
  hi: 'आपका प्रोग्राम',
};

// Recommendation line, per mode × language.
const RECOMMENDATION: Record<ProfMode, Record<string, (course: string) => string>> = {
  onboarding: {
    en: (c) => `Start with Lesson 1 of ${c}.`,
    es: (c) => `Comienza con la Lección 1 de ${c}.`,
    fr: (c) => `Commencez par la Leçon 1 de ${c}.`,
    pt: (c) => `Comece pela Lição 1 de ${c}.`,
    de: (c) => `Beginne mit Lektion 1 von ${c}.`,
    ar: (c) => `ابدأ بالدرس الأول من ${c}.`,
    zh: (c) => `从${c}的第 1 课开始。`,
    hi: (c) => `${c} के पाठ 1 से शुरू करें।`,
  },
  daily_briefing: {
    en: (c) => `Continue your next lesson in ${c}.`,
    es: (c) => `Continúa con tu próxima lección en ${c}.`,
    fr: (c) => `Poursuivez avec votre prochaine leçon de ${c}.`,
    pt: (c) => `Continue com a sua próxima lição em ${c}.`,
    de: (c) => `Setze mit deiner nächsten Lektion in ${c} fort.`,
    ar: (c) => `تابع درسك التالي في ${c}.`,
    zh: (c) => `继续学习${c}的下一课。`,
    hi: (c) => `${c} में अपना अगला पाठ जारी रखें।`,
  },
  upgrade_coach: {
    en: () => `Unlock all courses to keep building your skills.`,
    es: () => `Desbloquea todos los cursos para seguir desarrollando tus habilidades.`,
    fr: () => `Débloquez tous les cours pour continuer à développer vos compétences.`,
    pt: () => `Desbloqueie todos os cursos para continuar a desenvolver as suas competências.`,
    de: () => `Schalte alle Kurse frei, um deine Fähigkeiten weiter auszubauen.`,
    ar: () => `افتح جميع الدورات لمواصلة تطوير مهاراتك.`,
    zh: () => `解锁所有课程，持续提升你的技能。`,
    hi: () => `अपने कौशल को विकसित करते रहने के लिए सभी पाठ्यक्रम अनलॉक करें।`,
  },
};

// first_message, per mode × language. Mirrors the edge-function templates and
// extends them to all 8 launch languages. The recommendation line is rendered
// separately by the caller so it stays a single source of truth.
const FIRST_MESSAGE: Record<ProfMode, Record<string, (v: ProfMsgVars) => string>> = {
  onboarding: {
    en: (v) => `Congratulations, ${v.name}! You've chosen ${v.course}. I'm Prof. Didier, and I'll guide you through Module 1 — lesson by lesson, all the way to your first chapter quiz. Let's begin.`,
    es: (v) => `¡Felicidades, ${v.name}! Has elegido ${v.course}. Soy el Profesor Didier y te guiaré por el Módulo 1, lección por lección, hasta tu primer examen del capítulo. Empecemos.`,
    fr: (v) => `Félicitations, ${v.name} ! Vous avez choisi ${v.course}. Je suis le Professeur Didier et je vous guiderai à travers le Module 1, leçon par leçon, jusqu'à votre premier quiz. Commençons.`,
    pt: (v) => `Parabéns, ${v.name}! Você escolheu ${v.course}. Sou o Professor Didier e vou guiá-lo pelo Módulo 1, lição por lição, até o seu primeiro teste do capítulo. Vamos começar.`,
    de: (v) => `Glückwunsch, ${v.name}! Du hast ${v.course} gewählt. Ich bin Prof. Didier und führe dich durch Modul 1 — Lektion für Lektion, bis zu deinem ersten Kapitel-Quiz. Fangen wir an.`,
    ar: (v) => `تهانينا، ${v.name}! لقد اخترت ${v.course}. أنا البروفيسور ديدير، وسأرشدك عبر الوحدة 1 — درساً بدرس، حتى أول اختبار للفصل. لنبدأ.`,
    zh: (v) => `恭喜你，${v.name}！你已选择${v.course}。我是 Prof. Didier，我将带你逐课学习第 1 模块，直到你的第一次章节测验。让我们开始吧。`,
    hi: (v) => `बधाई हो, ${v.name}! आपने ${v.course} चुना है। मैं Prof. Didier हूँ, और मैं आपको मॉड्यूल 1 के माध्यम से पाठ-दर-पाठ, आपकी पहली अध्याय प्रश्नोत्तरी तक मार्गदर्शन करूँगा। चलिए शुरू करते हैं।`,
  },
  daily_briefing: {
    en: (v) => `Welcome back, ${v.name}! Since your last visit you completed ${v.lessons} lesson${v.lessons === 1 ? '' : 's'}. Let's keep your momentum going.`,
    es: (v) => `¡Bienvenido de nuevo, ${v.name}! Desde tu última visita completaste ${v.lessons} lección${v.lessons === 1 ? '' : 'es'}. Sigamos con tu impulso.`,
    fr: (v) => `Bon retour, ${v.name} ! Depuis votre dernière visite, vous avez terminé ${v.lessons} leçon${v.lessons === 1 ? '' : 's'}. Gardons cet élan.`,
    pt: (v) => `Bem-vindo de volta, ${v.name}! Desde a sua última visita você concluiu ${v.lessons} lição${v.lessons === 1 ? '' : 'ões'}. Vamos manter o seu ritmo.`,
    de: (v) => `Willkommen zurück, ${v.name}! Seit deinem letzten Besuch hast du ${v.lessons} Lektion${v.lessons === 1 ? '' : 'en'} abgeschlossen. Behalten wir deinen Schwung bei.`,
    ar: (v) => `مرحباً بعودتك، ${v.name}! منذ زيارتك الأخيرة أكملت ${v.lessons} درساً. لنحافظ على زخمك.`,
    zh: (v) => `欢迎回来，${v.name}！自上次访问以来，你已完成 ${v.lessons} 节课。让我们保持这个势头。`,
    hi: (v) => `वापस स्वागत है, ${v.name}! आपकी पिछली यात्रा के बाद से आपने ${v.lessons} पाठ पूरे किए। आइए अपनी गति बनाए रखें।`,
  },
  upgrade_coach: {
    en: (v) => `Outstanding work, ${v.name} — you completed Module 1 of ${v.course}. This is where careers are built. Earn your certifications and move toward your next role. I'm with you for the journey ahead.`,
    es: (v) => `Excelente trabajo, ${v.name}: completaste el Módulo 1 de ${v.course}. Aquí es donde se construyen las carreras. Obtén tus certificaciones y avanza hacia tu próximo puesto. Estoy contigo en el camino.`,
    fr: (v) => `Travail remarquable, ${v.name} — vous avez terminé le Module 1 de ${v.course}. C'est ici que se construisent les carrières. Obtenez vos certifications et avancez vers votre prochain poste. Je vous accompagne.`,
    pt: (v) => `Trabalho excelente, ${v.name} — você concluiu o Módulo 1 de ${v.course}. É aqui que as carreiras são construídas. Conquiste as suas certificações e avance para o seu próximo cargo. Estou com você nessa jornada.`,
    de: (v) => `Hervorragende Arbeit, ${v.name} — du hast Modul 1 von ${v.course} abgeschlossen. Hier werden Karrieren aufgebaut. Verdiene dir deine Zertifizierungen und gehe deinen nächsten Karriereschritt. Ich begleite dich auf dem Weg.`,
    ar: (v) => `عمل رائع، ${v.name} — لقد أكملت الوحدة 1 من ${v.course}. هنا تُبنى المسارات المهنية. احصل على شهاداتك وتقدّم نحو دورك التالي. أنا معك في رحلتك القادمة.`,
    zh: (v) => `出色的表现，${v.name}——你已完成${v.course}的第 1 模块。职业生涯正是在这里建立的。获得你的认证，迈向下一个职位。接下来的旅程我都会陪着你。`,
    hi: (v) => `शानदार काम, ${v.name} — आपने ${v.course} का मॉड्यूल 1 पूरा किया। करियर यहीं बनते हैं। अपने प्रमाणपत्र अर्जित करें और अपनी अगली भूमिका की ओर बढ़ें। आगे की यात्रा में मैं आपके साथ हूँ।`,
  },
};

const pick = <T,>(map: Record<string, T>, lang: string): T => map[lang] ?? map.en;

export function composeProfRecommendation(mode: ProfMode, language: string, course: string): string {
  const c = course || COURSE_FALLBACK[language] || COURSE_FALLBACK.en;
  return pick(RECOMMENDATION[mode], language)(c);
}

export function composeProfFirstMessage(mode: ProfMode, language: string, vars: ProfMsgVars): string {
  const course = vars.course || COURSE_FALLBACK[language] || COURSE_FALLBACK.en;
  return pick(FIRST_MESSAGE[mode], language)({ ...vars, course });
}
