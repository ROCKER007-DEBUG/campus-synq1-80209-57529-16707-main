import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useXP, XP_ACTIONS } from './useXP';

interface DatabaseFeature {
  id: string;
  feature_name: string;
  feature_type: string;
  description: string;
  icon_name: string;
  gradient_start: string;
  gradient_end: string;
  is_active: boolean;
  created_at: string;
}

export interface Feature extends DatabaseFeature {
  is_favorite: boolean;
}

export const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: features, error } = await supabase
        .from('features')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!user) {
        return (features as DatabaseFeature[]).map(f => ({ ...f, is_favorite: false })) as Feature[];
      }

      // Fetch user favorites
      const { data: userFeatures } = await supabase
        .from('user_features')
        .select('feature_id, is_favorite')
        .eq('user_id', user.id);

      const favoritesMap = new Map(
        userFeatures?.map(uf => [uf.feature_id, uf.is_favorite]) || []
      );

      return (features as DatabaseFeature[]).map(feature => ({
        ...feature,
        is_favorite: favoritesMap.get(feature.id) || false,
      })) as Feature[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addXP } = useXP();

  return useMutation({
    mutationFn: async ({ featureId, isFavorite }: { featureId: string; isFavorite: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('user_features')
        .select('id')
        .eq('user_id', user.id)
        .eq('feature_id', featureId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_features')
          .update({ is_favorite: isFavorite })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_features')
          .insert({
            user_id: user.id,
            feature_id: featureId,
            is_favorite: isFavorite,
            usage_count: 0,
          });
        if (error) throw error;
      }

      return { featureId, isFavorite };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast({
        title: data.isFavorite ? '⭐ Added to favorites!' : 'Removed from favorites',
        description: data.isFavorite ? '+5 XP' : undefined,
      });
      if (data.isFavorite) {
        addXP(5, 'Marked feature as favorite');
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
    },
  });
};

export const useTrackAccess = () => {
  const { addXP } = useXP();

  return useMutation({
    mutationFn: async (featureId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('user_features')
        .select('id, usage_count')
        .eq('user_id', user.id)
        .eq('feature_id', featureId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_features')
          .update({
            last_accessed: new Date().toISOString(),
            usage_count: existing.usage_count + 1,
          })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_features')
          .insert({
            user_id: user.id,
            feature_id: featureId,
            usage_count: 1,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      addXP(XP_ACTIONS.COLLEGE_VIEW, 'Explored a feature');
    },
  });
};
