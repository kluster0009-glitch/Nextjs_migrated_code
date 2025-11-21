"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  User,
  BookOpen,
  Award,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2,
  MessageCircle,
  Sparkles,
  Trophy,
  Bookmark,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MediaCarousel } from "@/components/MediaCarousel";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, updateProfile, refreshProfile, getAvatarUrl } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Real data from database
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [stats, setStats] = useState({
    postsCount: 0,
    likesReceived: 0,
    commentsCount: 0,
    likesGiven: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    college_name: "",
    department: "",
    roll_number: "",
    banner_image: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        college_name: profile.college_name || "",
        department: profile.department || "",
        roll_number: profile.roll_number || "",
        banner_image: profile.banner_image || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const supabase = createClient();

      // Fetch user's posts
      const { data: posts } = await supabase
        .from("posts")
        .select("*, profiles(full_name, profile_picture)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setUserPosts(posts || []);

      // Fetch posts user liked
      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id, posts(*, profiles(full_name, profile_picture))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setLikedPosts(likes?.map((l) => l.posts) || []);

      // Fetch posts user saved
      const { data: saves } = await supabase
        .from("saved_posts")
        .select("post_id, posts(*, profiles(full_name, profile_picture))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setSavedPosts(saves?.map((s) => s.posts) || []);

      // Fetch posts user commented on
      const { data: comments } = await supabase
        .from("post_comments")
        .select(
          "post_id, content, created_at, posts(*, profiles(full_name, profile_picture))"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Get unique posts user commented on
      const uniqueCommentedPosts = [];
      const seenPostIds = new Set();
      comments?.forEach((comment) => {
        if (!seenPostIds.has(comment.post_id)) {
          seenPostIds.add(comment.post_id);
          uniqueCommentedPosts.push(comment.posts);
        }
      });
      setCommentedPosts(uniqueCommentedPosts);

      // Calculate stats
      const { data: allUserPosts } = await supabase
        .from("posts")
        .select("likes_count")
        .eq("user_id", user.id);

      const totalLikesReceived =
        allUserPosts?.reduce((sum, post) => sum + (post.likes_count || 0), 0) ||
        0;

      const { count: commentsCount } = await supabase
        .from("post_comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: likesGiven } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch followers and following (check if table exists, if not use mock data)
      let followersCount = 0;
      let followingCount = 0;
      let followersList = [];
      let followingList = [];

      try {
        const { data: followersData, error: followersError } = await supabase
          .from("followers")
          .select(
            "follower_id, profiles!followers_follower_id_fkey(id, full_name, profile_picture)"
          )
          .eq("following_id", user.id);

        const { data: followingData, error: followingError } = await supabase
          .from("followers")
          .select(
            "following_id, profiles!followers_following_id_fkey(id, full_name, profile_picture)"
          )
          .eq("follower_id", user.id);

        if (!followersError) {
          followersCount = followersData?.length || 0;
          followersList = followersData || [];
        }

        if (!followingError) {
          followingCount = followingData?.length || 0;
          followingList = followingData || [];
        }
      } catch (error) {
        // Table might not exist, use defaults
        console.log("Followers table not found, using defaults");
      }

      setFollowers(followersList);
      setFollowing(followingList);

      setStats({
        postsCount: posts?.length || 0,
        likesReceived: totalLikesReceived,
        commentsCount: commentsCount || 0,
        likesGiven: likesGiven || 0,
        followersCount,
        followingCount,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    const name = profile?.full_name || user?.email || "";
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      // Update profile with image URL
      const { error } = await updateProfile({
        profile_picture: publicUrl,
      });

      if (error) throw error;

      toast.success("Profile picture updated successfully!");
      refreshProfile();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB for banner)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingBanner(true);
    try {
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      // Update profile with banner URL
      const { error } = await updateProfile({
        banner_image: publicUrl,
      });

      if (error) throw error;

      toast.success("Banner updated successfully!");
      refreshProfile();
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Failed to upload banner. Please try again.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        college_name: formData.college_name,
        department: formData.department,
        roll_number: formData.roll_number,
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      refreshProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
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
                {post.profiles?.full_name?.[0] || "U"}
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
          
          {/* Media Display - Support both new media array and legacy image_url */}
          {post.media && post.media.length > 0 ? (
            <div className="mb-3">
              <MediaCarousel media={post.media} />
            </div>
          ) : post.image_url ? (
            <img
              src={post.image_url}
              alt=""
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          ) : null}
          
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
    {
      label: "Comments",
      value: stats.commentsCount,
      icon: MessageCircle,
      color: "text-neon-purple",
    },
    {
      label: "Likes Given",
      value: stats.likesGiven,
      icon: Sparkles,
      color: "text-neon-cyan",
    },
  ];

  const achievements = [];
  if (stats.postsCount > 0)
    achievements.push({
      name: "First Post",
      icon: MessageSquare,
      color: "text-neon-purple",
    });
  if (stats.likesReceived >= 10)
    achievements.push({
      name: "10 Likes",
      icon: Trophy,
      color: "text-neon-cyan",
    });
  if (stats.commentsCount >= 5)
    achievements.push({
      name: "Active Commenter",
      icon: MessageCircle,
      color: "text-green-500",
    });
  achievements.push({
    name: "Verified Email",
    icon: Mail,
    color: "text-green-500",
  });

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Card with Cover & Avatar */}
        <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl mb-6 overflow-visible">
          {/* Cover Image */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink relative overflow-hidden group">
            {profile?.banner_image && (
              <img
                src={profile.banner_image}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            )}
            {/* Banner Upload Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 rounded-full bg-cyber-card/80 border-cyber-border backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploadingBanner}
            >
              <Camera className="w-4 h-4 text-cyber-darker" />
            </Button>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />
          </div>

          {/* Avatar & Basic Info */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pt-4">
              <div className="flex flex-col md:flex-row items-start gap-4">
                {/* Avatar with Upload */}
                <div className="relative flex-shrink-0 -mt-20">
                  <Avatar className="w-32 h-32 border-4 border-cyber-card ring-4 ring-neon-cyan/30 bg-cyber-darker">
                    <AvatarImage src={getAvatarUrl()} />
                    <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-3xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full bg-cyber-card border-cyber-border"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Camera className="w-4 h-4 text-neon-cyan" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                {/* Name & Email */}
                <div className="flex-1 min-w-0 pt-0 md:pt-16">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {profile?.full_name || "User"}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    @{profile?.username || "username"}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                  {profile?.college_name && (
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{profile.college_name}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="pt-0 md:pt-16">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-cyber-border"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Achievements */}
          <div className="space-y-6">
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

            {/* Achievements */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Your milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-cyber-darker/50"
                    >
                      <achievement.icon
                        className={`w-5 h-5 ${achievement.color}`}
                      />
                      <span className="text-sm text-foreground">
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="bg-cyber-card/50 border border-cyber-border">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="posts">
                  Posts ({stats.postsCount})
                </TabsTrigger>
                <TabsTrigger value="liked">
                  Liked ({likedPosts.length})
                </TabsTrigger>
                <TabsTrigger value="saved">
                  Saved ({savedPosts.length})
                </TabsTrigger>
                <TabsTrigger value="comments">
                  Commented ({commentedPosts.length})
                </TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* Bio Section */}
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px] bg-cyber-darker border-cyber-border"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {profile?.bio ||
                          "No bio added yet. Click Edit Profile to add one."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                full_name: e.target.value,
                              })
                            }
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {profile?.full_name || "Not set"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Account Created</Label>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatTimeAgo(user?.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="college_name">College</Label>
                        {isEditing ? (
                          <Input
                            id="college_name"
                            value={formData.college_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                college_name: e.target.value,
                              })
                            }
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {profile?.college_name || "Not set"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        {isEditing ? (
                          <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                department: e.target.value,
                              })
                            }
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {profile?.department || "Not set"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roll_number">Roll Number</Label>
                        {isEditing ? (
                          <Input
                            id="roll_number"
                            value={formData.roll_number}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                roll_number: e.target.value,
                              })
                            }
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {profile?.roll_number || "Not set"}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts">
                {userPosts.length === 0 ? (
                  <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                    <CardContent className="py-12 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">
                        No posts yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Share your thoughts with the community!
                      </p>
                      <Link href="/cluster">
                        <Button className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold">
                          Create Your First Post
                        </Button>
                      </Link>
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

              <TabsContent value="liked">
                {likedPosts.length === 0 ? (
                  <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                    <CardContent className="py-12 text-center">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">
                        No liked posts yet
                      </h3>
                      <p className="text-muted-foreground">
                        Posts you like will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {likedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="saved">
                {savedPosts.length === 0 ? (
                  <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                    <CardContent className="py-12 text-center">
                      <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">
                        No saved posts yet
                      </h3>
                      <p className="text-muted-foreground">
                        Posts you bookmark will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {savedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="comments">
                {commentedPosts.length === 0 ? (
                  <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                    <CardContent className="py-12 text-center">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">
                        No comments yet
                      </h3>
                      <p className="text-muted-foreground">
                        Posts you've commented on will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {commentedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <ActivityFeed
                  userPosts={userPosts}
                  likedPosts={likedPosts}
                  commentedPosts={commentedPosts}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <SettingsSection user={user} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed({ userPosts, likedPosts, commentedPosts }) {
  // Combine all activities
  const activities = [
    ...userPosts.map((post) => ({
      type: "post",
      timestamp: post.created_at,
      data: post,
    })),
    ...likedPosts.map((post) => ({
      type: "liked",
      timestamp: post.created_at, // This should ideally be the like timestamp
      data: post,
    })),
    ...commentedPosts.map((post) => ({
      type: "commented",
      timestamp: post.created_at, // This should ideally be the comment timestamp
      data: post,
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getActivityIcon = (type) => {
    switch (type) {
      case "post":
        return <MessageSquare className="w-5 h-5 text-neon-cyan" />;
      case "liked":
        return <Heart className="w-5 h-5 text-neon-pink" />;
      case "commented":
        return <MessageCircle className="w-5 h-5 text-neon-purple" />;
      default:
        return null;
    }
  };

  const getActivityText = (type) => {
    switch (type) {
      case "post":
        return "Created a post";
      case "liked":
        return "Liked a post";
      case "commented":
        return "Commented on a post";
      default:
        return "";
    }
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardContent className="py-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
          <p className="text-muted-foreground">
            Your activity timeline will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <Card
            key={index}
            className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                      {getActivityText(activity.type)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <Link href="/cluster">
                    <div className="bg-cyber-darker/50 p-3 rounded-lg hover:bg-cyber-darker/70 transition-colors cursor-pointer">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                        {activity.data.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {activity.data.content}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {activity.data.likes_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {activity.data.comments_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function SettingsSection({ user }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const supabase = createClient();

      // Delete user's data
      await supabase.from("profiles").delete().eq("id", user.id);

      toast.success("Account deletion initiated. You will be logged out.");

      // Sign out
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please contact support.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              placeholder="Enter new password"
              className="bg-cyber-darker border-cyber-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm new password"
              className="bg-cyber-darker border-cyber-border"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={
              changingPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
            className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-darker/50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-neon-cyan" />
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
            </div>
            <Button
              variant={emailNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setEmailNotifications(!emailNotifications);
                toast.success(
                  emailNotifications
                    ? "Email notifications disabled"
                    : "Email notifications enabled"
                );
              }}
              className={
                emailNotifications
                  ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-black"
                  : ""
              }
            >
              {emailNotifications ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-darker/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-neon-pink" />
              <div>
                <p className="font-medium text-sm">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive push notifications
                </p>
              </div>
            </div>
            <Button
              variant={pushNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setPushNotifications(!pushNotifications);
                toast.success(
                  pushNotifications
                    ? "Push notifications disabled"
                    : "Push notifications enabled"
                );
              }}
              className={
                pushNotifications
                  ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-black"
                  : ""
              }
            >
              {pushNotifications ? "On" : "Off"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your privacy and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/privacy">
            <Button
              variant="outline"
              className="w-full justify-start border-cyber-border"
            >
              Privacy Policy
            </Button>
          </Link>
          <Link href="/terms">
            <Button
              variant="outline"
              className="w-full justify-start border-cyber-border"
            >
              Terms of Service
            </Button>
          </Link>
          <Link href="/cookies">
            <Button
              variant="outline"
              className="w-full justify-start border-cyber-border"
            >
              Cookie Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/50 bg-red-950/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This action cannot be undone. All your data will be permanently
            deleted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
