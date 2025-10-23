import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Dumbbell, Users, Calendar } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';

export default function GymBuddy() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();

  const handleFindBuddy = () => {
    addXP(XP_ACTIONS.TASK_COMPLETE, 'Searched for gym buddy');
    toast({
      title: 'Searching for gym buddies!',
      description: 'We\'ll notify you when matches are found',
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-orange))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-pink))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
              <Button 
                onClick={handleFindBuddy}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-pink))] hover:opacity-90"
              >
                <Users className="w-4 h-4 mr-2" />
                Find Workout Partner
              </Button>
            </CardContent>
          </Card>

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
