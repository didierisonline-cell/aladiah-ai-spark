import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Briefcase, FileText, Linkedin, Sparkles, Send, Loader2,
  CheckCircle, Clock, Users, MessageCircle, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CareerToolsProps {
  overallProgress: number;
  onSwitchToAssistant: (prompt: string) => void;
}

const CareerTools = ({ overallProgress, onSwitchToAssistant }: CareerToolsProps) => {
  const navigate = useNavigate();
  const [resumeInput, setResumeInput] = useState('');
  const [linkedinInput, setLinkedinInput] = useState('');
  const [resumeResult, setResumeResult] = useState('');
  const [linkedinResult, setLinkedinResult] = useState('');
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingLinkedin, setLoadingLinkedin] = useState(false);

  const generateContent = async (type: 'resume' | 'linkedin') => {
    const input = type === 'resume' ? resumeInput : linkedinInput;
    const setLoading = type === 'resume' ? setLoadingResume : setLoadingLinkedin;
    const setResult = type === 'resume' ? setResumeResult : setLinkedinResult;

    if (!input.trim()) return;
    setLoading(true);
    setResult('');

    try {
      const prompt = type === 'resume'
        ? `Help me create a top-notch Scrum Master resume. Here's my background: ${input}. Create a professional resume highlighting Scrum Master and Agile expertise. Include strong action verbs, quantifiable achievements, and relevant certifications.`
        : `Help me optimize my LinkedIn profile for a Scrum Master/PM role. Here's my current situation: ${input}. Provide an optimized headline, summary, skills section, and tips for visibility.`;

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          studentContext: {
            courseProgress: overallProgress,
            certifications: overallProgress >= 100 ? ['Aladiah Scrum Master'] : [],
          },
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
            if (content) {
              full += content;
              setResult(full);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.error('Career tool error:', e);
      setResult('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Career Roadmap */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Career Roadmap</h3>
              <p className="text-xs text-muted-foreground">AI-powered career growth plan</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Scrum Fundamentals', done: overallProgress >= 20 },
              { label: 'Complete 50% of coursework', done: overallProgress >= 50 },
              { label: 'Sprint Simulation', done: false },
              { label: 'Resume & LinkedIn Optimization', done: false },
              { label: 'Job Placement Readiness', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                {step.done ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                <span className={step.done ? 'line-through text-muted-foreground' : ''}>{step.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Resume Builder */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">AI Resume Builder</h3>
              <p className="text-xs text-muted-foreground">Create a top-notch Scrum Master resume</p>
            </div>
          </div>
          <Textarea
            value={resumeInput}
            onChange={e => setResumeInput(e.target.value)}
            placeholder="Describe your experience, skills, and career goals..."
            className="text-sm min-h-[80px]"
          />
          <Button onClick={() => generateContent('resume')} disabled={loadingResume || !resumeInput.trim()} className="w-full gap-1">
            {loadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Resume
          </Button>
          {resumeResult && (
            <ScrollArea className="h-48 rounded border p-3">
              <pre className="text-xs whitespace-pre-wrap font-sans">{resumeResult}</pre>
            </ScrollArea>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* LinkedIn Optimizer */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">LinkedIn Optimizer</h3>
              <p className="text-xs text-muted-foreground">AI-powered profile optimization</p>
            </div>
          </div>
          <Textarea
            value={linkedinInput}
            onChange={e => setLinkedinInput(e.target.value)}
            placeholder="Paste your current LinkedIn summary or describe your target role..."
            className="text-sm min-h-[80px]"
          />
          <Button onClick={() => generateContent('linkedin')} disabled={loadingLinkedin || !linkedinInput.trim()} className="w-full gap-1">
            {loadingLinkedin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Optimize LinkedIn
          </Button>
          {linkedinResult && (
            <ScrollArea className="h-48 rounded border p-3">
              <pre className="text-xs whitespace-pre-wrap font-sans">{linkedinResult}</pre>
            </ScrollArea>
          )}
        </Card>

        {/* Connect with Students */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold">Connect with Students</h3>
              <p className="text-xs text-muted-foreground">Find study partners worldwide</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Collaborate with fellow students from around the globe. Share knowledge, practice together, and grow your professional network.</p>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/community')} className="flex-1 gap-1">
              <MessageCircle className="w-4 h-4" /> Community
            </Button>
            <Button variant="outline" onClick={() => onSwitchToAssistant('Help me find study partners who are at a similar level in their Scrum Master journey')} className="flex-1 gap-1">
              <Sparkles className="w-4 h-4" /> AI Match
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CareerTools;
