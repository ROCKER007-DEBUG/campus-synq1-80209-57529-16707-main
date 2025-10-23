import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock, MessageCircle, Video, Users, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import CommunitySection from "@/components/CommunitySection";

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "MIT Professor & Startup Advisor",
    expertise: ["Computer Science", "AI/ML", "Entrepreneurship"],
    rating: 4.9,
    reviews: 127,
    location: "Boston, MA",
    availability: "Available",
    price: "$50/hour",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Prof. Michael Rodriguez",
    title: "Stanford Business School",
    expertise: ["Business", "Finance", "Leadership"],
    rating: 4.8,
    reviews: 89,
    location: "Palo Alto, CA",
    availability: "Busy",
    price: "$75/hour",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    title: "Harvard Medical School",
    expertise: ["Medicine", "Research", "Healthcare"],
    rating: 5.0,
    reviews: 203,
    location: "Cambridge, MA",
    availability: "Available",
    price: "$60/hour",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
  }
];

type MentorshipProps = {
  isPortalMode?: boolean;
};

const Mentorship = ({ isPortalMode = false }: MentorshipProps) => {
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleBookSession = (mentorName: string) => {
    toast({
      title: "Session Booked!",
      description: `Your mentorship session with ${mentorName} has been scheduled.`,
    });
  };

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={isPortalMode ? "" : "min-h-screen bg-gradient-page"}>
      {!isPortalMode && <Navigation />}
      
      <main className={`container mx-auto px-4 ${isPortalMode ? 'pt-0' : 'pt-24'} pb-16`}>
        <Tabs defaultValue="mentors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
            Find Your Perfect Mentor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with industry experts and academic professionals to guide your journey
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="glass-card hover-lift">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mentor.image} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground">{mentor.title}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({mentor.reviews} reviews)</span>
                    </div>
                  </div>

                  <Badge 
                    variant={mentor.availability === "Available" ? "default" : "secondary"}
                    className={mentor.availability === "Available" ? "bg-green-500" : ""}
                  >
                    {mentor.availability}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map((exp) => (
                      <Badge key={exp} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mentor.location}</span>
                  </div>
                  <span className="font-semibold text-primary">{mentor.price}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                    onClick={() => handleBookSession(mentor.name)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card text-center p-6">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-muted-foreground">Expert Mentors</p>
          </Card>

          <Card className="glass-card text-center p-6">
            <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-bold">10,000+</h3>
            <p className="text-muted-foreground">Hours of Mentorship</p>
          </Card>

          <Card className="glass-card text-center p-6">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">4.9/5</h3>
            <p className="text-muted-foreground">Average Rating</p>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="community">
            <CommunitySection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Mentorship;