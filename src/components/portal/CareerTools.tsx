import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase, FileText, Linkedin, Sparkles, Loader2,
  CheckCircle, Clock, Users, MessageCircle, ArrowRight, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Lock } from 'lucide-react';

interface CareerToolsProps {
  overallProgress: number;
  onSwitchToAssistant: (prompt: string) => void;
}

interface SavedResume {
  id: string;
  fullName: string;
  updatedAt: string;
}

// All features unlocked — single $99.99/month plan
const TierLock = ({ children }: { feature?: string; children: React.ReactNode; tierName?: string }) => {
  return <>{children}</>;
};

const CareerTools = ({ overallProgress, onSwitchToAssistant }: CareerToolsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [linkedinInput, setLinkedinInput] = useState('');
  const [linkedinResult, setLinkedinResult] = useState('');
  const [loadingLinkedin, setLoadingLinkedin] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);

  // Load saved resumes from ai_conversations
  useEffect(() => {
    if (!user) return;
    const loadSavedResumes = async () => {
      const { data } = await supabase
        .from('ai_conversations')
        .select('id, context, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(3);

      if (data) {
        const resumes: SavedResume[] = data
          .filter((d: any) => {
            const ctx = d.context as any;
            return ctx?.resumeData;
          })
          .map((d: any) => ({
            id: d.id,
            fullName: (d.context as any)?.resumeData?.fullName || 'Untitled Resume',
            updatedAt: d.updated_at,
          }));
        setSavedResumes(resumes);
      }
    };
    loadSavedResumes();
  }, [user]);

  // Career roadmap milestones with dynamic progress
  const roadmapSteps = [
    { label: 'Scrum Fundamentals', threshold: 20, pct: Math.min(100, (overallProgress / 20) * 100) },
    { label: 'Complete Coursework', threshold: 100, pct: Math.min(100, overallProgress) },
    { label: 'Sprint Simulation', threshold: 0, pct: 0 }, // would need sim data
    { label: 'Resume & LinkedIn Optimization', threshold: 0, pct: 0 },
    { label: 'Job Placement Readiness', threshold: 0, pct: 0 },
  ];

  const generateLinkedin = async () => {
    if (!linkedinInput.trim()) return;
    setLoadingLinkedin(true);
    setLinkedinResult('');

    try {
      const prompt = `Help me optimize my LinkedIn profile for a Scrum Master/PM role. Here's my current situation: ${linkedinInput}. Provide an optimized headline, summary, skills section, and tips for visibility.`;

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
              setLinkedinResult(full);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.error('Career tool error:', e);
      setLinkedinResult('Something went wrong. Please try again.');
    } finally {
      setLoadingLinkedin(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Career Roadmap with progress bars */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Career Roadmap</h3>
              <p className="text-xs text-muted-foreground">Track your path to career readiness</p>
            </div>
          </div>
          <div className="space-y-3">
            {roadmapSteps.map((step, i) => {
              const isComplete = step.pct >= 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isComplete ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${isComplete ? 'font-medium' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.round(step.pct)}%</span>
                  </div>
                  <div className="relative h-6 rounded-md overflow-hidden bg-muted/50 border">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/80 rounded-md transition-all duration-500"
                      style={{ width: `${step.pct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-medium mix-blend-difference text-white">
                        {step.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Resume Builder - Links to Studio (Tier 2+) */}
        <TierLock feature="resume_builder" tierName="Accelerator">
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">AI Resume Builder</h3>
              <p className="text-xs text-muted-foreground">Build a professional Scrum Master resume</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter our full Resume Builder Studio with AI-powered suggestions, templates, and auto-save. Build, edit, and download your resume anytime.
          </p>
          <Button onClick={() => navigate('/resume-studio')} className="w-full gap-2">
            <FileText className="w-4 h-4" />
            Open Resume Builder Studio
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Saved Resumes Box */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <History className="w-3 h-3" />
              <span>Saved Resumes</span>
            </div>
            {savedResumes.length > 0 ? (
              <div className="space-y-1.5">
                {savedResumes.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => navigate('/resume-studio')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
                  >
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block truncate">
                        {r.fullName || 'Untitled Resume'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {i === 0 && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">Latest</Badge>
                    )}
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => navigate('/resume-studio')}
                className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-primary/40 hover:bg-muted/30 transition-colors text-left group"
              >
                <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">No saved resumes yet</span>
                  <span className="text-[10px] text-muted-foreground block">Create your first resume in the Studio</span>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </button>
            )}
          </div>
        </Card>
        </TierLock>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* LinkedIn Optimizer */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-primary" />
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
          <Button onClick={generateLinkedin} disabled={loadingLinkedin || !linkedinInput.trim()} className="w-full gap-1">
            {loadingLinkedin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Optimize LinkedIn
          </Button>
          {linkedinResult && (
            <div className="h-48 rounded border p-3 overflow-auto">
              <pre className="text-xs whitespace-pre-wrap font-sans">{linkedinResult}</pre>
            </div>
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
