import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Moon, TrendingUp, BarChart3 } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';

export default function SleepTracking() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();
  const [sleepHours, setSleepHours] = useState('');
  const [academicPerformance, setAcademicPerformance] = useState('');

  const handleTrackSleep = () => {
    if (sleepHours && academicPerformance) {
      addXP(XP_ACTIONS.TASK_COMPLETE, 'Tracked sleep and performance');
      toast({
        title: 'Sleep data recorded!',
        description: `${sleepHours} hours logged with performance rating: ${academicPerformance}/10`,
      });
      setSleepHours('');
      setAcademicPerformance('');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Neon Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-purple))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-cyan))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] flex items-center justify-center">
            <Moon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] bg-clip-text text-transparent">
            Sleep Tracking
          </h1>
          <p className="text-xl text-muted-foreground">
            Correlate your sleep with academic performance
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card border-[hsl(var(--neon-purple))]/30 shadow-lg shadow-[hsl(var(--neon-purple))]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-[hsl(var(--neon-purple))]" />
                Log Sleep Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hours of Sleep</label>
                <Input
                  type="number"
                  placeholder="e.g., 7.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Academic Performance (1-10)</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Rate your focus and productivity"
                  value={academicPerformance}
                  onChange={(e) => setAcademicPerformance(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <Button 
                onClick={handleTrackSleep}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] hover:opacity-90"
              >
                Log Sleep Data
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-[hsl(var(--neon-cyan))]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track your sleep patterns over time to discover how sleep affects your academic performance.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-purple))]/20">
                  <BarChart3 className="w-6 h-6 text-[hsl(var(--neon-purple))] mb-2" />
                  <p className="text-2xl font-bold">7.2h</p>
                  <p className="text-xs text-muted-foreground">Avg Sleep</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-cyan))]/20">
                  <TrendingUp className="w-6 h-6 text-[hsl(var(--neon-cyan))] mb-2" />
                  <p className="text-2xl font-bold">8.5/10</p>
                  <p className="text-xs text-muted-foreground">Avg Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
