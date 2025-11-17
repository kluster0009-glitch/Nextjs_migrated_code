# Component Migration Helper Script

This script helps identify which components need 'use client' directive.

## Components that MUST have 'use client':

### Pages (already created with 'use client')
- ✅ src/app/page.jsx
- ✅ src/app/(protected)/feed/page.jsx
- ✅ src/app/(protected)/chat/page.jsx
- ✅ src/app/(protected)/profile/page.jsx
- ✅ src/app/(protected)/settings/page.jsx
- ✅ src/app/(protected)/qa/page.jsx
- ✅ src/app/(protected)/events/page.jsx
- ✅ src/app/(protected)/library/page.jsx
- ✅ src/app/(protected)/professor/page.jsx
- ✅ src/app/(protected)/leaderboard/page.jsx
- ✅ src/app/(protected)/notifications/page.jsx
- ✅ src/app/auth/page.jsx
- ✅ src/app/auth/callback/page.jsx

### Layouts & Providers
- ✅ src/app/providers.jsx
- ✅ src/app/(protected)/layout.jsx

### Context & Auth
- ✅ src/lib/auth-context.jsx

### Components to Update

Based on your original codebase, these components need updates:

#### Components using React Router (CRITICAL - MUST UPDATE)
1. **src/components/AppSidebar.tsx**
   - Uses: `useLocation`, `Link` from react-router-dom
   - Change to: `usePathname` from 'next/navigation', `Link` from 'next/link'
   - Add: `'use client'` directive

2. **src/components/Header.tsx**
   - Uses: `useLocation`, `Link` from react-router-dom
   - Change to: `usePathname` from 'next/navigation', `Link` from 'next/link'
   - Add: `'use client'` directive

3. **src/components/ProtectedRoute.tsx**
   - Uses: `Navigate` from react-router-dom
   - Status: No longer needed (middleware handles protection)
   - Action: Can be deleted or archived

#### Components using Hooks (Add 'use client')
4. **src/components/OnboardingModal.tsx**
   - Uses: `useState`, `useEffect`
   - Add: `'use client'` directive

5. **src/components/CreatePostModal.tsx**
   - Uses: `useState`, event handlers
   - Add: `'use client'` directive

6. **src/components/UserProfileModal.tsx**
   - Uses: `useState`, event handlers
   - Add: `'use client'` directive

7. **src/components/SplashScreen.tsx**
   - Uses: `useState`, `useEffect`
   - Add: `'use client'` directive

8. **src/components/NoticeCarousel.tsx**
   - Uses: `useState`, embla-carousel hooks
   - Add: `'use client'` directive

9. **src/components/ChatMessage.tsx**
   - Uses: event handlers, state
   - Add: `'use client'` directive

10. **src/components/ThemeTransition.tsx**
    - Uses: `useState`, `useEffect`
    - Add: `'use client'` directive

#### Landing Page Components (Add 'use client' if interactive)
11. **src/components/landing/LandingPage.jsx** - ✅ Already created
12. **src/components/landing/LandingHero.tsx** - Check for interactivity
13. **src/components/landing/ConnectionsSection.tsx** - Check for interactivity
14. **src/components/landing/IntelligenceSection.tsx** - Check for interactivity
15. **src/components/landing/VerifiedSection.tsx** - Check for interactivity
16. **src/components/landing/FinalCTA.tsx** - Check for interactivity
17. **src/components/landing/Footer.tsx** - Check for interactivity

#### UI Components (shadcn/ui)
Most shadcn/ui components in `src/components/ui/` already work correctly.
Just ensure they're imported properly.

## Import Changes Required

### Before (React Router):
```tsx
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AUTH_ENABLED } from '@/config'
import { supabase } from '@/integrations/supabase/client'
```

### After (Next.js):
```jsx
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AUTH_ENABLED } from '@/lib/config'
import { createClient } from '@/lib/supabase/client'
```

## Quick Fix Commands

### Add 'use client' to a file:
```bash
# PowerShell
$content = Get-Content "path/to/file.tsx" -Raw
"'use client'`n`n$content" | Set-Content "path/to/file.tsx"
```

### Search for files using react-router:
```bash
# PowerShell
Get-ChildItem -Path src -Recurse -Include *.tsx,*.jsx | Select-String -Pattern "react-router"
```

### Search for files using old imports:
```bash
# PowerShell
Get-ChildItem -Path src -Recurse -Include *.tsx,*.jsx | Select-String -Pattern "@/contexts/AuthContext|@/config|@/integrations/supabase"
```

## Step-by-Step Migration Process

1. **Backup your components:**
   ```bash
   cp -r src/components src/components.backup
   ```

2. **Update AppSidebar and Header first** (most critical):
   - Add `'use client'`
   - Replace react-router imports
   - Test navigation

3. **Update modal components:**
   - Add `'use client'`
   - Update imports if they use auth/config

4. **Update interactive components:**
   - Add `'use client'` to components with state/effects
   - Test each one

5. **Verify all pages work:**
   - Test each route
   - Check auth flow
   - Verify data loading

## Testing Checklist

- [ ] Landing page loads
- [ ] Auth page works
- [ ] OAuth callback works
- [ ] Protected routes redirect when not logged in
- [ ] Feed page loads with posts
- [ ] Sidebar navigation works
- [ ] Create post modal works
- [ ] Theme switching works
- [ ] Profile page works
- [ ] All protected routes accessible when logged in

## Common Patterns

### Pattern 1: Basic Client Component
```jsx
'use client'

import { useState } from 'react'

export default function MyComponent() {
  const [state, setState] = useState(false)
  return <div>...</div>
}
```

### Pattern 2: Component with Navigation
```jsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function MyComponent() {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleClick = () => {
    router.push('/some-route')
  }
  
  return <Link href="/route">Go</Link>
}
```

### Pattern 3: Component with Auth
```jsx
'use client'

import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const { user } = useAuth()
  const supabase = createClient()
  
  // Use user and supabase...
}
```

## Need Help?

See MIGRATION-GUIDE.md for comprehensive documentation.
