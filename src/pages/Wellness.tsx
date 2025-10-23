import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Moon, Apple, Dumbbell, Shield, Calendar, Scale, AlertCircle, Home, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Wellness = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    }
  };

  const wellnessFeatures = [
    {
      title: 'Sleep Tracking',
      description: 'Correlate your sleep patterns with academic performance',
      icon: Moon,
      gradient: 'from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))]',
      glowColor: 'hsl(var(--neon-purple))',
      route: '/wellness/sleep-tracking',
    },
    {
      title: 'Nutrition Planning',
      description: 'Budget-optimized meal plans for students',
      icon: Apple,
      gradient: 'from-[hsl(var(--neon-green))] to-[hsl(var(--neon-yellow))]',
      glowColor: 'hsl(var(--neon-green))',
      route: '/wellness/nutrition',
    },
    {
      title: 'Gym Buddy Matching',
      description: 'Find workout partners on campus',
      icon: Dumbbell,
      gradient: 'from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-pink))]',
      glowColor: 'hsl(var(--neon-orange))',
      route: '/wellness/gym-buddy',
    },
    {
      title: 'Substance Awareness',
      description: 'Resources and support for healthy choices',
      icon: Shield,
      gradient: 'from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))]',
      glowColor: 'hsl(var(--neon-cyan))',
      route: '/wellness/substance-awareness',
    },
    {
      title: 'Social Calendar',
      description: 'Smart scheduling with academic workload awareness',
      icon: Calendar,
      gradient: 'from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-purple))]',
      glowColor: 'hsl(var(--neon-pink))',
      route: '/wellness/social-calendar',
    },
    {
      title: 'Work-Life Balance',
      description: 'Coaching for sustainable balance',
      icon: Scale,
      gradient: 'from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-green))]',
      glowColor: 'hsl(var(--neon-cyan))',
      route: '/wellness/work-life-balance',
    },
    {
      title: 'Burnout Detection',
      description: 'Early warning system and boundary setting',
      icon: AlertCircle,
      gradient: 'from-[hsl(var(--neon-orange))] to-[hsl(var(--neon-yellow))]',
      glowColor: 'hsl(var(--neon-orange))',
      route: '/wellness/burnout-detection',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--neon-purple))]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-cyan))]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[hsl(var(--neon-pink))]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">
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
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--neon-purple))] via-[hsl(var(--neon-pink))] to-[hsl(var(--neon-cyan))] bg-clip-text text-transparent">
            Wellness
          </h1>
          <p className="text-xl text-muted-foreground">
            Balance Mind, Body, and Academics
          </p>
        </div>

        {/* WellSync Feature Card */}
        <div className="relative group rounded-2xl p-8 transition-all duration-300 ease-out bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-[hsl(var(--neon-purple))]/30 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[hsl(var(--neon-purple))]/20 animate-fade-in mb-12">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))]"
          >
            <Heart className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <h2 className="text-3xl font-bold text-foreground mb-3">WellSync</h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            Comprehensive wellness ecosystem featuring sleep tracking correlated with academic performance, nutrition planning optimized for student budgets, campus gym schedules & workout buddy matching, substance abuse awareness resources, smart social event calendars, work-life balance coaching, and burnout detection tools.
          </p>

          <div className="text-sm text-muted-foreground">
            Explore the tools below to start your wellness journey
          </div>
        </div>

        {/* Wellness Feature Buttons */}
        <h2 className="text-2xl font-bold mb-6">Your Wellness Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wellnessFeatures.map((feature, index) => (
            <WellnessCard
              key={index}
              feature={feature}
              index={index}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Separate component for each wellness card to properly handle hover state
const WellnessCard = ({ feature, index, navigate }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = feature.icon;

  return (
    <div
      className={cn(
        "relative group rounded-2xl p-8 transition-all duration-300 ease-out cursor-pointer",
        "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
        "border border-glass-border",
        "hover:scale-[1.03] hover:shadow-2xl",
        "animate-fade-in"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        boxShadow: isHovered
          ? `0 4px 6px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2), 0 0 30px ${feature.glowColor}40`
          : '0 4px 6px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(feature.route)}
    >
      {/* Back to Home Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate('/');
        }}
        className="absolute top-6 right-6 z-10 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2"
        aria-label="Back to home"
      >
        <Home className="w-5 h-5 text-muted-foreground hover:text-foreground" />
      </button>

      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient}`}
      >
        <IconComponent className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
      <p className="text-muted-foreground text-[15px] leading-relaxed mb-6 min-h-[80px]">
        {feature.description}
      </p>

      {/* Explore Button */}
      <Button
        className={`w-full h-12 text-base font-bold group/button relative overflow-hidden bg-gradient-to-br ${feature.gradient} hover:opacity-90`}
      >
        <span className="relative z-10 text-white">Explore</span>
        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover/button:translate-x-1 relative z-10 text-white" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200" />
      </Button>
    </div>
  );
};

export default Wellness;
