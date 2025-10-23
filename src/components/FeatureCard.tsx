import { useState } from 'react';
import { Star, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  iconName: string;
  gradientStart: string;
  gradientEnd: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onExplore: (id: string) => void;
  index: number;
}

export const FeatureCard = ({
  id,
  title,
  description,
  iconName,
  gradientStart,
  gradientEnd,
  isFavorite,
  onToggleFavorite,
  onExplore,
  index,
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Get the icon component dynamically
  const IconComponent = (Icons as any)[iconName] || Icons.Circle;

  return (
    <div
      className={cn(
        "relative group rounded-2xl p-8 transition-all duration-300 ease-out",
        "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
        "border border-glass-border",
        "hover:scale-[1.03] hover:shadow-2xl",
        "animate-fade-in"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        boxShadow: isHovered
          ? `0 4px 6px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2), 0 0 30px ${gradientStart}40`
          : '0 4px 6px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action Buttons */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        {/* Back to Home Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/');
          }}
          className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2"
          aria-label="Back to home"
        >
          <Home className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </button>
        
        {/* Favorite Star */}
        <button
          onClick={() => onToggleFavorite(id, !isFavorite)}
          className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={cn(
              "w-6 h-6 transition-all duration-200",
              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
            )}
          />
        </button>
      </div>

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
        }}
      >
        <IconComponent className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground text-[15px] leading-relaxed mb-6 min-h-[120px]">
        {description}
      </p>

      {/* Explore Button */}
      <Button
        onClick={() => onExplore(id)}
        className="w-full h-12 text-base font-bold group/button relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
        }}
      >
        <span className="relative z-10">Explore</span>
        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover/button:translate-x-1 relative z-10" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200" />
      </Button>
    </div>
  );
};
