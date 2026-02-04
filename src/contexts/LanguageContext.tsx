import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'zh' | 'ar' | 'fr' | 'de' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
};

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
    'programs.startCourse': 'Start Course',
    
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

    // Blog
    'blog.badge': 'Industry Insights',
    'blog.title': 'The Rise of Scrum in the Dominican Republic',
    'blog.subtitle': 'Why Agile methodology is transforming careers and creating unprecedented demand for certified professionals',
    'blog.intro': 'The Dominican Republic is emerging as a strategic hub for Agile transformation in the Americas. With its growing tech sector, bilingual workforce, and proximity to North American markets, the country is perfectly positioned to meet the surging global demand for Scrum Masters and Agile professionals.',
    'blog.section1.title': 'Global Scrum Adoption: The Numbers',
    'blog.section1.content': 'According to the 15th State of Agile Report, 66% of organizations worldwide now use Scrum as their primary Agile framework. This dominance has created unprecedented demand for certified Scrum Masters, with the World Economic Forum projecting a 37.9% growth in Scrum-related roles over the next decade.',
    'blog.section2.title': 'Salary Trends Across Markets',
    'blog.section2.content': 'Scrum Master salaries reflect this high demand. In Australia, Senior Scrum Masters earn an average of A$156,000 annually. In the UK, salaries range from £55,000 to £95,000 depending on experience. The United States leads with averages of $115,000-$145,000 for experienced professionals.',
    'blog.section3.title': 'The Dominican Advantage',
    'blog.section3.content': 'The Dominican Republic offers unique advantages for Scrum professionals: a bilingual Spanish-English workforce perfectly suited for nearshoring, competitive costs for multinational corporations, and a rapidly growing IT sector. Major companies are increasingly looking to the Caribbean for Agile talent.',
    'blog.section4.title': 'Industries Driving Demand',
    'blog.section4.content': 'While Scrum originated in software development, today\'s demand spans multiple sectors: Financial Services, Healthcare, Manufacturing, Government, Marketing, and Consulting. Energy and Life Sciences sectors offer the highest entry-level salaries, often 20-30% above average.',
    'blog.section5.title': 'Career Growth Paths',
    'blog.section5.content': 'A Scrum Master certification opens multiple career trajectories: Agile Coach, Scrum Mentor, Agile Program Manager, or even Chief Agile Officer. Each path offers increasing responsibility and compensation, with Agile Coaches commanding salaries 40-60% higher than entry-level Scrum Masters.',
    'blog.section6.title': 'The Multilingual Edge',
    'blog.section6.content': 'In today\'s global economy, multilingual Scrum Masters are exceptionally valuable. Professionals who can facilitate ceremonies and coach teams in multiple languages—particularly English, Spanish, and Portuguese—are commanding premium salaries in international organizations.',
    'blog.cta': 'Explore Our Scrum Master Course',
    'blog.source': 'Sources: State of Agile Report, World Economic Forum, Glassdoor, The Knowledge Academy',
    'blog.stats.adoption': 'Agile Adoption Rate',
    'blog.stats.scrum': 'Use Scrum Framework',
    'blog.stats.growth': 'Projected Job Growth',
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
    'programs.startCourse': 'Iniciar Curso',
    
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

    // Blog
    'blog.badge': 'Perspectivas de la Industria',
    'blog.title': 'El Auge de Scrum en República Dominicana',
    'blog.subtitle': 'Por qué la metodología Agile está transformando carreras y creando una demanda sin precedentes de profesionales certificados',
    'blog.intro': 'República Dominicana está emergiendo como un centro estratégico para la transformación Agile en las Américas. Con su creciente sector tecnológico, fuerza laboral bilingüe y proximidad a los mercados norteamericanos, el país está perfectamente posicionado para satisfacer la creciente demanda global de Scrum Masters y profesionales Agile.',
    'blog.section1.title': 'Adopción Global de Scrum: Los Números',
    'blog.section1.content': 'Según el 15º Informe State of Agile, el 66% de las organizaciones en todo el mundo ahora usan Scrum como su marco Agile principal. Este dominio ha creado una demanda sin precedentes de Scrum Masters certificados, con el Foro Económico Mundial proyectando un crecimiento del 37.9% en roles relacionados con Scrum en la próxima década.',
    'blog.section2.title': 'Tendencias Salariales en los Mercados',
    'blog.section2.content': 'Los salarios de Scrum Master reflejan esta alta demanda. En Australia, los Senior Scrum Masters ganan un promedio de A$156,000 anuales. En el Reino Unido, los salarios varían de £55,000 a £95,000 según la experiencia. Estados Unidos lidera con promedios de $115,000-$145,000 para profesionales experimentados.',
    'blog.section3.title': 'La Ventaja Dominicana',
    'blog.section3.content': 'República Dominicana ofrece ventajas únicas para profesionales Scrum: una fuerza laboral bilingüe español-inglés perfectamente adaptada para nearshoring, costos competitivos para corporaciones multinacionales y un sector de TI en rápido crecimiento. Las grandes empresas buscan cada vez más talento Agile en el Caribe.',
    'blog.section4.title': 'Industrias que Impulsan la Demanda',
    'blog.section4.content': 'Si bien Scrum se originó en el desarrollo de software, la demanda actual abarca múltiples sectores: Servicios Financieros, Salud, Manufactura, Gobierno, Marketing y Consultoría. Los sectores de Energía y Ciencias de la Vida ofrecen los salarios de nivel de entrada más altos, a menudo 20-30% por encima del promedio.',
    'blog.section5.title': 'Trayectorias de Crecimiento Profesional',
    'blog.section5.content': 'Una certificación de Scrum Master abre múltiples trayectorias profesionales: Agile Coach, Mentor Scrum, Gerente de Programa Agile o incluso Chief Agile Officer. Cada camino ofrece mayor responsabilidad y compensación, con los Agile Coaches ganando salarios 40-60% más altos que los Scrum Masters de nivel inicial.',
    'blog.section6.title': 'La Ventaja Multilingüe',
    'blog.section6.content': 'En la economía global actual, los Scrum Masters multilingües son excepcionalmente valiosos. Los profesionales que pueden facilitar ceremonias y entrenar equipos en múltiples idiomas—particularmente inglés, español y portugués—están obteniendo salarios premium en organizaciones internacionales.',
    'blog.cta': 'Explora Nuestro Curso de Scrum Master',
    'blog.source': 'Fuentes: State of Agile Report, Foro Económico Mundial, Glassdoor, The Knowledge Academy',
    'blog.stats.adoption': 'Tasa de Adopción Agile',
    'blog.stats.scrum': 'Usan Framework Scrum',
    'blog.stats.growth': 'Crecimiento Proyectado',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.programs': '课程',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.enroll': '立即报名',
    
    // Hero
    'hero.badge': 'AI驱动的专业培训',
    'hero.title.line1': '掌握敏捷领导力',
    'hero.title.line2': '借助AI创新',
    'hero.subtitle': '通过最新AI工具增强的Scrum Master和项目管理培训，转变您的职业生涯。加入多米尼加共和国专业发展的未来。',
    'hero.cta.primary': '探索课程',
    'hero.cta.secondary': '了解更多',
    'hero.stats.students': '培训学员',
    'hero.stats.rate': '成功率',
    'hero.stats.partners': '企业合作伙伴',
    
    // Programs
    'programs.badge': '我们的课程',
    'programs.title': '世界级培训课程',
    'programs.subtitle': '全面的课程设计，提升您在敏捷项目管理方面的专业技能和职业前景。',
    'programs.scrum.title': 'Scrum Master认证',
    'programs.scrum.desc': '通过实践培训、真实项目和AI增强学习方法，成为认证的Scrum Master。',
    'programs.pm.title': '项目管理专业人士',
    'programs.pm.desc': '使用现代AI工具掌握项目管理框架，用于规划、执行和利益相关者管理。',
    'programs.ai.title': '管理者AI工具',
    'programs.ai.desc': '学习利用尖端AI工具来提高生产力、决策能力和团队协作。',
    'programs.duration': '时长',
    'programs.weeks': '周',
    'programs.format': '形式',
    'programs.hybrid': '混合式',
    'programs.online': '在线',
    'programs.learnMore': '了解更多',
    'programs.startCourse': '开始课程',
    
    // About
    'about.badge': '关于我们',
    'about.title': '卓越奠基',
    'about.p1': 'Aladiah Academy的成立有着明确的愿景：弥合传统项目管理教育与现代商业世界快速发展需求之间的差距。',
    'about.p2': '在我们创始人的领导下，这位在皇家加勒比国际公司拥有丰富经验的资深专业人士，我们为每个课程带来真实的专业知识和行业关系。',
    'about.p3': '在Aladiah Management旗下运营，我们保持最高的专业培训标准，同时拥抱创新和AI在教育中的变革力量。',
    'about.founder': '创始人兼CEO',
    'about.company': 'Aladiah Management',
    
    // Features
    'features.ai.title': 'AI增强学习',
    'features.ai.desc': '尖端AI工具融入我们的课程',
    'features.expert.title': '行业专家',
    'features.expert.desc': '向具有实战经验的专业人士学习',
    'features.cert.title': '认可的认证',
    'features.cert.desc': '全球认可的职业证书',
    'features.network.title': '专业网络',
    'features.network.desc': '与行业领袖和同行建立联系',
    
    // CTA
    'cta.title': '准备好转变您的职业生涯了吗？',
    'cta.subtitle': '加入数百位通过我们的课程推进职业发展的专业人士。今天就开始您的旅程。',
    'cta.button': '立即开始',
    
    // Footer
    'footer.description': 'Scrum Master和项目经理专业培训机构，由AI创新驱动。',
    'footer.quickLinks': '快速链接',
    'footer.contact': '联系方式',
    'footer.location': '多米尼加共和国',
    'footer.rights': '版权所有。',
    'footer.company': 'Aladiah Management旗下',

    // Blog
    'blog.badge': '行业洞察',
    'blog.title': 'Scrum在多米尼加共和国的崛起',
    'blog.subtitle': '为什么敏捷方法论正在改变职业生涯并创造对认证专业人员的空前需求',
    'blog.intro': '多米尼加共和国正在成为美洲敏捷转型的战略中心。凭借其不断发展的科技行业、双语劳动力以及与北美市场的邻近优势，该国完美地定位于满足全球对Scrum Master和敏捷专业人员不断增长的需求。',
    'blog.section1.title': '全球Scrum采用：数据',
    'blog.section1.content': '根据第15届敏捷状态报告，全球66%的组织现在使用Scrum作为其主要敏捷框架。这种主导地位为认证Scrum Master创造了前所未有的需求，世界经济论坛预测未来十年Scrum相关职位将增长37.9%。',
    'blog.section2.title': '市场薪资趋势',
    'blog.section2.content': 'Scrum Master的薪资反映了这种高需求。在澳大利亚，高级Scrum Master的年均收入为156,000澳元。在英国，根据经验，薪资范围为55,000至95,000英镑。美国以115,000-145,000美元的经验丰富专业人员平均水平领先。',
    'blog.section3.title': '多米尼加优势',
    'blog.section3.content': '多米尼加共和国为Scrum专业人员提供独特优势：非常适合近岸外包的西班牙语-英语双语劳动力、对跨国公司具有竞争力的成本，以及快速发展的IT行业。主要公司越来越多地在加勒比地区寻找敏捷人才。',
    'blog.section4.title': '推动需求的行业',
    'blog.section4.content': '虽然Scrum起源于软件开发，但今天的需求跨越多个行业：金融服务、医疗保健、制造、政府、营销和咨询。能源和生命科学行业提供最高的入门级薪资，通常比平均水平高20-30%。',
    'blog.section5.title': '职业发展路径',
    'blog.section5.content': 'Scrum Master认证开启多种职业轨迹：敏捷教练、Scrum导师、敏捷项目经理，甚至首席敏捷官。每条路径都提供更多的责任和薪酬，敏捷教练的薪资比入门级Scrum Master高40-60%。',
    'blog.section6.title': '多语言优势',
    'blog.section6.content': '在当今的全球经济中，多语言Scrum Master极具价值。能够用多种语言（尤其是英语、西班牙语和葡萄牙语）主持仪式和指导团队的专业人员在国际组织中获得高薪。',
    'blog.cta': '探索我们的Scrum Master课程',
    'blog.source': '来源：敏捷状态报告、世界经济论坛、Glassdoor、The Knowledge Academy',
    'blog.stats.adoption': '敏捷采用率',
    'blog.stats.scrum': '使用Scrum框架',
    'blog.stats.growth': '预计增长',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.programs': 'البرامج',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.enroll': 'سجل الآن',
    
    // Hero
    'hero.badge': 'تدريب مهني مدعوم بالذكاء الاصطناعي',
    'hero.title.line1': 'أتقن القيادة الرشيقة',
    'hero.title.line2': 'مع ابتكار الذكاء الاصطناعي',
    'hero.subtitle': 'حوّل مسيرتك المهنية من خلال تدريب Scrum Master وإدارة المشاريع المتطور، المعزز بأحدث أدوات الذكاء الاصطناعي. انضم إلى مستقبل التطوير المهني في جمهورية الدومينيكان.',
    'hero.cta.primary': 'استكشف البرامج',
    'hero.cta.secondary': 'اعرف المزيد',
    'hero.stats.students': 'متدربون',
    'hero.stats.rate': 'معدل النجاح',
    'hero.stats.partners': 'شركاء مؤسسيون',
    
    // Programs
    'programs.badge': 'برامجنا',
    'programs.title': 'برامج تدريب عالمية المستوى',
    'programs.subtitle': 'دورات شاملة مصممة لرفع مهاراتك المهنية وآفاقك الوظيفية في إدارة المشاريع الرشيقة.',
    'programs.scrum.title': 'شهادة Scrum Master',
    'programs.scrum.desc': 'كن Scrum Master معتمدًا من خلال التدريب العملي والمشاريع الحقيقية ومنهجيات التعلم المعززة بالذكاء الاصطناعي.',
    'programs.pm.title': 'محترف إدارة المشاريع',
    'programs.pm.desc': 'أتقن أطر إدارة المشاريع باستخدام أدوات الذكاء الاصطناعي الحديثة للتخطيط والتنفيذ وإدارة أصحاب المصلحة.',
    'programs.ai.title': 'أدوات الذكاء الاصطناعي للمديرين',
    'programs.ai.desc': 'تعلم الاستفادة من أدوات الذكاء الاصطناعي المتطورة لتعزيز الإنتاجية واتخاذ القرارات والتعاون الجماعي.',
    'programs.duration': 'المدة',
    'programs.weeks': 'أسابيع',
    'programs.format': 'الشكل',
    'programs.hybrid': 'هجين',
    'programs.online': 'عبر الإنترنت',
    'programs.learnMore': 'اعرف المزيد',
    'programs.startCourse': 'ابدأ الدورة',
    
    // About
    'about.badge': 'من نحن',
    'about.title': 'تأسست على التميز',
    'about.p1': 'تأسست أكاديمية علاديا برؤية واضحة: سد الفجوة بين تعليم إدارة المشاريع التقليدي والمتطلبات سريعة التطور لعالم الأعمال الحديث.',
    'about.p2': 'بقيادة مؤسسنا، المحترف المخضرم ذو الخبرة في Royal Caribbean International، نقدم خبرة حقيقية واتصالات صناعية لكل برنامج نقدمه.',
    'about.p3': 'نعمل تحت إدارة علاديا، ونحافظ على أعلى معايير التدريب المهني مع تبني الابتكار والقوة التحويلية للذكاء الاصطناعي في التعليم.',
    'about.founder': 'المؤسس والرئيس التنفيذي',
    'about.company': 'إدارة علاديا',
    
    // Features
    'features.ai.title': 'تعلم معزز بالذكاء الاصطناعي',
    'features.ai.desc': 'أدوات ذكاء اصطناعي متطورة مدمجة في مناهجنا',
    'features.expert.title': 'خبراء الصناعة',
    'features.expert.desc': 'تعلم من محترفين ذوي خبرة حقيقية',
    'features.cert.title': 'شهادات معترف بها',
    'features.cert.desc': 'مؤهلات معترف بها عالميًا لمسيرتك المهنية',
    'features.network.title': 'شبكة مهنية',
    'features.network.desc': 'تواصل مع قادة الصناعة والأقران',
    
    // CTA
    'cta.title': 'هل أنت مستعد لتحويل مسيرتك المهنية؟',
    'cta.subtitle': 'انضم إلى مئات المحترفين الذين تقدموا في حياتهم المهنية من خلال برامجنا. ابدأ رحلتك اليوم.',
    'cta.button': 'ابدأ الآن',
    
    // Footer
    'footer.description': 'معهد تدريب مهني لـ Scrum Masters ومديري المشاريع، مدعوم بابتكار الذكاء الاصطناعي.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.location': 'جمهورية الدومينيكان',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.company': 'قسم من إدارة علاديا',

    // Blog
    'blog.badge': 'رؤى الصناعة',
    'blog.title': 'صعود Scrum في جمهورية الدومينيكان',
    'blog.subtitle': 'لماذا تحوّل منهجية Agile المسارات المهنية وتخلق طلبًا غير مسبوق على المحترفين المعتمدين',
    'blog.intro': 'تبرز جمهورية الدومينيكان كمركز استراتيجي للتحول الرشيق في الأمريكتين. مع قطاعها التقني المتنامي وقوتها العاملة ثنائية اللغة وقربها من الأسواق الأمريكية الشمالية، فإن البلاد في وضع مثالي لتلبية الطلب العالمي المتزايد على Scrum Masters ومحترفي Agile.',
    'blog.section1.title': 'اعتماد Scrum العالمي: الأرقام',
    'blog.section1.content': 'وفقًا للتقرير الخامس عشر لحالة Agile، يستخدم 66٪ من المنظمات حول العالم الآن Scrum كإطار عمل Agile الرئيسي. خلق هذه الهيمنة طلبًا غير مسبوق على Scrum Masters المعتمدين، مع توقع المنتدى الاقتصادي العالمي نموًا بنسبة 37.9٪ في الأدوار المرتبطة بـ Scrum خلال العقد القادم.',
    'blog.section2.title': 'اتجاهات الرواتب عبر الأسواق',
    'blog.section2.content': 'تعكس رواتب Scrum Master هذا الطلب المرتفع. في أستراليا، يكسب كبار Scrum Masters متوسط 156,000 دولار أسترالي سنويًا. في المملكة المتحدة، تتراوح الرواتب من 55,000 إلى 95,000 جنيه إسترليني حسب الخبرة. تتصدر الولايات المتحدة بمتوسطات 115,000-145,000 دولار للمحترفين ذوي الخبرة.',
    'blog.section3.title': 'الميزة الدومينيكانية',
    'blog.section3.content': 'تقدم جمهورية الدومينيكان مزايا فريدة لمحترفي Scrum: قوة عاملة ثنائية اللغة إسبانية-إنجليزية مثالية للنقل القريب، وتكاليف تنافسية للشركات متعددة الجنسيات، وقطاع تكنولوجيا المعلومات سريع النمو. تبحث الشركات الكبرى بشكل متزايد في منطقة البحر الكاريبي عن المواهب الرشيقة.',
    'blog.section4.title': 'الصناعات التي تدفع الطلب',
    'blog.section4.content': 'بينما نشأ Scrum في تطوير البرمجيات، يمتد الطلب اليوم عبر قطاعات متعددة: الخدمات المالية والرعاية الصحية والتصنيع والحكومة والتسويق والاستشارات. تقدم قطاعات الطاقة وعلوم الحياة أعلى رواتب مستوى الدخول، غالبًا 20-30٪ فوق المتوسط.',
    'blog.section5.title': 'مسارات النمو الوظيفي',
    'blog.section5.content': 'تفتح شهادة Scrum Master مسارات وظيفية متعددة: مدرب Agile، مرشد Scrum، مدير برنامج Agile، أو حتى كبير مسؤولي Agile. يوفر كل مسار مسؤولية وتعويضًا متزايدين، حيث يحصل مدربو Agile على رواتب أعلى بنسبة 40-60٪ من Scrum Masters المبتدئين.',
    'blog.section6.title': 'الميزة متعددة اللغات',
    'blog.section6.content': 'في الاقتصاد العالمي اليوم، يعد Scrum Masters متعددو اللغات ذوي قيمة استثنائية. المحترفون الذين يمكنهم تسهيل الاحتفالات وتدريب الفرق بلغات متعددة - خاصة الإنجليزية والإسبانية والبرتغالية - يحصلون على رواتب مميزة في المنظمات الدولية.',
    'blog.cta': 'استكشف دورة Scrum Master لدينا',
    'blog.source': 'المصادر: تقرير حالة Agile، المنتدى الاقتصادي العالمي، Glassdoor، The Knowledge Academy',
    'blog.stats.adoption': 'معدل اعتماد Agile',
    'blog.stats.scrum': 'يستخدمون إطار Scrum',
    'blog.stats.growth': 'النمو المتوقع',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.programs': 'Programmes',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.enroll': 'S\'inscrire',
    
    // Hero
    'hero.badge': 'Formation Professionnelle Alimentée par l\'IA',
    'hero.title.line1': 'Maîtrisez le Leadership Agile',
    'hero.title.line2': 'Avec l\'Innovation IA',
    'hero.subtitle': 'Transformez votre carrière avec une formation de pointe en Scrum Master et Gestion de Projet, enrichie par les derniers outils IA. Rejoignez l\'avenir du développement professionnel en République Dominicaine.',
    'hero.cta.primary': 'Explorer les Programmes',
    'hero.cta.secondary': 'En Savoir Plus',
    'hero.stats.students': 'Étudiants Formés',
    'hero.stats.rate': 'Taux de Réussite',
    'hero.stats.partners': 'Partenaires Corporatifs',
    
    // Programs
    'programs.badge': 'Nos Programmes',
    'programs.title': 'Programmes de Formation de Classe Mondiale',
    'programs.subtitle': 'Des cours complets conçus pour élever vos compétences professionnelles et vos perspectives de carrière en gestion de projet agile.',
    'programs.scrum.title': 'Certification Scrum Master',
    'programs.scrum.desc': 'Devenez un Scrum Master certifié avec une formation pratique, des projets réels et des méthodologies d\'apprentissage améliorées par l\'IA.',
    'programs.pm.title': 'Professionnel en Gestion de Projet',
    'programs.pm.desc': 'Maîtrisez les cadres de gestion de projet avec des outils IA modernes pour la planification, l\'exécution et la gestion des parties prenantes.',
    'programs.ai.title': 'Outils IA pour Managers',
    'programs.ai.desc': 'Apprenez à exploiter les outils IA de pointe pour améliorer la productivité, la prise de décision et la collaboration d\'équipe.',
    'programs.duration': 'Durée',
    'programs.weeks': 'semaines',
    'programs.format': 'Format',
    'programs.hybrid': 'Hybride',
    'programs.online': 'En Ligne',
    'programs.learnMore': 'En Savoir Plus',
    'programs.startCourse': 'Commencer le Cours',
    
    // About
    'about.badge': 'À Propos de Nous',
    'about.title': 'Fondée sur l\'Excellence',
    'about.p1': 'Aladiah Academy a été fondée avec une vision claire : combler le fossé entre l\'éducation traditionnelle en gestion de projet et les exigences en constante évolution du monde des affaires moderne.',
    'about.p2': 'Dirigée par notre fondateur, un professionnel chevronné avec une expérience chez Royal Caribbean International, nous apportons une expertise réelle et des connexions industrielles à chaque programme que nous offrons.',
    'about.p3': 'Opérant sous Aladiah Management, nous maintenons les plus hauts standards de formation professionnelle tout en embrassant l\'innovation et le pouvoir transformateur de l\'IA dans l\'éducation.',
    'about.founder': 'Fondateur et PDG',
    'about.company': 'Aladiah Management',
    
    // Features
    'features.ai.title': 'Apprentissage Amélioré par l\'IA',
    'features.ai.desc': 'Outils IA de pointe intégrés dans notre programme',
    'features.expert.title': 'Experts de l\'Industrie',
    'features.expert.desc': 'Apprenez de professionnels avec une expérience réelle',
    'features.cert.title': 'Certifications Reconnues',
    'features.cert.desc': 'Accréditations reconnues mondialement pour votre carrière',
    'features.network.title': 'Réseau Professionnel',
    'features.network.desc': 'Connectez-vous avec les leaders de l\'industrie et vos pairs',
    
    // CTA
    'cta.title': 'Prêt à Transformer Votre Carrière ?',
    'cta.subtitle': 'Rejoignez des centaines de professionnels qui ont fait avancer leur carrière grâce à nos programmes. Commencez votre voyage aujourd\'hui.',
    'cta.button': 'Commencer Maintenant',
    
    // Footer
    'footer.description': 'Institut de Formation Professionnelle pour Scrum Masters et Gestionnaires de Projet, alimenté par l\'innovation IA.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.contact': 'Contact',
    'footer.location': 'République Dominicaine',
    'footer.rights': 'Tous droits réservés.',
    'footer.company': 'Une division d\'Aladiah Management',

    // Blog
    'blog.badge': 'Perspectives de l\'Industrie',
    'blog.title': 'L\'Essor de Scrum en République Dominicaine',
    'blog.subtitle': 'Pourquoi la méthodologie Agile transforme les carrières et crée une demande sans précédent pour les professionnels certifiés',
    'blog.intro': 'La République Dominicaine émerge comme un hub stratégique pour la transformation Agile dans les Amériques. Avec son secteur technologique en croissance, sa main-d\'œuvre bilingue et sa proximité avec les marchés nord-américains, le pays est parfaitement positionné pour répondre à la demande mondiale croissante de Scrum Masters et de professionnels Agile.',
    'blog.section1.title': 'Adoption Mondiale de Scrum : Les Chiffres',
    'blog.section1.content': 'Selon le 15e Rapport State of Agile, 66% des organisations dans le monde utilisent maintenant Scrum comme leur cadre Agile principal. Cette dominance a créé une demande sans précédent pour les Scrum Masters certifiés, le Forum Économique Mondial projetant une croissance de 37,9% des rôles liés à Scrum au cours de la prochaine décennie.',
    'blog.section2.title': 'Tendances Salariales sur les Marchés',
    'blog.section2.content': 'Les salaires des Scrum Masters reflètent cette forte demande. En Australie, les Senior Scrum Masters gagnent en moyenne 156 000 A$ par an. Au Royaume-Uni, les salaires varient de 55 000 £ à 95 000 £ selon l\'expérience. Les États-Unis sont en tête avec des moyennes de 115 000 $ à 145 000 $ pour les professionnels expérimentés.',
    'blog.section3.title': 'L\'Avantage Dominicain',
    'blog.section3.content': 'La République Dominicaine offre des avantages uniques pour les professionnels Scrum : une main-d\'œuvre bilingue espagnol-anglais parfaitement adaptée au nearshoring, des coûts compétitifs pour les multinationales et un secteur informatique en croissance rapide. Les grandes entreprises recherchent de plus en plus les talents Agile dans les Caraïbes.',
    'blog.section4.title': 'Industries Stimulant la Demande',
    'blog.section4.content': 'Bien que Scrum soit né dans le développement logiciel, la demande actuelle s\'étend à plusieurs secteurs : Services Financiers, Santé, Fabrication, Gouvernement, Marketing et Conseil. Les secteurs de l\'Énergie et des Sciences de la Vie offrent les salaires d\'entrée les plus élevés, souvent 20-30% au-dessus de la moyenne.',
    'blog.section5.title': 'Parcours de Croissance de Carrière',
    'blog.section5.content': 'Une certification Scrum Master ouvre plusieurs trajectoires de carrière : Coach Agile, Mentor Scrum, Gestionnaire de Programme Agile, ou même Chief Agile Officer. Chaque parcours offre des responsabilités et une rémunération croissantes, les Coachs Agile percevant des salaires 40-60% plus élevés que les Scrum Masters débutants.',
    'blog.section6.title': 'L\'Avantage Multilingue',
    'blog.section6.content': 'Dans l\'économie mondiale actuelle, les Scrum Masters multilingues sont exceptionnellement précieux. Les professionnels capables de faciliter les cérémonies et de coacher des équipes dans plusieurs langues—notamment l\'anglais, l\'espagnol et le portugais—obtiennent des salaires premium dans les organisations internationales.',
    'blog.cta': 'Explorez Notre Cours Scrum Master',
    'blog.source': 'Sources : Rapport State of Agile, Forum Économique Mondial, Glassdoor, The Knowledge Academy',
    'blog.stats.adoption': 'Taux d\'Adoption Agile',
    'blog.stats.scrum': 'Utilisent le Framework Scrum',
    'blog.stats.growth': 'Croissance Projetée',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.programs': 'Programme',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.enroll': 'Jetzt anmelden',
    
    // Hero
    'hero.badge': 'KI-gestützte Berufsausbildung',
    'hero.title.line1': 'Meistere Agile Führung',
    'hero.title.line2': 'Mit KI-Innovation',
    'hero.subtitle': 'Transformiere deine Karriere mit modernster Scrum Master und Projektmanagement-Ausbildung, erweitert durch die neuesten KI-Tools. Tritt der Zukunft der beruflichen Entwicklung in der Dominikanischen Republik bei.',
    'hero.cta.primary': 'Programme erkunden',
    'hero.cta.secondary': 'Mehr erfahren',
    'hero.stats.students': 'Ausgebildete Studenten',
    'hero.stats.rate': 'Erfolgsquote',
    'hero.stats.partners': 'Unternehmenspartner',
    
    // Programs
    'programs.badge': 'Unsere Programme',
    'programs.title': 'Weltklasse-Trainingsprogramme',
    'programs.subtitle': 'Umfassende Kurse, die darauf ausgelegt sind, deine beruflichen Fähigkeiten und Karrierechancen im agilen Projektmanagement zu verbessern.',
    'programs.scrum.title': 'Scrum Master Zertifizierung',
    'programs.scrum.desc': 'Werde ein zertifizierter Scrum Master mit praxisnahem Training, realen Projekten und KI-erweiterten Lernmethoden.',
    'programs.pm.title': 'Projektmanagement-Fachmann',
    'programs.pm.desc': 'Beherrsche Projektmanagement-Frameworks mit modernen KI-Tools für Planung, Ausführung und Stakeholder-Management.',
    'programs.ai.title': 'KI-Tools für Manager',
    'programs.ai.desc': 'Lerne, modernste KI-Tools zu nutzen, um Produktivität, Entscheidungsfindung und Teamzusammenarbeit zu verbessern.',
    'programs.duration': 'Dauer',
    'programs.weeks': 'Wochen',
    'programs.format': 'Format',
    'programs.hybrid': 'Hybrid',
    'programs.online': 'Online',
    'programs.learnMore': 'Mehr erfahren',
    'programs.startCourse': 'Kurs starten',
    
    // About
    'about.badge': 'Über Uns',
    'about.title': 'Gegründet auf Exzellenz',
    'about.p1': 'Aladiah Academy wurde mit einer klaren Vision gegründet: die Lücke zwischen traditioneller Projektmanagement-Ausbildung und den sich schnell entwickelnden Anforderungen der modernen Geschäftswelt zu schließen.',
    'about.p2': 'Unter der Leitung unseres Gründers, eines erfahrenen Profis mit Erfahrung bei Royal Caribbean International, bringen wir praktische Expertise und Branchenverbindungen in jedes Programm ein, das wir anbieten.',
    'about.p3': 'Unter Aladiah Management halten wir die höchsten Standards der Berufsausbildung aufrecht und nutzen gleichzeitig Innovation und die transformative Kraft der KI in der Bildung.',
    'about.founder': 'Gründer & CEO',
    'about.company': 'Aladiah Management',
    
    // Features
    'features.ai.title': 'KI-erweitertes Lernen',
    'features.ai.desc': 'Modernste KI-Tools in unseren Lehrplan integriert',
    'features.expert.title': 'Branchenexperten',
    'features.expert.desc': 'Lerne von Profis mit praktischer Erfahrung',
    'features.cert.title': 'Anerkannte Zertifizierungen',
    'features.cert.desc': 'Weltweit anerkannte Qualifikationen für deine Karriere',
    'features.network.title': 'Professionelles Netzwerk',
    'features.network.desc': 'Vernetze dich mit Branchenführern und Kollegen',
    
    // CTA
    'cta.title': 'Bereit, deine Karriere zu transformieren?',
    'cta.subtitle': 'Schließe dich Hunderten von Fachleuten an, die ihre Karriere durch unsere Programme vorangebracht haben. Beginne noch heute deine Reise.',
    'cta.button': 'Jetzt starten',
    
    // Footer
    'footer.description': 'Professionelles Ausbildungsinstitut für Scrum Masters und Projektmanager, angetrieben durch KI-Innovation.',
    'footer.quickLinks': 'Schnelllinks',
    'footer.contact': 'Kontakt',
    'footer.location': 'Dominikanische Republik',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.company': 'Eine Abteilung von Aladiah Management',

    // Blog
    'blog.badge': 'Brancheneinblicke',
    'blog.title': 'Der Aufstieg von Scrum in der Dominikanischen Republik',
    'blog.subtitle': 'Warum die agile Methodik Karrieren transformiert und eine beispiellose Nachfrage nach zertifizierten Fachleuten schafft',
    'blog.intro': 'Die Dominikanische Republik entwickelt sich zu einem strategischen Zentrum für die agile Transformation in Amerika. Mit ihrem wachsenden Technologiesektor, der zweisprachigen Belegschaft und der Nähe zu den nordamerikanischen Märkten ist das Land perfekt positioniert, um die wachsende globale Nachfrage nach Scrum Masters und Agile-Profis zu befriedigen.',
    'blog.section1.title': 'Globale Scrum-Einführung: Die Zahlen',
    'blog.section1.content': 'Laut dem 15. State of Agile Report verwenden 66% der Organisationen weltweit jetzt Scrum als ihr primäres Agile-Framework. Diese Dominanz hat eine beispiellose Nachfrage nach zertifizierten Scrum Masters geschaffen, wobei das Weltwirtschaftsforum ein Wachstum von 37,9% bei Scrum-bezogenen Rollen im nächsten Jahrzehnt prognostiziert.',
    'blog.section2.title': 'Gehaltstrends auf den Märkten',
    'blog.section2.content': 'Die Gehälter von Scrum Masters spiegeln diese hohe Nachfrage wider. In Australien verdienen Senior Scrum Masters durchschnittlich 156.000 A$ jährlich. Im Vereinigten Königreich reichen die Gehälter je nach Erfahrung von £55.000 bis £95.000. Die USA führen mit Durchschnittswerten von $115.000-$145.000 für erfahrene Fachleute.',
    'blog.section3.title': 'Der dominikanische Vorteil',
    'blog.section3.content': 'Die Dominikanische Republik bietet einzigartige Vorteile für Scrum-Profis: eine zweisprachige spanisch-englische Belegschaft, die sich perfekt für Nearshoring eignet, wettbewerbsfähige Kosten für multinationale Unternehmen und einen schnell wachsenden IT-Sektor. Große Unternehmen suchen zunehmend in der Karibik nach agilen Talenten.',
    'blog.section4.title': 'Branchen, die die Nachfrage antreiben',
    'blog.section4.content': 'Während Scrum aus der Softwareentwicklung stammt, erstreckt sich die heutige Nachfrage über mehrere Sektoren: Finanzdienstleistungen, Gesundheitswesen, Fertigung, Regierung, Marketing und Beratung. Energie- und Life-Science-Sektoren bieten die höchsten Einstiegsgehälter, oft 20-30% über dem Durchschnitt.',
    'blog.section5.title': 'Karrierewachstumspfade',
    'blog.section5.content': 'Eine Scrum Master-Zertifizierung eröffnet mehrere Karrierewege: Agile Coach, Scrum Mentor, Agile Program Manager oder sogar Chief Agile Officer. Jeder Pfad bietet zunehmende Verantwortung und Vergütung, wobei Agile Coaches Gehälter verdienen, die 40-60% höher sind als die von Einsteiger-Scrum-Masters.',
    'blog.section6.title': 'Der mehrsprachige Vorteil',
    'blog.section6.content': 'In der heutigen globalen Wirtschaft sind mehrsprachige Scrum Masters außergewöhnlich wertvoll. Fachleute, die Zeremonien moderieren und Teams in mehreren Sprachen coachen können—insbesondere Englisch, Spanisch und Portugiesisch—erhalten Premium-Gehälter in internationalen Organisationen.',
    'blog.cta': 'Entdecke unseren Scrum Master Kurs',
    'blog.source': 'Quellen: State of Agile Report, Weltwirtschaftsforum, Glassdoor, The Knowledge Academy',
    'blog.stats.adoption': 'Agile-Einführungsrate',
    'blog.stats.scrum': 'Nutzen Scrum Framework',
    'blog.stats.growth': 'Prognostiziertes Wachstum',
  },
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.programs': 'プログラム',
    'nav.about': '私たちについて',
    'nav.contact': 'お問い合わせ',
    'nav.enroll': '今すぐ登録',
    
    // Hero
    'hero.badge': 'AI駆動のプロフェッショナルトレーニング',
    'hero.title.line1': 'アジャイルリーダーシップをマスター',
    'hero.title.line2': 'AIイノベーションと共に',
    'hero.subtitle': '最新のAIツールで強化されたスクラムマスターとプロジェクトマネジメントトレーニングでキャリアを変革しましょう。ドミニカ共和国でのプロフェッショナル開発の未来に参加してください。',
    'hero.cta.primary': 'プログラムを探索',
    'hero.cta.secondary': '詳しく見る',
    'hero.stats.students': '受講生',
    'hero.stats.rate': '成功率',
    'hero.stats.partners': '法人パートナー',
    
    // Programs
    'programs.badge': '私たちのプログラム',
    'programs.title': 'ワールドクラスのトレーニングプログラム',
    'programs.subtitle': 'アジャイルプロジェクトマネジメントにおける専門スキルとキャリアの見通しを高めるために設計された包括的なコース。',
    'programs.scrum.title': 'スクラムマスター認定',
    'programs.scrum.desc': '実践的なトレーニング、実際のプロジェクト、AI強化学習方法論で認定スクラムマスターになりましょう。',
    'programs.pm.title': 'プロジェクトマネジメントプロフェッショナル',
    'programs.pm.desc': '計画、実行、ステークホルダー管理のための最新AIツールでプロジェクトマネジメントフレームワークをマスターしましょう。',
    'programs.ai.title': 'マネージャー向けAIツール',
    'programs.ai.desc': '生産性、意思決定、チームコラボレーションを向上させるための最先端AIツールの活用方法を学びましょう。',
    'programs.duration': '期間',
    'programs.weeks': '週間',
    'programs.format': '形式',
    'programs.hybrid': 'ハイブリッド',
    'programs.online': 'オンライン',
    'programs.learnMore': '詳しく見る',
    'programs.startCourse': 'コースを開始',
    
    // About
    'about.badge': '私たちについて',
    'about.title': '卓越性に基づいて設立',
    'about.p1': 'Aladiah Academyは明確なビジョンを持って設立されました：従来のプロジェクトマネジメント教育と現代ビジネス世界の急速に進化する要求との間のギャップを埋めることです。',
    'about.p2': 'Royal Caribbean Internationalでの経験を持つベテランプロフェッショナルである創設者のリーダーシップの下、私たちは提供するすべてのプログラムに実世界の専門知識と業界とのつながりをもたらします。',
    'about.p3': 'Aladiah Managementの下で運営し、イノベーションと教育におけるAIの変革力を受け入れながら、プロフェッショナルトレーニングの最高基準を維持しています。',
    'about.founder': '創設者兼CEO',
    'about.company': 'Aladiah Management',
    
    // Features
    'features.ai.title': 'AI強化学習',
    'features.ai.desc': '最先端のAIツールがカリキュラムに統合',
    'features.expert.title': '業界エキスパート',
    'features.expert.desc': '実務経験を持つプロフェッショナルから学ぶ',
    'features.cert.title': '認定資格',
    'features.cert.desc': 'キャリアのためのグローバルに認められた資格',
    'features.network.title': 'プロフェッショナルネットワーク',
    'features.network.desc': '業界リーダーや同僚とつながる',
    
    // CTA
    'cta.title': 'キャリアを変革する準備はできましたか？',
    'cta.subtitle': '私たちのプログラムを通じてキャリアを前進させた数百人のプロフェッショナルに参加してください。今日から旅を始めましょう。',
    'cta.button': '今すぐ始める',
    
    // Footer
    'footer.description': 'AIイノベーションによって駆動されるスクラムマスターとプロジェクトマネージャーのためのプロフェッショナルトレーニング機関。',
    'footer.quickLinks': 'クイックリンク',
    'footer.contact': 'お問い合わせ',
    'footer.location': 'ドミニカ共和国',
    'footer.rights': '無断転載を禁じます。',
    'footer.company': 'Aladiah Managementの一部門',

    // Blog
    'blog.badge': '業界インサイト',
    'blog.title': 'ドミニカ共和国でのスクラムの台頭',
    'blog.subtitle': 'なぜアジャイル方法論がキャリアを変革し、認定プロフェッショナルへの前例のない需要を生み出しているのか',
    'blog.intro': 'ドミニカ共和国は、アメリカ大陸におけるアジャイル変革の戦略的ハブとして台頭しています。成長するテクノロジーセクター、バイリンガルな労働力、北米市場への近接性を持つこの国は、スクラムマスターとアジャイルプロフェッショナルへの急増するグローバル需要に応えるのに完璧な位置にあります。',
    'blog.section1.title': 'グローバルスクラム採用：数字',
    'blog.section1.content': '第15回State of Agileレポートによると、世界中の組織の66%が現在、主要なアジャイルフレームワークとしてスクラムを使用しています。この優位性は認定スクラムマスターへの前例のない需要を生み出し、世界経済フォーラムは今後10年間でスクラム関連の役割が37.9%成長すると予測しています。',
    'blog.section2.title': '市場全体の給与動向',
    'blog.section2.content': 'スクラムマスターの給与はこの高い需要を反映しています。オーストラリアでは、シニアスクラムマスターは年間平均156,000豪ドルを稼いでいます。英国では、経験に応じて£55,000から£95,000の範囲です。米国は経験豊富なプロフェッショナルで$115,000-$145,000の平均でリードしています。',
    'blog.section3.title': 'ドミニカの優位性',
    'blog.section3.content': 'ドミニカ共和国はスクラムプロフェッショナルに独自の利点を提供します：ニアショアリングに最適なスペイン語-英語バイリンガル労働力、多国籍企業にとって競争力のあるコスト、急速に成長するITセクター。大企業はますますカリブ海でアジャイル人材を探しています。',
    'blog.section4.title': '需要を牽引する産業',
    'blog.section4.content': 'スクラムはソフトウェア開発で生まれましたが、今日の需要は複数のセクターにまたがっています：金融サービス、ヘルスケア、製造、政府、マーケティング、コンサルティング。エネルギーとライフサイエンスセクターは最高のエントリーレベル給与を提供し、多くの場合平均より20-30%高いです。',
    'blog.section5.title': 'キャリア成長パス',
    'blog.section5.content': 'スクラムマスター認定は複数のキャリア軌道を開きます：アジャイルコーチ、スクラムメンター、アジャイルプログラムマネージャー、さらにはチーフアジャイルオフィサー。各パスは増加する責任と報酬を提供し、アジャイルコーチはエントリーレベルのスクラムマスターより40-60%高い給与を得ています。',
    'blog.section6.title': '多言語の優位性',
    'blog.section6.content': '今日のグローバル経済において、多言語のスクラムマスターは非常に価値があります。複数の言語—特に英語、スペイン語、ポルトガル語—でセレモニーを促進し、チームをコーチできるプロフェッショナルは、国際組織でプレミアム給与を得ています。',
    'blog.cta': 'スクラムマスターコースを探索',
    'blog.source': '出典：State of Agileレポート、世界経済フォーラム、Glassdoor、The Knowledge Academy',
    'blog.stats.adoption': 'アジャイル採用率',
    'blog.stats.scrum': 'スクラムフレームワーク使用',
    'blog.stats.growth': '予測成長',
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
