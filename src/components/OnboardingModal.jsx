import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const OnboardingModal = ({ open, userId, userEmail }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [bio, setBio] = useState('');
  const [whereHeard, setWhereHeard] = useState('');
  const [otherSource, setOtherSource] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !fullName || !department || !rollNumber || !whereHeard) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (whereHeard === 'other' && !otherSource) {
      toast.error('Please specify where you heard about us');
      return;
    }

    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          department,
          roll_number: rollNumber,
          bio,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Save onboarding survey (upsert to handle re-submissions)
      const whereHeardValue = whereHeard === 'other' ? otherSource : whereHeard;
      const { error: surveyError } = await supabase
        .from('onboarding_survey')
        .upsert({
          user_id: userId,
          where_heard_about_us: whereHeardValue,
        }, {
          onConflict: 'user_id'
        });

      if (surveyError) throw surveyError;

      toast.success('Welcome! Your profile has been set up.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} modal>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-cyber-border">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Welcome to Kluster! 🎉
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Let's set up your profile to get you started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                className="bg-input border-border focus:border-neon-purple"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                className="bg-input border-border focus:border-neon-purple"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-foreground">
                Department <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                placeholder="Enter your department"
                className="bg-input border-border focus:border-neon-purple"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="text-foreground">
                Roll Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rollNumber"
                placeholder="Enter your roll number"
                className="bg-input border-border focus:border-neon-purple"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whereHeard" className="text-foreground">
              Where did you hear about us? <span className="text-destructive">*</span>
            </Label>
            <Select value={whereHeard} onValueChange={setWhereHeard} required>
              <SelectTrigger className="bg-input border-border focus:border-neon-purple">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friend">Friend or Colleague</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="search">Search Engine</SelectItem>
                <SelectItem value="college">College/University</SelectItem>
                <SelectItem value="event">Event or Conference</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {whereHeard === 'other' && (
              <Input
                id="otherSource"
                placeholder="Please specify..."
                className="bg-input border-border focus:border-neon-purple mt-2"
                value={otherSource}
                onChange={(e) => setOtherSource(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className="bg-input border-border focus:border-neon-purple min-h-[100px]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-cyber-dark hover:opacity-90 transition-opacity"
            disabled={saving}
          >
            {saving ? 'Setting up...' : 'Complete Setup'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
