import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Building2, Users, Sparkles, ArrowRight, GraduationCap, CheckSquare, ClipboardCheck, MessageSquare, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SynqAI from '../components/SynqAI';
import CampusSynqTabs from '../components/CampusSynqTabs';
import Mentorship from './Mentorship';
import SimuLearn from '../components/SimuLearn';
import { TaskManagement } from '../components/TaskManagement';
import { FeatureDiscoveryPopup } from '@/components/FeatureDiscoveryPopup';
import AptitudeTest from '../components/AptitudeTest';
import AptitudeTestNotification from '../components/AptitudeTestNotification';
import Forum from './Forum';
import PeerBridge from './PeerBridge';

type Portal = 'ai' | 'campus' | 'mentorship' | 'simulearn' | 'tasks' | 'aptitude' | 'forum' | 'peerbridge' | 'assessment' | null;

const Index = () => {
  const [activePortal, setActivePortal] = useState<Portal>(null);
  const navigate = useNavigate();

  const portals = [
    {
      id: 'ai' as Portal,
      icon: Brain,
      title: 'Synq AI',
      description: 'Get instant feedback on essays, calculate admission chances, and match with colleges using AI',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500'
    },
    {
      id: 'campus' as Portal,
      icon: Building2,
      title: 'Campus Synq',
      description: 'Explore 200+ colleges worldwide with powerful filters, compare programs, and save your favorites',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500'
    },
    {
      id: 'mentorship' as Portal,
      icon: Users,
      title: 'Mentorship',
      description: 'Connect with peer mentors and fellow students for collaborative learning, shared experiences, and mutual growth',
      gradient: 'from-orange-500 via-red-500 to-pink-500'
    },
    {
      id: 'simulearn' as Portal,
      icon: GraduationCap,
      title: 'SimuLearn',
      description: 'Immerse yourself in interactive simulations and earn XP while you learn - 10 XP for every 2 minutes!',
      gradient: 'from-green-500 via-emerald-500 to-teal-500'
    },
    {
      id: 'tasks' as Portal,
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Manage daily tasks with calendar, timers, and progress tracking. Earn 20 XP for each completed task!',
      gradient: 'from-teal-500 via-cyan-500 to-blue-500'
    },
    {
      id: 'aptitude' as Portal,
      icon: ClipboardCheck,
      title: 'Aptitude Test',
      description: 'Take our AI-powered aptitude test to identify your strengths and get personalized career recommendations with college suggestions',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500'
    },
    {
      id: 'forum' as Portal,
      icon: MessageSquare,
      title: 'Doubt / Q&A',
      description: 'Ask questions, get answers from fellow students and parents. Share knowledge in a safe, family-friendly environment',
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500'
    },
    {
      id: 'peerbridge' as Portal,
      icon: Users,
      title: 'Peer Bridge',
      description: 'Join study groups, connect with active peers, and collaborate in real-time sessions across various subjects',
      gradient: 'from-amber-500 via-orange-500 to-red-500'
    },
    {
      id: 'assessment' as Portal,
      icon: FileCheck,
      title: 'AI Assessment Suite',
      description: 'Transform hours of manual work into minutes with AI-powered exam creation, answer key generation, and intelligent grading',
      gradient: 'from-teal-500 via-cyan-500 to-blue-500'
    }
  ];

  if (activePortal === 'ai') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button 
            variant="ghost" 
            onClick={() => setActivePortal(null)}
            className="mb-6 hover:bg-primary/10"
          >
            ← Back to Home
          </Button>
          <SynqAI />
        </div>
      </div>
    );
  }

  if (activePortal === 'campus') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button 
            variant="ghost" 
            onClick={() => setActivePortal(null)}
            className="mb-6 hover:bg-secondary/10"
          >
            ← Back to Home
          </Button>
          <CampusSynqTabs />
        </div>
      </div>
    );
  }

  if (activePortal === 'mentorship') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="ghost" 
              onClick={() => setActivePortal(null)}
              className="mb-6 hover:bg-orange-500/10"
            >
              ← Back to Home
            </Button>
          </div>
          <Mentorship isPortalMode={true} />
        </div>
      </div>
    );
  }

  if (activePortal === 'simulearn') {
    return (
      <div className="min-h-screen bg-background">
        <SimuLearn onBack={() => setActivePortal(null)} />
      </div>
    );
  }

  if (activePortal === 'tasks') {
    return (
      <div className="min-h-screen bg-background">
        <TaskManagement onClose={() => setActivePortal(null)} />
      </div>
    );
  }

  if (activePortal === 'aptitude') {
    return <AptitudeTest onBack={() => setActivePortal(null)} />;
  }

  if (activePortal === 'forum') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button 
            variant="ghost" 
            onClick={() => setActivePortal(null)}
            className="mb-6 hover:bg-rose-500/10"
          >
            ← Back to Home
          </Button>
          <Forum />
        </div>
      </div>
    );
  }

  if (activePortal === 'peerbridge') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button 
            variant="ghost" 
            onClick={() => setActivePortal(null)}
            className="mb-6 hover:bg-amber-500/10"
          >
            ← Back to Home
          </Button>
          <PeerBridge />
        </div>
      </div>
    );
  }

  if (activePortal === 'assessment') {
    navigate('/ai-assessment-suite');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FeatureDiscoveryPopup />
      <AptitudeTestNotification onTakeTest={() => setActivePortal('aptitude')} />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full py-20">
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <div className="inline-block">
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                SYNQED
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Synchronize Your Academic Journey
              </p>
            </div>
          </div>

          <div id="main-features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {portals.map((portal) => (
              <Card 
                key={portal.id}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => setActivePortal(portal.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${portal.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <CardHeader className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${portal.gradient} rounded-2xl p-3 mb-4 group-hover:scale-110 transition-transform`}>
                    <portal.icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{portal.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {portal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button 
                    className={`w-full bg-gradient-to-r ${portal.gradient} hover:opacity-90 transition-opacity`}
                  >
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
