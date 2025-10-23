import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, Calendar, User, Search, Bookmark, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const blogPosts = [
  {
    id: 1,
    title: "How I Got Into Harvard: My Complete Application Strategy",
    excerpt: "A detailed breakdown of my successful Harvard application, including essays, extracurriculars, and interview tips.",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      role: "Harvard Freshman"
    },
    category: "College Admissions",
    readTime: "8 min read",
    publishDate: "2024-01-15",
    likes: 234,
    comments: 45,
    isLiked: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Scholarship Essays That Actually Work: Templates & Examples",
    excerpt: "Learn how to write compelling scholarship essays with real examples that won thousands in funding.",
    author: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      role: "Scholarship Winner"
    },
    category: "Scholarships",
    readTime: "12 min read",
    publishDate: "2024-01-12",
    likes: 189,
    comments: 32,
    isLiked: true,
    isTrending: false,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "The Ultimate Guide to College Interview Success",
    excerpt: "Master your college interviews with insider tips from admissions officers and successful applicants.",
    author: {
      name: "Dr. Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      role: "Admissions Counselor"
    },
    category: "Interview Tips",
    readTime: "10 min read",
    publishDate: "2024-01-10",
    likes: 156,
    comments: 28,
    isLiked: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Building an Impressive Extracurricular Profile",
    excerpt: "Quality over quantity: How to choose and excel in extracurricular activities that matter to colleges.",
    author: {
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      role: "College Consultant"
    },
    category: "Extracurriculars",
    readTime: "6 min read",
    publishDate: "2024-01-08",
    likes: 143,
    comments: 19,
    isLiked: false,
    isTrending: false,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Mental Health During College Applications: Self-Care Tips",
    excerpt: "Navigate the stress of college applications while maintaining your mental health and well-being.",
    author: {
      name: "Dr. Lisa Park",
      avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop&crop=face",
      role: "School Counselor"
    },
    category: "Wellness",
    readTime: "7 min read",
    publishDate: "2024-01-05",
    likes: 201,
    comments: 37,
    isLiked: true,
    isTrending: false,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "International Students' Guide to US College Applications",
    excerpt: "Everything international students need to know about applying to US colleges, from TOEFL to visa requirements.",
    author: {
      name: "Raj Patel",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      role: "International Student"
    },
    category: "International",
    readTime: "15 min read",
    publishDate: "2024-01-03",
    likes: 178,
    comments: 41,
    isLiked: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop"
  }
];

const categories = ["All", "College Admissions", "Scholarships", "Interview Tips", "Extracurriculars", "Wellness", "International"];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState(blogPosts);
  const { toast } = useToast();

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleShare = (postTitle: string) => {
    toast({
      title: "Link Copied!",
      description: `Link to "${postTitle}" copied to clipboard`,
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
            CampusQuest Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stories, tips, and insights from students and experts to help you succeed
          </p>
        </div>

        {/* Search & Categories */}
        <div className="glass-card p-6 mb-8">
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-gradient-primary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured/Trending Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary" />
            Trending Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.filter(post => post.isTrending).slice(0, 3).map((post) => (
              <Card key={post.id} className="glass-card hover-lift overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-gradient-primary text-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">{post.author.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {post.likes}
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90" size="sm">
                      Read Article
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-3"
                      onClick={() => handleShare(post.title)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="glass-card hover-lift overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {post.isTrending && (
                    <Badge className="absolute top-4 left-4 bg-gradient-primary text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishDate).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">{post.author.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {post.likes}
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90" size="sm">
                      Read Article
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-3"
                      onClick={() => handleShare(post.title)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card text-center p-8 mt-12">
          <h3 className="text-2xl font-bold mb-4">Share Your Story</h3>
          <p className="text-muted-foreground mb-6">
            Have an inspiring college journey to share? Write for our community!
          </p>
          <Button className="bg-gradient-primary hover:opacity-90">
            Write Article
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Blogs;