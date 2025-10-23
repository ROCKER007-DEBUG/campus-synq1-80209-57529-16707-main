import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, ArrowLeft, Award, Calendar, DollarSign, ExternalLink, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export default function ScholarshipDiscovery() {
  const navigate = useNavigate();
  const [field, setField] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!field || !level) {
      toast({
        title: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scholarship-discovery', {
        body: { field, level }
      });

      if (error) throw error;
      setScholarships(data.scholarships || []);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast({
        title: 'Error loading scholarships',
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
            <div className="inline-flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">50,000+ Opportunities</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Scholarship Discovery Engine
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find scholarships and grants matched to your profile with real-time data from verified institutions
            </p>
          </div>

          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search Scholarships
              </CardTitle>
              <CardDescription>
                Filter scholarships by your field of study and education level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Select value={field} onValueChange={setField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STEM">STEM (Science, Technology, Engineering, Math)</SelectItem>
                      <SelectItem value="Business">Business & Economics</SelectItem>
                      <SelectItem value="Healthcare">Healthcare & Medicine</SelectItem>
                      <SelectItem value="Arts">Arts & Humanities</SelectItem>
                      <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Law">Law & Politics</SelectItem>
                      <SelectItem value="Any">Any Field</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Education Level</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="PhD">PhD / Doctorate</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSearch} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching Scholarships...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Find Scholarships
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {scholarships.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Available Scholarships ({scholarships.length})</h2>
                <span className="text-sm text-muted-foreground">Sorted by deadline</span>
              </div>
              
              {scholarships.map((scholarship, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{scholarship.name}</CardTitle>
                        <CardDescription className="text-base">{scholarship.organization}</CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        scholarship.status === 'Open' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-orange-500/20 text-orange-500'
                      }`}>
                        {scholarship.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{scholarship.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Award Amount</p>
                          <p className="font-bold">{scholarship.amount}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="font-bold">{scholarship.deadline}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Award className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Eligible</p>
                          <p className="font-bold">{scholarship.eligible}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {scholarship.requirements?.map((req: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button className="flex-1" asChild>
                        <a href={scholarship.applyLink} target="_blank" rel="noopener noreferrer">
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      <Button variant="outline">
                        Save for Later
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {scholarships.length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Search for scholarships above to see matching opportunities
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
