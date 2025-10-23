/*
  # Create Wellness Feature Tables

  1. New Tables
    - `burnout_assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `answers` (jsonb, stores assessment answers)
      - `score` (integer, calculated burnout score)
      - `tips` (text[], personalized self-care tips)
      - `completed_at` (timestamptz, when assessment was completed)
      - `created_at` (timestamptz, default now())
    
    - `gym_buddy_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `location` (text, gym location)
      - `preferences` (jsonb, workout preferences)
      - `status` (text, 'searching' or 'matched')
      - `matched_with` (uuid, references profiles, nullable)
      - `matched_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
    
    - `nutrition_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `budget` (decimal, user budget)
      - `currency` (text, currency code)
      - `location` (text, user location)
      - `meal_plan` (jsonb, AI-generated meal suggestions)
      - `created_at` (timestamptz, default now())
    
    - `work_life_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `session_type` (text, type of coaching)
      - `completed` (boolean, default false)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS burnout_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  answers jsonb NOT NULL,
  score integer NOT NULL,
  tips text[] DEFAULT '{}',
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE burnout_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own burnout assessments"
  ON burnout_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own burnout assessments"
  ON burnout_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS gym_buddy_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  location text NOT NULL,
  preferences jsonb DEFAULT '{}',
  status text DEFAULT 'searching' CHECK (status IN ('searching', 'matched')),
  matched_with uuid REFERENCES profiles(id) ON DELETE SET NULL,
  matched_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gym_buddy_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gym buddy requests"
  ON gym_buddy_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = matched_with);

CREATE POLICY "Users can create own gym buddy requests"
  ON gym_buddy_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gym buddy requests"
  ON gym_buddy_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS nutrition_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  budget decimal NOT NULL,
  currency text DEFAULT 'USD',
  location text NOT NULL,
  meal_plan jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nutrition plans"
  ON nutrition_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own nutrition plans"
  ON nutrition_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS work_life_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_type text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE work_life_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own work life sessions"
  ON work_life_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own work life sessions"
  ON work_life_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work life sessions"
  ON work_life_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_burnout_assessments_user_id ON burnout_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_burnout_assessments_completed_at ON burnout_assessments(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_gym_buddy_requests_location ON gym_buddy_requests(location);
CREATE INDEX IF NOT EXISTS idx_gym_buddy_requests_status ON gym_buddy_requests(status);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_user_id ON nutrition_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_work_life_sessions_user_id ON work_life_sessions(user_id);