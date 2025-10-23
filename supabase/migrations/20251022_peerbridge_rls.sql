-- Enable RLS and policies for peer bridge tables (safe checks)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='study_groups') THEN
    ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='study_group_members') THEN
    ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='group_messages') THEN
    ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
  END IF;
END$$;

-- study_groups: allow everyone to SELECT (to browse groups), allow authenticated users to INSERT
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'study_groups_select_public') THEN
    CREATE POLICY study_groups_select_public ON public.study_groups
      FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'study_groups_insert_auth') THEN
    CREATE POLICY study_groups_insert_auth ON public.study_groups
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

-- study_group_members: allow users to insert their own membership and view their membership
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'members_insert_own') THEN
    CREATE POLICY members_insert_own ON public.study_group_members
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'members_select_own') THEN
    CREATE POLICY members_select_own ON public.study_group_members
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END$$;

-- group_messages: allow authenticated users to insert messages for groups they are members of
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'messages_insert_member') THEN
    CREATE POLICY messages_insert_member ON public.group_messages
      FOR INSERT
      WITH CHECK (
        auth.role() = 'authenticated' AND
        exists (select 1 from public.study_group_members m where m.group_id = new.group_id and m.user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'messages_select_group') THEN
    CREATE POLICY messages_select_group ON public.group_messages
      FOR SELECT USING (
        exists (select 1 from public.study_group_members m where m.group_id = group_messages.group_id and m.user_id = auth.uid())
      );
  END IF;
END$$;
