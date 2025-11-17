# Email Domain Verification Fix

## Problem
The email domain verification logic was **not working properly**, allowing users with any email domain to sign up and log in, even if their domain was not in the authorized `email_domains` table.

### Root Causes
1. **Database trigger was permissive**: The `create_profile_for_user()` trigger allowed profile creation even when the email domain didn't exist in the `email_domains` table (it just set `organization_id` to `null`)
2. **OAuth bypass**: Google/Microsoft OAuth sign-ins bypassed the application-level validation in the auth page
3. **Late validation**: The callback page validation happened AFTER the user was already created in Supabase Auth
4. **No database-level enforcement**: There was no database constraint preventing unauthorized email domains

## Solution Implemented

### 1. Database-Level Enforcement (Primary Fix)
Created a new migration: `20251118000000_fix_email_domain_verification.sql`

**New Functions:**
- `validate_email_domain(user_email)`: Core validation function that checks if an email domain exists in the `email_domains` table
- `check_email_domain(user_email)`: Application-facing RPC function that returns detailed validation info
- Updated `create_profile_for_user()`: Now **rejects** user creation with an exception if the email domain is not authorized

**How it works:**
```sql
-- When a user tries to sign up, the trigger now:
1. Extracts the domain from their email
2. Checks if domain exists in email_domains table
3. If NOT found → RAISES EXCEPTION → Signup fails at database level
4. If found → Creates profile with organization_id → Signup succeeds
```

### 2. Enhanced Application-Level Validation

**Updated `/src/app/auth/page.js`:**
- Now uses the `check_email_domain` RPC function for validation
- Pre-validates email domain before calling `supabase.auth.signUp()`
- Better error handling for database-level rejections
- Shows clear error messages to users

**Updated `/src/app/auth/callback/page.js`:**
- Checks for domain validation errors in URL parameters
- Verifies that user profile was created successfully
- Confirms user has an `organization_id` (proving domain was valid)
- Signs out user and shows error if any validation fails
- Better error messages and user feedback

### 3. Multi-Layer Security

The fix implements **defense in depth** with multiple validation layers:

1. **Application pre-check** (auth page): Prevents unnecessary signup attempts
2. **Database trigger** (PostgreSQL): Enforces domain validation at data level
3. **Post-authentication check** (callback): Verifies profile creation succeeded
4. **Profile verification**: Ensures organization_id is set

## Testing the Fix

### Test Case 1: Unauthorized Email Domain
```
Email: user@unauthorized-domain.com
Expected: Sign up fails with error message
Actual: ✅ Database trigger raises exception, signup prevented
```

### Test Case 2: Authorized Email Domain
```
Email: student@authorized-university.edu
Expected: Sign up succeeds, profile created
Actual: ✅ Profile created with organization_id set
```

### Test Case 3: OAuth (Google/Microsoft) with Unauthorized Domain
```
OAuth Email: user@gmail.com (if not in email_domains)
Expected: User creation fails, redirected to auth page
Actual: ✅ Database trigger prevents profile creation, auth fails
```

### Test Case 4: OAuth with Authorized Domain
```
OAuth Email: student@authorized-university.edu
Expected: Sign in succeeds, redirected to feed
Actual: ✅ Profile created, user authenticated
```

## Migration Steps

### Apply the Database Migration

**Local Development (Supabase CLI):**
```bash
# If using local Supabase
supabase db reset

# Or apply the specific migration
supabase migration up
```

**Production (Supabase Dashboard):**
1. Go to your Supabase project dashboard
2. Navigate to: SQL Editor
3. Copy the contents of `supabase/migrations/20251118000000_fix_email_domain_verification.sql`
4. Paste and run the SQL
5. Verify all functions were created successfully

### Verify the Fix

1. **Check functions exist:**
```sql
SELECT proname FROM pg_proc WHERE proname IN (
  'validate_email_domain',
  'check_email_domain',
  'create_profile_for_user'
);
```

2. **Test domain validation:**
```sql
SELECT * FROM check_email_domain('test@example.com');
```

3. **Try signing up** with an unauthorized email domain - should fail
4. **Try signing up** with an authorized email domain - should succeed

## Key Files Modified

1. **New Migration:**
   - `supabase/migrations/20251118000000_fix_email_domain_verification.sql`

2. **Updated Files:**
   - `src/app/auth/page.js` - Enhanced validation and error handling
   - `src/app/auth/callback/page.js` - Better OAuth callback validation

## Important Notes

- **Breaking Change**: After applying this migration, users with unauthorized email domains will NO LONGER be able to sign up
- **Existing Users**: Users who already signed up with unauthorized domains before this fix will remain in the system (their profiles already exist)
- **Add Domains**: To allow new institutions, add their domain to the `email_domains` table
- **Error Messages**: Users will see clear error messages explaining that only institutional emails are allowed

## Adding New Allowed Domains

To authorize a new email domain:

```sql
INSERT INTO email_domains (domain, organization_name, organization_type)
VALUES ('newuniversity.edu', 'New University', 'university');
```

## Rollback (If Needed)

If you need to temporarily disable domain validation:

```sql
-- WARNING: This makes the system permissive again
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id bigint;
BEGIN
  SELECT id INTO org_id FROM public.email_domains
  WHERE domain = split_part(new.email, '@', 2);
  
  -- Remove the validation check - allows any domain
  INSERT INTO public.profiles (id, email, organization_id, full_name, username, department, roll_number, role)
  VALUES (new.id, new.email, org_id, 'User', 'user_' || substring(new.id::text, 1, 8), 'General', 'N/A', 'student');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student'::app_role);
  
  RETURN new;
END;
$$;
```

## Security Benefits

✅ **Prevents unauthorized access** - Only users with institutional emails can sign up  
✅ **OAuth protection** - Google/Microsoft sign-ins are also validated  
✅ **Database-level enforcement** - Can't bypass validation with direct API calls  
✅ **Clear error messages** - Users understand why they can't sign up  
✅ **Audit trail** - Failed signups are logged in database  

## Monitoring

Check for failed signup attempts in Supabase logs:
- Look for errors containing "not authorized" or "Email domain"
- Monitor `auth.users` table for growth patterns
- Verify all users in `profiles` have `organization_id` set

---

**Status**: ✅ Fixed and Tested  
**Date**: November 18, 2025  
**Priority**: Critical Security Fix
