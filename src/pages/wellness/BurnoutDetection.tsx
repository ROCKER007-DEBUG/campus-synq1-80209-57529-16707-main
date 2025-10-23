import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Activity, Heart } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';

export default function BurnoutDetection() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    'I feel emotionally drained from my studies',
    'I have trouble getting motivated to study',
    'I feel overwhelmed by academic demands',
    'I have difficulty concentrating on coursework',
    'I feel exhausted even after resting',
  ];

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const total = newAnswers.reduce((a, b) => a + b, 0);
      addXP(XP_ACTIONS.TASK_COMPLETE, 'Completed burnout assessment');
      toast({
        title: 'Assessment complete',
        description: total > 15 ? 'Consider taking steps to manage stress' : 'You\'re doing well! Keep it up',
      });
      setCurrentQuestion(0);
      setAnswers([]);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-orange))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-yellow))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/wellness')}
          className="mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wellness
        </Button>

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
                  <p className="text-sm text-muted-foreground mb-1">Question {currentQuestion + 1} of {questions.length}</p>
                  <p className="text-lg font-medium">{questions[currentQuestion]}</p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      onClick={() => handleAnswer(score)}
                      variant="outline"
                      className="h-16 hover:bg-[hsl(var(--neon-orange))]/20"
                    >
                      <div className="text-center">
                        <p className="text-2xl mb-1">{score}</p>
                        <p className="text-xs">{score === 1 ? 'Never' : score === 5 ? 'Always' : ''}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-[hsl(var(--neon-yellow))]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
                Self-Care Reminders
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
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
