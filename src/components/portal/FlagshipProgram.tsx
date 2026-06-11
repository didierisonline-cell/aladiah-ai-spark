import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AI_SCRUM_MASTER_CURRICULUM as MODULES,
  AI_SCRUM_MASTER_PROGRAM_META as META,
} from '@/services/agents/curriculum/programs/aiScrumMasterFull';

// Dark portal design system (matches /portal/simulations).
const DS = {
  bg: '#060E1C', card: 'rgba(8,20,52,.82)', border: 'rgba(74,144,245,.18)',
  fg: '#EDF2F7', fm: '#8596AD', fd: '#2A3A52',
  blue: '#4A90F5', purple: '#A78BFA', gold: '#F5B81A', green: '#22C98A', orange: '#F0622A',
};

const PHASE_COLOR: Record<string, string> = {
  Foundations: DS.blue, Practitioner: DS.green, Advanced: DS.purple,
  Leadership: DS.gold, Mastery: DS.orange, Capstone: DS.orange,
};

const Chip = ({ children, color = DS.blue }: { children: React.ReactNode; color?: string }) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, color, background: `${color}1A`, border: `1px solid ${color}33`, whiteSpace: 'nowrap' }}>{children}</span>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: DS.fm, marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 12, color: DS.fg, lineHeight: 1.55 }}>{children}</div>
  </div>
);

// ── Integration cards (Talent Score / AI Mentor / Placement / Portfolio) ──
function IntegrationStrip() {
  const navigate = useNavigate();
  const items = [
    { icon: '⭐', title: 'Talent Score', sub: 'Every module feeds your employability score', to: '/portal/talent-score', color: DS.gold },
    { icon: '🤖', title: 'AI Mentor', sub: 'Prof. Didier coaches each lesson, lab & drill', to: '/portal', color: DS.purple },
    { icon: '🌐', title: 'Simulations', sub: '54 real-world scenarios, 3 per module', to: '/portal/simulations', color: DS.blue },
    { icon: '🗂️', title: 'Portfolio', sub: '18 GitHub-ready deliverables', to: '/portal/portfolio', color: DS.green },
    { icon: '🎯', title: 'Placement Path', sub: 'Interview drills → Talent Network → hired', to: '/portal/my-career-path', color: DS.orange },
    { icon: '🏅', title: 'Certification', sub: 'AI Scrum Master Professional + PSM I/II readiness', to: '/portal/certifications', color: DS.blue },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 12, marginBottom: 26 }}>
      {items.map(it => (
        <button key={it.title} onClick={() => navigate(it.to)} style={{ textAlign: 'left', cursor: 'pointer', background: DS.card, border: `1px solid ${it.color}33`, borderRadius: 14, padding: '14px 16px', fontFamily: 'inherit', display: 'flex', gap: 12, alignItems: 'center', transition: 'all .15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = `${it.color}88`)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = `${it.color}33`)}>
          <span style={{ fontSize: 22 }}>{it.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: DS.fg }}>{it.title}</div>
            <div style={{ fontSize: 10.5, color: DS.fm, marginTop: 2, lineHeight: 1.4 }}>{it.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── One module (expandable, all components) ──
function ModuleRow({ m, expanded, onToggle }: { m: typeof MODULES[number]; expanded: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const color = PHASE_COLOR[m.phase] || DS.blue;
  const sims = [
    { lvl: 'Beginner', s: m.simulations.beginner, c: DS.green },
    { lvl: 'Intermediate', s: m.simulations.intermediate, c: DS.blue },
    { lvl: 'Advanced', s: m.simulations.advanced, c: DS.orange },
  ];
  return (
    <div style={{ background: DS.card, border: `1px solid ${expanded ? color + '55' : 'rgba(255,255,255,.07)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color .2s' }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 18px', cursor: 'pointer', userSelect: 'none', background: expanded ? `${color}08` : 'transparent' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: `${color}18`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color }}>{m.no}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: DS.fg }}>{m.title}</div>
          <div style={{ fontSize: 10.5, color: DS.fm, marginTop: 2 }}>{m.phase} · 3 sims · 1 lab · 1 portfolio · interview drills · {m.assessmentBlueprint.moduleQuiz + m.assessmentBlueprint.competencyQuiz}-q assessment</div>
        </div>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {m.competencyMapping.slice(0, 2).map(c => <Chip key={c.competency} color={color}>{c.competency}</Chip>)}
        </div>
        <div style={{ fontSize: 17, color: DS.fm, transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>⌄</div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '6px 26px' }}>
          <div>
            <Field label="Learning objectives"><ul style={{ margin: 0, paddingLeft: 16 }}>{m.learningObjectives.map((o, i) => <li key={i}>{o}</li>)}</ul></Field>
            <Field label="Lessons">{m.lessons.map(l => l.title).join(' · ')}</Field>
            <Field label="Readings">{m.readings.join(' · ')}</Field>
            <Field label="Videos">{m.videos.join(' · ')}</Field>
          </div>
          <div>
            <Field label={`Lab — ${m.lab.tool}`}><b style={{ color: DS.fg }}>{m.lab.name}.</b> {m.lab.task} → <em style={{ color: DS.green }}>{m.lab.deliverable}</em></Field>
            <Field label="AI Mentor activities">{m.aiMentorActivities.join(' · ')}</Field>
            <Field label="Portfolio deliverable"><span style={{ color: DS.green }}>📦 {m.portfolioDeliverable}</span></Field>
            <Field label="Interview drills">
              <div><b style={{ color: DS.fm }}>Behavioral:</b> {m.interviewPrep.behavioral.join('; ')}</div>
              <div><b style={{ color: DS.fm }}>Scenario:</b> {m.interviewPrep.scenario.join('; ')}</div>
              <div><b style={{ color: DS.fm }}>Leadership:</b> {m.interviewPrep.leadership.join('; ')}</div>
            </Field>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: DS.fm, margin: '4px 0 6px' }}>Simulations (3)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
              {sims.map(({ lvl, s, c }) => (
                <div key={lvl} style={{ background: 'rgba(255,255,255,.02)', border: `1px solid ${c}22`, borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Chip color={c}>{lvl}</Chip>
                    <span style={{ fontSize: 10, color: DS.fm }}>{s.company}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: DS.fg }}>{s.title}</div>
                  <div style={{ fontSize: 10.5, color: DS.fm, marginTop: 3 }}>⚔ {s.conflict}</div>
                  <div style={{ fontSize: 10.5, color: DS.fm, marginTop: 2 }}>🎚 {s.decisionPoints.join(' · ')}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/portal/simulations')} style={{ marginTop: 10, padding: '7px 14px', background: `linear-gradient(90deg,${color}cc,${color})`, border: 'none', borderRadius: 8, color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Launch simulations →</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlagshipProgram() {
  const [open, setOpen] = useState<number | null>(1);
  const totals = META.totals;

  const stats = [
    { v: totals.modules, l: 'Modules', c: DS.blue },
    { v: totals.simulations, l: 'Simulations', c: DS.purple },
    { v: totals.labs, l: 'Labs', c: DS.green },
    { v: totals.portfolioDeliverables, l: 'Portfolios', c: DS.gold },
    { v: totals.moduleQuizzes + totals.competencyQuizzes, l: 'Assessments', c: DS.orange },
    { v: totals.questionBank, l: 'Question bank', c: DS.blue },
  ];

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1180, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,184,26,.12)', border: '1px solid rgba(245,184,26,.35)', borderRadius: 20, padding: '4px 14px', fontSize: 10, color: DS.gold, fontWeight: 800, letterSpacing: 1.5, marginBottom: 14 }}>
        🏆 FLAGSHIP · REFERENCE PROGRAM · {META.standard}
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 8, letterSpacing: '-1px' }}>
        {META.name}{' '}
        <span style={{ background: 'linear-gradient(90deg,#4A90F5,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{META.version}</span>
      </h1>
      <p style={{ fontSize: 13.5, color: DS.fm, maxWidth: 720, lineHeight: 1.6, marginBottom: 18 }}>
        A world-class, AI-augmented certification engineered to transform careers — not just teach Scrum. Eighteen modules, each with a hands-on lab, three escalating real-world simulations, a GitHub portfolio deliverable, interview drills, and an adaptive assessment. Aligned to {META.alignment.join(', ')}.
      </p>

      {/* Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.l} style={{ background: DS.card, border: `1px solid ${s.c}26`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.c }}>{s.v.toLocaleString()}</div>
            <div style={{ fontSize: 10.5, color: DS.fm, letterSpacing: .5 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Readiness tracks */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: DS.fm, marginBottom: 8 }}>Certification & readiness tracks</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.values(META.readiness).map(r => (
            <span key={r.label} style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 10, color: DS.fg, background: 'rgba(74,144,245,.1)', border: '1px solid rgba(74,144,245,.28)' }}>
              {r.label} <span style={{ color: DS.fm, fontWeight: 500 }}>· M{r.modules.join(', M')}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <IntegrationStrip />

      {/* Modules */}
      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Curriculum — 18 modules</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MODULES.map(m => (
          <ModuleRow key={m.no} m={m} expanded={open === m.no} onToggle={() => setOpen(open === m.no ? null : m.no)} />
        ))}
      </div>

      <div style={{ marginTop: 22, fontSize: 11, color: DS.fd, textAlign: 'center' }}>
        Portfolio path: <span style={{ color: DS.fm }}>{META.githubPortfolioPath}</span>
      </div>
    </div>
  );
}
