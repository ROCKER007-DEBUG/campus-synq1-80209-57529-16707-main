import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Share2, Send, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useXP } from "@/hooks/useXP";

const CommunitySection = () => {
  const [newPost, setNewPost] = useState('');
  const { toast } = useToast();
  const { addXP } = useXP();

  const posts = [
    {
      id: 1,
      author: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      level: 12,
      content: "Just got accepted to MIT! Anyone else applying for Computer Science? Would love to connect!",
      likes: 45,
      replies: 12,
      timestamp: "2 hours ago",
      trending: true
    },
    {
      id: 2,
      author: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      level: 8,
      content: "Need advice on essay writing. What's the best approach for the 'why this college' prompt?",
      likes: 28,
      replies: 34,
      timestamp: "5 hours ago",
      trending: false
    },
    {
      id: 3,
      author: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      level: 15,
      content: "Sharing my experience with scholarship applications. Ask me anything about the process!",
      likes: 67,
      replies: 23,
      timestamp: "1 day ago",
      trending: true
    }
  ];

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    toast({
      title: "Post Published!",
      description: "Your post has been shared with the community.",
    });
    addXP(20, 'Created Community Post');
    setNewPost('');
  };

  const handleLike = (postId: number) => {
    toast({
      title: "Post Liked",
      description: "You liked this post!",
    });
    addXP(5, 'Liked Post');
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Share with Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your thoughts, questions, or experiences..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-xs">
              +20 XP for posting
            </Badge>
            <Button 
              onClick={handlePost}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Community Feed</h3>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </Button>
        </div>

        {posts.map((post) => (
          <Card key={post.id} className="glass-card hover-lift">
            <CardContent className="p-6 space-y-4">
              {/* Author Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.author}</p>
                      <Badge variant="secondary" className="text-xs">
                        Level {post.level}
                      </Badge>
                      {post.trending && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                          🔥 Trending
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.replies}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunitySection;
