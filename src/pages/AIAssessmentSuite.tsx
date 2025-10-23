import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, Key, GraduationCap, Clock, FileCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIAssessmentSuite = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    timeSaved: "~3 hrs",
    papersGenerated: 0,
    studentsGraded: 0
  });

  const features = [
    {
      icon: FileText,
      title: "Question Paper Generator",
      description: "AI-powered question paper creation with customizable difficulty, time limits, and mark allocation",
      gradient: "from-teal-500 to-cyan-500",
      action: "Get Started"
    },
    {
      icon: Key,
      title: "Answer Key Generator",
      description: "Automatically generate comprehensive answer keys from your question papers",
      gradient: "from-blue-500 to-indigo-500",
      action: "Get Started"
    },
    {
      icon: GraduationCap,
      title: "Auto-Grader",
      description: "Intelligent grading system with partial scoring and detailed feedback for students",
      gradient: "from-purple-500 to-pink-500",
      action: "Get Started"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/home')}
          variant="outline"
          className="mb-8 group"
        >
          <Home className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-medium text-foreground">AI Assessment Suite</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to Your AI Assessment Suite
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform hours of manual work into minutes with AI-powered exam creation, grading, and analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="glass-card border-teal-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
                  <Clock className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                  <p className="text-3xl font-bold text-teal-400">{stats.timeSaved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <FileCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Papers Generated</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.papersGenerated}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students Graded</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.studentsGraded}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden glass-card hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <Button 
                  className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 transition-opacity`}
                >
                  {feature.action} →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/20 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-teal-500/20">
              <FileText className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">From Paper Creation to Precision Grading</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI Assessment Suite streamlines the entire examination workflow. Create custom question papers with intelligent difficulty balancing, generate detailed answer keys instantly, and let our auto-grader provide consistent, fair evaluation with personalized feedback for every student.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssessmentSuite;
