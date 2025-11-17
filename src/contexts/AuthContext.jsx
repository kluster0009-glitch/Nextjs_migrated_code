'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AUTH_ENABLED } from '@/lib/config';
import { OnboardingModal } from '@/components/OnboardingModal';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!AUTH_ENABLED) {
      setUser({ id: 'dev-user', email: 'dev@example.com' });
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check if onboarding is required
        if (session?.user) {
          setTimeout(() => {
            checkOnboardingRequired(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        checkOnboardingRequired(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboardingRequired = async (userId) => {
    try {
      // Check if required profile fields are filled
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, full_name, department, roll_number')
        .eq('id', userId)
        .single();

      // Show onboarding if any required field is missing
      const needsOnboarding = !profileData?.username || 
                              !profileData?.full_name || 
                              !profileData?.department || 
                              !profileData?.roll_number;

      setShowOnboarding(needsOnboarding);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const signOut = async () => {
    if (AUTH_ENABLED) {
      await supabase.auth.signOut();
    } else {
      // In dev mode, we just clear the user state
      setUser(null);
    }
    router.push('/');
    router.refresh();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showOnboarding && user && (
        <OnboardingModal
          open={showOnboarding}
          userId={user.id}
          userEmail={user.email || ''}
        />
      )}
    </AuthContext.Provider>
  );
};