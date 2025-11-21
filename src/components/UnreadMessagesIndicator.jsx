"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

/**
 * Global unread message counter that can be used anywhere in the app
 * Shows a badge with the total count of unread messages
 * Updates in real-time via Supabase subscriptions
 *
 * Usage:
 * <UnreadMessagesIndicator />
 */
export default function UnreadMessagesIndicator() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch initial unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) return;
    try {
      // Get all conversations user is part of
      const { data: participations, error: partError } = await supabase
        .from("conversation_participants")
        .select("conversation_id, last_read_at")
        .eq("user_id", user.id);

      if (partError) {
        console.error("Error fetching participations:", partError);
        setIsLoading(false);
        return;
      }

      if (!participations || participations.length === 0) {
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      // For each conversation, count messages after last_read_at from other users
      let totalUnread = 0;

      for (const participation of participations) {
        const { data: messages, error: msgError } = await supabase
          .from("dm_messages")
          .select("id")
          .eq("conversation_id", participation.conversation_id)
          .neq("sender_id", user.id)
          .gt("created_at", participation.last_read_at || "1970-01-01");

        if (!msgError && messages) {
          totalUnread += messages.length;
        }
      }

      setUnreadCount(totalUnread);
      setIsLoading(false);
    } catch (error) {
      console.error("Error calculating unread:", error);
      setIsLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    if (!user?.id) return;

    fetchUnreadCount();

    // Listen for conversation updates from chat page
    const handleConversationsUpdated = () => {
      console.log(
        "Conversations updated event received, refreshing unread count"
      );
      fetchUnreadCount();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "conversationsUpdated",
        handleConversationsUpdated
      );
    }

    // Subscribe to new messages for real-time updates
    const channel = supabase
      .channel(`unread_messages_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `sender_id=neq.${user.id}`,
        },
        async (payload) => {
          // Check if this message is for a conversation the user is in
          const { data: participation } = await supabase
            .from("conversation_participants")
            .select("last_read_at")
            .eq("conversation_id", payload.new.conversation_id)
            .eq("user_id", user.id)
            .single();

          if (participation) {
            // Message is after last_read_at, so it's unread
            if (
              new Date(payload.new.created_at) >
              new Date(participation.last_read_at || "1970-01-01")
            ) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversation_participants",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // When user reads messages (last_read_at updated), recalculate
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "conversationsUpdated",
          handleConversationsUpdated
        );
      }
    };
  }, [user?.id, fetchUnreadCount]);

  // Don't show anything if loading or no unread messages
  if (isLoading || unreadCount === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="ml-auto bg-neon-cyan text-black font-semibold px-2 py-0.5 text-xs"
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}
