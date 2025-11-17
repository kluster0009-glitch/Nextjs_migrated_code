import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    MessageSquare,
    TrendingUp,
    Award,
    User,
    Building,
    BookMarked,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const UserProfileModal = ({
    userId,
    open,
    onOpenChange,
}) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId || !open) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                // 2. Update the Supabase select query to join email_domains
                const { data, error } = await supabase
                    .from('profiles')
                    .select(
                        `
            id, 
            full_name, 
            bio, 
            created_at, 
            username, 
            role, 
            department, 
            profile_picture,
            email_domains ( organization_name ) 
          ` // <-- UPDATED: This now fetches the related organization_name
                    )
                    .eq('id', userId)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching profile:', error);
                    setProfile(null);
                } else if (data) {
                    setProfile(data); // Cast data to our new interface
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, open]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const capitalize = (s) => {
        if (!s) return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-sm text-muted-foreground">Loading profile...</div>
                    </div>
                ) : profile ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="sr-only">User Profile</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto max-h-[80vh] pr-4">
                            <div className="flex flex-col items-center text-center pt-2 pb-4">
                                {profile.profile_picture ? (
                                    <img
                                        src={profile.profile_picture}
                                        alt={profile.full_name || 'Profile picture'}
                                        className="w-24 h-24 rounded-full object-cover shadow-lg mb-4"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg mb-4">
                                        <span className="text-3xl font-bold text-primary-foreground">
                                            {getInitials(profile.full_name)}
                                        </span>
                                    </div>
                                )}
                                <h2 className="text-2xl font-bold text-foreground mb-1">
                                    {profile.full_name || 'Unknown User'}
                                </h2>
                                {profile.username && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <User className="w-3 h-3" />
                                        <span>@{profile.username}</span>
                                    </div>
                                )}
                                <Badge variant="secondary" className="mt-2">
                                    {capitalize(profile.role) || 'Member'}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="py-4">
                                <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {profile.bio || 'No bio available.'}
                                </p>
                            </div>

                            {/* 3. College/Department Section (Updated) */}
                            {/* Use optional chaining (?) in case email_domains is null */}
                            {(profile.email_domains?.organization_name || profile.department) && (
                                <>
                                    <Separator />
                                    <div className="py-4 space-y-3">
                                        {profile.email_domains?.organization_name && (
                                            <div className="flex items-center gap-3">
                                                <Building className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">
                                                    {profile.email_domains.organization_name}
                                                </span>
                                            </div>
                                        )}
                                        {profile.department && (
                                            <div className="flex items-center gap-3">
                                                <BookMarked className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">
                                                    {profile.department}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <Separator />

                            {/* Stats Section */}
                            <div className="py-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Activity Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-foreground">124</div>
                                            <div className="text-xs text-muted-foreground">Messages</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-foreground">89</div>
                                            <div className="text-xs text-muted-foreground">Reactions</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-foreground">12</div>
                                            <div className="text-xs text-muted-foreground">Badges</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-foreground">45</div>
                                            <div className="text-xs text-muted-foreground">Days Active</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="py-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {formatDate(profile.created_at)}</span>
                            </div>
                        </div>

                    </>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-sm text-muted-foreground">Profile not found</div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};