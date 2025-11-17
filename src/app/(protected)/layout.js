'use client'

import { useAuth } from '@/lib/auth-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center animate-pulse">
          <span className="text-black font-bold text-xl">K</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Middleware will handle redirect
  }

  return (
    <SidebarProvider style={{
      '--sidebar-width': '15rem',
      '--sidebar-width-icon': '4rem',
    }}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
