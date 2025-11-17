'use client'

import React, { useEffect, useState } from 'react';
import NoticeCarousel from '@/components/NoticeCarousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Heart, MessageSquare, Share } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

 | null;
}
const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // First, fetch all posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Then, fetch profile information for each post
      const postsWithProfiles = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', post.user_id)
            .single();

          return {
            ...post,
            profiles: profileData,
          };
        })
      );

      setPosts(postsWithProfiles );
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to new posts
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLike = async (postId) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
      }

      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive',
      });
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingTopics = [{
    name: 'Computer Science',
    count: 50
  }, {
    name: 'Mathematics',
    count: 53
  }, {
    name: 'Physics',
    count: 47
  }, {
    name: 'Chemistry',
    count: 54
  }, {
    name: 'Biology',
    count: 57
  }];

  return <div className="min-h-screen immersive-bg">
      <div className="pt-8">
        {/* Notice Carousel */}
        <NoticeCarousel />
        
        <div className="container mx-auto px-6 pb-8">
          {/* Page Header */}
          <div className="mb-8">
            
          </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search posts..." 
                  className="pl-10 bg-cyber-card/50 border-cyber-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                  All Posts
                </Button>
                <Button variant="ghost" size="sm">My College</Button>
                <Button variant="ghost" size="sm">Global</Button>
              </div>
            </div>

            {/* Posts */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card className="p-12 bg-cyber-card/50 backdrop-blur-sm border-cyber-border text-center">
                <p className="text-muted-foreground mb-4">No posts yet. Be the first to share something!</p>
                <p className="text-sm text-muted-foreground">Click the "Create Post" button in the sidebar to get started.</p>
              </Card>
            ) : (
              filteredPosts.map(post => <Card key={post.id} className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border hover:border-cyber-border/60 transition-all duration-300">
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center">
                        <span className="text-black font-semibold text-sm">
                          {post.profiles?.full_name ? post.profiles.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                        </span>
                      </div>
                      
                        <h3 className="font-semibold text-foreground">
                          {post.profiles?.full_name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`
                      ${post.category === 'Academic' ? 'bg-neon-purple/20 text-neon-purple' : 
                        post.category === 'College' ? 'bg-neon-cyan/20 text-neon-cyan' : 
                        'bg-neon-green/20 text-neon-green'}
                    `}>
                      {post.category}
                    </Badge>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-foreground">{post.title}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    
                    {post.image_url && (
                      <div className="w-full rounded-lg border border-cyber-border overflow-hidden">
                        <img 
                          src={post.image_url} 
                          alt="Post content"
                          className="w-full h-auto object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center space-x-6 pt-4 border-t border-cyber-border">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-neon-pink"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {post.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-cyan">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {post.comments_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-purple">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>)
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-cyan mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => <div key={index} className="flex items-center justify-between">
                    <span className="text-foreground">{topic.name}</span>
                    <Badge variant="outline" className="text-neon-purple border-neon-purple/30">
                      {topic.count}
                    </Badge>
                  </div>)}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-green mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="text-foreground font-semibold">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="text-foreground font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="text-neon-cyan font-semibold">+{posts.length} posts</span>
                </div>
              </div>
            </Card>
        </div>
      </div>
      </div>
    </div>
    </div>;
};
export default Feed;
