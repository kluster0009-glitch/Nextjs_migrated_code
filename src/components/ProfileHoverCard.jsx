"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link2 } from "lucide-react";

export function ProfileHoverCard({ userId, children, currentUserId }) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      const supabase = createClient();

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Fetch follower/following counts
        const { count: followersCount } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId);

        const { count: followingCount } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId);

        setStats({
          followers: followersCount || 0,
          following: followingCount || 0,
        });

        // Check if current user is following
        if (currentUserId && currentUserId !== userId) {
          const { data: followData } = await supabase
            .from("followers")
            .select("id")
            .eq("follower_id", currentUserId)
            .eq("following_id", userId)
            .single();

          setIsFollowing(!!followData);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId || currentUserId === userId) return;

    setLoading(true);
    try {
      const supabase = createClient();

      if (isFollowing) {
        // Unfollow
        await supabase
          .from("followers")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", userId);

        setIsFollowing(false);
        setStats((prev) => ({ ...prev, followers: Math.max(0, prev.followers - 1) }));
      } else {
        // Follow
        await supabase
          .from("followers")
          .insert({
            follower_id: currentUserId,
            following_id: userId,
          });

        setIsFollowing(true);
        setStats((prev) => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild onMouseEnter={fetchProfile}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
        align="start"
        side="bottom"
      >
        {profile ? (
          <div className="flex flex-col">
            {/* Banner */}
            {profile.banner_image ? (
              <div className="h-24 w-full bg-gradient-to-r from-blue-400 to-purple-500">
                <img
                  src={profile.banner_image}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-24 w-full bg-gradient-to-r from-blue-400 to-purple-500" />
            )}

            {/* Profile Info */}
            <div className="px-4 pb-4">
              <div className="flex items-start justify-between -mt-8 mb-3">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.profile_picture} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-semibold">
                    {getUserInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>

                {currentUserId && currentUserId !== userId && (
                  <Button
                    onClick={handleFollow}
                    disabled={loading}
                    size="sm"
                    className={`mt-2 rounded-full px-4 font-semibold ${
                      isFollowing
                        ? "bg-gray-900 hover:bg-red-600 text-white hover:text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : isFollowing ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
              </div>

              {/* Name and Username */}
              <div className="mb-2">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-gray-900 text-base">
                    {profile.full_name}
                  </h3>
                  {profile.role === "professor" && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white text-xs px-1.5 py-0"
                    >
                      ✓
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 text-sm">@{profile.username}</p>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-900 text-sm mb-3 line-clamp-2">
                  {profile.bio}
                </p>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                {profile.college_name && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{profile.college_name}</span>
                  </div>
                )}
                {profile.department && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{profile.department}</span>
                  </div>
                )}
              </div>

              {/* Follower Stats */}
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">
                    {stats.following}
                  </span>{" "}
                  <span className="text-gray-500">Following</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {stats.followers}
                  </span>{" "}
                  <span className="text-gray-500">Followers</span>
                </div>
              </div>

              {/* Followed by */}
              {profile.role === "professor" && (
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-gray-700">Professor</span> · Verified Educator
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-500" />
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
