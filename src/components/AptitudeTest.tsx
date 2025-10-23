import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, ArrowRight, Sparkles, GraduationCap, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from './Navigation';
import { useXP } from '@/hooks/useXP';

interface AptitudeTestProps {
  onBack: () => void;
}

const questions = [
  {
    id: 1,
    question: "Which of these activities do you enjoy the most?",
    options: [
      { value: "creating_art", label: "Creating art, designs, or visual content" },
      { value: "solving_problems", label: "Solving complex problems and puzzles" },
      { value: "helping_people", label: "Helping people and making a difference" },
      { value: "building_things", label: "Building or fixing things with your hands" }
    ]
  },
  {
    id: 2,
    question: "What type of work environment appeals to you?",
    options: [
      { value: "office_structured", label: "Structured office with clear processes" },
      { value: "creative_flexible", label: "Creative studio with flexible hours" },
      { value: "outdoor_dynamic", label: "Outdoor or dynamic fieldwork" },
      { value: "lab_research", label: "Laboratory or research facility" }
    ]
  },
  {
    id: 3,
    question: "Which subject did you enjoy most in school?",
    options: [
      { value: "math_science", label: "Mathematics and Science" },
      { value: "arts_literature", label: "Arts and Literature" },
      { value: "social_studies", label: "Social Studies and History" },
      { value: "physical_ed", label: "Physical Education and Sports" }
    ]
  },
  {
    id: 4,
    question: "What motivates you the most in a career?",
    options: [
      { value: "financial_stability", label: "Financial stability and growth" },
      { value: "creative_expression", label: "Creative expression and innovation" },
      { value: "social_impact", label: "Making a positive social impact" },
      { value: "personal_achievement", label: "Personal achievement and recognition" }
    ]
  },
  {
    id: 5,
    question: "How do you prefer to work?",
    options: [
      { value: "team_collaborative", label: "In teams, collaborating with others" },
      { value: "independent", label: "Independently with minimal supervision" },
      { value: "leading_others", label: "Leading and managing others" },
      { value: "mix_both", label: "A mix of both team and solo work" }
    ]
  },
  {
    id: 6,
    question: "What's your approach to challenges?",
    options: [
      { value: "analytical", label: "Analytical - I break them down logically" },
      { value: "creative", label: "Creative - I think outside the box" },
      { value: "collaborative", label: "Collaborative - I seek input from others" },
      { value: "practical", label: "Practical - I use proven methods" }
    ]
  },
  {
    id: 7,
    question: "Which technology area interests you most?",
    options: [
      { value: "ai_ml", label: "Artificial Intelligence and Machine Learning" },
      { value: "web_mobile", label: "Web and Mobile Development" },
      { value: "data_analytics", label: "Data Science and Analytics" },
      { value: "not_tech", label: "I prefer non-technical fields" }
    ]
  },
  {
    id: 8,
    question: "How do you handle stress?",
    options: [
      { value: "stay_calm", label: "I stay calm and methodical" },
      { value: "seek_support", label: "I seek support from others" },
      { value: "take_breaks", label: "I take breaks and recharge" },
      { value: "push_through", label: "I push through with determination" }
    ]
  },
  {
    id: 9,
    question: "What type of impact do you want to make?",
    options: [
      { value: "global_scale", label: "Global scale innovations" },
      { value: "local_community", label: "Local community improvements" },
      { value: "individual_lives", label: "Individual lives transformation" },
      { value: "industry_advancement", label: "Industry-specific advancements" }
    ]
  },
  {
    id: 10,
    question: "Which work style describes you best?",
    options: [
      { value: "detail_oriented", label: "Detail-oriented and precise" },
      { value: "big_picture", label: "Big picture and strategic" },
      { value: "hands_on", label: "Hands-on and practical" },
      { value: "conceptual", label: "Conceptual and theoretical" }
    ]
  },
  {
    id: 11,
    question: "What kind of learning do you prefer?",
    options: [
      { value: "theoretical", label: "Theoretical and research-based" },
      { value: "practical", label: "Practical and hands-on" },
      { value: "visual", label: "Visual and creative" },
      { value: "interactive", label: "Interactive and discussion-based" }
    ]
  },
  {
    id: 12,
    question: "Which sector appeals to you most?",
    options: [
      { value: "healthcare", label: "Healthcare and Medicine" },
      { value: "technology", label: "Technology and Innovation" },
      { value: "business", label: "Business and Finance" },
      { value: "education", label: "Education and Research" }
    ]
  },
  {
    id: 13,
    question: "How important is work-life balance to you?",
    options: [
      { value: "very_important", label: "Very important - I prioritize personal time" },
      { value: "somewhat", label: "Somewhat - I'm flexible" },
      { value: "career_focused", label: "Career-focused - I'm willing to work extra" },
      { value: "depends", label: "Depends on the project" }
    ]
  },
  {
    id: 14,
    question: "What's your ideal career progression?",
    options: [
      { value: "specialist", label: "Deep specialist in one area" },
      { value: "generalist", label: "Broad generalist across areas" },
      { value: "entrepreneur", label: "Entrepreneurial and independent" },
      { value: "leadership", label: "Leadership and management roles" }
    ]
  },
  {
    id: 15,
    question: "Which skill would you most like to develop?",
    options: [
      { value: "technical", label: "Advanced technical skills" },
      { value: "communication", label: "Communication and persuasion" },
      { value: "leadership", label: "Leadership and team management" },
      { value: "creative", label: "Creative and design thinking" }
    ]
  }
];

const AptitudeTest: React.FC<AptitudeTestProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const { addXP } = useXP();

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]) {
      toast({
        title: "Please select an option",
        description: "You must select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!answers[questions[currentQuestion].id]) {
      toast({
        title: "Please select an option",
        description: "You must answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-aptitude', {
        body: { answers }
      });

      if (error) throw error;

      setResults(data);
      addXP(50, "Completed Aptitude Test!");
      
      toast({
        title: "Test Complete! +50 XP",
        description: "Your career analysis is ready!"
      });
    } catch (error) {
      console.error('Error analyzing test:', error);
      toast({
        title: "Analysis Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (results && !showDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
          </Button>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl">Your Career Recommendations</CardTitle>
              <CardDescription>Based on your aptitude test results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Top Career Matches:</h3>
                {results.careers?.map((career: string, index: number) => (
                  <div key={index} className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{career}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Analysis Summary:</h3>
                <p className="text-muted-foreground leading-relaxed">{results.summary}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setShowDetails(true)} className="flex-1">
                  <GraduationCap className="mr-2 w-4 h-4" />
                  Get Detailed Career Information
                </Button>
                <Button variant="outline" onClick={onBack}>
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showDetails && results) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button variant="ghost" onClick={() => setShowDetails(false)} className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Results
          </Button>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Detailed Career Information</CardTitle>
              <CardDescription>In-depth analysis and college recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Career Path Details
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {results.details}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Recommended Colleges Worldwide
                </h3>
                <div className="grid gap-3">
                  {results.colleges?.map((college: string, index: number) => (
                    <div key={index} className="p-4 bg-secondary/10 rounded-lg border">
                      <p className="font-medium">{college}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={onBack} className="w-full">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Career Aptitude Test</CardTitle>
            <CardDescription>
              Answer these questions to discover your ideal career path
            </CardDescription>
            <div className="pt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{questions[currentQuestion].question}</h3>
              
              <RadioGroup
                value={answers[questions[currentQuestion].id] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Submit Test
                      <Sparkles className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1">
                  Next
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AptitudeTest;
