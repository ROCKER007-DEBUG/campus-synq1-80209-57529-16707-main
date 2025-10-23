-- Add trust and liquidity system to user_skills
ALTER TABLE user_skills
ADD COLUMN IF NOT EXISTS liquidity_score integer DEFAULT 0 CHECK (liquidity_score >= 0 AND liquidity_score <= 100),
ADD COLUMN IF NOT EXISTS trust_points integer DEFAULT 0 CHECK (trust_points >= 0),
ADD COLUMN IF NOT EXISTS vouches_count integer DEFAULT 0;

-- Create vouches table for peer verification
CREATE TABLE IF NOT EXISTS skill_vouches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid REFERENCES user_skills(id) ON DELETE CASCADE NOT NULL,
  voucher_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vouched_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vouch_strength integer DEFAULT 1 CHECK (vouch_strength >= 1 AND vouch_strength <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  decays_at timestamp with time zone DEFAULT (now() + interval '90 days'),
  UNIQUE(skill_id, voucher_id)
);

-- Enable RLS
ALTER TABLE skill_vouches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vouches are viewable by everyone"
ON skill_vouches FOR SELECT
USING (true);

CREATE POLICY "Users can vouch for others"
ON skill_vouches FOR INSERT
WITH CHECK (auth.uid() = voucher_id AND voucher_id != vouched_user_id);

-- Create micro challenges table
CREATE TABLE IF NOT EXISTS micro_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  skill_required text NOT NULL,
  time_limit_minutes integer NOT NULL CHECK (time_limit_minutes > 0 AND time_limit_minutes <= 120),
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  xp_reward integer DEFAULT 25,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'expired')),
  accepted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '7 days'),
  completed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE micro_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by everyone"
ON micro_challenges FOR SELECT
USING (true);

CREATE POLICY "Users can create challenges"
ON micro_challenges FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own challenges"
ON micro_challenges FOR UPDATE
USING (auth.uid() = creator_id OR auth.uid() = accepted_by);

-- Create skill exchange sessions table (time tracking)
CREATE TABLE IF NOT EXISTS exchange_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type text NOT NULL CHECK (session_type IN ('teach', 'learn', 'collaborate')),
  skill_name text NOT NULL,
  duration_minutes integer NOT NULL,
  participant_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  notes text,
  xp_earned integer DEFAULT 0,
  trust_earned integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE exchange_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
ON exchange_sessions FOR SELECT
USING (auth.uid() = participant_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create sessions"
ON exchange_sessions FOR INSERT
WITH CHECK (auth.uid() = participant_id);

-- Enable realtime for micro challenges
ALTER PUBLICATION supabase_realtime ADD TABLE micro_challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE skill_vouches;