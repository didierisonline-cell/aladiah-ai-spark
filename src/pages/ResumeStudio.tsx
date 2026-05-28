import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BackToPortal from '@/components/portal/BackToPortal';
import { Save, Download, Sparkles, CheckCircle, Loader2, FileText, LayoutTemplate } from 'lucide-react';

interface ResumeData {
  fullName: string; email: string; phone: string; location: string;
  summary: string; experience: string; education: string;
  skills: string; certifications: string; projects: string;
}

const EMPTY: ResumeData = {
  fullName:'', email:'', phone:'', location:'',
  summary:'', experience:'', education:'',
  skills:'', certifications:'', projects:'',
};

const TEMPLATES = [
  {
    id:'classic', name:'Classic', accent:'#1a1a2e',
    desc:'Clean, ATS-friendly, traditional format',
    render: (d: ResumeData) => `
      <div style="font-family:Georgia,serif;max-width:720px;margin:0 auto;padding:40px;color:#1a1a2e;background:#fff;">
        <div style="text-align:center;border-bottom:2px solid #1a1a2e;padding-bottom:16px;margin-bottom:20px;">
          <h1 style="font-size:28px;font-weight:700;margin:0 0 4px">${d.fullName||'Your Name'}</h1>
          <p style="margin:0;font-size:13px;color:#444">${[d.email,d.phone,d.location].filter(Boolean).join(' • ')}</p>
        </div>
        ${d.summary?`<div style="margin-bottom:18px"><h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px">Professional Summary</h2><p style="font-size:13px;line-height:1.7;margin:0">${d.summary}</p></div>`:''}
        ${d.experience?`<div style="margin-bottom:18px"><h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px">Experience</h2><p style="font-size:13px;line-height:1.7;white-space:pre-wrap;margin:0">${d.experience}</p></div>`:''}
        ${d.education?`<div style="margin-bottom:18px"><h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px">Education</h2><p style="font-size:13px;line-height:1.7;white-space:pre-wrap;margin:0">${d.education}</p></div>`:''}
        ${d.skills?`<div style="margin-bottom:18px"><h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px">Skills</h2><p style="font-size:13px;line-height:1.7;margin:0">${d.skills}</p></div>`:''}
        ${d.certifications?`<div style="margin-bottom:18px"><h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px">Certifications</h2><p style="font-size:13px;line-height:1.7;margin:0">${d.certifications}</p></div>`:''}
        ${d.projects?`<div style="margin-bottom:18px"><h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px">Projects</h2><p style="font-size:13px;line-height:1.7;white-space:pre-wrap;margin:0">${d.projects}</p></div>`:''}
      </div>`
  },
  {
    id:'modern', name:'Modern', accent:'#4A90F5',
    desc:'Bold header, contemporary design',
    render: (d: ResumeData) => `
      <div style="font-family:'Segoe UI',sans-serif;max-width:720px;margin:0 auto;background:#fff;color:#1a1a2e;">
        <div style="background:linear-gradient(135deg,#4A90F5,#1a5fb4);padding:32px 40px;color:#fff;">
          <h1 style="font-size:32px;font-weight:800;margin:0 0 6px">${d.fullName||'Your Name'}</h1>
          <p style="margin:0;font-size:13px;opacity:.9">${[d.email,d.phone,d.location].filter(Boolean).join(' | ')}</p>
        </div>
        <div style="padding:32px 40px;">
          ${d.summary?`<div style="margin-bottom:22px"><h2 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#4A90F5;margin-bottom:8px">Summary</h2><p style="font-size:13px;line-height:1.8;margin:0;color:#333">${d.summary}</p></div>`:''}
          ${d.experience?`<div style="margin-bottom:22px"><h2 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#4A90F5;margin-bottom:8px">Experience</h2><p style="font-size:13px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333">${d.experience}</p></div>`:''}
          ${d.education?`<div style="margin-bottom:22px"><h2 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#4A90F5;margin-bottom:8px">Education</h2><p style="font-size:13px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333">${d.education}</p></div>`:''}
          ${d.skills?`<div style="margin-bottom:22px"><h2 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#4A90F5;margin-bottom:8px">Skills</h2><div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.replace(/\n/g,',').split(',').filter((s:string)=>s.trim()).map((s:string)=>`<span style="background:#e8f0fe;color:#1a5fb4;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600">${s.trim()}</span>`).join('')}}</div></div>`:''}
          ${d.certifications?`<div style="margin-bottom:22px"><h2 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#4A90F5;margin-bottom:8px">Certifications</h2><p style="font-size:13px;line-height:1.8;margin:0;color:#333">${d.certifications}</p></div>`:''}
          ${d.projects?`<div style="margin-bottom:22px"><h2 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#4A90F5;margin-bottom:8px">Projects</h2><p style="font-size:13px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333">${d.projects}</p></div>`:''}
        </div>
      </div>`
  },
  {
    id:'executive', name:'Executive', accent:'#C4A44A',
    desc:'Premium look for senior roles',
    render: (d: ResumeData) => `
      <div style="font-family:'Times New Roman',serif;max-width:720px;margin:0 auto;background:#fff;color:#2c2c2c;">
        <div style="border-top:5px solid #C4A44A;padding:36px 44px 20px;text-align:center;border-bottom:1px solid #e0d0a0;">
          <h1 style="font-size:30px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;color:#1a1a1a">${d.fullName||'Your Name'}</h1>
          <p style="margin:0;font-size:12px;letter-spacing:1px;color:#666">${[d.email,d.phone,d.location].filter(Boolean).join('  ·  ')}</p>
        </div>
        <div style="padding:28px 44px;">
          ${d.summary?`<div style="margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid #f0e8d0"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#C4A44A;margin-bottom:10px">Executive Profile</h2><p style="font-size:13px;line-height:1.9;margin:0;font-style:italic">${d.summary}</p></div>`:''}
          ${d.experience?`<div style="margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid #f0e8d0"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#C4A44A;margin-bottom:10px">Professional Experience</h2><p style="font-size:13px;line-height:1.9;white-space:pre-wrap;margin:0">${d.experience}</p></div>`:''}
          ${d.education?`<div style="margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid #f0e8d0"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#C4A44A;margin-bottom:10px">Education</h2><p style="font-size:13px;line-height:1.9;white-space:pre-wrap;margin:0">${d.education}</p></div>`:''}
          ${d.skills?`<div style="margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid #f0e8d0"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#C4A44A;margin-bottom:10px">Core Competencies</h2><p style="font-size:13px;line-height:1.9;margin:0">${d.skills}</p></div>`:''}
          ${d.certifications?`<div style="margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid #f0e8d0"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#C4A44A;margin-bottom:10px">Credentials & Certifications</h2><p style="font-size:13px;line-height:1.9;margin:0">${d.certifications}</p></div>`:''}
          ${d.projects?`<div style="margin-bottom:22px"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#C4A44A;margin-bottom:10px">Key Projects</h2><p style="font-size:13px;line-height:1.9;white-space:pre-wrap;margin:0">${d.projects}</p></div>`:''}
        </div>
      </div>`
  },
];

const TABS = [
  { id:'personal', label:'Personal', icon:'👤', fields:[
    {key:'fullName', label:'Full Name', ph:'John Doe', type:'input'},
    {key:'email', label:'Email', ph:'john@example.com', type:'input'},
    {key:'phone', label:'Phone', ph:'+1 (555) 000-0000', type:'input'},
    {key:'location', label:'Location', ph:'New York, NY', type:'input'},
  ]},
  { id:'summary', label:'Summary', icon:'📝', fields:[
    {key:'summary', label:'Professional Summary', ph:'Write a compelling 2-3 sentence summary highlighting your Scrum Master qualifications, years of experience, and key achievements...', type:'textarea'},
  ]},
  { id:'experience', label:'Experience', icon:'💼', fields:[
    {key:'experience', label:'Work Experience', ph:'Scrum Master @ Company (2022-Present)\n• Led 3 cross-functional squads of 8-12 engineers\n• Reduced sprint velocity variance by 40%\n• Facilitated 200+ sprint ceremonies\n\nJunior Scrum Master @ Company (2020-2022)\n• Coached 2 teams in Agile transformation...', type:'textarea'},
  ]},
  { id:'education', label:'Education', icon:'🎓', fields:[
    {key:'education', label:'Education', ph:'B.S. Computer Science — University Name (2020)\nAgile Project Management Certificate — Aladiah Academy (2024)', type:'textarea'},
    {key:'projects', label:'Key Projects', ph:'AI-Powered Sprint Planning Tool\n• Built dashboard for tracking sprint velocity across 5 teams\n• Technologies: React, Python, Jira API', type:'textarea'},
  ]},
  { id:'skills', label:'Skills & Certs', icon:'🏅', fields:[
    {key:'skills', label:'Skills', ph:'Scrum, Kanban, SAFe, Jira, Confluence, Azure DevOps, Facilitation, Stakeholder Management, Risk Management, Agile Coaching', type:'textarea'},
    {key:'certifications', label:'Certifications', ph:'PSM I (Scrum.org, 2024), CSM (Scrum Alliance, 2023), PMI-ACP, SAFe 6 Agilist, Aladiah Academy Certified™', type:'textarea'},
  ]},
];

const DS = { bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD', blue:'#4A90F5' };

const ResumeStudio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeData>(EMPTY);
  const [template, setTemplate] = useState('modern');
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMsg, setAiMsg] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';
  const tpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[1];

  useEffect(() => { if (user) loadResume(); }, [user]);

  const loadResume = async () => {
    const { data } = await (supabase as any)
      .from('ai_conversations')
      .select('content')
      .eq('user_id', user!.id)
      .eq('role', 'resume_data')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data?.content) {
      try { 
        const parsed = JSON.parse(data.content);
        setResume({ ...EMPTY, ...parsed });
        if (parsed._template) setTemplate(parsed._template);
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
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${resume.fullName || 'Resume'}</title><style>@media print{body{margin:0}}</style></head><body>${tpl.render(resume)}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(resume.fullName || 'resume').replace(/ /g,'_')}_resume.html`;
    a.click();
  };

  const aiSuggest = async (field: string) => {
    setAiLoading(true); setAiMsg('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:500,
          messages:[{ role:'user', content:`You are an expert resume writer. Write a strong ${field} for a Scrum Master resume. The person's name is ${resume.fullName||'the student'}. Their experience: ${resume.experience||'not provided yet'}. Return ONLY the ${field} text, no preamble.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      setResume(r => ({ ...r, [field === 'Professional Summary' ? 'summary' : field.toLowerCase()]: text }));
      setAiMsg(`✓ AI generated ${field}`);
    } catch { setAiMsg('AI suggestion failed — try again'); }
    setAiLoading(false);
    setTimeout(() => setAiMsg(''), 4000);
  };

  const update = (key: keyof ResumeData, val: string) => setResume(r => ({ ...r, [key]: val }));

  const currentTab = TABS.find(t => t.id === activeTab)!;

  return (
    <div style={{ minHeight:'100vh', background:DS.bg, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <Header />
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'80px 1.5rem 2rem' }}>
        <BackToPortal />

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:DS.fg, margin:0 }}>Resume Builder Studio</h1>
            <p style={{ fontSize:13, color:DS.fm, margin:'4px 0 0' }}>AI-powered resume builder for {firstName}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setShowTemplates(!showTemplates)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:showTemplates?DS.blue+'22':'transparent', border:'1px solid '+(showTemplates?DS.blue:DS.border), borderRadius:'.5rem', color:showTemplates?DS.blue:DS.fm, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <LayoutTemplate size={15}/> Templates
            </button>
            <button onClick={saveResume} disabled={saving}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:saved?'#22C98A22':DS.card, border:'1px solid '+(saved?'#22C98A':DS.border), borderRadius:'.5rem', color:saved?'#22C98A':DS.fm, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              {saving?<Loader2 size={14} className="animate-spin"/>:saved?<CheckCircle size={14}/>:<Save size={14}/>}
              {saved?'Saved!':'Save'}
            </button>
            <button onClick={downloadResume}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:DS.blue, border:'none', borderRadius:'.5rem', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              <Download size={14}/> Download
            </button>
          </div>
        </div>

        {/* Template picker */}
        {showTemplates && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:'1.5rem' }}>
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => { setTemplate(t.id); setShowTemplates(false); }}
                style={{ padding:'1rem', background:template===t.id?t.accent+'22':DS.card, border:'2px solid '+(template===t.id?t.accent:DS.border), borderRadius:'.75rem', cursor:'pointer', textAlign:'left' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:16, height:16, borderRadius:4, background:t.accent }}/>
                  <span style={{ fontSize:14, fontWeight:700, color:DS.fg }}>{t.name}</span>
                  {template===t.id && <span style={{ fontSize:10, color:t.accent, fontWeight:700, marginLeft:'auto' }}>ACTIVE</span>}
                </div>
                <p style={{ fontSize:11, color:DS.fm, margin:0 }}>{t.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Main 2-col layout */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'start' }}>

          {/* LEFT: Editor */}
          <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden' }}>
            {/* Tab bar */}
            <div style={{ display:'flex', borderBottom:`1px solid ${DS.border}`, overflowX:'auto' as const }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ flex:1, padding:'10px 8px', background:activeTab===tab.id?DS.blue+'22':'transparent', border:'none', borderBottom:activeTab===tab.id?`2px solid ${DS.blue}`:'2px solid transparent', color:activeTab===tab.id?DS.blue:DS.fm, fontSize:11, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' as const, transition:'all .15s' }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column' as const, gap:'1rem' }}>
              {currentTab.fields.map(f => (
                <div key={f.key}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:DS.fm, textTransform:'uppercase' as const, letterSpacing:'.5px' }}>{f.label}</label>
                    {f.type==='textarea' && (
                      <button onClick={() => aiSuggest(f.label)} disabled={aiLoading}
                        style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, fontWeight:700, color:DS.blue, background:DS.blue+'15', border:'none', borderRadius:99, padding:'3px 9px', cursor:'pointer' }}>
                        {aiLoading?<Loader2 size={10} className="animate-spin"/>:<Sparkles size={10}/>} AI Suggest
                      </button>
                    )}
                  </div>
                  {f.type==='input' ? (
                    <input value={resume[f.key as keyof ResumeData]} onChange={e => update(f.key as keyof ResumeData, e.target.value)}
                      placeholder={f.ph}
                      style={{ width:'100%', background:'#0B111E', border:`1px solid ${DS.border}`, borderRadius:'.45rem', padding:'9px 12px', color:DS.fg, fontSize:13, outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }}/>
                  ) : (
                    <textarea value={resume[f.key as keyof ResumeData]} onChange={e => update(f.key as keyof ResumeData, e.target.value)}
                      placeholder={f.ph} rows={f.key==='summary'?4:6}
                      style={{ width:'100%', background:'#0B111E', border:`1px solid ${DS.border}`, borderRadius:'.45rem', padding:'9px 12px', color:DS.fg, fontSize:13, outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, fontFamily:'inherit', lineHeight:1.6 }}/>
                  )}
                </div>
              ))}
              {aiMsg && <p style={{ fontSize:12, color:'#22C98A', margin:0 }}>{aiMsg}</p>}

              {/* Tab navigation */}
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                {TABS.findIndex(t=>t.id===activeTab) > 0 && (
                  <button onClick={() => setActiveTab(TABS[TABS.findIndex(t=>t.id===activeTab)-1].id)}
                    style={{ fontSize:12, color:DS.fm, background:'transparent', border:`1px solid ${DS.border}`, borderRadius:'.4rem', padding:'6px 14px', cursor:'pointer' }}>
                    ← Back
                  </button>
                )}
                {TABS.findIndex(t=>t.id===activeTab) < TABS.length-1 && (
                  <button onClick={() => setActiveTab(TABS[TABS.findIndex(t=>t.id===activeTab)+1].id)}
                    style={{ fontSize:12, color:'#fff', background:DS.blue, border:'none', borderRadius:'.4rem', padding:'6px 14px', cursor:'pointer', marginLeft:'auto' }}>
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden', position:'sticky' as const, top:'5rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:`1px solid ${DS.border}`, background:'rgba(255,255,255,.02)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <FileText size={13} color={DS.fm}/>
                <span style={{ fontSize:12, fontWeight:700, color:DS.fm, textTransform:'uppercase' as const, letterSpacing:'.5px' }}>Live Preview</span>
                <span style={{ fontSize:10, color:tpl.accent, fontWeight:700, padding:'1px 7px', borderRadius:99, background:tpl.accent+'22', border:`1px solid ${tpl.accent}40` }}>{tpl.name}</span>
              </div>
              <span style={{ fontSize:10, color:DS.fm }}>Updates as you type</span>
            </div>
            <div style={{ height:'70vh', overflowY:'auto' as const, background:'#f5f5f0' }}>
              <div dangerouslySetInnerHTML={{ __html: tpl.render(resume) }}/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeStudio;
