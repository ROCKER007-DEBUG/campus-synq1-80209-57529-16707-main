import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ExternalLink, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const events = [
  {
    id: 1,
    title: "Harvard Virtual College Fair",
    date: "2024-02-15",
    time: "2:00 PM - 5:00 PM EST",
    location: "Virtual Event",
    type: "College Fair",
    attendees: 1240,
    description: "Meet admissions officers from top universities and learn about application requirements.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Stanford Entrepreneurship Workshop",
    date: "2024-02-18",
    time: "1:00 PM - 4:00 PM PST",
    location: "Stanford, CA",
    type: "Workshop",
    attendees: 85,
    description: "Learn about startup fundamentals and pitch your ideas to industry experts.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "MIT AI & Machine Learning Symposium",
    date: "2024-02-22",
    time: "10:00 AM - 6:00 PM EST",
    location: "Cambridge, MA",
    type: "Symposium",
    attendees: 450,
    description: "Explore cutting-edge research in AI and connect with leading researchers.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Global Scholarship Application Workshop",
    date: "2024-02-25",
    time: "11:00 AM - 1:00 PM EST",
    location: "Virtual Event",
    type: "Workshop",
    attendees: 2100,
    description: "Get expert tips on writing compelling scholarship essays and applications.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Oxford University Information Session",
    date: "2024-03-01",
    time: "3:00 PM - 4:30 PM GMT",
    location: "Virtual Event",
    type: "Info Session",
    attendees: 890,
    description: "Learn about Oxford's unique tutorial system and application process.",
    image: "https://images.unsplash.com/photo-1520637736862-4d197d17c35a?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Medical School Prep Bootcamp",
    date: "2024-03-05",
    time: "9:00 AM - 5:00 PM EST",
    location: "New York, NY",
    type: "Bootcamp",
    attendees: 150,
    description: "Intensive preparation for MCAT and medical school applications.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop"
  }
];

const Events = () => {
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const handleRSVP = (eventTitle: string) => {
    toast({
      title: "RSVP Confirmed!",
      description: `You've registered for ${eventTitle}`,
    });
  };

  const filteredEvents = events.filter(event => 
    filter === "all" || event.type.toLowerCase().includes(filter.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors = {
      "College Fair": "bg-blue-100 text-blue-800",
      "Workshop": "bg-green-100 text-green-800",
      "Symposium": "bg-purple-100 text-purple-800",
      "Info Session": "bg-yellow-100 text-yellow-800",
      "Bootcamp": "bg-red-100 text-red-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
            Upcoming Events
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join exclusive events, workshops, and networking opportunities
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by type:</span>
            {["all", "college fair", "workshop", "symposium", "info session", "bootcamp"].map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type)}
                className={filter === type ? "bg-gradient-primary" : ""}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="glass-card hover-lift overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <Badge className={`absolute top-4 right-4 ${getTypeColor(event.type)}`}>
                  {event.type}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-secondary" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-accent" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{event.attendees.toLocaleString()} attending</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-gradient-primary hover:opacity-90" 
                    size="sm"
                    onClick={() => handleRSVP(event.title)}
                  >
                    RSVP
                  </Button>
                  
                  <Button variant="outline" size="sm" className="px-3">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="glass-card text-center p-8 mt-12">
          <h3 className="text-2xl font-bold mb-4">Don't Miss Out!</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter to get notified about upcoming events
          </p>
          <Button className="bg-gradient-primary hover:opacity-90">
            Subscribe Now
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Events;