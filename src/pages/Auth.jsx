'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import *  from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { BACKEND_URL } from '@/lib/config';
import AddOrganizationModal from './AddOrganizationModal';
import logo from '@/assets/logo.svg';
// Schema for when isSignUp is FALSE
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'), // Or whatever your min length is
});

// Schema for when isSignUp is TRUE
export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'], // Apply the error to the confirmPassword field
});

// You can also create a combined type for your form data
export 

const Auth = () => {
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Conditionally choose the schema
  const currentSchema = isSignUp ? signUpSchema : signInSchema;

  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  // Check if user is already authenticated
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const email = session.user.email;
          if (email) {
            // Verify domain using internal edge function
            const { data: result, error: verifyError } = await supabase.functions.invoke('verify-email-domain', {
              body: { email },
            });

            if (verifyError || !result) {
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Access denied",
                description: "Could not verify your email domain. Please try again.",
              });
              return;
            }

            if (!result.isValid) {
              // If invalid domain, sign out immediately
              await supabase.auth.signOut();

              toast({
                variant: "destructive",
                title: "Access denied",
                description: result.message || "Please use your institutional email address.",
              });

              return; // Stop navigation
            }

            // If valid, allow navigation
            router.push('/');
          }
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email;
        if (email) {
          const { data: result, error: verifyError } = await supabase.functions.invoke('verify-email-domain', {
            body: { email },
          });

          if (verifyError || !result) {
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "Could not verify your email domain. Please try again.",
            });
            return;
          }

          if (!result.isValid) {
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "Access denied",
              description: result.message || "Please use your institutional email address.",
            });
            return;
          }

          router.push('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data: verificationResult, error: verifyError } = await supabase.functions.invoke('verify-email-domain', {
          body: { email: data.email },
        });

        if (verifyError || !verificationResult?.isValid) {
          toast({
            variant: "destructive",
            title: "Sign up not allowed",
            description: verificationResult.message || "This email domain is not permitted.",
          });
          setIsLoading(false); // Stop loading and end the function
          return;
        }
        // --- END NEW SECTION ---
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: data.fullName || '',
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: "destructive",
              title: "Account already exists",
              description: "This email is already registered. Please sign in instead.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Sign up failed",
              description: error.message,
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: "destructive",
              title: "Invalid credentials",
              description: "Please check your email and password.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Sign in failed",
              description: error.message,
            });
          }
        } else {
          toast({
            variant: "success",
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          router.push('/');
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Google sign in failed",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Microsoft sign in failed",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glow-border bg-cyber-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="flex items-center gap-0">
                <img src={logo} alt="Kluster Logo" className="w-12 h-12" />
                <h1 className="text-2xl font-semibold font-space bg-gradient-to-r from-soft-cyan to-soft-violet bg-clip-text text-transparent">
                  KLUSTER
                </h1>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Connect. Learn. Evolve.</p>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              {isSignUp ? 'Create your Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp
                ? 'Join CampusConnect — your gateway to the student community'
                : 'Sign in to your institutional account'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-cyber-border hover:bg-muted/50 hover:text-foreground"
                onClick={handleGoogleSignIn}
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
                onClick={handleMicrosoftSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  {/* <path fill="#F25022" d="M11.4 24H0V12.6h11.4V24z" /> */}
                  <path fill="#F25022" d="M11.4 11.4H0V0h11.4v11.4z" />
                  <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z" />
                  <path fill="#7FBA00" d="M24 11.4H12.6V0H24v11.4z" />
                  <path fill="#FFB900" d="M24 24H12.6V12.6H24V24z" />
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

            {/* Email/Password Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                      {...form.register('fullName')}
                    />
                  </div>
                  {form.formState.errors.fullName && (
                    <p className="text-destructive text-sm">{form.formState.errors.fullName.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your institutional email"
                    className="pl-10 bg-input border-cyber-border focus:border-neon-purple"
                    {...form.register('email')}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
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
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-destructive text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 bg-input border-cyber-border focus:border-neon-purple"
                      {...form.register('confirmPassword')}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : (isSignUp ? 'Join Now' : 'Sign In')}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>{' '}
              <button
                type="button"
                className="text-neon-purple hover:text-neon-cyan transition-colors font-medium"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  form.reset();
                }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </div>
            <AddOrganizationModal />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
