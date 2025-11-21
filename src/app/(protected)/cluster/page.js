"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowUp,
  Users,
} from "lucide-react";
import NoticeCarousel from "@/components/NoticeCarousel";
import { CommentsDialog } from "@/components/CommentsDialog";
import { MediaCarousel } from "@/components/MediaCarousel";
import { formatDistanceToNow } from "date-fns";

export default function ClusterPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showNewPostNotification, setShowNewPostNotification] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [newPostAuthors, setNewPostAuthors] = useState([]);
  const [userLikes, setUserLikes] = useState(new Set());
  const [userSaves, setUserSaves] = useState(new Set());
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Fetch posts from database
  const fetchPosts = useCallback(async () => {
    try {
      const supabase = createClient();

      // Get posts with limit for better performance
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      if (postsData && postsData.length > 0) {
        const userIds = [...new Set(postsData.map((post) => post.user_id))];

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select(
            "id, full_name, profile_picture, username, college_name, department"
          )
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }

        const postsWithProfiles = postsData.map((post) => ({
          ...post,
          profiles:
            profilesData?.find((profile) => profile.id === post.user_id) ||
            null,
        }));

        console.log("📊 Fetched posts with media:", postsWithProfiles.map(p => ({ 
          id: p.id, 
          media: p.media, 
          image_url: p.image_url 
        })));

        setPosts(postsWithProfiles);

        // Fetch user's likes and saves
        if (user) {
          const { data: likesData } = await supabase
            .from("post_likes")
            .select("post_id")
            .eq("user_id", user.id);

          if (likesData) {
            setUserLikes(new Set(likesData.map((like) => like.post_id)));
          }

          const { data: savesData } = await supabase
            .from("saved_posts")
            .select("post_id")
            .eq("user_id", user.id);

          if (savesData) {
            setUserSaves(new Set(savesData.map((save) => save.post_id)));
          }
        }
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Listen for posts created from sidebar
  useEffect(() => {
    const handleNewPost = () => {
      console.log("📬 Your post created - showing notification");

      // Show notification immediately for user's own post
      setShowNewPostNotification(true);
      setNewPostsCount((prev) => prev + 1);

      // Small delay to ensure the post is in the database, then fetch
      setTimeout(() => {
        fetchPosts();
      }, 500);
    };

    window.addEventListener("newPostCreated", handleNewPost);
    return () => window.removeEventListener("newPostCreated", handleNewPost);
  }, [fetchPosts]);

  // Real-time subscription for posts, likes, and comments
  useEffect(() => {
    if (!user) return;

    console.log("Setting up real-time subscriptions...");
    const supabase = createClient();

    const channel = supabase
      .channel("posts_changes")
      // Listen for new posts
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          console.log("🔥 New post detected:", payload.new.title);

          // Fetch author profile for notification
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, profile_picture")
            .eq("id", payload.new.user_id)
            .single();

          setNewPostAuthors((prev) => {
            const newAuthors = [...prev, profile];
            return newAuthors.slice(-3); // Keep only last 3
          });

          setNewPostsCount((prev) => prev + 1);
          setShowNewPostNotification(true);

          console.log("🔔 Notification shown - New posts:", newPostsCount + 1);
        }
      )
      // Listen for likes changes (INSERT and DELETE)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_likes",
        },
        (payload) => {
          console.log("❤️ Like event:", payload.eventType);
          const postId = payload.new?.post_id || payload.old?.post_id;
          const userId = payload.new?.user_id || payload.old?.user_id;

          // Update user's like state if it's their action
          if (userId === user?.id) {
            if (payload.eventType === "INSERT") {
              setUserLikes((prev) => new Set([...prev, postId]));
            } else if (payload.eventType === "DELETE") {
              setUserLikes((prev) => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
              });
            }
          }
        }
      )
      // Listen for saved posts changes (INSERT and DELETE)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "saved_posts",
        },
        (payload) => {
          console.log("🔖 Save event:", payload.eventType);
          const postId = payload.new?.post_id || payload.old?.post_id;
          const userId = payload.new?.user_id || payload.old?.user_id;

          // Update user's save state if it's their action
          if (userId === user?.id) {
            if (payload.eventType === "INSERT") {
              setUserSaves((prev) => new Set([...prev, postId]));
            } else if (payload.eventType === "DELETE") {
              setUserSaves((prev) => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
              });
            }
          }
        }
      )
      // Listen for posts table updates (like count changes)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          console.log("📝 Post updated:", payload.new);

          // Update the specific post with new data
          setPosts((currentPosts) =>
            currentPosts.map((post) => {
              if (post.id === payload.new.id) {
                return {
                  ...post,
                  likes_count: payload.new.likes_count,
                  comments_count: payload.new.comments_count,
                };
              }
              return post;
            })
          );
        }
      )
      // Listen for comments changes (INSERT and DELETE)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_comments",
        },
        (payload) => {
          console.log("💬 Comment event:", payload.eventType);
          const postId = payload.new?.post_id || payload.old?.post_id;

          // Update the specific post's comment count
          setPosts((currentPosts) =>
            currentPosts.map((post) => {
              if (post.id === postId) {
                const increment =
                  payload.eventType === "INSERT"
                    ? 1
                    : payload.eventType === "DELETE"
                    ? -1
                    : 0;
                return {
                  ...post,
                  comments_count: Math.max(
                    0,
                    (post.comments_count || 0) + increment
                  ),
                };
              }
              return post;
            })
          );
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up real-time subscriptions");
      supabase.removeChannel(channel);
    };
  }, [user, newPostsCount]);

  const handleRefreshPosts = async () => {
    console.log("Refreshing posts...");
    setShowNewPostNotification(false);
    setNewPostsCount(0);
    setNewPostAuthors([]);

    window.scrollTo({ top: 0, behavior: "smooth" });
    await fetchPosts();
    console.log("Posts refreshed successfully");
  };

  const handleLike = async (postId) => {
    if (!user) return;

    const supabase = createClient();
    const isLiked = userLikes.has(postId);

    try {
      if (isLiked) {
        // Unlike - remove from post_likes
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        // Decrement likes_count in posts table
        const currentPost = posts.find((p) => p.id === postId);
        if (currentPost) {
          await supabase
            .from("posts")
            .update({
              likes_count: Math.max(0, (currentPost.likes_count || 1) - 1),
            })
            .eq("id", postId);
        }

        setUserLikes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        // Like - add to post_likes
        await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });

        // Increment likes_count in posts table
        const currentPost = posts.find((p) => p.id === postId);
        if (currentPost) {
          await supabase
            .from("posts")
            .update({ likes_count: (currentPost.likes_count || 0) + 1 })
            .eq("id", postId);
        }

        setUserLikes((prev) => new Set([...prev, postId]));
      }

      // Real-time subscription will update counts automatically
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = async (postId) => {
    if (!user) return;

    const supabase = createClient();
    const isSaved = userSaves.has(postId);

    try {
      if (isSaved) {
        // Unsave - remove from saved_posts
        await supabase
          .from("saved_posts")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        // Decrement saved_count in posts table
        const currentPost = posts.find((p) => p.id === postId);
        if (currentPost) {
          await supabase
            .from("posts")
            .update({
              saved_count: Math.max(0, (currentPost.saved_count || 1) - 1),
            })
            .eq("id", postId);
        }

        setUserSaves((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        // Save - add to saved_posts (trigger will create notification)
        await supabase
          .from("saved_posts")
          .insert({ post_id: postId, user_id: user.id });

        // Increment saved_count in posts table
        const currentPost = posts.find((p) => p.id === postId);
        if (currentPost) {
          await supabase
            .from("posts")
            .update({ saved_count: (currentPost.saved_count || 0) + 1 })
            .eq("id", postId);
        }

        setUserSaves((prev) => new Set([...prev, postId]));
      }

      // Real-time subscription will update counts automatically
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  // Real-time subscription handles comment count updates automatically
  // No need to manually refresh when dialog closes

  const handlePostCreated = async (newPost) => {
    console.log("New post created by user:", newPost);

    // Fetch the complete post with profile data
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, profile_picture")
      .eq("id", user.id)
      .single();

    // Add to notification system
    setNewPostAuthors((prev) => {
      const newAuthors = [...prev, profile];
      return newAuthors.slice(-3);
    });
    setNewPostsCount((prev) => prev + 1);
    setShowNewPostNotification(true);

    // Don't optimistically add - let the notification handle the refresh
    // This ensures consistent behavior for all posts
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const trendingTopics = [
    { name: "Computer Science", count: 50 },
    { name: "Mathematics", count: 53 },
    { name: "Physics", count: 47 },
    { name: "Chemistry", count: 54 },
    { name: "Biology", count: 57 },
  ];

  const stats = {
    totalPosts: posts.length,
    todayPosts: posts.filter((p) => {
      const postDate = new Date(p.created_at);
      const today = new Date();
      return (
        postDate.getDate() === today.getDate() &&
        postDate.getMonth() === today.getMonth() &&
        postDate.getFullYear() === today.getFullYear()
      );
    }).length,
  };

  return (
    <div className="min-h-screen bg-cyber-darker">
      {/* Main Content */}
      <div className="w-full py-6 px-6">
        {/* Carousel Banner - Full Width */}
        <div>
          <NoticeCarousel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-9">

            {/* New Post Notification - X-style */}
            {showNewPostNotification && (
              <div className="mb-4 flex justify-center sticky top-4 z-10">
                <Button
                  onClick={handleRefreshPosts}
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-3 flex items-center gap-3 animate-in slide-in-from-top"
                >
                  {/* Author avatars */}
                  <div className="flex -space-x-2">
                    {newPostAuthors.slice(0, 2).map((author, idx) => (
                      <Avatar
                        key={idx}
                        className="w-8 h-8 border-2 border-black"
                      >
                        <AvatarImage src={author?.profile_picture} />
                        <AvatarFallback className="bg-neon-purple/30 text-xs">
                          {getUserInitials(author?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {newPostAuthors.length > 2 && (
                      <div className="w-8 h-8 rounded-full bg-neon-purple/30 border-2 border-black flex items-center justify-center">
                        <span className="text-xs font-bold">
                          +{newPostAuthors.length - 2}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">
                    {newPostsCount} new {newPostsCount === 1 ? "post" : "posts"}
                  </span>
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10 bg-cyber-card/50 border-cyber-border focus:border-neon-purple"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeTab === "all" ? "default" : "ghost"}
                onClick={() => setActiveTab("all")}
                className={
                  activeTab === "all"
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                    : ""
                }
              >
                All Posts
              </Button>
              <Button
                variant={activeTab === "college" ? "default" : "ghost"}
                onClick={() => setActiveTab("college")}
                className={
                  activeTab === "college"
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                    : ""
                }
              >
                My College
              </Button>
              <Button
                variant={activeTab === "global" ? "default" : "ghost"}
                onClick={() => setActiveTab("global")}
                className={
                  activeTab === "global"
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                    : ""
                }
              >
                Global
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {loadingPosts ? (
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardContent className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading posts...</p>
                  </CardContent>
                </Card>
              ) : posts.length === 0 ? (
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">
                      Be the first to share something with the community!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => {
                  // Get author info from the joined profiles table
                  const authorName =
                    post.profiles?.username || post.profiles?.full_name || "Anonymous User";
                  const authorAvatar = post.profiles?.profile_picture;
                  const authorUsername = post.profiles?.username;

                  return (
                    <Card
                      key={post.id}
                      className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl"
                    >
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="cursor-pointer hover:ring-2 hover:ring-neon-cyan transition-all"
                              onClick={() => {
                                if (post.user_id !== user?.id) {
                                  window.location.href = `/profile/${post.user_id}`;
                                } else {
                                  window.location.href = "/profile";
                                }
                              }}
                            >
                              <AvatarImage src={authorAvatar} />
                              <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                                {getUserInitials(authorName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3
                                className="font-semibold text-foreground cursor-pointer hover:text-neon-cyan transition-colors"
                                onClick={() => {
                                  if (post.user_id !== user?.id) {
                                    window.location.href = `/profile/${post.user_id}`;
                                  } else {
                                    window.location.href = "/profile";
                                  }
                                }}
                              >
                                {authorName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {formatTimeAgo(post.created_at)}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-cyber-darker/50"
                          >
                            {post.category}
                          </Badge>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <h4 className="text-xl font-semibold mb-2 text-foreground">
                            {post.title}
                          </h4>
                          <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                            {post.content}
                          </p>
                          
                          {/* Media Display - Support both new media array and legacy image_url */}
                          {post.media && post.media.length > 0 ? (
                            <MediaCarousel media={post.media} />
                          ) : post.image_url ? (
                            <div className="rounded-lg overflow-hidden">
                              <img
                                src={post.image_url}
                                alt="Post content"
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          ) : null}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center gap-6 pt-4 border-t border-cyber-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`${
                              userLikes.has(post.id)
                                ? "text-neon-pink"
                                : "text-muted-foreground"
                            } hover:text-neon-pink transition-colors`}
                          >
                            <Heart
                              className={`w-4 h-4 mr-2 ${
                                userLikes.has(post.id) ? "fill-current" : ""
                              }`}
                            />
                            {post.likes_count || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsCommentsOpen(true);
                            }}
                            className="text-muted-foreground hover:text-neon-cyan"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments_count || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-neon-purple"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSave(post.id)}
                            className={`ml-auto ${
                              userSaves.has(post.id)
                                ? "text-neon-cyan"
                                : "text-muted-foreground"
                            } hover:text-neon-cyan transition-colors`}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                userSaves.has(post.id) ? "fill-current" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Trending Topics */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground hover:text-neon-cyan cursor-pointer transition-colors">
                        {topic.name}
                      </span>
                      <Badge variant="secondary" className="bg-cyber-darker/50">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Posts Today</span>
                    <span className="text-neon-cyan font-semibold">
                      {stats.todayPosts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Posts</span>
                    <span className="text-foreground font-semibold">
                      {stats.totalPosts}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <CommentsDialog
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        post={selectedPost}
      />
    </div>
  );
}
