'use client'

import { useState, useEffect } from 'react';
import { Settings, Grid, Bookmark, UserSquare2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [postsCount, setPostsCount] = useState(0);
  const [followersCount] = useState(11);
  const [followingCount] = useState(9);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (process.env.NODE_ENV === 'development') console.error('Error loading profile:', error);
          toast.error('Failed to load profile');

        }

        if (data) {
          setUsername(data.username || 'user');
          setFullName(data.full_name || 'User');
          setBio(data.bio || '');
          setProfileImage(data.profile_picture || '');
        }

        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (postsError) {
          if (process.env.NODE_ENV === 'development') console.error('Error loading posts:', postsError);
        } else {
          setUserPosts(posts || []);
          setPostsCount(posts?.length || 0);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Error:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen immersive-bg flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen immersive-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-start gap-8 mb-6">
            <Avatar className="w-32 h-32 border-2 border-cyber-border">
              <AvatarImage src={profileImage} alt={fullName} />
              <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan text-black text-3xl font-bold">
                {fullName?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-foreground">{username}</h1>
                <Button
                  variant="outline"
                  className="bg-cyber-card border-cyber-border hover:bg-cyber-card/80 text-foreground"
                  onClick={() => navigate('/settings')}
                >
                  Edit profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-foreground"
                  onClick={() => navigate('/settings')}
                >
                  View archive
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex gap-8 mb-6">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">{postsCount}</span>
                  <span className="text-foreground">post{postsCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">{followersCount}</span>
                  <span className="text-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">{followingCount}</span>
                  <span className="text-foreground">following</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-foreground">{fullName}</p>
                {bio && <p className="text-foreground whitespace-pre-wrap">{bio}</p>}
                <a 
                  href="https://kluster.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-neon-cyan hover:underline"
                >
                  <LinkIcon className="w-3 h-3" />
                  kluster.in
                </a>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-transparent border-t border-cyber-border h-auto p-0">
            <TabsTrigger value="posts" className="data-[state=active]:border-t-2 data-[state=active]:border-foreground rounded-none py-4 gap-2">
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">POSTS</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:border-t-2 data-[state=active]:border-foreground rounded-none py-4 gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">SAVED</span>
            </TabsTrigger>
            <TabsTrigger value="tagged" className="data-[state=active]:border-t-2 data-[state=active]:border-foreground rounded-none py-4 gap-2">
              <UserSquare2 className="w-4 h-4" />
              <span className="hidden sm:inline">TAGGED</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-8">
            {userPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 rounded-full border-4 border-cyber-border flex items-center justify-center mb-6">
                  <Grid className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Share Photos</h3>
                <p className="text-muted-foreground">When you share photos, they will appear on your profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {userPosts.map((post) => (
                  <Card key={post.id} className="aspect-square bg-cyber-card border-cyber-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    {post.image_url ? (
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 p-4">
                        <p className="text-sm text-center text-foreground line-clamp-4">{post.title}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 rounded-full border-4 border-cyber-border flex items-center justify-center mb-6">
                <Bookmark className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Save</h3>
              <p className="text-muted-foreground">Save photos and videos that you want to see again.</p>
            </div>
          </TabsContent>

          <TabsContent value="tagged" className="mt-8">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 rounded-full border-4 border-cyber-border flex items-center justify-center mb-6">
                <UserSquare2 className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Photos of you</h3>
              <p className="text-muted-foreground">When people tag you in photos, they'll appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

