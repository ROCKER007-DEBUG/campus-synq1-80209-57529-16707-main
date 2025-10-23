import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Apple, DollarSign, Loader2, ShoppingCart, TrendingDown, Home } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function NutritionPlanning() {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { toast } = useToast();
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  const handlePlanNutrition = async () => {
    if (!budget || !location.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter your budget and location',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to create a nutrition plan',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nutrition-planning`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ budget, currency, location }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const result = await response.json();
      setMealPlan(result.mealPlan);

      await supabase.from('nutrition_plans').insert({
        user_id: session.user.id,
        budget: parseFloat(budget),
        currency,
        location,
        meal_plan: result.mealPlan,
      });

      addXP(XP_ACTIONS.TASK_COMPLETE, 'Created nutrition plan');
      toast({
        title: 'Nutrition plan created!',
        description: `Budget-optimized plan for ${budget} ${currency}/week`,
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate meal plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-green))]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-yellow))]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/wellness')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wellness
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-primary/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Weekly Budget</label>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-background/50"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Currency</label>
                  <Select value={currency} onValueChange={setCurrency} disabled={loading}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Your Location</label>
                <Input
                  type="text"
                  placeholder="e.g., New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-background/50"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handlePlanNutrition}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--neon-yellow))] hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Meal Plan...
                  </>
                ) : (
                  'Generate Meal Plan'
                )}
              </Button>
            </CardContent>
          </Card>

          {mealPlan && (
            <>
              <Card className="glass-card border-[hsl(var(--neon-yellow))]/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Apple className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
                      Weekly Meal Plan
                    </span>
                    <span className="text-lg text-[hsl(var(--neon-green))]">
                      Total: {getCurrencySymbol(currency)}{mealPlan.totalWeeklyCost?.toFixed(2) || 0}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mealPlan.weeklyPlan?.map((day: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-green))]/20">
                        <h3 className="font-semibold text-lg mb-3">{day.day}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Breakfast:</span>
                            <div className="text-right">
                              <p className="font-medium">{day.meals?.breakfast?.name}</p>
                              <p className="text-xs text-[hsl(var(--neon-green))]">{getCurrencySymbol(currency)}{day.meals?.breakfast?.cost?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lunch:</span>
                            <div className="text-right">
                              <p className="font-medium">{day.meals?.lunch?.name}</p>
                              <p className="text-xs text-[hsl(var(--neon-green))]">{getCurrencySymbol(currency)}{day.meals?.lunch?.cost?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dinner:</span>
                            <div className="text-right">
                              <p className="font-medium">{day.meals?.dinner?.name}</p>
                              <p className="text-xs text-[hsl(var(--neon-green))]">{getCurrencySymbol(currency)}{day.meals?.dinner?.cost?.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[hsl(var(--neon-green))]/20">
                          <p className="text-sm font-semibold flex justify-between">
                            <span>Daily Total:</span>
                            <span className="text-[hsl(var(--neon-green))]">{getCurrencySymbol(currency)}{day.totalCost?.toFixed(2) || 0}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-[hsl(var(--neon-green))]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[hsl(var(--neon-green))]" />
                    Shopping List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mealPlan.shoppingList?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-background/50 border border-[hsl(var(--neon-green))]/20">
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity}</p>
                        </div>
                        <span className="text-[hsl(var(--neon-green))] font-semibold">
                          {getCurrencySymbol(currency)}{item.estimatedCost?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {mealPlan.savingTips && mealPlan.savingTips.length > 0 && (
                <Card className="glass-card border-[hsl(var(--neon-yellow))]/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-[hsl(var(--neon-yellow))]" />
                      Money-Saving Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {mealPlan.savingTips.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[hsl(var(--neon-green))]">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {mealPlan.localStores && mealPlan.localStores.length > 0 && (
                <Card className="glass-card border-[hsl(var(--neon-green))]/30">
                  <CardHeader>
                    <CardTitle>Affordable Stores Near You</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {mealPlan.localStores.map((store: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 p-2 rounded bg-background/50">
                          <span className="text-[hsl(var(--neon-green))]">•</span>
                          <span>{store}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
