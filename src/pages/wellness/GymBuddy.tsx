import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Dumbbell, Users, Calendar, Loader2, Home } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function GymBuddy() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (requestId && searching) {
      interval = setInterval(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gym-buddy-matching?requestId=${requestId}`,
            {
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const result = await response.json();

          if (result.status === 'matched') {
            setMatch(result.match);
            setSearching(false);
            addXP(XP_ACTIONS.TASK_COMPLETE, 'Found gym buddy');
            toast({
              title: 'Workout Partner Found!',
              description: `You've been matched with ${result.match.full_name || result.match.username || 'a partner'}`,
            });
          }
        } catch (error) {
          console.error('Error checking match status:', error);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [requestId, searching]);

  const handleFindBuddy = async () => {
    if (!location.trim()) {
      toast({
        title: 'Location required',
        description: 'Please enter your gym location',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSearching(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to find a gym buddy',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gym-buddy-matching`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ location }),
        }
      );

      const result = await response.json();

      if (result.status === 'matched') {
        setMatch(result.match);
        setSearching(false);
        addXP(XP_ACTIONS.TASK_COMPLETE, 'Found gym buddy');
        toast({
          title: 'Workout Partner Found!',
          description: `You've been matched with ${result.match.full_name || result.match.username || 'a partner'}`,
        });
      } else if (result.status === 'searching') {
        setRequestId(result.requestId);
        toast({
          title: 'Searching for partners...',
          description: 'We\'ll notify you when a match is found',
        });
      }
    } catch (error) {
      console.error('Error finding gym buddy:', error);
      setSearching(false);
      toast({
        title: 'Error',
        description: 'Failed to find a gym buddy. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-orange))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-pink))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-pink))] flex items-center justify-center">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-pink))] bg-clip-text text-transparent">
            Gym Buddy Matching
          </h1>
          <p className="text-xl text-muted-foreground">
            Find workout partners on campus
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card border-[hsl(var(--neon-orange))]/30 shadow-lg shadow-[hsl(var(--neon-orange))]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[hsl(var(--neon-orange))]" />
                Find Your Gym Buddy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Connect with students who share your fitness goals and schedule
              </p>
              <Input
                type="text"
                placeholder="Enter your gym location (e.g., Campus Rec Center)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background/50"
                disabled={searching || !!match}
              />
              <Button
                onClick={handleFindBuddy}
                disabled={searching || !!match}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-pink))] hover:opacity-90"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching for Partner...
                  </>
                ) : match ? (
                  'Partner Found!'
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Find Workout Partner
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {match && (
            <Card className="glass-card border-[hsl(var(--neon-pink))]/30 shadow-lg shadow-[hsl(var(--neon-pink))]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[hsl(var(--neon-pink))]" />
                  Your Gym Buddy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-orange))]/20">
                  <p className="font-semibold text-lg">{match.full_name || match.username || 'Anonymous User'}</p>
                  <p className="text-sm text-muted-foreground">Location: {match.location}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect with your gym buddy through the community forum or during your next workout!
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="glass-card border-[hsl(var(--neon-pink))]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[hsl(var(--neon-pink))]" />
                Campus Gym Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Monday - Friday: 6 AM - 10 PM', 'Saturday: 8 AM - 8 PM', 'Sunday: 10 AM - 6 PM'].map((time, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-background/50 border border-[hsl(var(--neon-orange))]/20">
                    <p className="text-sm">{time}</p>
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
