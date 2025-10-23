import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, TrendingUp, ArrowLeft, Briefcase, DollarSign, GraduationCap, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function MajorCareerMapping() {
  const navigate = useNavigate();
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!major) {
      toast({
        title: 'Please select a major',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('major-career-mapping', {
        body: { major }
      });

      if (error) throw error;
      setResults(data);
    } catch (error) {
      console.error('Error fetching career data:', error);
      toast({
        title: 'Error loading career data',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <Button
          onClick={() => navigate('/career-navigator')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Career Navigator
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">AI-Powered Career Insights</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Major-to-Career Mapping
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover career paths, salary ranges, required education, and job market trends for your chosen major
            </p>
          </div>

          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Major</CardTitle>
              <CardDescription>
                Choose a major to explore detailed career paths, salary data, and educational requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="major">Major / Field of Study</Label>
                <Select value={major} onValueChange={setMajor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a major" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Psychology">Psychology</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="English Literature">English Literature</SelectItem>
                    <SelectItem value="Political Science">Political Science</SelectItem>
                    <SelectItem value="Nursing">Nursing</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Communications">Communications</SelectItem>
                    <SelectItem value="Sociology">Sociology</SelectItem>
                    <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                    <SelectItem value="Architecture">Architecture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSearch} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Career Data...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Explore Career Paths
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <div className="space-y-6 animate-fade-in">
              {/* Career Paths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Top Career Paths
                  </CardTitle>
                  <CardDescription>Most common careers for {major} graduates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.careers?.map((career: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{career.title}</h4>
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Salary Range</p>
                            <p className="font-semibold">{career.salary}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <BarChart className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Job Growth</p>
                            <p className="font-semibold">{career.growth}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education & Skills Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Required Education</h4>
                    <p className="text-muted-foreground">{results.education}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Essential Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.skills?.map((skill: string, index: number) => (
                        <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Job Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{results.marketTrends}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
