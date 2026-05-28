import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import PortalSidebar from '@/components/PortalSidebar';
import { Save, Download, Sparkles, CheckCircle, Loader2, LayoutTemplate, X, Palette } from 'lucide-react';

interface ResumeData {
  fullName:string; email:string; phone:string; location:string;
  summary:string; experience:string; education:string;
  skills:string; certifications:string; projects:string;
}

interface StyleControls {
  fontSize: number;
  accentColor: string;
  textColor: string;
  nameSize: number;
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

const ACCENT_PRESETS = [
  '#B8860B','#1B2A4A','#8B0000','#0D1F3C','#1A6B3C','#4B0082','#003366','#2C1810','#1E3A5F','#212121',
  '#C0392B','#16A085','#2980B9','#8E44AD','#D35400','#27AE60','#2C3E50','#E91E63','#FF5722','#607D8B',
];

const DS = { bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD', blue:'#4A90F5' };

const toBase64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  const chunkSize = 8192;
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

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
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [styleControls, setStyleControls] = useState<StyleControls>({
    fontSize: 13, accentColor: '#B8860B', textColor: '#333333', nameSize: 28,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<ResumeData[]>([MOCK]);
  const historyIdxRef = useRef(0);

  useEffect(() => { if (user) loadResume(); }, [user]);

  const loadResume = async () => {
    const { data } = await (supabase as any)
      .from('ai_conversations').select('content')
      .eq('user_id', user!.id).eq('role', 'resume_data')
      .order('created_at', { ascending: false }).limit(1).single();
    if (data?.content) {
      try {
        const p = JSON.parse(data.content);
        if (p._template) setTemplate(p._template);
        if (p._style) setStyleControls(sc => ({ ...sc, ...p._style }));
        const loaded = { ...MOCK, ...p };
        delete loaded._template; delete loaded._style;
        setResume(loaded);
      } catch {}
    }
  };

  const syncFields = useCallback((data: ResumeData) => {
    Object.keys(data).forEach(k => {
      const el = document.querySelector(`[data-field="${k}"]`) as HTMLElement;
      if (el) el.innerText = data[k as keyof ResumeData] || '';
    });
  }, []);

  const saveResume = async () => {
    if (!user) return;
    setSaving(true);
    await (supabase as any).from('ai_conversations').upsert({
      user_id: user.id, role: 'resume_data',
      content: JSON.stringify({ ...resume, _template: template, _style: styleControls }),
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

  const applyResumeData = (parsed: Partial<ResumeData>) => {
    const newResume = { ...MOCK, ...parsed };
    const h = historyRef.current.slice(0, historyIdxRef.current + 1);
    h.push(newResume);
    historyRef.current = h;
    historyIdxRef.current = h.length - 1;
    setResume(newResume);
    requestAnimationFrame(() => syncFields(newResume));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(true);
    const name = file.name.toLowerCase();
    const isPDF  = name.endsWith('.pdf')  || file.type === 'application/pdf';
    const isDOCX = name.endsWith('.docx') || name.endsWith('.doc') ||
                   file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.type === 'application/msword';
    try {
      if (isPDF) {
        setUploadMsg('Reading your PDF...');
        const buf = await file.arrayBuffer();
        const base64 = toBase64(buf);
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514', max_tokens: 2000,
            messages: [{ role: 'user', content: [
              { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
              { type: 'text', text: 'Extract resume information from this PDF. Return ONLY a valid JSON object with these exact keys: fullName, email, phone, location, summary, experience, education, skills, certifications, projects. Use newlines between entries in multi-line fields. Empty string for missing fields. No markdown, no preamble, just the JSON.' }
            ]}]
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        const raw = data.content?.[0]?.text || '{}';
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        applyResumeData(parsed);
        setUploadMsg('✓ PDF imported successfully!');
      } else if (isDOCX) {
        setUploadMsg('Reading your Word document...');
        const buf = await file.arrayBuffer();
        if (!(window as any).mammoth) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('Failed to load mammoth'));
            document.head.appendChild(s);
          });
        }
        const result = await (window as any).mammoth.extractRawText({ arrayBuffer: buf });
        const text = result.value || '';
        if (!text.trim()) throw new Error('Could not extract text from Word document');
        setUploadMsg('AI is parsing your resume...');
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514', max_tokens: 2000,
            messages: [{ role: 'user', content: `Extract resume information from this text. Return ONLY a valid JSON object with these exact keys: fullName, email, phone, location, summary, experience, education, skills, certifications, projects. Use newlines between entries in multi-line fields. Empty string for missing fields. No markdown, no preamble.\n\n${text.slice(0, 8000)}` }]
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        const raw = data.content?.[0]?.text || '{}';
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        applyResumeData(parsed);
        setUploadMsg('✓ Word document imported successfully!');
      } else {
        setUploadMsg('Reading your resume...');
        const text = await file.text();
        setUploadMsg('AI is parsing your resume...');
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514', max_tokens: 2000,
            messages: [{ role: 'user', content: `Extract resume information from this text. Return ONLY a valid JSON object with these exact keys: fullName, email, phone, location, summary, experience, education, skills, certifications, projects. Use newlines between entries in multi-line fields. Empty string for missing fields. No markdown, no preamble.\n\n${text.slice(0, 8000)}` }]
          })
        });
        const data = await res.json();
        const raw = data.content?.[0]?.text || '{}';
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        applyResumeData(parsed);
        setUploadMsg('✓ Resume imported successfully!');
      }
    } catch (err: any) {
      setUploadMsg(`Could not read file: ${err?.message || 'Unknown error'}. Try saving as .txt instead.`);
    }
    setUploading(false);
    setTimeout(() => setUploadMsg(''), 6000);
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
      const newResume = { ...resume, [field]: text };
      historyRef.current = [...historyRef.current.slice(0, historyIdxRef.current + 1), newResume];
      historyIdxRef.current = historyRef.current.length - 1;
      setResume(newResume);
      const el = document.querySelector(`[data-field="${field}"]`) as HTMLDivElement;
      if (el) el.innerText = text;
    } catch {}
    setAiLoading(null);
  };

  const liveValues = useRef<Partial<ResumeData>>({});
  const onFieldInput = (field: keyof ResumeData) => (e: React.FormEvent<HTMLElement>) => {
    liveValues.current[field] = (e.target as HTMLElement).innerText;
  };
  const onFieldBlur = (field: keyof ResumeData) => () => {
    const v = liveValues.current[field];
    if (v === undefined) return;
    setResume(r => {
      if (r[field] === v) return r;
      const next = { ...r, [field]: v };
      const h = historyRef.current.slice(0, historyIdxRef.current + 1);
      h.push(next); if (h.length > 100) h.shift();
      historyRef.current = h; historyIdxRef.current = h.length - 1;
      return next;
    });
  };

  const undo = () => {
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current--;
    const prev = historyRef.current[historyIdxRef.current];
    setResume(prev); requestAnimationFrame(() => syncFields(prev));
  };
  const redo = () => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current++;
    const next = historyRef.current[historyIdxRef.current];
    setResume(next); requestAnimationFrame(() => syncFields(next));
  };

  const styles: Record<string, any> = {
    prestige:  { sidebar:true, sidebarBg:'#1B2A4A', sidebarColor:'#fff', font:"'Georgia',serif" },
    manhattan: { sidebar:false, font:"'Arial',sans-serif", centered:true },
    sovereign: { sidebar:false, font:"'Times New Roman',serif", darkHeader:true },
    apex:      { sidebar:false, font:"'Calibri',sans-serif", colorHeader:true, headerBg:'linear-gradient(135deg,#1E3A5F,#2E5A8F)' },
    zenith:    { sidebar:false, font:"'Palatino Linotype',serif", ornate:true },
    catalyst:  { sidebar:true, sidebarBg:'#F7FBF8', sidebarColor:'#1A6B3C', font:"'Trebuchet MS',sans-serif", greenHeader:true },
    obsidian:  { sidebar:false, font:"'Garamond',serif", darkHeader:true },
    blueprint: { sidebar:true, sidebarBg:'#E8F0F8', sidebarColor:'#003366', font:"'Verdana',sans-serif", colorHeader:true, headerBg:'#003366' },
    cardinal:  { sidebar:false, font:"'Book Antiqua',serif" },
    visionary: { sidebar:true, sidebarBg:'#F8F4FF', sidebarColor:'#4B0082', font:"'Century Gothic',sans-serif", gradHeader:true, headerBg:'linear-gradient(135deg,#4B0082,#7B2FBE)' },
  };
  const s = styles[template] || styles.zenith;
  const accent = styleControls.accentColor;
  const bodyColor = styleControls.textColor;
  const bodySize = styleControls.fontSize;
  const nameSize = styleControls.nameSize;

  const fieldStyle = (base: any = {}) => ({ ...base, cursor:'text', borderRadius:3, transition:'background .15s', padding:'2px 4px' });

  const renderHeader = () => (
    <div>
      <div contentEditable suppressContentEditableWarning
        onInput={onFieldInput('fullName')} onBlur={onFieldBlur('fullName')}
        style={fieldStyle(s.centered || s.darkHeader || s.ornate
          ? { fontSize:nameSize, fontWeight:700, letterSpacing:s.ornate?6:s.darkHeader?5:4, textTransform:'uppercase' as const, margin:'0 0 8px', textAlign:s.centered||s.ornate?'center':'left', color:s.darkHeader?'#fff':'#1a1a1a', fontFamily:s.font }
          : { fontSize:nameSize-4, fontWeight:700, color:'#1a1a1a', margin:'0 0 4px', fontFamily:s.font }
        )}
      >{resume.fullName}</div>
      {s.ornate && <div style={{ width:60, height:3, background:accent, margin:'0 auto 12px', display:'block' }}/>}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, justifyContent:s.centered||s.ornate?'center':'flex-start' }}>
        {(['email','phone','location'] as const).map(f => (
          <span key={f} contentEditable suppressContentEditableWarning
            onInput={onFieldInput(f)} onBlur={onFieldBlur(f)}
            style={fieldStyle({ fontSize:11, color:s.darkHeader?'rgba(255,255,255,.8)':s.ornate?accent:'#555', fontFamily:s.font })}
          >{resume[f]}</span>
        ))}
      </div>
    </div>
  );

  const renderSection = (field: keyof ResumeData, label: string) => (
    <Section key={field} title={label} accent={accent} onAI={() => aiSuggest(field, label)} loading={aiLoading===field}>
      <div data-field={field} contentEditable suppressContentEditableWarning
        onInput={onFieldInput(field)} onBlur={onFieldBlur(field)}
        style={fieldStyle({ fontSize:bodySize, lineHeight:1.85, whiteSpace:'pre-wrap' as const, wordBreak:'break-word' as const, color:bodyColor, fontFamily:s.font, width:'100%' })}
      >{resume[field] || ''}</div>
    </Section>
  );

  const sidebarContent = () => s.sidebar ? (
    <div style={{ background:s.sidebarBg, padding:'28px 20px', color:s.sidebarColor }}>
      <Section title="Skills" accent={accent}>
        <div data-field="skills" contentEditable suppressContentEditableWarning onInput={onFieldInput('skills')} onBlur={onFieldBlur('skills')}
          style={fieldStyle({ fontSize:bodySize-1, lineHeight:1.8, color:s.sidebarColor||bodyColor, whiteSpace:'pre-wrap' as const })}
        >{resume.skills}</div>
      </Section>
      <Section title="Certifications" accent={accent}>
        <div data-field="certifications" contentEditable suppressContentEditableWarning onInput={onFieldInput('certifications')} onBlur={onFieldBlur('certifications')}
          style={fieldStyle({ fontSize:bodySize-1, lineHeight:1.8, color:s.sidebarColor||bodyColor, whiteSpace:'pre-wrap' as const })}
        >{resume.certifications}</div>
      </Section>
    </div>
  ) : null;

  const headerBg = () => {
    if (!s.darkHeader && !s.colorHeader && !s.gradHeader && !s.greenHeader) return null;
    const bg = s.darkHeader ? (s.sidebarBg || accent) : (s.headerBg || accent);
    return <div style={{ background:bg, padding:'32px 36px', gridColumn:'1/-1' }}>{renderHeader()}</div>;
  };

  const btn = (active=false): React.CSSProperties => ({
    display:'flex', alignItems:'center', gap:5, padding:'6px 11px',
    background: active ? DS.blue+'22' : 'transparent',
    border: `1px solid ${active ? DS.blue : DS.border}`,
    borderRadius:'.5rem', color: active ? DS.blue : DS.fm,
    fontSize:11, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' as const,
  });

  return (
    <div style={{ minHeight:'100vh', background:DS.bg, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", color:DS.fg }}>
      <Header />
      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'100vh', paddingTop:70 }}>
        <PortalSidebar />
        <main style={{ padding:'2rem', background:DS.bg, overflowX:'hidden', minWidth:0, width:'100%' }}>

          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.25rem', gap:'1rem', flexWrap:'wrap' as const }}>
            <div>
              <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:DS.fg, margin:0 }}>Resume Builder Studio</h1>
              <p style={{ fontSize:12, color:DS.fm, margin:'3px 0 0' }}>Click any text to edit · AI-powered · World-class templates</p>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
              <button onClick={undo} style={btn()}>↩ Undo</button>
              <button onClick={redo} style={btn()}>↪ Redo</button>
              <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleUpload} style={{ display:'none' }}/>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                style={{ ...btn(), background:'rgba(34,201,138,.12)', borderColor:'rgba(34,201,138,.3)', color:'#22C98A' }}>
                {uploading ? <Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/> : '📄'} {uploading ? 'Reading...' : 'Upload'}
              </button>
              <button onClick={() => { setShowStylePanel(p => !p); setShowTemplates(false); }} style={btn(showStylePanel)}>
                <Palette size={12}/> Style
              </button>
              <button onClick={() => { setShowTemplates(p => !p); setShowStylePanel(false); }} style={btn(showTemplates)}>
                <LayoutTemplate size={12}/> Templates
              </button>
              <button onClick={saveResume} disabled={saving}
                style={{ ...btn(saved), background:saved?'#22C98A22':DS.card, borderColor:saved?'#22C98A':DS.border, color:saved?'#22C98A':DS.fm }}>
                {saving?<Loader2 size={12} style={{ animation:'spin 1s linear infinite' }}/>:saved?<CheckCircle size={12}/>:<Save size={12}/>}
                {saved?'Saved!':'Save'}
              </button>
              <button onClick={downloadResume}
                style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:DS.blue, border:'none', borderRadius:'.5rem', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                <Download size={12}/> Download
              </button>
            </div>
          </div>

          {showStylePanel && (
            <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', padding:'1rem', marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:700, color:DS.fg }}>Style Controls</span>
                <button onClick={() => setShowStylePanel(false)} style={{ background:'none', border:'none', color:DS.fm, cursor:'pointer' }}><X size={14}/></button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <div style={{ fontSize:11, color:DS.fm, marginBottom:6, fontWeight:600 }}>Body font size: {styleControls.fontSize}px</div>
                  <input type="range" min={10} max={16} step={0.5} value={styleControls.fontSize}
                    onChange={e => setStyleControls(s => ({ ...s, fontSize: Number(e.target.value) }))} style={{ width:'100%' }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:DS.fm }}><span>Compact</span><span>Spacious</span></div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:DS.fm, marginBottom:6, fontWeight:600 }}>Name size: {styleControls.nameSize}px</div>
                  <input type="range" min={20} max={48} step={1} value={styleControls.nameSize}
                    onChange={e => setStyleControls(s => ({ ...s, nameSize: Number(e.target.value) }))} style={{ width:'100%' }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:DS.fm }}><span>Small</span><span>Large</span></div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:DS.fm, marginBottom:6, fontWeight:600 }}>Accent color</div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const, marginBottom:6 }}>
                    {ACCENT_PRESETS.map(c => (
                      <button key={c} onClick={() => setStyleControls(s => ({ ...s, accentColor: c }))}
                        style={{ width:22, height:22, borderRadius:4, background:c, border:`2px solid ${styleControls.accentColor===c?'#fff':'transparent'}`, cursor:'pointer', padding:0 }}/>
                    ))}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:10, color:DS.fm }}>Custom:</span>
                    <input type="color" value={styleControls.accentColor}
                      onChange={e => setStyleControls(s => ({ ...s, accentColor: e.target.value }))}
                      style={{ width:32, height:24, border:'none', background:'none', cursor:'pointer', padding:0 }}/>
                    <span style={{ fontSize:11, fontFamily:'monospace', color:DS.fm }}>{styleControls.accentColor}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:DS.fm, marginBottom:6, fontWeight:600 }}>Text color</div>
                  <div style={{ display:'flex', gap:5, marginBottom:6 }}>
                    {['#111111','#333333','#444444','#2c2c2c','#1a1a2e','#0d1b2a'].map(c => (
                      <button key={c} onClick={() => setStyleControls(s => ({ ...s, textColor: c }))}
                        style={{ width:22, height:22, borderRadius:4, background:c, border:`2px solid ${styleControls.textColor===c?'#fff':'transparent'}`, cursor:'pointer', padding:0 }}/>
                    ))}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:10, color:DS.fm }}>Custom:</span>
                    <input type="color" value={styleControls.textColor}
                      onChange={e => setStyleControls(s => ({ ...s, textColor: e.target.value }))}
                      style={{ width:32, height:24, border:'none', background:'none', cursor:'pointer', padding:0 }}/>
                    <span style={{ fontSize:11, fontFamily:'monospace', color:DS.fm }}>{styleControls.textColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showTemplates && (
            <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', padding:'1rem', marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:700, color:DS.fg }}>Executive Templates</span>
                <button onClick={() => setShowTemplates(false)} style={{ background:'none', border:'none', color:DS.fm, cursor:'pointer' }}><X size={16}/></button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => { setTemplate(t.id); setShowTemplates(false); setStyleControls(sc => ({ ...sc, accentColor: t.accent })); }}
                    style={{ padding:'10px 12px', background:template===t.id?t.accent+'22':DS.bg, border:`2px solid ${template===t.id?t.accent:DS.border}`, borderRadius:'.5rem', cursor:'pointer', textAlign:'left' as const }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:t.accent }}/>
                      <span style={{ fontSize:11, fontWeight:700, color:template===t.id?t.accent:DS.fg }}>{t.name}</span>
                    </div>
                    <p style={{ fontSize:9, color:DS.fm, margin:0, lineHeight:1.4 }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {uploadMsg && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', padding:'8px 14px', background: uploadMsg.startsWith('✓') ? 'rgba(34,201,138,.1)' : 'rgba(74,144,245,.1)', border:`1px solid ${uploadMsg.startsWith('✓')?'rgba(34,201,138,.3)':'rgba(74,144,245,.2)'}`, borderRadius:'.5rem' }}>
              <span style={{ fontSize:13 }}>{uploadMsg.startsWith('✓') ? '✅' : '⏳'}</span>
              <p style={{ fontSize:12, color: uploadMsg.startsWith('✓') ? '#22C98A' : DS.blue, margin:0 }}>{uploadMsg}</p>
            </div>
          )}

          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', padding:'8px 14px', background:'rgba(74,144,245,.08)', border:'1px solid rgba(74,144,245,.2)', borderRadius:'.5rem' }}>
            <span style={{ fontSize:16 }}>✏️</span>
            <p style={{ fontSize:12, color:DS.blue, margin:0 }}><strong>Click any text</strong> to edit · ✨ AI buttons generate content · Style panel for fonts, sizes & colors</p>
          </div>

          <div id="resume-doc" style={{ background:'#fff', boxShadow:'0 4px 40px rgba(0,0,0,.25)', borderRadius:8, overflow:'hidden', fontFamily:s.font, maxWidth:'100%', width:'100%' }}>
            {(s.darkHeader||s.colorHeader||s.gradHeader||s.greenHeader) && headerBg()}
            {s.greenHeader && <div style={{ height:4, background:'linear-gradient(90deg,#1A6B3C,#52C47C,#F5B81A)' }}/>}
            <div style={{ display:'grid', gridTemplateColumns:s.sidebar?(template==='prestige'?'220px 1fr':'1fr 240px'):'1fr' }}>
              {template==='prestige' && sidebarContent()}
              <div style={{ padding:s.sidebar||s.darkHeader||s.colorHeader||s.gradHeader||s.greenHeader?'28px':'0' }}>
                {(!s.sidebar&&!s.darkHeader&&!s.colorHeader&&!s.gradHeader&&!s.greenHeader) && (
                  <div style={{ padding:'0 0 20px', marginBottom:20, borderBottom:`2px solid ${accent}`, ...(s.centered||s.ornate?{textAlign:'center' as const}:{}) }}>
                    {renderHeader()}
                  </div>
                )}
                {resume.summary && renderSection('summary', s.ornate?'Executive Profile':'Professional Summary')}
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

          <p style={{ fontSize:11, color:DS.fm, textAlign:'center' as const, marginTop:12 }}>All changes save automatically · Click Download to export</p>
        </main>
      </div>
    </div>
  );
};

export default ResumeStudio;
