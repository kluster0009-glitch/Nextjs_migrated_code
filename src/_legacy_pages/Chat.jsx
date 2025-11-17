'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Code,
  Search,
  Send,
  Smile,
  MessageCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Globe,
  Menu,
  X,
  Users,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BACKEND_URL } from '@/lib/config';
import { useAuth } from '@/lib/auth-context';
import { ChatMessage } from '@/components/ChatMessage';
import { UserProfileModal } from '@/components/UserProfileModal';

const Chat = () => {
  const { user, session } = useAuth(); // ✅ use auth context

  const [selectedChannelId, setSelectedChannelId] = useState(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    myCollege: true,
    subjects: true,
    global: true,
  });

  const [channelsState, setChannelsState] = useState({
    myCollege: [],
    subjects: [],
    global: [],
  });

  const [messages, setMessages] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [organizationName, setOrganizationName] = useState(null);
  const [memberCount, setMemberCount] = useState(null);
  const [joinedChannelIds, setJoinedChannelIds] = useState([]);
  const [profileModalUserId, setProfileModalUserId] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const allChannels = useMemo(
    () => [
      ...channelsState.myCollege,
      ...channelsState.subjects,
      ...channelsState.global,
    ],
    [channelsState]
  );

  const currentChannel = useMemo(
    () =>
      allChannels.find((c) => c.id === selectedChannelId) ||
      allChannels[0] ||
      null,
    [allChannels, selectedChannelId]
  );

  const getChannelIcon = (channel) => {
    if (!channel) return MessageCircle;
    if (channel.type === 'subject') {
      if (channel.subject_name?.toLowerCase().includes('computer')) return Code;
      if (channel.subject_name?.toLowerCase().includes('math')) return BookOpen;
      return BookOpen;
    }
    if (channel.type === 'college') return MessageCircle;
    if (channel.type === 'study_group') return Users;
    if (channel.type === 'global') return Globe;
    return MessageCircle;
  };

  const getChannelSubtitle = (channel) => {
    if (!channel) return '';
    if (channel.type === 'subject') return 'Subject channel';
    if (channel.type === 'study_group') return 'Study group';
    if (channel.type === 'college') return 'College channel';
    if (channel.type === 'global') return 'Global community channel';
    return '';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // --- Fetch Channel member count ---
  useEffect(() => {
    if (!currentChannel) {
      setMemberCount(null);
      return;
    }

    const fetchMemberCount = async () => {
      const { count, error } = await supabase
        .from('channel_members')
        .select('id', { count: 'exact', head: true })
        .eq('channel_id', currentChannel.id);

      if (error) {
        console.error('Error fetching member count:', error);
        setMemberCount(null);
        return;
      }

      setMemberCount(count ?? 0);
    };

    fetchMemberCount();
  }, [currentChannel?.id]);

  // --- Load joined channels for current user (to avoid repeated /join calls) ---
  useEffect(() => {
    const loadJoinedChannels = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('channel_members')
        .select('channel_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading joined channels', error);
        return;
      }

      const ids = (data || []).map((row) => row.channel_id);
      setJoinedChannelIds(ids);
    };

    loadJoinedChannels();
  }, [user?.id]);

  // --- Fetch Channels ---
  useEffect(() => {
    const fetchChannels = async () => {
      setLoadingChannels(true);
      try {
        let organizationId = null;

        if (user?.id) {
          // 1) Get current user's organization_id from profiles
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .maybeSingle();

          if (!profileError && profile && profile.organization_id) {
            organizationId = profile.organization_id ;

            // 2) Use organization_id to fetch organization_name from email_domains
            const { data: orgRow, error: orgError } = await supabase
              .from('email_domains')
              .select('organization_name')
              .eq('id', organizationId)
              .maybeSingle();

            if (!orgError && orgRow?.organization_name) {
              setOrganizationName(orgRow.organization_name );
            }
          }
        }

        // 3) Fetch all channels (we'll filter client-side)
        const { data, error } = await supabase
          .from('channels')
          .select(
            'id, name, description, type, scope, subject_name, organization_id'
          )
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching channels:', error);
          return;
        }

        const all = (data || []);

        // 4) Only my college's channels (scope=college AND org_id matches)
        const myCollege = all.filter((c) => {
          if (c.scope !== 'college') return false;
          if (!organizationId) return false; // no org -> no college-specific channels
          return c.organization_id === organizationId;
        });

        // 5) Only my college's subject channels
        const subjects = all.filter((c) => {
          if (c.type !== 'subject') return false;
          if (!organizationId) return false;
          return c.organization_id === organizationId;
        });

        // 6) Global channels are shared across colleges
        const global = all.filter(
          (c) => c.scope === 'global' || c.type === 'global'
        );

        setChannelsState({
          myCollege,
          subjects,
          global,
        });

        // 7) Set default selected channel
        if (!selectedChannelId) {
          const firstChannel = myCollege[0] || subjects[0] || global[0] || null;
          if (firstChannel) {
            setSelectedChannelId(firstChannel.id);
          }
        }
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchChannels();
  }, [user?.id, selectedChannelId]);

  // --- Load Messages for a Channel (with sender names) ---
  const loadMessages = useCallback(async (channelId) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, channel_id, sender_id, content, created_at, deleted')
        .eq('channel_id', channelId)
        .eq('deleted', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const rows = (data || []);

      // Collect unique sender IDs for profiles lookup
      const senderIds = Array.from(
        new Set(rows.map((m) => m.sender_id).filter(Boolean))
      );

      let profilesMap = {};
      if (senderIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', senderIds);

        if (!profilesError && profiles) {
          profilesMap = (profiles || []).reduce(
            (acc, p) => ({
              ...acc,
              [p.id]: p.full_name,
            }),
            {}
          );
        }
      }

      const enriched = rows.map((m) => ({
        ...m,
        sender_full_name: profilesMap[m.sender_id],
      }));

      setMessages(enriched);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Load messages whenever channel changes
  useEffect(() => {
    if (!selectedChannelId) return;
    loadMessages(selectedChannelId);
  }, [selectedChannelId, loadMessages]);

  // --- Realtime subscription per channel ---
  useEffect(() => {
    if (!selectedChannelId) return;

    const channel = supabase
      .channel(`messages_channel_${selectedChannelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${selectedChannelId}`,
        },
        () => {
          // For simplicity & correctness: reload messages whenever a new one arrives
          loadMessages(selectedChannelId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChannelId, loadMessages]);

  // Join channel via backend (Flask)
  const joinChannel = useCallback(
    async (channelId) => {
      try {
        const token = session?.access_token;
        if (!token) {
          console.warn('No auth token found while trying to join channel');
          return;
        }

        await fetch(`${BACKEND_URL}/channels/${channelId}/join`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.error('Error joining channel:', err);
      }
    },
    [session?.access_token]
  );

  const handleChannelSelect = async (channel) => {
    setSelectedChannelId(channel.id);
    setSidebarOpen(false);

    // Call /join only if not already a member
    if (!joinedChannelIds.includes(channel.id)) {
      await joinChannel(channel.id);
      setJoinedChannelIds((prev) => [...prev, channel.id]);
    }
  };

  const handleSendMessage = async () => {
    if (!currentChannel || !newMessage.trim()) return;
    setSending(true);
    try {
      const token = session?.access_token;
      if (!token) {
        console.warn('No auth token, cannot send message');
        setSending(false);
        return;
      }

      await fetch(`${BACKEND_URL}/channels/${currentChannel.id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      setNewMessage('');
      // Realtime will reload messages; no need to manually append
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) handleSendMessage();
    }
  };

  const ChannelListItem = ({ channel, isSelected }) => {
    const Icon = getChannelIcon(channel);
    return (
      <div
        onClick={() => handleChannelSelect(channel)}
        className={`
          flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
          ${
            isSelected
              ? 'bg-primary/15 text-primary font-medium shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }
        `}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            {channel.name || channel.subject_name || 'Untitled'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen immersive-bg">
      <div className="h-screen flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Channels */}
        <div
          className={`
          fixed lg:relative inset-y-0 left-0 z-50 
          w-72 md:w-80 bg-background/95 backdrop-blur-xl border-r border-border/50 
          flex flex-col shadow-lg transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        >
          {/* Header with Close Button */}
          <div className="p-5 border-b border-border/50 flex items-center justify-between lg:block">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search channels..."
                className="pl-10 bg-muted/50 border-border/40 rounded-lg h-10 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-2"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Channels List */}
          <ScrollArea className="flex-1 px-3">
            <div className="py-4 space-y-6">
              {/* My College */}
              <div>
                <button
                  onClick={() => toggleSection('myCollege')}
                  className="w-full flex items-center justify-between mb-3 px-2 hover:bg-muted/40 rounded-lg transition-colors group"
                >
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    My College ({organizationName || '...'})
                  </h3>
                  {expandedSections.myCollege ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
                {expandedSections.myCollege && (
                  <div className="space-y-0.5">
                    {channelsState.myCollege.map((channel) => (
                      <ChannelListItem
                        key={channel.id}
                        channel={channel}
                        isSelected={currentChannel?.id === channel.id}
                        section="myCollege"
                      />
                    ))}
                    {channelsState.myCollege.length === 0 && !loadingChannels && (
                      <p className="text-[11px] text-muted-foreground px-3">
                        No college channels available yet.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Subjects */}
              <div>
                <button
                  onClick={() => toggleSection('subjects')}
                  className="w-full flex items-center justify-between mb-3 px-2 hover:bg-muted/40 rounded-lg transition-colors group"
                >
                  <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Subjects
                  </h3>
                  {expandedSections.subjects ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
                {expandedSections.subjects && (
                  <div className="space-y-0.5">
                    {channelsState.subjects.map((channel) => (
                      <ChannelListItem
                        key={channel.id}
                        channel={channel}
                        isSelected={currentChannel?.id === channel.id}
                        section="subjects"
                      />
                    ))}
                    {channelsState.subjects.length === 0 && !loadingChannels && (
                      <p className="text-[11px] text-muted-foreground px-3">
                        No subject channels yet.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Global */}
              <div>
                <button
                  onClick={() => toggleSection('global')}
                  className="w-full flex items-center justify-between mb-3 px-2 hover:bg-muted/40 rounded-lg transition-colors group"
                >
                  <h3 className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    Global
                  </h3>
                  {expandedSections.global ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
                {expandedSections.global && (
                  <div className="space-y-0.5">
                    {channelsState.global.map((channel) => (
                      <ChannelListItem
                        key={channel.id}
                        channel={channel}
                        isSelected={currentChannel?.id === channel.id}
                        section="global"
                      />
                    ))}
                    {channelsState.global.length === 0 && !loadingChannels && (
                      <p className="text-[11px] text-muted-foreground px-3">
                        No global channels yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background/50">
          {/* Chat Header */}
          <div className="h-16 bg-background/95 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 md:px-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {currentChannel &&
                  (() => {
                    const Icon = getChannelIcon(currentChannel);
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
              </div>

              <div>
                <h2 className="font-semibold text-foreground text-base">
                  {currentChannel
                    ? currentChannel.name ||
                      currentChannel.subject_name ||
                      'Channel'
                    : 'Select a channel'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {currentChannel
                    ? getChannelSubtitle(currentChannel)
                    : 'Choose a channel from the sidebar to start chatting.'}
                </p>
              </div>
            </div>
            {currentChannel && (
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-medium">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                {memberCount !== null ? `${memberCount} members` : '...'}
              </Badge>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {loadingMessages && (
                <p className="text-xs text-muted-foreground text-center">
                  Loading messages...
                </p>
              )}
              {!loadingMessages && messages.length === 0 && currentChannel && (
                <p className="text-xs text-muted-foreground text-center">
                  No messages yet. Say hi 👋
                </p>
              )}
              {!currentChannel && !loadingMessages && (
                <p className="text-xs text-muted-foreground text-center">
                  Select a channel to view messages.
                </p>
              )}
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  getInitials={getInitials}
                  onViewProfile={(userId) => {
                    setProfileModalUserId(userId);
                    setProfileModalOpen(true);
                  }}
                />
              ))}
              <UserProfileModal
                userId={profileModalUserId}
                open={profileModalOpen}
                onOpenChange={setProfileModalOpen}
              />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="flex items-end gap-2 md:gap-3 max-w-5xl mx-auto">
              <div className="flex-1 relative">
                <Input
                  placeholder={
                    currentChannel
                      ? `Message ${currentChannel.name}`
                      : 'Select a channel to start chatting...'
                  }
                  disabled={!currentChannel || sending}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="pr-20 md:pr-24 pl-3 md:pl-4 py-5 md:py-6 bg-muted/50 border-border/40 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-xs md:text-sm"
                />
                <div className="absolute right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5 md:gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 md:w-9 md:h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all rounded-lg"
                    disabled={!currentChannel}
                  >
                    <Smile className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="w-8 h-8 md:w-9 md:h-9 p-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all rounded-lg shadow-sm"
                    disabled={!currentChannel || sending || !newMessage.trim()}
                    onClick={handleSendMessage}
                  >
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

