import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';

export default function SocialCalendar() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();

  const handleAddEvent = () => {
    addXP(XP_ACTIONS.EVENT_RSVP, 'Added social event');
    toast({
      title: 'Event added!',
      description: 'We\'ll check for academic workload conflicts',
    });
  };

  const upcomingEvents = [
    { name: 'Study Group', date: 'Today, 4 PM', conflict: false },
    { name: 'Campus Party', date: 'Friday, 8 PM', conflict: true, reason: 'Midterm on Saturday' },
    { name: 'Workshop', date: 'Monday, 2 PM', conflict: false },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-pink))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-purple))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/wellness')}
          className="mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wellness
        </Button>

        <div className="mb-12 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-purple))] flex items-center justify-center">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-purple))] bg-clip-text text-transparent">
            Smart Social Calendar
          </h1>
          <p className="text-xl text-muted-foreground">
            Balance social life with academic workload
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card border-[hsl(var(--neon-pink))]/30 shadow-lg shadow-[hsl(var(--neon-pink))]/20">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${event.conflict ? 'bg-destructive/10 border-destructive/30' : 'bg-background/50 border-[hsl(var(--neon-purple))]/20'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{event.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {event.date}
                      </p>
                      {event.conflict && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-2">
                          <AlertTriangle className="w-3 h-3" />
                          {event.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                onClick={handleAddEvent}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-purple))] hover:opacity-90"
              >
                Add New Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
