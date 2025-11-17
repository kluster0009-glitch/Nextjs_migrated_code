# React to Next.js 15 Migration Guide

## 🎯 Migration Overview

This project has been converted from **Vite + React** to **Next.js 15** with the App Router. All modern best practices have been implemented including React Compiler, ESLint, and enhanced Supabase integration.

---

## 📁 New Project Structure

```
fciikv-clone-complete-73/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (protected)/              # Protected route group
│   │   │   ├── layout.jsx            # Sidebar layout for auth pages
│   │   │   ├── feed/page.jsx         # Feed page
│   │   │   ├── chat/page.jsx         # Chat page
│   │   │   ├── profile/page.jsx      # Profile page
│   │   │   ├── settings/page.jsx     # Settings page
│   │   │   ├── qa/page.jsx           # Q&A page
│   │   │   ├── events/page.jsx       # Events page
│   │   │   ├── library/page.jsx      # Library page
│   │   │   ├── professor/page.jsx    # Professor page
│   │   │   ├── leaderboard/page.jsx  # Leaderboard page
│   │   │   └── notifications/page.jsx # Notifications page
│   │   ├── auth/
│   │   │   ├── page.jsx              # Auth page
│   │   │   └── callback/page.jsx     # OAuth callback
│   │   ├── layout.jsx                # Root layout
│   │   ├── page.jsx                  # Home/Landing page
│   │   ├── providers.jsx             # Client-side providers
│   │   └── globals.css               # Global styles
│   ├── components/                   # UI components (from old src/)
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── landing/                  # Landing page components
│   │   │   └── LandingPage.jsx       # Main landing page
│   │   ├── AppSidebar.tsx            # Sidebar component
│   │   └── ...                       # Other components
│   ├── lib/
│   │   ├── auth-context.jsx          # Auth context for Next.js
│   │   ├── config.js                 # App configuration
│   │   ├── utils.ts                  # Utility functions
│   │   └── supabase/
│   │       ├── client.js             # Browser Supabase client
│   │       ├── server.js             # Server Supabase client
│   │       └── middleware.js         # Supabase middleware helper
│   ├── hooks/                        # Custom React hooks
│   └── contexts/                     # (Legacy - moved to lib/)
├── middleware.js                     # Next.js middleware (auth)
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS config
├── jsconfig.json                     # JavaScript config
├── .eslintrc.json                    # ESLint configuration
├── postcss.config.js                 # PostCSS config
├── package.json.nextjs               # New package.json for Next.js
└── .env.local.example                # Environment variables template
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Remove old node_modules and lock files
rm -rf node_modules bun.lockb package-lock.json

# Rename the new package.json
mv package.json.nextjs package.json

# Install dependencies
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your Supabase credentials
```

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=https://kluster-backend.vercel.app
NEXT_PUBLIC_AUTH_ENABLED=true
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 🔄 Key Changes from React to Next.js

### Routing

**Before (React Router):**
```jsx
import { useNavigate, Link, useLocation } from 'react-router-dom'

const navigate = useNavigate()
navigate('/feed')

<Link to="/profile">Profile</Link>
```

**After (Next.js):**
```jsx
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const router = useRouter()
router.push('/feed')

<Link href="/profile">Profile</Link>
```

### Component Types

All interactive components need `'use client'` directive:

```jsx
'use client'

import { useState } from 'react'

export default function MyComponent() {
  const [state, setState] = useState(false)
  // ...
}
```

### Supabase Client

**Before:**
```jsx
import { supabase } from '@/integrations/supabase/client'
```

**After (Client Component):**
```jsx
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

**After (Server Component):**
```jsx
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
```

### Authentication Context

**Before:**
```jsx
import { useAuth } from '@/contexts/AuthContext'
```

**After:**
```jsx
import { useAuth } from '@/lib/auth-context'
```

### Configuration

**Before:**
```jsx
import { AUTH_ENABLED } from '@/config'
```

**After:**
```jsx
import { AUTH_ENABLED } from '@/lib/config'
// or use directly:
process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'
```

---

## 📦 New Features

### 1. React Compiler

Automatic optimization of React components enabled in `next.config.js`:

```js
experimental: {
  reactCompiler: true,
}
```

### 2. Route Groups

Protected routes use `(protected)` group for shared layout with sidebar:

```
app/
  (protected)/        # Routes here share the sidebar layout
    layout.jsx        # Contains AppSidebar
    feed/page.jsx
    chat/page.jsx
```

### 3. Middleware Authentication

Automatic session refresh and protection in `middleware.js`:

- Refreshes Supabase session on every request
- Redirects unauthenticated users to `/auth`
- Runs on all routes except static files

### 4. Server Components

Landing page and static content can use Server Components for better performance.

### 5. Image Optimization

Use Next.js Image component:

```jsx
import Image from 'next/image'

<Image 
  src="/path/to/image.jpg" 
  alt="Description"
  width={500}
  height={300}
/>
```

---

## 🔧 Component Migration Checklist

For each component you migrate from `src/pages/*.tsx` to `src/app/*/page.jsx`:

- [ ] Add `'use client'` if it uses hooks or state
- [ ] Replace `react-router-dom` imports with `next/navigation`
- [ ] Change `useNavigate()` to `useRouter()`
- [ ] Change `<Link to="...">` to `<Link href="...">`
- [ ] Change `useLocation()` to `usePathname()`
- [ ] Update Supabase imports to use `@/lib/supabase/client`
- [ ] Update auth imports to use `@/lib/auth-context`
- [ ] Update config imports to use `@/lib/config`
- [ ] Convert `.tsx` to `.jsx` (or keep as `.tsx` if using TypeScript)
- [ ] Test the page in development

---

## 🎨 UI Libraries

### shadcn/ui

Already configured and working. All components in `src/components/ui/` work as-is.

### NextUI / HeroUI

Installed and configured in `tailwind.config.js`. To use:

```jsx
import { Button } from '@nextui-org/react'

<Button color="primary">Click me</Button>
```

---

## 📝 Migration Status

### ✅ Completed

- [x] Next.js 15 project setup
- [x] App Router structure
- [x] Tailwind CSS configuration
- [x] ESLint configuration
- [x] React Compiler enabled
- [x] Supabase client/server setup
- [x] Authentication context
- [x] Middleware for protected routes
- [x] React Query providers
- [x] Theme provider (next-themes)
- [x] Global styles (globals.css)
- [x] Feed page (fully migrated)
- [x] Route structure for all pages

### 🚧 To Complete

The following pages need their full logic migrated from `src/pages/*.tsx`:

- [ ] Chat page - Copy logic from `src/pages/Chat.tsx`
- [ ] Profile page - Copy logic from `src/pages/Profile.tsx`
- [ ] Settings page - Copy logic from `src/pages/Settings.tsx`
- [ ] Q&A page - Copy logic from `src/pages/QA.tsx`
- [ ] Events page - Copy logic from `src/pages/Events.tsx`
- [ ] Library page - Copy logic from `src/pages/Library.tsx`
- [ ] Professor page - Copy logic from `src/pages/Professor.tsx`
- [ ] Leaderboard page - Copy logic from `src/pages/Leaderboard.tsx`
- [ ] Notifications page - Copy logic from `src/pages/Notifications.tsx`
- [ ] Auth page - Copy logic from `src/pages/Auth.tsx`

### Components Migration

Most components can stay in `src/components/` and be imported as-is. You only need to:

1. **Add `'use client'` directive** to components that use:
   - `useState`, `useEffect`, `useContext`
   - Event handlers (`onClick`, `onChange`, etc.)
   - Browser APIs
   - Router hooks

2. **Update imports** in components that use:
   - React Router → Next.js navigation
   - `@/contexts/AuthContext` → `@/lib/auth-context`
   - `@/config` → `@/lib/config`

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot use client-side hooks in Server Component"

**Solution:** Add `'use client'` at the top of the file.

### Issue: "useNavigate is not a function"

**Solution:** Replace with Next.js router:
```jsx
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/path')
```

### Issue: "Module not found: Can't resolve '@/contexts/AuthContext'"

**Solution:** Update import:
```jsx
import { useAuth } from '@/lib/auth-context'
```

### Issue: Supabase session not persisting

**Solution:** Ensure middleware is properly configured and running.

### Issue: Images not loading

**Solution:** Use Next.js Image component or add domains to `next.config.js`:
```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.supabase.co',
    },
  ],
}
```

---

## 📚 Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextUI](https://nextui.org/)
- [React Compiler](https://react.dev/learn/react-compiler)

---

## 🎯 Next Steps

1. **Test the current setup:**
   ```bash
   npm run dev
   ```

2. **Migrate remaining pages:**
   - Copy logic from `src/pages/*.tsx` files
   - Paste into corresponding `src/app/*/page.jsx` files
   - Update imports and hooks as per the checklist

3. **Update components:**
   - Add `'use client'` to interactive components
   - Update router-related imports
   - Test each component

4. **Deploy:**
   ```bash
   npm run build
   # Deploy to Vercel or your preferred platform
   ```

---

## 💡 Pro Tips

1. **Use Server Components when possible** - Better performance
2. **Keep client components small** - Only make interactive parts client-side
3. **Use React Query for data fetching** - Already set up in providers
4. **Leverage middleware** - Handles auth automatically
5. **Use Next.js Image** - Automatic optimization
6. **Enable React Compiler** - Already configured for automatic optimization

---

## 🤝 Support

If you encounter issues during migration:

1. Check this guide first
2. Review Next.js documentation
3. Check the console for specific error messages
4. Ensure all environment variables are set correctly

---

**Happy coding! 🚀**
