'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building2, Mail, Users, FileText } from 'lucide-react';
import { BACKEND_URL } from '@/lib/config';

const orgRequestSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationType: z.enum(['college', 'university', 'company'], {
    required_error: 'Please select an organization type',
  }),
  emailDomain: z.string()
    .min(2, 'Email domain is required')
    .regex(/^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/, 'Invalid domain format (e.g., example.ac.in, example.edu)'),
  organizationSize: z.string().min(1, 'Organization size is required'),
  requesterName: z.string().min(2, 'Your name is required'),
  requesterEmail: z.string().email('Invalid email address'),
  additionalInfo: z.string().optional(),
});

const AddOrganizationModal = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<OrgRequestFormData>({
    resolver: zodResolver(orgRequestSchema),
    defaultValues: {
      organizationName: '',
      organizationType,
      emailDomain: '',
      organizationSize: '',
      requesterName: '',
      requesterEmail: '',
      additionalInfo: '',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/organization-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Request submitted!',
          description: 'We\'ll review your organization request and get back to you soon.',
          duration: 10000,
        });
        form.reset();
        setOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission failed',
          description: result.message || 'Please try again later.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="text-center mt-4 p-4 border border-cyber-border/50 rounded-lg border-neon-purple/50 hover:bg-cyber-border/10 transition-all cursor-pointer">
          <Button
            variant="outline"
            className="border-cyber-border hover:bg-transparent hover:border-neon-purple text-neon-purple hover:text-neon-purple transition-colors font-medium"
          >
            <Building2 className="h-4 w-4" />
            Add your Organization
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Is your organization not listed? Submit a request to add it
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-cyber-card border-cyber-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Add Your Organization
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit your organization details for review. We'll verify and add it to our allowed domains.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-foreground">
              Organization Name *
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="organizationName"
                placeholder="e.g., ABC University"
                className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                {...form.register('organizationName')}
              />
            </div>
            {form.formState.errors.organizationName && (
              <p className="text-destructive text-sm">
                {form.formState.errors.organizationName.message}
              </p>
            )}
          </div>

          {/* Organization Type */}
          <div className="space-y-2">
            <Label htmlFor="organizationType" className="text-foreground">
              Organization Type *
            </Label>
            <Select
              onValueChange={(value) => form.setValue('organizationType', value )}
            >
              <SelectTrigger className="bg-input border-cyber-border focus:border-neon-purple">
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-card border-cyber-border">
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.organizationType && (
              <p className="text-destructive text-sm">
                {form.formState.errors.organizationType.message}
              </p>
            )}
          </div>

          {/* Email Domain */}
          <div className="space-y-2">
            <Label htmlFor="emailDomain" className="text-foreground">
              Email Domain *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="emailDomain"
                placeholder="e.g., university.edu or company.com"
                className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                {...form.register('emailDomain')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the email domain without @ symbol
            </p>
            {form.formState.errors.emailDomain && (
              <p className="text-destructive text-sm">
                {form.formState.errors.emailDomain.message}
              </p>
            )}
          </div>

          {/* Organization Size */}
          <div className="space-y-2">
            <Label htmlFor="organizationSize" className="text-foreground">
              Organization Size *
            </Label>
            <Select
              onValueChange={(value) => form.setValue('organizationSize', value)}
            >
              <SelectTrigger className="bg-input border-cyber-border focus:border-neon-purple">
                <SelectValue placeholder="Select approximate size" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-card border-cyber-border">
                <SelectItem value="1-100">1-100 members</SelectItem>
                <SelectItem value="101-500">101-500 members</SelectItem>
                <SelectItem value="501-1000">501-1000 members</SelectItem>
                <SelectItem value="1001-5000">1001-5000 members</SelectItem>
                <SelectItem value="5000+">5000+ members</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.organizationSize && (
              <p className="text-destructive text-sm">
                {form.formState.errors.organizationSize.message}
              </p>
            )}
          </div>

          {/* Requester Name */}
          <div className="space-y-2">
            <Label htmlFor="requesterName" className="text-foreground">
              Your Name *
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="requesterName"
                placeholder="Enter your full name"
                className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                {...form.register('requesterName')}
              />
            </div>
            {form.formState.errors.requesterName && (
              <p className="text-destructive text-sm">
                {form.formState.errors.requesterName.message}
              </p>
            )}
          </div>

          {/* Requester Email */}
          <div className="space-y-2">
            <Label htmlFor="requesterEmail" className="text-foreground">
              Your Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="requesterEmail"
                type="email"
                placeholder="your.email@organization.com"
                className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                {...form.register('requesterEmail')}
              />
            </div>
            {form.formState.errors.requesterEmail && (
              <p className="text-destructive text-sm">
                {form.formState.errors.requesterEmail.message}
              </p>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-foreground">
              Additional Information (Optional)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="additionalInfo"
                placeholder="Any additional details that might help us verify your organization..."
                className="pl-10 pt-3 bg-input border-cyber-border focus:border-neon-purple min-h-[100px]"
                {...form.register('additionalInfo')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-cyber-border hover:bg-muted/50"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-black font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizationModal;