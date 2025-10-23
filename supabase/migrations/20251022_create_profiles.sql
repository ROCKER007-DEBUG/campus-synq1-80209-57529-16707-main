-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username text,
  full_name text,
  xp bigint DEFAULT 0 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now()
);
