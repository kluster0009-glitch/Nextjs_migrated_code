'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, MessageCircle, Share2, Bookmark, ArrowUp, Users } from 'lucide-react'
import NoticeCarousel from '@/components/NoticeCarousel'
import { formatDistanceToNow } from 'date-fns'

export default function ClusterPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [showNewPostNotification, setShowNewPostNotification] = useState(false)
  const [newPostsCount, setNewPostsCount] = useState(0)

  // Fetch posts from database
  const fetchPosts = useCallback(async () => {
    try {
      const supabase = createClient()
      
      // Get posts with limit for better performance
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (postsError) throw postsError

      if (postsData && postsData.length > 0) {
        const userIds = [...new Set(postsData.map(post => post.user_id))]
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, profile_picture, username, college_name, department')
          .in('id', userIds)

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
        }

        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(profile => profile.id === post.user_id) || null
        }))

        setPosts(postsWithProfiles)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoadingPosts(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPosts()
  }, [])

  // Real-time subscription
  useEffect(() => {
    if (!user) return
    
    const supabase = createClient()
    
    const channel = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          // Show notification for new posts
          setNewPostsCount(prev => prev + 1)
          setShowNewPostNotification(true)
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setShowNewPostNotification(false)
          }, 5000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const handleRefreshPosts = () => {
    fetchPosts()
    setShowNewPostNotification(false)
    setNewPostsCount(0)
  }

  const handlePostCreated = (newPost) => {
    // Optimistically add the new post to the feed
    setPosts(prev => [newPost, ...prev])
  }

  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'recently'
    }
  }

  const trendingTopics = [
    { name: 'Computer Science', count: 50 },
    { name: 'Mathematics', count: 53 },
    { name: 'Physics', count: 47 },
    { name: 'Chemistry', count: 54 },
    { name: 'Biology', count: 57 }
  ]

  const stats = {
    totalPosts: posts.length,
    activeUsers: 1234,
    thisWeek: `+${posts.filter(p => {
      const postDate = new Date(p.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return postDate >= weekAgo
    }).length} posts`
  }

  return (
    <div className="min-h-screen bg-cyber-darker">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Main Feed */}
          <div className="lg:col-span-7">
            {/* Carousel Banner */}
            <NoticeCarousel />

            {/* New Post Notification */}
            {showNewPostNotification && (
              <div className="mb-4 flex justify-center">
                <Button
                  onClick={handleRefreshPosts}
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-3 flex items-center gap-3"
                >
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/30 border-2 border-black flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <span>{newPostsCount} new {newPostsCount === 1 ? 'post' : 'posts'}</span>
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
                variant={activeTab === 'all' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('all')}
                className={activeTab === 'all' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : ''}
              >
                All Posts
              </Button>
              <Button
                variant={activeTab === 'college' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('college')}
                className={activeTab === 'college' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : ''}
              >
                My College
              </Button>
              <Button
                variant={activeTab === 'global' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('global')}
                className={activeTab === 'global' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : ''}
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
                    <p className="text-muted-foreground">Be the first to share something with the community!</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => {
                  // Get author info from the joined profiles table
                  const authorName = post.profiles?.full_name || 'Anonymous User'
                  const authorAvatar = post.profiles?.profile_picture
                  const authorUsername = post.profiles?.username
                  
                  return (
                    <Card key={post.id} className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={authorAvatar} />
                              <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                                {getUserInitials(authorName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-foreground">{authorName}</h3>
                              <p className="text-sm text-muted-foreground">{formatTimeAgo(post.created_at)}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-cyber-darker/50">
                            {post.category}
                          </Badge>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <h4 className="text-xl font-semibold mb-2 text-foreground">{post.title}</h4>
                          <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                          {post.image_url && (
                            <div className="rounded-lg overflow-hidden">
                              <img
                                src={post.image_url}
                                alt="Post content"
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center gap-6 pt-4 border-t border-cyber-border">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-pink">
                            <Heart className="w-4 h-4 mr-2" />
                            {post.likes_count || 0}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-cyan">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments_count || 0}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-purple">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground hover:text-neon-cyan">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Trending Topics */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Trending Topics</h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
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
                <h3 className="text-xl font-bold mb-4 text-foreground">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Posts</span>
                    <span className="text-foreground font-semibold">{stats.totalPosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Users</span>
                    <span className="text-foreground font-semibold">{stats.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="text-neon-cyan font-semibold">{stats.thisWeek}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
