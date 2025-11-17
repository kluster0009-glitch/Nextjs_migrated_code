import React, { useState, useRef, useEffect } from 'react';
import { User, UserPlus, MessageSquare, Ban, Flag } from 'lucide-react';
import { BACKEND_URL } from '@/config';
import { useAuth } from '@/lib/auth-context';

export const ChatMessage = ({
  message,
  getInitials,
  onViewProfile,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sendingFriendRequest, setSendingFriendRequest] = useState(false);
  const dropdownRef = useRef(null);
  const { user, session } = useAuth();

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const displayName = message.sender_full_name || 'Member';
  const initials = getInitials(displayName);

  const isSelf = user && user.id === message.sender_id;

  const handleViewProfile = (userId) => {
    if (onViewProfile) {
      onViewProfile(userId);
    }
    setDropdownOpen(false);
  };

  const onSendFriendRequest = async (userId) => {
    // Prevent sending request to self (shouldn’t be reachable if isSelf)
    if (user && user.id === userId) {
      console.warn('Cannot send a friend request to yourself');
      setDropdownOpen(false);

    }

    if (sendingFriendRequest) return;

    setSendingFriendRequest(true);
    try {
      if (!session?.access_token) {
        console.warn('No session/token, cannot send friend request');

      }

      const res = await fetch(`${BACKEND_URL}/friends/requests`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver_id: userId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Failed to send friend request', res.status, errorData);

      }

      const data = await res.json();
      console.log('Friend request sent:', data);
    } catch (err) {
      console.error('Error sending friend request', err);
    } finally {
      setSendingFriendRequest(false);
      setDropdownOpen(false);
    }
  };

  const onMessageUser = (userId) => {
    console.log('Message user:', userId);
    setDropdownOpen(false);
  };

  const onBlockUser = (userId) => {
    console.log('Block user:', userId);
    setDropdownOpen(false);
  };

  const onReportUser = (userId) => {
    console.log('Report user:', userId);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target )
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
  <div
    className={`
      flex items-start gap-2.5 md:gap-3.5 group
      hover:bg-muted/30 -mx-2 md:-mx-3 px-2 md:px-3 py-2
      rounded-lg transition-colors
      ${isSelf ? 'justify-end' : ''}
    `}
  >
    {/* Avatar + dropdown (only clickable for others) */}
    <div className="relative" ref={dropdownRef}>
      {isSelf ? (
        // Non-clickable avatar for your own messages
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-md flex-shrink-0 cursor-default">
          <span className="text-primary-foreground font-semibold text-xs md:text-sm">
            {initials}
          </span>
        </div>
      ) : (
        // Clickable avatar with dropdown for others
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-md flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
        >
          <span className="text-primary-foreground font-semibold text-xs md:text-sm">
            {initials}
          </span>
        </button>
      )}

      {/* Dropdown Menu – only for other users */}
      {!isSelf && dropdownOpen && (
        <div
          className="absolute top-12 left-0 z-50 w-48 bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          style={{ transformOrigin: 'top left' }}
        >
          <div className="py-1">
            <button
              onClick={() => handleViewProfile(message.sender_id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <User className="w-4 h-4" />
              View Profile
            </button>

            <button
              onClick={() => onSendFriendRequest(message.sender_id)}
              disabled={sendingFriendRequest}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              {sendingFriendRequest ? 'Sending...' : 'Send Friend Request'}
            </button>

            <button
              onClick={() => onMessageUser(message.sender_id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Message User
            </button>

            <div className="border-t border-border my-1" />

            <button
              onClick={() => onBlockUser(message.sender_id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Ban className="w-4 h-4" />
              Block User
            </button>

            <button
              onClick={() => onReportUser(message.sender_id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Flag className="w-4 h-4" />
              Report User
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Message bubble + name/time */}
    <div className=" min-w-0 flex flex-col">
      <div
        className={`
          flex items-baseline gap-2 mb-0.5 md:mb-1
          ${isSelf ? 'justify-end' : ''}
        `}
      >
        <span className="font-semibold text-foreground text-xs md:text-sm">
          {displayName}
        </span>
        <span className="text-[10px] md:text-xs text-muted-foreground">
          {time}
        </span>
      </div>

      <p
        className={`
          inline-block max-w-[80%] text-xs md:text-sm leading-relaxed
          px-3 py-2 rounded-xl
          ${isSelf
            ? 'bg-secondary text-foreground ml-auto'
            : 'bg-primary text-primary-foreground'
          }
        `}
      >
        {message.content}
      </p>
    </div>
  </div>
);

};

