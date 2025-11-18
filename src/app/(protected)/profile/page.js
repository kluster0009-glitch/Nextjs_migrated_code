'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/sonner'
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  User,
  BookOpen,
  Award,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    institution: user?.profile?.college_name || '',
    field_of_study: user?.profile?.department || '',
    graduation_year: user?.profile?.graduation_year || '',
  })

  const getUserInitials = () => {
    const name = user?.profile?.full_name || user?.email || ''
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profiles table only
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('Profile picture updated successfully')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      
      // Update profiles table only
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          college_name: formData.institution,
          department: formData.field_of_study,
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.profile?.full_name || '',
      bio: user?.profile?.bio || '',
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      institution: user?.profile?.college_name || '',
      field_of_study: user?.profile?.department || '',
      graduation_year: user?.profile?.graduation_year || '',
    })
    setIsEditing(false)
  }

  const stats = [
    { label: 'Posts', value: '0', icon: MessageSquare },
    { label: 'Karma', value: '0', icon: TrendingUp },
    { label: 'Following', value: '0', icon: Heart },
    { label: 'Followers', value: '0', icon: Share2 },
  ]

  const achievements = [
    { name: 'Early Adopter', icon: Award, color: 'text-neon-cyan' },
    { name: 'First Post', icon: MessageSquare, color: 'text-neon-purple' },
    { name: 'Verified Email', icon: Mail, color: 'text-green-500' },
  ]

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Card with Cover & Avatar */}
        <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl mb-6">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink" />
            
            {/* Avatar & Basic Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  {/* Avatar with Upload */}
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-cyber-darker">
                      <AvatarImage src={user?.profile?.profile_picture} />
                      <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-3xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full bg-cyber-card border-cyber-border"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  {/* Name & Email */}
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground">
                      {user?.profile?.full_name || 'User'}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                    {user?.profile?.location && (
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        {user.profile.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-4 md:mt-0 mb-4">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-cyber-border"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Achievements */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-cyber-darker/50">
                      <stat.icon className="w-5 h-5 mx-auto mb-2 text-neon-cyan" />
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Your milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-cyber-darker/50">
                      <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                      <span className="text-sm text-foreground">{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="bg-cyber-card/50 border border-cyber-border">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* Bio Section */}
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px] bg-cyber-darker border-cyber-border"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {user?.profile?.bio || 'No bio added yet. Click Edit Profile to add one.'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">{user?.profile?.full_name || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">{user?.profile?.phone || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">{user?.profile?.location || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        {isEditing ? (
                          <Input
                            id="institution"
                            value={formData.institution}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">{user?.profile?.college_name || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field_of_study">Field of Study</Label>
                        {isEditing ? (
                          <Input
                            id="field_of_study"
                            value={formData.field_of_study}
                            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">{user?.profile?.department || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="graduation_year">Graduation Year</Label>
                        {isEditing ? (
                          <Input
                            id="graduation_year"
                            value={formData.graduation_year}
                            onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                            className="bg-cyber-darker border-cyber-border"
                          />
                        ) : (
                          <p className="text-muted-foreground">{user?.profile?.graduation_year || 'Not set'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Account Created</Label>
                        <p className="text-muted-foreground">
                          {new Date(user?.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts">
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">Start sharing your thoughts with the community!</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardContent className="py-12 text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
                    <p className="text-muted-foreground">Your recent activity will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
