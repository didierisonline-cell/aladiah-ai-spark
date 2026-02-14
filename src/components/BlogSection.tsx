import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Globe, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import LatamInsights from '@/components/LatamInsights';
import PMLatamInsights from '@/components/PMLatamInsights';

type BlogLanguage = 'en' | 'es' | 'zh' | 'ar' | 'fr' | 'de' | 'ja';

interface ContentData {
  badge: string;
  title: string;
  subtitle: string;
  publishDate: string;
  readTime: string;
  intro: string;
  section1Title: string;
  section1Content: string;
  section2Title: string;
  section2Content: string;
  section3Title: string;
  section3Content: string;
  section4Title: string;
  salaryData: { country: string; salary: string; flag: string }[];
  pmSection4Title: string;
  pmSalaryData: { country: string; salary: string; flag: string }[];
  section5Title: string;
  industries: string[];
  section6Title: string;
  careerPaths: { role: string; desc: string }[];
  conclusion: string;
  cta: string;
  source: string;
  statsLabels: { agile: string; scrum: string; growth: string };
}

const BlogSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const content: Record<BlogLanguage, ContentData> = {
    en: {
      badge: 'Industry Insights',
      title: 'The Rise of Scrum in the Dominican Republic',
      subtitle: 'Understanding the growing demand for Agile professionals in Latin America and the Caribbean',
      publishDate: 'January 26, 2026',
      readTime: '8 min read',
      intro: `The Dominican Republic is rapidly emerging as a key player in the global technology landscape. With its strategic location, bilingual workforce, and growing IT sector, the country is positioning itself as a prime destination for Agile transformation and Scrum adoption. But what's driving this growth, and why is now the perfect time to become a certified Scrum Master in the Caribbean?`,
      section1Title: 'The Global Scrum Revolution',
      section1Content: `According to the 17th State of Agile Report by Digital.ai, 71% of organizations now use Agile methodologies in their software development lifecycle, with Scrum remaining the most popular framework at 66% adoption rate. The World Economic Forum projects that demand for Scrum Master professionals will grow by 37.9% over the next decade, with three out of nine in-demand product development roles being Scrum-related.`,
      section2Title: 'Why the Dominican Republic?',
      section2Content: `The Information Technology and Innovation Foundation (ITIF) highlights the Dominican Republic's attractiveness for the technology industry, citing political stability, cost-competitive operations, and a liberalized trade regime. As one of the fastest-growing economies in the Americas, the country offers unique advantages for professionals seeking Agile careers.`,
      section3Title: 'The Bilingual Advantage',
      section3Content: `In today's globalized tech landscape, bilingual professionals are in unprecedented demand. The Dominican Republic's Spanish-English bilingual workforce positions it perfectly for nearshoring opportunities with U.S. companies. Organizations like BIREME (Pan American Health Organization) have recently adopted Scrum frameworks, demonstrating the methodology's expansion across Latin American institutions.`,
      section4Title: 'Scrum Master Salaries: A Global Perspective',
      salaryData: [
        { country: 'Australia', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: 'United Kingdom', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: 'United States', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: 'Germany', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: 'India', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      pmSection4Title: 'Project Manager Salaries: A Global Perspective',
      pmSalaryData: [
        { country: 'Australia', salary: 'A$120,000 - A$145,000', flag: '🇦🇺' },
        { country: 'United Kingdom', salary: 'GBP 55,000 - GBP 75,000', flag: '🇬🇧' },
        { country: 'United States', salary: 'USD 95,000 - USD 130,000', flag: '🇺🇸' },
        { country: 'Germany', salary: 'EUR 60,000 - EUR 80,000', flag: '🇩🇪' },
        { country: 'India', salary: 'INR 12 LPA', flag: '🇮🇳' },
      ],
      section5Title: 'Top Industries for Scrum Masters',
      industries: ['Energy', 'Healthcare & Life Sciences', 'Automotive', 'Financial Services', 'Consulting', 'Insurance', 'IT & Technology'],
      section6Title: 'Career Paths in Scrum',
      careerPaths: [
        { role: 'Scrum Master', desc: 'Guide teams through Scrum principles and remove obstacles' },
        { role: 'Agile Coach', desc: 'Facilitate Scrum and Agile implementation across organizations' },
        { role: 'Scrum Mentor', desc: 'Coach and educate teams on becoming effective Scrum Masters' },
        { role: 'Agile Manager', desc: 'Lead multiple Scrum Masters and teams strategically' },
        { role: 'Release Train Engineer', desc: 'Coordinate multiple Agile teams within a SAFe Agile Release Train' },
        { role: 'IT Project Manager', desc: 'Manage technology projects using Agile and hybrid methodologies' },
      ],
      conclusion: `The convergence of global Agile adoption, the Dominican Republic's technological advancement, and the demand for bilingual professionals creates an unprecedented opportunity. Whether you're starting your career or transitioning from traditional project management, Scrum certification opens doors to high-paying roles across industries worldwide.`,
      cta: 'Explore Our Scrum Master Course',
      source: 'Sources: Digital.ai 17th State of Agile Report, World Economic Forum, ITIF, The Knowledge Academy, Glassdoor, AmbitionBox',
      statsLabels: { agile: 'Organizations Using Agile', scrum: 'Scrum Adoption Rate', growth: 'Projected Growth (10 years)' },
    },
    es: {
      badge: 'Perspectivas de la Industria',
      title: 'El Auge de Scrum en República Dominicana',
      subtitle: 'Entendiendo la creciente demanda de profesionales Ágiles en América Latina y el Caribe',
      publishDate: '26 de enero de 2026',
      readTime: '8 min de lectura',
      intro: `República Dominicana está emergiendo rápidamente como un actor clave en el panorama tecnológico global. Con su ubicación estratégica, fuerza laboral bilingüe y sector de TI en crecimiento, el país se está posicionando como un destino principal para la transformación Ágil y la adopción de Scrum.`,
      section1Title: 'La Revolución Global de Scrum',
      section1Content: `Según el 17º Informe del Estado de Agile de Digital.ai, el 71% de las organizaciones ahora utilizan metodologías Ágiles en su ciclo de desarrollo de software, con Scrum siendo el framework más popular con una tasa de adopción del 66%. El Foro Económico Mundial proyecta que la demanda de profesionales Scrum Master crecerá un 37.9% en la próxima década.`,
      section2Title: '¿Por qué República Dominicana?',
      section2Content: `La Fundación de Tecnología de la Información e Innovación (ITIF) destaca el atractivo de República Dominicana para la industria tecnológica, citando estabilidad política, operaciones competitivas en costos y un régimen comercial liberalizado.`,
      section3Title: 'La Ventaja Bilingüe',
      section3Content: `En el panorama tecnológico globalizado de hoy, los profesionales bilingües tienen una demanda sin precedentes. La fuerza laboral bilingüe español-inglés de República Dominicana la posiciona perfectamente para oportunidades de nearshoring con empresas estadounidenses.`,
      section4Title: 'Salarios de Scrum Master: Una Perspectiva Global',
      salaryData: [
        { country: 'Australia', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: 'Reino Unido', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: 'Estados Unidos', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: 'Alemania', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: 'India', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      pmSection4Title: 'Salarios de Project Manager: Una Perspectiva Global',
      pmSalaryData: [
        { country: 'Australia', salary: 'A$120,000 - A$145,000', flag: '🇦🇺' },
        { country: 'Reino Unido', salary: 'GBP 55,000 - GBP 75,000', flag: '🇬🇧' },
        { country: 'Estados Unidos', salary: 'USD 95,000 - USD 130,000', flag: '🇺🇸' },
        { country: 'Alemania', salary: 'EUR 60,000 - EUR 80,000', flag: '🇩🇪' },
        { country: 'India', salary: 'INR 12 LPA', flag: '🇮🇳' },
      ],
      section5Title: 'Principales Industrias para Scrum Masters',
      industries: ['Energía', 'Salud y Ciencias de la Vida', 'Automotriz', 'Servicios Financieros', 'Consultoría', 'Seguros', 'TI y Tecnología'],
      section6Title: 'Trayectorias Profesionales en Scrum',
      careerPaths: [
        { role: 'Scrum Master', desc: 'Guiar equipos a través de los principios de Scrum y eliminar obstáculos' },
        { role: 'Coach Ágil', desc: 'Facilitar la implementación de Scrum y Agile en organizaciones' },
        { role: 'Mentor Scrum', desc: 'Entrenar y educar equipos para convertirse en Scrum Masters efectivos' },
        { role: 'Gerente Ágil', desc: 'Liderar múltiples Scrum Masters y equipos estratégicamente' },
        { role: 'Release Train Engineer', desc: 'Coordinar múltiples equipos Ágiles dentro de un Agile Release Train en SAFe' },
        { role: 'Gerente de Proyectos TI', desc: 'Gestionar proyectos tecnológicos usando metodologías Ágiles e híbridas' },
      ],
      conclusion: `La convergencia de la adopción global de Agile, el avance tecnológico de República Dominicana y la demanda de profesionales bilingües crea una oportunidad sin precedentes.`,
      cta: 'Explora Nuestro Curso de Scrum Master',
      source: 'Fuentes: Digital.ai 17th State of Agile Report, Foro Económico Mundial, ITIF, The Knowledge Academy, Glassdoor, AmbitionBox',
      statsLabels: { agile: 'Organizaciones Usando Agile', scrum: 'Tasa de Adopción de Scrum', growth: 'Crecimiento Proyectado (10 años)' },
    },
    zh: {
      badge: '行业洞察',
      title: 'Scrum在多米尼加共和国的崛起',
      subtitle: '了解拉丁美洲和加勒比地区对敏捷专业人员日益增长的需求',
      publishDate: '2026年1月26日',
      readTime: '8分钟阅读',
      intro: `多米尼加共和国正在迅速成为全球技术格局中的关键参与者。凭借其战略位置、双语劳动力和不断发展的IT行业，该国正在将自己定位为敏捷转型和Scrum采用的首选目的地。`,
      section1Title: '全球Scrum革命',
      section1Content: `根据Digital.ai第17届敏捷状态报告，71%的组织现在在其软件开发生命周期中使用敏捷方法论，Scrum仍然是最受欢迎的框架，采用率为66%。世界经济论坛预测，未来十年Scrum Master专业人员的需求将增长37.9%。`,
      section2Title: '为什么选择多米尼加共和国？',
      section2Content: `信息技术与创新基金会(ITIF)强调了多米尼加共和国对技术行业的吸引力，包括政治稳定、成本竞争力强的运营和自由化的贸易制度。`,
      section3Title: '双语优势',
      section3Content: `在当今全球化的技术环境中，双语专业人员的需求空前高涨。多米尼加共和国的西班牙语-英语双语劳动力使其非常适合与美国公司进行近岸外包合作。`,
      section4Title: 'Scrum Master薪资：全球视角',
      salaryData: [
        { country: '澳大利亚', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: '英国', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: '美国', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: '德国', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: '印度', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      pmSection4Title: '项目经理薪资：全球视角',
      pmSalaryData: [
        { country: '澳大利亚', salary: 'A$120,000 - A$145,000', flag: '🇦🇺' },
        { country: '英国', salary: 'GBP 55,000 - GBP 75,000', flag: '🇬🇧' },
        { country: '美国', salary: 'USD 95,000 - USD 130,000', flag: '🇺🇸' },
        { country: '德国', salary: 'EUR 60,000 - EUR 80,000', flag: '🇩🇪' },
        { country: '印度', salary: 'INR 12 LPA', flag: '🇮🇳' },
      ],
      section5Title: 'Scrum Master的顶级行业',
      industries: ['能源', '医疗保健与生命科学', '汽车', '金融服务', '咨询', '保险', 'IT与技术'],
      section6Title: 'Scrum职业路径',
      careerPaths: [
        { role: 'Scrum Master', desc: '引导团队遵循Scrum原则并消除障碍' },
        { role: '敏捷教练', desc: '促进组织内Scrum和敏捷的实施' },
        { role: 'Scrum导师', desc: '培训和教育团队成为有效的Scrum Master' },
        { role: '敏捷经理', desc: '战略性地领导多个Scrum Master和团队' },
        { role: '发布火车工程师', desc: '在SAFe敏捷发布火车中协调多个敏捷团队' },
        { role: 'IT项目经理', desc: '使用敏捷和混合方法论管理技术项目' },
      ],
      conclusion: `全球敏捷采用、多米尼加共和国的技术进步以及对双语专业人员的需求创造了前所未有的机会。无论您是刚开始职业生涯还是从传统项目管理转型，Scrum认证都会为您打开全球各行业高薪职位的大门。`,
      cta: '探索我们的Scrum Master课程',
      source: '来源：Digital.ai第17届敏捷状态报告、世界经济论坛、ITIF、The Knowledge Academy、Glassdoor、AmbitionBox',
      statsLabels: { agile: '使用敏捷的组织', scrum: 'Scrum采用率', growth: '预计增长（10年）' },
    },
    ar: {
      badge: 'رؤى الصناعة',
      title: 'صعود Scrum في جمهورية الدومينيكان',
      subtitle: 'فهم الطلب المتزايد على المحترفين الرشيقين في أمريكا اللاتينية ومنطقة البحر الكاريبي',
      publishDate: '26 يناير 2026',
      readTime: '8 دقائق للقراءة',
      intro: `تبرز جمهورية الدومينيكان بسرعة كلاعب رئيسي في المشهد التكنولوجي العالمي. بموقعها الاستراتيجي وقوتها العاملة ثنائية اللغة وقطاع تكنولوجيا المعلومات المتنامي، تضع البلاد نفسها كوجهة رئيسية للتحول الرشيق واعتماد Scrum.`,
      section1Title: 'ثورة Scrum العالمية',
      section1Content: `وفقًا للتقرير السابع عشر لحالة Agile من Digital.ai، تستخدم 71٪ من المنظمات الآن منهجيات رشيقة في دورة حياة تطوير البرمجيات، مع بقاء Scrum الإطار الأكثر شعبية بمعدل اعتماد 66٪. يتوقع المنتدى الاقتصادي العالمي أن ينمو الطلب على محترفي Scrum Master بنسبة 37.9٪ خلال العقد القادم.`,
      section2Title: 'لماذا جمهورية الدومينيكان؟',
      section2Content: `تسلط مؤسسة تكنولوجيا المعلومات والابتكار (ITIF) الضوء على جاذبية جمهورية الدومينيكان لصناعة التكنولوجيا، مستشهدة بالاستقرار السياسي والعمليات التنافسية من حيث التكلفة ونظام التجارة المحرر.`,
      section3Title: 'ميزة ثنائية اللغة',
      section3Content: `في المشهد التقني العولمي اليوم، يوجد طلب غير مسبوق على المحترفين ثنائيي اللغة. تضع القوى العاملة ثنائية اللغة (الإسبانية-الإنجليزية) في جمهورية الدومينيكان بشكل مثالي لفرص النقل القريب مع الشركات الأمريكية.`,
      section4Title: 'رواتب Scrum Master: منظور عالمي',
      salaryData: [
        { country: 'أستراليا', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: 'المملكة المتحدة', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: 'الولايات المتحدة', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: 'ألمانيا', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: 'الهند', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      pmSection4Title: 'رواتب مدير المشاريع: منظور عالمي',
      pmSalaryData: [
        { country: 'أستراليا', salary: 'A$120,000 - A$145,000', flag: '🇦🇺' },
        { country: 'المملكة المتحدة', salary: 'GBP 55,000 - GBP 75,000', flag: '🇬🇧' },
        { country: 'الولايات المتحدة', salary: 'USD 95,000 - USD 130,000', flag: '🇺🇸' },
        { country: 'ألمانيا', salary: 'EUR 60,000 - EUR 80,000', flag: '🇩🇪' },
        { country: 'الهند', salary: 'INR 12 LPA', flag: '🇮🇳' },
      ],
      section5Title: 'أفضل الصناعات لـ Scrum Masters',
      industries: ['الطاقة', 'الرعاية الصحية وعلوم الحياة', 'السيارات', 'الخدمات المالية', 'الاستشارات', 'التأمين', 'تكنولوجيا المعلومات'],
      section6Title: 'مسارات مهنية في Scrum',
      careerPaths: [
        { role: 'Scrum Master', desc: 'توجيه الفرق من خلال مبادئ Scrum وإزالة العقبات' },
        { role: 'مدرب رشيق', desc: 'تسهيل تنفيذ Scrum و Agile عبر المنظمات' },
        { role: 'مرشد Scrum', desc: 'تدريب وتعليم الفرق لتصبح Scrum Masters فعالين' },
        { role: 'مدير رشيق', desc: 'قيادة العديد من Scrum Masters والفرق بشكل استراتيجي' },
        { role: 'مهندس قطار الإطلاق', desc: 'تنسيق فرق Agile متعددة ضمن قطار إطلاق Agile في SAFe' },
        { role: 'مدير مشاريع تقنية المعلومات', desc: 'إدارة المشاريع التقنية باستخدام منهجيات Agile والهجينة' },
      ],
      conclusion: `إن تقارب اعتماد Agile العالمي والتقدم التكنولوجي لجمهورية الدومينيكان والطلب على المحترفين ثنائيي اللغة يخلق فرصة غير مسبوقة.`,
      cta: 'استكشف دورة Scrum Master لدينا',
      source: 'المصادر: تقرير Digital.ai السابع عشر لحالة Agile، المنتدى الاقتصادي العالمي، ITIF، The Knowledge Academy، Glassdoor، AmbitionBox',
      statsLabels: { agile: 'المنظمات التي تستخدم Agile', scrum: 'معدل اعتماد Scrum', growth: 'النمو المتوقع (10 سنوات)' },
    },
    fr: {
      badge: 'Perspectives de l\'Industrie',
      title: 'L\'Essor de Scrum en République Dominicaine',
      subtitle: 'Comprendre la demande croissante de professionnels Agile en Amérique latine et dans les Caraïbes',
      publishDate: '26 janvier 2026',
      readTime: '8 min de lecture',
      intro: `La République Dominicaine émerge rapidement comme un acteur clé dans le paysage technologique mondial. Avec sa position stratégique, sa main-d'œuvre bilingue et son secteur informatique en croissance, le pays se positionne comme une destination de choix pour la transformation Agile et l'adoption de Scrum.`,
      section1Title: 'La Révolution Mondiale de Scrum',
      section1Content: `Selon le 17e rapport State of Agile de Digital.ai, 71% des organisations utilisent désormais les méthodologies Agile dans leur cycle de développement logiciel, Scrum restant le framework le plus populaire avec un taux d'adoption de 66%. Le Forum Économique Mondial prévoit que la demande de professionnels Scrum Master augmentera de 37,9% au cours de la prochaine décennie.`,
      section2Title: 'Pourquoi la République Dominicaine ?',
      section2Content: `La Fondation pour l'Innovation et la Technologie de l'Information (ITIF) souligne l'attractivité de la République Dominicaine pour l'industrie technologique, citant la stabilité politique, les opérations compétitives en termes de coûts et un régime commercial libéralisé.`,
      section3Title: 'L\'Avantage Bilingue',
      section3Content: `Dans le paysage technologique mondialisé d'aujourd'hui, les professionnels bilingues sont en demande sans précédent. La main-d'œuvre bilingue espagnol-anglais de la République Dominicaine la positionne parfaitement pour les opportunités de nearshoring avec les entreprises américaines.`,
      section4Title: 'Salaires Scrum Master : Une Perspective Mondiale',
      salaryData: [
        { country: 'Australie', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: 'Royaume-Uni', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: 'États-Unis', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: 'Allemagne', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: 'Inde', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      pmSection4Title: 'Salaires Chef de Projet : Une Perspective Mondiale',
      pmSalaryData: [
        { country: 'Australie', salary: 'A$120,000 - A$145,000', flag: '🇦🇺' },
        { country: 'Royaume-Uni', salary: 'GBP 55,000 - GBP 75,000', flag: '🇬🇧' },
        { country: 'États-Unis', salary: 'USD 95,000 - USD 130,000', flag: '🇺🇸' },
        { country: 'Allemagne', salary: 'EUR 60,000 - EUR 80,000', flag: '🇩🇪' },
        { country: 'Inde', salary: 'INR 12 LPA', flag: '🇮🇳' },
      ],
      section5Title: 'Meilleures Industries pour les Scrum Masters',
      industries: ['Énergie', 'Santé et Sciences de la Vie', 'Automobile', 'Services Financiers', 'Conseil', 'Assurance', 'IT et Technologie'],
      section6Title: 'Parcours Professionnels en Scrum',
      careerPaths: [
        { role: 'Scrum Master', desc: 'Guider les équipes à travers les principes Scrum et éliminer les obstacles' },
        { role: 'Coach Agile', desc: 'Faciliter l\'implémentation de Scrum et Agile dans les organisations' },
        { role: 'Mentor Scrum', desc: 'Former et éduquer les équipes pour devenir des Scrum Masters efficaces' },
        { role: 'Manager Agile', desc: 'Diriger stratégiquement plusieurs Scrum Masters et équipes' },
        { role: 'Release Train Engineer', desc: 'Coordonner plusieurs équipes Agile au sein d\'un Agile Release Train SAFe' },
        { role: 'Chef de Projet IT', desc: 'Gérer des projets technologiques avec des méthodologies Agile et hybrides' },
      ],
      conclusion: `La convergence de l'adoption mondiale d'Agile, de l'avancement technologique de la République Dominicaine et de la demande de professionnels bilingues crée une opportunité sans précédent.`,
      cta: 'Explorez Notre Cours Scrum Master',
      source: 'Sources : Rapport Digital.ai 17th State of Agile, Forum Économique Mondial, ITIF, The Knowledge Academy, Glassdoor, AmbitionBox',
      statsLabels: { agile: 'Organisations Utilisant Agile', scrum: 'Taux d\'Adoption Scrum', growth: 'Croissance Projetée (10 ans)' },
    },
    de: {
      badge: 'Brancheneinblicke',
      title: 'Der Aufstieg von Scrum in der Dominikanischen Republik',
      subtitle: 'Die wachsende Nachfrage nach Agile-Fachleuten in Lateinamerika und der Karibik verstehen',
      publishDate: '26. Januar 2026',
      readTime: '8 Min. Lesezeit',
      intro: `Die Dominikanische Republik entwickelt sich schnell zu einem wichtigen Akteur in der globalen Technologielandschaft. Mit ihrer strategischen Lage, zweisprachigen Arbeitskräften und dem wachsenden IT-Sektor positioniert sich das Land als erstklassiges Ziel für Agile-Transformation und Scrum-Einführung.`,
      section1Title: 'Die Globale Scrum-Revolution',
      section1Content: `Laut dem 17. State of Agile Report von Digital.ai nutzen 71% der Organisationen jetzt Agile-Methoden in ihrem Software-Entwicklungslebenszyklus, wobei Scrum mit einer Adoptionsrate von 66% das beliebteste Framework bleibt. Das Weltwirtschaftsforum prognostiziert, dass die Nachfrage nach Scrum Master-Fachleuten im nächsten Jahrzehnt um 37,9% wachsen wird.`,
      section2Title: 'Warum die Dominikanische Republik?',
      section2Content: `Die Information Technology and Innovation Foundation (ITIF) hebt die Attraktivität der Dominikanischen Republik für die Technologiebranche hervor und nennt politische Stabilität, kostenwettbewerbsfähige Operationen und ein liberalisiertes Handelsregime.`,
      section3Title: 'Der Zweisprachige Vorteil',
      section3Content: `In der heutigen globalisierten Tech-Landschaft sind zweisprachige Fachleute so gefragt wie nie zuvor. Die spanisch-englische zweisprachige Belegschaft der Dominikanischen Republik positioniert sie perfekt für Nearshoring-Möglichkeiten mit US-Unternehmen.`,
      section4Title: 'Scrum Master Gehälter: Eine Globale Perspektive',
      salaryData: [
        { country: 'Australien', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: 'Vereinigtes Königreich', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: 'Vereinigte Staaten', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: 'Deutschland', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: 'Indien', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      pmSection4Title: 'Projektmanager Gehälter: Eine Globale Perspektive',
      pmSalaryData: [
        { country: 'Australien', salary: 'A$120,000 - A$145,000', flag: '🇦🇺' },
        { country: 'Vereinigtes Königreich', salary: 'GBP 55,000 - GBP 75,000', flag: '🇬🇧' },
        { country: 'Vereinigte Staaten', salary: 'USD 95,000 - USD 130,000', flag: '🇺🇸' },
        { country: 'Deutschland', salary: 'EUR 60,000 - EUR 80,000', flag: '🇩🇪' },
        { country: 'Indien', salary: 'INR 12 LPA', flag: '🇮🇳' },
      ],
      section5Title: 'Top-Branchen für Scrum Masters',
      industries: ['Energie', 'Gesundheitswesen & Life Sciences', 'Automobil', 'Finanzdienstleistungen', 'Beratung', 'Versicherung', 'IT & Technologie'],
      section6Title: 'Karrierewege in Scrum',
      careerPaths: [
        { role: 'Scrum Master', desc: 'Teams durch Scrum-Prinzipien führen und Hindernisse beseitigen' },
        { role: 'Agile Coach', desc: 'Scrum- und Agile-Implementierung in Organisationen erleichtern' },
        { role: 'Scrum Mentor', desc: 'Teams coachen und ausbilden, um effektive Scrum Masters zu werden' },
        { role: 'Agile Manager', desc: 'Mehrere Scrum Masters und Teams strategisch führen' },
        { role: 'Release Train Engineer', desc: 'Mehrere Agile-Teams innerhalb eines SAFe Agile Release Train koordinieren' },
        { role: 'IT-Projektmanager', desc: 'Technologieprojekte mit agilen und hybriden Methoden managen' },
      ],
      conclusion: `Die Konvergenz von globaler Agile-Adoption, dem technologischen Fortschritt der Dominikanischen Republik und der Nachfrage nach zweisprachigen Fachleuten schafft eine beispiellose Chance.`,
      cta: 'Entdecken Sie unseren Scrum Master Kurs',
      source: 'Quellen: Digital.ai 17th State of Agile Report, Weltwirtschaftsforum, ITIF, The Knowledge Academy, Glassdoor, AmbitionBox',
      statsLabels: { agile: 'Organisationen nutzen Agile', scrum: 'Scrum-Adoptionsrate', growth: 'Prognostiziertes Wachstum (10 Jahre)' },
    },
    ja: {
      badge: '業界インサイト',
      title: 'ドミニカ共和国でのスクラムの台頭',
      subtitle: 'ラテンアメリカとカリブ海地域におけるアジャイル専門家への高まる需要を理解する',
      publishDate: '2026年1月26日',
      readTime: '8分で読める',
      intro: `ドミニカ共和国は、グローバルなテクノロジー環境において急速に重要なプレーヤーとして台頭しています。戦略的な立地、バイリンガルな労働力、成長するIT部門により、この国はアジャイル変革とスクラム採用の主要な目的地として位置づけられています。`,
      section1Title: 'グローバルスクラム革命',
      section1Content: `Digital.aiの第17回State of Agileレポートによると、71%の組織がソフトウェア開発ライフサイクルでアジャイル方法論を使用しており、スクラムは66%の採用率で最も人気のあるフレームワークです。世界経済フォーラムは、スクラムマスター専門家への需要が今後10年間で37.9%成長すると予測しています。`,
      section2Title: 'なぜドミニカ共和国なのか？',
      section2Content: `情報技術イノベーション財団(ITIF)は、政治的安定性、コスト競争力のある運営、自由化された貿易体制を挙げて、テクノロジー産業にとってのドミニカ共和国の魅力を強調しています。`,
      section3Title: 'バイリンガルの優位性',
      section3Content: `今日のグローバル化したテック環境において、バイリンガルの専門家への需要はかつてないほど高まっています。ドミニカ共和国のスペイン語-英語バイリンガル労働力は、米国企業とのニアショアリング機会に最適です。`,
      section4Title: 'スクラムマスターの給与：グローバルな視点',
      salaryData: [
        { country: 'オーストラリア', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: 'イギリス', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: 'アメリカ', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: 'ドイツ', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: 'インド', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      pmSection4Title: 'プロジェクトマネージャーの給与：グローバルな視点',
      pmSalaryData: [
        { country: 'オーストラリア', salary: 'A$120,000 - A$145,000', flag: '🇦🇺' },
        { country: 'イギリス', salary: 'GBP 55,000 - GBP 75,000', flag: '🇬🇧' },
        { country: 'アメリカ', salary: 'USD 95,000 - USD 130,000', flag: '🇺🇸' },
        { country: 'ドイツ', salary: 'EUR 60,000 - EUR 80,000', flag: '🇩🇪' },
        { country: 'インド', salary: 'INR 12 LPA', flag: '🇮🇳' },
      ],
      section5Title: 'スクラムマスターのトップ業界',
      industries: ['エネルギー', 'ヘルスケア＆ライフサイエンス', '自動車', '金融サービス', 'コンサルティング', '保険', 'IT＆テクノロジー'],
      section6Title: 'スクラムのキャリアパス',
      careerPaths: [
        { role: 'スクラムマスター', desc: 'スクラムの原則に従ってチームを導き、障害を取り除く' },
        { role: 'アジャイルコーチ', desc: '組織全体でスクラムとアジャイルの実装を促進する' },
        { role: 'スクラムメンター', desc: 'チームをコーチし、効果的なスクラムマスターになるよう教育する' },
        { role: 'アジャイルマネージャー', desc: '複数のスクラムマスターとチームを戦略的にリードする' },
        { role: 'リリーストレインエンジニア', desc: 'SAFeアジャイルリリーストレイン内の複数のアジャイルチームを調整する' },
        { role: 'ITプロジェクトマネージャー', desc: 'アジャイルおよびハイブリッド手法を用いて技術プロジェクトを管理する' },
      ],
      conclusion: `グローバルなアジャイル採用、ドミニカ共和国の技術的進歩、バイリンガル専門家への需要の収束が、前例のない機会を生み出しています。`,
      cta: 'スクラムマスターコースを探索',
      source: '出典：Digital.ai第17回State of Agileレポート、世界経済フォーラム、ITIF、The Knowledge Academy、Glassdoor、AmbitionBox',
      statsLabels: { agile: 'アジャイルを使用する組織', scrum: 'スクラム採用率', growth: '予測成長（10年）' },
    },
  };

  // Safely get content with fallback to English
  const supportedLanguages: BlogLanguage[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const currentLang = supportedLanguages.includes(language as BlogLanguage) ? (language as BlogLanguage) : 'en';
  const t = content[currentLang];

  const stats = [
    { icon: TrendingUp, value: '71%', label: t.statsLabels.agile },
    { icon: BarChart3, value: '66%', label: t.statsLabels.scrum },
    { icon: Globe, value: '37.9%', label: t.statsLabels.growth },
  ];

  return (
    <section id="blog" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">{t.badge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            {t.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-4"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {t.publishDate}
            </span>
            <span>•</span>
            <span>{t.readTime}</span>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Blog Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-card shadow-soft">
            <CardContent className="p-8 lg:p-12 space-y-8">
              {/* Introduction */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.intro}
              </p>

              {/* Section 1 */}
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                  {t.section1Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.section1Content}
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-secondary" />
                  {t.section2Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.section2Content}
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-secondary" />
                  {t.section3Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.section3Content}
                </p>
              </div>

              {/* Salary Section */}
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-secondary" />
                  {t.section4Title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {t.salaryData.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{item.flag}</span>
                        <span className="font-semibold text-foreground">{item.country}</span>
                      </div>
                      <p className="text-primary font-bold">{item.salary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LATAM Salaries & DR Growth Charts */}
              <LatamInsights />

              {/* PM Global Salary Section */}
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-secondary" />
                  {t.pmSection4Title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {t.pmSalaryData.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{item.flag}</span>
                        <span className="font-semibold text-foreground">{item.country}</span>
                      </div>
                      <p className="text-primary font-bold">{item.salary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PM LATAM Salaries & DR Growth Charts */}
              <PMLatamInsights />

              {/* Industries */}
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  {t.section5Title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {t.industries.map((industry, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Paths */}
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  {t.section6Title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {t.careerPaths.map((path, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-border hover:border-secondary/30 transition-colors"
                    >
                      <h4 className="font-semibold text-foreground mb-1">{path.role}</h4>
                      <p className="text-sm text-muted-foreground">{path.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20">
                <p className="text-foreground leading-relaxed font-medium">
                  {t.conclusion}
                </p>
              </div>

              {/* Source */}
              <p className="text-xs text-muted-foreground italic">
                {t.source}
              </p>

              {/* CTA */}
              <div className="pt-4 flex justify-center">
                <Button 
                  variant="coral" 
                  size="lg"
                  className="group"
                  onClick={() => navigate('/auth')}
                >
                  {t.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.article>
      </div>
    </section>
  );
};

export default BlogSection;
