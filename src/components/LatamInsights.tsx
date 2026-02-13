import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

type LangKey = 'en' | 'es' | 'zh' | 'ar' | 'fr' | 'de' | 'ja';

const scrumGrowthDR = [
  { year: '2018', adoption: 8 },
  { year: '2019', adoption: 12 },
  { year: '2020', adoption: 19 },
  { year: '2021', adoption: 28 },
  { year: '2022', adoption: 38 },
  { year: '2023', adoption: 47 },
  { year: '2024', adoption: 55 },
  { year: '2025', adoption: 63 },
  { year: '2026', adoption: 71 },
];

const aiAdoptionDR = [
  { year: '2019', adoption: 3 },
  { year: '2020', adoption: 7 },
  { year: '2021', adoption: 14 },
  { year: '2022', adoption: 22 },
  { year: '2023', adoption: 35 },
  { year: '2024', adoption: 48 },
  { year: '2025', adoption: 59 },
  { year: '2026', adoption: 68 },
];

const translations: Record<LangKey, {
  latamTitle: string;
  latamSubtitle: string;
  scrumChartTitle: string;
  scrumChartSubtitle: string;
  aiChartTitle: string;
  aiChartSubtitle: string;
  yAxisLabel: string;
  countries: { name: string; salary: string; flag: string; trend: string }[];
}> = {
  en: {
    latamTitle: 'Trending Scrum Salaries in Latin America',
    latamSubtitle: 'Annual Scrum Master salaries across key LATAM markets',
    scrumChartTitle: 'Scrum Adoption Growth in Dominican Republic',
    scrumChartSubtitle: '% of tech organizations using Scrum framework',
    aiChartTitle: 'AI Adoption Growth in Dominican Republic',
    aiChartSubtitle: '% of businesses integrating AI solutions',
    yAxisLabel: 'Adoption %',
    countries: [
      { name: 'Dominican Republic', salary: 'USD 28,000 - USD 45,000', flag: '🇩🇴', trend: '↑ 24% YoY' },
      { name: 'Colombia', salary: 'USD 22,000 - USD 38,000', flag: '🇨🇴', trend: '↑ 18% YoY' },
      { name: 'Mexico', salary: 'USD 30,000 - USD 52,000', flag: '🇲🇽', trend: '↑ 21% YoY' },
      { name: 'Argentina', salary: 'USD 18,000 - USD 35,000', flag: '🇦🇷', trend: '↑ 15% YoY' },
    ],
  },
  es: {
    latamTitle: 'Salarios Tendencia de Scrum en América Latina',
    latamSubtitle: 'Salarios anuales de Scrum Master en mercados clave de LATAM',
    scrumChartTitle: 'Crecimiento de Adopción de Scrum en República Dominicana',
    scrumChartSubtitle: '% de organizaciones tecnológicas usando el framework Scrum',
    aiChartTitle: 'Crecimiento de Adopción de IA en República Dominicana',
    aiChartSubtitle: '% de empresas integrando soluciones de IA',
    yAxisLabel: 'Adopción %',
    countries: [
      { name: 'República Dominicana', salary: 'USD 28,000 - USD 45,000', flag: '🇩🇴', trend: '↑ 24% interanual' },
      { name: 'Colombia', salary: 'USD 22,000 - USD 38,000', flag: '🇨🇴', trend: '↑ 18% interanual' },
      { name: 'México', salary: 'USD 30,000 - USD 52,000', flag: '🇲🇽', trend: '↑ 21% interanual' },
      { name: 'Argentina', salary: 'USD 18,000 - USD 35,000', flag: '🇦🇷', trend: '↑ 15% interanual' },
    ],
  },
  zh: {
    latamTitle: '拉丁美洲Scrum薪资趋势',
    latamSubtitle: '关键拉美市场的Scrum Master年薪',
    scrumChartTitle: '多米尼加共和国Scrum采用增长',
    scrumChartSubtitle: '使用Scrum框架的科技组织百分比',
    aiChartTitle: '多米尼加共和国AI采用增长',
    aiChartSubtitle: '整合AI解决方案的企业百分比',
    yAxisLabel: '采用率 %',
    countries: [
      { name: '多米尼加共和国', salary: 'USD 28,000 - USD 45,000', flag: '🇩🇴', trend: '↑ 24% 同比' },
      { name: '哥伦比亚', salary: 'USD 22,000 - USD 38,000', flag: '🇨🇴', trend: '↑ 18% 同比' },
      { name: '墨西哥', salary: 'USD 30,000 - USD 52,000', flag: '🇲🇽', trend: '↑ 21% 同比' },
      { name: '阿根廷', salary: 'USD 18,000 - USD 35,000', flag: '🇦🇷', trend: '↑ 15% 同比' },
    ],
  },
  ar: {
    latamTitle: 'رواتب Scrum الرائجة في أمريكا اللاتينية',
    latamSubtitle: 'رواتب Scrum Master السنوية في أسواق LATAM الرئيسية',
    scrumChartTitle: 'نمو اعتماد Scrum في جمهورية الدومينيكان',
    scrumChartSubtitle: '% من منظمات التكنولوجيا التي تستخدم إطار Scrum',
    aiChartTitle: 'نمو اعتماد الذكاء الاصطناعي في جمهورية الدومينيكان',
    aiChartSubtitle: '% من الشركات التي تدمج حلول الذكاء الاصطناعي',
    yAxisLabel: '% الاعتماد',
    countries: [
      { name: 'جمهورية الدومينيكان', salary: 'USD 28,000 - USD 45,000', flag: '🇩🇴', trend: '↑ 24% سنوياً' },
      { name: 'كولومبيا', salary: 'USD 22,000 - USD 38,000', flag: '🇨🇴', trend: '↑ 18% سنوياً' },
      { name: 'المكسيك', salary: 'USD 30,000 - USD 52,000', flag: '🇲🇽', trend: '↑ 21% سنوياً' },
      { name: 'الأرجنتين', salary: 'USD 18,000 - USD 35,000', flag: '🇦🇷', trend: '↑ 15% سنوياً' },
    ],
  },
  fr: {
    latamTitle: 'Salaires Scrum en Tendance en Amérique Latine',
    latamSubtitle: 'Salaires annuels des Scrum Masters sur les marchés clés de LATAM',
    scrumChartTitle: 'Croissance de l\'Adoption de Scrum en République Dominicaine',
    scrumChartSubtitle: '% d\'organisations tech utilisant le framework Scrum',
    aiChartTitle: 'Croissance de l\'Adoption de l\'IA en République Dominicaine',
    aiChartSubtitle: '% d\'entreprises intégrant des solutions IA',
    yAxisLabel: 'Adoption %',
    countries: [
      { name: 'République Dominicaine', salary: 'USD 28,000 - USD 45,000', flag: '🇩🇴', trend: '↑ 24% par an' },
      { name: 'Colombie', salary: 'USD 22,000 - USD 38,000', flag: '🇨🇴', trend: '↑ 18% par an' },
      { name: 'Mexique', salary: 'USD 30,000 - USD 52,000', flag: '🇲🇽', trend: '↑ 21% par an' },
      { name: 'Argentine', salary: 'USD 18,000 - USD 35,000', flag: '🇦🇷', trend: '↑ 15% par an' },
    ],
  },
  de: {
    latamTitle: 'Trendgehälter für Scrum in Lateinamerika',
    latamSubtitle: 'Jährliche Scrum Master Gehälter in wichtigen LATAM-Märkten',
    scrumChartTitle: 'Scrum-Adoptionswachstum in der Dominikanischen Republik',
    scrumChartSubtitle: '% der Tech-Organisationen mit Scrum-Framework',
    aiChartTitle: 'KI-Adoptionswachstum in der Dominikanischen Republik',
    aiChartSubtitle: '% der Unternehmen mit KI-Integration',
    yAxisLabel: 'Adoption %',
    countries: [
      { name: 'Dominikanische Republik', salary: 'USD 28,000 - USD 45,000', flag: '🇩🇴', trend: '↑ 24% p.a.' },
      { name: 'Kolumbien', salary: 'USD 22,000 - USD 38,000', flag: '🇨🇴', trend: '↑ 18% p.a.' },
      { name: 'Mexiko', salary: 'USD 30,000 - USD 52,000', flag: '🇲🇽', trend: '↑ 21% p.a.' },
      { name: 'Argentinien', salary: 'USD 18,000 - USD 35,000', flag: '🇦🇷', trend: '↑ 15% p.a.' },
    ],
  },
  ja: {
    latamTitle: 'ラテンアメリカのScrum給与トレンド',
    latamSubtitle: '主要LATAMマーケットのスクラムマスター年収',
    scrumChartTitle: 'ドミニカ共和国のScrum採用成長',
    scrumChartSubtitle: 'Scrumフレームワークを使用するテック組織の割合',
    aiChartTitle: 'ドミニカ共和国のAI採用成長',
    aiChartSubtitle: 'AIソリューションを統合する企業の割合',
    yAxisLabel: '採用率 %',
    countries: [
      { name: 'ドミニカ共和国', salary: 'USD 28,000 - USD 45,000', flag: '🇩🇴', trend: '↑ 24% 年間' },
      { name: 'コロンビア', salary: 'USD 22,000 - USD 38,000', flag: '🇨🇴', trend: '↑ 18% 年間' },
      { name: 'メキシコ', salary: 'USD 30,000 - USD 52,000', flag: '🇲🇽', trend: '↑ 21% 年間' },
      { name: 'アルゼンチン', salary: 'USD 18,000 - USD 35,000', flag: '🇦🇷', trend: '↑ 15% 年間' },
    ],
  },
};

const LatamInsights = () => {
  const { language } = useLanguage();
  const supportedLangs: LangKey[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const lang = supportedLangs.includes(language as LangKey) ? (language as LangKey) : 'en';
  const t = translations[lang];

  return (
    <div className="space-y-12">
      {/* LATAM Salary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-secondary" />
          {t.latamTitle}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">{t.latamSubtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.countries.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-5 rounded-xl bg-muted/50 border border-border hover:border-secondary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.flag}</span>
                  <span className="font-semibold text-foreground">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-accent-foreground bg-accent/20 px-2 py-0.5 rounded-full">
                  {item.trend}
                </span>
              </div>
              <p className="text-primary font-bold text-lg">{item.salary}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scrum Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-display font-bold text-foreground text-lg">{t.scrumChartTitle}</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-6">{t.scrumChartSubtitle}</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scrumGrowthDR} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="scrumGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(215, 70%, 22%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(215, 70%, 22%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} domain={[0, 80]} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(215, 20%, 88%)',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Adoption']}
                    />
                    <Area
                      type="monotone"
                      dataKey="adoption"
                      stroke="hsl(215, 70%, 22%)"
                      strokeWidth={3}
                      fill="url(#scrumGrad)"
                      dot={{ fill: 'hsl(215, 70%, 22%)', r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(15, 85%, 60%)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Adoption Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-secondary" />
                <h4 className="font-display font-bold text-foreground text-lg">{t.aiChartTitle}</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-6">{t.aiChartSubtitle}</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={aiAdoptionDR} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(15, 85%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(15, 85%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} domain={[0, 80]} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(215, 20%, 88%)',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Adoption']}
                    />
                    <Area
                      type="monotone"
                      dataKey="adoption"
                      stroke="hsl(15, 85%, 60%)"
                      strokeWidth={3}
                      fill="url(#aiGrad)"
                      dot={{ fill: 'hsl(15, 85%, 60%)', r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(215, 70%, 22%)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LatamInsights;
