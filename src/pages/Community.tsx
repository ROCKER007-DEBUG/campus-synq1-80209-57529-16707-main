import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, Share2, Users, TrendingUp, Clock, Pin, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const forumPosts = [
  {
    id: 1,
    title: "How do I write a compelling personal statement?",
    content: "I'm struggling with my personal statement for college applications. Any tips on how to make it stand out?",
    author: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      level: 8,
      badge: "Rising Star"
    },
    category: "Application Help",
    likes: 24,
    replies: 15,
    timeAgo: "2 hours ago",
    isPinned: false,
    isTrending: true
  },
  {
    id: 2,
    title: "Stanford vs MIT for Computer Science - Need Advice!",
    content: "Got accepted to both Stanford and MIT for CS. Having a hard time deciding. Would love to hear from current students!",
    author: {
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      level: 12,
      badge: "Top Contributor"
    },
    category: "College Choice",
    likes: 89,
    replies: 43,
    timeAgo: "4 hours ago",
    isPinned: true,
    isTrending: true
  },
  {
    id: 3,
    title: "Full-ride scholarship to state school vs partial scholarship to Ivy League?",
    content: "I'm torn between a full scholarship at my state university and a partial scholarship at an Ivy League school. What factors should I consider?",
    author: {
      name: "Jordan Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      level: 5,
      badge: "Helper"
    },
    category: "Financial Aid",
    likes: 67,
    replies: 32,
    timeAgo: "1 day ago",
    isPinned: false,
    isTrending: false
  }
];

const studyGroups = [
  {
    id: 1,
    name: "SAT Prep Masters",
    description: "Daily practice sessions and strategy sharing for SAT preparation",
    members: 156,
    category: "Test Prep",
    isActive: true,
    lastActivity: "30 min ago"
  },
  {
    id: 2,
    name: "Ivy League Applicants 2024",
    description: "Support group for students applying to Ivy League universities",
    members: 89,
    category: "College Apps",
    isActive: true,
    lastActivity: "1 hour ago"
  },
  {
    id: 3,
    name: "STEM Scholarship Hunters",
    description: "Finding and sharing STEM scholarship opportunities",
    members: 203,
    category: "Scholarships",
    isActive: false,
    lastActivity: "2 days ago"
  }
];

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState(forumPosts);
  const { toast } = useToast();

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    toast({
      title: "Post Liked!",
      description: "Thanks for engaging with the community",
    });
  };

  const handleShare = (postTitle: string) => {
    toast({
      title: "Post Shared!",
      description: `"${postTitle}" shared to your feed`,
    });
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      toast({
        title: "Post Created!",
        description: "Your post has been shared with the community",
      });
      setNewPost("");
    }
  };

  const joinGroup = (groupName: string) => {
    toast({
      title: "Joined Group!",
      description: `You've joined "${groupName}"`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect, learn, and grow together with fellow students and mentors
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card text-center p-4">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-xl font-bold">2,543</h3>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </Card>
          
          <Card className="glass-card text-center p-4">
            <MessageSquare className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="text-xl font-bold">1,289</h3>
            <p className="text-sm text-muted-foreground">Discussions</p>
          </Card>
          
          <Card className="glass-card text-center p-4">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold">456</h3>
            <p className="text-sm text-muted-foreground">Success Stories</p>
          </Card>
          
          <Card className="glass-card text-center p-4">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold">89%</h3>
            <p className="text-sm text-muted-foreground">Help Rate</p>
          </Card>
        </div>

        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
            <TabsTrigger value="mentorship">Peer Mentorship</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            {/* Create Post */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Start a Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What would you like to discuss with the community?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="secondary">Application Help</Badge>
                    <Badge variant="secondary">College Choice</Badge>
                    <Badge variant="secondary">Financial Aid</Badge>
                  </div>
                  <Button 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={handleCreatePost}
                  >
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Discussion Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="glass-card hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{post.author.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              Level {post.author.level}
                            </Badge>
                            <Badge className="text-xs bg-gradient-primary text-white">
                              {post.author.badge}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {post.isPinned && (
                              <Pin className="w-4 h-4 text-primary" />
                            )}
                            {post.isTrending && (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            )}
                            <Badge variant="outline">{post.category}</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {post.timeAgo}
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          <p className="text-muted-foreground text-sm">{post.content}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </button>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          {post.replies} replies
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShare(post.title)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="study-groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group) => (
                <Card key={group.id} className="glass-card hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant={group.isActive ? "default" : "secondary"}>
                        {group.isActive ? "Active" : "Quiet"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{group.members} members</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {group.lastActivity}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-primary hover:opacity-90" 
                        size="sm"
                        onClick={() => joinGroup(group.name)}
                      >
                        Join Group
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-card text-center p-8">
              <h3 className="text-xl font-bold mb-4">Create Your Own Study Group</h3>
              <p className="text-muted-foreground mb-6">
                Start a study group around your interests and connect with like-minded peers
              </p>
              <Button className="bg-gradient-primary hover:opacity-90">
                Create Study Group
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="mentorship" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Become a Peer Mentor
                </h3>
                <p className="text-muted-foreground mb-4">
                  Share your experience and help other students navigate their college journey
                </p>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Guide students through application process</li>
                  <li>• Share scholarship and internship opportunities</li>
                  <li>• Earn XP and community recognition</li>
                  <li>• Build leadership skills</li>
                </ul>
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Apply to Mentor
                </Button>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-secondary" />
                  Find a Peer Mentor
                </h3>
                <p className="text-muted-foreground mb-4">
                  Connect with experienced students who can guide you through challenges
                </p>
                <ul className="space-y-2 text-sm mb-6">
                  <li>• Get personalized advice and tips</li>
                  <li>• Learn from real student experiences</li>
                  <li>• Access exclusive resources and opportunities</li>
                  <li>• Join mentor-led study groups</li>
                </ul>
                <Button className="w-full bg-gradient-secondary hover:opacity-90">
                  Find Mentor
                </Button>
              </Card>
            </div>

            {/* Success Stories */}
            <Card className="glass-card p-6">
              <h3 className="text-xl font-bold mb-6">Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg bg-gradient-card">
                    <p className="text-sm italic mb-3">
                      "My peer mentor helped me improve my essays and I got into my dream school!"
                    </p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">Anonymous Student</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Community;