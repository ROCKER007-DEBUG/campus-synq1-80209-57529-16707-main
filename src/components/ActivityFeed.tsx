import { useActivityFeed } from '@/hooks/useActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Target, Brain, Heart, MessageSquare, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed = () => {
  const { activities, loading } = useActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'skill_swap':
        return <Target className="w-4 h-4" />;
      case 'challenge':
        return <Trophy className="w-4 h-4" />;
      case 'ai_usage':
        return <Brain className="w-4 h-4" />;
      case 'wellness':
        return <Heart className="w-4 h-4" />;
      case 'forum':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'skill_swap':
        return 'bg-blue-500';
      case 'challenge':
        return 'bg-yellow-500';
      case 'ai_usage':
        return 'bg-purple-500';
      case 'wellness':
        return 'bg-green-500';
      case 'forum':
        return 'bg-pink-500';
      default:
        return 'bg-primary';
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading activities...</p>
        </CardContent>
      </Card>
    );
  }

  // Get today's top movers (users with most XP today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayActivities = activities.filter(a => 
    new Date(a.created_at) >= today
  );

  const topMovers = todayActivities.reduce((acc, activity) => {
    const username = activity.profiles?.username || 'Anonymous';
    if (!acc[username]) {
      acc[username] = 0;
    }
    acc[username] += activity.xp_earned;
    return acc;
  }, {} as Record<string, number>);

  const topMoversList = Object.entries(topMovers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Live Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Top Movers */}
        {topMoversList.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Today's Top Movers
            </h4>
            <div className="space-y-1">
              {topMoversList.map(([username, xp], index) => (
                <div key={username} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                    <span className="font-medium">@{username}</span>
                  </span>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                    +{xp} XP
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Stream */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity. Be the first to make a move!
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                >
                  <div className={`w-8 h-8 ${getActivityColor(activity.activity_type)} rounded-lg flex items-center justify-center flex-shrink-0 text-white`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      @{activity.profiles?.username || 'Anonymous'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.activity_description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.xp_earned > 0 && (
                        <Badge variant="secondary" className="text-xs bg-gamification-xp/20 text-gamification-xp">
                          +{activity.xp_earned} XP
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
