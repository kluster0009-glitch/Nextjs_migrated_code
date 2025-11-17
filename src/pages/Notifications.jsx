'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/lib/config';

const Notifications = () => {
  const { session, user } = useAuth();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchFriendRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFriendRequests = async () => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(`${BACKEND_URL}/friends/requests`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friend requests');
      }

      const data = await response.json();

      // Filter to only pending requests
      const pendingRequests = (data || []).filter(
        (req) => req.status === 'pending'
      );
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load friend requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (
  requestId,
  action: 'accept' | 'reject'
) => {
  if (!session?.access_token) return;

  setRespondingTo(requestId);

  try {
    const response = await fetch(
      `${BACKEND_URL}/friends/requests/${requestId}/respond`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }), // 👈 send { action: 'accept' | 'reject' }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to ${action} friend request`);
    }

    // Remove the request from local state
    setRequests((prev) => prev.filter((req) => req.id !== requestId));

    toast({
      title: 'Success',
      variant: 'success',
      description: `Friend request ${action}ed`,
    });
  } catch (error) {
    console.error(`Error ${action}ing friend request:`, error);
    toast({
      title: 'Error',
      description: `Failed to ${action} friend request`,
      variant: 'destructive',
    });
  } finally {
    setRespondingTo(null);
  }
};


  const getInitials = (name | null, username | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (name | null, username | null) => {
    return name || username || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Friend Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending friend requests
              </p>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {requests.map((request) => {
                    const isIncoming = request.receiver_id === user?.id;

                    // Be defensive: sender/receiver may be missing
                    const otherUser = isIncoming
                      ? request.sender
                      : request.receiver;

                    const displayName = getDisplayName(
                      otherUser?.full_name ?? null,
                      otherUser?.username ?? null
                    );
                    const initials = getInitials(
                      otherUser?.full_name ?? null,
                      otherUser?.username ?? null
                    );

                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <p className="font-medium">{displayName}</p>
                            <p className="text-sm text-muted-foreground">
                              {isIncoming
                                ? 'Sent you a request'
                                : 'You sent a request'}
                            </p>
                          </div>
                        </div>

                        {isIncoming && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleRespond(request.id, 'accept')
                              }
                              disabled={respondingTo === request.id}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              {respondingTo === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Accept'
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleRespond(request.id, 'reject')
                              }
                              disabled={respondingTo === request.id}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {respondingTo === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Reject'
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
