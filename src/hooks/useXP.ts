import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type Profile = {
  id: string;
  xp?: number;
  level?: number;
  username?: string;
  full_name?: string;
};

export const useXP = () => {
  const [userXP, setUserXP] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadProfile = useCallback(async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        setIsAuthenticated(false);
        setUserId(null);
        setUserXP(0);
        setUserLevel(1);
        return;
      }

      setIsAuthenticated(true);
      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from<Profile>('profiles')
        .select('xp, level')
        .eq('id', user.id)
        .single();

      if (!error && profile) {
        setUserXP(profile.xp ?? 0);
        setUserLevel(profile.level ?? 1);
      } else {
        // ensure default profile exists
        setUserXP(0);
        setUserLevel(1);
        await supabase.from('profiles').upsert({ id: user.id, xp: 0, level: 1 }, { onConflict: 'id' });
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  }, []);

  // xp threshold formula
  const xpToNextLevel = (lvl: number) => Math.floor(500 * lvl);

  const addXP = useCallback(
    async (amount: number, reason?: string) => {
      if (!isAuthenticated || !userId) {
        toast({ title: 'Please sign in', description: 'You need to be logged in to earn XP', variant: 'destructive' });
        navigate('/auth');
        return;
      }

      try {
        // read latest values to reduce race conditions
        const { data: latest } = await supabase.from<Profile>('profiles').select('xp,level').eq('id', userId).single();
        const currentXP = latest?.xp ?? userXP ?? 0;
        const currentLevel = latest?.level ?? userLevel ?? 1;

        let newXP = currentXP + amount;
        let newLevel = currentLevel;
        while (newXP >= xpToNextLevel(newLevel)) {
          newLevel++;
        }

        // Prefer calling edge function rpc (if deployed) to credit XP server-side
        let usedRpc = false;
        try {
          const session = (await supabase.auth.getSession()).data.session;
          const token = session?.access_token;
          if (token) {
            const fnRes = await fetch('/functions/v1/credit-xp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ amount })
            });
            if (fnRes.ok) {
              usedRpc = true;
            }
          }
        } catch (e) {
          // ignore and fallback
        }

        if (!usedRpc) {
          const { error } = await supabase.from('profiles').update({ xp: newXP, level: newLevel }).eq('id', userId);
          if (error) {
            console.error('Failed to update XP', error);
            return;
          }
        }

        setUserXP(newXP);
        setUserLevel(newLevel);

        if (reason) {
          toast({ title: `+${amount} XP`, description: reason });
        }

        if (newLevel > currentLevel) {
          toast({ title: `🎉 Level Up!`, description: `You've reached level ${newLevel}` });
        }
      } catch (err) {
        console.error('addXP error', err);
      }
    },
    [isAuthenticated, userId, userXP, userLevel, navigate, toast]
  );

  useEffect(() => {
    loadProfile();

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, _session) => {
      loadProfile();
    });

    let channel: any;
    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData?.user?.id;
      if (!uid) return;

      channel = supabase
        .channel(`public:profiles:id=eq.${uid}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${uid}` }, (payload) => {
          if (payload?.new) {
            setUserXP(payload.new.xp ?? 0);
            setUserLevel(payload.new.level ?? 1);
          }
        })
        .subscribe();
    })();

    return () => {
      try {
        authSub?.subscription?.unsubscribe?.();
      } catch {}
      try {
        if (channel) supabase.removeChannel(channel);
      } catch {}
    };
  }, [loadProfile]);

  const getXPForNextLevel = () => (userLevel * 500) - userXP;
  const getProgressToNextLevel = () => {
    const currentLevelXP = (userLevel - 1) * 500;
    const nextLevelXP = userLevel * 500;
    const progressXP = userXP - currentLevelXP;
    return (progressXP / (nextLevelXP - currentLevelXP)) * 100;
  };

  return {
    userXP,
    userLevel,
    addXP,
    getXPForNextLevel,
    getProgressToNextLevel,
    isAuthenticated,
  };
};

// XP amounts for different actions — keep existing mapping
export const XP_ACTIONS = {
  COLLEGE_VIEW: 10,
  SCHOLARSHIP_APPLICATION: 50,
  EVENT_RSVP: 25,
  BLOG_READ: 15,
  COMMUNITY_POST: 30,
  MENTOR_SESSION: 100,
  PROFILE_COMPLETE: 75,
  DAILY_LOGIN: 5,
  TASK_COMPLETE: 20,
};