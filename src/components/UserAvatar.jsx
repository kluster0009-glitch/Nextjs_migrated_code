"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * UserAvatar component with proper fallback handling
 * Supports both base64 and URL images
 */
export function UserAvatar({
  src,
  fallbackText,
  className = "w-10 h-10",
  fallbackClassName = "bg-neon-purple/20 text-neon-purple",
}) {
  const getInitials = (text) => {
    if (!text) return "U";
    return text
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = (e) => {
    // If image fails to load, hide it and show fallback
    e.target.style.display = "none";
  };

  return (
    <Avatar className={className}>
      {src && (
        <AvatarImage
          src={src}
          alt={fallbackText || "User avatar"}
          onError={handleImageError}
        />
      )}
      <AvatarFallback className={fallbackClassName}>
        {getInitials(fallbackText)}
      </AvatarFallback>
    </Avatar>
  );
}
