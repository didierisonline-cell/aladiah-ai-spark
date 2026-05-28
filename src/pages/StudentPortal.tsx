import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/hooks/useProgress';
import { useSubscription } from '@/hooks/useSubscription';
import { CreedAcknowledgmentGate, shouldShowCreedGate } from '@/components/CreedAcknowledgmentGate';
import CourseSelectionGate from '@/components/CourseSelectionGate';
import { StreakDetailModal, PointsDetailModal, LabsDetailModal } from '@/components/portal/StatDetailModals';
import globeBg from '@/assets/global-network-bg.png';
import profCardBg from '@/assets/professor-didier-card.png';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const STR: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome back', subtitle: '"You\'re building the future. Stay consistent, stay focused, and the world is yours."',
    your_next_action: 'Your Next Action', fastest_path: 'The fastest path to your next milestone',
    continue: 'Continue', ai_mentor: 'AI Mentor', ai_mentor_sub: 'Get personalized guidance from your AI Mentor',
    chat_now: 'Chat Now', daily_challenge: 'Daily Challenge', daily_challenge_sub: 'Complete today\'s challenge and earn 50 points',
    start_challenge: 'Start Challenge', live_session: 'Live Session', live_session_sub: 'Join live Q&A with industry experts',
    join_now: 'Join Now', overall_progress: 'Overall Progress', keep_going: 'Keep going!',
    day_streak: 'Day Streak', amazing: 'Amazing consistency!', points_earned: 'Points Earned',
    this_week: '+350 this week', labs_completed: 'Labs Completed', labs_week: '+3 this week',
    certifications: 'Certifications', in_progress: 'In Progress', ai_workforce: 'AI Workforce Programs',
    programs_schools: 'programs across 4 schools', view_all: 'View All Programs →',
    prof_greeting: 'Good morning', prof_analyzed: "I've analyzed your progress and prepared a custom plan to get you to the next level.",
    talk_prof: 'Talk to Prof. Didier', talent_score_label: 'Talent Score™', rising_star: 'Rising Star',
    view_breakdown: 'View Full Breakdown →', top_skills: 'Top Skills Strength',
    career_momentum: 'Career Momentum', live_feed: 'Live Feed', future_ready: 'You are future-ready',
    future_sub: 'Keep building. The world needs your talent.', done_day: 'Done for the Day',
    hours_employable: 'Hours to Employable', lessons: 'Lessons', start: 'Start →',
    pro_member: 'Pro Member', all_access: 'All-Access Pass™', overview: 'Overview',
    my_academy: 'My Academy', my_career: 'My Career Path', talent: 'Talent Score™',
    certs: 'Certifications', career_tools: 'Career Tools', portfolio: 'My Portfolio',
    labs: 'Labs', community: 'Community', leaderboard: 'Leaderboard', events: 'Events',
    settings: 'Settings', management: 'Aladiah Management', refer: 'Refer & Earn',
    refer_sub: 'Invite friends and earn premium rewards', account: 'ACCOUNT',
    got_hired: 'just got hired as', completed: 'completed', earned: 'earned', at: 'at',
    year: '/year', ago: 'ago', min: 'min', new: 'New',
    ai_interview: 'AI Interview', practice_now: 'Practice Now', resume_builder: 'Resume Builder',
    optimize_cv: 'Optimize CV', job_matches: 'Job Matches', new_jobs: 'New Jobs',
    portfolio_analyzer: 'Portfolio Analyzer', get_feedback: 'Get AI Feedback',
    salary_insights: 'Salary Insights', know_worth: 'Know Your Worth',
    countries_community: 'Countries in Community', top_learners: 'of Learners',
  },
  es: {
    welcome: 'Bienvenido de vuelta', subtitle: '"Estás construyendo el futuro."',
    your_next_action: 'Tu Próxima Acción', fastest_path: 'El camino más rápido',
    continue: 'Continuar', ai_mentor: 'Mentor IA', ai_mentor_sub: 'Orientación personalizada de tu Mentor IA',
    chat_now: 'Chatear', daily_challenge: 'Desafío Diario', daily_challenge_sub: 'Completa el desafío y gana 50 puntos',
    start_challenge: 'Comenzar', live_session: 'Sesión en Vivo', live_session_sub: 'Q&A en vivo con expertos',
    join_now: 'Unirse', overall_progress: 'Progreso General', keep_going: '¡Sigue adelante!',
    day_streak: 'Días Seguidos', amazing: '¡Consistencia increíble!', points_earned: 'Puntos Ganados',
    this_week: '+350 esta semana', labs_completed: 'Labs Completados', labs_week: '+3 esta semana',
    certifications: 'Certificaciones', in_progress: 'En Progreso', ai_workforce: 'Programas IA',
    programs_schools: 'programas en 4 escuelas', view_all: 'Ver Todos →',
    prof_greeting: 'Buenos días', prof_analyzed: 'He analizado tu progreso y preparado un plan personalizado.',
    talk_prof: 'Hablar con Prof. Didier', talent_score_label: 'Talent Score™', rising_star: 'Estrella en Ascenso',
    view_breakdown: 'Ver Desglose →', top_skills: 'Habilidades Principales',
    career_momentum: 'Impulso Profesional', live_feed: 'En Vivo', future_ready: 'Estás listo para el futuro',
    future_sub: 'Sigue construyendo. El mundo necesita tu talento.', done_day: 'Listo por Hoy',
    hours_employable: 'Horas para Empleabilidad', lessons: 'Lecciones', start: 'Empezar →',
    pro_member: 'Miembro Pro', all_access: 'Pase Todo Acceso™', overview: 'Resumen',
    my_academy: 'Mi Academia', my_career: 'Mi Carrera', talent: 'Talent Score™',
    certs: 'Certificaciones', career_tools: 'Herramientas', portfolio: 'Mi Portfolio',
    labs: 'Labs', community: 'Comunidad', leaderboard: 'Clasificación', events: 'Eventos',
    settings: 'Configuración', management: 'Aladiah Management', refer: 'Referir y Ganar',
    refer_sub: 'Invita amigos y gana recompensas', account: 'CUENTA',
    got_hired: 'fue contratado como', completed: 'completó', earned: 'ganó', at: 'en',
    year: '/año', ago: 'hace', min: 'min', new: 'Nuevo',
    ai_interview: 'Entrevista IA', practice_now: 'Practicar', resume_builder: 'Constructor CV',
    optimize_cv: 'Optimizar CV', job_matches: 'Empleos', new_jobs: 'Nuevos Empleos',
    portfolio_analyzer: 'Analizador', get_feedback: 'Obtener Feedback',
    salary_insights: 'Salarios', know_worth: 'Tu Valor',
    countries_community: 'Países en Comunidad', top_learners: 'de Estudiantes',
  },
  fr: {
    welcome: 'Bon retour', subtitle: '"Vous construisez l\'avenir."',
    your_next_action: 'Votre Prochaine Action', fastest_path: 'Le chemin le plus rapide',
    continue: 'Continuer', ai_mentor: 'Mentor IA', ai_mentor_sub: 'Conseils personnalisés de votre Mentor IA',
    chat_now: 'Discuter', daily_challenge: 'Défi du Jour', daily_challenge_sub: 'Complétez le défi et gagnez 50 points',
    start_challenge: 'Commencer', live_session: 'Session en Direct', live_session_sub: 'Q&R en direct avec des experts',
    join_now: 'Rejoindre', overall_progress: 'Progression Générale', keep_going: 'Continuez!',
    day_streak: 'Jours Consécutifs', amazing: 'Constance incroyable!', points_earned: 'Points Gagnés',
    this_week: '+350 cette semaine', labs_completed: 'Labs Complétés', labs_week: '+3 cette semaine',
    certifications: 'Certifications', in_progress: 'En Cours', ai_workforce: 'Programmes IA',
    programs_schools: 'programmes dans 4 écoles', view_all: 'Voir Tous →',
    prof_greeting: 'Bonjour', prof_analyzed: "J'ai analysé votre progression et préparé un plan personnalisé.",
    talk_prof: 'Parler à Prof. Didier', talent_score_label: 'Talent Score™', rising_star: 'Étoile Montante',
    view_breakdown: 'Voir le Détail →', top_skills: 'Compétences Principales',
    career_momentum: 'Élan Professionnel', live_feed: 'En Direct', future_ready: 'Vous êtes prêt pour l\'avenir',
    future_sub: 'Continuez à construire. Le monde a besoin de votre talent.', done_day: 'Terminé pour Aujourd\'hui',
    hours_employable: 'Heures vers l\'Employabilité', lessons: 'Leçons', start: 'Commencer →',
    pro_member: 'Membre Pro', all_access: 'Pass Tout Accès™', overview: 'Aperçu',
    my_academy: 'Mon Académie', my_career: 'Ma Carrière', talent: 'Talent Score™',
    certs: 'Certifications', career_tools: 'Outils', portfolio: 'Mon Portfolio',
    labs: 'Labs', community: 'Communauté', leaderboard: 'Classement', events: 'Événements',
    settings: 'Paramètres', management: 'Aladiah Management', refer: 'Référer et Gagner',
    refer_sub: 'Invitez des amis et gagnez des récompenses', account: 'COMPTE',
    got_hired: 'vient d\'être embauché comme', completed: 'a complété', earned: 'a gagné', at: 'chez',
    year: '/an', ago: 'il y a', min: 'min', new: 'Nouveau',
    ai_interview: 'Entretien IA', practice_now: 'Pratiquer', resume_builder: 'CV Builder',
    optimize_cv: 'Optimiser CV', job_matches: 'Emplois', new_jobs: 'Nouveaux Emplois',
    portfolio_analyzer: 'Analyseur', get_feedback: 'Obtenir Feedback',
    salary_insights: 'Salaires', know_worth: 'Votre Valeur',
    countries_community: 'Pays dans la Communauté', top_learners: 'des Apprenants',
  },
};
function t(lang: string, key: string): string {
  return (STR[lang] || STR.en)[key] || STR.en[key] || key;
}

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function getDateStr() {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const MOMENTUM = [
  { name: 'Sarah K.', action: 'got_hired', role: 'Cloud Engineer', company: 'Amazon', salary: '$120,000', time: '2min' },
  { name: 'David M.', action: 'completed', program: 'AI Cloud Engineer Program', time: '15min' },
  { name: 'Aisha B.', action: 'earned', cert: 'AWS Solutions Architect Cert.', time: '32min' },
];
const SKILLS = [
  { label: 'Cloud Architecture', pct: 92, color: '#6366f1' },
  { label: 'Problem Solving',    pct: 88, color: '#8b5cf6' },
  { label: 'AI/ML Fundamentals', pct: 85, color: '#10b981' },
  { label: 'System Design',      pct: 78, color: '#f59e0b' },
  { label: 'Communication',      pct: 74, color: '#f97316' },
];
const TOOLS = [
  { icon: '🎤', lbl: 'ai_interview',      sub: 'practice_now',  path: '/portal/career' },
  { icon: '📄', lbl: 'resume_builder',    sub: 'optimize_cv',   path: '/portal/career' },
  { icon: '💼', lbl: 'job_matches',       sub: 'new_jobs',      path: '/portal/my-career-path', count: '12' },
  { icon: '📊', lbl: 'portfolio_analyzer',sub: 'get_feedback',  path: '/portal/portfolio' },
  { icon: '💰', lbl: 'salary_insights',   sub: 'know_worth',    path: '/portal/my-career-path' },
];
const SCHOOL_ICONS: Record<string,string> = {
  'AI Engineering':'⚙️',
  'AI Business':'💼',
  'Governance & Risk':'⚖️',
  'Human-AI Experience':'🎨',
};
const COURSE_SCHOOL: Record<string,string> = {
  // ── School of AI Engineering (8) ──────────────────────────────────────────
  'AI Cloud Engineer':                              'AI Engineering',
  'AI Agent Engineer':                              'AI Engineering',
  'AI Data Engineer':                               'AI Engineering',
  'AI DevOps Engineer':                             'AI Engineering',
  'AI Security Engineer':                           'AI Engineering',
  'AI MLOps Engineer':                              'AI Engineering',
  'AI Platform Engineer':                           'AI Engineering',
  'AI Solutions Architect':                         'AI Engineering',
  // ── School of AI Business Transformation (8) ──────────────────────────────
  'AI Solutions Consultant':                        'AI Business',
  'AI Product Manager':                             'AI Business',
  'AI Program Manager':                             'AI Business',
  'AI Transformation Manager':                      'AI Business',
  'AI Business Analyst':                            'AI Business',
  'AI Sales Engineer':                              'AI Business',
  'AI Enterprise Architect':                        'AI Business',
  'AI Business Operations':                         'AI Business',
  // ── School of Governance & Risk (7) ───────────────────────────────────────
  'AI Governance Professional':                     'Governance & Risk',
  'Responsible AI Specialist':                      'Governance & Risk',
  'AI Compliance Officer':                          'Governance & Risk',
  'AI Risk Manager':                                'Governance & Risk',
  'AI Auditor':                                     'Governance & Risk',
  'AI Ethics Specialist':                           'Governance & Risk',
  'AI Policy Designer':                             'Governance & Risk',
  // ── School of Human-AI Experience (5) ─────────────────────────────────────
  'AI UX Designer':                                 'Human-AI Experience',
  'Conversation Designer':                          'Human-AI Experience',
  'Human-AI Interaction Specialist':                'Human-AI Experience',
  'Human-AI Interaction Specialist Certification':  'Human-AI Experience',
  'AI Workflow Designer':                           'Human-AI Experience',
  'AI Experience Architect':                        'Human-AI Experience',
};

// Certifications — shown separately, NOT in school tabs
const CERT_TITLES = [
  'Data Analytics Professional Certification',
  'Solution Architect Professional Certification',
  'DevOps & Cloud Engineering Professional',
  'DevOps & Cloud Engineering Professional Certification',
  'AI Mastery for Scrum Masters & Project Managers',
  'Scrum Master Profession',
  'Project Management Professional Certification',
  'Business Analysis Professional Certification',
  'Cybersecurity Professional Certification',
];
const EXCLUDED = ['Rogers-Shaw','IT Merger','Network Integration'];

function sbFetch<T>(query: Promise<{data:T|null;error:any}>, fallback:T, ms=5000):Promise<T> {
  return Promise.race([
    query.then(r => r.data ?? fallback),
    new Promise<T>(res => setTimeout(()=>res(fallback), ms)),
  ]);
}

const LANGS = ['EN','ES','FR','DE','ZH','AR','JA'];

export default function StudentPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { progress: overallProgress } = useProgress(user?.id);
  const { tier } = useSubscription();

  const [needsCreed, setNeedsCreed] = useState(shouldShowCreedGate());
  const [needsCourseSelection, setNeedsCourseSelection] = useState(false);
  const [creedLoaded, setCreedLoaded] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [labs, setLabs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [activeSchool, setActiveSchool] = useState('AI Engineering');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [streakModal, setStreakModal] = useState(false);
  const [pointsModal, setPointsModal] = useState(false);
  const [labsModal, setLabsModal] = useState(false);
  const [profChat, setProfChat] = useState(false);
  const [lang, setLang] = useState(language || 'en');
  const [talentScore] = useState(612);
  const [hoursLeft] = useState(412);

  const T = (key: string) => t(lang, key);
  useEffect(() => { setLang(language || 'en'); }, [language]);

  // Load all student data
  useEffect(() => {
    if (!user) return;
    async function load() {
      const [pointsData, labsData, coursesData, certsData] = await Promise.all([
        sbFetch(supabase.from('student_points').select('points').eq('user_id',user!.id), []),
        sbFetch(supabase.from('student_labs').select('*').eq('user_id',user!.id), []),
        sbFetch(supabase.from('courses').select('id,title,translations').eq('is_published',true), []),
        sbFetch(supabase.from('user_progress').select('id').eq('user_id',user!.id).eq('completed',true), []),
      ]);
      setTotalPoints((pointsData as any[]).reduce((s:number,p:any)=>s+(p.points||0),0));
      setLabs(labsData as any[]);
      setCertCount(Math.floor((certsData as any[]).length/5));

      const filtered = (coursesData as any[]).filter((c:any)=>!EXCLUDED.some(e=>c.title?.includes(e)));
      if (!filtered.length) return;

      const progData = await Promise.all(filtered.map(async (course:any) => {
        const [chapData,vidData,progRows] = await Promise.all([
          sbFetch(supabase.from('chapters').select('id').eq('course_id',course.id),[]),
          sbFetch(supabase.from('videos').select('id,chapter_id'),[]),
          sbFetch(supabase.from('user_progress').select('video_id').eq('user_id',user!.id).eq('completed',true),[]),
        ]);
        const chapIds = new Set((chapData as any[]).map((c:any)=>c.id));
        const vids = (vidData as any[]).filter((v:any)=>chapIds.has(v.chapter_id));
        const done = new Set((progRows as any[]).map((p:any)=>p.video_id));
        const total = vids.length;
        const doneCount = vids.filter((v:any)=>done.has(v.id)).length;
        const pct = total>0?Math.round((doneCount/total)*100):0;
        const isCert = CERT_TITLES.some(ct=>course.title?.includes(ct)||ct.includes(course.title));
        const school = isCert ? 'Certifications' : (COURSE_SCHOOL[course.title] || null);
        return { id:course.id, title:course.title, total, done:doneCount, pct, school, isCert };
      }));

      setCourses(progData.filter((p:any)=>p.total>0).sort((a:any,b:any)=>b.pct-a.pct||b.done-a.done));

      // Streak
      const quizDates = await sbFetch(
        supabase.from('user_progress').select('created_at').eq('user_id',user!.id).eq('completed',true).order('created_at',{ascending:false}),[]
      );
      let s=0; const today=new Date(); today.setHours(0,0,0,0); const seen=new Set<string>();
      for (const q of (quizDates as any[])) {
        const d=new Date(q.created_at); d.setHours(0,0,0,0);
        const key=d.toISOString().slice(0,10);
        if(!seen.has(key)){
          seen.add(key);
          const exp=new Date(today); exp.setDate(today.getDate()-s);
          if(d.getTime()===exp.getTime()) s++; else break;
        }
      }
      setStreak(s);
    }
    load();
  }, [user]);

  const userName = user?.email?.split('@')[0]||'Student';
  const displayName = userName.length>12?userName.slice(0,12):userName;
  const initials = (userName[0]||'A').toUpperCase()+(userName[1]||'').toUpperCase();
  const topCourse = courses.find(c=>c.pct>0&&c.pct<100)||courses[0];
  const overallPct = courses.length>0?Math.round(courses.reduce((s,c)=>s+c.pct,0)/courses.length):0;
  const ALL_SCHOOLS = ['AI Engineering','AI Business','Governance & Risk','Human-AI Experience'];
  const schoolCourses = courses.filter(c=>c.school===activeSchool);
  const certCourses = courses.filter(c=>c.isCert);

  if (!creedLoaded) return <div style={{background:'#020817',minHeight:'100vh'}} />;
  if (needsCreed) return (
    <CreedAcknowledgmentGate onAcknowledge={() => setNeedsCreed(false)} />
  );
  if (needsCourseSelection) return (
    <CourseSelectionGate onCourseSelected={()=>setNeedsCourseSelection(false)} />
  );

  return (
    <div style={{position:'relative',height:'100vh',overflow:'hidden',fontFamily:"'Inter',system-ui,sans-serif",color:'#e2e8f8',background:'#020817',display:'flex',flexDirection:'column'}}>

      {/* ── GLOBE BACKGROUND ── full screen, z-index 0 */}
      <img src={globeBg} alt="" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',objectFit:'cover',objectPosition:'center',zIndex:0,pointerEvents:'none'}} />
      {/* Gradient overlay */}
      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:1,pointerEvents:'none',background:'linear-gradient(to right,rgba(2,8,23,.97) 0%,rgba(2,8,23,.9) 14%,rgba(2,8,23,.58) 36%,rgba(2,8,23,.1) 62%,rgba(2,8,23,0) 100%)'}} />

      {/* ── TOP NAV ── */}
      <nav style={{position:'relative',zIndex:10,height:56,flexShrink:0,background:'rgba(2,8,23,.9)',borderBottom:'1px solid rgba(255,255,255,.07)',backdropFilter:'blur(24px)',display:'grid',gridTemplateColumns:'200px 1fr auto',alignItems:'center',padding:'0 22px'}}>
        <img src={aladiahLogo} alt="Aladiah Academy" style={{height:34,objectFit:'contain',objectPosition:'left'}} />
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:2}}>
          {['My Portal','Courses','Talent Score™','Career','Community','Resources'].map((item,i)=>(
            <button key={item} onClick={()=>{
              if(i===0) navigate('/portal');
              else if(i===1) navigate('/portal/courses');
              else if(i===2) navigate('/portal/talent-score');
              else if(i===3) navigate('/portal/career');
              else if(i===4) navigate('/community');
              else navigate('/portal');
            }} style={{background:'none',border:'none',borderBottom:i===0?'2.5px solid #3b82f6':'2.5px solid transparent',color:i===0?'#fff':'#5a6a8a',fontSize:14,fontWeight:i===0?700:500,padding:'0 16px',height:56,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',transition:'color .15s'}}>
              {item}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {/* Language */}
          <div style={{position:'relative'}}>
            <button onClick={()=>setLangMenuOpen(!langMenuOpen)} style={{background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.13)',color:'#cbd5e1',borderRadius:8,padding:'6px 12px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
              {lang.toUpperCase()} <span style={{fontSize:10}}>▾</span>
            </button>
            {langMenuOpen&&(
              <div style={{position:'absolute',top:'110%',right:0,background:'#0d1829',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:6,zIndex:200,minWidth:80}}>
                {LANGS.map(l=>(
                  <button key={l} onClick={()=>{setLang(l.toLowerCase());setLangMenuOpen(false);}} style={{display:'block',width:'100%',textAlign:'left',padding:'6px 12px',background:lang.toUpperCase()===l?'rgba(59,130,246,.2)':'none',border:'none',color:'#e2e8f8',fontSize:12,fontWeight:600,cursor:'pointer',borderRadius:6,fontFamily:'inherit'}}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button style={{background:'none',border:'none',color:'#f97316',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{T('done_day')}</button>
        </div>
      </nav>

      {/* ── SECOND BAR ── */}
      <div style={{position:'relative',zIndex:10,height:44,flexShrink:0,background:'rgba(2,8,23,.82)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',padding:'0 22px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(180,130,20,.14)',border:'1px solid rgba(180,130,20,.3)',borderRadius:10,padding:'6px 16px'}}>
          <span style={{fontSize:11.5,color:'#94a3b8',fontWeight:600}}>{T('talent_score_label')}</span>
          <span style={{fontSize:17,fontWeight:800,color:'#f59e0b'}}>{talentScore}</span>
          <span style={{fontSize:10.5,color:'#34d399',fontWeight:700}}>Rising</span>
        </div>
        <button onClick={()=>navigate('/portal/courses')} style={{marginLeft:'auto',background:'linear-gradient(90deg,#4f8ef7,#6366f1)',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,padding:'9px 20px',cursor:'pointer',fontFamily:'inherit',boxShadow:'0 0 20px rgba(79,142,247,.4)'}}>
          {T('continue')} Learning →
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{position:'relative',zIndex:5,display:'grid',gridTemplateColumns:'200px 1fr 310px',flex:1,overflow:'hidden',minHeight:0}}>

        {/* ── SIDEBAR ── */}
        <aside style={{background:'rgba(2,6,18,.72)',backdropFilter:'blur(20px)',display:'flex',flexDirection:'column',overflow:'hidden',borderRight:'none',position:'relative',zIndex:5}}>
          {/* User block */}
          <div style={{padding:'20px 14px 16px',borderBottom:'1px solid rgba(255,255,255,.06)',flexShrink:0}}>
            <div style={{position:'relative',width:64,height:64,marginBottom:12}}>
              <div style={{position:'absolute',inset:-3,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#7c3aed,#a855f7)',boxShadow:'0 0 18px rgba(59,130,246,.75),0 0 35px rgba(124,58,237,.5)'}} />
              <div style={{position:'absolute',inset:3,borderRadius:'50%',background:'linear-gradient(160deg,#1a2550,#0d1535,#080d28)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,fontWeight:800,color:'#fff'}}>
                {initials}
              </div>
            </div>
            <div style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:7}}>{displayName}</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:5,background:'rgba(10,20,55,.75)',border:'1px solid rgba(255,255,255,.11)',color:'#c7d2fe',padding:'5px 10px',borderRadius:8,fontSize:12,fontWeight:500,marginBottom:5}}>
              {T('pro_member')} <span style={{color:'#818cf8'}}>◆</span>
            </div>
            <div style={{fontSize:12,color:'#64748b',marginBottom:13}}>Plan: <b style={{color:'#e2e8f8'}}>{T('all_access')}</b></div>
            <div style={{background:'rgba(5,15,40,.65)',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:'10px 12px'}}>
              <div style={{display:'flex',alignItems:'baseline',gap:7,marginBottom:7}}>
                <span style={{fontSize:24,fontWeight:900,color:'#f97316',textShadow:'0 0 18px rgba(249,115,22,.5)'}}>{hoursLeft}</span>
                <span style={{fontSize:11.5,color:'#94a3b8'}}>{T('hours_employable')}</span>
              </div>
              <div style={{height:5,background:'rgba(255,255,255,.08)',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(hoursLeft/600)*100}%`,background:'linear-gradient(90deg,#f97316,#fb923c)',borderRadius:99,boxShadow:'0 0 10px rgba(249,115,22,.5)'}} />
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div style={{flex:1,overflow:'hidden'}}>
            {[
              {icon:'🏠',lbl:T('overview'),path:'/portal',exact:true},
              {icon:'📚',lbl:T('my_academy'),path:'/portal/courses',badge:courses.length||undefined},
              {icon:'🎯',lbl:T('my_career'),path:'/portal/my-career-path'},
              {icon:'⭐',lbl:T('talent'),path:'/portal/talent-score'},
              {icon:'🏅',lbl:T('certs'),path:'/portal/courses'},
              {icon:'💼',lbl:T('career_tools'),path:'/portal/career'},
              {icon:'🗂️',lbl:T('portfolio'),path:'/portal/portfolio'},
              {icon:'🧪',lbl:T('labs'),path:'/portal'},
              {icon:'🤖',lbl:'AI Mentor',path:'/portal'},
              {icon:'👥',lbl:T('community'),path:'/community'},
              {icon:'🏆',lbl:T('leaderboard'),path:'/portal/talent-score'},
              {icon:'📅',lbl:T('events'),path:'/community'},
            ].map(link=>{
              const isOn = link.exact?location.pathname==='/portal':location.pathname===link.path;
              return (
                <button key={link.lbl} onClick={()=>navigate(link.path)} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 15px',color:isOn?'#fff':'#64748b',fontSize:13,fontWeight:isOn?700:500,cursor:'pointer',border:'none',background:isOn?'linear-gradient(90deg,rgba(59,130,246,.22),rgba(99,102,241,.05))':'none',borderLeft:`3px solid ${isOn?'#3b82f6':'transparent'}`,width:'100%',textAlign:'left',fontFamily:'inherit',transition:'all .15s'}}>
                  <span style={{fontSize:15,width:18,textAlign:'center',flexShrink:0}}>{link.icon}</span>
                  {link.lbl}
                  {link.badge&&<span style={{marginLeft:'auto',background:'#f97316',color:'#fff',borderRadius:99,fontSize:10,padding:'2px 7px',fontWeight:800}}>{link.badge}</span>}
                </button>
              );
            })}
            <div style={{padding:'12px 15px 4px',fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'#2a3a55'}}>{T('account')}</div>
            <button onClick={()=>navigate('/portal/settings')} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 15px',color:'#64748b',fontSize:13,fontWeight:500,cursor:'pointer',border:'none',background:'none',width:'100%',textAlign:'left',fontFamily:'inherit'}}>
              <span style={{fontSize:15,width:18,textAlign:'center'}}>⚙️</span>{T('settings')}
            </button>
            <a href="https://www.aladiahmanagement.com" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:11,padding:'10px 15px',color:'#64748b',fontSize:13,fontWeight:500,textDecoration:'none'}}>
              <span style={{fontSize:15,width:18,textAlign:'center'}}>🏢</span>{T('management')}
            </a>
            <button onClick={()=>navigate('/portal')} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 15px',color:'#64748b',fontSize:13,fontWeight:500,cursor:'pointer',border:'none',background:'none',width:'100%',textAlign:'left',fontFamily:'inherit'}}>
              <span style={{fontSize:15,width:18,textAlign:'center'}}>❓</span>Help &amp; Support
            </button>
          </div>

          {/* Refer & Earn */}
          <div style={{margin:'12px 10px 14px',padding:13,background:'linear-gradient(135deg,rgba(37,99,235,.28),rgba(124,58,237,.32))',border:'1px solid rgba(99,102,241,.28)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexShrink:0}}>
            <div>
              <div style={{fontSize:12.5,fontWeight:700,color:'#fff',marginBottom:3}}>🎁 {T('refer')}</div>
              <div style={{fontSize:10.5,color:'#93c5fd',lineHeight:1.4}}>{T('refer_sub')}</div>
            </div>
            <span style={{fontSize:24}}>🎁</span>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{overflow:'hidden',background:'transparent',position:'relative',zIndex:5,display:'flex',flexDirection:'column'}}>
          {/* Hero */}
          <div style={{padding:'24px 24px 16px',flexShrink:0}}>
            <div style={{fontSize:10,color:'#475569',fontWeight:600,textTransform:'uppercase',letterSpacing:'.8px',marginBottom:5}}>{getDateStr()}</div>
            <h1 style={{fontSize:28,fontWeight:800,margin:'0 0 6px',lineHeight:1.18}}>{T('welcome')}, {displayName}! 👋</h1>
            <p style={{fontSize:12.5,color:'#64748b',margin:'0 0 16px',fontStyle:'italic',maxWidth:440,lineHeight:1.65}}>{T('subtitle')}</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {[
                {icon:'🔥',val:streak,lbl:T('day_streak')},
                {icon:'⚡',val:labs.filter((l:any)=>l.completed).length,lbl:T('labs_completed')},
                {icon:'🏆',val:'Top 12%',lbl:T('top_learners')},
                {icon:'🌐',val:98,lbl:T('countries_community')},
              ].map((p,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:6,background:'rgba(2,8,23,.65)',border:'1px solid rgba(255,255,255,.11)',borderRadius:9,padding:'6px 12px',fontSize:12,backdropFilter:'blur(10px)'}}>
                  <span>{p.icon}</span><b style={{fontWeight:700}}>{p.val}</b><span style={{color:'#94a3b8'}}>{p.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{flex:1,overflowY:'auto',padding:'0 24px 24px'}}>

            {/* Your Next Action */}
            <div style={{background:'linear-gradient(155deg,rgba(8,20,52,.85),rgba(5,13,38,.9))',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:'18px 20px',marginBottom:14,backdropFilter:'blur(28px)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:14,fontWeight:800}}>{T('your_next_action')}</span>
                <span style={{fontSize:11,color:'#475569'}}>{T('fastest_path')}</span>
              </div>
              {topCourse?(
                <div style={{display:'grid',gridTemplateColumns:'50px 1fr 56px 115px',gap:14,alignItems:'center',padding:'16px 18px',background:'linear-gradient(90deg,rgba(49,68,150,.38),rgba(10,20,60,.55))',border:'1px solid rgba(99,102,241,.18)',borderRadius:13}}>
                  <div style={{width:48,height:48,borderRadius:'50%',display:'grid',placeItems:'center',background:'radial-gradient(#7c3aed,#1d2472)',boxShadow:'0 0 22px rgba(124,58,237,.55)',fontSize:22}}>☁️</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{T('continue')}: {topCourse.title}</div>
                    <div style={{fontSize:11,color:'#64748b',marginBottom:9}}>{topCourse.done}/{topCourse.total} {T('lessons')}</div>
                    <div style={{height:5,background:'rgba(255,255,255,.08)',borderRadius:99,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${topCourse.pct}%`,background:'linear-gradient(90deg,#6366f1,#818cf8)',borderRadius:99}} />
                    </div>
                  </div>
                  <div style={{fontSize:16,fontWeight:800,color:'#818cf8',textAlign:'center'}}>{topCourse.pct}%</div>
                  <button onClick={()=>navigate(`/portal/course/${topCourse.id}`)} style={{background:'linear-gradient(90deg,#4f8ef7,#6366f1)',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,padding:12,cursor:'pointer',fontFamily:'inherit',width:'100%',boxShadow:'0 0 20px rgba(79,142,247,.4)'}}>
                    {T('continue')} →
                  </button>
                </div>
              ):(
                <div style={{display:'flex',alignItems:'center',gap:16}}>
                  <span style={{fontSize:13,color:'#64748b'}}>No courses started yet.</span>
                  <button onClick={()=>navigate('/portal/courses')} style={{padding:'9px 20px',background:'linear-gradient(135deg,#4f8ef7,#6366f1)',border:'none',borderRadius:10,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                    Browse Courses →
                  </button>
                </div>
              )}
            </div>

            {/* 3 Action Cards */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:13,marginBottom:14}}>
              {/* AI Mentor */}
              <div style={{background:'rgba(45,15,80,.8)',border:'1px solid rgba(124,58,237,.32)',borderRadius:15,padding:18,position:'relative',overflow:'hidden',backdropFilter:'blur(22px)'}}>
                <div style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',width:60,height:60}}>
                  <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'1.5px solid rgba(139,92,246,.55)',boxShadow:'0 0 16px rgba(139,92,246,.4)'}} />
                  <div style={{position:'absolute',inset:7,borderRadius:'50%',border:'1px solid rgba(139,92,246,.28)'}} />
                  <svg width="44" height="44" viewBox="0 0 44 44" style={{position:'relative',zIndex:1,display:'block',margin:'8px auto 0'}}>
                    <circle cx="22" cy="22" r="19" fill="rgba(109,54,231,.62)" stroke="rgba(196,181,253,.42)" strokeWidth="1"/>
                    <rect x="11" y="11" width="22" height="18" rx="5.5" fill="rgba(139,92,246,.9)"/>
                    <circle cx="17.5" cy="19" r="3.5" fill="#ddd6fe"/><circle cx="26.5" cy="19" r="3.5" fill="#ddd6fe"/>
                    <circle cx="17.5" cy="19" r="1.8" fill="#6d28d9"/><circle cx="26.5" cy="19" r="1.8" fill="#6d28d9"/>
                    <circle cx="18.3" cy="18.2" r=".8" fill="#fff"/><circle cx="27.3" cy="18.2" r=".8" fill="#fff"/>
                    <line x1="22" y1="11" x2="22" y2="6" stroke="rgba(196,181,253,.7)" strokeWidth="1.8"/>
                    <circle cx="22" cy="5.2" r="2.2" fill="rgba(196,181,253,.85)"/>
                    <rect x="14" y="25" width="16" height="2.5" rx="1.2" fill="rgba(196,181,253,.5)"/>
                    <rect x="7" y="16" width="4" height="7" rx="2" fill="rgba(124,58,237,.6)"/>
                    <rect x="33" y="16" width="4" height="7" rx="2" fill="rgba(124,58,237,.6)"/>
                  </svg>
                </div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:4,maxWidth:'58%'}}>{T('ai_mentor')}</div>
                <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6,marginBottom:13,maxWidth:'58%'}}>{T('ai_mentor_sub')}</div>
                <button onClick={()=>setProfChat(true)} style={{border:'none',borderRadius:8,fontSize:12,fontWeight:700,padding:'8px 16px',cursor:'pointer',fontFamily:'inherit',background:'linear-gradient(90deg,#7c3aed,#6d28d9)',color:'#fff',boxShadow:'0 0 14px rgba(124,58,237,.4)'}}>
                  {T('chat_now')}
                </button>
              </div>

              {/* Daily Challenge */}
              <div style={{background:'rgba(5,38,22,.8)',border:'1px solid rgba(22,163,74,.22)',borderRadius:15,padding:18,position:'relative',overflow:'hidden',backdropFilter:'blur(22px)'}}>
                <div style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',fontSize:38,opacity:.55}}>🎯</div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{T('daily_challenge')}</div>
                <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6,marginBottom:13}}>{T('daily_challenge_sub')}</div>
                <button style={{border:'none',borderRadius:8,fontSize:12,fontWeight:700,padding:'8px 16px',cursor:'pointer',fontFamily:'inherit',background:'linear-gradient(90deg,#16a34a,#15803d)',color:'#fff'}}>
                  {T('start_challenge')}
                </button>
              </div>

              {/* Live Session */}
              <div style={{background:'rgba(45,5,5,.8)',border:'1px solid rgba(220,38,38,.2)',borderRadius:15,padding:18,backdropFilter:'blur(22px)'}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:700}}>{T('live_session')}</span>
                  <div style={{display:'inline-flex',alignItems:'center',gap:3,background:'#dc2626',borderRadius:99,padding:'3px 8px',fontSize:8.5,fontWeight:800,boxShadow:'0 0 10px rgba(220,38,38,.55)'}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:'#fff'}} />LIVE
                  </div>
                </div>
                <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6,marginBottom:12}}>{T('live_session_sub')}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                  <div style={{display:'flex'}}>
                    {['#6366f1','#7c3aed','#10b981'].map((c,i)=>(
                      <div key={i} style={{width:24,height:24,borderRadius:'50%',background:c,border:'2px solid rgba(2,8,23,.9)',marginLeft:i>0?-6:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>
                        {['S','D','A'][i]}
                      </div>
                    ))}
                    <span style={{fontSize:9,color:'#475569',marginLeft:5,alignSelf:'center'}}>+142</span>
                  </div>
                  <button style={{border:'none',borderRadius:8,fontSize:12,fontWeight:700,padding:'8px 14px',cursor:'pointer',fontFamily:'inherit',background:'linear-gradient(90deg,#dc2626,#b91c1c)',color:'#fff'}}>
                    {T('join_now')}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',background:'linear-gradient(155deg,rgba(8,20,52,.85),rgba(5,13,38,.9))',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,overflow:'hidden',backdropFilter:'blur(28px)',marginBottom:14}}>
              {[
                {val:`${overallPct}%`,lbl:T('overall_progress'),sub:T('keep_going'),color:'#6366f1',onClick:()=>{}},
                {val:streak,lbl:`${T('day_streak')} 🔥`,sub:T('amazing'),color:'#f97316',onClick:()=>setStreakModal(true)},
                {val:totalPoints.toLocaleString(),lbl:T('points_earned'),sub:T('this_week'),color:'#f59e0b',onClick:()=>setPointsModal(true)},
                {val:labs.filter((l:any)=>l.completed).length,lbl:T('labs_completed'),sub:T('labs_week'),color:'#34d399',onClick:()=>setLabsModal(true)},
                {val:certCount,lbl:T('certifications'),sub:T('in_progress'),color:'#a855f7',onClick:()=>{}},
              ].map((s,i)=>(
                <div key={i} onClick={s.onClick} style={{padding:'20px 10px',textAlign:'center',borderRight:i<4?'1px solid rgba(255,255,255,.06)':'none',cursor:'pointer'}}>
                  <div style={{fontSize:'2rem',fontWeight:800,lineHeight:1,marginBottom:5,color:s.color,letterSpacing:'-.5px'}}>{s.val}</div>
                  <div style={{fontSize:11,fontWeight:600,marginBottom:2}}>{s.lbl}</div>
                  <div style={{fontSize:9.5,color:'#475569'}}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Programs */}
            <div style={{background:'linear-gradient(155deg,rgba(8,20,52,.85),rgba(5,13,38,.9))',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,overflow:'hidden',backdropFilter:'blur(28px)',marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px 10px'}}>
                <div>
                  <span style={{fontSize:14,fontWeight:800}}>{T('ai_workforce')}</span>
                  <span style={{fontSize:11,color:'#475569',marginLeft:7}}>— {courses.filter(c=>!c.isCert).length||28} {T('programs_schools')}</span>
                </div>
                <button onClick={()=>navigate('/portal/courses')} style={{background:'none',border:'none',color:'#6366f1',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>{T('view_all')}</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'155px 1fr'}}>
                <div style={{background:'rgba(4,10,32,.5)',padding:'6px 0',borderRight:'1px solid rgba(255,255,255,.06)'}}>
                  {ALL_SCHOOLS.map(sch=>{
                    const cnt = courses.filter(c=>c.school===sch).length;
                    return (
                    <div key={sch} onClick={()=>setActiveSchool(sch)} style={{display:'flex',alignItems:'center',gap:8,padding:'11px 13px',cursor:'pointer',fontSize:12.5,color:activeSchool===sch?'#a5b4fc':'#64748b',background:activeSchool===sch?'rgba(99,102,241,.16)':'transparent',fontWeight:activeSchool===sch?700:500,transition:'all .15s'}}>
                      <div style={{width:26,height:26,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,background:activeSchool===sch?'rgba(99,102,241,.2)':'rgba(255,255,255,.05)',flexShrink:0}}>
                        {SCHOOL_ICONS[sch]||'📚'}
                      </div>
                      <span style={{flex:1}}>{sch}</span>
                      {cnt>0&&<span style={{fontSize:9,background:'rgba(99,102,241,.25)',color:'#a5b4fc',borderRadius:99,padding:'1px 6px',fontWeight:700}}>{cnt}</span>}
                    </div>
                  )})}
                
                </div>
                <div style={{padding:'8px 16px 12px',overflowY:'auto',maxHeight:320}}>
                  {schoolCourses.length===0 && (
                    <div style={{padding:'24px 12px',textAlign:'center',color:'#334155',fontSize:12}}>
                      Loading courses…
                    </div>
                  )}
                  {schoolCourses.map((cp,idx)=>(
                    <div key={cp.id} onClick={()=>navigate(`/portal/course/${cp.id}`)} style={{display:'grid',gridTemplateColumns:'34px 1fr 125px 85px',gap:12,alignItems:'center',padding:'10px 6px',borderRadius:9,borderBottom:'1px solid rgba(255,255,255,.05)',cursor:'pointer',transition:'all .15s'}}>
                      <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0}}>
                        {idx+1}
                      </div>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:12.5,fontWeight:700,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {cp.title}
                          {cp.pct===0&&idx<2&&<span style={{marginLeft:5,fontSize:8,background:'#16a34a',color:'#fff',borderRadius:99,padding:'1px 5px',fontWeight:800}}>{T('new')}</span>}
                        </div>
                        <div style={{fontSize:10,color:'#475569',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cp.done}/{cp.total} {T('lessons')}</div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:4}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:10.5}}>
                          <span style={{fontWeight:800,color:cp.pct>0?'#818cf8':'#334155'}}>{cp.pct}%</span>
                          <span style={{color:'#334155'}}>{cp.done}/{cp.total}</span>
                        </div>
                        <div style={{height:3,background:'rgba(255,255,255,.07)',borderRadius:99,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${cp.pct}%`,background:cp.pct>50?'linear-gradient(90deg,#6366f1,#34d399)':'linear-gradient(90deg,#7c3aed,#6366f1)',borderRadius:99}} />
                        </div>
                      </div>
                      <button style={{padding:'7px 12px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit',border:'1px solid rgba(255,255,255,.1)',background:'rgba(8,18,50,.8)',color:cp.pct>0?'#e2e8f8':'#475569',whiteSpace:'nowrap'}}>
                        {cp.pct>0?`${T('continue')} →`:T('start')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools Dock */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',background:'linear-gradient(155deg,rgba(8,20,52,.88),rgba(5,13,38,.92))',border:'1px solid rgba(99,102,241,.12)',borderRadius:16,overflow:'hidden',boxShadow:'0 8px 40px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.07)'}}>
              {TOOLS.map((tool,i)=>(
                <button key={i} onClick={()=>navigate(tool.path)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'16px 8px',borderRight:i<4?'1px solid rgba(255,255,255,.06)':'none',cursor:'pointer',textAlign:'center',background:'none',border:i<4?'none':'none',borderRight:i<4?'1px solid rgba(255,255,255,.06)':undefined,fontFamily:'inherit',transition:'all .2s'}}>
                  <div style={{width:42,height:42,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,background:[
                    'rgba(99,102,241,.2)','rgba(52,211,153,.18)','rgba(245,158,11,.18)','rgba(96,165,250,.18)','rgba(251,146,60,.18)'
                  ][i]}}>
                    {tool.icon}
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:'#e2e8f8'}}>{T(tool.lbl)}</div>
                  <div style={{fontSize:9.5,color:'#475569'}}>{tool.count?`${tool.count} ${T(tool.sub)}`:T(tool.sub)}</div>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* ── RIGHT PANEL ── scrollable, all 4 boxes independent */}
        <aside style={{background:'rgba(2,6,18,.72)',backdropFilter:'blur(22px)',borderLeft:'none',overflowY:'auto',padding:14,display:'flex',flexDirection:'column',gap:13,position:'relative',zIndex:5}}>

          {/* 1. PROF CARD */}
          <div style={{position:'relative',width:'100%',height:260,overflow:'hidden',borderRadius:18,border:'1px solid rgba(59,130,246,.3)',background:'#020817',boxShadow:'0 0 45px rgba(37,99,235,.22)',flexShrink:0}}>
            <img src={profCardBg} alt="" style={{position:'absolute',top:0,right:0,height:'100%',width:'auto',minWidth:'62%',objectFit:'cover',objectPosition:'top right',zIndex:0,pointerEvents:'none'}} />
            <div style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',background:'linear-gradient(to right,rgba(2,8,23,.98) 0%,rgba(2,8,23,.94) 22%,rgba(2,8,23,.7) 44%,rgba(2,8,23,.2) 65%,transparent 82%)'}} />
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:'48%',zIndex:1,pointerEvents:'none',background:'linear-gradient(to top,rgba(2,8,23,.88) 0%,transparent 100%)'}} />
            {/* Header */}
            <div style={{position:'relative',zIndex:10,display:'flex',alignItems:'center',gap:11,padding:'16px 16px 0'}}>
              <div style={{width:42,height:42,borderRadius:'50%',flexShrink:0,background:'rgba(15,35,80,.85)',border:'1.5px solid rgba(59,130,246,.65)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#60a5fa',boxShadow:'0 0 14px rgba(59,130,246,.35)'}}>
                AI
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:'#fff',lineHeight:1.2,marginBottom:1}}>Professor Didier AI</div>
                <div style={{fontSize:11,color:'#7a9cbf'}}>Your AI Mentor</div>
              </div>
            </div>
            {/* Message box */}
            <div style={{position:'absolute',bottom:14,left:14,width:'56%',zIndex:10,background:'rgba(6,16,42,.88)',border:'1px solid rgba(59,130,246,.22)',borderRadius:12,padding:'12px 13px',backdropFilter:'blur(16px)',boxShadow:'0 8px 28px rgba(0,0,0,.5)'}}>
              <div style={{fontSize:12.5,fontWeight:700,color:'#fff',marginBottom:4}}>
                {T('prof_greeting')}, {displayName}! <span style={{color:'#f59e0b'}}>🌟</span>
              </div>
              <p style={{fontSize:11,color:'#94a3b8',lineHeight:1.55,marginBottom:10}}>{T('prof_analyzed')}</p>
              <button onClick={()=>setProfChat(true)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',height:38,padding:'0 12px',background:'linear-gradient(90deg,#1d4ed8,#2563eb)',border:'none',borderRadius:9,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 0 20px rgba(37,99,235,.38)'}}>
                <span>🎙️ {T('talk_prof')}</span>
                <div style={{display:'flex',alignItems:'center',gap:2}}>
                  {[5,9,13,9,6,4].map((h,i)=>(
                    <span key={i} style={{display:'inline-block',width:3,height:h,borderRadius:99,background:'#67e8f9',opacity:.85}} />
                  ))}
                </div>
              </button>
            </div>
          </div>

          {/* 2. TALENT SCORE */}
          <div style={{background:'linear-gradient(155deg,rgba(8,20,52,.88),rgba(5,13,38,.92))',border:'1px solid rgba(255,255,255,.08)',borderRadius:15,padding:14,boxShadow:'0 4px 20px rgba(0,0,0,.4)',flexShrink:0}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700}}>{T('talent_score_label')}</span>
              <div><span style={{fontSize:9.5,color:'#34d399',fontWeight:700}}>↑ {T('rising_star')}</span><span style={{fontSize:8.5,color:'#334155',marginLeft:3}}>+38 this week</span></div>
            </div>
            <div style={{marginBottom:9}}><span style={{fontSize:30,fontWeight:800,color:'#fb923c',letterSpacing:'-.5px'}}>{talentScore}</span><span style={{fontSize:13,color:'#334155',marginLeft:3}}>/ 1000</span></div>
            <svg width="100%" height="54" viewBox="0 0 256 54" preserveAspectRatio="none" style={{display:'block',marginBottom:4}}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".6"/><stop offset="100%" stopColor="#1d4ed8" stopOpacity="0"/></linearGradient></defs>
              <path d="M0 50 L36 45 L73 40 L110 47 L146 30 L183 17 L219 8 L256 2 L256 54 L0 54Z" fill="url(#sg)"/>
              <path d="M0 50 L36 45 L73 40 L110 47 L146 30 L183 17 L219 8 L256 2" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              {[0,36,73,110,146,183,219,256].map((x,i)=><circle key={i} cx={x} cy={[50,45,40,47,30,17,8,2][i]} r="3" fill="#60a5fa"/>)}
            </svg>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}>
              {['May 21','May 22','May 23','May 24','May 25','May 26','May 27'].map(d=><span key={d} style={{fontSize:8,color:'#1e293b'}}>{d}</span>)}
            </div>
            <button onClick={()=>navigate('/portal/talent-score')} style={{background:'none',border:'none',color:'#6366f1',fontSize:10.5,fontWeight:700,cursor:'pointer',padding:0,display:'block',marginBottom:11,fontFamily:'inherit'}}>
              {T('view_breakdown')}
            </button>
            <div style={{fontSize:11.5,fontWeight:700,marginBottom:9,paddingTop:10,borderTop:'1px solid rgba(255,255,255,.06)'}}>{T('top_skills')}</div>
            {SKILLS.map((sk,i)=>(
              <div key={i} style={{marginBottom:i<4?8:0}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:10.5}}>
                  <span style={{color:'#64748b'}}>{sk.label}</span>
                  <span style={{fontWeight:700,color:sk.color}}>{sk.pct}%</span>
                </div>
                <div style={{height:4,background:'rgba(255,255,255,.07)',borderRadius:99,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${sk.pct}%`,background:sk.color,borderRadius:99,opacity:.9}} />
                </div>
              </div>
            ))}
          </div>

          {/* 3. CAREER MOMENTUM */}
          <div style={{background:'linear-gradient(155deg,rgba(8,20,52,.88),rgba(5,13,38,.92))',border:'1px solid rgba(255,255,255,.08)',borderRadius:15,padding:14,boxShadow:'0 4px 20px rgba(0,0,0,.4)',flexShrink:0}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:12,fontWeight:700}}>{T('career_momentum')}</span>
              <div style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'#ef4444',fontWeight:700}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#ef4444'}} />
                {T('live_feed')}
              </div>
            </div>
            {MOMENTUM.map((item,i)=>(
              <div key={i} style={{display:'flex',gap:9,alignItems:'flex-start',marginBottom:i<2?9:0,paddingBottom:i<2?9:0,borderBottom:i<2?'1px solid rgba(255,255,255,.05)':'none'}}>
                <div style={{width:32,height:32,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'2px solid rgba(99,102,241,.4)'}}>
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="16" fill="#0c1a3d"/>
                    <ellipse cx="16" cy="29" rx="11" ry="9" fill={['#1d4ed8','#4338ca','#065f46'][i]}/>
                    <circle cx="16" cy="12" r="7" fill={['#c68642','#e8b89a','#7B3F00'][i]}/>
                    <ellipse cx="16" cy="7" rx="7.5" ry="5" fill={['#1c0e05','#4a2810','#0a0500'][i]}/>
                  </svg>
                </div>
                <div>
                  <div style={{fontSize:11,lineHeight:1.5,color:'#64748b'}}>
                    <strong style={{color:'#e2e8f8'}}>{item.name}</strong>
                    {' '}{item.action==='got_hired'&&<>{T('got_hired')} <span style={{color:'#6366f1'}}>{item.role} {T('at')} {item.company}</span></>}
                    {item.action==='completed'&&<>{T('completed')} <span style={{color:'#6366f1'}}>{item.program}</span></>}
                    {item.action==='earned'&&<>{T('earned')} <span style={{color:'#f59e0b',fontWeight:700}}>{item.cert}</span></>}
                  </div>
                  {(item as any).salary&&<div style={{fontSize:11,fontWeight:800,color:'#34d399',marginTop:2}}>{(item as any).salary}{T('year')}</div>}
                  <div style={{fontSize:9,color:'#1e293b',marginTop:2}}>{item.time} {T('ago')}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. FUTURE READY */}
          <div style={{background:'linear-gradient(135deg,rgba(37,99,235,.28),rgba(124,58,237,.34))',border:'1px solid rgba(99,102,241,.32)',borderRadius:15,padding:14,display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
            <div style={{width:48,height:48,borderRadius:'50%',background:'radial-gradient(#22d3ee,#4338ca)',display:'grid',placeItems:'center',fontSize:21,flexShrink:0,boxShadow:'0 0 14px rgba(34,211,238,.3)'}}>🚀</div>
            <div>
              <div style={{fontSize:12.5,fontWeight:800,marginBottom:3}}>{T('future_ready')}</div>
              <div style={{fontSize:10,color:'#475569',lineHeight:1.5}}>{T('future_sub')}</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
      <StreakDetailModal open={streakModal} onClose={()=>setStreakModal(false)} streak={streak} />
      <PointsDetailModal open={pointsModal} onClose={()=>setPointsModal(false)} points={totalPoints} />
      <LabsDetailModal open={labsModal} onClose={()=>setLabsModal(false)} labs={labs} />

      {/* Prof Chat overlay */}
      {profChat&&(
        <div onClick={()=>setProfChat(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#0d1829',border:'1px solid rgba(59,130,246,.3)',borderRadius:20,padding:'2rem',maxWidth:480,width:'90%',boxShadow:'0 40px 80px rgba(0,0,0,.6)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(15,35,80,.85)',border:'2px solid rgba(59,130,246,.6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#60a5fa'}}>AI</div>
              <div>
                <div style={{fontWeight:800,color:'#fff'}}>Professor Didier AI</div>
                <div style={{fontSize:11,color:'#34d399'}}>● Online</div>
              </div>
              <button onClick={()=>setProfChat(false)} style={{marginLeft:'auto',background:'none',border:'none',color:'#64748b',fontSize:20,cursor:'pointer'}}>×</button>
            </div>
            <div style={{fontSize:13,color:'#94a3b8',lineHeight:1.7,marginBottom:16}}>
              {T('prof_greeting')}, {displayName}! {T('prof_analyzed')}
            </div>
            <button onClick={()=>{setProfChat(false);navigate('/portal/courses');}} style={{width:'100%',padding:12,background:'linear-gradient(90deg,#2563eb,#6366f1)',border:'none',borderRadius:12,color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
              Go to My Courses
            </button>
          </div>
        </div>
      )}

      <style>{`
        *{box-sizing:border-box}
        *::-webkit-scrollbar{width:4px;height:4px}
        *::-webkit-scrollbar-track{background:transparent}
        *::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:99px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>
    </div>
  );
}
