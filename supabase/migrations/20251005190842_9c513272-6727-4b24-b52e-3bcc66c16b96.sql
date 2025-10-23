-- Add skill level and proficiency to user_skills
ALTER TABLE user_skills 
ADD COLUMN IF NOT EXISTS skill_level text CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS proficiency_rating integer CHECK (proficiency_rating >= 1 AND proficiency_rating <= 5);

-- Add skill level to marketplace_listings
ALTER TABLE marketplace_listings
ADD COLUMN IF NOT EXISTS skill_level text CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS availability text;

-- Create activity feed table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  activity_description text NOT NULL,
  xp_earned integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_activities
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Activities are viewable by everyone
CREATE POLICY "Activities are viewable by everyone"
ON user_activities FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own activities
CREATE POLICY "Users can insert own activities"
ON user_activities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for activities
ALTER PUBLICATION supabase_realtime ADD TABLE user_activities;

-- Create feature usage tracking table
CREATE TABLE IF NOT EXISTS feature_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_name text NOT NULL,
  last_used_at timestamp with time zone DEFAULT now(),
  usage_count integer DEFAULT 1,
  UNIQUE(user_id, feature_name)
);

-- Enable RLS on feature_usage
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Users can manage their own feature usage
CREATE POLICY "Users can manage own feature usage"
ON feature_usage FOR ALL
TO authenticated
USING (auth.uid() = user_id);