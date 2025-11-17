# Next.js 15 Project - Quick Start

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account

## Installation

1. **Install dependencies:**
   ```bash
   mv package.json.nextjs package.json
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   NEXT_PUBLIC_BACKEND_URL=https://kluster-backend.vercel.app
   NEXT_PUBLIC_AUTH_ENABLED=true
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utilities, contexts, configs
└── hooks/           # Custom React hooks
```

## Key Technologies

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **NextUI** - Additional UI components
- **Supabase** - Backend & Authentication
- **React Query** - Data fetching
- **React Compiler** - Automatic optimization

## Migration Notes

This project was migrated from Vite + React Router to Next.js 15.
See `MIGRATION-GUIDE.md` for detailed migration information.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## Need Help?

- See [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) for detailed docs
- Check [Next.js Docs](https://nextjs.org/docs)
- Review [Supabase Docs](https://supabase.com/docs)
