import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Users, ArrowRight, Home, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function CareerNavigator() {
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
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
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

          <div className="mb-8 inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-lg font-semibold">Career Navigator</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Navigate Your Future
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover your ideal career path with AI-powered insights, explore major-to-career mappings with real salary data, and connect with alumni who've walked your path.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => document.querySelector('.section:nth-child(2)')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Aptitude Test Section */}
      <section className="section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">AI-Powered Assessment</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Aptitude Test
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Take our comprehensive aptitude test powered by advanced AI to discover your strengths, interests, and ideal career paths. Our algorithm analyzes 15 key dimensions including:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Personality traits and work preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Technical aptitudes and skill alignment</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Career motivation factors and values</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Learning styles and growth potential</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate('/aptitude-test')} className="group">
                Take the Test
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <Card className="border-2 shadow-2xl">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop" 
                  alt="Student taking aptitude test"
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <span className="font-medium">Test Duration</span>
                    <span className="text-muted-foreground">10-15 minutes</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <span className="font-medium">Questions</span>
                    <span className="text-muted-foreground">15 comprehensive</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <span className="font-medium">Results</span>
                    <span className="text-muted-foreground">Instant AI analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Major to Career Mapping Section */}
      <section className="section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="border-2 shadow-2xl order-2 md:order-1">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" 
                  alt="Career mapping and salary data"
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Computer Science</span>
                      <span className="text-sm text-muted-foreground">→ Software Engineer</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$85k - $180k/year</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Business Admin</span>
                      <span className="text-sm text-muted-foreground">→ Product Manager</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$90k - $160k/year</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Biology</span>
                      <span className="text-sm text-muted-foreground">→ Medical Doctor</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$200k - $400k/year</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">Real-Time Data</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Major-to-Career Mapping
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore comprehensive career pathways for every major with real-time salary data, job market trends, and growth projections. Our AI continuously updates information from:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">200+ career paths across all industries</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Real salary ranges from verified sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Required education and skill pathways</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Job market demand and growth forecasts</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate('/major-career-mapping')} className="group">
                Explore Careers
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Path Visualization Section */}
      <section className="section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Connect with Success Stories</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Alumni Path Visualization
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover the career journeys of successful alumni from top universities worldwide. Learn from those who've walked your path and connect with mentors who can guide your journey. Features include:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Search alumni by college, major, and career field</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">View detailed career progression timelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Get contact information for mentorship opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Virtual career shadowing experiences</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate('/alumni-path')} className="group">
                Discover Alumni
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <Card className="border-2 shadow-2xl">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                  alt="Alumni networking and career paths"
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold mb-1">Featured Alumni</h4>
                    <p className="text-sm text-muted-foreground">Connect with 10,000+ successful professionals from top universities worldwide</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-semibold mb-1">Career Fields</h4>
                    <p className="text-sm text-muted-foreground">Technology, Healthcare, Business, Finance, Engineering, Arts, and more</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
