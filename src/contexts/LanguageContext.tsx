import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.programs': 'Programs',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.enroll': 'Enroll Now',
    
    // Hero
    'hero.badge': 'AI-Powered Professional Training',
    'hero.title.line1': 'Master Agile Leadership',
    'hero.title.line2': 'With AI Innovation',
    'hero.subtitle': 'Transform your career with cutting-edge Scrum Master and Project Management training, enhanced by the latest AI tools. Join the future of professional development in the Dominican Republic.',
    'hero.cta.primary': 'Explore Programs',
    'hero.cta.secondary': 'Learn More',
    'hero.stats.students': 'Students Trained',
    'hero.stats.rate': 'Success Rate',
    'hero.stats.partners': 'Corporate Partners',
    
    // Programs
    'programs.badge': 'Our Programs',
    'programs.title': 'World-Class Training Programs',
    'programs.subtitle': 'Comprehensive courses designed to elevate your professional skills and career prospects in agile project management.',
    'programs.scrum.title': 'Scrum Master Certification',
    'programs.scrum.desc': 'Become a certified Scrum Master with hands-on training, real-world projects, and AI-enhanced learning methodologies.',
    'programs.pm.title': 'Project Management Professional',
    'programs.pm.desc': 'Master project management frameworks with modern AI tools for planning, execution, and stakeholder management.',
    'programs.ai.title': 'AI Tools for Managers',
    'programs.ai.desc': 'Learn to leverage cutting-edge AI tools to enhance productivity, decision-making, and team collaboration.',
    'programs.duration': 'Duration',
    'programs.weeks': 'weeks',
    'programs.format': 'Format',
    'programs.hybrid': 'Hybrid',
    'programs.online': 'Online',
    'programs.learnMore': 'Learn More',
    
    // About
    'about.badge': 'About Us',
    'about.title': 'Founded on Excellence',
    'about.p1': 'Aladiah Academy was founded with a clear vision: to bridge the gap between traditional project management education and the rapidly evolving demands of the modern business world.',
    'about.p2': 'Led by our founder, a seasoned professional with experience at Royal Caribbean International, we bring real-world expertise and industry connections to every program we offer.',
    'about.p3': 'Operating under Aladiah Management, we maintain the highest standards of professional training while embracing innovation and the transformative power of AI in education.',
    'about.founder': 'Founder & CEO',
    'about.company': 'Aladiah Management',
    
    // Features
    'features.ai.title': 'AI-Enhanced Learning',
    'features.ai.desc': 'Cutting-edge AI tools integrated into our curriculum',
    'features.expert.title': 'Industry Experts',
    'features.expert.desc': 'Learn from professionals with real-world experience',
    'features.cert.title': 'Recognized Certifications',
    'features.cert.desc': 'Globally recognized credentials for your career',
    'features.network.title': 'Professional Network',
    'features.network.desc': 'Connect with industry leaders and peers',
    
    // CTA
    'cta.title': 'Ready to Transform Your Career?',
    'cta.subtitle': 'Join hundreds of professionals who have advanced their careers through our programs. Start your journey today.',
    'cta.button': 'Get Started Now',
    
    // Footer
    'footer.description': 'Professional Training Institute for Scrum Masters and Project Managers, powered by AI innovation.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.location': 'Dominican Republic',
    'footer.rights': 'All rights reserved.',
    'footer.company': 'A division of Aladiah Management',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.programs': 'Programas',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.enroll': 'Inscríbete',
    
    // Hero
    'hero.badge': 'Formación Profesional con IA',
    'hero.title.line1': 'Domina el Liderazgo Ágil',
    'hero.title.line2': 'Con Innovación en IA',
    'hero.subtitle': 'Transforma tu carrera con formación de vanguardia en Scrum Master y Gestión de Proyectos, potenciada por las últimas herramientas de IA. Únete al futuro del desarrollo profesional en República Dominicana.',
    'hero.cta.primary': 'Explorar Programas',
    'hero.cta.secondary': 'Más Información',
    'hero.stats.students': 'Estudiantes Formados',
    'hero.stats.rate': 'Tasa de Éxito',
    'hero.stats.partners': 'Socios Corporativos',
    
    // Programs
    'programs.badge': 'Nuestros Programas',
    'programs.title': 'Programas de Formación de Clase Mundial',
    'programs.subtitle': 'Cursos completos diseñados para elevar tus habilidades profesionales y perspectivas de carrera en gestión ágil de proyectos.',
    'programs.scrum.title': 'Certificación Scrum Master',
    'programs.scrum.desc': 'Conviértete en un Scrum Master certificado con formación práctica, proyectos reales y metodologías de aprendizaje mejoradas con IA.',
    'programs.pm.title': 'Profesional en Gestión de Proyectos',
    'programs.pm.desc': 'Domina los marcos de gestión de proyectos con herramientas modernas de IA para planificación, ejecución y gestión de stakeholders.',
    'programs.ai.title': 'Herramientas IA para Gestores',
    'programs.ai.desc': 'Aprende a aprovechar herramientas de IA de vanguardia para mejorar la productividad, toma de decisiones y colaboración en equipo.',
    'programs.duration': 'Duración',
    'programs.weeks': 'semanas',
    'programs.format': 'Formato',
    'programs.hybrid': 'Híbrido',
    'programs.online': 'En Línea',
    'programs.learnMore': 'Más Información',
    
    // About
    'about.badge': 'Sobre Nosotros',
    'about.title': 'Fundados en la Excelencia',
    'about.p1': 'Aladiah Academy fue fundada con una visión clara: cerrar la brecha entre la educación tradicional en gestión de proyectos y las demandas en rápida evolución del mundo empresarial moderno.',
    'about.p2': 'Liderada por nuestro fundador, un profesional experimentado con experiencia en Royal Caribbean International, aportamos experiencia del mundo real y conexiones de la industria a cada programa que ofrecemos.',
    'about.p3': 'Operando bajo Aladiah Management, mantenemos los más altos estándares de formación profesional mientras abrazamos la innovación y el poder transformador de la IA en la educación.',
    'about.founder': 'Fundador y CEO',
    'about.company': 'Aladiah Management',
    
    // Features
    'features.ai.title': 'Aprendizaje con IA',
    'features.ai.desc': 'Herramientas de IA de vanguardia integradas en nuestro currículo',
    'features.expert.title': 'Expertos de la Industria',
    'features.expert.desc': 'Aprende de profesionales con experiencia real',
    'features.cert.title': 'Certificaciones Reconocidas',
    'features.cert.desc': 'Credenciales reconocidas globalmente para tu carrera',
    'features.network.title': 'Red Profesional',
    'features.network.desc': 'Conecta con líderes de la industria y colegas',
    
    // CTA
    'cta.title': '¿Listo para Transformar tu Carrera?',
    'cta.subtitle': 'Únete a cientos de profesionales que han avanzado en sus carreras a través de nuestros programas. Comienza tu viaje hoy.',
    'cta.button': 'Comenzar Ahora',
    
    // Footer
    'footer.description': 'Instituto de Formación Profesional para Scrum Masters y Gestores de Proyectos, impulsado por innovación en IA.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.contact': 'Contacto',
    'footer.location': 'República Dominicana',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.company': 'Una división de Aladiah Management',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
