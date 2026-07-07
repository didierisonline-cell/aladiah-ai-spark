import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle,
  Trophy, RefreshCw, AlertTriangle, BookOpen
} from 'lucide-react';

// correct_answer_index is intentionally excluded — it is never exposed to
// the client. Questions are loaded via the get-quiz-questions Edge Function
// (which strips the answer column), and grading is done server-side by the
// submit-quiz Edge Function. The correctAnswer field in QuizResult is
// populated ONLY from the server response after submission.
interface Question {
  id: string;
  question_text: string;
  scenario_context: string | null;
  options: string[];
  explanation: string | null;
  order_index: number;
  competency: string | null;
}

interface QuizResult {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

interface QuizProps {
  quizId: string;
  quizType: 'mini_video' | 'chapter_end';
  onComplete: (passed: boolean) => void;
  onBack: () => void;
}

const Quiz = ({ quizId, quizType, onComplete, onBack }: QuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showingResults, setShowingResults] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    loadQuestions();
  }, [quizId]);

  const loadQuestions = async () => {
    try {
      // Use the get-quiz-questions Edge Function, which strips correct_answer_index.
      // Direct table queries are blocked by RLS (USING(false)) for students.
      const { data, error } = await supabase.functions.invoke('get-quiz-questions', {
        body: { quizId },
      });
      if (error) throw new Error(error.message || 'Failed to load questions');
      if (data?.error) throw new Error(data.error);

      const raw: any[] = data?.questions || [];
      const parsedQuestions = raw.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : (Array.isArray(q.options) ? q.options : []),
      }));

      setQuestions(parsedQuestions);
      setAnswers(new Array(parsedQuestions.length).fill(null));
    } catch (error: any) {
      toast({
        title: t('quiz.err_load'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(a => a === null)) {
      toast({
        title: t('quiz.answer_all'),
        description: t('quiz.answer_all_desc'),
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Build answer map: { questionId: selectedAnswerIndex }
      // submit-quiz grades server-side (has service-role access to correct_answer_index)
      // and writes user_progress + quiz_attempts itself — no client-side grading needed.
      const answerMap: Record<string, number> = {};
      questions.forEach((q, idx) => {
        if (answers[idx] !== null) answerMap[q.id] = answers[idx] as number;
      });

      const { data, error } = await supabase.functions.invoke('submit-quiz', {
        body: { quizId, answers: answerMap },
      });

      if (error) throw new Error(error.message || 'Submission failed');
      if (data?.error) throw new Error(data.error);

      const { score, passed, results: serverResults, passingScore } = data as {
        score: number;
        passed: boolean;
        results: Array<{ questionId: string; userAnswer: number | null; correctAnswer: number; isCorrect: boolean; explanation: string | null }>;
        passingScore: number;
      };

      // Map server results (by questionId) to the order of questions as displayed
      const resultMap = new Map((serverResults || []).map(r => [r.questionId, r]));
      const results: QuizResult[] = questions.map(q => {
        const sr = resultMap.get(q.id);
        return {
          questionId: q.id,
          userAnswer: sr?.userAnswer ?? null,
          correctAnswer: sr?.correctAnswer ?? 0,
          isCorrect: sr?.isCorrect ?? false,
          explanation: sr?.explanation || '',
        };
      });

      setResults(results);
      setScore(score);
      setPassed(passed);
      setSubmitted(true);
      setShowingResults(true);
      setCurrentIndex(0);

      if (passed) {
        toast({
          title: t('quiz.congrats'),
          description: t('quiz.passed_desc').replace('{score}', String(score)),
        });
      } else {
        toast({
          title: t('quiz.not_yet'),
          description: t('quiz.not_yet_desc').replace('{score}', String(score)).replace('{pass}', String(passingScore ?? 70)),
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: t('quiz.err_submit'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setShowingResults(false);
    setCurrentIndex(0);
    setResults([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">{t('quiz.loading')}</p>
        </div>
      </div>
    );
  }

  // No questions mapped to this quiz yet (e.g. modules whose question bank is not
  // authored). Never render a blank question card or allow a NaN-scored submit /
  // fake pass — show an honest "coming soon" state with a way back. (Without this
  // guard, answers=[] makes [].every() === true, enabling Submit and scoring 0/0.)
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground mb-3">Assessment coming soon</h1>
          <p className="text-muted-foreground mb-8">
            The questions for this module are being finalized. You can keep going through the lessons and check back soon.
          </p>
          <Button onClick={onBack} variant="outline" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('quiz.back')}
          </Button>
        </div>
      </div>
    );
  }

  if (showingResults && submitted && passed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">
            {t('quiz.passed_title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {t('quiz.you_scored').replace('{score}', String(score))}
          </p>
          <p className="text-muted-foreground mb-8">
            {quizType === 'chapter_end'
              ? t('quiz.chapter_done')
              : t('quiz.video_done')}
          </p>
          <Button onClick={() => onComplete(true)} variant="coral" size="lg">
            {t('quiz.continue')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showingResults && submitted && !passed) {
    const currentResult = results[currentIndex];
    const currentQuestion = questions[currentIndex];
    const incorrectResults = results.filter(r => !r.isCorrect);
    const correctCount = results.filter(r => r.isCorrect).length;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">{t('quiz.score_need').replace('{score}', String(score))}</span>
              </div>
              <Button onClick={handleRetry} variant="coral">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('quiz.try_again')}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Remediation Summary */}
          <Card className="mb-6 border-secondary/30 bg-secondary/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">{t('quiz.remediation')}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('quiz.remediation_desc')
                      .replace('{correct}', String(correctCount))
                      .replace('{total}', String(questions.length))
                      .replace('{missed}', String(incorrectResults.length))}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {results.map((r, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                          idx === currentIndex
                            ? 'ring-2 ring-primary ring-offset-2'
                            : ''
                        } ${
                          r.isCorrect
                            ? 'bg-green-500/20 text-green-600'
                            : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{t('quiz.reviewing')}</span>
              <span>{currentIndex + 1} {t('quiz.of')} {questions.length}</span>
            </div>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className={`${currentResult?.isCorrect ? 'border-green-500' : 'border-destructive'}`}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {currentResult?.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${currentResult?.isCorrect ? 'text-green-500' : 'text-destructive'}`}>
                      {currentResult?.isCorrect ? t('quiz.correct') : t('quiz.incorrect')}
                    </span>
                  </div>
                  {currentQuestion?.scenario_context && (
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground italic">
                        📋 {t('quiz.scenario')}: {currentQuestion.scenario_context}
                      </p>
                    </div>
                  )}
                  <CardTitle className="text-xl">{currentQuestion?.question_text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {(Array.isArray(currentQuestion?.options) ? currentQuestion.options : []).map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          idx === currentResult?.correctAnswer
                            ? 'border-green-500 bg-green-500/10'
                            : idx === currentResult?.userAnswer && !currentResult?.isCorrect
                              ? 'border-destructive bg-destructive/10'
                              : 'border-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                            idx === currentResult?.correctAnswer
                              ? 'bg-green-500 text-white'
                              : idx === currentResult?.userAnswer && !currentResult?.isCorrect
                                ? 'bg-destructive text-white'
                                : 'bg-muted'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentResult?.explanation && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm font-medium text-primary mb-1">💡 {t('quiz.explanation')}:</p>
                      <p className="text-sm text-muted-foreground">{currentResult.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('quiz.previous')}
                    </Button>
                    {currentIndex < questions.length - 1 ? (
                      <Button onClick={handleNext}>
                        {t('quiz.next')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleRetry} variant="coral">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('quiz.retry')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const allAnswered = answers.every(a => a !== null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('quiz.back')}
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {quizType === 'chapter_end' ? t('quiz.chapter_quiz') : t('quiz.video_quiz')}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {quizType === 'chapter_end' ? t('quiz.q_count_chapter') : t('quiz.q_count_video')}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{t('quiz.question_n').replace('{i}', String(currentIndex + 1)).replace('{n}', String(questions.length))}</span>
            <span>{t('quiz.answered').replace('{n}', String(answers.filter(a => a !== null).length))}</span>
          </div>
          <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                idx === currentIndex
                  ? 'bg-primary text-primary-foreground'
                  : answers[idx] !== null
                    ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                    : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                {currentQuestion?.scenario_context && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-muted-foreground italic">
                      📋 {t('quiz.scenario')}: {currentQuestion.scenario_context}
                    </p>
                  </div>
                )}
                <CardTitle className="text-xl">{currentQuestion?.question_text}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentIndex]?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                >
                  <div className="space-y-3">
                    {(Array.isArray(currentQuestion?.options) ? currentQuestion.options : []).map((option, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer hover:bg-muted/50 ${
                          answers[currentIndex] === idx
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        }`}
                        onClick={() => handleAnswer(idx)}
                      >
                        <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                        <Label 
                          htmlFor={`option-${idx}`} 
                          className="flex-1 cursor-pointer font-normal"
                        >
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('quiz.previous')}
                  </Button>

                  {currentIndex < questions.length - 1 ? (
                    <Button onClick={handleNext} disabled={answers[currentIndex] === null}>
                      {t('quiz.next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      variant="coral"
                      disabled={!allAnswered || submitting}
                    >
                      {submitting ? t('quiz.submitting') : t('quiz.submit')}
                      {!submitting && <CheckCircle className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
                </div>

                {!allAnswered && currentIndex === questions.length - 1 && (
                  <div className="flex items-center gap-2 mt-4 text-amber-500 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {t('quiz.answer_all_inline')}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Quiz;
