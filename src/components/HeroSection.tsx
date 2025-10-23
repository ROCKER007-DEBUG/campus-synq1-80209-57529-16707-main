import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, BookOpen, Target, Star, Zap, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-gradient-primary text-white px-4 py-2">
                🎮 Gamified Learning Experience
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Level Up Your
                <span className="block bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
                  College Journey
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Transform college prep into an epic quest! Discover colleges, earn scholarships, 
                connect with mentors, and unlock achievements on your path to academic success.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 hover-lift"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Your Quest
              </Button>
              
              <Button 
                variant="outline" 
                className="border-glass-border bg-glass backdrop-blur-sm text-lg px-8 py-6 hover-lift"
                size="lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Colleges
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-glow">50K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-secondary-glow">200+</div>
                <div className="text-sm text-muted-foreground">Partner Colleges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent-glow">$50M+</div>
                <div className="text-sm text-muted-foreground">Scholarships Won</div>
              </div>
            </div>
          </div>

          {/* Interactive Demo Card */}
          <div className="flex justify-center lg:justify-end animate-scale-in">
            <Card className="glass-card p-6 w-full max-w-md hover-lift">
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Alex Chen</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gradient-primary text-white text-xs">Level 12</Badge>
                      <span className="text-sm text-muted-foreground">Quest Master</span>
                    </div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>College Applications</span>
                      <span className="text-primary">8/10</span>
                    </div>
                    <Progress value={80} className="h-2 progress-glow" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Scholarship Essays</span>
                      <span className="text-secondary">5/7</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                </div>

                {/* Recent Achievement */}
                <div className="bg-gradient-card rounded-xl p-4 border border-glass-border">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Achievement Unlocked!</p>
                      <p className="text-xs text-muted-foreground">Scholarship Hunter - Applied to 5 scholarships</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" className="text-xs" size="sm">
                    <Users className="w-4 h-4 mr-1" />
                    Find Mentor
                  </Button>
                  <Button variant="secondary" className="text-xs" size="sm">
                    <Star className="w-4 h-4 mr-1" />
                    View Quests
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;