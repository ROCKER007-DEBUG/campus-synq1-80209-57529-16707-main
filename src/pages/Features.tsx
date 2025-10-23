import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeatureCard } from '@/components/FeatureCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useFeatures, useToggleFavorite, useTrackAccess } from '@/hooks/useFeatures';
import { supabase } from '@/integrations/supabase/client';

export default function Features() {
  const navigate = useNavigate();
  const { data: features, isLoading } = useFeatures();
  const toggleFavorite = useToggleFavorite();
  const trackAccess = useTrackAccess();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleToggleFavorite = (featureId: string, isFavorite: boolean) => {
    toggleFavorite.mutate({ featureId, isFavorite });
  };

  const handleExplore = (featureId: string) => {
    trackAccess.mutate(featureId);
    const feature = features?.find(f => f.id === featureId);
    if (feature?.feature_type === 'wellness') {
      navigate('/wellness');
    } else if (feature?.feature_type === 'support_hub') {
      navigate('/forum');
    } else if (feature?.feature_type === 'career') {
      navigate('/career-navigator');
    } else if (feature?.feature_type === 'financial') {
      navigate('/synq-finance');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-[1400px]">
        {/* Back to Home Button */}
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-8 group"
        >
          <Home className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            SYNQED
          </h1>
          <p className="text-xl text-muted-foreground">
            Synchronize Your Academic Journey
          </p>
        </div>

        {/* Features Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl p-8 bg-card/50 backdrop-blur-sm border border-glass-border">
                <Skeleton className="w-16 h-16 rounded-full mb-4" />
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : features && features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                id={feature.id}
                title={feature.feature_name}
                description={feature.description}
                iconName={feature.icon_name}
                gradientStart={feature.gradient_start}
                gradientEnd={feature.gradient_end}
                isFavorite={feature.is_favorite}
                onToggleFavorite={handleToggleFavorite}
                onExplore={handleExplore}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No features available at the moment.</p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styling */}
      <style>{`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: hsl(var(--background));
        }
        ::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
}
