import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Send, FileText, Calculator, School, Sparkles, Mic, Paperclip, Trophy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useXP } from "@/hooks/useXP";
import { supabase } from "@/integrations/supabase/client";
import CommunitySection from './CommunitySection';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Feature = 'chat' | 'essay' | 'calculator' | 'matcher' | 'timetable';

const SynqAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm Synq AI, your personal assistant. I can help with academic questions, essay reviews, college matching, admission chances, study planning, and more. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [activeFeature, setActiveFeature] = useState<Feature>('chat');
  const [essayText, setEssayText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addXP, userXP, userLevel } = useXP();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: input }],
          type: 'general',
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.content || "I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      addXP(10, 'Used Synq AI');
    } catch (error: any) {
      console.error('AI Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickAction = async (type: Feature) => {
    setActiveFeature(type);
    setIsAnalyzing(true);

    const prompts = {
      essay: "I'd like to review my essay. What should I include?",
      calculator: "Can you help me calculate my admission chances?",
      matcher: "I need help finding colleges that match my profile",
      timetable: "Can you help me create a study timetable?",
    };

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [{ role: 'user', content: prompts[type as keyof typeof prompts] }],
          type: type,
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      addXP(15, `Used ${type} feature`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEssayReview = async () => {
    if (!essayText.trim()) {
      toast({
        title: "No essay provided",
        description: "Please paste your essay to get feedback.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [{ role: 'user', content: `Please review this essay and provide detailed feedback:\n\n${essayText}` }],
          type: 'essay',
        },
      });

      if (error) throw error;

      toast({
        title: "Essay Analysis Complete!",
        description: "Your essay has been reviewed with detailed feedback.",
      });
      addXP(25, 'Completed Essay Review');

      const feedback: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, feedback]);
      setActiveFeature('chat');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const quickActions = [
    {
      icon: FileText,
      label: 'Essay Review',
      description: 'Get instant feedback',
      feature: 'essay' as Feature,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calculator,
      label: 'Chance Calculator',
      description: 'Analyze your chances',
      feature: 'calculator' as Feature,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: School,
      label: 'College Matcher',
      description: 'Find your fit',
      feature: 'matcher' as Feature,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </TabsTrigger>
        <TabsTrigger value="level" className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">Level {userLevel}</span>
        </TabsTrigger>
        <TabsTrigger value="community" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Community</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ai">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Synq AI</span>
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Your smart assistant</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {activeFeature === 'chat' && (
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-primary to-secondary text-white'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isAnalyzing && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="bg-muted rounded-2xl p-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-spin" />
                            <p className="text-sm">Thinking...</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Mic className="w-5 h-5" />
                      </Button>
                      <Input
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && handleSendMessage()}
                        className="flex-1"
                        disabled={isAnalyzing}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeFeature === 'essay' && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>Essay Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste your essay here for detailed feedback..."
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {essayText.split(' ').filter(w => w).length} words
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveFeature('chat')}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleEssayReview}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                      >
                        {isAnalyzing ? (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Review Essay
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.feature)}
                    className="w-full p-4 rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:scale-105 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="level">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">Level {userLevel}</p>
                <p className="text-lg text-muted-foreground">{userXP.toLocaleString()} XP</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Next Level Progress</p>
                <div className="w-full bg-muted rounded-full h-4">
                  <div 
                    className="bg-gradient-primary h-4 rounded-full transition-all duration-500"
                    style={{ width: `${((userXP % 500) / 500) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {500 - (userXP % 500)} XP to Level {userLevel + 1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="community">
        <CommunitySection />
      </TabsContent>
    </Tabs>
  );
};

export default SynqAI;