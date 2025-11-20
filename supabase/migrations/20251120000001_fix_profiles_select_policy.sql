-- Fix missing SELECT policy on profiles table
-- This was causing authentication to hang because users couldn't read their own profile

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;

-- Create a simple policy allowing users to read their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());
