import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MessageCircle, Video, Plus, Lock, Unlock } from "lucide-react";
import { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface StudyGroup {
  id: string;
  name: string;
  // members_count mirrors what the UI uses; keep optional to allow legacy/demo objects
  members_count?: number;
  subject: string;
  schedule: string;
  creator_id?: string | null;
  created_at?: string;
}

interface Peer {
  id: string;
  name: string;
  initials: string;
  skills: string;
  online: boolean;
}

interface GroupMessage {
  id: string;
  group_id: string;
  user_id?: string;
  content: string;
  created_at?: string;
}

const PeerBridge = () => {
  const { toast } = useToast();

  const [activePeers] = useState<Peer[]>([
    { id: '1', name: 'Alex Johnson', initials: 'AJ', skills: 'Python, ML', online: true },
    { id: '2', name: 'Sarah Chen', initials: 'SC', skills: 'Web Dev, React', online: true },
    { id: '3', name: 'Mike Davis', initials: 'MD', skills: 'Data Science', online: false }
  ]);

  // Local-only persistent state + tab-sync
  const STORAGE_PREFIX = 'peerbridge:';
  const STORAGE_KEYS = {
    groups: `${STORAGE_PREFIX}groups_v1`,
    messages: `${STORAGE_PREFIX}messages_v1`,
    members: `${STORAGE_PREFIX}members_v1`,
    lastUpdated: `${STORAGE_PREFIX}last_updated_v1`,
    ping: `${STORAGE_PREFIX}ping_v1`,
  } as const;

  const DEFAULT_GROUPS: StudyGroup[] = [
    { id: '1', name: 'Data Structures Study Group', subject: 'Computer Science', schedule: 'Today, 3:00 PM', members_count: 12, creator_id: undefined, created_at: new Date().toISOString() },
    { id: '2', name: 'Calculus Warriors', subject: 'Mathematics', schedule: 'Tomorrow, 5:00 PM', members_count: 8, creator_id: undefined, created_at: new Date().toISOString() },
    { id: '3', name: 'Chemistry Lab Partners', subject: 'Chemistry', schedule: 'Oct 12, 2:00 PM', members_count: 6, creator_id: undefined, created_at: new Date().toISOString() }
  ];

  const DEFAULT_MESSAGES: Record<string, GroupMessage[]> = {
    '1': [{ id: 'm1', group_id: '1', content: 'Welcome to Data Structures group!', created_at: new Date().toISOString() }],
    '2': [{ id: 'm2', group_id: '2', content: 'Calculus session materials uploaded.', created_at: new Date().toISOString() }]
  };

  const DEFAULT_MEMBERS: Record<string, { id: string; name: string; initials: string }[]> = {
    '1': [{ id: 'u1', name: 'Alex Johnson', initials: 'AJ' }, { id: 'u2', name: 'Sarah Chen', initials: 'SC' }],
    '2': [{ id: 'u3', name: 'Mike Davis', initials: 'MD' }],
    '3': [{ id: 'u4', name: 'Priya Singh', initials: 'PS' }]
  };

  const safeParse = <T,>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try { return JSON.parse(raw) as T; } catch (e) { console.error('Failed to parse storage value', e); return fallback; }
  };

  const readStorageState = () => {
    const groups = safeParse<StudyGroup[]>(localStorage.getItem(STORAGE_KEYS.groups), DEFAULT_GROUPS);
    const messages = safeParse<Record<string, GroupMessage[]>>(localStorage.getItem(STORAGE_KEYS.messages), DEFAULT_MESSAGES);
    const members = safeParse<Record<string, { id: string; name: string; initials: string }[]>>(localStorage.getItem(STORAGE_KEYS.members), DEFAULT_MEMBERS);
    console.debug('[PeerBridge] readStorageState', { ts: localStorage.getItem(STORAGE_KEYS.lastUpdated), groupsCount: groups.length, messagesKeys: Object.keys(messages).length, membersKeys: Object.keys(members).length });
    return { groups, messages, members };
  };

  const writeStoragePieces = (pieces: { groups?: StudyGroup[]; messages?: Record<string, GroupMessage[]>; members?: Record<string, { id: string; name: string; initials: string }[]> }) => {
    try {
      if (pieces.groups) localStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(pieces.groups));
      if (pieces.messages) localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(pieces.messages));
      if (pieces.members) localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(pieces.members));
      const ts = String(Date.now());
      localStorage.setItem(STORAGE_KEYS.lastUpdated, ts);
      console.debug('[PeerBridge] writeStoragePieces', { ts, groupsWritten: pieces.groups ? pieces.groups.length : undefined });
      // Broadcast to other tabs; fallback to ping key
      try {
        const bc = new BroadcastChannel('peerbridge');
        bc.postMessage({ type: 'state-update', ts });
        bc.close();
      } catch {
        localStorage.setItem(STORAGE_KEYS.ping, ts);
      }
    } catch (e) {
      console.error('Failed to write storage pieces', e);
    }
  };

  const initial = readStorageState();

  const [groups, setGroups] = useState<StudyGroup[]>(initial.groups);
  const [messages, setMessages] = useState<Record<string, GroupMessage[]>>(initial.messages);
  const [groupMembers, setGroupMembers] = useState<Record<string, { id: string; name: string; initials: string }[]>>(initial.members);

  // refs for sync/debounce
  const lastUpdatedRef = useRef<string | null>(localStorage.getItem(STORAGE_KEYS.lastUpdated));
  const writeTimerRef = useRef<number | null>(null);

  // Listen for other-tab updates via BroadcastChannel and storage events
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('peerbridge');
      bc.onmessage = (ev) => {
        if (ev?.data?.type === 'state-update') {
          const last = localStorage.getItem(STORAGE_KEYS.lastUpdated);
          console.debug('[PeerBridge] bc.onmessage received', { last, lastUpdatedRef: lastUpdatedRef.current });
          if (last === lastUpdatedRef.current) return;
          lastUpdatedRef.current = last;
          const s = readStorageState();
          console.debug('[PeerBridge] bc applying state', { groupsCount: s.groups.length });
          setGroups(s.groups);
          setMessages(s.messages);
          setGroupMembers(s.members);
        }
      };
    } catch {
      bc = null;
    }

    const RELEVANT_KEYS = new Set<string>([STORAGE_KEYS.groups, STORAGE_KEYS.messages, STORAGE_KEYS.members, STORAGE_KEYS.lastUpdated, STORAGE_KEYS.ping]);

    const onStorage = (e: StorageEvent) => {
      const key = e.key;
      if (!key) return;
      if (!RELEVANT_KEYS.has(key)) return;
      const last = localStorage.getItem(STORAGE_KEYS.lastUpdated);
      console.debug('[PeerBridge] storage event', { key, last, lastUpdatedRef: lastUpdatedRef.current });
      if (last === lastUpdatedRef.current) return;
      lastUpdatedRef.current = last;
      const s = readStorageState();
      console.debug('[PeerBridge] storage applying state', { groupsCount: s.groups.length });
      setGroups(s.groups);
      setMessages(s.messages);
      setGroupMembers(s.members);
    };

    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  // Debounced persistence: write full current state (groups, messages, members) atomically
  useEffect(() => {
    if (writeTimerRef.current) window.clearTimeout(writeTimerRef.current);
    writeTimerRef.current = window.setTimeout(() => {
      writeStoragePieces({ groups, messages, members: groupMembers });
      writeTimerRef.current = null;
    }, 120);
    return () => { if (writeTimerRef.current) window.clearTimeout(writeTimerRef.current); };
  }, [groups, messages, groupMembers]);

  const [loading, setLoading] = useState(false);

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('');
  const [newGroupDate, setNewGroupDate] = useState('');
  const [newGroupTime, setNewGroupTime] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  // Chat dialog state
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [activeChatGroupId, setActiveChatGroupId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLocked, setChatLocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (groupId: string, content: string) => {
    if (!content || !groupId) return;
    const msg: GroupMessage = { id: `m-${Date.now()}`, group_id: groupId, content, created_at: new Date().toISOString() };
    setMessages(prev => ({ ...prev, [groupId]: [...(prev[groupId] || []), msg] }));
  };

  // helper used by dialog send button
  const handleDialogSend = async () => {
    if (!activeChatGroupId || chatLocked) return;
    const content = chatInput.trim();
    if (!content) return;
    await sendMessage(activeChatGroupId, content);
    setChatInput('');
    // scroll to bottom after next paint
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  useEffect(() => {
    // no-op for demo mode
  }, [selectedGroupId]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Peer Bridge
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect and learn together
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Study Groups</h2>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Group Name</label>
                    <Input placeholder="Intro to Algorithms" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Computer Science" value={newGroupSubject} onChange={(e) => setNewGroupSubject(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" value={newGroupDate} onChange={(e) => setNewGroupDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" value={newGroupTime} onChange={(e) => setNewGroupTime(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Optional details, location or meeting link" value={newGroupDescription} onChange={(e) => setNewGroupDescription(e.target.value)} rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-primary via-purple-500 to-pink-500" onClick={() => {
                      if (!newGroupName.trim()) {
                        toast({ title: 'Name required', description: 'Please provide a group name', variant: 'destructive' });
                        return;
                      }
                      const id = `local-${Date.now()}`;
                      const schedule = [newGroupDate, newGroupTime].filter(Boolean).join(' ');
                      const created: StudyGroup = { id, name: newGroupName.trim(), subject: newGroupSubject.trim(), schedule, members_count: 1, created_at: new Date().toISOString() };
                      console.debug('[PeerBridge] creating group locally', { id, name: created.name });
                      setGroups(prev => [created, ...prev]);
                      setGroupMembers(prev => ({ ...prev, [id]: [{ id: `u_local`, name: 'You (demo)', initials: 'ME' }] }));
                      setMessages(prev => ({ ...prev, [id]: [] }));
                      setIsCreating(false);
                      setNewGroupName(''); setNewGroupSubject(''); setNewGroupDate(''); setNewGroupTime(''); setNewGroupDescription('');
                      toast({ title: 'Group created', description: `"${created.name}" has been created (demo).` });
                      setSelectedGroupId(id);
                    }}>
                      Create
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {/* removed duplicate inline create controls - creation handled by dialog above */}

            {loading && <div>Loading groups…</div>}

            {groups.map((group) => (
              <Card key={group.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{group.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>{group.members_count ?? 0} members</span>
                          <span>•</span>
                          <span>{group.subject}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{group.schedule}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      // open chat dialog for this group
                      setActiveChatGroupId(group.id);
                      setChatDialogOpen(true);
                    }}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                    <Button variant="default" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Active Peers</h2>
          
          <div className="space-y-4">
            {activePeers.map((peer) => (
              <Card key={peer.id} className="hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-purple-500 text-white font-semibold">
                          {peer.initials}
                        </AvatarFallback>
                      </Avatar>
                      {peer.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{peer.name}</h3>
                      <p className="text-sm text-muted-foreground">{peer.skills}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {selectedGroupId && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Chat</h3>
          <div className="max-h-64 overflow-auto border rounded p-2 mt-2">
            {(messages[selectedGroupId] || []).map((m: GroupMessage) => (
              <div key={m.id} className="mb-2">
                <div className="text-sm text-muted-foreground">{new Date(m.created_at || '').toLocaleString()}</div>
                <div>{m.content}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="input input-bordered flex-1" placeholder="Write a message" />
            <Button onClick={async () => { if (newMessage.trim()) { await sendMessage(selectedGroupId, newMessage.trim()); setNewMessage(''); } }}>
              Send
            </Button>
          </div>
        </div>
      )}

      {/* Chat Dialog (local chat modal) */}
      <Dialog open={chatDialogOpen} onOpenChange={(open) => setChatDialogOpen(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Group Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{activeChatGroupId ? (groups.find(g => g.id === activeChatGroupId)?.name ?? 'Chat') : 'Chat'}</h4>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setChatLocked((v) => !v)} className="gap-2">
                  {chatLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span className="text-sm">{chatLocked ? 'Locked' : 'Unlocked'}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setChatDialogOpen(false)}>Close</Button>
              </div>
            </div>

            <div className="border rounded p-3 max-h-72 overflow-auto bg-[#0b0b0b]">
              {(activeChatGroupId ? (messages[activeChatGroupId] || []) : []).map((m) => (
                <div key={m.id} className="mb-3">
                  <div className="text-xs text-muted-foreground">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div>
                  <div className="bg-[#1A1A1A] p-2 rounded">{m.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="input input-bordered flex-1" placeholder={chatLocked ? 'Chat is locked' : 'Type a message...'} disabled={chatLocked} />
              <Button onClick={handleDialogSend} disabled={chatLocked || !chatInput.trim()}>
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeerBridge;
