"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, X, UserPlus, UserCheck } from "lucide-react";

export function SearchDialog({ open, onOpenChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState(new Set());
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Load recent searches from localStorage
  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
      loadFollowingStatus();
    }
  }, [open]);

  // Load following status
  const loadFollowingStatus = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", user.id);

    if (data) {
      setFollowingIds(new Set(data.map((f) => f.following_id)));
    }
  };

  // Search profiles
  useEffect(() => {
    const searchProfiles = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username, email, profile_picture, college_name")
        .ilike("username", `%${searchQuery}%`)
        .neq("id", user?.id)
        .limit(10);

      if (data) {
        setSearchResults(data);
      }
      setLoading(false);
    };

    const debounce = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, user]);

  // Handle profile click
  const handleProfileClick = (profile) => {
    // Save to recent searches
    const newRecent = [
      profile,
      ...recentSearches.filter((p) => p.id !== profile.id),
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));

    // Navigate to profile
    router.push(`/profile/${profile.id}`);
    onOpenChange(false);
  };

  // Clear recent search
  const clearRecentSearch = (profileId) => {
    const newRecent = recentSearches.filter((p) => p.id !== profileId);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  // Clear all recent searches
  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Toggle follow
  const toggleFollow = async (profileId, e) => {
    e.stopPropagation();
    if (!user) return;

    const isFollowing = followingIds.has(profileId);

    if (isFollowing) {
      // Unfollow
      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", profileId);
      
      setFollowingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(profileId);
        return newSet;
      });
    } else {
      // Follow
      await supabase.from("followers").insert({
        follower_id: user.id,
        following_id: profileId,
      });
      
      setFollowingIds((prev) => new Set(prev).add(profileId));
    }
  };

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Profile item component
  const ProfileItem = ({ profile, onClear }) => {
    const isFollowing = followingIds.has(profile.id);

    return (
      <div
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
        onClick={() => handleProfileClick(profile)}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={profile.profile_picture} />
          <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
            {getUserInitials(profile.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {profile.full_name || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {profile.username} • {isFollowing ? "Following" : ""}
          </p>
        </div>
        {onClear ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClear(profile.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => toggleFollow(profile.id, e)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isFollowing ? (
              <UserCheck className="w-4 h-4 text-neon-cyan" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-2xl font-bold">Search</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 bg-muted/30"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Results / Recent */}
        <div className="max-h-[400px] overflow-y-auto px-4 pb-4">
          {searchQuery ? (
            // Search Results
            <div className="mt-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">
                  Searching...
                </p>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((profile) => (
                    <ProfileItem key={profile.id} profile={profile} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No users found
                </p>
              )}
            </div>
          ) : (
            // Recent Searches
            recentSearches.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Recent</h3>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearAllRecent}
                    className="text-blue-500 hover:text-blue-600 h-auto p-0"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((profile) => (
                    <ProfileItem
                      key={profile.id}
                      profile={profile}
                      onClear={clearRecentSearch}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
