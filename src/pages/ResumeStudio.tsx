import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BackToPortal from '@/components/portal/BackToPortal';
import { Save, Download, Sparkles, CheckCircle, Loader2, LayoutTemplate, X } from 'lucide-react';

interface ResumeData {
  fullName:string; email:string; phone:string; location:string;
  summary:string; experience:string; education:string;
  skills:string; certifications:string; projects:string;
}

const MOCK: ResumeData = {
  fullName: 'Alexandra Chen',
  email: 'alexandra.chen@email.com',
  phone: '+1 (212) 555-0182',
  location: 'New York, NY',
  summary: 'Seasoned AI Program Director with 12+ years leading enterprise digital transformation across Fortune 500 organizations. Proven track record delivering $80M+ in operational savings through AI-driven automation. Expert in Agile at scale, cross-functional leadership, and building high-performance engineering teams globally.',
  experience: 'AI Program Director — Goldman Sachs (2021–Present)\n• Led 6 Scrum teams (48 engineers) delivering AI risk assessment platform\n• Reduced model validation cycle from 14 days to 36 hours (92% improvement)\n• Managed $12M program budget with 98% on-time delivery rate\n\nSenior Scrum Master — JPMorgan Chase (2018–2021)\n• Coached 4 agile teams across 3 time zones delivering core banking modernization\n• Increased sprint velocity by 45% through facilitation and process optimization\n• Facilitated Quarterly Business Reviews for C-Suite stakeholders\n\nScrum Master — Deloitte Digital (2015–2018)\n• Implemented SAFe framework across 200-person technology division\n• Delivered 3 major platform migrations on schedule and under budget',
  education: 'M.S. Computer Science — Columbia University (2013)\nB.S. Information Systems — NYU Stern School of Business (2011)\nExecutive Leadership Program — Harvard Business School (2022)',
  skills: 'Scrum, SAFe 6.0, Kanban, AI Strategy, Program Management, Stakeholder Engagement, Risk Management, Agile Coaching, OKR Facilitation, Jira, Azure DevOps, Confluence, Data Analytics, Team Leadership, Executive Communication',
  certifications: 'PSM III — Scrum.org (2023)\nSAFe 6 Program Consultant (2022)\nPMP — Project Management Institute (2019)\nAI Professional Certificate — MIT (2023)\nAladiah Academy Certified™ AI Program Manager',
  projects: 'AI Risk Platform (2023): Led $8M initiative — deployed ML models reducing false positives by 67%\nDigital Transformation Program (2022): Orchestrated 18-month enterprise-wide Agile adoption for 1,200 employees\nPredictive Analytics Dashboard (2021): Built real-time KPI system used by 40+ executives globally',
};

const TEMPLATES = [
  { id:'prestige', name:'Prestige', accent:'#1B2A4A', desc:'Two-column navy sidebar — C-Suite & VP' },
  { id:'manhattan', name:'Manhattan', accent:'#0D1F3C', desc:'Bold centered header — Fortune 500' },
  { id:'sovereign', name:'Sovereign', accent:'#2C1810', desc:'Dark luxury — board-level positions' },
  { id:'apex', name:'Apex', accent:'#1E3A5F', desc:'Metrics-forward — quantify achievements' },
  { id:'zenith', name:'Zenith', accent:'#B8860B', desc:'Gold serif elegance — C-Suite & Directors' },
  { id:'catalyst', name:'Catalyst', accent:'#1A6B3C', desc:'Green tech — AI & digital leaders' },
  { id:'obsidian', name:'Obsidian', accent:'#212121', desc:'Ultra-premium — consulting & finance' },
  { id:'blueprint', name:'Blueprint', accent:'#003366', desc:'Technical leader — AI & CTO roles' },
  { id:'cardinal', name:'Cardinal', accent:'#8B0000', desc:'Deep red authority — law & healthcare' },
  { id:'visionary', name:'Visionary', accent:'#4B0082', desc:'Purple innovation — creative directors' },
];

const DS = { bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD', blue:'#4A90F5' };

// Editable field — renders as styled text, click to edit inline
const Field = ({ value, onChange, placeholder, style, multiline, className }:
  { value:string; onChange:(v:string)=>void; placeholder:string; style?:any; multiline?:boolean; className?:string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerText);
  };

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, []);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      data-placeholder={placeholder}
      style={{
        outline: 'none',
        minHeight: multiline ? 40 : 'auto',
        cursor: 'text',
        borderRadius: 3,
        transition: 'background .15s',
        background: focused ? 'rgba(74,144,245,.06)' : 'transparent',
        border: focused ? '1px dashed rgba(74,144,245,.4)' : '1px dashed transparent',
        padding: focused ? '2px 4px' : '2px 4px',
        whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        wordBreak: 'break-word',
        ...style,
      }}
    />
  );
};

// Section heading with AI suggest button
const Section = ({ title, accent, onAI, loading, children }:
  { title:string; accent:string; onAI?:()=>void; loading?:boolean; children:React.ReactNode }) => (
  <div style={{ marginBottom:20 }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
      <h2 style={{ fontSize:11, fontWeight:700, textTransform:'uppercase' as const, letterSpacing:2, color:accent, margin:0, borderBottom:`2px solid ${accent}`, paddingBottom:4, flex:1 }}>{title}</h2>
      {onAI && (
        <button onClick={onAI} disabled={loading}
          style={{ display:'flex', alignItems:'center', gap:3, fontSize:9, fontWeight:700, color:DS.blue, background:'rgba(74,144,245,.1)', border:'none', borderRadius:99, padding:'2px 8px', cursor:'pointer', marginLeft:12, whiteSpace:'nowrap' as const }}>
          {loading ? <Loader2 size={9} style={{ animation:'spin 1s linear infinite' }}/> : <Sparkles size={9}/>} AI
        </button>
      )}
    </div>
    {children}
  </div>
);

const ResumeStudio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeData>(MOCK);
  const [template, setTemplate] = useState('zenith');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState<string|null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';
  const tpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[4];

  useEffect(() => { if (user) loadResume(); }, [user]);

  const loadResume = async () => {
    const { data } = await (supabase as any)
      .from('ai_conversations').select('content')
      .eq('user_id', user!.id).eq('role', 'resume_data')
      .order('created_at', { ascending: false }).limit(1).single();
    if (data?.content) {
      try {
        const p = JSON.parse(data.content);
        setResume({ ...MOCK, ...p });
        if (p._template) setTemplate(p._template);
      } catch {}
    }
  };

  const saveResume = async () => {
    if (!user) return;
    setSaving(true);
    await (supabase as any).from('ai_conversations').upsert({
      user_id: user.id, role: 'resume_data',
      content: JSON.stringify({ ...resume, _template: template }),
      session_id: 'resume_' + user.id,
    }, { onConflict: 'user_id,role,session_id' });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const downloadResume = () => {
    const el = document.getElementById('resume-doc');
    if (!el) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${resume.fullName}</title><style>*{box-sizing:border-box}body{margin:0}[contenteditable]{outline:none!important;border:none!important;background:transparent!important}</style></head><body>${el.outerHTML}</body></html>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type:'text/html' }));
    a.download = `${(resume.fullName||'resume').replace(/ /g,'_')}_resume.html`;
    a.click();
  };

  const aiSuggest = async (field: keyof ResumeData, label: string) => {
    setAiLoading(field);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:600,
          messages:[{ role:'user', content:`You are an expert executive resume writer. Write a strong ${label} for an AI professional named ${resume.fullName||'the student'}. Their experience: ${resume.experience||'not yet provided'}. Return ONLY the text content, no preamble, no labels.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      setResume(r => ({ ...r, [field]: text }));
      // Force re-render of contenteditable
      const el = document.querySelector(`[data-field="${field}"]`) as HTMLDivElement;
      if (el) el.innerText = text;
    } catch {}
    setAiLoading(null);
  };

  const set = (field: keyof ResumeData) => (v:string) => setResume(r => ({ ...r, [field]: v }));

  // Template-specific styles
  const styles: Record<string, any> = {
    prestige:  { wrap:{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:1000 }, sidebar:true, sidebarBg:'#1B2A4A', sidebarColor:'#fff', accent:'#1B2A4A', gold:'#C4A44A', font:"'Georgia',serif" },
    manhattan: { wrap:{ padding:'40px' }, sidebar:false, accent:'#0D1F3C', gold:'#C4A44A', font:"'Arial',sans-serif", centered:true },
    sovereign: { wrap:{ padding:'0' }, sidebar:false, accent:'#2C1810', gold:'#C4A44A', font:"'Times New Roman',serif", darkHeader:true },
    apex:      { wrap:{ padding:'0' }, sidebar:false, accent:'#1E3A5F', gold:'#1E3A5F', font:"'Calibri',sans-serif", colorHeader:true, headerBg:'linear-gradient(135deg,#1E3A5F,#2E5A8F)' },
    zenith:    { wrap:{ padding:'44px' }, sidebar:false, accent:'#B8860B', gold:'#B8860B', font:"'Palatino Linotype',serif", ornate:true },
    catalyst:  { wrap:{ display:'grid', gridTemplateColumns:'1fr 240px' }, sidebar:true, sidebarBg:'#F7FBF8', sidebarColor:'#1A6B3C', accent:'#1A6B3C', gold:'#1A6B3C', font:"'Trebuchet MS',sans-serif", greenHeader:true },
    obsidian:  { wrap:{ padding:'0' }, sidebar:false, accent:'#212121', gold:'#C4A44A', font:"'Garamond',serif", darkHeader:true },
    blueprint: { wrap:{ display:'grid', gridTemplateColumns:'1fr 200px' }, sidebar:true, sidebarBg:'#E8F0F8', sidebarColor:'#003366', accent:'#003366', gold:'#003366', font:"'Verdana',sans-serif", colorHeader:true, headerBg:'#003366' },
    cardinal:  { wrap:{ padding:'40px' }, sidebar:false, accent:'#8B0000', gold:'#8B0000', font:"'Book Antiqua',serif" },
    visionary: { wrap:{ display:'grid', gridTemplateColumns:'1fr 260px' }, sidebar:true, sidebarBg:'#F8F4FF', sidebarColor:'#4B0082', accent:'#4B0082', gold:'#4B0082', font:"'Century Gothic',sans-serif", gradHeader:true, headerBg:'linear-gradient(135deg,#4B0082,#7B2FBE)' },
  };
  const s = styles[template] || styles.zenith;

  const fieldStyle = (base: any = {}) => ({ ...base, cursor:'text', borderRadius:3, transition:'background .15s', padding:'2px 4px' });

  const renderHeader = () => (
    <div>
      <div
        contentEditable suppressContentEditableWarning
        onInput={e => set('fullName')((e.target as HTMLDivElement).innerText)}
        style={fieldStyle(s.centered || s.darkHeader || s.ornate
          ? { fontSize:s.ornate?26:s.darkHeader?28:32, fontWeight:700, letterSpacing:s.ornate?6:s.darkHeader?5:4, textTransform:'uppercase' as const, margin:'0 0 8px', textAlign:s.centered||s.ornate?'center':'left', color:s.darkHeader?'#fff':'#1a1a1a', fontFamily:s.font }
          : { fontSize:22, fontWeight:700, color:s.darkHeader?'#fff':'#1a1a1a', margin:'0 0 4px', fontFamily:s.font }
        )}
      >{resume.fullName}</div>
      {s.ornate && <div style={{ width:60, height:3, background:s.gold, margin:'0 auto 12px', display:'block' }}/>}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, justifyContent:s.centered||s.ornate?'center':'flex-start' }}>
        {['email','phone','location'].map(f => (
          <span key={f} contentEditable suppressContentEditableWarning
            onInput={e => set(f as keyof ResumeData)((e.target as HTMLElement).innerText)}
            style={fieldStyle({ fontSize:11, color:s.darkHeader?'rgba(255,255,255,.8)':s.ornate?s.gold:'#555', fontFamily:s.font })}
          >{resume[f as keyof ResumeData] || (f==='email'?'email@example.com':f==='phone'?'Phone':f==='location'?'Location':f)}</span>
        ))}
      </div>
    </div>
  );

  const renderSection = (field: keyof ResumeData, label: string, multi=true) => (
    <Section key={field} title={label} accent={s.accent} onAI={() => aiSuggest(field, label)} loading={aiLoading===field}>
      <div
        data-field={field}
        contentEditable suppressContentEditableWarning
        onInput={e => set(field)((e.target as HTMLDivElement).innerText)}
        style={fieldStyle({ fontSize:13, lineHeight:1.85, whiteSpace:'pre-wrap' as const, wordBreak:'break-word' as const, color:'#333', fontFamily:s.font, width:'100%' })}
      >{resume[field] || ''}</div>
    </Section>
  );

  const mainContent = () => (
    <div style={{ flex:1, padding:s.sidebar?'28px 28px':s.wrap.padding||0 }}>
      {!s.sidebar && !s.darkHeader && !s.colorHeader && !s.gradHeader && !s.greenHeader && (
        <div style={{ marginBottom:24, borderBottom:`2px solid ${s.accent}`, paddingBottom:16 }}>
          {renderHeader()}
        </div>
      )}
      {resume.summary && renderSection('summary', s.ornate?'Executive Profile':'Professional Summary')}
      {renderSection('experience', 'Professional Experience')}
      {renderSection('education', 'Education')}
      {renderSection('projects', 'Key Projects & Achievements')}
      {!s.sidebar && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <Section title="Skills" accent={s.accent}>{renderSection('skills','Skills')}</Section>
          <Section title="Certifications" accent={s.accent}>{renderSection('certifications','Certifications')}</Section>
        </div>
      )}
    </div>
  );

  const sidebarContent = () => s.sidebar ? (
    <div style={{ background:s.sidebarBg, padding:'28px 20px', color:s.sidebarColor, borderLeft:s.sidebarBg===s.bg?`1px solid ${DS.border}`:'none' }}>
      <Section title="Skills" accent={s.gold||s.accent}>
        <div contentEditable suppressContentEditableWarning onInput={e => set('skills')((e.target as HTMLDivElement).innerText)}
          style={fieldStyle({ fontSize:11, lineHeight:1.8, color:s.sidebarColor||'#333', whiteSpace:'pre-wrap' as const })}
          >{resume.skills}</div>
      </Section>
      <Section title="Certifications" accent={s.gold||s.accent}>
        <div contentEditable suppressContentEditableWarning onInput={e => set('certifications')((e.target as HTMLDivElement).innerText)}
          style={fieldStyle({ fontSize:11, lineHeight:1.8, color:s.sidebarColor||'#333', whiteSpace:'pre-wrap' as const })}
          >{resume.certifications}</div>
      </Section>
    </div>
  ) : null;

  const headerBg = () => {
    if (!s.darkHeader && !s.colorHeader && !s.gradHeader && !s.greenHeader) return null;
    const bg = s.darkHeader ? s.sidebarBg||s.accent : s.headerBg||s.accent;
    return (
      <div style={{ background:bg, padding:'32px 36px', gridColumn:'1/-1' }}>
        {renderHeader()}
      </div>
    );
  };

  return (
    <div style={{ minHeight:'100vh', background:DS.bg, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <Header />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'80px 1.5rem 2rem' }}>
        <BackToPortal />

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
          <div>
            <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:DS.fg, margin:0 }}>Resume Builder Studio</h1>
            <p style={{ fontSize:12, color:DS.fm, margin:'3px 0 0' }}>Click any text on the resume to edit it directly · Content stretches as you type</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => {
                const el = document.querySelector('#resume-doc [contenteditable]') as HTMLElement;
                if (el) { el.focus(); document.execCommand('undo'); }
              }}
              title="Undo (Cmd+Z)"
              style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 12px', background:'transparent', border:'1px solid '+DS.border, borderRadius:'.5rem', color:DS.fm, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              ↩ Undo
            </button>
            <button onClick={() => {
                const el = document.querySelector('#resume-doc [contenteditable]') as HTMLElement;
                if (el) { el.focus(); document.execCommand('redo'); }
              }}
              title="Redo (Cmd+Shift+Z)"
              style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 12px', background:'transparent', border:'1px solid '+DS.border, borderRadius:'.5rem', color:DS.fm, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              ↪ Redo
            </button>
            <button onClick={() => setShowTemplates(!showTemplates)}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:showTemplates?DS.blue+'22':'transparent', border:'1px solid '+(showTemplates?DS.blue:DS.border), borderRadius:'.5rem', color:showTemplates?DS.blue:DS.fm, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              <LayoutTemplate size={13}/> Templates
            </button>
            <button onClick={saveResume} disabled={saving}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:saved?'#22C98A22':DS.card, border:'1px solid '+(saved?'#22C98A':DS.border), borderRadius:'.5rem', color:saved?'#22C98A':DS.fm, fontSize:12, fontWeight:600, cursor:'pointer' }}>
              {saving?<Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/>:saved?<CheckCircle size={12}/>:<Save size={12}/>}
              {saved?'Saved!':'Save'}
            </button>
            <button onClick={downloadResume}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:DS.blue, border:'none', borderRadius:'.5rem', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              <Download size={13}/> Download
            </button>
          </div>
        </div>

        {/* Template picker */}
        {showTemplates && (
          <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', padding:'1rem', marginBottom:'1.25rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontSize:12, fontWeight:700, color:DS.fg }}>Choose Your Executive Template</span>
              <button onClick={() => setShowTemplates(false)} style={{ background:'none', border:'none', color:DS.fm, cursor:'pointer' }}><X size={16}/></button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { setTemplate(t.id); setShowTemplates(false); }}
                  style={{ padding:'10px 12px', background:template===t.id?t.accent+'22':DS.bg, border:'2px solid '+(template===t.id?t.accent:DS.border), borderRadius:'.5rem', cursor:'pointer', textAlign:'left' as const, transition:'all .15s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:t.accent, flexShrink:0 }}/>
                    <span style={{ fontSize:11, fontWeight:700, color:template===t.id?t.accent:DS.fg }}>{t.name}</span>
                    {template===t.id && <span style={{ fontSize:8, color:t.accent, fontWeight:800, marginLeft:'auto' }}>✓</span>}
                  </div>
                  <p style={{ fontSize:9, color:DS.fm, margin:0, lineHeight:1.4 }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Edit hint */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', padding:'8px 14px', background:'rgba(74,144,245,.08)', border:'1px solid rgba(74,144,245,.2)', borderRadius:'.5rem' }}>
          <span style={{ fontSize:18 }}>✏️</span>
          <p style={{ fontSize:12, color:DS.blue, margin:0 }}>
            <strong>Click directly on any text</strong> in the resume below to edit it. Use the ✨ AI buttons on each section for AI-generated content. Your changes update instantly.
          </p>
        </div>

        {/* THE RESUME — direct edit */}
        <div id="resume-doc" style={{ background:'#fff', boxShadow:'0 4px 40px rgba(0,0,0,.25)', borderRadius:8, overflow:'hidden', fontFamily:s.font }}>
          {(s.darkHeader||s.colorHeader||s.gradHeader||s.greenHeader) && (
            <div style={{ background:s.headerBg||s.sidebarBg||s.accent, padding:'30px 36px' }}>
              {renderHeader()}
            </div>
          )}
          {s.greenHeader && <div style={{ height:4, background:'linear-gradient(90deg,#1A6B3C,#52C47C,#F5B81A)' }}/>}
          <div style={{ display:'grid', gridTemplateColumns:s.sidebar?(s.id==='prestige'?'220px 1fr':'1fr 240px'):'1fr' }}>
            {template==='prestige' && sidebarContent()}
            <div style={{ padding:s.sidebar||s.darkHeader||s.colorHeader||s.gradHeader||s.greenHeader?'28px':'0' }}>
              {(!s.sidebar&&!s.darkHeader&&!s.colorHeader&&!s.gradHeader&&!s.greenHeader) && (
                <div style={{ padding:'0 0 20px', marginBottom:20, borderBottom:`2px solid ${s.accent}`, ...(s.centered||s.ornate?{textAlign:'center' as const}:{}) }}>
                  {renderHeader()}
                </div>
              )}
              {renderSection('summary', s.ornate?'Executive Profile':'Professional Summary')}
              {renderSection('experience', 'Professional Experience')}
              {renderSection('education', 'Education')}
              {renderSection('projects', 'Key Projects & Achievements')}
              {!s.sidebar && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  {renderSection('skills', 'Core Skills')}
                  {renderSection('certifications', 'Certifications')}
                </div>
              )}
            </div>
            {template!=='prestige' && s.sidebar && sidebarContent()}
          </div>
        </div>

        <p style={{ fontSize:11, color:DS.fm, textAlign:'center' as const, marginTop:12 }}>
          All changes are live · Click Save to store · Click Download to export as HTML
        </p>
      </div>
    </div>
  );
};

export default ResumeStudio;
