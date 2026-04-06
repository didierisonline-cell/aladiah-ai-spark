import { motion } from "framer-motion";
import { Globe, TrendingUp, Users, ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type Lang = 'en' | 'es' | 'zh' | 'ar' | 'fr' | 'de' | 'ja';

interface Content {
  badge: string;
  title: string;
  date: string;
  readTime: string;
  stats: { value: string; label: string }[];
  intro: string;
  s1Title: string;
  s1Content: string;
  s2Title: string;
  s2Content: string;
  s3Title: string;
  s3Content: string;
  conclusion: string;
  cta: string;
}

const content: Record<Lang, Content> = {
  en: {
    badge: "Africa Tech",
    title: "Why Africa Is the Next Frontier for IT Talent & Agile Transformation",
    date: "March 2026",
    readTime: "6 min read",
    stats: [
      { value: "700M+", label: "Young Africans under 30" },
      { value: "54", label: "Countries embracing digital transformation" },
      { value: "3x", label: "IT talent growth rate vs global average" },
    ],
    intro: "Africa's technology sector is experiencing unprecedented growth. With over 700 million people under the age of 30 and a rapidly expanding digital infrastructure, the continent is poised to become one of the world's most dynamic IT talent markets. Countries like Nigeria, Kenya, Rwanda, South Africa — and Cameroon — are producing world-class engineers, project managers, and Agile practitioners at scale.",
    s1Title: "The Digital Revolution Is African",
    s1Content: "From Yaoundé's Boulevard du 20 Mai to Nairobi's Silicon Savannah and Lagos's Yaba tech hub, African cities are transforming into innovation centers. Governments are investing heavily in digital infrastructure, coding bootcamps, and tech education — creating a pipeline of talent that global companies can no longer ignore.",
    s2Title: "Why Agile & Scrum Are Exploding in Africa",
    s2Content: "As African companies scale and compete globally, the demand for Scrum Masters and Project Managers who understand both local business culture and international Agile frameworks has skyrocketed. Organizations across fintech, telecom, healthcare, and government are adopting Scrum — creating massive opportunities for certified professionals.",
    s3Title: "Aladiah Academy's Mission in Africa",
    s3Content: "Aladiah Academy is committed to being the premier Agile training platform for African professionals. Our AI-powered courses are designed to be accessible, multilingual, and deeply practical — giving African Scrum Masters the tools to compete for remote U.S. roles paying $100K+ while also driving transformation in their home markets.",
    conclusion: "The future of global Agile talent is African. Aladiah Academy is here to make sure that future is trained, certified, and ready to lead.",
    cta: 'Start Your Journey',
  },
  es: {
    badge: "Tecnología en África",
    title: "Por qué África es la próxima frontera del talento TI y la transformación ágil",
    date: "Marzo 2026",
    readTime: "6 min de lectura",
    stats: [
      { value: "700M+", label: "Jóvenes africanos menores de 30" },
      { value: "54", label: "Países adoptando la transformación digital" },
      { value: "3x", label: "Tasa de crecimiento del talento TI vs promedio global" },
    ],
    intro: "El sector tecnológico de África está experimentando un crecimiento sin precedentes. Con más de 700 millones de personas menores de 30 años y una infraestructura digital en rápida expansión, el continente está posicionado para convertirse en uno de los mercados de talento TI más dinámicos del mundo.",
    s1Title: "La revolución digital es africana",
    s1Content: "Desde el Boulevard du 20 Mai de Yaundé hasta Silicon Savannah de Nairobi y el centro tecnológico Yaba de Lagos, las ciudades africanas se están transformando en centros de innovación. Los gobiernos están invirtiendo fuertemente en infraestructura digital, bootcamps de programación y educación tecnológica.",
    s2Title: "Por qué Agile y Scrum están explotando en África",
    s2Content: "A medida que las empresas africanas escalan y compiten globalmente, la demanda de Scrum Masters y Project Managers que entiendan tanto la cultura empresarial local como los marcos ágiles internacionales se ha disparado.",
    s3Title: "La misión de Aladiah Academy en África",
    s3Content: "Aladiah Academy está comprometida a ser la principal plataforma de formación ágil para profesionales africanos. Nuestros cursos impulsados por IA están diseñados para ser accesibles, multilingües y profundamente prácticos.",
    conclusion: "El futuro del talento ágil global es africano. Aladiah Academy está aquí para asegurarse de que ese futuro esté formado, certificado y listo para liderar.",
    cta: "Comienza tu viaje",
  },
  zh: {
    badge: "非洲科技",
    title: "为什么非洲是IT人才和敏捷转型的下一个前沿",
    date: "2026年3月",
    readTime: "6分钟阅读",
    stats: [
      { value: "7亿+", label: "30岁以下的非洲年轻人" },
      { value: "54", label: "个国家拥抱数字化转型" },
      { value: "3倍", label: "IT人才增长率（相比全球平均）" },
    ],
    intro: "非洲科技行业正经历前所未有的增长。拥有超过7亿30岁以下人口和快速扩展的数字基础设施，非洲大陆有望成为世界上最具活力的IT人才市场之一。",
    s1Title: "数字革命属于非洲",
    s1Content: "从雅温得的20 Mai大道到内罗毕的硅草原和拉各斯的Yaba科技中心，非洲城市正在转变为创新中心。各国政府正大力投资数字基础设施、编程训练营和科技教育。",
    s2Title: "为什么敏捷和Scrum在非洲爆发式增长",
    s2Content: "随着非洲企业的扩张和全球竞争，对理解当地商业文化和国际敏捷框架的Scrum Master和项目经理的需求急剧增加。",
    s3Title: "Aladiah Academy在非洲的使命",
    s3Content: "Aladiah Academy致力于成为非洲专业人士的首选敏捷培训平台。我们的AI驱动课程设计为可访问、多语言且注重实践。",
    conclusion: "全球敏捷人才的未来在非洲。Aladiah Academy在这里确保这个未来经过培训、认证并准备好领导。",
    cta: "开始你的旅程",
  },
  ar: {
    badge: "تكنولوجيا أفريقيا",
    title: "لماذا أفريقيا هي الحدود التالية لمواهب تكنولوجيا المعلومات والتحول الرشيق",
    date: "مارس 2026",
    readTime: "6 دقائق قراءة",
    stats: [
      { value: "+700M", label: "شباب أفارقة تحت 30 عاماً" },
      { value: "54", label: "دولة تتبنى التحول الرقمي" },
      { value: "3x", label: "معدل نمو مواهب تكنولوجيا المعلومات مقابل المتوسط العالمي" },
    ],
    intro: "يشهد قطاع التكنولوجيا في أفريقيا نمواً غير مسبوق. مع أكثر من 700 مليون شخص تحت سن 30 وبنية تحتية رقمية سريعة التوسع، القارة مهيأة لتصبح واحدة من أكثر أسواق المواهب التكنولوجية ديناميكية في العالم.",
    s1Title: "الثورة الرقمية أفريقية",
    s1Content: "من شارع 20 ماي في ياوندي إلى وادي السيليكون في نيروبي ومركز يابا التقني في لاغوس، تتحول المدن الأفريقية إلى مراكز ابتكار.",
    s2Title: "لماذا ينفجر Agile و Scrum في أفريقيا",
    s2Content: "مع توسع الشركات الأفريقية والمنافسة عالمياً، ارتفع الطلب على خبراء Scrum Master ومديري المشاريع الذين يفهمون ثقافة الأعمال المحلية والأطر الرشيقة الدولية.",
    s3Title: "مهمة أكاديمية Aladiah في أفريقيا",
    s3Content: "تلتزم أكاديمية Aladiah بأن تكون منصة التدريب الرشيق الرائدة للمحترفين الأفارقة. دوراتنا المدعومة بالذكاء الاصطناعي مصممة لتكون سهلة الوصول ومتعددة اللغات وعملية للغاية.",
    conclusion: "مستقبل المواهب الرشيقة العالمية أفريقي. أكاديمية Aladiah هنا لضمان أن يكون هذا المستقبل مدرباً ومعتمداً وجاهزاً للقيادة.",
    cta: "ابدأ رحلتك",
  },
  fr: {
    badge: "Tech Afrique",
    title: "Pourquoi l'Afrique est la prochaine frontière des talents IT et de la transformation Agile",
    date: "Mars 2026",
    readTime: "6 min de lecture",
    stats: [
      { value: "700M+", label: "Jeunes Africains de moins de 30 ans" },
      { value: "54", label: "Pays adoptant la transformation numérique" },
      { value: "3x", label: "Taux de croissance des talents IT vs moyenne mondiale" },
    ],
    intro: "Le secteur technologique africain connaît une croissance sans précédent. Avec plus de 700 millions de personnes de moins de 30 ans et une infrastructure numérique en expansion rapide, le continent est en passe de devenir l'un des marchés de talents IT les plus dynamiques au monde.",
    s1Title: "La révolution numérique est africaine",
    s1Content: "Du Boulevard du 20 Mai de Yaoundé à la Silicon Savannah de Nairobi et au hub tech de Yaba à Lagos, les villes africaines se transforment en centres d'innovation.",
    s2Title: "Pourquoi Agile et Scrum explosent en Afrique",
    s2Content: "Alors que les entreprises africaines grandissent et rivalisent à l'échelle mondiale, la demande de Scrum Masters et de chefs de projet comprenant la culture d'affaires locale et les cadres Agile internationaux a explosé.",
    s3Title: "La mission d'Aladiah Academy en Afrique",
    s3Content: "Aladiah Academy s'engage à être la première plateforme de formation Agile pour les professionnels africains. Nos cours alimentés par l'IA sont conçus pour être accessibles, multilingues et profondément pratiques.",
    conclusion: "L'avenir du talent Agile mondial est africain. Aladiah Academy est là pour s'assurer que cet avenir est formé, certifié et prêt à diriger.",
    cta: "Commencez votre parcours",
  },
  de: {
    badge: "Afrika Tech",
    title: "Warum Afrika die nächste Grenze für IT-Talente und agile Transformation ist",
    date: "März 2026",
    readTime: "6 Min. Lesezeit",
    stats: [
      { value: "700M+", label: "Junge Afrikaner unter 30" },
      { value: "54", label: "Länder mit digitaler Transformation" },
      { value: "3x", label: "IT-Talent-Wachstumsrate vs. globaler Durchschnitt" },
    ],
    intro: "Afrikas Technologiesektor erlebt ein beispielloses Wachstum. Mit über 700 Millionen Menschen unter 30 Jahren und einer sich schnell ausbauenden digitalen Infrastruktur ist der Kontinent auf dem Weg, einer der dynamischsten IT-Talentmärkte der Welt zu werden.",
    s1Title: "Die digitale Revolution ist afrikanisch",
    s1Content: "Vom Boulevard du 20 Mai in Yaoundé über Nairobis Silicon Savannah bis zum Yaba-Tech-Hub in Lagos verwandeln sich afrikanische Städte in Innovationszentren.",
    s2Title: "Warum Agile und Scrum in Afrika explodieren",
    s2Content: "Da afrikanische Unternehmen wachsen und global konkurrieren, ist die Nachfrage nach Scrum Masters und Projektmanagern, die sowohl die lokale Geschäftskultur als auch internationale Agile-Frameworks verstehen, stark gestiegen.",
    s3Title: "Die Mission der Aladiah Academy in Afrika",
    s3Content: "Die Aladiah Academy ist entschlossen, die führende Agile-Trainingsplattform für afrikanische Fachkräfte zu sein. Unsere KI-gestützten Kurse sind zugänglich, mehrsprachig und praxisnah gestaltet.",
    conclusion: "Die Zukunft des globalen Agile-Talents ist afrikanisch. Die Aladiah Academy sorgt dafür, dass diese Zukunft ausgebildet, zertifiziert und bereit ist zu führen.",
    cta: "Starten Sie Ihre Reise",
  },
  ja: {
    badge: "アフリカテック",
    title: "アフリカがIT人材とアジャイル変革の次なるフロンティアである理由",
    date: "2026年3月",
    readTime: "6分で読める",
    stats: [
      { value: "7億+", label: "30歳未満のアフリカの若者" },
      { value: "54", label: "デジタル変革を受け入れる国々" },
      { value: "3倍", label: "IT人材成長率（世界平均比）" },
    ],
    intro: "アフリカのテクノロジーセクターは前例のない成長を遂げています。30歳未満の7億人以上の人口と急速に拡大するデジタルインフラにより、大陸は世界で最もダイナミックなIT人材市場の一つになる準備ができています。",
    s1Title: "デジタル革命はアフリカのもの",
    s1Content: "ヤウンデの20 Mai大通りからナイロビのシリコンサバンナ、ラゴスのYabaテックハブまで、アフリカの都市はイノベーションセンターに変貌しています。",
    s2Title: "アジャイルとスクラムがアフリカで爆発的に成長している理由",
    s2Content: "アフリカ企業がグローバルに拡大・競争する中、地元のビジネス文化と国際的なアジャイルフレームワークの両方を理解するスクラムマスターとプロジェクトマネージャーの需要が急増しています。",
    s3Title: "Aladiah Academyのアフリカでのミッション",
    s3Content: "Aladiah Academyは、アフリカの専門家のためのプレミアアジャイルトレーニングプラットフォームであることを約束します。AI搭載のコースは、アクセスしやすく、多言語対応で、実践的に設計されています。",
    conclusion: "グローバルなアジャイル人材の未来はアフリカにあります。Aladiah Academyは、その未来がトレーニングされ、認定され、リードする準備ができていることを保証します。",
    cta: "あなたの旅を始めましょう",
  },
};

const AfricaITBlog = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const c = content[language as Lang] || content.en;

  return (
    <section id="africa-blog" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
          >
            <Globe className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">{c.badge}</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            {c.title}
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{c.date}</span>
            <span>•</span>
            <span>{c.readTime}</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {c.stats.map((stat, i) => {
            const icons = [TrendingUp, Globe, Users];
            const Icon = icons[i];
            return (
              <Card key={i} className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold text-secondary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-4xl mx-auto">
          <Card className="bg-card shadow-soft">
            <CardContent className="p-8 lg:p-12 space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">{c.intro}</p>
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                  {c.s1Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{c.s1Content}</p>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-secondary" />
                  {c.s2Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{c.s2Content}</p>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-secondary" />
                  {c.s3Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{c.s3Content}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["🇳🇬 Nigeria", "🇰🇪 Kenya", "🇷🇼 Rwanda", "🇿🇦 South Africa", "🇨🇲 Cameroon", "🇬🇭 Ghana", "🇸🇳 Senegal", "🇨🇮 Côte d'Ivoire"].map((country) => (
                  <span key={country} className="px-3 py-2 rounded-lg bg-secondary/10 text-secondary text-sm font-medium text-center">{country}</span>
                ))}
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20">
                <p className="text-foreground leading-relaxed font-medium">{c.conclusion}</p>
              </div>
              <div className="pt-4 flex justify-center">
                <Button variant="coral" size="lg" className="group" onClick={() => navigate("/auth")}>
                  {c.cta}
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

export default AfricaITBlog;
