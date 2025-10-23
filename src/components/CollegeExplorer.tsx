import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, SlidersHorizontal, Globe, BookOpen, Award } from "lucide-react";
import CollegeCard from './CollegeCard';
import { colleges } from '@/data/colleges';

const CollegeExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedRanking, setSelectedRanking] = useState('all');
  const [showScholarships, setShowScholarships] = useState(false);

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.programs.some(program => program.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRegion = selectedRegion === 'all' || 
                           (selectedRegion === 'usa' && college.location.includes('USA')) ||
                           (selectedRegion === 'uk' && college.location.includes('UK')) ||
                           (selectedRegion === 'asia' && (college.location.includes('Singapore') || college.location.includes('China'))) ||
                           (selectedRegion === 'europe' && (college.location.includes('Switzerland') || college.location.includes('UK')));

      const matchesRanking = selectedRanking === 'all' ||
                            (selectedRanking === 'top10' && college.ranking <= 10) ||
                            (selectedRanking === 'top25' && college.ranking <= 25);

      const matchesScholarships = !showScholarships || college.scholarshipAvailable;

      return matchesSearch && matchesRegion && matchesRanking && matchesScholarships;
    });
  }, [searchTerm, selectedRegion, selectedRanking, showScholarships]);

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'asia', label: 'Asia' },
    { value: 'europe', label: 'Europe' }
  ];

  const rankings = [
    { value: 'all', label: 'All Rankings' },
    { value: 'top10', label: 'Top 10' },
    { value: 'top25', label: 'Top 25' }
  ];

  return (
    <section id="colleges" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="bg-gradient-secondary text-white mb-4">
            <Globe className="w-4 h-4 mr-2" />
            200+ Partner Universities
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Discover Your
            <span className="block bg-gradient-to-r from-secondary-glow to-accent-glow bg-clip-text text-transparent">
              Dream College
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore top universities worldwide, compare programs, and find the perfect match for your academic journey.
            Each application completed earns you XP and unlocks new opportunities!
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card mb-8 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary" />
              <span>Find Your Perfect Match</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <Input
                  placeholder="Search colleges, programs, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-glass border-glass-border"
                />
              </div>

              {/* Region Filter */}
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="bg-glass border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ranking Filter */}
              <Select value={selectedRanking} onValueChange={setSelectedRanking}>
                <SelectTrigger className="bg-glass border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rankings.map(ranking => (
                    <SelectItem key={ranking.value} value={ranking.value}>
                      {ranking.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Scholarship Filter */}
              <Button
                variant={showScholarships ? "default" : "outline"}
                onClick={() => setShowScholarships(!showScholarships)}
                className={showScholarships ? "bg-gradient-accent" : ""}
              >
                <Award className="w-4 h-4 mr-2" />
                Scholarships
              </Button>
            </div>

            {/* Active Filters */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {searchTerm && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedRegion !== 'all' && (
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  {regions.find(r => r.value === selectedRegion)?.label}
                </Badge>
              )}
              {selectedRanking !== 'all' && (
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  {rankings.find(r => r.value === selectedRanking)?.label}
                </Badge>
              )}
              {showScholarships && (
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  Scholarships Available
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold">
              {filteredColleges.length} Universities Found
            </h3>
            <Badge variant="secondary" className="bg-gradient-primary text-white">
              <BookOpen className="w-3 h-3 mr-1" />
              +50 XP per application
            </Badge>
          </div>

          <Button variant="outline" className="hidden sm:flex">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college, index) => (
            <div
              key={college.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CollegeCard college={college} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or explore different regions.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedRanking('all');
                setShowScholarships(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="glass-card p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Ready to Start Your Applications?</h3>
              <p className="text-muted-foreground">
                Join thousands of students who have successfully navigated their college journey with CampusQuest.
                Start earning XP for every application milestone!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Create Your Profile
                </Button>
                <Button variant="outline">
                  Schedule a Consultation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CollegeExplorer;