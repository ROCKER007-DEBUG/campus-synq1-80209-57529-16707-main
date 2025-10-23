import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Star, Users, DollarSign, Calendar, ExternalLink, GraduationCap, Award, Clock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollegeCardProps {
  college: {
    id: number;
    name: string;
    location: string;
    ranking: number;
    logo: string;
    description: string;
    programs: string[];
    tuition: string;
    acceptanceRate: number;
    deadline: string;
    scholarshipAvailable: boolean;
    website: string;
    imageUrl: string;
  };
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleApplyNow = () => {
    toast({
      title: `Application Started for ${college.name}`,
      description: "Redirecting to application portal...",
    });
    // In a real app, this would redirect to the application system
    window.open(college.website, '_blank');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Card 
        className="glass-card hover-lift hover-glow group overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        {/* College Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={college.imageUrl} 
            alt={`${college.name} campus`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Ranking Badge */}
          <Badge className="absolute top-4 left-4 bg-gradient-primary text-white">
            #{college.ranking}
          </Badge>
          
          {/* Scholarship Badge */}
          {college.scholarshipAvailable && (
            <Badge className="absolute top-4 right-4 bg-gradient-secondary text-white">
              💰 Scholarships
            </Badge>
          )}

          {/* Logo */}
          <div className="absolute bottom-4 left-4">
            <div className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center">
              <img 
                src={college.logo} 
                alt={`${college.name} logo`}
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
        </div>

        <CardHeader className="pb-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
                {college.name}
              </h3>
              
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {college.location}
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {college.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Programs */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Popular Programs:</p>
            <div className="flex flex-wrap gap-1">
              {college.programs.slice(0, 3).map((program, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {program}
                </Badge>
              ))}
              {college.programs.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{college.programs.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Tuition</p>
                <p className="font-semibold">{college.tuition}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-secondary" />
              <div>
                <p className="text-muted-foreground">Accept Rate</p>
                <p className="font-semibold">{college.acceptanceRate}%</p>
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between p-3 bg-gradient-card rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Application Deadline</p>
                <p className="text-sm font-semibold">{college.deadline}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1 bg-gradient-primary hover:opacity-90" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyNow();
              }}
            >
              Apply Now
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="px-3"
              onClick={(e) => e.stopPropagation()}
              asChild
            >
              <a href={college.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Click for details hint */}
          <div className="pt-2 border-t border-glass-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Click card for details</span>
              <Badge variant="secondary" className="text-xs">
                View More →
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <img 
                src={college.logo} 
                alt={`${college.name} logo`}
                className="w-8 h-8 object-contain"
              />
              {college.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Hero Image */}
            <div className="relative h-40 rounded-lg overflow-hidden">
              <img 
                src={college.imageUrl} 
                alt={`${college.name} campus`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-gradient-primary text-white">
                  #{college.ranking} Worldwide
                </Badge>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{college.location}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Annual Tuition</span>
                </div>
                <p className="text-sm font-semibold ml-6">{college.tuition}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Acceptance Rate</span>
                </div>
                <p className="text-sm font-semibold ml-6">{college.acceptanceRate}%</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Application Deadline</span>
                </div>
                <p className="text-sm font-semibold ml-6">{college.deadline}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">About {college.name}</h4>
              <p className="text-sm text-muted-foreground">{college.description}</p>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Academic Programs
              </h4>
              <div className="flex flex-wrap gap-2">
                {college.programs.map((program, index) => (
                  <Badge key={index} variant="secondary">
                    {program}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Scholarships */}
            {college.scholarshipAvailable && (
              <div className="p-4 bg-gradient-card rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-secondary" />
                  <h4 className="font-semibold">Scholarships Available</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  This university offers various scholarship opportunities for qualified students.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                className="flex-1 bg-gradient-primary hover:opacity-90"
                onClick={handleApplyNow}
              >
                Apply Now
              </Button>
              <Button variant="outline" asChild>
                <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CollegeCard;