import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Scale, TrendingUp, CheckCircle, Loader2, User, Home } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function WorkLifeBalance() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState<any[]>([]);

  const handleCoachingSession = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to access coaching',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/work-life-coaching`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch coaching information');
      }

      const result = await response.json();
      setCoaches(result.coaches || []);

      await supabase.from('work_life_sessions').insert({
        user_id: session.user.id,
        session_type: 'coaching_discovery',
        completed: true,
      });

      addXP(XP_ACTIONS.MENTOR_SESSION, 'Explored coaching options');
      toast({
        title: 'Coaching information loaded!',
        description: 'Here are some experts who can help you find balance',
      });
    } catch (error) {
      console.error('Error fetching coaching info:', error);
      toast({
        title: 'Error',
        description: 'Failed to load coaching information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
                Discover professional coaches who specialize in work-life balance for students and young professionals
              </p>
              <Button
                onClick={handleCoachingSession}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-green))] hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finding Coaches...
                  </>
                ) : (
                  'Find Coaching Options'
                )}
              </Button>
            </CardContent>
          </Card>

          {coaches.length > 0 && (
            <Card className="glass-card border-[hsl(var(--neon-green))]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[hsl(var(--neon-green))]" />
                  Professional Coaches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coaches.map((coach, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-cyan))]/20 space-y-2"
                    >
                      <h3 className="font-semibold text-lg">{coach.name}</h3>
                      <p className="text-sm text-[hsl(var(--neon-cyan))]">{coach.credentials}</p>
                      <p className="text-sm"><span className="font-medium">Expertise:</span> {coach.expertise}</p>
                      <p className="text-sm text-muted-foreground">{coach.bio}</p>
                      <div className="pt-2 flex justify-between items-center border-t border-[hsl(var(--neon-cyan))]/20">
                        <p className="text-sm"><span className="font-medium">Contact:</span> {coach.contact}</p>
                        <p className="text-sm text-[hsl(var(--neon-green))]">{coach.pricing}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
