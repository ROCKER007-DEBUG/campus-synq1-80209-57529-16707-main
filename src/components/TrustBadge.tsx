import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TrustBadgeProps {
  trustPoints: number;
  vouchesCount: number;
  liquidityScore: number;
}

export const TrustBadge = ({ trustPoints, vouchesCount, liquidityScore }: TrustBadgeProps) => {
  const getTrustLevel = () => {
    if (trustPoints >= 100) return { label: 'Trusted Expert', color: 'text-purple-400', icon: Award };
    if (trustPoints >= 50) return { label: 'Verified Helper', color: 'text-blue-400', icon: Shield };
    if (trustPoints >= 10) return { label: 'Active Member', color: 'text-green-400', icon: TrendingUp };
    return { label: 'New', color: 'text-muted-foreground', icon: Shield };
  };

  const trust = getTrustLevel();
  const Icon = trust.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${trust.color} bg-background/50 backdrop-blur border-current/20`}>
            <Icon className="w-3 h-3 mr-1" />
            {trust.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <div>Trust Points: {trustPoints}</div>
            <div>Vouches: {vouchesCount}</div>
            <div>Skill Liquidity: {liquidityScore}%</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
