import { motion } from 'framer-motion';
import { ArrowRight, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Programs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const schools = [
    {
      id: 'engineering',
      emoji: '⚙️',
      name: t('pm.eng_name'),
      tagline: t('pm.eng_tag'),
      desc: t('pm.eng_desc'),
      count: 8,
      accentColor: '#4A90F5',
      headerBg: 'linear-gradient(90deg,#0D2E6B,#112966,#0a1f50)',
      headerText: '#7AB5FF',
      programs: ['AI Cloud Engineer','AI Agent Engineer','AI Data Engineer','AI DevOps Engineer','AI Security Engineer','AI MLOps Engineer','AI Solutions Architect','AI Platform Engineer'],
      salary: '$120K–$220K',
    },
    {
      id: 'business',
      emoji: '💼',
      name: t('pm.biz_name'),
      tagline: t('pm.biz_tag'),
      desc: t('pm.biz_desc'),
      count: 8,
      accentColor: '#F0622A',
      headerBg: 'linear-gradient(90deg,#5C1C08,#4D1807,#3D1106)',
      headerText: '#F5895E',
      programs: ['AI Solutions Consultant','AI Product Manager','AI Program Manager','AI Transformation Manager','AI Business Analyst','AI Business Operations','AI Sales Engineer','AI Enterprise Architect'],
      salary: '$100K–$190K',
    },
    {
      id: 'governance',
      emoji: '⚖️',
      name: t('pm.gov_name'),
      tagline: t('pm.gov_tag'),
      desc: t('pm.gov_desc'),
      count: 7,
      accentColor: '#F5B81A',
      headerBg: 'linear-gradient(90deg,#4A3000,#3E2800,#321F00)',
      headerText: '#F7C53A',
      programs: ['AI Governance Professional','Responsible AI Specialist','AI Compliance Officer','AI Risk Manager','AI Auditor','AI Policy Designer','AI Ethics Specialist'],
      salary: '$95K–$175K',
    },
    {
      id: 'humanai',
      emoji: '🎨',
      name: t('pm.human_name'),
      tagline: t('pm.human_tag'),
      desc: t('pm.human_desc'),
      count: 5,
      accentColor: '#22C98A',
      headerBg: 'linear-gradient(90deg,#053D25,#043120,#031F14)',
      headerText: '#5EEAB8',
      programs: ['AI UX Designer','Conversation Designer','Human-AI Interaction Specialist','AI Workflow Designer','AI Experience Architect'],
      salary: '$95K–$145K',
    },
  ];

  return (
    <section id="programs" className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.04),transparent_50%)]" />
      <div className="container mx-auto px-4 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t('pm.badge')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6"
          >
            {t("programs.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {t("programs.subtitle")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {schools.map((school, idx) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
              style={{ borderColor: school.accentColor + "44" }}
              onClick={() => navigate("/courses")}
            >
              <div
                className="flex items-center gap-3 px-5 py-3 relative overflow-hidden"
                style={{ background: school.headerBg }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent pointer-events-none" />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 relative z-10"
                  style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {school.emoji}
                </div>
                <span
                  className="text-xs font-extrabold uppercase tracking-wide relative z-10"
                  style={{ color: school.headerText, textShadow: "0 1px 8px rgba(0,0,0,0.4)", letterSpacing: "0.5px" }}
                >
                  {school.name}
                </span>
                <span
                  className="ml-auto text-xs font-bold relative z-10 px-2.5 py-0.5 rounded-full"
                  style={{ color: "rgba(255,255,255,0.85)", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {t('pm.count_programs').replace('{n}', String(school.count))}
                </span>
              </div>

              <div className="p-6">
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: school.accentColor }}>
                  {school.tagline}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{school.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {school.programs.slice(0, 5).map(prog => (
                    <span
                      key={prog}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: school.accentColor + "1a", color: school.accentColor, border: "1px solid " + school.accentColor + "44" }}
                    >
                      {prog}
                    </span>
                  ))}
                  {school.programs.length > 5 && (
                    <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-muted border border-border text-muted-foreground">
                      {t('pm.more').replace('{n}', String(school.programs.length - 5))}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>💰 {school.salary}/yr</span>
                    <span>🏅 L100–L700</span>
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all"
                    style={{ color: school.accentColor }}
                  >
                    {t('pm.explore')} <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-card rounded-2xl border border-border overflow-hidden mb-5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 p-7 lg:p-9">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-secondary/10 text-2xl border border-secondary/20">🏢</div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest uppercase text-secondary mb-0.5">{t('pm.sim_label')}</div>
                  <h3 className="text-base font-display font-bold text-foreground">{t('pm.sim_title')}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-2xl">
                {t('pm.sim_desc')}
              </p>
              <div className="flex flex-wrap gap-2">
                {["Sprint Simulation","SAFe PI Planning","Rogers-Shaw Merger","AI Agent Deployment","Governance Audit","Gov AI Program"].map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 font-medium">{tag}</span>
                ))}
                <span className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border font-medium">{t('pm.more').replace('{n}', '4')}</span>
              </div>
            </div>
            <div className="lg:flex-shrink-0 flex flex-col gap-2">
              <Button onClick={() => navigate("/simulation")} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {t('pm.view_sims')} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
                <Lock className="w-3 h-3" />
                <span>{t('pm.unlock_l500')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
          className="relative bg-card/50 rounded-2xl border border-border/50 overflow-hidden"
        >
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 p-7 lg:p-9">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-muted text-2xl border border-border">📚</div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest uppercase text-muted-foreground mb-0.5">{t('pm.foundation_label')}</div>
                  <h3 className="text-base font-display font-bold text-foreground">{t('pm.foundation_title')}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-2xl">
                {t('pm.foundation_desc')}
              </p>
              <div className="flex flex-wrap gap-2">
                {["Scrum Master","Project Management","AI Tools for Managers","Cybersecurity","Solution Architect","Data Analytics","DevOps & Cloud","Business Analysis"].map(c => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div className="lg:flex-shrink-0">
              <Button variant="outline" onClick={() => navigate("/courses")}>
                {t('pm.browse_foundation')} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Programs;
