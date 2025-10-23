-- Enable RLS and policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT their own profile
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to INSERT their own profile
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update profile fields except xp (prevent client from changing xp directly)
CREATE POLICY profiles_update_no_xp ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND coalesce(new.xp, xp) = xp);

-- Optionally allow users to delete their own profile (if desired)
CREATE POLICY profiles_delete_own ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);
