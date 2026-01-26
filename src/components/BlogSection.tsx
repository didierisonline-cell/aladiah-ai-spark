import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Globe, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const BlogSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const content = {
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
      
      section5Title: 'Top Industries for Scrum Masters',
      industries: ['Energy', 'Healthcare & Life Sciences', 'Automotive', 'Financial Services', 'Consulting', 'Insurance', 'IT & Technology'],
      
      section6Title: 'Career Paths in Scrum',
      careerPaths: [
        { role: 'Scrum Master', desc: 'Guide teams through Scrum principles and remove obstacles' },
        { role: 'Agile Coach', desc: 'Facilitate Scrum and Agile implementation across organizations' },
        { role: 'Scrum Mentor', desc: 'Coach and educate teams on becoming effective Scrum Masters' },
        { role: 'Agile Manager', desc: 'Lead multiple Scrum Masters and teams strategically' },
      ],
      
      conclusion: `The convergence of global Agile adoption, the Dominican Republic's technological advancement, and the demand for bilingual professionals creates an unprecedented opportunity. Whether you're starting your career or transitioning from traditional project management, Scrum certification opens doors to high-paying roles across industries worldwide.`,
      
      cta: 'Explore Our Scrum Master Course',
      source: 'Sources: Digital.ai 17th State of Agile Report, World Economic Forum, ITIF, The Knowledge Academy, Glassdoor, AmbitionBox',
    },
    es: {
      badge: 'Perspectivas de la Industria',
      title: 'El Auge de Scrum en República Dominicana',
      subtitle: 'Entendiendo la creciente demanda de profesionales Ágiles en América Latina y el Caribe',
      publishDate: '26 de enero de 2026',
      readTime: '8 min de lectura',
      
      intro: `República Dominicana está emergiendo rápidamente como un actor clave en el panorama tecnológico global. Con su ubicación estratégica, fuerza laboral bilingüe y sector de TI en crecimiento, el país se está posicionando como un destino principal para la transformación Ágil y la adopción de Scrum. Pero, ¿qué impulsa este crecimiento y por qué es el momento perfecto para convertirse en Scrum Master certificado en el Caribe?`,
      
      section1Title: 'La Revolución Global de Scrum',
      section1Content: `Según el 17º Informe del Estado de Agile de Digital.ai, el 71% de las organizaciones ahora utilizan metodologías Ágiles en su ciclo de desarrollo de software, con Scrum siendo el framework más popular con una tasa de adopción del 66%. El Foro Económico Mundial proyecta que la demanda de profesionales Scrum Master crecerá un 37.9% en la próxima década, con tres de cada nueve roles de desarrollo de productos siendo relacionados con Scrum.`,
      
      section2Title: '¿Por qué República Dominicana?',
      section2Content: `La Fundación de Tecnología de la Información e Innovación (ITIF) destaca el atractivo de República Dominicana para la industria tecnológica, citando estabilidad política, operaciones competitivas en costos y un régimen comercial liberalizado. Como una de las economías de más rápido crecimiento en las Américas, el país ofrece ventajas únicas para profesionales que buscan carreras Ágiles.`,
      
      section3Title: 'La Ventaja Bilingüe',
      section3Content: `En el panorama tecnológico globalizado de hoy, los profesionales bilingües tienen una demanda sin precedentes. La fuerza laboral bilingüe español-inglés de República Dominicana la posiciona perfectamente para oportunidades de nearshoring con empresas estadounidenses. Organizaciones como BIREME (Organización Panamericana de la Salud) han adoptado recientemente frameworks Scrum, demostrando la expansión de la metodología en instituciones latinoamericanas.`,
      
      section4Title: 'Salarios de Scrum Master: Una Perspectiva Global',
      salaryData: [
        { country: 'Australia', salary: 'A$135,000 - A$156,000', flag: '🇦🇺' },
        { country: 'Reino Unido', salary: 'GBP 75,799', flag: '🇬🇧' },
        { country: 'Estados Unidos', salary: 'USD 115,000 - USD 145,000', flag: '🇺🇸' },
        { country: 'Alemania', salary: 'EUR 70,000 - EUR 85,000', flag: '🇩🇪' },
        { country: 'India', salary: 'INR 14 LPA', flag: '🇮🇳' },
      ],
      
      section5Title: 'Principales Industrias para Scrum Masters',
      industries: ['Energía', 'Salud y Ciencias de la Vida', 'Automotriz', 'Servicios Financieros', 'Consultoría', 'Seguros', 'TI y Tecnología'],
      
      section6Title: 'Trayectorias Profesionales en Scrum',
      careerPaths: [
        { role: 'Scrum Master', desc: 'Guiar equipos a través de los principios de Scrum y eliminar obstáculos' },
        { role: 'Coach Ágil', desc: 'Facilitar la implementación de Scrum y Agile en organizaciones' },
        { role: 'Mentor Scrum', desc: 'Entrenar y educar equipos para convertirse en Scrum Masters efectivos' },
        { role: 'Gerente Ágil', desc: 'Liderar múltiples Scrum Masters y equipos estratégicamente' },
      ],
      
      conclusion: `La convergencia de la adopción global de Agile, el avance tecnológico de República Dominicana y la demanda de profesionales bilingües crea una oportunidad sin precedentes. Ya sea que estés comenzando tu carrera o haciendo la transición desde la gestión de proyectos tradicional, la certificación Scrum abre puertas a roles bien remunerados en industrias de todo el mundo.`,
      
      cta: 'Explora Nuestro Curso de Scrum Master',
      source: 'Fuentes: Digital.ai 17th State of Agile Report, Foro Económico Mundial, ITIF, The Knowledge Academy, Glassdoor, AmbitionBox',
    },
  };

  const t = content[language];

  const stats = [
    { icon: TrendingUp, value: '71%', label: language === 'en' ? 'Organizations Using Agile' : 'Organizaciones Usando Agile' },
    { icon: BarChart3, value: '66%', label: language === 'en' ? 'Scrum Adoption Rate' : 'Tasa de Adopción de Scrum' },
    { icon: Globe, value: '37.9%', label: language === 'en' ? 'Projected Growth (10 years)' : 'Crecimiento Proyectado (10 años)' },
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
