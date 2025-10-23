import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, User, MessageCircle, Star, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useFeatureTracking } from '@/hooks/useFeatureTracking';
import { ActivityFeed } from '@/components/ActivityFeed';
import { useXP } from '@/hooks/useXP';
import { MicroChallenges } from '@/components/MicroChallenges';
import { ExchangeTimer } from '@/components/ExchangeTimer';
import Navigation from '@/components/Navigation';

const Marketplace = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillLevelFilter, setSkillLevelFilter] = useState<string>('all');
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    type: 'offer',
    category: 'tutoring',
    skill_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    location: '',
    availability: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logActivity } = useActivityFeed();
  const { trackFeatureUse } = useFeatureTracking();
  const { addXP } = useXP();

  useEffect(() => {
    checkAuth();
    loadListings();
    trackFeatureUse('marketplace');
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    }
  };

  const loadListings = async () => {
    try {
      const { data } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          profiles (username, full_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const createListing = async () => {
    if (!newListing.title || !newListing.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('marketplace_listings')
        .insert({
          user_id: user.id,
          title: newListing.title,
          description: newListing.description,
          listing_type: newListing.type,
          category: newListing.category,
          skill_level: newListing.skill_level,
          location: newListing.location,
          availability: newListing.availability,
        });

      if (error) throw error;

      toast({
        title: "Listing created!",
        description: "Your listing is now live.",
      });

      // Log activity and award XP
      const xp = 30;
      addXP(xp, 'Created marketplace listing');
      await logActivity(
        'skill_swap',
        `Posted a ${newListing.type === 'offer' ? 'skill offer' : 'learning request'}: ${newListing.title}`,
        xp
      );

      setShowForm(false);
      setNewListing({ 
        title: '', 
        description: '', 
        type: 'offer', 
        category: 'tutoring',
        skill_level: 'beginner',
        location: '',
        availability: '',
      });
      loadListings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = skillLevelFilter === 'all' || listing.skill_level === skillLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const offerListings = filteredListings.filter(l => l.listing_type === 'offer');
  const needListings = filteredListings.filter(l => l.listing_type === 'need');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">Peer Exchange Marketplace</h1>

            <Tabs defaultValue="exchange" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="exchange">Skill Exchange</TabsTrigger>
                <TabsTrigger value="challenges">
                  <Zap className="w-4 h-4 mr-2" />
                  Micro Challenges
                </TabsTrigger>
                <TabsTrigger value="timer">
                  <Clock className="w-4 h-4 mr-2" />
                  Timer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="exchange" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Skill Exchange</h2>
                  <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Listing
                  </Button>
                </div>

            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={skillLevelFilter} onValueChange={setSkillLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

        {/* Create Listing Form */}
        {showForm && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Create New Listing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Title (e.g., Python Tutoring Available)"
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Skill Level</label>
                  <Select 
                    value={newListing.skill_level} 
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setNewListing({ ...newListing, skill_level: value })
                    }
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Location (optional)"
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                />
              </div>
              <Input
                placeholder="Availability (e.g., Weekends, Evenings)"
                value={newListing.availability}
                onChange={(e) => setNewListing({ ...newListing, availability: e.target.value })}
              />
              <div className="flex gap-2">
                <Button
                  variant={newListing.type === 'offer' ? 'default' : 'outline'}
                  onClick={() => setNewListing({ ...newListing, type: 'offer' })}
                >
                  Offering
                </Button>
                <Button
                  variant={newListing.type === 'need' ? 'default' : 'outline'}
                  onClick={() => setNewListing({ ...newListing, type: 'need' })}
                >
                  Looking For
                </Button>
              </div>
              <Button onClick={createListing} className="w-full">Create Listing</Button>
            </CardContent>
          </Card>
        )}

        {/* Listings */}
        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="offers">Offers ({offerListings.length})</TabsTrigger>
            <TabsTrigger value="needs">Looking For ({needListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-4 mt-4">
            {offerListings.map((listing) => (
              <Card key={listing.id} className="glass-card hover-lift group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-green-500 text-white">Offering</Badge>
                        {listing.skill_level && (
                          <Badge variant="outline" className="capitalize">
                            <Star className="w-3 h-3 mr-1" />
                            {listing.skill_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{listing.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="font-medium">@{listing.profiles?.username}</span>
                    </div>
                    {listing.location && (
                      <p className="text-sm text-muted-foreground">📍 {listing.location}</p>
                    )}
                    {listing.availability && (
                      <p className="text-sm text-muted-foreground">🕐 {listing.availability}</p>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-primary hover:opacity-90 opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Request Skill Swap
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="needs" className="space-y-4 mt-4">
            {needListings.map((listing) => (
              <Card key={listing.id} className="glass-card hover-lift group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-blue-500 text-white">Looking For</Badge>
                        {listing.skill_level && (
                          <Badge variant="outline" className="capitalize">
                            <Star className="w-3 h-3 mr-1" />
                            {listing.skill_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{listing.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="font-medium">@{listing.profiles?.username}</span>
                    </div>
                    {listing.location && (
                      <p className="text-sm text-muted-foreground">📍 {listing.location}</p>
                    )}
                    {listing.availability && (
                      <p className="text-sm text-muted-foreground">🕐 {listing.availability}</p>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-primary hover:opacity-90 opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Offer Help
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="challenges">
                <MicroChallenges />
              </TabsContent>

              <TabsContent value="timer">
                <div className="max-w-2xl mx-auto">
                  <ExchangeTimer />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;