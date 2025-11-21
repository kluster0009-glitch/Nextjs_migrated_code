"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Search,
  Send,
  MoreVertical,
  MessageCircle,
  CheckCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatPage() {
  const { user } = useAuth();
  const { profile, getAvatarUrl } = useProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalUnread, setTotalUnread] = useState(0);
  const [activeTab, setActiveTab] = useState("all"); // all, unread, favourites, groups, community
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const tabsScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Calculate total unread messages
  useEffect(() => {
    const total = conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount || 0),
      0
    );
    setTotalUnread(total);
  }, [conversations]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user?.id) {
      console.log("fetchConversations: No user ID available");
      return;
    }

    console.log("fetchConversations: Starting fetch for user:", user.id);

    try {
      const supabase = createClient();

      // Get all conversation IDs where user is a participant
      const { data: participations, error: partError } = await supabase
        .from("conversation_participants")
        .select("conversation_id, last_read_at")
        .eq("user_id", user.id);

      console.log("fetchConversations: Participations query result:", {
        participations,
        partError,
      });

      if (partError) {
        console.error(
          "fetchConversations: Error fetching participations:",
          partError
        );
        throw partError;
      }

      if (!participations || participations.length === 0) {
        console.log("fetchConversations: No participations found");
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = participations.map((p) => p.conversation_id);
      console.log(
        "fetchConversations: Found conversation IDs:",
        conversationIds
      );

      // Get conversations with their last messages
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .in("id", conversationIds)
        .order("updated_at", { ascending: false });

      console.log("fetchConversations: Conversations query result:", {
        convData,
        convError,
      });

      if (convError) {
        console.error(
          "fetchConversations: Error fetching conversations:",
          convError
        );
        throw convError;
      }

      // For each conversation, get the other participant and last message
      const conversationsWithDetails = await Promise.all(
        convData.map(async (conv) => {
          console.log("Processing conversation:", conv.id);

          // Get ALL participants (RLS only lets us see participants for conversations we're in)
          const { data: allParticipants, error: participantsError } =
            await supabase
              .from("conversation_participants")
              .select("user_id")
              .eq("conversation_id", conv.id);

          console.log("All participants for", conv.id, ":", {
            allParticipants,
            participantsError,
          });

          if (
            participantsError ||
            !allParticipants ||
            allParticipants.length === 0
          ) {
            console.warn("No participants found for conversation:", conv.id);
            return null;
          }

          // Filter out current user to get other participant(s)
          const otherParticipants = allParticipants.filter(
            (p) => p.user_id !== user.id
          );

          if (otherParticipants.length === 0) {
            console.warn(
              "No other participant found for conversation:",
              conv.id
            );
            return null;
          }

          const otherUserId = otherParticipants[0].user_id;
          console.log("Other user ID:", otherUserId);

          // Get other user's profile
          const { data: otherUserProfile, error: profileError } = await supabase
            .from("profiles")
            .select("id, full_name, profile_picture")
            .eq("id", otherUserId)
            .single();

          console.log("Other user profile:", {
            otherUserProfile,
            profileError,
          });

          if (profileError || !otherUserProfile) {
            console.warn("No profile found for user:", otherUserId);
            return null;
          }

          // Get last message (don't use .single() as there might be no messages)
          const { data: lastMessages, error: messagesError } = await supabase
            .from("dm_messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1);

          const lastMessageData =
            lastMessages && lastMessages.length > 0 ? lastMessages[0] : null;
          console.log("Last message for", conv.id, ":", {
            lastMessageData,
            messagesError,
          });

          // Count unread messages
          const userParticipation = participations.find(
            (p) => p.conversation_id === conv.id
          );
          const { data: unreadMessages } = await supabase
            .from("dm_messages")
            .select("id")
            .eq("conversation_id", conv.id)
            .neq("sender_id", user.id)
            .gt(
              "created_at",
              userParticipation?.last_read_at || new Date(0).toISOString()
            );

          const unreadCount = unreadMessages?.length || 0;

          const conversationObj = {
            id: conv.id,
            otherUser: otherUserProfile,
            lastMessage: lastMessageData,
            unreadCount: unreadCount,
            updatedAt: conv.updated_at,
          };

          console.log("Built conversation object:", conversationObj);
          return conversationObj;
        })
      );

      const validConversations = conversationsWithDetails.filter(
        (c) => c !== null
      );
      console.log("Loaded conversations:", validConversations);
      setConversations(validConversations);

      // Trigger global unread badge refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("conversationsUpdated"));
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("dm_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      await supabase.rpc("mark_messages_read", { conv_id: conversationId });

      // Update local unread count
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );

      // Trigger global unread badge refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("conversationsUpdated"));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  // Handle new conversation from URL parameter
  useEffect(() => {
    const otherUserId = searchParams?.get("user");
    if (otherUserId && user) {
      startNewConversation(otherUserId);
    }
  }, [searchParams, user]);

  // Start new conversation or open existing one
  const startNewConversation = async (otherUserId) => {
    try {
      const supabase = createClient();

      // Use the database function to get or create conversation
      const { data, error } = await supabase.rpc("get_or_create_conversation", {
        user1_id: user.id,
        user2_id: otherUserId,
      });

      if (error) throw error;

      const conversationId = data;

      // Fetch the conversation details
      const { data: otherUserProfile } = await supabase
        .from("profiles")
        .select("id, full_name, profile_picture")
        .eq("id", otherUserId)
        .single();

      const newChat = {
        id: conversationId,
        otherUser: otherUserProfile,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };

      // Check if conversation already in list
      const existingConv = conversations.find((c) => c.id === conversationId);
      if (!existingConv) {
        setConversations((prev) => [newChat, ...prev]);
      }

      setSelectedChat(newChat);
      await fetchMessages(conversationId);

      // Clear URL parameter
      router.replace("/chat");
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      console.log("Fetching conversations for user:", user.id);
      fetchConversations();
    } else {
      console.log("No user found, waiting...");
    }
  }, [user?.id]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel("dm_messages_changes_" + user.id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
        },
        async (payload) => {
          console.log("New message received:", payload.new);

          // If message is in current conversation, add to messages
          if (payload.new.conversation_id === selectedChat?.id) {
            setMessages((prev) => {
              // Check if message already exists to avoid duplicates
              if (prev.some((m) => m.id === payload.new.id)) {
                return prev;
              }
              return [...prev, payload.new];
            });

            // Mark as read if user is viewing and not sender
            if (payload.new.sender_id !== user.id) {
              await supabase.rpc("mark_messages_read", {
                conv_id: payload.new.conversation_id,
              });
            }
          }

          // Always update conversation list to show new message
          setConversations((prev) => {
            const convIndex = prev.findIndex(
              (c) => c.id === payload.new.conversation_id
            );

            if (convIndex !== -1) {
              const updatedConv = {
                ...prev[convIndex],
                lastMessage: payload.new,
                updatedAt: payload.new.created_at,
              };

              // If message is not from current user and not in selected chat, increment unread
              if (
                payload.new.sender_id !== user.id &&
                payload.new.conversation_id !== selectedChat?.id
              ) {
                updatedConv.unreadCount =
                  (prev[convIndex].unreadCount || 0) + 1;
              }

              // Move conversation to top
              const newConvs = prev.filter((_, i) => i !== convIndex);
              return [updatedConv, ...newConvs];
            } else {
              // New conversation, fetch full details
              fetchConversations();
              return prev;
            }
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "dm_messages",
        },
        (payload) => {
          // Update message in list (for edits)
          if (payload.new.conversation_id === selectedChat?.id) {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user, selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    setSending(true);
    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic update - show message immediately
    const optimisticMessage = {
      id: tempId,
      conversation_id: selectedChat.id,
      sender_id: user.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      is_edited: false,
      is_deleted: false,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("dm_messages")
        .insert({
          conversation_id: selectedChat.id,
          sender_id: user.id,
          content: messageContent,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temporary message with real one
      setMessages((prev) => prev.map((m) => (m.id === tempId ? data : m)));
    } catch (error) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    await fetchMessages(chat.id);
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const formatMessageTime = (date) => {
    try {
      const messageDate = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (messageDate.toDateString() === today.toDateString()) {
        return messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return messageDate.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return "";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    // Search filter
    const matchesSearch = conv.otherUser?.full_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Tab filter
    if (activeTab === "unread") {
      return matchesSearch && conv.unreadCount > 0;
    }
    // For now, other tabs show all conversations
    return matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: totalUnread },
    { id: "favourites", label: "Favourites" },
    { id: "groups", label: "Groups", count: 51 },
    { id: "community", label: "Community" },
  ];

  // Handle drag scrolling for tabs
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tabsScrollRef.current.offsetLeft);
    setScrollLeft(tabsScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabsScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    tabsScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - tabsScrollRef.current.offsetLeft);
    setScrollLeft(tabsScrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - tabsScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-screen bg-cyber-darker overflow-hidden">
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div
          className={`${
            selectedChat ? "hidden md:block" : "block"
          } w-full md:w-80 lg:w-96 bg-cyber-card/30 backdrop-blur-xl border-r border-cyber-border`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-cyber-border space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                  Messages
                </h2>
                {totalUnread > 0 && (
                  <Badge className="bg-neon-cyan text-black text-sm">
                    {totalUnread}
                  </Badge>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-10 bg-cyber-darker border-cyber-border"
                />
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div
                  ref={tabsScrollRef}
                  className="w-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none"
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <TabsList className="inline-flex gap-1 bg-cyber-darker p-0.5 w-max min-w-full">
                    <TabsTrigger
                      value="all"
                      className="text-xs whitespace-nowrap px-3 py-1.5 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="unread"
                      className="text-xs whitespace-nowrap px-3 py-1.5 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
                    >
                      Unread{" "}
                      {totalUnread > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 h-4 px-1 text-[10px]"
                        >
                          {totalUnread}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="favourites"
                      className="text-xs whitespace-nowrap px-3 py-1.5 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
                    >
                      Favourites
                    </TabsTrigger>
                    <TabsTrigger
                      value="groups"
                      className="text-xs whitespace-nowrap px-3 py-1.5 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
                    >
                      Groups{" "}
                      <Badge
                        variant="secondary"
                        className="ml-1 h-4 px-1 text-[10px]"
                      >
                        51
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="community"
                      className="text-xs whitespace-nowrap px-3 py-1.5 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
                    >
                      Community
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MessageCircle className="w-16 h-16 mb-4 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "No conversations found" : "No messages yet"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery
                      ? "Try a different search"
                      : "Visit a user's profile to start chatting!"}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredConversations.map((conv) => (
                    <Card
                      key={conv.id}
                      className={`cursor-pointer border-0 transition-all ${
                        selectedChat?.id === conv.id
                          ? "bg-neon-cyan/20 border-neon-cyan/30"
                          : "bg-cyber-card/50 hover:bg-cyber-darker/70"
                      }`}
                      onClick={() => handleSelectChat(conv)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage
                              src={conv.otherUser?.profile_picture}
                            />
                            <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                              {getUserInitials(conv.otherUser?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {conv.otherUser?.full_name || "User"}
                            </h3>
                            {conv.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(conv.lastMessage.created_at)}
                              </span>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p
                              className={`text-sm truncate ${
                                conv.unreadCount > 0
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {conv.lastMessage.sender_id === user.id &&
                                "You: "}
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-neon-cyan text-black">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            selectedChat ? "flex" : "hidden md:flex"
          } flex-1 flex-col`}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <Card className="rounded-none border-0 border-b bg-cyber-card/30">
                <CardHeader className="h-16 p-4 md:px-6 flex flex-row items-center justify-between space-y-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-2"
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() =>
                      router.push(`/profile/${selectedChat.otherUser.id}`)
                    }
                  >
                    <Avatar>
                      <AvatarImage
                        src={selectedChat.otherUser?.profile_picture}
                      />
                      <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                        {getUserInitials(selectedChat.otherUser?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedChat.otherUser?.full_name || "User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click to view profile
                      </p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>More options</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
              </Card>
              <Separator />

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-6"
                ref={messagesContainerRef}
              >
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                      <h3 className="text-xl font-semibold mb-2">
                        No messages yet
                      </h3>
                      <p className="text-muted-foreground">
                        Start the conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isOwn = msg.sender_id === user.id;
                      const showDate =
                        index === 0 ||
                        new Date(
                          messages[index - 1].created_at
                        ).toDateString() !==
                          new Date(msg.created_at).toDateString();

                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="text-xs bg-cyber-card px-3 py-1 rounded-full text-muted-foreground">
                                {formatMessageTime(msg.created_at)}
                              </span>
                            </div>
                          )}
                          <div
                            className={`flex ${
                              isOwn ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] md:max-w-md px-4 py-2 rounded-2xl ${
                                isOwn
                                  ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-black rounded-br-sm"
                                  : "bg-cyber-card border border-cyber-border text-foreground rounded-bl-sm"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {msg.content}
                              </p>
                              <div className="flex items-center gap-1 justify-end mt-1">
                                <span className="text-xs opacity-70">
                                  {new Date(msg.created_at).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                                {isOwn && (
                                  <CheckCheck className="w-3 h-3 opacity-70" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <Separator />
              {/* Message Input */}
              <Card className="rounded-none border-0 border-t bg-cyber-card/30">
                <CardContent className="p-4">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-cyber-darker border-cyber-border rounded-full px-4"
                      disabled={sending}
                      autoComplete="off"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!newMessage.trim() || sending}
                      className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black rounded-full"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-cyber-darker/50 p-4">
              <div className="text-center">
                <MessageCircle className="w-16 md:w-24 h-16 md:h-24 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
