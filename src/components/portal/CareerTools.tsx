import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase, FileText, Linkedin, Sparkles, Loader2,
  CheckCircle, Clock, Users, MessageCircle, ArrowRight, History, Award
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

// All features unlocked — single $59.99/month plan
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
    { label: 'Complete Coursework', threshold: 100, pct: Math.min(100, overallProgress) },
    { label: 'Project Simulation', threshold: 0, pct: 0 },
    { label: 'Certifications', threshold: 0, pct: 0 },
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

      {/* Certification Hub */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-1">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Certification Roadmap</h3>
            <p className="text-xs text-muted-foreground">Official exam links by career track — click any cert to register</p>
          </div>
        </div>
        {[
          { track: '🏅 Scrum Master / Agile', color: 'border-blue-500/30 bg-blue-500/5', headerColor: 'text-blue-400', money: 'PSM II + SAFe = enterprise money ($150K+)', groups: [
            { name: 'Scrum Alliance', certs: [{ label: 'CSM', desc: 'Certified ScrumMaster', url: 'https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster' }, { label: 'A-CSM', desc: 'Advanced Certified ScrumMaster', url: 'https://www.scrumalliance.org/get-certified/scrum-master-track/advanced-certified-scrummaster' }, { label: 'CSP-SM', desc: 'Certified Scrum Professional', url: 'https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrum-professional-scrummaster' }] },
            { name: 'Scrum.org', certs: [{ label: 'PSM I', desc: 'Professional Scrum Master I', url: 'https://www.scrum.org/assessments/professional-scrum-master-i-certification' }, { label: 'PSM II', desc: 'Professional Scrum Master II', url: 'https://www.scrum.org/assessments/professional-scrum-master-ii-assessment' }, { label: 'PSM III', desc: 'Professional Scrum Master III', url: 'https://www.scrum.org/assessments/professional-scrum-master-iii-assessment' }] },
            { name: 'Scaled Agile', certs: [{ label: 'SSM', desc: 'SAFe Scrum Master', url: 'https://scaledagile.com/training/safe-scrum-master/' }, { label: 'SASM', desc: 'SAFe Advanced Scrum Master', url: 'https://scaledagile.com/training/safe-advanced-scrum-master/' }, { label: 'SA', desc: 'SAFe Agilist', url: 'https://scaledagile.com/training/leading-safe/' }] },
            { name: 'AI-Enhanced Agile', certs: [{ label: 'ICAgile', desc: 'Agile + AI Mindset', url: 'https://www.icagile.com/certification' }, { label: 'Gen AI Agile', desc: 'Generative AI for Agile Leaders', url: 'https://www.coursera.org/search?query=agile+AI' }] },
          ]},
          { track: '💼 Project Manager', color: 'border-orange-500/30 bg-orange-500/5', headerColor: 'text-orange-400', money: 'PMP + AI = Executive-level PM ($160K–$200K)', groups: [
            { name: 'PMI', certs: [{ label: 'PMP 🔥', desc: 'Project Management Professional', url: 'https://www.pmi.org/certifications/project-management-pmp' }, { label: 'CAPM', desc: 'Certified Associate in PM', url: 'https://www.pmi.org/certifications/certified-associate-capm' }, { label: 'PMI-ACP', desc: 'Agile Certified Practitioner', url: 'https://www.pmi.org/certifications/agile-acp' }] },
            { name: 'PRINCE2', certs: [{ label: 'PRINCE2 Foundation', desc: 'UK/Europe standard', url: 'https://www.axelos.com/certifications/prince2-certifications' }, { label: 'PRINCE2 Practitioner', desc: 'Advanced PRINCE2', url: 'https://www.axelos.com/certifications/prince2-certifications/prince2-practitioner' }] },
            { name: 'AI-Integrated PM', certs: [{ label: 'PMI AI in PM', desc: 'AI in Project Management', url: 'https://www.pmi.org/learning/training-development/ai-pm' }, { label: 'Google PM + AI', desc: 'Google Project Management + AI', url: 'https://grow.google/certificates/project-management/' }] },
          ]},
          { track: '🧠 Solution Architect', color: 'border-purple-500/30 bg-purple-500/5', headerColor: 'text-purple-400', money: 'AWS Architect + AI Specialty = $180K–$250K', groups: [
            { name: 'Amazon Web Services', certs: [{ label: 'AWS SAA', desc: 'Solutions Architect Associate', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/' }, { label: 'AWS SAP', desc: 'Solutions Architect Professional', url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/' }, { label: 'AWS ML', desc: 'Machine Learning Specialty', url: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/' }] },
            { name: 'Microsoft Azure', certs: [{ label: 'AZ-305', desc: 'Azure Solutions Architect Expert', url: 'https://learn.microsoft.com/en-us/certifications/azure-solutions-architect/' }, { label: 'AI-102', desc: 'Azure AI Engineer Associate', url: 'https://learn.microsoft.com/en-us/certifications/azure-ai-engineer/' }] },
            { name: 'Google Cloud', certs: [{ label: 'GCP Architect', desc: 'Professional Cloud Architect', url: 'https://cloud.google.com/learn/certification/cloud-architect' }, { label: 'GCP ML', desc: 'Professional ML Engineer', url: 'https://cloud.google.com/learn/certification/machine-learning-engineer' }] },
          ]},
          { track: '📊 Data Analyst', color: 'border-green-500/30 bg-green-500/5', headerColor: 'text-green-400', money: 'Data + AI (Python + ML) = Data Scientist level', groups: [
            { name: 'Core Analytics', certs: [{ label: 'Google DA', desc: 'Google Data Analytics Certificate', url: 'https://grow.google/certificates/data-analytics/' }, { label: 'PL-300', desc: 'Microsoft Data Analyst (Power BI)', url: 'https://learn.microsoft.com/en-us/certifications/data-analyst-associate/' }, { label: 'SAS DA', desc: 'SAS Certified Data Analyst', url: 'https://www.sas.com/en_us/certification.html' }] },
            { name: 'AI + Data', certs: [{ label: 'IBM DS', desc: 'IBM Data Science Professional', url: 'https://www.coursera.org/professional-certificates/ibm-data-science' }, { label: 'Stanford ML', desc: 'Machine Learning by Stanford', url: 'https://www.coursera.org/specializations/machine-learning-introduction' }, { label: 'Deep Learning', desc: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning' }] },
          ]},
          { track: '📈 Business Analyst', color: 'border-teal-500/30 bg-teal-500/5', headerColor: 'text-teal-400', money: 'CBAP + Data + AI = Strategy roles ($140K+)', groups: [
            { name: 'IIBA', certs: [{ label: 'ECBA', desc: 'Entry Certificate in BA', url: 'https://www.iiba.org/certification/ecba/' }, { label: 'CCBA', desc: 'Certification of Competency in BA', url: 'https://www.iiba.org/certification/ccba/' }, { label: 'CBAP 🔥', desc: 'Certified Business Analysis Professional', url: 'https://www.iiba.org/certification/cbap/' }] },
            { name: 'AI for BA', certs: [{ label: 'AI for Leaders', desc: 'AI for Business Leaders', url: 'https://www.coursera.org/search?query=AI+business+leaders' }, { label: 'Data-Driven BA', desc: 'Data-driven Decision Making + AI', url: 'https://www.coursera.org/search?query=data+driven+business+analysis' }] },
          ]},
          { track: '🔐 Cybersecurity', color: 'border-red-500/30 bg-red-500/5', headerColor: 'text-red-400', money: 'CISSP + AI Security = $180K+', groups: [
            { name: 'ISC2', certs: [{ label: 'CISSP 🔥', desc: 'Certified Info Systems Security Pro', url: 'https://www.isc2.org/Certifications/CISSP' }, { label: 'SSCP', desc: 'Systems Security Certified Practitioner', url: 'https://www.isc2.org/Certifications/SSCP' }] },
            { name: 'CompTIA', certs: [{ label: 'Security+', desc: 'CompTIA Security+', url: 'https://www.comptia.org/certifications/security' }, { label: 'CySA+', desc: 'Cybersecurity Analyst', url: 'https://www.comptia.org/certifications/cybersecurity-analyst' }, { label: 'CASP+', desc: 'Advanced Security Practitioner', url: 'https://www.comptia.org/certifications/casp' }] },
            { name: 'AI + Security', certs: [{ label: 'IBM AI Sec', desc: 'AI for Cybersecurity', url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst' }, { label: 'Ethical Hacking AI', desc: 'Ethical Hacking with AI', url: 'https://www.coursera.org/search?query=ethical+hacking+AI' }] },
          ]},
          { track: '☁️ DevOps & Cloud Engineering', color: 'border-cyan-500/30 bg-cyan-500/5', headerColor: 'text-cyan-400', money: 'DevOps + AI pipelines = HIGHEST DEMAND RIGHT NOW', groups: [
            { name: 'Linux Foundation', certs: [{ label: 'CKA', desc: 'Certified Kubernetes Administrator', url: 'https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/' }, { label: 'CKAD', desc: 'Certified Kubernetes App Developer', url: 'https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/' }] },
            { name: 'AWS / Azure DevOps', certs: [{ label: 'AWS DevOps', desc: 'AWS DevOps Engineer Professional', url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/' }, { label: 'AZ-400', desc: 'Azure DevOps Engineer Expert', url: 'https://learn.microsoft.com/en-us/certifications/devops-engineer/' }] },
            { name: 'AI + DevOps', certs: [{ label: 'MLOps', desc: 'Machine Learning Operations', url: 'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops' }, { label: 'Kubeflow', desc: 'ML Pipelines & AI Infrastructure', url: 'https://www.coursera.org/search?query=kubeflow+MLOps' }] },
          ]},
        ].map((track) => (
          <Card key={track.track} className={`p-5 border ${track.color}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className={`font-bold text-sm ${track.headerColor}`}>{track.track}</h4>
                <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">🔥 {track.money}</span>
              </div>
              <div className="space-y-3">
                {track.groups.map((group) => (
                  <div key={group.name}>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{group.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.certs.map((cert) => (
                        <a key={cert.label} href={cert.url} target="_blank" rel="noopener noreferrer" title={cert.desc}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/60 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group text-xs font-medium">
                          {cert.label}
                          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CareerTools;
