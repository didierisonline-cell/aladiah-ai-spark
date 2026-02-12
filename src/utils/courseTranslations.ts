// Course content translations for all 7 supported languages
export type SupportedLanguage = 'en' | 'es' | 'zh' | 'ar' | 'fr' | 'de' | 'ja';

export interface TranslatedContent {
  title: string;
  description: string;
}

// Helper function to get translated content with fallback to English
export function getTranslatedContent(
  translations: Record<string, { title?: string; description?: string }> | null | undefined,
  language: string,
  defaultTitle: string,
  defaultDescription: string
): TranslatedContent {
  if (!translations) {
    return { title: defaultTitle, description: defaultDescription };
  }
  
  const langContent = translations[language];
  if (langContent) {
    return {
      title: langContent.title || defaultTitle,
      description: langContent.description || defaultDescription,
    };
  }
  
  return { title: defaultTitle, description: defaultDescription };
}

// Course translations
export const courseTranslations: Record<SupportedLanguage, TranslatedContent> = {
  en: {
    title: "Scrum Master Profession",
    description: "Unleash your career potential with our course on the fundamentals of the Scrum Master role. Whether you're new to Agile methodologies or seek to enhance your project management skills, this course will equip you with the knowledge and tools needed to excel as a Scrum Master."
  },
  es: {
    title: "Profesión de Scrum Master",
    description: "Libera tu potencial profesional con nuestro curso sobre los fundamentos del rol de Scrum Master. Ya sea que seas nuevo en las metodologías Ágiles o busques mejorar tus habilidades de gestión de proyectos, este curso te equipará con el conocimiento y las herramientas necesarias para destacar como Scrum Master."
  },
  zh: {
    title: "Scrum Master 职业",
    description: "通过我们关于Scrum Master角色基础知识的课程释放您的职业潜力。无论您是敏捷方法论的新手还是希望提升项目管理技能，本课程都将为您提供成为出色Scrum Master所需的知识和工具。"
  },
  ar: {
    title: "مهنة Scrum Master",
    description: "أطلق العنان لإمكانياتك المهنية من خلال دورتنا حول أساسيات دور Scrum Master. سواء كنت جديدًا على منهجيات Agile أو تسعى لتعزيز مهاراتك في إدارة المشاريع، ستزودك هذه الدورة بالمعرفة والأدوات اللازمة للتفوق كـ Scrum Master."
  },
  fr: {
    title: "Profession Scrum Master",
    description: "Libérez votre potentiel de carrière avec notre cours sur les fondamentaux du rôle de Scrum Master. Que vous soyez nouveau dans les méthodologies Agile ou que vous cherchiez à améliorer vos compétences en gestion de projet, ce cours vous fournira les connaissances et les outils nécessaires pour exceller en tant que Scrum Master."
  },
  de: {
    title: "Scrum Master Beruf",
    description: "Entfesseln Sie Ihr Karrierepotenzial mit unserem Kurs über die Grundlagen der Scrum Master Rolle. Ob Sie neu in agilen Methoden sind oder Ihre Projektmanagement-Fähigkeiten verbessern möchten, dieser Kurs vermittelt Ihnen das Wissen und die Werkzeuge, um als Scrum Master erfolgreich zu sein."
  },
  ja: {
    title: "スクラムマスター職",
    description: "スクラムマスターの役割の基礎に関するコースで、キャリアの可能性を解き放ちましょう。アジャイル方法論が初めての方も、プロジェクト管理スキルを向上させたい方も、このコースはスクラムマスターとして優れた成果を上げるために必要な知識とツールを提供します。"
  }
};

// Chapter translations
export const chapterTranslations: Record<string, Record<SupportedLanguage, TranslatedContent>> = {
  "Module 1: The Role of the Scrum Master": {
    en: {
      title: "Module 1: The Role of the Scrum Master",
      description: "This module defines the Scrum Master's role and summarizes the Scrum Framework and the Scrum Master's involvement. It also describes how the role benefits the organization."
    },
    es: {
      title: "Módulo 1: El Rol del Scrum Master",
      description: "Este módulo define el rol del Scrum Master y resume el Marco de Scrum y la participación del Scrum Master. También describe cómo el rol beneficia a la organización."
    },
    zh: {
      title: "模块1：Scrum Master的角色",
      description: "本模块定义了Scrum Master的角色，总结了Scrum框架和Scrum Master的参与。还描述了该角色如何使组织受益。"
    },
    ar: {
      title: "الوحدة 1: دور Scrum Master",
      description: "تحدد هذه الوحدة دور Scrum Master وتلخص إطار عمل Scrum ومشاركة Scrum Master. كما تصف كيف يفيد الدور المنظمة."
    },
    fr: {
      title: "Module 1 : Le Rôle du Scrum Master",
      description: "Ce module définit le rôle du Scrum Master et résume le Framework Scrum et l'implication du Scrum Master. Il décrit également comment le rôle bénéficie à l'organisation."
    },
    de: {
      title: "Modul 1: Die Rolle des Scrum Masters",
      description: "Dieses Modul definiert die Rolle des Scrum Masters und fasst das Scrum Framework und die Beteiligung des Scrum Masters zusammen. Es beschreibt auch, wie die Rolle der Organisation zugutekommt."
    },
    ja: {
      title: "モジュール1：スクラムマスターの役割",
      description: "このモジュールでは、スクラムマスターの役割を定義し、スクラムフレームワークとスクラムマスターの関与を要約します。また、この役割が組織にどのように利益をもたらすかを説明します。"
    }
  },
  "Module 2: Scrum Fundamentals": {
    en: {
      title: "Module 2: Scrum Fundamentals",
      description: "This module provides a deep dive into the Scrum Framework, including its values, roles, events, and artifacts."
    },
    es: {
      title: "Módulo 2: Fundamentos de Scrum",
      description: "Este módulo proporciona una inmersión profunda en el Marco de Scrum, incluyendo sus valores, roles, eventos y artefactos."
    },
    zh: {
      title: "模块2：Scrum基础",
      description: "本模块深入介绍Scrum框架，包括其价值观、角色、事件和工件。"
    },
    ar: {
      title: "الوحدة 2: أساسيات Scrum",
      description: "توفر هذه الوحدة نظرة معمقة في إطار عمل Scrum، بما في ذلك قيمه وأدواره وأحداثه وعناصره."
    },
    fr: {
      title: "Module 2 : Fondamentaux de Scrum",
      description: "Ce module offre une plongée approfondie dans le Framework Scrum, y compris ses valeurs, rôles, événements et artefacts."
    },
    de: {
      title: "Modul 2: Scrum Grundlagen",
      description: "Dieses Modul bietet einen tiefen Einblick in das Scrum Framework, einschließlich seiner Werte, Rollen, Events und Artefakte."
    },
    ja: {
      title: "モジュール2：スクラムの基礎",
      description: "このモジュールでは、スクラムフレームワークについて、その価値観、役割、イベント、成果物を含めて深く掘り下げます。"
    }
  },
  "Module 3: Scrum Events": {
    en: {
      title: "Module 3: Scrum Events",
      description: "Master the five Scrum events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective."
    },
    es: {
      title: "Módulo 3: Eventos de Scrum",
      description: "Domina los cinco eventos de Scrum: Sprint, Planificación del Sprint, Scrum Diario, Revisión del Sprint y Retrospectiva del Sprint."
    },
    zh: {
      title: "模块3：Scrum事件",
      description: "掌握五个Scrum事件：冲刺、冲刺计划、每日站会、冲刺评审和冲刺回顾。"
    },
    ar: {
      title: "الوحدة 3: أحداث Scrum",
      description: "أتقن أحداث Scrum الخمسة: Sprint، تخطيط Sprint، Scrum اليومي، مراجعة Sprint، واستعراض Sprint."
    },
    fr: {
      title: "Module 3 : Événements Scrum",
      description: "Maîtrisez les cinq événements Scrum : Sprint, Planification de Sprint, Mêlée Quotidienne, Revue de Sprint et Rétrospective de Sprint."
    },
    de: {
      title: "Modul 3: Scrum Events",
      description: "Meistern Sie die fünf Scrum Events: Sprint, Sprint Planning, Daily Scrum, Sprint Review und Sprint Retrospective."
    },
    ja: {
      title: "モジュール3：スクラムイベント",
      description: "5つのスクラムイベントをマスターする：スプリント、スプリント計画、デイリースクラム、スプリントレビュー、スプリントレトロスペクティブ。"
    }
  },
  "Module 4: Advanced Scrum Mastery": {
    en: {
      title: "Module 4: Advanced Scrum Mastery",
      description: "Advanced techniques for scaling Scrum, handling complex situations, and organizational transformation."
    },
    es: {
      title: "Módulo 4: Dominio Avanzado de Scrum",
      description: "Técnicas avanzadas para escalar Scrum, manejar situaciones complejas y transformación organizacional."
    },
    zh: {
      title: "模块4：高级Scrum精通",
      description: "扩展Scrum、处理复杂情况和组织转型的高级技术。"
    },
    ar: {
      title: "الوحدة 4: إتقان Scrum المتقدم",
      description: "تقنيات متقدمة لتوسيع نطاق Scrum، والتعامل مع المواقف المعقدة، والتحول التنظيمي."
    },
    fr: {
      title: "Module 4 : Maîtrise Avancée de Scrum",
      description: "Techniques avancées pour l'échelle Scrum, la gestion de situations complexes et la transformation organisationnelle."
    },
    de: {
      title: "Modul 4: Fortgeschrittene Scrum-Meisterschaft",
      description: "Fortgeschrittene Techniken zur Skalierung von Scrum, zum Umgang mit komplexen Situationen und zur organisatorischen Transformation."
    },
    ja: {
      title: "モジュール4：上級スクラムマスタリー",
      description: "スクラムのスケーリング、複雑な状況への対処、組織変革のための高度なテクニック。"
    }
  }
};

// Video title translations (sample for first module)
export const videoTranslations: Record<string, Record<SupportedLanguage, TranslatedContent>> = {
  "1.1 Course Introduction: Scrum Master Profession": {
    en: {
      title: "1.1 Course Introduction: Scrum Master Profession",
      description: "Welcome to the Scrum Master Profession course. Let's explore what you'll learn and how to succeed."
    },
    es: {
      title: "1.1 Introducción al Curso: Profesión de Scrum Master",
      description: "Bienvenido al curso de Profesión de Scrum Master. Exploremos qué aprenderás y cómo tener éxito."
    },
    zh: {
      title: "1.1 课程介绍：Scrum Master职业",
      description: "欢迎来到Scrum Master职业课程。让我们探索您将学到什么以及如何成功。"
    },
    ar: {
      title: "1.1 مقدمة الدورة: مهنة Scrum Master",
      description: "مرحبًا بك في دورة مهنة Scrum Master. دعنا نستكشف ما ستتعلمه وكيف تنجح."
    },
    fr: {
      title: "1.1 Introduction au Cours : Profession Scrum Master",
      description: "Bienvenue dans le cours Profession Scrum Master. Explorons ce que vous apprendrez et comment réussir."
    },
    de: {
      title: "1.1 Kurseinführung: Scrum Master Beruf",
      description: "Willkommen zum Kurs Scrum Master Beruf. Lassen Sie uns erkunden, was Sie lernen werden und wie Sie erfolgreich sein können."
    },
    ja: {
      title: "1.1 コース紹介：スクラムマスター職",
      description: "スクラムマスター職コースへようこそ。何を学び、どのように成功するかを探りましょう。"
    }
  },
  "1.2 Scrum Master Role and Benefits": {
    en: {
      title: "1.2 Scrum Master Role and Benefits",
      description: "Understanding the Scrum Master role and how it benefits the organization."
    },
    es: {
      title: "1.2 Rol y Beneficios del Scrum Master",
      description: "Comprender el rol del Scrum Master y cómo beneficia a la organización."
    },
    zh: {
      title: "1.2 Scrum Master角色和好处",
      description: "了解Scrum Master的角色及其如何使组织受益。"
    },
    ar: {
      title: "1.2 دور وفوائد Scrum Master",
      description: "فهم دور Scrum Master وكيف يفيد المنظمة."
    },
    fr: {
      title: "1.2 Rôle et Avantages du Scrum Master",
      description: "Comprendre le rôle du Scrum Master et comment il profite à l'organisation."
    },
    de: {
      title: "1.2 Rolle und Vorteile des Scrum Masters",
      description: "Das Verständnis der Rolle des Scrum Masters und wie sie der Organisation zugutekommt."
    },
    ja: {
      title: "1.2 スクラムマスターの役割とメリット",
      description: "スクラムマスターの役割と、それが組織にどのように利益をもたらすかを理解する。"
    }
  }
};

// UI translations for course pages
export const courseUITranslations: Record<SupportedLanguage, {
  loading: string;
  settingUp: string;
  myCourses: string;
  subtitle: string;
  logout: string;
  complete: string;
  courseReady: string;
  courseReadyDesc: string;
  errorLoading: string;
  errorSetup: string;
  backToCourses: string;
  chapterFinalQuiz: string;
  questions: string;
  required: string;
  completeAllVideos: string;
  selectVideo: string;
  chapterComplete: string;
  congratsNextChapter: string;
  quizNotAvailable: string;
  quizPreparing: string;
  prerequisitesRequired: string;
}> = {
  en: {
    loading: 'Loading courses...',
    settingUp: 'Setting up your course...',
    myCourses: 'My Courses',
    subtitle: 'Continue your learning journey and earn your certification',
    logout: 'Logout',
    complete: 'complete',
    courseReady: 'Course ready!',
    courseReadyDesc: 'The Scrum Master course has been set up.',
    errorLoading: 'Error loading courses',
    errorSetup: 'Error setting up course',
    backToCourses: 'Back to Courses',
    chapterFinalQuiz: 'Chapter Final Quiz',
    questions: 'questions',
    required: 'required',
    completeAllVideos: 'Complete all video quizzes first',
    selectVideo: 'Select a video to begin',
    chapterComplete: '🎉 Chapter Complete!',
    congratsNextChapter: 'Congratulations! You can now proceed to the next chapter.',
    quizNotAvailable: 'Quiz Not Available',
    quizPreparing: 'The quiz for this lesson is being prepared. Please check back soon.',
    prerequisitesRequired: 'Complete required courses to unlock',
  },
  es: {
    loading: 'Cargando cursos...',
    settingUp: 'Configurando tu curso...',
    myCourses: 'Mis Cursos',
    subtitle: 'Continúa tu viaje de aprendizaje y obtén tu certificación',
    logout: 'Cerrar Sesión',
    complete: 'completado',
    courseReady: '¡Curso listo!',
    courseReadyDesc: 'El curso de Scrum Master ha sido configurado.',
    errorLoading: 'Error al cargar cursos',
    errorSetup: 'Error al configurar el curso',
    backToCourses: 'Volver a Cursos',
    chapterFinalQuiz: 'Examen Final del Capítulo',
    questions: 'preguntas',
    required: 'requerido',
    completeAllVideos: 'Completa todos los cuestionarios de video primero',
    selectVideo: 'Selecciona un video para comenzar',
    chapterComplete: '🎉 ¡Capítulo Completado!',
    congratsNextChapter: '¡Felicitaciones! Ahora puedes continuar al siguiente capítulo.',
    quizNotAvailable: 'Cuestionario No Disponible',
    quizPreparing: 'El cuestionario para esta lección está siendo preparado. Por favor vuelve pronto.',
    prerequisitesRequired: 'Completa los cursos requeridos para desbloquear',
  },
  zh: {
    loading: '加载课程中...',
    settingUp: '正在设置您的课程...',
    myCourses: '我的课程',
    subtitle: '继续您的学习之旅并获得认证',
    logout: '退出登录',
    complete: '已完成',
    courseReady: '课程已准备就绪！',
    courseReadyDesc: 'Scrum Master课程已设置完成。',
    errorLoading: '加载课程时出错',
    errorSetup: '设置课程时出错',
    backToCourses: '返回课程',
    chapterFinalQuiz: '章节最终测验',
    questions: '问题',
    required: '要求',
    completeAllVideos: '请先完成所有视频测验',
    selectVideo: '选择一个视频开始',
    chapterComplete: '🎉 章节完成！',
    congratsNextChapter: '恭喜！您现在可以继续下一章。',
    quizNotAvailable: '测验不可用',
    quizPreparing: '本课程的测验正在准备中。请稍后再来。',
    prerequisitesRequired: '完成必修课程以解锁',
  },
  ar: {
    loading: 'جاري تحميل الدورات...',
    settingUp: 'جاري إعداد دورتك...',
    myCourses: 'دوراتي',
    subtitle: 'استمر في رحلة التعلم واحصل على شهادتك',
    logout: 'تسجيل الخروج',
    complete: 'مكتمل',
    courseReady: 'الدورة جاهزة!',
    courseReadyDesc: 'تم إعداد دورة Scrum Master.',
    errorLoading: 'خطأ في تحميل الدورات',
    errorSetup: 'خطأ في إعداد الدورة',
    backToCourses: 'العودة إلى الدورات',
    chapterFinalQuiz: 'الاختبار النهائي للفصل',
    questions: 'أسئلة',
    required: 'مطلوب',
    completeAllVideos: 'أكمل جميع اختبارات الفيديو أولاً',
    selectVideo: 'اختر فيديو للبدء',
    chapterComplete: '🎉 اكتمل الفصل!',
    congratsNextChapter: 'تهانينا! يمكنك الآن المتابعة إلى الفصل التالي.',
    quizNotAvailable: 'الاختبار غير متوفر',
    quizPreparing: 'يتم إعداد الاختبار لهذا الدرس. يرجى العودة قريباً.',
    prerequisitesRequired: 'أكمل الدورات المطلوبة للفتح',
  },
  fr: {
    loading: 'Chargement des cours...',
    settingUp: 'Configuration de votre cours...',
    myCourses: 'Mes Cours',
    subtitle: 'Continuez votre parcours d\'apprentissage et obtenez votre certification',
    logout: 'Déconnexion',
    complete: 'terminé',
    courseReady: 'Cours prêt !',
    courseReadyDesc: 'Le cours Scrum Master a été configuré.',
    errorLoading: 'Erreur lors du chargement des cours',
    errorSetup: 'Erreur lors de la configuration du cours',
    backToCourses: 'Retour aux Cours',
    chapterFinalQuiz: 'Quiz Final du Chapitre',
    questions: 'questions',
    required: 'requis',
    completeAllVideos: 'Complétez d\'abord tous les quiz vidéo',
    selectVideo: 'Sélectionnez une vidéo pour commencer',
    chapterComplete: '🎉 Chapitre Terminé !',
    congratsNextChapter: 'Félicitations ! Vous pouvez maintenant passer au chapitre suivant.',
    quizNotAvailable: 'Quiz Non Disponible',
    quizPreparing: 'Le quiz pour cette leçon est en préparation. Veuillez revenir bientôt.',
    prerequisitesRequired: 'Complétez les cours requis pour débloquer',
  },
  de: {
    loading: 'Kurse werden geladen...',
    settingUp: 'Ihr Kurs wird eingerichtet...',
    myCourses: 'Meine Kurse',
    subtitle: 'Setzen Sie Ihre Lernreise fort und erhalten Sie Ihre Zertifizierung',
    logout: 'Abmelden',
    complete: 'abgeschlossen',
    courseReady: 'Kurs bereit!',
    courseReadyDesc: 'Der Scrum Master Kurs wurde eingerichtet.',
    errorLoading: 'Fehler beim Laden der Kurse',
    errorSetup: 'Fehler beim Einrichten des Kurses',
    backToCourses: 'Zurück zu Kursen',
    chapterFinalQuiz: 'Kapitel-Abschlussquiz',
    questions: 'Fragen',
    required: 'erforderlich',
    completeAllVideos: 'Schließen Sie zuerst alle Video-Quiz ab',
    selectVideo: 'Wählen Sie ein Video zum Starten',
    chapterComplete: '🎉 Kapitel Abgeschlossen!',
    congratsNextChapter: 'Herzlichen Glückwunsch! Sie können jetzt zum nächsten Kapitel übergehen.',
    quizNotAvailable: 'Quiz Nicht Verfügbar',
    quizPreparing: 'Das Quiz für diese Lektion wird vorbereitet. Bitte kommen Sie bald wieder.',
    prerequisitesRequired: 'Schließen Sie die erforderlichen Kurse ab',
  },
  ja: {
    loading: 'コースを読み込み中...',
    settingUp: 'コースを設定中...',
    myCourses: 'マイコース',
    subtitle: '学習の旅を続けて認定資格を取得しましょう',
    logout: 'ログアウト',
    complete: '完了',
    courseReady: 'コース準備完了！',
    courseReadyDesc: 'スクラムマスターコースが設定されました。',
    errorLoading: 'コースの読み込みエラー',
    errorSetup: 'コースの設定エラー',
    backToCourses: 'コースに戻る',
    chapterFinalQuiz: 'チャプター最終クイズ',
    questions: '問題',
    required: '必須',
    completeAllVideos: '最初にすべてのビデオクイズを完了してください',
    selectVideo: 'ビデオを選択して開始',
    chapterComplete: '🎉 チャプター完了！',
    congratsNextChapter: 'おめでとうございます！次のチャプターに進むことができます。',
    quizNotAvailable: 'クイズは利用できません',
    quizPreparing: 'このレッスンのクイズは準備中です。後でもう一度確認してください。',
    prerequisitesRequired: '必要なコースを完了してロック解除',
  },
};
