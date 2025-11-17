-- Fix Email Domain Verification to Prevent Unauthorized Sign-ups
-- This migration adds strict email domain validation at the database level

-- 1. Create a function to validate email domains
CREATE OR REPLACE FUNCTION public.validate_email_domain(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_domain text;
  domain_exists boolean;
BEGIN
  -- Extract domain from email
  email_domain := split_part(user_email, '@', 2);
  
  -- Check if domain exists in email_domains table
  SELECT EXISTS (
    SELECT 1 
    FROM public.email_domains 
    WHERE domain = email_domain
  ) INTO domain_exists;
  
  RETURN domain_exists;
END;
$$;

-- 2. Update the create_profile_for_user function to REJECT unauthorized domains
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id bigint;
  email_domain text;
  domain_valid boolean;
BEGIN
  -- Extract domain from email
  email_domain := split_part(new.email, '@', 2);
  
  -- Check if domain is valid
  SELECT public.validate_email_domain(new.email) INTO domain_valid;
  
  -- If domain is not valid, raise an exception to prevent user creation
  IF NOT domain_valid THEN
    RAISE EXCEPTION 'Email domain % is not authorized. Only institutional emails are allowed.', email_domain
      USING HINT = 'Please use an email from an authorized educational institution.';
  END IF;
  
  -- Get organization ID for the domain
  SELECT id INTO org_id 
  FROM public.email_domains
  WHERE domain = email_domain;
  
  -- Create the profile with required fields
  INSERT INTO public.profiles (
    id, 
    email, 
    organization_id, 
    full_name,
    username,
    department,
    roll_number,
    role
  ) VALUES (
    new.id, 
    new.email, 
    org_id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'display_name', 
      new.raw_user_meta_data->>'name',
      'User'
    ),
    COALESCE(
      new.raw_user_meta_data->>'username',
      'user_' || substring(new.id::text, 1, 8)
    ),
    'General',
    'N/A',
    'student'
  );
  
  -- Insert default student role into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN new;
END;
$$;

-- 3. Add a helper function for the application to check domains before signup
CREATE OR REPLACE FUNCTION public.check_email_domain(user_email text)
RETURNS TABLE(
  is_valid boolean,
  domain text,
  organization_name text,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_domain text;
  org_name text;
  domain_exists boolean;
BEGIN
  -- Extract domain
  email_domain := split_part(user_email, '@', 2);
  
  -- Check if domain exists and get org name
  SELECT 
    EXISTS (SELECT 1 FROM public.email_domains WHERE domain = email_domain),
    COALESCE(
      (SELECT organization_name FROM public.email_domains WHERE domain = email_domain LIMIT 1),
      ''
    )
  INTO domain_exists, org_name;
  
  -- Return results
  IF domain_exists THEN
    RETURN QUERY SELECT 
      true as is_valid,
      email_domain as domain,
      org_name as organization_name,
      'Email domain is authorized'::text as message;
  ELSE
    RETURN QUERY SELECT 
      false as is_valid,
      email_domain as domain,
      ''::text as organization_name,
      format('Email domain %s is not authorized. Only institutional emails are allowed.', email_domain)::text as message;
  END IF;
END;
$$;

-- 4. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.validate_email_domain(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.check_email_domain(text) TO authenticated, anon;

-- 5. Add a comment explaining the security measure
COMMENT ON FUNCTION public.validate_email_domain IS 
  'Validates if an email domain exists in the allowed email_domains table. Used by triggers to prevent unauthorized signups.';

COMMENT ON FUNCTION public.check_email_domain IS 
  'Application-level function to check email domain validity before signup attempts. Returns detailed validation info.';

COMMENT ON FUNCTION public.create_profile_for_user IS 
  'Trigger function that creates user profile ONLY if email domain is authorized. Raises exception for unauthorized domains.';
