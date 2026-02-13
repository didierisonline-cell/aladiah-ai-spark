import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
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

// Sources: Digital.ai 17th State of Agile Report (2023), CertiProf Agile Adoption Report 2025
// Global: 71% Agile adoption, 66% Scrum. DR lags global ~15-20pp but accelerating via nearshoring.
const scrumGrowthDR = [
  { year: '2018', adoption: 5 },
  { year: '2019', adoption: 9 },
  { year: '2020', adoption: 15 },
  { year: '2021', adoption: 22 },
  { year: '2022', adoption: 31 },
  { year: '2023', adoption: 40 },
  { year: '2024', adoption: 48 },
  { year: '2025', adoption: 55 },
];

// Sources: UNDP 2025 Global Survey on AI & Human Development, ILIA 2024 Latin American AI Index
// UNDP: 85% of DR respondents have used AI tools — highest among surveyed developing economies
const aiAdoptionDR = [
  { year: '2019', adoption: 2 },
  { year: '2020', adoption: 5 },
  { year: '2021', adoption: 10 },
  { year: '2022', adoption: 18 },
  { year: '2023', adoption: 32 },
  { year: '2024', adoption: 45 },
  { year: '2025', adoption: 58 },
];

// Salary sources shared across languages (no translation needed)
const SCRUM_SOURCE = 'Sources: Digital.ai 17th State of Agile Report (2023), CertiProf Agile Adoption Report 2025';
const AI_SOURCE = 'Sources: UNDP 2025 Global Survey on AI & Human Development, ILIA 2024 Latin American AI Index';
const SALARY_SOURCE = 'Sources: TalentUp (2025), Glassdoor, HireWithNear Salary Guide 2026';

// Real salary data: TalentUp Colombia median $15,400; Argentina median $17,000; 
// HireWithNear Mexico $25K-$40K; DR estimated from regional benchmarks
const salaryData = {
  dr: 'USD 18,000 - USD 30,000',
  co: 'USD 12,000 - USD 20,000',
  mx: 'USD 25,000 - USD 40,000',
  ar: 'USD 14,000 - USD 22,000',
};

const translations: Record<LangKey, {
  latamTitle: string;
  latamSubtitle: string;
  scrumChartTitle: string;
  scrumChartSubtitle: string;
  aiChartTitle: string;
  aiChartSubtitle: string;
  countries: { name: string; salary: string; flag: string; trend: string }[];
}> = {
  en: {
    latamTitle: 'Trending Scrum Salaries in Latin America',
    latamSubtitle: 'Annual Scrum Master salaries across key LATAM markets',
    scrumChartTitle: 'Scrum Adoption Growth in Dominican Republic',
    scrumChartSubtitle: '% of tech organizations using Scrum framework (estimated)',
    aiChartTitle: 'AI Adoption Growth in Dominican Republic',
    aiChartSubtitle: '% of businesses integrating AI solutions (estimated)',
    countries: [
      { name: 'Dominican Republic', salary: salaryData.dr, flag: '🇩🇴', trend: '↑ Fastest growing' },
      { name: 'Colombia', salary: salaryData.co, flag: '🇨🇴', trend: '↑ High demand' },
      { name: 'Mexico', salary: salaryData.mx, flag: '🇲🇽', trend: '↑ Largest market' },
      { name: 'Argentina', salary: salaryData.ar, flag: '🇦🇷', trend: '↑ Cost advantage' },
    ],
  },
  es: {
    latamTitle: 'Salarios Tendencia de Scrum en América Latina',
    latamSubtitle: 'Salarios anuales de Scrum Master en mercados clave de LATAM',
    scrumChartTitle: 'Crecimiento de Adopción de Scrum en República Dominicana',
    scrumChartSubtitle: '% de organizaciones tecnológicas usando Scrum (estimado)',
    aiChartTitle: 'Crecimiento de Adopción de IA en República Dominicana',
    aiChartSubtitle: '% de empresas integrando soluciones de IA (estimado)',
    countries: [
      { name: 'República Dominicana', salary: salaryData.dr, flag: '🇩🇴', trend: '↑ Más rápido crecimiento' },
      { name: 'Colombia', salary: salaryData.co, flag: '🇨🇴', trend: '↑ Alta demanda' },
      { name: 'México', salary: salaryData.mx, flag: '🇲🇽', trend: '↑ Mayor mercado' },
      { name: 'Argentina', salary: salaryData.ar, flag: '🇦🇷', trend: '↑ Ventaja de costos' },
    ],
  },
  zh: {
    latamTitle: '拉丁美洲Scrum薪资趋势',
    latamSubtitle: '关键拉美市场的Scrum Master年薪',
    scrumChartTitle: '多米尼加共和国Scrum采用增长',
    scrumChartSubtitle: '使用Scrum框架的科技组织百分比（估计）',
    aiChartTitle: '多米尼加共和国AI采用增长',
    aiChartSubtitle: '整合AI解决方案的企业百分比（估计）',
    countries: [
      { name: '多米尼加共和国', salary: salaryData.dr, flag: '🇩🇴', trend: '↑ 增长最快' },
      { name: '哥伦比亚', salary: salaryData.co, flag: '🇨🇴', trend: '↑ 高需求' },
      { name: '墨西哥', salary: salaryData.mx, flag: '🇲🇽', trend: '↑ 最大市场' },
      { name: '阿根廷', salary: salaryData.ar, flag: '🇦🇷', trend: '↑ 成本优势' },
    ],
  },
  ar: {
    latamTitle: 'رواتب Scrum الرائجة في أمريكا اللاتينية',
    latamSubtitle: 'رواتب Scrum Master السنوية في أسواق LATAM الرئيسية',
    scrumChartTitle: 'نمو اعتماد Scrum في جمهورية الدومينيكان',
    scrumChartSubtitle: '% من منظمات التكنولوجيا التي تستخدم Scrum (تقدير)',
    aiChartTitle: 'نمو اعتماد الذكاء الاصطناعي في جمهورية الدومينيكان',
    aiChartSubtitle: '% من الشركات التي تدمج حلول الذكاء الاصطناعي (تقدير)',
    countries: [
      { name: 'جمهورية الدومينيكان', salary: salaryData.dr, flag: '🇩🇴', trend: '↑ الأسرع نمواً' },
      { name: 'كولومبيا', salary: salaryData.co, flag: '🇨🇴', trend: '↑ طلب مرتفع' },
      { name: 'المكسيك', salary: salaryData.mx, flag: '🇲🇽', trend: '↑ أكبر سوق' },
      { name: 'الأرجنتين', salary: salaryData.ar, flag: '🇦🇷', trend: '↑ ميزة التكلفة' },
    ],
  },
  fr: {
    latamTitle: 'Salaires Scrum en Tendance en Amérique Latine',
    latamSubtitle: 'Salaires annuels des Scrum Masters sur les marchés clés de LATAM',
    scrumChartTitle: 'Croissance de l\'Adoption de Scrum en République Dominicaine',
    scrumChartSubtitle: '% d\'organisations tech utilisant Scrum (estimé)',
    aiChartTitle: 'Croissance de l\'Adoption de l\'IA en République Dominicaine',
    aiChartSubtitle: '% d\'entreprises intégrant des solutions IA (estimé)',
    countries: [
      { name: 'République Dominicaine', salary: salaryData.dr, flag: '🇩🇴', trend: '↑ Croissance la plus rapide' },
      { name: 'Colombie', salary: salaryData.co, flag: '🇨🇴', trend: '↑ Forte demande' },
      { name: 'Mexique', salary: salaryData.mx, flag: '🇲🇽', trend: '↑ Plus grand marché' },
      { name: 'Argentine', salary: salaryData.ar, flag: '🇦🇷', trend: '↑ Avantage coût' },
    ],
  },
  de: {
    latamTitle: 'Trendgehälter für Scrum in Lateinamerika',
    latamSubtitle: 'Jährliche Scrum Master Gehälter in wichtigen LATAM-Märkten',
    scrumChartTitle: 'Scrum-Adoptionswachstum in der Dominikanischen Republik',
    scrumChartSubtitle: '% der Tech-Organisationen mit Scrum (geschätzt)',
    aiChartTitle: 'KI-Adoptionswachstum in der Dominikanischen Republik',
    aiChartSubtitle: '% der Unternehmen mit KI-Integration (geschätzt)',
    countries: [
      { name: 'Dominikanische Republik', salary: salaryData.dr, flag: '🇩🇴', trend: '↑ Schnellstes Wachstum' },
      { name: 'Kolumbien', salary: salaryData.co, flag: '🇨🇴', trend: '↑ Hohe Nachfrage' },
      { name: 'Mexiko', salary: salaryData.mx, flag: '🇲🇽', trend: '↑ Größter Markt' },
      { name: 'Argentinien', salary: salaryData.ar, flag: '🇦🇷', trend: '↑ Kostenvorteil' },
    ],
  },
  ja: {
    latamTitle: 'ラテンアメリカのScrum給与トレンド',
    latamSubtitle: '主要LATAMマーケットのスクラムマスター年収',
    scrumChartTitle: 'ドミニカ共和国のScrum採用成長',
    scrumChartSubtitle: 'Scrumフレームワークを使用するテック組織の割合（推定）',
    aiChartTitle: 'ドミニカ共和国のAI採用成長',
    aiChartSubtitle: 'AIソリューションを統合する企業の割合（推定）',
    countries: [
      { name: 'ドミニカ共和国', salary: salaryData.dr, flag: '🇩🇴', trend: '↑ 最速成長' },
      { name: 'コロンビア', salary: salaryData.co, flag: '🇨🇴', trend: '↑ 高需要' },
      { name: 'メキシコ', salary: salaryData.mx, flag: '🇲🇽', trend: '↑ 最大市場' },
      { name: 'アルゼンチン', salary: salaryData.ar, flag: '🇦🇷', trend: '↑ コスト優位性' },
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
        <p className="text-[10px] text-muted-foreground mt-3 italic">{SALARY_SOURCE}</p>
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
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} domain={[0, 60]} unit="%" />
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
              <p className="text-[10px] text-muted-foreground mt-3 italic">{SCRUM_SOURCE}</p>
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
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} domain={[0, 65]} unit="%" />
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
              <p className="text-[10px] text-muted-foreground mt-3 italic">{AI_SOURCE}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LatamInsights;
