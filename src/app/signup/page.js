'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithOAuth, user, loading, resendVerificationEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  // Redirect to cluster if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/cluster')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) return null

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName || fullName.length < 2) {
      newErrors.fullName = 'Full name is required (minimum 2 characters)';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    const { data, error } = await signUp(email, password, { full_name: fullName });

    if (error) {
      toast.error(error.message || 'Failed to create account')
      setErrors({ submit: error.message });
      setIsLoading(false);
      return;
    }

    if (data?.user?.identities?.length === 0) {
      toast.error('An account with this email already exists.')
      setErrors({ submit: 'An account with this email already exists.' });
      setIsLoading(false);
      return;
    }

    // Store email for resend verification
    setSignupEmail(email);
    setShowResendVerification(true);
    toast.success('Welcome aboard! 🎉 Please check your email to verify your account.')
    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    if (!signupEmail) {
      toast.error('Please sign up first before requesting verification email.')
      return;
    }

    setIsLoading(true);
    const { error } = await resendVerificationEmail(signupEmail);

    if (error) {
      toast.error(error.message || 'Failed to resend verification email')
    } else {
      toast.success('Verification email sent! Please check your inbox.')
    }
    setIsLoading(false);
  };

  const handleOAuth = async (provider) => {
    setIsLoading(true);
    const { error } = await signInWithOAuth(provider, provider === 'azure' ? { scopes: 'email' } : {});
    if (error) {
      toast.error(error.message || `Failed to sign in with ${provider}`)
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glow-border bg-cyber-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <Image 
                  src="/logo.svg" 
                  alt="Kluster Logo" 
                  width={48} 
                  height={48}
                  className="w-12 h-12"
                />
                <h1 className="text-2xl font-semibold font-space bg-gradient-to-r from-soft-cyan to-soft-violet bg-clip-text text-transparent">
                  KLUSTER
                </h1>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Connect. Learn. Evolve.</p>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Create your Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join Kluster — your gateway to the student community
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-cyber-border hover:bg-muted/50 hover:text-foreground"
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full border-cyber-border hover:bg-muted/50 hover:text-foreground"
                onClick={() => handleOAuth('azure')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M11.4 11.4H0V0h11.4v11.4z" />
                  <path fill="#00a4ef" d="M24 11.4H12.6V0H24v11.4z" />
                  <path fill="#7fba00" d="M11.4 24H0V12.6h11.4V24z" />
                  <path fill="#ffb900" d="M24 24H12.6V12.6H24V24z" />
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-cyber-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-cyber-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-destructive text-sm">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your institutional email"
                    className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-input border-cyber-border focus:border-neon-purple"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-input border-cyber-border focus:border-neon-purple"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-sm">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Join Now'}
              </Button>
            </form>

            {showResendVerification && (
              <div className="space-y-3 p-4 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg">
                <div className="text-center space-y-2">
                  <p className="text-sm text-foreground font-medium">
                    Didn't receive the verification email?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Check your spam folder or click below to resend
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-neon-cyan/30 hover:bg-neon-cyan/20 text-neon-cyan"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Resend Verification Email'}
                </Button>
                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-xs text-neon-purple hover:text-neon-cyan transition-colors"
                  >
                    Already verified? Sign in →
                  </Link>
                </div>
              </div>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?
              </span>{' '}
              <Link
                href="/login"
                className="text-neon-purple hover:text-neon-cyan transition-colors font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
