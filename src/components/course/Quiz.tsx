import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, ArrowRight, CheckCircle, XCircle, 
  Trophy, RefreshCw, AlertTriangle, BookOpen
} from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  scenario_context: string | null;
  options: string[];
  order_index: number;
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

  useEffect(() => {
    loadQuestions();
  }, [quizId]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-quiz-questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ quizId }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Parse options if they're stored as JSON strings
      const parsedQuestions = (data.questions || []).map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : (Array.isArray(q.options) ? q.options : [])
      }));
      
      setQuestions(parsedQuestions);
      setAnswers(new Array(parsedQuestions.length).fill(null));
    } catch (error: any) {
      toast({
        title: 'Error loading questions',
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
        title: 'Please answer all questions',
        description: 'You must answer every question before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-quiz`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ 
            quizId, 
            answers: answers 
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResults(data.results);
      setScore(data.score);
      setPassed(data.passed);
      setSubmitted(true);
      setShowingResults(true);
      setCurrentIndex(0);

      if (data.passed) {
        toast({
          title: '🎉 Congratulations!',
          description: `You scored ${data.score}%! You passed the quiz.`,
        });
      } else {
        toast({
          title: 'Not quite there yet',
          description: `You scored ${data.score}%. You need 100% to pass. Try again!`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error submitting quiz',
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
          <p className="text-muted-foreground">Loading quiz...</p>
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
            Quiz Passed! 🎉
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            You scored {score}%
          </p>
          <p className="text-muted-foreground mb-8">
            {quizType === 'chapter_end' 
              ? 'Congratulations on completing the chapter!'
              : 'Great job! Continue to the next video.'}
          </p>
          <Button onClick={() => onComplete(true)} variant="coral" size="lg">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showingResults && submitted && !passed) {
    const currentResult = results[currentIndex];
    const currentQuestion = questions[currentIndex];

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Score: {score}% - Need 100% to pass</span>
              </div>
              <Button onClick={handleRetry} variant="coral">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Reviewing answers</span>
              <span>{currentIndex + 1} of {questions.length}</span>
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
                      {currentResult?.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  {currentQuestion?.scenario_context && (
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground italic">
                        📋 Scenario: {currentQuestion.scenario_context}
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
                      <p className="text-sm font-medium text-primary mb-1">💡 Explanation:</p>
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
                      Previous
                    </Button>
                    {currentIndex < questions.length - 1 ? (
                      <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleRetry} variant="coral">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
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
              Back
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {quizType === 'chapter_end' ? 'Chapter Final Quiz' : 'Video Quiz'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {quizType === 'chapter_end' ? '40 questions' : '5 questions'}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{answers.filter(a => a !== null).length} answered</span>
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
                      📋 Scenario: {currentQuestion.scenario_context}
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
                    Previous
                  </Button>

                  {currentIndex < questions.length - 1 ? (
                    <Button onClick={handleNext} disabled={answers[currentIndex] === null}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      variant="coral"
                      disabled={!allAnswered || submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                      {!submitting && <CheckCircle className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
                </div>

                {!allAnswered && currentIndex === questions.length - 1 && (
                  <div className="flex items-center gap-2 mt-4 text-amber-500 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Please answer all questions before submitting
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
