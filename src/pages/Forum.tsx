import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Send, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const supportTags = [
  'Exam Stress',
  'Friendship Issues',
  'Motivation',
  'Time Management',
  'College Applications',
  'Mental Health',
  'Study Tips',
  'General Support',
];

const Forum = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTag, setSelectedTag] = useState('General Support');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [replies, setReplies] = useState<{ [key: string]: any[] }>({});
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadPosts();

    const postsChannel = supabase
      .channel('forum-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_posts'
        },
        () => loadPosts()
      )
      .subscribe();

    const repliesChannel = supabase
      .channel('forum-replies')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_replies'
        },
        (payload) => {
          if (payload.new && 'post_id' in payload.new) {
            loadReplies(payload.new.post_id as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(repliesChannel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    }
  };

  const loadPosts = async () => {
    try {
      const { data } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles (username, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      setPosts(data || []);
      
      data?.forEach(post => {
        loadReplies(post.id);
      });
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadReplies = async (postId: string) => {
    try {
      const { data } = await supabase
        .from('forum_replies')
        .select(`
          *,
          profiles (username, full_name)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      setReplies(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const filterInappropriateContent = (text: string): boolean => {
    const inappropriateWords = [
      'badword1', 'badword2', 'inappropriate', 'offensive',
    ];
    
    const lowerText = text.toLowerCase();
    return inappropriateWords.some(word => lowerText.includes(word));
  };

  const createPost = async () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something",
        variant: "destructive",
      });
      return;
    }

    if (filterInappropriateContent(newPost)) {
      toast({
        title: "Inappropriate content detected",
        description: "Please keep the conversation family-friendly",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          content: newPost,
          support_tag: selectedTag,
          is_anonymous: isAnonymous,
        });

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });

      setNewPost('');
      loadPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const likePost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('forum_posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post liked!",
        description: "You showed support for this post.",
      });

      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const createReply = async (postId: string) => {
    const text = replyText[postId];
    
    if (!text?.trim()) {
      toast({
        title: "Empty reply",
        description: "Please write something",
        variant: "destructive",
      });
      return;
    }

    if (filterInappropriateContent(text)) {
      toast({
        title: "Inappropriate content detected",
        description: "Please keep the conversation family-friendly",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: text,
          is_anonymous: isAnonymous,
        });

      if (error) throw error;

      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from('forum_posts')
          .update({ replies_count: post.replies_count + 1 })
          .eq('id', postId);
      }

      toast({
        title: "Reply posted!",
        description: "Your answer has been shared.",
      });

      setReplyText(prev => ({ ...prev, [postId]: '' }));
      loadReplies(postId);
      loadPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Live Chat & Q&A
              </h1>
              <p className="text-gray-400">
                Connect, ask, and help each other
              </p>
            </div>
          </div>

          {/* Create Post Card */}
          <Card className="bg-[#1A1A1A] border-pink-500/20 shadow-xl shadow-pink-500/5 transition-all duration-300 hover:shadow-pink-500/10 animate-fade-in">
            <CardContent className="p-6 space-y-4">
              <Textarea
                placeholder="Ask a question or share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[120px] text-base bg-[#0A0A0A] border-pink-500/20 text-white placeholder:text-gray-500 focus:border-pink-500/50 transition-colors resize-none"
              />
              <div className="flex flex-wrap gap-3">
                {supportTags.slice(0, 4).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className={selectedTag === tag 
                      ? 'bg-[#2A2A2A] border-pink-500/30 text-white hover:bg-[#3A3A3A] transition-all duration-200'
                      : 'bg-[#1A1A1A] border-pink-500/10 text-gray-400 hover:bg-[#2A2A2A] hover:text-white transition-all duration-200'
                    }
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              <div className="flex items-center justify-end">
                <Button
                  onClick={createPost}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-pink-500/50 hover:scale-105"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 animate-fade-in">
            <Button
              variant="outline"
              className="bg-[#1A1A1A] border-pink-500/30 text-white hover:bg-[#2A2A2A] transition-all duration-200 rounded-full px-8"
            >
              All
            </Button>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-all duration-200 rounded-full px-8"
            >
              Popular
            </Button>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-all duration-200 rounded-full px-8"
            >
              Unanswered
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <Card 
                key={post.id} 
                className="bg-[#1A1A1A] border-pink-500/10 shadow-lg hover:shadow-pink-500/10 transition-all duration-300 hover:border-pink-500/30 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="font-semibold text-lg text-white">
                        {post.is_anonymous ? 'Anonymous Student' : `@${post.profiles?.username}`}
                      </p>
                      <Badge variant="secondary" className="bg-[#2A2A2A] text-gray-300 border-pink-500/20 hover:bg-[#3A3A3A] transition-colors">
                        {post.support_tag}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-base leading-relaxed text-gray-300">{post.content}</p>

                  <div className="flex items-center gap-4 pt-4 border-t border-pink-500/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePost(post.id)}
                      className="gap-2 text-gray-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-200"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes_count}</span>
                    </Button>
                    <Collapsible
                      open={openReplies[post.id]}
                      onOpenChange={(open) => setOpenReplies(prev => ({ ...prev, [post.id]: open }))}
                      className="flex-1"
                    >
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 text-gray-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies_count} Answers</span>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-6 space-y-4">
                        {/* Existing Replies */}
                        {replies[post.id]?.map((reply) => (
                          <div key={reply.id} className="pl-6 border-l-2 border-pink-500/30 space-y-2 animate-fade-in">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-semibold text-white">
                                {reply.is_anonymous ? 'Anonymous' : `@${reply.profiles?.username}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(reply.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{reply.content}</p>
                          </div>
                        ))}

                        {/* Reply Input */}
                        <div className="space-y-3 pt-4">
                          <Textarea
                            placeholder="Share your answer..."
                            value={replyText[post.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            className="min-h-[100px] bg-[#0A0A0A] border-pink-500/20 text-white placeholder:text-gray-500 focus:border-pink-500/50 transition-colors"
                          />
                          <Button 
                            onClick={() => createReply(post.id)} 
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-pink-500/50"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Post Answer
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
