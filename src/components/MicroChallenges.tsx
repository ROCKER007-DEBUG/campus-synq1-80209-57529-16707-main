import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { Clock, Zap, Trophy, Plus, Timer } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  skill_required: string;
  time_limit_minutes: number;
  difficulty: string;
  xp_reward: number;
  status: string;
  creator_id: string;
  accepted_by: string | null;
  created_at: string;
  expires_at: string;
}

export const MicroChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { addXP } = useXP();

  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    skill_required: '',
    time_limit_minutes: 30,
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    xp_reward: 25
  });

  useEffect(() => {
    fetchChallenges();

    const channel = supabase
      .channel('micro-challenges-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'micro_challenges'
      }, () => {
        fetchChallenges();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('micro_challenges')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please sign in to create challenges", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from('micro_challenges').insert({
        ...newChallenge,
        creator_id: user.id
      });

      if (error) throw error;

      toast({ title: "✨ Challenge Created!", description: "Others can now accept your challenge" });
      // Award XP to creator for creating a challenge
      try {
        addXP(newChallenge.xp_reward, 'Created Micro Challenge');
      } catch (e) {
        // ignore XP errors
      }
      setNewChallenge({
        title: '',
        description: '',
        skill_required: '',
        time_limit_minutes: 30,
        difficulty: 'intermediate',
        xp_reward: 25
      });
      setIsCreating(false);
    } catch (error) {
      toast({ title: "Error creating challenge", variant: "destructive" });
    }
  };

  const acceptChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please sign in to accept challenges", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from('micro_challenges')
        .update({ status: 'in_progress', accepted_by: user.id })
        .eq('id', challengeId);

      if (error) throw error;

      toast({ 
        title: "🎯 Challenge Accepted!", 
        description: "Timer started - good luck!" 
      });
      // Small XP for accepting a challenge (encourages participation)
      try {
        addXP(10, 'Accepted Micro Challenge');
      } catch (e) {
        // ignore
      }
    } catch (error) {
      toast({ title: "Error accepting challenge", variant: "destructive" });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading challenges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">⚡ Micro Challenges</h2>
          <p className="text-muted-foreground">Quick, time-boxed skill exchanges</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Micro Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Review my essay"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Need someone to review my college essay and provide feedback..."
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Skill Required</label>
                  <Input
                    placeholder="Writing, Coding, Design..."
                    value={newChallenge.skill_required}
                    onChange={(e) => setNewChallenge({ ...newChallenge, skill_required: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time Limit (minutes)</label>
                  <Input
                    type="number"
                    min={5}
                    max={120}
                    value={newChallenge.time_limit_minutes}
                    onChange={(e) => setNewChallenge({ ...newChallenge, time_limit_minutes: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select 
                    value={newChallenge.difficulty}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setNewChallenge({ ...newChallenge, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">XP Reward</label>
                  <Input
                    type="number"
                    min={10}
                    max={100}
                    value={newChallenge.xp_reward}
                    onChange={(e) => setNewChallenge({ ...newChallenge, xp_reward: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={createChallenge} className="w-full bg-gradient-primary">
                Create Challenge
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {challenges.length === 0 ? (
        <Card className="p-12 text-center">
          <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Challenges Yet</h3>
          <p className="text-muted-foreground mb-4">Be the first to create a micro challenge!</p>
          <Button onClick={() => setIsCreating(true)} variant="outline">
            Create Challenge
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-6 space-y-4 hover-lift glass-card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{challenge.title}</h3>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <Badge className="bg-gradient-primary text-white">
                  <Trophy className="w-3 h-3 mr-1" />
                  {challenge.xp_reward} XP
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {challenge.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  {challenge.time_limit_minutes}m
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {challenge.skill_required}
                </div>
              </div>

              <Button 
                onClick={() => acceptChallenge(challenge.id)}
                className="w-full bg-gradient-secondary"
              >
                <Clock className="w-4 h-4 mr-2" />
                Accept Challenge
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
