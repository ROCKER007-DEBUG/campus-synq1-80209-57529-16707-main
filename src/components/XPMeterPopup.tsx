import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, TrendingUp, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export function XPMeterPopup() {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadXP();

    const channel = supabase
      .channel('xp-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles'
      }, () => {
        loadXP();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadXP = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setXP(profile.xp);
        setLevel(profile.level);
      }
    } catch (error) {
      console.error('Error loading XP:', error);
    }
  };

  const getXPForNextLevel = (currentLevel: number) => {
    return currentLevel * 1000;
  };

  const getCurrentLevelXP = () => {
    const prevLevelXP = (level - 1) * 1000;
    const nextLevelXP = getXPForNextLevel(level);
    const currentXP = xp - prevLevelXP;
    return {
      current: currentXP,
      needed: nextLevelXP - prevLevelXP,
      progress: (currentXP / (nextLevelXP - prevLevelXP)) * 100,
    };
  };

  const levelInfo = getCurrentLevelXP();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-pink))] hover:opacity-90 transition-opacity">
          <Trophy className="w-5 h-5 text-white" />
          <div className="text-left">
            <p className="text-xs text-white/80">Level {level}</p>
            <p className="text-sm font-bold text-white">{xp} XP</p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-[hsl(var(--neon-orange))]" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-pink))] mb-4">
                  <Star className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-1">Level {level}</h3>
                <p className="text-muted-foreground">{xp.toLocaleString()} Total XP</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to Level {level + 1}</span>
                  <span className="font-medium">{levelInfo.current} / {levelInfo.needed} XP</span>
                </div>
                <Progress value={levelInfo.progress} className="h-3" />
                <p className="text-xs text-muted-foreground text-center">
                  {levelInfo.needed - levelInfo.current} XP until next level
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[hsl(var(--neon-green))]" />
                  Ways to Earn XP
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-[hsl(var(--neon-orange))]">•</span>
                    <span>Complete tasks and challenges (+50 XP)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[hsl(var(--neon-orange))]">•</span>
                    <span>Attend mentorship sessions (+75 XP)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[hsl(var(--neon-orange))]">•</span>
                    <span>Complete wellness activities (+50 XP)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[hsl(var(--neon-orange))]">•</span>
                    <span>Explore new features (+25 XP)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
