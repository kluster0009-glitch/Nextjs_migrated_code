"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function InviteMemberDialog({ open, onOpenChange, conversationId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [invitingId, setInvitingId] = useState(null);

  const supabase = createClient();

  // 🔍 Search-as-you-type: run query whenever `query` changes (with debounce)
  useEffect(() => {
    // Reset when dialog is closed
    if (!open) {
      setQuery("");
      setResults([]);
      setLoadingSearch(false);
      return;
    }

    const trimmed = query.trim();

    // If query is empty or too short, clear results & don't hit Supabase
    if (trimmed.length < 2) {
      setResults([]);
      setLoadingSearch(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setLoadingSearch(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, profile_picture")
          .or(
            `full_name.ilike.%${trimmed}%,email.ilike.%${trimmed}%`
          )
          .limit(20);

        if (error) throw error;
        if (!controller.signal.aborted) {
          setResults(data || []);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error searching users:", err);
          toast.error("Failed to search users");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSearch(false);
        }
      }
    }, 300); // ⏳ debounce 300ms

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, open, supabase]);

  const handleInvite = async (userId) => {
    if (!conversationId) {
      toast.error("No conversation selected");
      return;
    }

    try {
      setInvitingId(userId);
      const { error } = await supabase
        .from("conversation_participants")
        .insert({
          conversation_id: conversationId,
          user_id: userId,
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("User is already a member of this group");
        } else {
          console.error("Error inviting member:", error);
          toast.error("Failed to invite member");
        }
      } else {
        toast.success("Member invited");
      }
    } catch (err) {
      console.error("Error inviting member:", err);
      toast.error("Failed to invite member");
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cyber-card border-cyber-border max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            autoFocus
          />
          {loadingSearch && (
            <p className="text-xs text-muted-foreground">Searching…</p>
          )}
        </div>

        <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
          {!loadingSearch && results.length === 0 && query.trim().length >= 2 && (
            <p className="text-sm text-muted-foreground">
              No users found.
            </p>
          )}

          {!loadingSearch && query.trim().length < 2 && (
            <p className="text-sm text-muted-foreground">
              Type at least 2 characters to search.
            </p>
          )}

          {results.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-cyber-darker/60"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  {profile.profile_picture && (
                    <AvatarImage src={profile.profile_picture} />
                  )}
                  <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                    {(profile.full_name || profile.email || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {profile.full_name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {profile.email}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleInvite(profile.id)}
                disabled={invitingId === profile.id}
              >
                {invitingId === profile.id ? "Inviting..." : "Invite"}
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
