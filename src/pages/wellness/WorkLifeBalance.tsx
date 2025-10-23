import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Scale, TrendingUp, CheckCircle } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';

export default function WorkLifeBalance() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();

  const handleCoachingSession = () => {
    addXP(XP_ACTIONS.MENTOR_SESSION, 'Started coaching session');
    toast({
      title: 'Coaching session started!',
      description: 'Let\'s work on finding your balance',
    });
  };

  const tips = [
    'Schedule dedicated study blocks with breaks',
    'Set boundaries for social media use',
    'Prioritize 7-8 hours of sleep nightly',
    'Make time for hobbies and relaxation',
    'Practice saying no when overwhelmed',
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-cyan))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-green))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-green))] flex items-center justify-center">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-green))] bg-clip-text text-transparent">
            Work-Life Balance
          </h1>
          <p className="text-xl text-muted-foreground">
            Find harmony between academics and life
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card border-[hsl(var(--neon-cyan))]/30 shadow-lg shadow-[hsl(var(--neon-cyan))]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
                Coaching & Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Work with our wellness coaches to develop sustainable balance strategies
              </p>
              <Button 
                onClick={handleCoachingSession}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-green))] hover:opacity-90"
              >
                Start Coaching Session
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-[hsl(var(--neon-green))]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--neon-green))]" />
                Balance Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-[hsl(var(--neon-cyan))]/20">
                    <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
