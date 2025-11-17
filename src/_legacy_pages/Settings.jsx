'use client'

import { useState, useEffect } from 'react';
import { Camera, User, Home, Edit2, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [accountCreated, setAccountCreated] = useState('');
  const [loginType, setLoginType] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        // Fetch profile with college name from email_domains
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            email_domains:organization_id (
              organization_name
            )
          `)
          .eq('id', user.id)
          .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') console.error('Error loading profile:', error);
        toast.error('Failed to load profile');

      }

        if (data) {
          setUsername(data.username || '');
          setFullName(data.full_name || '');
          setEmail(data.email || '');
          setCollegeName(data.email_domains?.organization_name || '');
          setDepartment(data.department || '');
          setRollNumber(data.roll_number || '');
          setBio(data.bio || '');
          setProfileImage(data.profile_picture || '');
          setRole(data.role || '');
        }

        // Get auth metadata
        if (user.created_at) {
          setAccountCreated(new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
        }

        // Determine login type from identities
        const provider = user.app_metadata?.provider || 
                        user.identities?.[0]?.provider || 
                        'email';
        setLoginType(provider.charAt(0).toUpperCase() + provider.slice(1));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Error:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          department,
          roll_number: rollNumber,
          bio,
          profile_picture: profileImage,
        })
        .eq('id', user.id);

      if (error) {
        if (process.env.NODE_ENV === 'development') console.error('Error updating profile:', error);
        toast.error('Failed to save profile');

      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setIsEditing(false);
    // Reload profile data to reset any unsaved changes
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select(`
          *,
          email_domains:organization_id (
            organization_name
          )
        `)
        .eq('id', user.id)
        .single();

      if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
        setDepartment(data.department || '');
        setRollNumber(data.roll_number || '');
        setBio(data.bio || '');
        setProfileImage(data.profile_picture || '');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error reloading profile:', error);
    }
  };

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button
            variant="outline"
            className="border-neon-purple/30 text-foreground hover:bg-neon-purple/10"
            onClick={() => window.location.href = '/'}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="bg-card border-cyber-border glow-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-foreground">Personal Information</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                className="border-neon-purple/30 text-foreground hover:bg-neon-purple/10"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-neon-purple/30">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-cyan text-cyber-dark text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <label
                      htmlFor="profile-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-neon-cyan" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
              {isEditing && <p className="text-sm text-muted-foreground">Click to upload profile picture</p>}
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Account Created</Label>
                <p className="text-sm font-medium text-foreground">{accountCreated}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Login Type</Label>
                <p className="text-sm font-medium text-foreground">{loginType}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Role</Label>
                <p className="text-sm font-medium text-foreground capitalize">{role}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="bg-input border-border focus:border-neon-purple"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-foreground">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="Enter your full name"
                  className="bg-input border-border focus:border-neon-purple"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-input border-border focus:border-neon-purple"
                  value={email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="college" className="text-foreground">College Name</Label>
                <Input
                  id="college"
                  placeholder="College name from organization"
                  className="bg-input border-border focus:border-neon-purple"
                  value={collegeName}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-foreground">Department</Label>
                <Input
                  id="department"
                  placeholder="Enter your department"
                  className="bg-input border-border focus:border-neon-purple"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollnumber" className="text-foreground">Roll Number</Label>
                <Input
                  id="rollnumber"
                  placeholder="Enter your roll number"
                  className="bg-input border-border focus:border-neon-purple"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="bg-input border-border focus:border-neon-purple min-h-[120px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons - Only show when editing */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-neon-purple to-neon-cyan text-cyber-dark hover:opacity-90 transition-opacity"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-neon-purple/30 text-foreground hover:bg-neon-purple/10"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

