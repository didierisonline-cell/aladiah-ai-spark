import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PortalSidebar from '@/components/PortalSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)',
  orange:'#F0622A', gold:'#F5B81A', green:'#22C98A', purple:'#A78BFA',
};

const CERT_PROGRAMS = [
  { title:'AI Cloud Engineer',           school:'AI Engineering',      color:'#4A90F5', icon:'☁️',  modules:10, hrs:40 },
  { title:'AI Agent Engineer',           school:'AI Engineering',      color:'#5B8FF9', icon:'🤖',  modules:10, hrs:40 },
  { title:'AI Data Engineer',            school:'AI Engineering',      color:'#6BA3F5', icon:'🗄️',  modules:10, hrs:40 },
  { title:'AI DevOps Engineer',          school:'AI Engineering',      color:'#7DB6F5', icon:'⚙️',  modules:10, hrs:40 },
  { title:'AI MLOps Engineer',           school:'AI Engineering',      color:'#4ACAF5', icon:'🔁',  modules:10, hrs:40 },
  { title:'AI Security Engineer',        school:'AI Engineering',      color:'#F55E4A', icon:'🔒',  modules:10, hrs:40 },
  { title:'AI Platform Engineer',        school:'AI Engineering',      color:'#4A90F5', icon:'🏗️',  modules:10, hrs:40 },
  { title:'AI Solutions Architect',      school:'AI Engineering',      color:'#A78BFA', icon:'🏛️',  modules:10, hrs:40 },
  { title:'AI Solutions Consultant',     school:'AI Business',         color:'#F0622A', icon:'💼',  modules:10, hrs:40 },
  { title:'AI Product Manager',          school:'AI Business',         color:'#F5B81A', icon:'📱',  modules:10, hrs:40 },
  { title:'AI Program Manager',          school:'AI Business',         color:'#F0A53A', icon:'📊',  modules:10, hrs:40 },
  { title:'AI Transformation Manager',   school:'AI Business',         color:'#E87040', icon:'🔄',  modules:10, hrs:40 },
  { title:'AI Business Analyst',         school:'AI Business',         color:'#F5C842', icon:'📈',  modules:10, hrs:40 },
  { title:'AI Sales Engineer',           school:'AI Business',         color:'#F07830', icon:'🎯',  modules:10, hrs:40 },
  { title:'AI Enterprise Architect',     school:'AI Business',         color:'#E09020', icon:'🏢',  modules:10, hrs:40 },
  { title:'AI Business Operations',      school:'AI Business',         color:'#F5A020', icon:'⚡',  modules:10, hrs:40 },
  { title:'AI Governance Professional',  school:'Governance & Risk',   color:'#22C98A', icon:'⚖️',  modules:10, hrs:40 },
  { title:'Responsible AI Specialist',   school:'Governance & Risk',   color:'#34D399', icon:'🛡️',  modules:10, hrs:40 },
  { title:'AI Compliance Officer',       school:'Governance & Risk',   color:'#22C98A', icon:'📋',  modules:10, hrs:40 },
  { title:'AI Risk Manager',             school:'Governance & Risk',   color:'#10B981', icon:'⚠️',  modules:10, hrs:40 },
  { title:'AI Auditor',                  school:'Governance & Risk',   color:'#34D399', icon:'🔍',  modules:10, hrs:40 },
  { title:'AI Ethics Specialist',        school:'Governance & Risk',   color:'#22C98A', icon:'🌍',  modules:10, hrs:40 },
  { title:'AI Policy Designer',          school:'Governance & Risk',   color:'#10B981', icon:'📜',  modules:10, hrs:40 },
  { title:'AI UX Designer',              school:'Human-AI Experience', color:'#C084FC', icon:'🎨',  modules:10, hrs:40 },
  { title:'Conversation Designer',       school:'Human-AI Experience', color:'#E879F9', icon:'💬',  modules:10, hrs:40 },
  { title:'Human-AI Interaction Specialist',school:'Human-AI Experience',color:'#A78BFA',icon:'🤝', modules:10, hrs:40 },
  { title:'AI Workflow Designer',        school:'Human-AI Experience', color:'#D946EF', icon:'🔗',  modules:10, hrs:40 },
  { title:'AI Experience Architect',     school:'Human-AI Experience', color:'#C084FC', icon:'✨',  modules:10, hrs:40 },
];

const SCHOOLS = ['All','AI Engineering','AI Business','Governance & Risk','Human-AI Experience'];
const SCHOOL_COLORS: Record<string,string> = {
  'AI Engineering':'#4A90F5','AI Business':'#F0622A',
  'Governance & Risk':'#22C98A','Human-AI Experience':'#C084FC',
};

export default function PortalCertifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSchool, setActiveSchool] = useState('All');
  const [courseProgress, setCourseProgress] = useState<Record<string,number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        // Get all courses
        const { data: courses } = await supabase.from('courses').select('id,title').eq('is_published', true);
        if (!courses) return;

        // Get all user progress
        const { data: progress } = await supabase.from('user_progress')
          .select('video_id').eq('user_id', user!.id).eq('completed', true);
        const completedIds = new Set((progress || []).map((p: any) => p.video_id));

        // Get all videos grouped by course
        const { data: videos } = await supabase.from('videos').select('id,chapter_id');
        const { data: chapters } = await supabase.from('chapters').select('id,course_id');

        const chapterToCourse: Record<string,string> = {};
        (chapters || []).forEach((c: any) => { chapterToCourse[c.id] = c.course_id; });

        const courseTotals: Record<string,number> = {};
        const courseDone: Record<string,number> = {};
        (videos || []).forEach((v: any) => {
          const cid = chapterToCourse[v.chapter_id];
          if (!cid) return;
          courseTotals[cid] = (courseTotals[cid] || 0) + 1;
          if (completedIds.has(v.id)) courseDone[cid] = (courseDone[cid] || 0) + 1;
        });

        const pctMap: Record<string,number> = {};
        (courses || []).forEach((c: any) => {
          const total = courseTotals[c.id] || 0;
          const done = courseDone[c.id] || 0;
          pctMap[c.title] = total > 0 ? Math.round((done / total) * 100) : 0;
        });
        setCourseProgress(pctMap);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filtered = activeSchool === 'All'
    ? CERT_PROGRAMS
    : CERT_PROGRAMS.filter(c => c.school === activeSchool);

  const earned = CERT_PROGRAMS.filter(c => (courseProgress[c.title] || 0) >= 100).length;
  const inProgress = CERT_PROGRAMS.filter(c => {
    const p = courseProgress[c.title] || 0;
    return p > 0 && p < 100;
  }).length;

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: '"Inter",system-ui,sans-serif' }}>
      <Header />
      <div style={{ display: 'flex' }}>
        <PortalSidebar />
        <div style={{ flex: 1, padding: '32px 36px', minHeight: 'calc(100vh - 70px)' }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: DS.gold, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
              🏅 CERTIFICATIONS
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: DS.fg, margin: 0, marginBottom: 6 }}>
              Your Certification Portfolio
            </h1>
            <p style={{ color: DS.fm, fontSize: 13, margin: 0 }}>
              28 elite AI certifications across 4 schools. Complete a program to earn your certificate.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { val: 28,         label: 'Total Available', color: DS.blue  },
              { val: earned,     label: 'Earned',          color: DS.gold  },
              { val: inProgress, label: 'In Progress',     color: DS.green },
              { val: 28 - earned - inProgress, label: 'Not Started', color: DS.fm },
            ].map((s, i) => (
              <div key={i} style={{
                background: DS.card, border: `1px solid ${DS.border}`,
                borderRadius: 12, padding: '16px 20px',
              }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{loading ? '—' : s.val}</div>
                <div style={{ fontSize: 11, color: DS.fm, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* School filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {SCHOOLS.map(school => {
              const active = activeSchool === school;
              const color = school === 'All' ? DS.blue : SCHOOL_COLORS[school];
              return (
                <button key={school} onClick={() => setActiveSchool(school)} style={{
                  padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                  background: active ? `${color}20` : 'transparent',
                  border: `1px solid ${active ? color : 'rgba(255,255,255,.1)'}`,
                  color: active ? color : DS.fm, fontSize: 12, fontWeight: active ? 700 : 500,
                  transition: 'all .15s',
                }}>
                  {school}
                </button>
              );
            })}
          </div>

          {/* Cert grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {filtered.map(cert => {
              const pct = courseProgress[cert.title] || 0;
              const earned = pct >= 100;
              const started = pct > 0;

              return (
                <div key={cert.title} style={{
                  background: DS.card,
                  border: `1px solid ${earned ? cert.color + '44' : DS.border}`,
                  borderRadius: 14, padding: '18px 20px',
                  boxShadow: earned ? `0 0 20px ${cert.color}18` : 'none',
                  transition: 'all .2s',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Earned glow */}
                  {earned && (
                    <div style={{
                      position: 'absolute', top: -30, right: -30,
                      width: 100, height: 100, borderRadius: '50%',
                      background: `radial-gradient(circle,${cert.color}22,transparent 70%)`,
                      pointerEvents: 'none',
                    }}/>
                  )}

                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                      background: `${cert.color}18`, border: `1px solid ${cert.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>
                      {cert.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: cert.color, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>
                        {cert.school.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: DS.fg, lineHeight: 1.3 }}>{cert.title}</div>
                    </div>
                    {earned && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: DS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, boxShadow: '0 0 12px rgba(245,184,26,.5)',
                      }}>
                        🏅
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 10, color: DS.fm }}>📚 {cert.modules} modules</span>
                    <span style={{ fontSize: 10, color: DS.fm }}>⏱ ~{cert.hrs}h</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, marginLeft: 'auto',
                      color: earned ? DS.gold : started ? DS.green : DS.fm,
                    }}>
                      {earned ? '✓ Earned' : started ? `${pct}% complete` : 'Not started'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginBottom: 14 }}>
                    <div style={{
                      height: '100%', borderRadius: 2, transition: 'width .4s',
                      width: `${pct}%`,
                      background: earned
                        ? `linear-gradient(90deg,${DS.gold},#fbbf24)`
                        : `linear-gradient(90deg,${cert.color},${cert.color}cc)`,
                    }}/>
                  </div>

                  {/* Action */}
                  {earned ? (
                    <button style={{
                      width: '100%', padding: '9px 0',
                      background: `linear-gradient(90deg,${DS.gold},#fbbf24)`,
                      border: 'none', borderRadius: 8, color: '#1a1a00',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      🏅 View Certificate
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/portal/courses')}
                      style={{
                        width: '100%', padding: '9px 0',
                        background: started ? `${cert.color}20` : 'rgba(255,255,255,.04)',
                        border: `1px solid ${started ? cert.color + '44' : 'rgba(255,255,255,.1)'}`,
                        borderRadius: 8, color: started ? cert.color : DS.fm,
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                      {started ? '→ Continue Program' : '+ Start Program'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
