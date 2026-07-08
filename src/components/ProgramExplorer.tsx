import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

const DS = {
  bg:'#0B111E', card:'#111D30', muted:'#18243A', border:'#1E2D47',
  fg:'#EDF2F7', fm:'#8596AD', fd:'#4A5E7A',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

export interface Program {
  id: string;
  name: string;
  school: 'engineering' | 'business' | 'governance' | 'humanai';
  icon: string;
  tagline: string;
  description: string;
  weeks: number;
  salary: string;
  skills: string[];
  levels: string;
  outcomes: string[];
  modules: { title: string; lessons: number }[];
  color: string;
  colorD: string;
  colorB: string;
}

const SCHOOL_META: Record<string, { label: string; color: string; colorD: string; colorB: string }> = {
  engineering: { label:'School of AI Engineering', color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  business: { label:'School of AI Business Transformation', color:DS.orange, colorD:DS.od, colorB:DS.ob },
  governance: { label:'School of Governance & Risk', color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  humanai: { label:'School of Human-AI Experience', color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
};

interface Props {
  program: Program | null;
  onClose: () => void;
}

export const ProgramExplorer = ({ program, onClose }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const [checkingOut, setCheckingOut] = useState(false);
  const [firstCourse, setFirstCourse] = useState<{ courseId: string; chapterId: string } | null>(null);

  // Fetch the first chapter of the first course so "Try Free" can deep-link
  useEffect(() => {
    if (!program) return;
    supabase.from('courses').select('id').order('sort_order').limit(1)
      .then(async ({ data: courses }) => {
        if (!courses?.[0]) return;
        const cid = courses[0].id;
        const { data: chapters } = await supabase.from('chapters').select('id').eq('course_id', cid).order('order_index').limit(1);
        if (chapters?.[0]) setFirstCourse({ courseId: cid, chapterId: chapters[0].id });
      });
  }, [program]);

  const handleSubscribe = async () => {
    if (!user) { onClose(); navigate('/auth?redirect=pricing'); return; }
    setCheckingOut(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TW7U21wgazWak4Atj7TblB3',
          email: user.email,
          tier: 't2',
          userId: user.id,
          successUrl: `${window.location.origin}/portal?payment=success`,
          cancelUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setCheckingOut(false);
    }
  };

  const handleTryFree = () => {
    onClose();
    if (!user) {
      navigate('/auth?redirect=try-free');
    } else if (isActive) {
      // Already subscribed — go to portal
      navigate('/portal/courses');
    } else if (firstCourse) {
      navigate(`/course/${firstCourse.courseId}/chapter/${firstCourse.chapterId}`);
    } else {
      navigate('/courses');
    }
  };

  const handleGoToCourses = () => {
    onClose();
    navigate(isActive ? '/portal/courses' : '/courses');
  };

  if (!program) return null;

  const school = SCHOOL_META[program.school];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
          backdropFilter: 'blur(4px)', zIndex: 200,
          animation: 'fadeIn .15s ease',
        }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(600px,100vw)',
        background: DS.bg,
        borderLeft: `1px solid ${DS.border}`,
        zIndex: 201,
        overflowY: 'auto',
        animation: 'slideIn .2s ease',
        fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      }}>
        {/* Header band */}
        <div style={{
          background: `linear-gradient(135deg,${program.colorD},transparent)`,
          borderBottom: `1px solid ${program.colorB}`,
          padding: '1.5rem 1.75rem 1.25rem',
          position: 'sticky', top: 0, zIndex: 1,
          backdropFilter: 'blur(20px)',
          backgroundColor: DS.card,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: school.color, marginBottom: '.35rem' }}>
                {school.label}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: DS.fg, lineHeight: 1.2, margin: 0 }}>
                {program.icon} {program.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: '.5rem', width: 36, height: 36, cursor: 'pointer', color: DS.fm, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >×</button>
          </div>
          {/* Quick stats row */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: 12, color: DS.fm }}>💰 <strong style={{ color: DS.fg }}>{program.salary}</strong></span>
            <span style={{ fontSize: 12, color: DS.fm }}>⏱ <strong style={{ color: DS.fg }}>{program.weeks} weeks</strong></span>
            <span style={{ fontSize: 12, color: DS.fm }}>🏅 <strong style={{ color: DS.fg }}>{program.levels}</strong></span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Tagline */}
          <p style={{ fontSize: 13, color: DS.fm, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {program.description}
          </p>

          {/* Skills pills */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.fd, marginBottom: '.65rem' }}>Skills You'll Master</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '.4rem' }}>
              {program.skills.map(skill => (
                <span key={skill} style={{
                  fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999,
                  background: program.colorD, color: program.color, border: `1px solid ${program.colorB}`,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Career outcomes */}
          <div style={{ background: program.colorD, border: `1px solid ${program.colorB}`, borderRadius: '.75rem', padding: '1.1rem 1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: program.color, marginBottom: '.5rem' }}>🎯 Career Outcomes</div>
            {program.outcomes.map((o, i) => (
              <div key={i} style={{ fontSize: 12, color: DS.fm, display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: i < program.outcomes.length-1 ? '.35rem' : 0 }}>
                <span style={{ color: DS.green, fontSize: 10 }}>✓</span> {o}
              </div>
            ))}
          </div>

          {/* Curriculum preview */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.fd, marginBottom: '.65rem' }}>Curriculum Preview</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '.45rem' }}>
              {program.modules.map((mod, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '.75rem 1rem', background: DS.card, border: `1px solid ${DS.border}`,
                  borderRadius: '.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: DS.fd, minWidth: 28 }}>L{(i+1)*100}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: DS.fg }}>{mod.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                    <span style={{ fontSize: 11, color: DS.fm }}>{mod.lessons} lessons</span>
                    {i === 0 ? (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: DS.grd, color: DS.green, border: '1px solid rgba(34,201,138,.28)' }}>FREE</span>
                    ) : (
                      <span style={{ fontSize: 13, color: DS.fd }}>🔒</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: DS.fd, marginTop: '.65rem', textAlign: 'center' as const }}>
              10 modules · 70 lessons · L100 through L700
            </div>
          </div>

          {/* CTA zone — logic driven by auth + subscription state */}
          <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.5rem' }}>
            {isActive ? (
              // Already subscribed
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: DS.green, marginBottom: '.4rem' }}>✅ You have full access</div>
                <p style={{ fontSize: 12, color: DS.fm, marginBottom: '1rem' }}>Your All-Access Pass covers this program. Jump straight in.</p>
                <button onClick={handleGoToCourses} style={btnStyle(program.color, program.school === 'governance' ? '#0B111E' : '#fff')}>
                  Go to My Courses →
                </button>
              </>
            ) : (
              // Not subscribed or not logged in
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.85rem', flexWrap: 'wrap' as const, gap: '.5rem' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: DS.gold, letterSpacing: .5 }}>ALADIAH ALL-ACCESS PASS™</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: DS.fg, lineHeight: 1 }}>
                      $99<span style={{ fontSize: '.9rem', color: DS.fm, fontWeight: 400 }}>.99/mo</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: DS.fm, textAlign: 'right' as const }}>
                    <div>All live programs · more coming soon</div>
                    <div>Cancel anytime</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '.6rem' }}>
                  <button
                    onClick={handleSubscribe}
                    disabled={checkingOut}
                    style={btnStyle(DS.gold, '#0B111E', true)}
                  >
                    {checkingOut ? 'Loading...' : '🚀 Subscribe & Unlock Everything →'}
                  </button>
                  <button
                    onClick={handleTryFree}
                    style={btnStyle('transparent', DS.fg, false, DS.border)}
                  >
                    👋 Try Module 1 Free — No Credit Card
                  </button>
                </div>
                <div style={{ fontSize: 10, color: DS.fd, textAlign: 'center' as const, marginTop: '.65rem' }}>
                  Free access includes Module 1, Lesson 1 with Prof. Didier AI
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
      `}</style>
    </>
  );
};

function btnStyle(bg: string, color: string, bold?: boolean, border?: string): React.CSSProperties {
  return {
    width: '100%', padding: '.75rem', fontSize: 13,
    fontWeight: bold ? 800 : 700,
    borderRadius: '.75rem', background: bg, color,
    border: border ? `1px solid ${border}` : 'none',
    cursor: 'pointer', transition: 'all .2s',
    textAlign: 'center',
  };
}

export default ProgramExplorer;
