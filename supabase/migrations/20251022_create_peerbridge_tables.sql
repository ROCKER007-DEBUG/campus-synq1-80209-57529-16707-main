-- Create tables for Peer Bridge: study_groups, study_group_members, group_messages
-- Ensure extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text,
  schedule text,
  creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  members_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Trigger to maintain members_count
create function public.update_members_count() returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.study_groups set members_count = members_count + 1 where id = new.group_id;
  elsif (TG_OP = 'DELETE') then
    update public.study_groups set members_count = greatest(members_count - 1, 0) where id = old.group_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger tg_members_count_after_insert
after insert on public.study_group_members
for each row execute procedure public.update_members_count();

create trigger tg_members_count_after_delete
after delete on public.study_group_members
for each row execute procedure public.update_members_count();
