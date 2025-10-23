import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useXP } from '@/hooks/useXP';
import { Play, Pause, Square, Clock } from 'lucide-react';

export const ExchangeTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionType, setSessionType] = useState<'teach' | 'learn' | 'collaborate'>('learn');
  const [skillName, setSkillName] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { addXP } = useXP();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!skillName.trim()) {
      toast({ title: "Please enter a skill name", variant: "destructive" });
      return;
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    setIsRunning(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please sign in to save sessions", variant: "destructive" });
        return;
      }

      const durationMinutes = Math.round(seconds / 60);
      const xpEarned = Math.floor(durationMinutes * (sessionType === 'teach' ? 2 : 1.5));
      const trustEarned = sessionType === 'teach' ? Math.floor(durationMinutes / 10) : 0;

      const { error } = await supabase.from('exchange_sessions').insert({
        session_type: sessionType,
        skill_name: skillName,
        duration_minutes: durationMinutes,
        participant_id: user.id,
        notes: notes.trim() || null,
        xp_earned: xpEarned,
        trust_earned: trustEarned
      });

      if (error) throw error;

      addXP(xpEarned, `Completed ${durationMinutes}min ${sessionType} session`);
      
      toast({ 
        title: "🎉 Session Saved!", 
        description: `Earned ${xpEarned} XP${trustEarned > 0 ? ` and ${trustEarned} Trust` : ''}` 
      });

      // Reset
      setSeconds(0);
      setSkillName('');
      setNotes('');
    } catch (error) {
      console.error('Error saving session:', error);
      toast({ title: "Error saving session", variant: "destructive" });
    }
  };

  return (
    <Card className="p-6 glass-card space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Exchange Timer</h3>
      </div>

      <div className="text-center">
        <div className="text-6xl font-bold font-mono mb-4 text-primary">
          {formatTime(seconds)}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Session Type</label>
          <Select 
            value={sessionType}
            onValueChange={(value: 'teach' | 'learn' | 'collaborate') => setSessionType(value)}
            disabled={isRunning}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teach">Teaching (2x XP + Trust)</SelectItem>
              <SelectItem value="learn">Learning (1.5x XP)</SelectItem>
              <SelectItem value="collaborate">Collaborating (1.5x XP)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Skill Name</label>
          <Input
            placeholder="e.g., React, Python, Essay Writing..."
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            disabled={isRunning}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Notes (Optional)</label>
          <Textarea
            placeholder="What did you work on?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <Button onClick={handleStart} className="flex-1 bg-gradient-primary">
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
        ) : (
          <>
            <Button onClick={handlePause} variant="secondary" className="flex-1">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button onClick={handleStop} variant="destructive" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop & Save
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
