import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description: string;
  xp_earned: number;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
  };
}

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
    subscribeToActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        // Fetch profiles separately
        const userIds = [...new Set(data.map(a => a.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        const activitiesWithProfiles = data.map(activity => ({
          ...activity,
          profiles: profileMap.get(activity.user_id) || null,
        }));

        setActivities(activitiesWithProfiles);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToActivities = () => {
    const channel = supabase
      .channel('user_activities')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activities',
        },
        async (payload) => {
          // Fetch the profile data for the new activity
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', payload.new.user_id)
            .single();

          const newActivity = {
            ...payload.new,
            profiles: profile,
          } as Activity;

          setActivities(prev => [newActivity, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const logActivity = async (activityType: string, description: string, xpEarned: number = 0) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: activityType,
        activity_description: description,
        xp_earned: xpEarned,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { activities, loading, logActivity };
};
