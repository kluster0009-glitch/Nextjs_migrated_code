'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

export default function ProtectedLayout({ children }) {
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
