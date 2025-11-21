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
        className={`${
          hasImage ? "max-w-5xl" : "max-w-2xl"
        } h-[90vh] p-0 gap-0 bg-cyber-card border-cyber-border overflow-hidden`}
      >
        <DialogTitle className="sr-only">
          Comments on {post?.title || "post"}
        </DialogTitle>
        <div
          className={`grid ${
            hasImage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          } h-full max-h-[90vh]`}
        >
          {/* Left side - Post Image */}
          {hasImage && (
            <div className="hidden md:flex bg-cyber-darker items-center justify-center border-r border-cyber-border overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                style={{ minWidth: "300px", minHeight: "300px" }}
              />
            </div>
          )}

          {/* Right side - Comments Section */}
          <div className="flex flex-col h-full">
            {/* Post Header */}
            <div className="p-4 border-b border-cyber-border">
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
                  <AvatarImage src={post.profiles?.profile_picture} />
                  <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                    {getUserInitials(post.profiles?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p
                    className="font-semibold text-foreground cursor-pointer hover:text-neon-cyan transition-colors"
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
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Caption */}
            <div className="p-4 border-b border-cyber-border">
              <div className="flex gap-3">
                <Avatar
                  className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-neon-cyan transition-all"
                  onClick={() => {
                    if (post.user_id !== user?.id) {
                      window.location.href = `/profile/${post.user_id}`;
                    } else {
                      window.location.href = "/profile";
                    }
                  }}
                >
                  <AvatarImage src={post.profiles?.profile_picture} />
                  <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xs">
                    {getUserInitials(post.profiles?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span
                      className="font-semibold mr-2 cursor-pointer hover:text-neon-cyan transition-colors"
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
                    <span className="text-muted-foreground">
                      {post.content}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
                  <p className="text-muted-foreground">No comments yet</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to comment!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <Avatar
                        className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-neon-cyan transition-all"
                        onClick={() => {
                          if (comment.user_id !== user?.id) {
                            window.location.href = `/profile/${comment.user_id}`;
                          } else {
                            window.location.href = "/profile";
                          }
                        }}
                      >
                        <AvatarImage src={comment.profile?.profile_picture} />
                        <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                          {getUserInitials(comment.profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm">
                              <span
                                className="font-semibold mr-2 cursor-pointer hover:text-neon-cyan transition-colors"
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
                              <span className="text-foreground">
                                {comment.content}
                              </span>
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-muted-foreground">
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
                                className="bg-cyber-card border-cyber-border"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  className="text-destructive focus:text-destructive"
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
            <div className="border-t border-cyber-border bg-cyber-card">
              <form onSubmit={handleSubmitComment} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={getAvatarUrl()} />
                    <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xs">
                      {getUserInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold disabled:opacity-50 flex-shrink-0"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                    ) : (
                      <Send className="w-4 h-4" />
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
