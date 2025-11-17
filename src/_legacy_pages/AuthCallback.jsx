'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BACKEND_URL } from '@/lib/config';
const AuthCallback = () => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 1. Get the current session (Supabase automatically handles OAuth redirect)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: "Could not process your login. Please try again.",
          });
          router.push('/auth');
          return;
        }

        const user = session?.user;
        if (!user?.email) {
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: "Could not retrieve your email address",
          });
          await supabase.auth.signOut();
          router.push('/auth');
          return;
        }

        // 2. Validate email domain using internal edge function
        const { data: result, error: verifyError } = await supabase.functions.invoke('verify-email-domain', {
          body: { email: user.email },
        });

        if (!verifyError && result?.isValid) {
          // Domain valid → proceed
          toast({
            variant:"success",
            title: "Welcome!",
            description: "You've been signed in successfully.",
          });
          router.push('/');
        } else {
          // Domain invalid → delete the user using secure edge function
          try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (currentSession?.access_token) {
              await supabase.functions.invoke('delete-user', {
                headers: {
                  Authorization: `Bearer ${currentSession.access_token}`,
                },
              });
            }
            } catch (deleteError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error deleting invalid user:', deleteError);
            }
          }

          toast({
            variant: "destructive",
            title: "Sign in not allowed",
            description: result.message || "Please enter your institutional email address.",
          });

          // Ensure session is cleared
          await supabase.auth.signOut();
          router.push('/auth');
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "Could not verify your account. Please try again later.",
        });
        await supabase.auth.signOut();
        router.push('/auth');
      }
    };

    handleAuthCallback();
  }, [router, toast]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Verifying your account, please wait...</p>
    </div>
  );
};

export default AuthCallback;

