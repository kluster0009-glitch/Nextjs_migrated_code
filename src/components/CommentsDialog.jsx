"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Send,
  MoreHorizontal,
  Trash2,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileHoverCard } from "@/components/ProfileHoverCard";

export function CommentsDialog({ open, onOpenChange, post }) {
  const { user } = useAuth();
  const { profile, getAvatarUrl } = useProfile();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const scrollRef = useRef(null);

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

  // Fetch comments
  const fetchComments = async () => {
    if (!post?.id) return;

    try {
      const supabase = createClient();

      const { data: commentsData, error } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map((c) => c.user_id))];

        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture, username")
          .in("id", userIds);

        const commentsWithProfiles = commentsData.map((comment) => ({
          ...comment,
          profile: profilesData?.find((p) => p.id === comment.user_id) || null,
        }));

        setComments(commentsWithProfiles);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (open && post?.id) {
      setLoadingComments(true);
      fetchComments();
    }
  }, [open, post?.id]);

  // Real-time subscription for comments
  useEffect(() => {
    if (!open || !post?.id) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`comments_${post.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "post_comments",
          filter: `post_id=eq.${post.id}`,
        },
        () => {
          console.log("New comment detected, fetching...");
          fetchComments();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "post_comments",
          filter: `post_id=eq.${post.id}`,
        },
        () => {
          console.log("Comment updated, fetching...");
          fetchComments();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "post_comments",
          filter: `post_id=eq.${post.id}`,
        },
        () => {
          console.log("Comment deleted, fetching...");
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, post?.id, fetchComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("post_comments").insert({
        post_id: post.id,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      toast.success("Comment posted!");

      // Immediately fetch comments to update UI
      await fetchComments();

      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Comment deleted");

      // Immediately fetch comments to update UI
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  if (!post) return null;

  const hasImage = post?.image_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-screen-2xl w-screen h-screen max-h-screen p-0 gap-0 bg-white border-0 overflow-hidden rounded-none"
      >
        <DialogTitle className="sr-only">
          Comments on {post?.title || "post"}
        </DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_500px] h-full w-full">
          {/* Left side - Post Media */}
          <div className="hidden md:flex bg-black items-center justify-center overflow-hidden relative">
            {post.media && post.media.length > 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                {post.media[0].type === "image" ? (
                  <img
                    src={post.media[0].url}
                    alt={post.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                ) : (
                  <video
                    src={post.media[0].url}
                    controls
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                )}
              </div>
            ) : post.image_url ? (
              <img
                src={post.image_url}
                alt={post.title}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                <MessageCircle className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Right side - Comments Section */}
          <div className="flex flex-col h-full bg-white">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ProfileHoverCard userId={post.user_id} currentUserId={user?.id}>
                  <Avatar
                    className="cursor-pointer w-10 h-10 ring-2 ring-white hover:ring-gray-200 transition-all"
                    onClick={() => {
                      if (post.user_id !== user?.id) {
                        window.location.href = `/profile/${post.user_id}`;
                      } else {
                        window.location.href = "/profile";
                      }
                    }}
                  >
                    <AvatarImage src={post.profiles?.profile_picture} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-sm font-semibold">
                      {getUserInitials(post.profiles?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </ProfileHoverCard>
                <div className="flex-1">
                  <ProfileHoverCard userId={post.user_id} currentUserId={user?.id}>
                    <p
                      className="font-semibold text-sm text-gray-900 cursor-pointer hover:text-gray-600 transition-colors"
                      onClick={() => {
                        if (post.user_id !== user?.id) {
                          window.location.href = `/profile/${post.user_id}`;
                        } else {
                          window.location.href = "/profile";
                        }
                      }}
                    >
                      {post.profiles?.full_name || "Anonymous"}
                    </p>
                  </ProfileHoverCard>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Caption */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-3">
                <ProfileHoverCard userId={post.user_id} currentUserId={user?.id}>
                  <Avatar
                    className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all"
                    onClick={() => {
                      if (post.user_id !== user?.id) {
                        window.location.href = `/profile/${post.user_id}`;
                      } else {
                        window.location.href = "/profile";
                      }
                    }}
                  >
                    <AvatarImage src={post.profiles?.profile_picture} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xs">
                      {getUserInitials(post.profiles?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </ProfileHoverCard>
                <div className="flex-1">
                  <p className="text-sm">
                    <ProfileHoverCard userId={post.user_id} currentUserId={user?.id}>
                      <span
                        className="font-semibold mr-2 cursor-pointer hover:text-gray-600 transition-colors text-gray-900"
                        onClick={() => {
                          if (post.user_id !== user?.id) {
                            window.location.href = `/profile/${post.user_id}`;
                          } else {
                            window.location.href = "/profile";
                          }
                        }}
                      >
                        {post.profiles?.full_name || "Anonymous"}
                      </span>
                    </ProfileHoverCard>
                    <span className="text-gray-900">
                      {post.content}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-pink-500"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 opacity-50 mb-3" />
                  <p className="text-gray-500">No comments yet</p>
                  <p className="text-sm text-gray-400">
                    Be the first to comment!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <ProfileHoverCard userId={comment.user_id} currentUserId={user?.id}>
                        <Avatar
                          className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all"
                          onClick={() => {
                            if (comment.user_id !== user?.id) {
                              window.location.href = `/profile/${comment.user_id}`;
                            } else {
                              window.location.href = "/profile";
                            }
                          }}
                        >
                          <AvatarImage src={comment.profile?.profile_picture} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white text-xs">
                            {getUserInitials(comment.profile?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                      </ProfileHoverCard>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm">
                              <ProfileHoverCard userId={comment.user_id} currentUserId={user?.id}>
                                <span
                                  className="font-semibold mr-2 cursor-pointer hover:text-gray-600 transition-colors text-gray-900"
                                  onClick={() => {
                                    if (comment.user_id !== user?.id) {
                                      window.location.href = `/profile/${comment.user_id}`;
                                    } else {
                                      window.location.href = "/profile";
                                    }
                                  }}
                                >
                                  {comment.profile?.full_name || "Anonymous"}
                                </span>
                              </ProfileHoverCard>
                              <span className="text-gray-900">
                                {comment.content}
                              </span>
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-gray-500">
                                {formatTimeAgo(comment.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Delete option for own comments */}
                          {comment.user_id === user?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white border-gray-200"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Comment Input */}
            <div className="border-t border-gray-200 bg-white">
              <form onSubmit={handleSubmitComment} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={getAvatarUrl()} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xs">
                      {getUserInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-400"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-transparent hover:bg-transparent text-blue-500 hover:text-blue-700 font-semibold disabled:opacity-50 flex-shrink-0 p-0 h-auto"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-blue-500" />
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
