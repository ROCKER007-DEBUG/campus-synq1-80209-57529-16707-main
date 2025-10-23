-- Create user profiles table with skills and interests
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('offer', 'need')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketplace listings
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('offer', 'need')),
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mood tracking table
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 5),
  mood_emoji TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create peer support forum posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  support_tag TEXT,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create forum replies
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create direct messages table
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create badges/achievements table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

-- Create mindfulness sessions tracking
CREATE TABLE IF NOT EXISTS public.mindfulness_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL,
  duration_minutes INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindfulness_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_skills
CREATE POLICY "Skills are viewable by everyone" ON public.user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for marketplace_listings
CREATE POLICY "Listings are viewable by everyone" ON public.marketplace_listings FOR SELECT USING (true);
CREATE POLICY "Users can manage own listings" ON public.marketplace_listings FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for mood_entries
CREATE POLICY "Users can view own mood entries" ON public.mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood entries" ON public.mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for forum_posts
CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for forum_replies
CREATE POLICY "Replies are viewable by everyone" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for direct_messages
CREATE POLICY "Users can view messages they sent or received" ON public.direct_messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.direct_messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they received" ON public.direct_messages FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- RLS Policies for user_badges
CREATE POLICY "Badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- RLS Policies for mindfulness_sessions
CREATE POLICY "Users can view own sessions" ON public.mindfulness_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.mindfulness_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX idx_marketplace_user_id ON public.marketplace_listings(user_id);
CREATE INDEX idx_marketplace_status ON public.marketplace_listings(status);
CREATE INDEX idx_mood_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_forum_posts_created ON public.forum_posts(created_at DESC);
CREATE INDEX idx_messages_sender ON public.direct_messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.direct_messages(receiver_id);