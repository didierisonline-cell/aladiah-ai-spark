import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Briefcase } from 'lucide-react';
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

// Sources: PMI Pulse of the Profession 2024, Glassdoor, Robert Half Salary Guide 2025
// PM demand growing steadily in LATAM due to digital transformation and nearshoring
const pmDemandDR = [
  { year: '2018', adoption: 8 },
  { year: '2019', adoption: 12 },
  { year: '2020', adoption: 17 },
  { year: '2021', adoption: 24 },
  { year: '2022', adoption: 33 },
  { year: '2023', adoption: 42 },
  { year: '2024', adoption: 50 },
  { year: '2025', adoption: 58 },
];

// Sources: PMI 2024, LinkedIn Economic Graph
// PMP-certified PMs earn 33% more than non-certified peers globally
const pmCertGrowthDR = [
  { year: '2019', adoption: 3 },
  { year: '2020', adoption: 7 },
  { year: '2021', adoption: 13 },
  { year: '2022', adoption: 20 },
  { year: '2023', adoption: 30 },
  { year: '2024', adoption: 40 },
  { year: '2025', adoption: 50 },
];

const PM_DEMAND_SOURCE = 'Sources: PMI Pulse of the Profession 2024, World Bank Digital Economy Report';
const PM_CERT_SOURCE = 'Sources: PMI Earning Power Report 2024, LinkedIn Economic Graph';
const PM_SALARY_SOURCE = 'Sources: Robert Half Salary Guide 2025, Glassdoor, HireWithNear Salary Guide 2026';

// Real salary data for Project Managers in LATAM
const pmSalaryData = {
  dr: 'USD 22,000 - USD 38,000',
  co: 'USD 16,000 - USD 28,000',
  mx: 'USD 30,000 - USD 50,000',
  ar: 'USD 18,000 - USD 30,000',
};

const translations: Record<LangKey, {
  latamTitle: string;
  latamSubtitle: string;
  demandChartTitle: string;
  demandChartSubtitle: string;
  certChartTitle: string;
  certChartSubtitle: string;
  countries: { name: string; salary: string; flag: string; trend: string }[];
}> = {
  en: {
    latamTitle: 'Trending Project Manager Salaries in Latin America',
    latamSubtitle: 'Annual Project Manager salaries across key LATAM markets',
    demandChartTitle: 'Project Management Demand Growth in Dominican Republic',
    demandChartSubtitle: '% of organizations hiring dedicated project managers (estimated)',
    certChartTitle: 'PMP Certification Growth in Dominican Republic',
    certChartSubtitle: '% of PMs holding PMP or equivalent certification (estimated)',
    countries: [
      { name: 'Dominican Republic', salary: pmSalaryData.dr, flag: '🇩🇴', trend: '↑ Fastest growing' },
      { name: 'Colombia', salary: pmSalaryData.co, flag: '🇨🇴', trend: '↑ High demand' },
      { name: 'Mexico', salary: pmSalaryData.mx, flag: '🇲🇽', trend: '↑ Largest market' },
      { name: 'Argentina', salary: pmSalaryData.ar, flag: '🇦🇷', trend: '↑ Cost advantage' },
    ],
  },
  es: {
    latamTitle: 'Salarios Tendencia de Project Manager en América Latina',
    latamSubtitle: 'Salarios anuales de Project Manager en mercados clave de LATAM',
    demandChartTitle: 'Crecimiento de Demanda de Gestión de Proyectos en República Dominicana',
    demandChartSubtitle: '% de organizaciones contratando project managers dedicados (estimado)',
    certChartTitle: 'Crecimiento de Certificación PMP en República Dominicana',
    certChartSubtitle: '% de PMs con certificación PMP o equivalente (estimado)',
    countries: [
      { name: 'República Dominicana', salary: pmSalaryData.dr, flag: '🇩🇴', trend: '↑ Más rápido crecimiento' },
      { name: 'Colombia', salary: pmSalaryData.co, flag: '🇨🇴', trend: '↑ Alta demanda' },
      { name: 'México', salary: pmSalaryData.mx, flag: '🇲🇽', trend: '↑ Mayor mercado' },
      { name: 'Argentina', salary: pmSalaryData.ar, flag: '🇦🇷', trend: '↑ Ventaja de costos' },
    ],
  },
  zh: {
    latamTitle: '拉丁美洲项目经理薪资趋势',
    latamSubtitle: '关键拉美市场的项目经理年薪',
    demandChartTitle: '多米尼加共和国项目管理需求增长',
    demandChartSubtitle: '招聘专职项目经理的组织百分比（估计）',
    certChartTitle: '多米尼加共和国PMP认证增长',
    certChartSubtitle: '持有PMP或同等认证的PM百分比（估计）',
    countries: [
      { name: '多米尼加共和国', salary: pmSalaryData.dr, flag: '🇩🇴', trend: '↑ 增长最快' },
      { name: '哥伦比亚', salary: pmSalaryData.co, flag: '🇨🇴', trend: '↑ 高需求' },
      { name: '墨西哥', salary: pmSalaryData.mx, flag: '🇲🇽', trend: '↑ 最大市场' },
      { name: '阿根廷', salary: pmSalaryData.ar, flag: '🇦🇷', trend: '↑ 成本优势' },
    ],
  },
  ar: {
    latamTitle: 'رواتب مدير المشاريع الرائجة في أمريكا اللاتينية',
    latamSubtitle: 'رواتب مدير المشاريع السنوية في أسواق LATAM الرئيسية',
    demandChartTitle: 'نمو الطلب على إدارة المشاريع في جمهورية الدومينيكان',
    demandChartSubtitle: '% من المنظمات التي توظف مديري مشاريع مخصصين (تقدير)',
    certChartTitle: 'نمو شهادة PMP في جمهورية الدومينيكان',
    certChartSubtitle: '% من مديري المشاريع الحاصلين على PMP أو ما يعادلها (تقدير)',
    countries: [
      { name: 'جمهورية الدومينيكان', salary: pmSalaryData.dr, flag: '🇩🇴', trend: '↑ الأسرع نمواً' },
      { name: 'كولومبيا', salary: pmSalaryData.co, flag: '🇨🇴', trend: '↑ طلب مرتفع' },
      { name: 'المكسيك', salary: pmSalaryData.mx, flag: '🇲🇽', trend: '↑ أكبر سوق' },
      { name: 'الأرجنتين', salary: pmSalaryData.ar, flag: '🇦🇷', trend: '↑ ميزة التكلفة' },
    ],
  },
  fr: {
    latamTitle: 'Salaires Tendance de Chef de Projet en Amérique Latine',
    latamSubtitle: 'Salaires annuels des Chefs de Projet sur les marchés clés de LATAM',
    demandChartTitle: 'Croissance de la Demande en Gestion de Projet en République Dominicaine',
    demandChartSubtitle: '% d\'organisations recrutant des chefs de projet dédiés (estimé)',
    certChartTitle: 'Croissance de la Certification PMP en République Dominicaine',
    certChartSubtitle: '% de PMs certifiés PMP ou équivalent (estimé)',
    countries: [
      { name: 'République Dominicaine', salary: pmSalaryData.dr, flag: '🇩🇴', trend: '↑ Croissance la plus rapide' },
      { name: 'Colombie', salary: pmSalaryData.co, flag: '🇨🇴', trend: '↑ Forte demande' },
      { name: 'Mexique', salary: pmSalaryData.mx, flag: '🇲🇽', trend: '↑ Plus grand marché' },
      { name: 'Argentine', salary: pmSalaryData.ar, flag: '🇦🇷', trend: '↑ Avantage coût' },
    ],
  },
  de: {
    latamTitle: 'Trendgehälter für Projektmanager in Lateinamerika',
    latamSubtitle: 'Jährliche Projektmanager-Gehälter in wichtigen LATAM-Märkten',
    demandChartTitle: 'Wachstum der Projektmanagement-Nachfrage in der Dominikanischen Republik',
    demandChartSubtitle: '% der Organisationen mit dedizierten Projektmanagern (geschätzt)',
    certChartTitle: 'PMP-Zertifizierungswachstum in der Dominikanischen Republik',
    certChartSubtitle: '% der PMs mit PMP oder gleichwertiger Zertifizierung (geschätzt)',
    countries: [
      { name: 'Dominikanische Republik', salary: pmSalaryData.dr, flag: '🇩🇴', trend: '↑ Schnellstes Wachstum' },
      { name: 'Kolumbien', salary: pmSalaryData.co, flag: '🇨🇴', trend: '↑ Hohe Nachfrage' },
      { name: 'Mexiko', salary: pmSalaryData.mx, flag: '🇲🇽', trend: '↑ Größter Markt' },
      { name: 'Argentinien', salary: pmSalaryData.ar, flag: '🇦🇷', trend: '↑ Kostenvorteil' },
    ],
  },
  ja: {
    latamTitle: 'ラテンアメリカのプロジェクトマネージャー給与トレンド',
    latamSubtitle: '主要LATAMマーケットのプロジェクトマネージャー年収',
    demandChartTitle: 'ドミニカ共和国のプロジェクト管理需要成長',
    demandChartSubtitle: '専任プロジェクトマネージャーを雇用する組織の割合（推定）',
    certChartTitle: 'ドミニカ共和国のPMP認証成長',
    certChartSubtitle: 'PMPまたは同等の認証を持つPMの割合（推定）',
    countries: [
      { name: 'ドミニカ共和国', salary: pmSalaryData.dr, flag: '🇩🇴', trend: '↑ 最速成長' },
      { name: 'コロンビア', salary: pmSalaryData.co, flag: '🇨🇴', trend: '↑ 高需要' },
      { name: 'メキシコ', salary: pmSalaryData.mx, flag: '🇲🇽', trend: '↑ 最大市場' },
      { name: 'アルゼンチン', salary: pmSalaryData.ar, flag: '🇦🇷', trend: '↑ コスト優位性' },
    ],
  },
};

const PMLatamInsights = () => {
  const { language } = useLanguage();
  const supportedLangs: LangKey[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const lang = supportedLangs.includes(language as LangKey) ? (language as LangKey) : 'en';
  const t = translations[lang];

  return (
    <div className="space-y-12">
      {/* LATAM PM Salary Cards */}
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
        <p className="text-[10px] text-muted-foreground mt-3 italic">{PM_SALARY_SOURCE}</p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PM Demand Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-5 h-5 text-primary" />
                <h4 className="font-display font-bold text-foreground text-lg">{t.demandChartTitle}</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-6">{t.demandChartSubtitle}</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pmDemandDR} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="pmDemandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(215, 70%, 22%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(215, 70%, 22%)" stopOpacity={0} />
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
                      formatter={(value: number) => [`${value}%`, 'Demand']}
                    />
                    <Area
                      type="monotone"
                      dataKey="adoption"
                      stroke="hsl(215, 70%, 22%)"
                      strokeWidth={3}
                      fill="url(#pmDemandGrad)"
                      dot={{ fill: 'hsl(215, 70%, 22%)', r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(15, 85%, 60%)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 italic">{PM_DEMAND_SOURCE}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* PMP Certification Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <h4 className="font-display font-bold text-foreground text-lg">{t.certChartTitle}</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-6">{t.certChartSubtitle}</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pmCertGrowthDR} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="pmCertGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(15, 85%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(15, 85%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 20%, 45%)' }} domain={[0, 55]} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(215, 20%, 88%)',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Certified']}
                    />
                    <Area
                      type="monotone"
                      dataKey="adoption"
                      stroke="hsl(15, 85%, 60%)"
                      strokeWidth={3}
                      fill="url(#pmCertGrad)"
                      dot={{ fill: 'hsl(15, 85%, 60%)', r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(215, 70%, 22%)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 italic">{PM_CERT_SOURCE}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PMLatamInsights;
