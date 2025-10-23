import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Search, Calculator, BookOpen, ArrowRight, Home, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function SynqFinance() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
    };
    checkAuth();

    const handleScroll = () => {
      const sections = document.querySelectorAll('.section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="section relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <Button
            onClick={() => navigate('/features')}
            variant="ghost"
            className="absolute top-4 left-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Features
          </Button>

          <div className="mb-8 inline-flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-full">
            <DollarSign className="w-6 h-6 text-green-500 animate-pulse" />
            <span className="text-lg font-semibold">SYNQ Finance</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Master Your Finances
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Complete student financial management platform. Track expenses, discover scholarships, calculate loans, and share resources—all synchronized with your academic life.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => document.querySelector('.section:nth-child(2)')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Expense Tracking Section */}
      <section className="section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full">
                <Wallet className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Smart Budget Management</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Expense Tracking
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Track every dollar with our intelligent expense tracker synced perfectly with your academic calendar. Plan your budget around exams, breaks, and semester schedules. Features include:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Category-based expense organization (food, books, rent, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Academic calendar integration with semester planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Income tracking and budget allocation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Visual spending insights and monthly reports</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate('/expense-tracker')} className="group">
                Start Tracking
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <Card className="border-2 shadow-2xl">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop" 
                  alt="Expense tracking dashboard"
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <p className="text-2xl font-bold text-blue-500">$2,450</p>
                    <p className="text-sm text-muted-foreground">Monthly Budget</p>
                  </div>
                  <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                    <p className="text-2xl font-bold text-green-500">$450</p>
                    <p className="text-sm text-muted-foreground">Saved This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scholarship Discovery Section */}
      <section className="section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="border-2 shadow-2xl order-2 md:order-1">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop" 
                  alt="Scholarship opportunities"
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Merit Scholarship</span>
                      <span className="text-sm bg-purple-500/20 px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-500">$10,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Deadline: June 30, 2025</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">STEM Grant</span>
                      <span className="text-sm bg-blue-500/20 px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-500">$5,000</p>
                    <p className="text-xs text-muted-foreground mt-1">Deadline: July 15, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full">
                <Search className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">AI-Powered Discovery</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Scholarship & Grant Discovery
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Access our comprehensive database of 50,000+ scholarships and grants. Our AI matches you with opportunities based on your profile, academic achievements, and interests. Features include:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Real-time scholarship database from verified institutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Personalized matching based on your profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Deadline tracking and application reminders</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Success tips and application guidance</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate('/scholarship-discovery')} className="group">
                Find Scholarships
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Loan Calculator Section */}
      <section className="section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full">
                <Calculator className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Plan Your Future</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Student Loan Calculator
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Make informed decisions about student loans with our comprehensive calculator. Compare trusted lenders, estimate monthly payments, and visualize repayment schedules. Features include:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Real interest rates from verified lenders</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Course and field-specific cost estimates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Multiple repayment simulation scenarios</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Comparison of federal vs private loans</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate('/loan-calculator')} className="group">
                Calculate Loans
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <Card className="border-2 shadow-2xl">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop" 
                  alt="Student loan calculation"
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-sm text-muted-foreground mb-2">Estimated Loan Amount</p>
                    <p className="text-3xl font-bold text-orange-500">$45,000</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                      <p className="text-lg font-bold">4.5%</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                      <p className="text-lg font-bold">$465</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Books Marketplace Section */}
      <section className="section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="border-2 shadow-2xl order-2 md:order-1">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop" 
                  alt="Books sharing marketplace"
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Calculus Textbook</span>
                      <span className="text-sm bg-green-500/20 px-2 py-1 rounded">Available</span>
                    </div>
                    <p className="text-lg font-bold text-green-500">$15.00</p>
                    <p className="text-xs text-muted-foreground mt-1">Digital PDF • 850 pages</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Biology Essentials</span>
                      <span className="text-sm bg-blue-500/20 px-2 py-1 rounded">Available</span>
                    </div>
                    <p className="text-lg font-bold text-blue-500">$20.00</p>
                    <p className="text-xs text-muted-foreground mt-1">Online Access • Full Course</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full">
                <BookOpen className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Community Sharing</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Books Cost-Sharing Marketplace
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Save money on textbooks by sharing digital resources with fellow students. Upload books you own and earn from students who need them, or purchase access to books at a fraction of the original cost. Features include:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Upload and share your digital textbooks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Access thousands of textbooks at low cost</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Secure payment system and content protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Give tickets to share, Get tickets to access</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate('/books-marketplace')} className="group">
                Browse Marketplace
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
