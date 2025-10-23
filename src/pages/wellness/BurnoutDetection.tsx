import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Activity, Heart, Clock, Home } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function BurnoutDetection() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const questions = [
    'I feel emotionally drained from my studies',
    'I have trouble getting motivated to study',
    'I feel overwhelmed by academic demands',
    'I have difficulty concentrating on coursework',
    'I feel exhausted even after resting',
    'I have lost interest in activities I once enjoyed',
    'I feel cynical or negative about my studies',
    'I experience physical symptoms like headaches or stomach issues',
  ];

  useEffect(() => {
    checkCooldown();
  }, []);

  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownRemaining]);

  const checkCooldown = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: lastAssessment } = await supabase
        .from('burnout_assessments')
        .select('completed_at')
        .eq('user_id', session.user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastAssessment) {
        const lastTime = new Date(lastAssessment.completed_at).getTime();
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const timePassed = now - lastTime;

        if (timePassed < oneHour) {
          setCooldownRemaining(Math.floor((oneHour - timePassed) / 1000));
        }
      }
    } catch (error) {
      console.error('Error checking cooldown:', error);
    }
  };

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion]]: score };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (assessmentAnswers: Record<string, number>) => {
    try {
      setAnalyzing(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to complete the assessment',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-burnout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: assessmentAnswers }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze assessment');
      }

      const result = await response.json();
      setAnalysis(result);

      await supabase.from('burnout_assessments').insert({
        user_id: session.user.id,
        answers: assessmentAnswers,
        score: result.score,
        tips: result.tips,
      });

      addXP(XP_ACTIONS.TASK_COMPLETE, 'Completed burnout assessment');
      setCooldownRemaining(3600);
      toast({
        title: 'Assessment complete',
        description: 'Your personalized wellness tips are ready',
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze assessment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setAnalysis(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getBurnoutLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-[hsl(var(--neon-green))]' };
    if (score < 60) return { level: 'Moderate', color: 'text-[hsl(var(--neon-yellow))]' };
    return { level: 'High', color: 'text-[hsl(var(--neon-orange))]' };
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-orange))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-yellow))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/wellness')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wellness
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-primary/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="mb-12 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-yellow))] flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-yellow))] bg-clip-text text-transparent">
            Burnout Detection
          </h1>
          <p className="text-xl text-muted-foreground">
            Set personal boundaries and recognize burnout early
          </p>
        </div>

        <div className="grid gap-6">
          {cooldownRemaining > 0 && !analysis ? (
            <Card className="glass-card border-[hsl(var(--neon-yellow))]/30 shadow-lg shadow-[hsl(var(--neon-yellow))]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
                  Assessment Cooldown
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-2xl font-bold text-[hsl(var(--neon-orange))] mb-2">
                  {formatTime(cooldownRemaining)}
                </p>
                <p className="text-muted-foreground">
                  Please wait before taking another assessment. Use this time to practice the self-care tips from your last assessment.
                </p>
              </CardContent>
            </Card>
          ) : !analysis ? (
            <Card className="glass-card border-[hsl(var(--neon-orange))]/30 shadow-lg shadow-[hsl(var(--neon-orange))]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[hsl(var(--neon-orange))]" />
                  Burnout Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>
                    <div className="w-full bg-background/50 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-yellow))] h-2 rounded-full transition-all"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-lg font-medium">{questions[currentQuestion]}</p>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        onClick={() => handleAnswer(score)}
                        variant="outline"
                        className="h-16 hover:bg-[hsl(var(--neon-orange))]/20"
                        disabled={analyzing}
                      >
                        <div className="text-center">
                          <p className="text-2xl mb-1">{score}</p>
                          <p className="text-xs">
                            {score === 1 ? 'Never' : score === 5 ? 'Always' : ''}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="glass-card border-[hsl(var(--neon-orange))]/30 shadow-lg shadow-[hsl(var(--neon-orange))]/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[hsl(var(--neon-orange))]" />
                      Your Burnout Assessment
                    </span>
                    <span className={`text-2xl font-bold ${getBurnoutLevel(analysis.score).color}`}>
                      {analysis.score}/100
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Burnout Level</p>
                    <p className={`text-xl font-semibold ${getBurnoutLevel(analysis.score).color}`}>
                      {getBurnoutLevel(analysis.score).level}
                    </p>
                  </div>
                  {analysis.analysis && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Analysis</p>
                      <p className="text-sm">{analysis.analysis}</p>
                    </div>
                  )}
                  <Button
                    onClick={resetAssessment}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Take Assessment Again (After Cooldown)
                  </Button>
                </CardContent>
              </Card>

              {analysis.tips && analysis.tips.length > 0 && (
                <Card className="glass-card border-[hsl(var(--neon-yellow))]/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
                      Personalized Self-Care Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.tips.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-[hsl(var(--neon-orange))]/20">
                          <span className="text-[hsl(var(--neon-orange))] text-xl">•</span>
                          <span className="text-sm flex-1">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card className="glass-card border-[hsl(var(--neon-yellow))]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
                General Self-Care Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-orange))]">•</span>
                  <span>Take regular breaks during study sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-orange))]">•</span>
                  <span>Practice setting boundaries with coursework</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-orange))]">•</span>
                  <span>Seek support when feeling overwhelmed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-orange))]">•</span>
                  <span>Maintain a regular sleep schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-orange))]">•</span>
                  <span>Stay connected with friends and family</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
