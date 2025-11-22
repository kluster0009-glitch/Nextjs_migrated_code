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
import { InviteMemberDialog } from "@/components/InviteMemberDialog";


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
  Plus, Users, Trash2, LogOut, UserPlus
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatPage() {
  const { user } = useAuth();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
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
  // Group Members State
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

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

  const handleCreateGroup = async () => {
    const name = newGroupName.trim();
    if (!name) {
      toast.error("Please enter a group name");
      return;
    }

    await createGroupConversation(name);
    setNewGroupName("");
    setIsCreateGroupOpen(false);
  };

  const handleCopyGroupLink = async () => {
    if (!selectedChat?.id || !selectedChat.isGroup) return;

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const link = `${origin}/chat?group=${selectedChat.id}`;

      await navigator.clipboard.writeText(link);
      toast.success("Invite link copied to clipboard");
    } catch (err) {
      console.error("Error copying invite link:", err);
      toast.error("Failed to copy link");
    }
  };



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
      // For each conversation, get participants, last message, etc.
      const conversationsWithDetails = await Promise.all(
        convData.map(async (conv) => {
          console.log("Processing conversation:", conv.id);

          // Get ALL participants (RLS only lets us see participants for conversations we're in)
          const { data: allParticipants, error: participantsError } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", conv.id);

          console.log("All participants for", conv.id, ":", {
            allParticipants,
            participantsError,
          });

          if (participantsError || !allParticipants || allParticipants.length === 0) {
            console.warn("No participants found for conversation:", conv.id);
            return null;
          }

          const participantIds = allParticipants.map((p) => p.user_id);
          const otherParticipantIds = participantIds.filter((id) => id !== user.id);

          // Get last message (don't use .single() as there might be no messages)
          const { data: lastMessages, error: messagesError } = await supabase
            .from("dm_messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false })
            .limit(1);

          const lastMessageData =
            lastMessages && lastMessages.length > 0 ? lastMessages[0] : null;
          console.log("Last message for", conv.id, ":", {
            lastMessageData,
            messagesError,
          });

          // Count unread messages for this user
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

          // 🔹 If it's a group conversation
          if (conv.is_group) {
            const conversationObj = {
              id: conv.id,
              isGroup: true,
              groupName: conv.group_name || "Group",
              participantCount: allParticipants.length,
              lastMessage: lastMessageData,
              unreadCount,
              updatedAt: conv.updated_at,
            };

            console.log("Built GROUP conversation object:", conversationObj);
            return conversationObj;
          }

          // 🔹 Else, it's a DM (existing behaviour)
          if (otherParticipantIds.length === 0) {
            console.warn("No other participant found for conversation:", conv.id);
            return null;
          }

          const otherUserId = otherParticipantIds[0];
          console.log("Other user ID:", otherUserId);

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

          const conversationObj = {
            id: conv.id,
            isGroup: false,
            otherUser: otherUserProfile,
            lastMessage: lastMessageData,
            unreadCount,
            updatedAt: conv.updated_at,
          };

          console.log("Built DM conversation object:", conversationObj);
          return conversationObj;
        })
      );




      const validConversations = conversationsWithDetails.filter(
        (c) => c !== null
      );

      // Remove duplicates by conversation ID
      const uniqueConversations = validConversations.reduce((acc, current) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      console.log("Loaded conversations:", uniqueConversations);
      setConversations(uniqueConversations);

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

      console.log("📩 Fetching messages for conversation:", conversationId);

      // 1️⃣ Fetch messages
      const { data: messages, error } = await supabase
        .from("dm_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log("➡️ Raw Messages:", messages);

      // 2️⃣ Extract unique sender_ids
      const senderIds = [...new Set(messages.map((m) => m.sender_id))];
      console.log("👤 Sender IDs:", senderIds);

      // 3️⃣ Fetch all profiles for those sender_ids
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, profile_picture, username")
        .in("id", senderIds);

      if (profilesError) throw profilesError;

      console.log("👥 Profiles Fetched:", profilesData);

      // 4️⃣ Merge each message with its sender profile
      const messagesWithProfiles = messages.map((msg) => {
        const profile = profilesData?.find((p) => p.id === msg.sender_id) || null;

        console.log("🔗 Mapping message:", msg.id, "=> Profile:", profile);

        return {
          ...msg,
          profile,
        };
      });

      console.log("✅ Final Merged Messages:", messagesWithProfiles);

      // 5️⃣ Save final message list
      setMessages(messagesWithProfiles);

      // Mark as read
      await supabase.rpc("mark_messages_read", { conv_id: conversationId });

      // Clear unread counter locally
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
      console.error("❌ Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };



  const joinGroupFromLink = async (groupId) => {
    if (!user?.id || !groupId) return;

    try {
      const supabase = createClient();

      // 1) Try to join the group by inserting into conversation_participants
      const { error: partError } = await supabase
        .from("conversation_participants")
        .insert({
          conversation_id: groupId,
          user_id: user.id,
        });

      if (partError) {
        // 23505 = unique_violation (already a participant)
        if (partError.code === "23505") {
          console.log("User is already a member of this group");
        } else if (partError.code === "23503") {
          // 23503 = foreign_key_violation (conversation_id doesn't exist)
          console.error("Invalid group link (FK violation):", partError);
          toast.error("Invalid or expired group link");
          return;
        } else {
          throw partError;
        }
      }

      // 2) Now we are a participant, SELECT is allowed by RLS
      const { data: conv, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", groupId)
        .maybeSingle(); // safer than .single()

      if (convError) {
        console.error("Error fetching conversation after join:", convError);
        toast.error("Failed to open group");
        return;
      }

      if (!conv || !conv.is_group) {
        toast.error("This is not a valid group");
        return;
      }

      // 3) Build chat object for sidebar / header
      const newChat = {
        id: conv.id,
        isGroup: true,
        groupName: conv.group_name || "Group",
        lastMessage: null,
        unreadCount: 0,
        updatedAt: conv.updated_at,
      };

      // 4) Add to conversation list if not already there
      setConversations((prev) => {
        if (prev.some((c) => c.id === conv.id)) return prev;
        return [newChat, ...prev];
      });

      // 5) Select this chat and load messages
      setSelectedChat(newChat);
      await fetchMessages(conv.id);

      // 6) Clean URL
      router.replace("/chat");

      toast.success("Joined group via invite link");
    } catch (error) {
      console.error("Error joining group from link:", error);
      toast.error("Failed to join group");
    }
  };


  // Handle new conversation from URL parameter
  useEffect(() => {
    const otherUserId = searchParams?.get("user");
    const groupId = searchParams?.get("group");

    if (user) {
      if (otherUserId) {
        startNewConversation(otherUserId);
      } else if (groupId) {
        joinGroupFromLink(groupId);
      }
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
        isGroup: false,
        otherUser: otherUserProfile,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };

      // Check if conversation already in list
      const existingConv = conversations.find((c) => c.id === conversationId);
      if (!existingConv) {
        setConversations((prev) => {
          // Double check it's not already there to prevent race conditions
          if (prev.some(c => c.id === conversationId)) {
            return prev;
          }
          return [newChat, ...prev];
        });
      } else {
        // Update existing conversation
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? newChat : c))
        );
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

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    const channel = supabase
      .channel("dm_messages_changes_" + user.id)

      // 🔵 INSERT — new incoming message
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dm_messages" },
        async (payload) => {
          console.log("🔵 RT: New Message:", payload.new);

          const msg = payload.new;

          // Only handle messages for currently opened chat
          if (msg.conversation_id === selectedChat?.id) {

            // ⬇ Fetch sender's profile
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("id, full_name, profile_picture, username")
              .eq("id", msg.sender_id)
              .single();

            const messageWithProfile = {
              ...msg,
              profile: senderProfile || null,
            };

            // ⬇ Add message if not already present
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, messageWithProfile];
            });

            // Mark as read if message is not sent by you
            if (msg.sender_id !== user.id) {
              await supabase.rpc("mark_messages_read", {
                conv_id: msg.conversation_id,
              });
            }
          }

          // 🔄 Update conversations list (sidebar)
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.id === msg.conversation_id);
            if (index === -1) return prev;

            const updated = { ...prev[index] };

            updated.lastMessage = msg;
            updated.updatedAt = msg.created_at;

            if (
              msg.sender_id !== user.id &&
              msg.conversation_id !== selectedChat?.id
            ) {
              updated.unreadCount = (updated.unreadCount || 0) + 1;
            }

            const newList = prev.filter((_, i) => i !== index);
            return [updated, ...newList];
          });
        }
      )

      // 🟡 UPDATE — message edited (same fix applied)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "dm_messages" },
        async (payload) => {
          console.log("🟡 RT: Message Edited:", payload.new);

          const msg = payload.new;

          if (msg.conversation_id === selectedChat?.id) {
            // Fetch sender's profile again
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("id, full_name, profile_picture, username")
              .eq("id", msg.sender_id)
              .single();

            const updatedMsg = {
              ...msg,
              profile: senderProfile || null,
            };

            setMessages((prev) =>
              prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
            );
          }
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedChat]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    setSending(true);
    const supabase = createClient();
    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic message
    const optimisticMessage = {
      id: tempId,
      conversation_id: selectedChat.id,
      sender_id: user.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      is_edited: false,
      is_deleted: false,
      profile: {
        // immediate profile in UI
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        profile_picture: user.profile_picture,
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
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

      // Fetch profile for sender (your profile)
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("id, full_name, profile_picture, username")
        .eq("id", user.id)
        .single();

      const messageWithProfile = {
        ...data,
        profile: senderProfile || null,
      };

      // Replace temp with real message including profile
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? messageWithProfile : m))
      );
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
    const displayName = conv.isGroup
      ? conv.groupName
      : conv.otherUser?.full_name;
    const matchesSearch = displayName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "unread") {
      return conv.unreadCount > 0;
    }

    if (activeTab === "dm") {
      return !conv.isGroup; // Show only direct messages (non-group)
    }

    if (activeTab === "groups") {
      return conv.isGroup;
    }

    // "all", "community" etc -> show everything for now
    return true;
  });


  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: totalUnread },
    { id: "dm", label: "DM" },
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

  const createGroupConversation = async (groupName, memberIds = []) => {
    if (!user?.id) return;

    try {
      const supabase = createClient();

      // 1) Create group conversation
      const { data: conv, error: convError } = await supabase
        .from("conversations")
        .insert({
          is_group: true,
          group_name: groupName,
          // created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // 2) Add participants: creator + members
      const participants = [
        { conversation_id: conv.id, user_id: user.id },
        ...memberIds.map((id) => ({
          conversation_id: conv.id,
          user_id: id,
        })),
      ];

      const { error: partError } = await supabase
        .from("conversation_participants")
        .insert(participants);

      if (partError) throw partError;

      // 3) Add to local state & open it
      const newChat = {
        id: conv.id,
        isGroup: true,
        groupName: conv.group_name || groupName,
        participantCount: participants.length,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: conv.created_at,
      };

      setConversations((prev) => {
        // Prevent duplicate group
        if (prev.some(c => c.id === conv.id)) {
          return prev;
        }
        return [newChat, ...prev];
      });
      setSelectedChat(newChat);
      setMessages([]);

      toast.success("Group created");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    }
  };

  const inviteToGroup = async (conversationId, userIdToInvite) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("conversation_participants")
        .insert({
          conversation_id: conversationId,
          user_id: userIdToInvite,
        });

      if (error) throw error;
      toast.success("Member invited");
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to invite member");
    }
  };

  const fetchGroupMembers = async (conversationId) => {
    try {
      setLoadingMembers(true);
      const supabase = createClient();

      // 1. Get User IDs from conversation_participants
      const { data: participants, error: partError } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conversationId);

      if (partError) throw partError;

      const userIds = participants.map((p) => p.user_id);

      if (userIds.length === 0) {
        setGroupMembers([]);
        return;
      }

      // 2. Get Profiles using those IDs
      const { data: profiles, error: profError } = await supabase
        .from("profiles")
        .select("id, full_name, profile_picture, username, department, role")
        .in("id", userIds);

      if (profError) throw profError;

      setGroupMembers(profiles);
    } catch (error) {
      console.error("Error fetching group members:", error);
      toast.error("Failed to load group members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const leaveConversation = async (conversationId) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("conversation_participants")
        .delete()
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id);

      if (error) throw error;

      setConversations((prev) =>
        prev.filter((c) => c.id !== conversationId)
      );
      if (selectedChat?.id === conversationId) {
        setSelectedChat(null);
        setMessages([]);
      }

      toast.success("You left the conversation");
    } catch (error) {
      console.error("Error leaving conversation:", error);
      toast.error("Failed to leave conversation");
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      const supabase = createClient();
      console.log("Deleting conversation", conversationId);

      const { data, error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId)
        .select("id");

      console.log("Delete result", { data, error });

      if (error) {
        console.error("Error deleting conversation:", error);
        toast.error("Failed to delete conversation");
        return;
      }

      // ❗ If RLS blocked it (non-creator), data will be [].
      if (!data || data.length === 0) {
        toast.error("Only the group owner can delete this group");
        return;
      }

      // ✅ At least one row was actually deleted
      setConversations((prev) =>
        prev.filter((c) => c.id !== conversationId)
      );
      if (selectedChat?.id === conversationId) {
        setSelectedChat(null);
        setMessages([]);
      }

      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };


  return (
    <div className="h-screen bg-cyber-darker overflow-hidden">
      <InviteMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        conversationId={selectedChat?.id}
      />

      {/* Group Members Dialog */}
      <Dialog open={isGroupInfoOpen} onOpenChange={setIsGroupInfoOpen}>
        <DialogContent className="bg-cyber-card border-cyber-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedChat?.groupName} • {groupMembers.length} members
            </p>
          </DialogHeader>

          <div className="mt-4">
            {loadingMembers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 hover:bg-cyber-darker/50 rounded-lg transition-colors cursor-pointer"
                      onClick={() => {
                        setIsGroupInfoOpen(false); // Close modal
                        router.push(`/profile/${member.id}`); // Navigate to profile
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-cyber-border">
                          <AvatarImage src={member.profile_picture} />
                          <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                            {getUserInitials(member.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {member.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{member.username}
                            {member.department && ` • ${member.department}`}
                          </p>
                        </div>
                      </div>

                      {/* Optional: Admin Badge if you track creator_id */}
                      {selectedChat?.created_by === member.id && (
                        <Badge variant="outline" className="text-[10px] border-neon-purple text-neon-purple">
                          Admin
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent className="bg-cyber-card border-cyber-border">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="bg-cyber-darker border-cyber-border"
            />
            {/* Later you can add member selection here */}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateGroupOpen(false);
                setNewGroupName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              className="bg-neon-purple/80 text-black"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div
          className={`${selectedChat ? "hidden md:block" : "block"
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
                <Button
                  size="sm"
                  className="ml-2 bg-neon-purple/80 text-black"
                  onClick={() => setIsCreateGroupOpen(true)}
                >
                  + Group
                </Button>

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
                      value="dm"
                      className="text-xs whitespace-nowrap px-3 py-1.5 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
                    >
                      DM
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
                      className={`cursor-pointer border-0 transition-all ${selectedChat?.id === conv.id
                        ? "bg-neon-cyan/20 border-neon-cyan/30"
                        : "bg-cyber-card/50 hover:bg-cyber-darker/70"
                        }`}
                      onClick={() => handleSelectChat(conv)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            {/* For groups you could later add a group icon; for now just initials */}
                            {!conv.isGroup && (
                              <AvatarImage src={conv.otherUser?.profile_picture} />
                            )}
                            <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                              {conv.isGroup
                                ? getUserInitials(conv.groupName || "G")
                                : getUserInitials(conv.otherUser?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {conv.isGroup
                                ? conv.groupName || "Group"
                                : conv.otherUser?.full_name || "User"}
                            </h3>
                            {conv.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(conv.lastMessage.created_at)}
                              </span>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p
                              className={`text-sm truncate ${conv.unreadCount > 0
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                                }`}
                            >
                              {!conv.isGroup && conv.lastMessage.sender_id === user.id && "You: "}
                              {conv.isGroup && conv.lastMessage.sender_id === user.id
                                ? "You: "
                                : ""}
                              {conv.lastMessage.content}
                            </p>
                          )}
                          {conv.isGroup && (
                            <p className="text-[11px] text-muted-foreground truncate">
                              Group chat
                            </p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-neon-cyan text-black">{conv.unreadCount}</Badge>
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
          className={`${selectedChat ? "flex" : "hidden md:flex"
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
                    onClick={() => {
                      if (selectedChat.isGroup) {
                        // CASE 1: Open Group Members List
                        setIsGroupInfoOpen(true);
                        fetchGroupMembers(selectedChat.id);
                      } else if (selectedChat.otherUser?.id) {
                        // CASE 2: Go to User Profile
                        router.push(`/profile/${selectedChat.otherUser.id}`);
                      }
                    }}
                  >
                    <Avatar>
                      {!selectedChat.isGroup && (
                        <AvatarImage src={selectedChat.otherUser?.profile_picture} />
                      )}
                      <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                        {selectedChat.isGroup
                          ? getUserInitials(selectedChat.groupName || "G")
                          : getUserInitials(selectedChat.otherUser?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedChat.isGroup
                          ? selectedChat.groupName || "Group"
                          : selectedChat.otherUser?.full_name || "User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.isGroup
                          ? "Group chat"
                          : "Click to view profile"}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-cyber-card border-cyber-border">
                      {selectedChat?.isGroup ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => setIsInviteDialogOpen(true)}
                          >
                            Invite member
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleCopyGroupLink}>
                            Invite by link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => leaveConversation(selectedChat.id)}
                          >
                            Exit group
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => deleteConversation(selectedChat.id)}
                          >
                            Delete group
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem disabled>
                          No actions for DMs
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

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
                      const isOwn = msg.sender_id === user?.id;

                      // Determine sender details for the Avatar
                      // If isOwn, use 'user'. If not, try msg.sender (for groups) or fallback to selectedChat.otherUser
                      const senderProfile = (msg.profile || selectedChat.otherUser);

                      const showDate =
                        index === 0 ||
                        new Date(messages[index - 1].created_at).toDateString() !==
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

                          {/* Flex container for Avatar + Bubble */}
                          <div className={`flex w-full gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>

                            {/* AVATAR: RECEIVED MESSAGE (Left Side) */}
                            {!isOwn && (
                              <Avatar
                                className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-neon-cyan transition-all mt-1"
                                onClick={() => router.push(`/profile/${senderProfile?.id}`)}
                              >
                                <AvatarImage src={senderProfile?.profile_picture} />
                                <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xs">
                                  {getUserInitials(senderProfile?.full_name)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            {/* MESSAGE BUBBLE */}
                            <div
                              className={`max-w-[75%] md:max-w-md px-4 py-2 rounded-2xl ${isOwn
                                ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-black rounded-br-sm"
                                : "bg-cyber-card border border-cyber-border text-foreground rounded-bl-sm"
                                }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              <div className="flex items-center gap-1 justify-end mt-1">
                                <span className="text-[10px] opacity-70">
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isOwn && <CheckCheck className="w-3 h-3 opacity-70" />}
                              </div>
                            </div>

                            {/* AVATAR: SENT MESSAGE (Right Side) */}
                            {isOwn && (
                              <Avatar
                                className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-neon-cyan transition-all mt-1"
                                onClick={() => router.push('/profile')}
                              >
                                <AvatarImage src={senderProfile?.profile_picture} />
                                <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xs">
                                  {getUserInitials(senderProfile?.full_name)}
                                </AvatarFallback>
                              </Avatar>
                            )}

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
