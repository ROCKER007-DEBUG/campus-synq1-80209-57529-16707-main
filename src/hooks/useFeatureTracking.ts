import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFeatureTracking = () => {
  const [unusedFeatures, setUnusedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const features = [
    { name: 'marketplace', displayName: 'Skill Exchange' },
    { name: 'wellness', displayName: 'Wellness Tools' },
    { name: 'forum', displayName: 'Peer Support' },
    { name: 'synqai', displayName: 'Synq AI' },
  ];

  useEffect(() => {
    loadFeatureUsage();
  }, []);

  const loadFeatureUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('feature_usage')
        .select('feature_name')
        .eq('user_id', user.id);

      const usedFeatureNames = data?.map(f => f.feature_name) || [];
      const unused = features
        .filter(f => !usedFeatureNames.includes(f.name))
        .map(f => f.displayName);

      setUnusedFeatures(unused);
    } catch (error) {
      console.error('Error loading feature usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackFeatureUse = async (featureName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('feature_usage').upsert({
        user_id: user.id,
        feature_name: featureName,
        last_used_at: new Date().toISOString(),
        usage_count: 1,
      }, {
        onConflict: 'user_id,feature_name',
      });

      // Remove from unused features
      setUnusedFeatures(prev => prev.filter(f => 
        !features.find(feature => feature.name === featureName && feature.displayName === f)
      ));
    } catch (error) {
      console.error('Error tracking feature:', error);
    }
  };

  return { unusedFeatures, loading, trackFeatureUse };
};
