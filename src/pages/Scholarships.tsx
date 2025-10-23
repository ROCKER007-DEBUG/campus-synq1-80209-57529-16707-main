import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, GraduationCap, Award, Search, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const scholarships = [
  {
    id: 1,
    title: "Global Excellence Scholarship",
    provider: "International Education Foundation",
    amount: "$50,000",
    deadline: "March 15, 2024",
    eligibility: "Undergraduate students with 3.8+ GPA",
    description: "Full tuition scholarship for outstanding international students pursuing STEM fields.",
    type: "Merit-Based",
    level: "Undergraduate",
    field: "STEM",
    difficulty: "High"
  },
  {
    id: 2,
    title: "Future Leaders Grant",
    provider: "Leadership Development Council",
    amount: "$25,000",
    deadline: "April 1, 2024",
    eligibility: "High school seniors with leadership experience",
    description: "Supporting emerging leaders who demonstrate exceptional community service.",
    type: "Leadership",
    level: "High School",
    field: "Any",
    difficulty: "Medium"
  },
  {
    id: 3,
    title: "Innovation in Technology Award",
    provider: "Tech Giants Consortium",
    amount: "$75,000",
    deadline: "February 28, 2024",
    eligibility: "Computer Science majors with innovative projects",
    description: "Recognizing groundbreaking technological innovations by student developers.",
    type: "Innovation",
    level: "Undergraduate",
    field: "Computer Science",
    difficulty: "High"
  },
  {
    id: 4,
    title: "First-Generation College Student Grant",
    provider: "Access to Education Alliance",
    amount: "$15,000",
    deadline: "May 15, 2024",
    eligibility: "First-generation college students from low-income families",
    description: "Supporting first-generation students in their pursuit of higher education.",
    type: "Need-Based",
    level: "Any",
    field: "Any",
    difficulty: "Low"
  },
  {
    id: 5,
    title: "Women in Engineering Scholarship",
    provider: "Society of Women Engineers",
    amount: "$30,000",
    deadline: "March 30, 2024",
    eligibility: "Female students pursuing engineering degrees",
    description: "Empowering women to excel in engineering and technology fields.",
    type: "Diversity",
    level: "Undergraduate",
    field: "Engineering",
    difficulty: "Medium"
  },
  {
    id: 6,
    title: "Creative Arts Excellence Award",
    provider: "National Arts Foundation",
    amount: "$20,000",
    deadline: "April 10, 2024",
    eligibility: "Students with exceptional artistic portfolios",
    description: "Celebrating creativity and artistic expression in visual and performing arts.",
    type: "Merit-Based",
    level: "Any",
    field: "Arts",
    difficulty: "Medium"
  }
];

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const { toast } = useToast();

  const handleApply = (scholarshipTitle: string) => {
    toast({
      title: "Application Started!",
      description: `Starting application for ${scholarshipTitle}`,
    });
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = fieldFilter === "all" || scholarship.field.toLowerCase() === fieldFilter.toLowerCase();
    const matchesAmount = amountFilter === "all" || 
                         (amountFilter === "high" && parseInt(scholarship.amount.replace(/[^0-9]/g, '')) >= 30000) ||
                         (amountFilter === "medium" && parseInt(scholarship.amount.replace(/[^0-9]/g, '')) >= 15000 && parseInt(scholarship.amount.replace(/[^0-9]/g, '')) < 30000) ||
                         (amountFilter === "low" && parseInt(scholarship.amount.replace(/[^0-9]/g, '')) < 15000);
    
    return matchesSearch && matchesField && matchesAmount;
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      "Low": "bg-green-100 text-green-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "High": "bg-red-100 text-red-800"
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "Merit-Based": "bg-blue-100 text-blue-800",
      "Need-Based": "bg-purple-100 text-purple-800",
      "Leadership": "bg-orange-100 text-orange-800",
      "Innovation": "bg-pink-100 text-pink-800",
      "Diversity": "bg-teal-100 text-teal-800"
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
            Scholarship Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover funding opportunities to support your educational journey
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="stem">STEM</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="computer science">Computer Science</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
                <SelectItem value="any">Any Field</SelectItem>
              </SelectContent>
            </Select>

            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Award Amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="high">$30,000+</SelectItem>
                <SelectItem value="medium">$15,000 - $29,999</SelectItem>
                <SelectItem value="low">Under $15,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="glass-card hover-lift">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg leading-tight flex-1 pr-4">
                    {scholarship.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(scholarship.difficulty)}>
                    {scholarship.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-xl font-bold text-green-600">{scholarship.amount}</span>
                  </div>
                  <Badge className={getTypeColor(scholarship.type)}>
                    {scholarship.type}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-red-500" />
                    <span className="font-medium">Deadline: {scholarship.deadline}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{scholarship.level} • {scholarship.field}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Eligibility:</p>
                  <p className="text-sm">{scholarship.eligibility}</p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {scholarship.description}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-gradient-primary hover:opacity-90" 
                    size="sm"
                    onClick={() => handleApply(scholarship.title)}
                  >
                    Apply Now
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card text-center p-6">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold">$2.5M+</h3>
            <p className="text-muted-foreground">Total Awards</p>
          </Card>

          <Card className="glass-card text-center p-6">
            <GraduationCap className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-bold">1,200+</h3>
            <p className="text-muted-foreground">Recipients</p>
          </Card>

          <Card className="glass-card text-center p-6">
            <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">$35K</h3>
            <p className="text-muted-foreground">Average Award</p>
          </Card>

          <Card className="glass-card text-center p-6">
            <Filter className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">85%</h3>
            <p className="text-muted-foreground">Success Rate</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Scholarships;