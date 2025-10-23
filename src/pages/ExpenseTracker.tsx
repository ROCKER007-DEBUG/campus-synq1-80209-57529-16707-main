import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Plus, TrendingDown, TrendingUp, Wallet, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ExpenseTracker() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');

  // Fetch expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expense_tracker')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (expense: any) => {
      const { error } = await supabase
        .from('expense_tracker')
        .insert(expense);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({ title: 'Entry added successfully!' });
      resetForm();
    }
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expense_tracker')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({ title: 'Entry deleted successfully!' });
    }
  });

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setType('expense');
    setDate(new Date());
    setNotes('');
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || !category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addExpenseMutation.mutate({
      title,
      amount: parseFloat(amount),
      category,
      type,
      date: format(date, 'yyyy-MM-dd'),
      notes
    });
  };

  // Calculate totals
  const totalIncome = expenses
    .filter((e: any) => e.type === 'income')
    .reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
  
  const totalExpense = expenses
    .filter((e: any) => e.type === 'expense')
    .reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
  
  const balance = totalIncome - totalExpense;

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

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your income and expenses synced with your academic calendar
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">${totalExpense.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className={balance >= 0 ? 'border-green-500/50' : 'border-red-500/50'}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Wallet className={`w-5 h-5 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${Math.abs(balance).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Entry Button */}
          <Button onClick={() => setShowAddForm(!showAddForm)} size="lg" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Entry
          </Button>

          {/* Add Entry Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Entry</CardTitle>
                <CardDescription>Track your income or expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={type} onValueChange={(value: any) => setType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Books & Supplies">Books & Supplies</SelectItem>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Salary">Salary</SelectItem>
                          <SelectItem value="Scholarship">Scholarship</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Lunch at cafeteria"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(date, 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={addExpenseMutation.isPending}>
                      {addExpenseMutation.isPending ? 'Adding...' : 'Add Entry'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Expenses List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No transactions yet. Add your first entry above!
                </p>
              ) : (
                <div className="space-y-2">
                  {expenses.map((expense: any) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            expense.type === 'income' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {expense.category}
                          </span>
                          <h4 className="font-semibold">{expense.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(expense.date), 'PPP')}
                        </p>
                        {expense.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{expense.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xl font-bold ${
                          expense.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {expense.type === 'income' ? '+' : '-'}${parseFloat(expense.amount).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExpenseMutation.mutate(expense.id)}
                          disabled={deleteExpenseMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
