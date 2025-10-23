import { useState, useEffect } from 'react';
import { X, Sparkles, Target, Brain, Heart, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFeatureTracking } from '@/hooks/useFeatureTracking';

export const FeatureDiscoveryPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { unusedFeatures } = useFeatureTracking();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has dismissed popup in this session
    const dismissed = sessionStorage.getItem('feature_popup_dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show popup after 90 seconds or on inactivity
    const showTimer = setTimeout(() => {
      if (unusedFeatures.length > 0) {
        setIsVisible(true);
      }
    }, 90000); // 1.5 minutes

    // Inactivity detector
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!isDismissed && unusedFeatures.length > 0) {
          setIsVisible(true);
        }
      }, 120000); // 2 minutes of inactivity
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    resetInactivityTimer();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
    };
  }, [unusedFeatures, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('feature_popup_dismissed', 'true');
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('Skill')) return <Target className="w-5 h-5" />;
    if (feature.includes('Wellness')) return <Heart className="w-5 h-5" />;
    if (feature.includes('Support')) return <MessageSquare className="w-5 h-5" />;
    if (feature.includes('AI')) return <Brain className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const getFeatureRoute = (feature: string) => {
    if (feature.includes('Skill')) return '/marketplace';
    if (feature.includes('Wellness')) return '/wellness';
    if (feature.includes('Support')) return '/forum';
    return '/';
  };

  const handleExplore = (feature: string) => {
    navigate(getFeatureRoute(feature));
    handleDismiss();
  };

  if (!isVisible || unusedFeatures.length === 0) return null;

  const suggestedFeature = unusedFeatures[0];

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <Card className="glass-card w-80 p-4 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
            {getFeatureIcon(suggestedFeature)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Discover {suggestedFeature}! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">
              {suggestedFeature.includes('Skill') && 
                "Connect with peers to exchange skills and grow together!"}
              {suggestedFeature.includes('Wellness') && 
                "Track your mood and practice mindfulness for better well-being!"}
              {suggestedFeature.includes('Support') && 
                "Join our supportive community and share your experiences!"}
              {suggestedFeature.includes('AI') && 
                "Get personalized guidance from our AI assistant!"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleExplore(suggestedFeature)}
            className="flex-1 bg-gradient-primary hover:opacity-90"
            size="sm"
          >
            Explore Now
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
          >
            Later
          </Button>
        </div>

        {unusedFeatures.length > 1 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            +{unusedFeatures.length - 1} more feature{unusedFeatures.length > 2 ? 's' : ''} to discover
          </p>
        )}
      </Card>
    </div>
  );
};
