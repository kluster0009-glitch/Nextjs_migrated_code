"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  Heart,
  MessageCircle,
  ArrowLeft,
  UserPlus,
  UserMinus,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function PublicProfilePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // User's posts and stats
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    postsCount: 0,
    likesReceived: 0,
    followersCount: 0,
    followingCount: 0,
  });

  useEffect(() => {
    if (userId) {
      // Check if user is viewing their own profile
      if (userId === user?.id) {
        router.push("/profile");
        return;
      }
      fetchPublicProfile();
      checkFollowStatus();
    }
  }, [userId, user]);

  const fetchPublicProfile = async () => {
    try {
      const supabase = createClient();

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user's posts
      const { data: posts } = await supabase
        .from("posts")
        .select("*, profiles(full_name, profile_picture)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setUserPosts(posts || []);

      // Calculate stats
      const { data: allUserPosts } = await supabase
        .from("posts")
        .select("likes_count")
        .eq("user_id", userId);

      const totalLikesReceived =
        allUserPosts?.reduce((sum, post) => sum + (post.likes_count || 0), 0) ||
        0;

      // Fetch followers and following counts
      let followersCount = 0;
      let followingCount = 0;

      try {
        const { count: followersC } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId);

        const { count: followingC } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId);

        followersCount = followersC || 0;
        followingCount = followingC || 0;
      } catch (error) {
        console.log("Followers table not found, using defaults");
      }

      setStats({
        postsCount: posts?.length || 0,
        likesReceived: totalLikesReceived,
        followersCount,
        followingCount,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !userId) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", userId)
        .single();

      if (!error && data) {
        setIsFollowing(true);
      }
    } catch (error) {
      // Table might not exist or no relationship found
      console.log("Follow status check:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error("Please login to follow users");
      return;
    }

    setFollowLoading(true);
    try {
      const supabase = createClient();

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("followers")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", userId);

        if (error) throw error;

        setIsFollowing(false);
        setStats((prev) => ({
          ...prev,
          followersCount: Math.max(0, prev.followersCount - 1),
        }));
        toast.success("Unfollowed successfully");
      } else {
        // Follow
        const { error } = await supabase
          .from("followers")
          .insert({ follower_id: user.id, following_id: userId });

        if (error) throw error;

        setIsFollowing(true);
        setStats((prev) => ({
          ...prev,
          followersCount: prev.followersCount + 1,
        }));
        toast.success("Following successfully");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    // Navigate to chat with this user
    router.push(`/chat?user=${userId}`);
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

  const PostCard = ({ post }) => (
    <Link href="/cluster">
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl hover:bg-cyber-card/70 transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.profiles?.profile_picture} />
              <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xs">
                {getUserInitials(post.profiles?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                {post.profiles?.full_name || "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(post.created_at)}
              </p>
            </div>
            <Badge variant="secondary" className="bg-cyber-darker/50 text-xs">
              {post.category}
            </Badge>
          </div>
          <h4 className="font-semibold mb-2 line-clamp-2">{post.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {post.content}
          </p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt=""
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.comments_count || 0}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-cyber-darker">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-cyber-darker">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Profile not found</h3>
          <p className="text-muted-foreground mb-4">
            This user profile doesn't exist
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Posts",
      value: stats.postsCount,
      icon: MessageSquare,
      color: "text-neon-cyan",
    },
    {
      label: "Followers",
      value: stats.followersCount,
      icon: User,
      color: "text-neon-purple",
    },
    {
      label: "Following",
      value: stats.followingCount,
      icon: User,
      color: "text-neon-pink",
    },
    {
      label: "Likes Received",
      value: stats.likesReceived,
      icon: Heart,
      color: "text-neon-pink",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header Card with Cover & Avatar */}
        <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl mb-6">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink relative overflow-hidden">
              {profile?.banner_image && (
                <img
                  src={profile.banner_image}
                  alt="Profile Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Avatar & Basic Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  {/* Avatar */}
                  <Avatar className="w-32 h-32 border-4 border-cyber-darker -mt-16 :md:-mt-2">
                    <AvatarImage src={profile?.profile_picture} />
                    <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-3xl">
                      {getUserInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Info */}
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile?.full_name || "User"}
                    </h1>
                    {profile?.college_name && (
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        {profile.college_name}
                      </p>
                    )}
                    {profile?.department && (
                      <p className="text-muted-foreground text-sm mt-1">
                        {profile.department}
                      </p>
                    )}
                    {/* Follow Stats */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-sm">
                        <span className="font-bold text-foreground">
                          {stats.postsCount}
                        </span>{" "}
                        <span className="text-muted-foreground">Posts</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-foreground">
                          {stats.followersCount}
                        </span>{" "}
                        <span className="text-muted-foreground">Followers</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-foreground">
                          {stats.followingCount}
                        </span>{" "}
                        <span className="text-muted-foreground">Following</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 md:mt-0 mb-4 flex gap-2">
                  <Button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={
                      isFollowing
                        ? "bg-cyber-darker border border-cyber-border"
                        : "bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
                    }
                  >
                    {followLoading ? (
                      <>Loading...</>
                    ) : isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMessage}
                    className="border-cyber-border"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Bio */}
            {profile?.bio && (
              <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statCards.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-cyber-darker/50"
                    >
                      <div className="flex items-center gap-3">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="text-xl font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Academic Info */}
            {(profile?.college_name ||
              profile?.department ||
              profile?.roll_number) && (
              <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Academic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile?.college_name && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        College
                      </p>
                      <p className="text-sm text-foreground">
                        {profile.college_name}
                      </p>
                    </div>
                  )}
                  {profile?.department && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Department
                      </p>
                      <p className="text-sm text-foreground">
                        {profile.department}
                      </p>
                    </div>
                  )}
                  {profile?.roll_number && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Roll Number
                      </p>
                      <p className="text-sm text-foreground">
                        {profile.roll_number}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Posts */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList className="bg-cyber-card/50 border border-cyber-border">
                <TabsTrigger value="posts">
                  Posts ({stats.postsCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                {userPosts.length === 0 ? (
                  <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">
                        No posts yet
                      </h3>
                      <p className="text-muted-foreground">
                        This user hasn't shared anything yet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {userPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
