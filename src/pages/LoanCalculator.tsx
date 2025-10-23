import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calculator, ArrowLeft, TrendingUp, DollarSign, Calendar, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function LoanCalculator() {
  const navigate = useNavigate();
  const [course, setCourse] = useState('');
  const [duration, setDuration] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [loanData, setLoanData] = useState<any>(null);
  const [calculation, setCalculation] = useState<any>(null);
  const { toast } = useToast();

  const handleGetEstimate = async () => {
    if (!course || !duration) {
      toast({
        title: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('loan-information', {
        body: { course, duration }
      });

      if (error) throw error;
      setLoanData(data);
      setLoanAmount(data.estimatedCost);
      setInterestRate(data.averageInterestRate);
    } catch (error) {
      console.error('Error fetching loan data:', error);
      toast({
        title: 'Error loading loan data',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(duration) * 12;

    if (isNaN(principal) || isNaN(rate) || isNaN(months)) {
      toast({
        title: 'Invalid input',
        description: 'Please enter valid numbers',
        variant: 'destructive',
      });
      return;
    }

    // Calculate monthly payment using formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
    const monthlyPayment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    setCalculation({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      months
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <Button
          onClick={() => navigate('/synq-finance')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to SYNQ Finance
        </Button>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full">
              <Calculator className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Smart Loan Planning</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Student Loan Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your student loan payments with real data from trusted lenders
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle>Course & Loan Details</CardTitle>
                <CardDescription>
                  Enter your course details to get estimated loan amounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course / Field</Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Nursing">Nursing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (years)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 years</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="4">4 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="6">6 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleGetEstimate} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Get Cost Estimate</>
                  )}
                </Button>

                {loanData && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <span>Estimated data based on {course}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleCalculate} className="w-full" variant="secondary">
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Payments
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Card */}
            <div className="space-y-6">
              {calculation && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-orange-500" />
                        <span className="text-4xl font-bold text-orange-500">
                          ${calculation.monthlyPayment}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        For {calculation.months} months
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">Total Loan Amount</span>
                        <span className="font-bold">${parseFloat(loanAmount).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">Total Interest</span>
                        <span className="font-bold text-red-500">${calculation.totalInterest}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <span className="text-sm font-medium">Total Repayment</span>
                        <span className="font-bold text-lg">${calculation.totalPayment}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {loanData?.lenders && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Trusted Lenders</CardTitle>
                        <CardDescription>Compare rates from these verified lenders</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {loanData.lenders.map((lender: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{lender.name}</span>
                              <span className="text-sm text-green-500 font-semibold">{lender.rate}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{lender.type}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {!calculation && (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Enter your course details and calculate to see loan estimates
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
