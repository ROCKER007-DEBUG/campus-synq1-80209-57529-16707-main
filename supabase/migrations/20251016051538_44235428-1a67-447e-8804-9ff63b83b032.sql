-- Create features table
CREATE TABLE IF NOT EXISTS public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('support_hub', 'financial', 'career', 'wellness')),
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  gradient_start TEXT NOT NULL,
  gradient_end TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_features table for tracking usage and favorites
CREATE TABLE IF NOT EXISTS public.user_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_id UUID REFERENCES public.features(id) ON DELETE CASCADE NOT NULL,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_id)
);

-- Enable RLS
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_features ENABLE ROW LEVEL SECURITY;

-- RLS Policies for features (readable by all authenticated users)
CREATE POLICY "Features are viewable by authenticated users"
ON public.features FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS Policies for user_features (users can only manage their own records)
CREATE POLICY "Users can view own feature usage"
ON public.user_features FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feature usage"
ON public.user_features FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feature usage"
ON public.user_features FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Insert the 4 initial features
INSERT INTO public.features (feature_name, feature_type, description, icon_name, gradient_start, gradient_end) VALUES
('Student Support Hub', 'support_hub', 'Unified dashboard integrating academic advising, mental health resources, peer mentorship, career counseling, financial aid, and campus services—all in one searchable, personalized platform', 'HeadphonesIcon', '#8b5cf6', '#ec4899'),
('Financial Management', 'financial', 'Student-specific expense tracking, scholarship discovery engine, loan calculators with repayment simulations, textbook cost-sharing marketplace, and emergency fund builders', 'Wallet', '#10b981', '#06b6d4'),
('Career Navigator', 'career', 'Interactive career exploration featuring aptitude assessments, major-to-career mapping with salary projections, alumni path visualization, and virtual career shadowing experiences', 'Compass', '#3b82f6', '#6366f1'),
('Wellness Platform', 'wellness', 'Comprehensive wellness ecosystem with sleep tracking, nutrition planning, fitness buddy matching, work-life balance coaching, and burnout detection tools', 'Heart', '#f97316', '#ef4444');

-- Create indexes for better performance
CREATE INDEX idx_user_features_user_id ON public.user_features(user_id);
CREATE INDEX idx_user_features_feature_id ON public.user_features(feature_id);
CREATE INDEX idx_user_features_favorite ON public.user_features(is_favorite) WHERE is_favorite = true;