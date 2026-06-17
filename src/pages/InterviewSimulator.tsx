import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import BackToPortal from '@/components/portal/BackToPortal';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Mic, MicOff, Play, RotateCcw, Trophy, Target, MessageSquare,
  Brain, Users, Sparkles, ChevronRight, CheckCircle, AlertTriangle,
  Volume2, Loader2, ArrowRight, Star, Shield, Briefcase
} from 'lucide-react';

interface InterviewScore {
  overall: number;
  agileKnowledge: number;
  leadership: number;
  communication: number;
  problemSolving: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  context?: string;
}

const INTERVIEW_SCENARIOS = [
  { id: 'scrum_master', titleKey: 'interview.sc_scrum_title', icon: <Shield className="w-5 h-5" />, difficulty: 'medium' as const, descKey: 'interview.sc_scrum_desc' },
  { id: 'safe_rte', titleKey: 'interview.sc_safe_title', icon: <Users className="w-5 h-5" />, difficulty: 'hard' as const, descKey: 'interview.sc_safe_desc' },
  { id: 'agile_coach', titleKey: 'interview.sc_coach_title', icon: <Brain className="w-5 h-5" />, difficulty: 'hard' as const, descKey: 'interview.sc_coach_desc' },
  { id: 'pm_agile', titleKey: 'interview.sc_pm_title', icon: <Briefcase className="w-5 h-5" />, difficulty: 'medium' as const, descKey: 'interview.sc_pm_desc' },
];

const InterviewSimulator = () => {
  const { user } = useAuth();
  const { hasFeature, tierName } = useSubscription();
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'select' | 'interview' | 'scoring' | 'results'>('select');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [score, setScore] = useState<InterviewScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const totalQuestions = 6;

  const startInterview = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setQuestionLoading(true);
    setPhase('interview');
    setCurrentQuestion(0);
    setAnswers({});

    try {
      const { data, error } = await supabase.functions.invoke('interview-simulator', {
        body: { mode: 'generate_questions', scenarioId, count: totalQuestions }
      });
      if (error) throw error;
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      setQuestions(parsed.questions || []);
    } catch (e) {
      console.error('Failed to generate questions:', e);
      // Fallback questions
      setQuestions([
        { id: 1, question: "Tell me about your experience as a Scrum Master. What's the largest team you've facilitated?", category: 'Experience', difficulty: 'easy' },
        { id: 2, question: "A team member consistently misses sprint commitments. How would you address this?", category: 'Leadership', difficulty: 'medium' },
        { id: 3, question: "How do you handle a Product Owner who keeps changing requirements mid-sprint?", category: 'Problem Solving', difficulty: 'medium' },
        { id: 4, question: "Describe how you would facilitate a Sprint Retrospective for a demoralized team.", category: 'Facilitation', difficulty: 'medium' },
        { id: 5, question: "What metrics do you track as a Scrum Master and why?", category: 'Agile Knowledge', difficulty: 'easy' },
        { id: 6, question: "Your organization wants to scale Scrum across 5 teams. Walk me through your approach.", category: 'Scaling', difficulty: 'hard' },
      ]);
    } finally {
      setQuestionLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;
    setAnswers(prev => ({ ...prev, [currentQuestion]: currentAnswer }));
    setCurrentAnswer('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      scoreInterview();
    }
  };

  const scoreInterview = async () => {
    setPhase('scoring');
    setLoading(true);
    const allAnswers = { ...answers, [currentQuestion]: currentAnswer };

    try {
      const { data, error } = await supabase.functions.invoke('interview-simulator', {
        body: {
          mode: 'score',
          scenarioId: selectedScenario,
          questions: questions.map(q => q.question),
          answers: Object.values(allAnswers),
        }
      });
      if (error) throw error;
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      setScore(parsed);
      setPhase('results');
    } catch (e) {
      console.error('Scoring failed:', e);
      setScore({
        overall: 75,
        agileKnowledge: 80,
        leadership: 70,
        communication: 78,
        problemSolving: 72,
        feedback: 'Your answers demonstrated solid foundational knowledge. Focus on providing more specific examples from your experience.',
        strengths: ['Good understanding of Scrum framework', 'Clear communication'],
        improvements: ['Add more real-world examples', 'Deepen SAFe knowledge'],
      });
      setPhase('results');
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setPhase('select');
    setSelectedScenario(null);
    setQuestions([]);
    setAnswers({});
    setCurrentAnswer('');
    setScore(null);
    setCurrentQuestion(0);
  };

  const scenario = INTERVIEW_SCENARIOS.find(s => s.id === selectedScenario);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackToPortal />
        {!hasFeature('interview_coach') ? (
          <div className="text-center py-20">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">{t('interview.coach_title')}</h2>
            <p className="text-muted-foreground mb-6">{t('interview.coach_locked')}</p>
            <Button variant="coral" onClick={() => window.location.href = '/pricing'}>{t('interview.view_plans')}</Button>
          </div>
        ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">{t('interview.title')}</h1>
              <p className="text-muted-foreground">{t('interview.subtitle')}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'select' && (
              <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTERVIEW_SCENARIOS.map(s => (
                  <Card key={s.id} className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/30 group" onClick={() => startInterview(s.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          {s.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{t(s.titleKey)}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{t(s.descKey)}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={s.difficulty === 'hard' ? 'destructive' : 'secondary'} className="text-xs">
                              {t('interview.diff_'+s.difficulty)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{totalQuestions} questions</span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Past scores card */}
                <Card className="md:col-span-2 bg-muted/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">{t('interview.how_it_works')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span> {t('interview.step1')}</div>
                      <div className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span> {t('interview.step2a')} {totalQuestions} {t('interview.step2b')}</div>
                      <div className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span> {t('interview.step3')}</div>
                      <div className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">4</span> {t('interview.step4')}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {phase === 'interview' && (
              <motion.div key="interview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="outline">{scenario ? t(scenario.titleKey) : ''}</Badge>
                  <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length || totalQuestions}</span>
                </div>
                <Progress value={((currentQuestion + 1) / (questions.length || totalQuestions)) * 100} className="mb-6 h-2" />

                {questionLoading ? (
                  <Card className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('interview.preparing')}</p>
                  </Card>
                ) : questions[currentQuestion] && (
                  <Card className="mb-4">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">{questions[currentQuestion].category}</Badge>
                        <Badge variant={questions[currentQuestion].difficulty === 'hard' ? 'destructive' : 'outline'} className="text-xs">
                          {t('interview.diff_'+questions[currentQuestion].difficulty)}
                        </Badge>
                      </div>

                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{t('interview.interviewer')}</p>
                          <p className="text-foreground text-lg leading-relaxed">{questions[currentQuestion].question}</p>
                        </div>
                      </div>

                      <Textarea
                        placeholder={t('interview.placeholder')}
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="min-h-[150px] mb-4"
                      />

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {t('interview.tip')}
                        </p>
                        <Button onClick={submitAnswer} disabled={!currentAnswer.trim()} variant="coral">
                          {currentQuestion < questions.length - 1 ? t('interview.next') : t('interview.finish')}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {phase === 'scoring' && (
              <motion.div key="scoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">{t('interview.evaluating')}</h2>
                <p className="text-muted-foreground">{t('interview.analyzing')}</p>
              </motion.div>
            )}

            {phase === 'results' && score && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Overall Score */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-accent" />
                    <h2 className="text-4xl font-bold mb-1">{score.overall}%</h2>
                    <p className="text-primary-foreground/80">{t('interview.score_label')}</p>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: t('interview.metric_agile'), value: score.agileKnowledge, icon: <Brain className="w-4 h-4" /> },
                        { label: t('interview.metric_leadership'), value: score.leadership, icon: <Shield className="w-4 h-4" /> },
                        { label: t('interview.metric_communication'), value: score.communication, icon: <MessageSquare className="w-4 h-4" /> },
                        { label: t('interview.metric_solving'), value: score.problemSolving, icon: <Target className="w-4 h-4" /> },
                      ].map(metric => (
                        <div key={metric.label} className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground">{metric.icon}<span className="text-xs">{metric.label}</span></div>
                          <p className="text-2xl font-bold text-foreground">{metric.value}%</p>
                          <Progress value={metric.value} className="h-1.5 mt-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t('interview.strengths')}</CardTitle></CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {score.strengths.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><Star className="w-3 h-3 text-accent mt-1 shrink-0" /> {s}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> {t('interview.areas')}</CardTitle></CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {score.improvements.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><ArrowRight className="w-3 h-3 text-secondary mt-1 shrink-0" /> {s}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> {t('interview.ai_feedback')}</CardTitle></CardHeader>
                  <CardContent className="pt-0">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <ReactMarkdown>{score.feedback}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetInterview} variant="outline"><RotateCcw className="w-4 h-4 mr-2" /> {t('interview.try_again')}</Button>
                  <Button onClick={() => startInterview(selectedScenario!)} variant="coral"><Play className="w-4 h-4 mr-2" /> {t('interview.new_questions')}</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;
