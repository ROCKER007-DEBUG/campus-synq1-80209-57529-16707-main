import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Users, ArrowLeft, Briefcase, Mail, Linkedin, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function AlumniPath() {
  const navigate = useNavigate();
  const [field, setField] = useState('');
  const [college, setCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [alumni, setAlumni] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!field || !college) {
      toast({
        title: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('alumni-discovery', {
        body: { field, college }
      });

      if (error) throw error;
      setAlumni(data.alumni || []);
    } catch (error) {
      console.error('Error fetching alumni data:', error);
      toast({
        title: 'Error loading alumni data',
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
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Connect with Success Stories</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Alumni Path Visualization
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover successful alumni from top universities and learn from their career journeys
            </p>
          </div>

          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle>Search Alumni</CardTitle>
              <CardDescription>
                Find alumni by career field and university to connect with mentors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Career Field</Label>
                  <Select value={field} onValueChange={setField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select career field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                      <SelectItem value="Arts & Media">Arts & Media</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">University</Label>
                  <Select value={college} onValueChange={setCollege}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MIT">MIT</SelectItem>
                      <SelectItem value="Stanford">Stanford University</SelectItem>
                      <SelectItem value="Harvard">Harvard University</SelectItem>
                      <SelectItem value="Berkeley">UC Berkeley</SelectItem>
                      <SelectItem value="Carnegie Mellon">Carnegie Mellon</SelectItem>
                      <SelectItem value="Oxford">Oxford University</SelectItem>
                      <SelectItem value="Cambridge">Cambridge University</SelectItem>
                      <SelectItem value="Caltech">Caltech</SelectItem>
                      <SelectItem value="Princeton">Princeton University</SelectItem>
                      <SelectItem value="Yale">Yale University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSearch} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching Alumni...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Find Alumni
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Alumni Results */}
          {alumni.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold">Featured Alumni ({alumni.length})</h2>
              
              {alumni.map((person, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{person.name}</CardTitle>
                          <CardDescription className="text-base">{person.currentRole}</CardDescription>
                        </div>
                      </div>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {person.graduationYear}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{person.bio}</p>
                    
                    {/* Career Path */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Career Journey
                      </h4>
                      <div className="space-y-2">
                        {person.careerPath?.map((role: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                            <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{role.title}</p>
                              <p className="text-sm text-muted-foreground">{role.company} • {role.years}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {person.email && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${person.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </a>
                        </Button>
                      )}
                      {person.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="ml-auto">
                        Request Mentorship
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
