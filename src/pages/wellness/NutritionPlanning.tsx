import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Apple, DollarSign, TrendingUp } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';

export default function NutritionPlanning() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();
  const [weeklyBudget, setWeeklyBudget] = useState('');

  const handlePlanNutrition = () => {
    if (weeklyBudget) {
      addXP(XP_ACTIONS.TASK_COMPLETE, 'Created nutrition plan');
      toast({
        title: 'Nutrition plan created!',
        description: `Budget-optimized plan for $${weeklyBudget}/week`,
      });
    }
  };

  const mealIdeas = [
    { name: 'Overnight Oats', cost: '$2.50', calories: 350, protein: '12g' },
    { name: 'Rice Bowl', cost: '$4.00', calories: 500, protein: '20g' },
    { name: 'Pasta Primavera', cost: '$3.50', calories: 450, protein: '15g' },
    { name: 'Smoothie Bowl', cost: '$3.00', calories: 280, protein: '10g' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-green))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-yellow))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-green))] to-[hsl(var(--neon-yellow))] flex items-center justify-center">
            <Apple className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--neon-yellow))] bg-clip-text text-transparent">
            Nutrition Planning
          </h1>
          <p className="text-xl text-muted-foreground">
            Optimized for student budgets
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card border-[hsl(var(--neon-green))]/30 shadow-lg shadow-[hsl(var(--neon-green))]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[hsl(var(--neon-green))]" />
                Set Your Weekly Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="e.g., 50"
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(e.target.value)}
                className="bg-background/50"
              />
              <Button 
                onClick={handlePlanNutrition}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--neon-yellow))] hover:opacity-90"
              >
                Generate Meal Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-[hsl(var(--neon-yellow))]/30">
            <CardHeader>
              <CardTitle>Budget-Friendly Meal Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mealIdeas.map((meal, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-green))]/20 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">{meal.calories} cal • {meal.protein} protein</p>
                    </div>
                    <span className="text-[hsl(var(--neon-green))] font-bold">{meal.cost}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
