import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Award, Calendar, FileText } from "lucide-react";
import CollegeExplorer from './CollegeExplorer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useXP } from "@/hooks/useXP";

const CampusSynqTabs = () => {
  const [activeTab, setActiveTab] = useState('colleges');
  const { toast } = useToast();
  const { addXP } = useXP();

  const scholarships = [
    {
      id: 1,
      title: "Merit-Based International Scholarship",
      amount: "$50,000",
      deadline: "March 15, 2025",
      eligibility: "GPA 3.8+, International Students",
      type: "Full Tuition"
    },
    {
      id: 2,
      title: "STEM Excellence Award",
      amount: "$25,000",
      deadline: "April 1, 2025",
      eligibility: "STEM Majors, GPA 3.5+",
      type: "Partial Tuition"
    },
    {
      id: 3,
      title: "Community Leadership Grant",
      amount: "$15,000",
      deadline: "February 28, 2025",
      eligibility: "Demonstrated Community Service",
      type: "Need-Based"
    }
  ];

  const events = [
    {
      id: 1,
      title: "College Fair 2025",
      date: "January 20, 2025",
      location: "Virtual",
      type: "Fair"
    },
    {
      id: 2,
      title: "Harvard Virtual Campus Tour",
      date: "January 25, 2025",
      location: "Online",
      type: "Tour"
    },
    {
      id: 3,
      title: "Financial Aid Workshop",
      date: "February 5, 2025",
      location: "Virtual",
      type: "Workshop"
    }
  ];

  const blogs = [
    {
      id: 1,
      title: "10 Tips for Writing Outstanding College Essays",
      author: "Sarah Johnson",
      date: "December 15, 2024",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "How to Choose the Right College for Your Major",
      author: "Michael Chen",
      date: "December 10, 2024",
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Navigating the Financial Aid Process",
      author: "Emily Rodriguez",
      date: "December 5, 2024",
      readTime: "6 min"
    }
  ];

  const handleApply = (scholarshipTitle: string) => {
    toast({
      title: "Application Started",
      description: `Starting application for ${scholarshipTitle}`,
    });
    addXP(15, 'Applied to Scholarship');
  };

  const handleRegister = (eventTitle: string) => {
    toast({
      title: "Registered Successfully",
      description: `You're registered for ${eventTitle}`,
    });
    addXP(10, 'Registered for Event');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="colleges" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span className="hidden sm:inline">Colleges</span>
        </TabsTrigger>
        <TabsTrigger value="scholarships" className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span className="hidden sm:inline">Scholarships</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
        <TabsTrigger value="blogs" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Blogs</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="colleges">
        <CollegeExplorer />
      </TabsContent>

      <TabsContent value="scholarships">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Available Scholarships</h2>
            <p className="text-muted-foreground">Find and apply for scholarships that match your profile</p>
          </div>

          <div className="grid gap-6">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="glass-card hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{scholarship.title}</CardTitle>
                      <Badge className="bg-gradient-secondary text-white">
                        {scholarship.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{scholarship.amount}</p>
                      <p className="text-xs text-muted-foreground">Award Amount</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Eligibility</p>
                      <p className="text-sm font-medium">{scholarship.eligibility}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                      <p className="text-sm font-medium">{scholarship.deadline}</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-secondary hover:opacity-90"
                    onClick={() => handleApply(scholarship.title)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="events">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">Join virtual tours, workshops, and college fairs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="glass-card hover-lift">
                <CardHeader>
                  <Badge className="w-fit mb-2">{event.type}</Badge>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => handleRegister(event.title)}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="blogs">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
            <p className="text-muted-foreground">Expert advice and insights for college admissions</p>
          </div>

          <div className="grid gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="glass-card hover-lift cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By {blog.author}</span>
                        <span>•</span>
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime} read</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CampusSynqTabs;
