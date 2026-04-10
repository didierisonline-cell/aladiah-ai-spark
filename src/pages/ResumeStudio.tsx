import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BackToPortal from '@/components/portal/BackToPortal';
import {
  ArrowLeft, FileText, Sparkles, Download, Save, Loader2,
  User, Briefcase, GraduationCap, Award, Bot, Send
} from 'lucide-react';

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  certifications: string;
  projects: string;
}

const defaultResume: ResumeData = {
  fullName: '', email: '', phone: '', location: '',
  summary: '', experience: '', education: '', skills: '',
  certifications: '', projects: '',
};

const ResumeStudio = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasFeature } = useSubscription();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  // Load saved resume from ai_conversations
  useEffect(() => {
    if (user) loadResume();
  }, [user]);

  const loadResume = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('ai_conversations')
      .select('context')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (data?.[0]?.context && typeof data[0].context === 'object') {
      const ctx = data[0].context as any;
      if (ctx.resumeData) setResume(ctx.resumeData);
    }
  };

  const saveResume = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const payload = {
        user_id: user.id,
        context: { resumeData: resume } as any,
        messages: [] as any,
        updated_at: new Date().toISOString(),
      };

      if (existing?.length) {
        await supabase.from('ai_conversations').update(payload).eq('id', existing[0].id);
      } else {
        await supabase.from('ai_conversations').insert(payload);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && Object.values(resume).some(v => v.trim())) saveResume();
    }, 3000);
    return () => clearTimeout(timer);
  }, [resume]);

  const askAI = useCallback(async (prompt: string) => {
    setAiLoading(true);
    setAiSuggestion('');
    try {
      const fullPrompt = `You are an expert resume coach for Junior Scrum Master roles. The student has this resume data: ${JSON.stringify(resume)}. ${prompt}. Provide specific, actionable suggestions. Use bullet points and be concise. Focus on making them competitive for entry-level Scrum Master positions.`;

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: fullPrompt }],
          studentContext: { mode: 'resume_studio' },
          mode: 'career_assist',
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Failed');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') continue;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { full += content; setAiSuggestion(full); }
          } catch {}
        }
      }
    } catch {
      setAiSuggestion('Something went wrong. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }, [resume]);

  const downloadResume = () => {
    const text = `
${resume.fullName}
${resume.email} | ${resume.phone} | ${resume.location}

PROFESSIONAL SUMMARY
${resume.summary}

EXPERIENCE
${resume.experience}

EDUCATION
${resume.education}

SKILLS
${resume.skills}

CERTIFICATIONS
${resume.certifications}

PROJECTS
${resume.projects}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.fullName || 'resume'}_ScrumMaster.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const update = (field: keyof ResumeData, value: string) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const sections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Certs', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <BackToPortal />
        {!hasFeature('resume_builder') ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">AI Resume Builder</h2>
            <p className="text-muted-foreground mb-6">Access your AI Resume Builder below.</p>
            <Button variant="coral" onClick={() => navigate('/pricing')}>View Plans</Button>
          </div>
        ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/portal')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-display font-bold">Resume Builder Studio</h1>
                <p className="text-sm text-muted-foreground">AI-powered resume builder for {firstName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saved && <Badge variant="default" className="text-xs">Saved ✓</Badge>}
              <Button variant="outline" size="sm" onClick={saveResume} disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button size="sm" onClick={downloadResume}>
                <Download className="w-4 h-4 mr-1" /> Download
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-4">
              <Tabs value={activeSection} onValueChange={setActiveSection}>
                <TabsList className="grid grid-cols-5 w-full">
                  {sections.map(s => (
                    <TabsTrigger key={s.id} value={s.id} className="text-xs gap-1">
                      <s.icon className="w-3 h-3" />{s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="personal">
                  <Card className="p-6 space-y-4">
                    <h3 className="font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Full Name" value={resume.fullName} onChange={e => update('fullName', e.target.value)} />
                      <Input placeholder="Email" value={resume.email} onChange={e => update('email', e.target.value)} />
                      <Input placeholder="Phone" value={resume.phone} onChange={e => update('phone', e.target.value)} />
                      <Input placeholder="Location" value={resume.location} onChange={e => update('location', e.target.value)} />
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="summary">
                  <Card className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Professional Summary</h3>
                      <Button variant="outline" size="sm" onClick={() => askAI('Write a compelling professional summary for a junior Scrum Master resume based on my info')}>
                        <Sparkles className="w-3 h-3 mr-1" /> AI Suggest
                      </Button>
                    </div>
                    <Textarea placeholder="Write a compelling summary highlighting your Scrum Master qualifications..." value={resume.summary} onChange={e => update('summary', e.target.value)} className="min-h-[150px]" />
                  </Card>
                </TabsContent>

                <TabsContent value="experience">
                  <Card className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Work Experience</h3>
                      <Button variant="outline" size="sm" onClick={() => askAI('Help me write strong experience bullet points with action verbs and quantifiable achievements for a Scrum Master role')}>
                        <Sparkles className="w-3 h-3 mr-1" /> AI Suggest
                      </Button>
                    </div>
                    <Textarea placeholder="List your experience. Use action verbs and quantify achievements..." value={resume.experience} onChange={e => update('experience', e.target.value)} className="min-h-[200px]" />
                  </Card>
                </TabsContent>

                <TabsContent value="education">
                  <Card className="p-6 space-y-4">
                    <h3 className="font-semibold">Education</h3>
                    <Textarea placeholder="List your degrees, schools, and graduation dates..." value={resume.education} onChange={e => update('education', e.target.value)} className="min-h-[120px]" />
                    <h3 className="font-semibold">Projects</h3>
                    <Textarea placeholder="Describe relevant projects (Scrum simulations, team projects, etc.)..." value={resume.projects} onChange={e => update('projects', e.target.value)} className="min-h-[120px]" />
                  </Card>
                </TabsContent>

                <TabsContent value="skills">
                  <Card className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Skills</h3>
                      <Button variant="outline" size="sm" onClick={() => askAI('Suggest the best skills to list for a Junior Scrum Master resume, including technical and soft skills')}>
                        <Sparkles className="w-3 h-3 mr-1" /> AI Suggest
                      </Button>
                    </div>
                    <Textarea placeholder="Scrum, Agile, Jira, Kanban, Sprint Planning, Facilitation..." value={resume.skills} onChange={e => update('skills', e.target.value)} className="min-h-[100px]" />
                    <h3 className="font-semibold">Certifications</h3>
                    <Textarea placeholder="PSM I, CSM, SAFe Agilist, Aladiah Academy Certificate..." value={resume.certifications} onChange={e => update('certifications', e.target.value)} className="min-h-[100px]" />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* AI Sidebar */}
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm">AI Resume Coach</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Ask for suggestions tailored to Junior Scrum Master roles</p>

                <div className="space-y-2">
                  {['Improve my summary', 'Suggest action verbs', 'Review my whole resume', 'ATS optimization tips'].map(q => (
                    <Button key={q} variant="outline" size="sm" className="w-full text-xs justify-start" onClick={() => askAI(q)}>
                      <Sparkles className="w-3 h-3 mr-1 text-accent" /> {q}
                    </Button>
                  ))}
                </div>

                <form onSubmit={e => { e.preventDefault(); if (aiInput.trim()) { askAI(aiInput); setAiInput(''); }}} className="flex gap-2 mt-3">
                  <Input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask anything..." className="text-xs" />
                  <Button type="submit" size="icon" className="h-9 w-9" disabled={aiLoading}>
                    <Send className="w-3 h-3" />
                  </Button>
                </form>
              </Card>

              {(aiSuggestion || aiLoading) && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-accent" /> AI Suggestions
                  </h4>
                  <ScrollArea className="max-h-[300px]">
                    {aiLoading && !aiSuggestion ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" /> Generating suggestions...
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-xs">
                        <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
                      </div>
                    )}
                  </ScrollArea>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
        )}
      </main>
    </div>
  );
};

export default ResumeStudio;
