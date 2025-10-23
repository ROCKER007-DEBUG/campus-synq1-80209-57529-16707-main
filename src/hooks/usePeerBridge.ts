import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StudyGroup {
  id: string;
  name: string;
  subject?: string;
  schedule?: string;
  creator_id?: string;
  members_count?: number;
  created_at?: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  user_id?: string;
  content: string;
  created_at?: string;
}

export default function usePeerBridge() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [messages, setMessages] = useState<Record<string, GroupMessage[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from<StudyGroup>('study_groups').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('fetchGroups error', error);
    } else {
      setGroups(data || []);
    }
    setLoading(false);
  }, []);

  const createGroup = useCallback(async (payload: Partial<StudyGroup>) => {
    // Ensure creator_id is set to the signed-in user when not provided
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;

      const toInsert = { ...payload, creator_id: payload.creator_id ?? userId };

      const { data, error } = await supabase.from('study_groups').insert([toInsert]).select().single();
      if (error) throw error;

      // Add creator as a member if possible
      if (data?.id && userId) {
        await supabase.from('study_group_members').insert([{ group_id: data.id, user_id: userId }]);
      }

      await fetchGroups();
      return data as StudyGroup;
    } catch (err) {
      console.error('createGroup error', err);
      throw err;
    }
  }, [fetchGroups]);

  const joinGroup = useCallback(async (groupId: string, userId: string) => {
    const { error } = await supabase.from('study_group_members').insert([{ group_id: groupId, user_id: userId }]);
    if (error) throw error;
    await fetchGroups();
  }, [fetchGroups]);

  const leaveGroup = useCallback(async (groupId: string, userId: string) => {
    const { error } = await supabase.from('study_group_members').delete().match({ group_id: groupId, user_id: userId });
    if (error) throw error;
    await fetchGroups();
  }, [fetchGroups]);

  const fetchMessages = useCallback(async (groupId: string) => {
    const { data, error } = await supabase.from<GroupMessage>('group_messages').select('*').eq('group_id', groupId).order('created_at', { ascending: true });
    if (error) {
      console.error('fetchMessages error', error);
      setMessages(prev => ({ ...prev, [groupId]: [] }));
    } else {
      setMessages(prev => ({ ...prev, [groupId]: data || [] }));
    }
  }, []);

  const sendMessage = useCallback(async (groupId: string, content: string) => {
    const { data, error } = await supabase.from('group_messages').insert([{ group_id: groupId, content }]).select().single();
    if (error) throw error;
    // optimistic: append message locally
    setMessages(prev => ({ ...prev, [groupId]: [...(prev[groupId] || []), (data as GroupMessage)] }));
    return data as GroupMessage;
  }, []);

  useEffect(() => {
    fetchGroups();

    const groupChannel = supabase.channel('public:group_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages' }, (payload) => {
        const msg = payload.new as GroupMessage;
        setMessages(prev => ({ ...prev, [msg.group_id]: [...(prev[msg.group_id] || []), msg] }));
      })
      .subscribe();

    return () => {
      try { groupChannel.unsubscribe(); } catch {};
    };
  }, [fetchGroups]);

  return {
    groups,
    messages,
    loading,
    fetchGroups,
    createGroup,
    joinGroup,
    leaveGroup,
    fetchMessages,
    sendMessage,
  };
}
