"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, X, Globe, Lock } from "lucide-react";

export function CreatePostModal({
  trigger,
  open,
  onOpenChange,
  onPostCreated,
}) {
  const { user } = useAuth();
  const { profile, getAvatarUrl } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [showImageInput, setShowImageInput] = useState(false);

  const categories = [
    { value: "General", emoji: "💬" },
    { value: "Question", emoji: "❓" },
    { value: "Discussion", emoji: "💡" },
    { value: "Announcement", emoji: "📢" },
    { value: "Event", emoji: "📅" },
    { value: "Study Group", emoji: "📚" },
    { value: "Project", emoji: "🚀" },
    { value: "Other", emoji: "✨" },
  ];

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please write something to post");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Generate a simple title from content (first 50 chars or first line)
      const autoTitle =
        content.split("\n")[0].slice(0, 50) +
        (content.length > 50 ? "..." : "");

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title: autoTitle,
            content: content.trim(),
            category: selectedCategory,
            image_url: imageUrl || null,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Posted successfully!");

      // Reset form
      setContent("");
      setImageUrl("");
      setSelectedCategory("General");
      setShowImageInput(false);

      if (onOpenChange) {
        onOpenChange(false);
      }

      // Notify parent component
      if (onPostCreated && data[0]) {
        onPostCreated(data[0]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-cyber-card border-cyber-border">
        <DialogDescription className="sr-only">
          Create a new post to share with the community
        </DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange && onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">Create Post</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Main Content Area */}
          <div className="px-4 py-3">
            {/* User Info */}
            <div className="flex gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                  {getUserInitials(profile?.full_name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {profile?.full_name ||
                    user?.email?.split("@")[0] ||
                    "Anonymous"}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  <span>Public</span>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-transparent p-0 placeholder:text-muted-foreground/50"
              disabled={isSubmitting}
              autoFocus
            />

            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-3 relative rounded-2xl overflow-hidden border border-cyber-border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full max-h-96 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    toast.error("Failed to load image");
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    setImageUrl("");
                    setShowImageInput(false);
                  }}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-cyber-darker/80 hover:bg-cyber-darker"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Image URL Input (when button clicked) */}
            {showImageInput && !imageUrl && (
              <div className="mt-3 p-3 rounded-lg border border-cyber-border bg-cyber-darker/50">
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowImageInput(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Category Pills */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={
                      selectedCategory === cat.value ? "default" : "outline"
                    }
                    className={`cursor-pointer transition-all ${
                      selectedCategory === cat.value
                        ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30"
                        : "border-cyber-border hover:bg-cyber-darker"
                    }`}
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    <span className="mr-1">{cat.emoji}</span>
                    {cat.value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-cyber-border" />

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowImageInput(!showImageInput)}
                className="h-9 w-9 text-neon-cyan hover:bg-neon-cyan/10"
                disabled={isSubmitting}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {content.trim() && (
                <span className="text-xs text-muted-foreground">
                  {content.length} characters
                </span>
              )}
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold px-6 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
