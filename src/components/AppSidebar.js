'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Home, 
  MessageSquare, 
  Send,
  HelpCircle, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Trophy,
  Moon,
  Sun,
  Menu,
  Plus,
  Bell,
  LogOut
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { CreatePostModal } from '@/components/CreatePostModal'

const navItems = [
  { icon: MessageSquare, label: 'Cluster', path: '/cluster' },
  { icon: Send, label: 'Chat', path: '/chat' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: HelpCircle, label: 'Q&A', path: '/qa' },
  { icon: BookOpen, label: 'Library', path: '/library' },
  { icon: GraduationCap, label: 'Professor', path: '/professor' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
]

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const { signOut, user } = useAuth()
  const pathname = usePathname()
  const { open, toggleSidebar } = useSidebar()
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

  const getUserInitials = () => {
    const name = user?.profile?.full_name || user?.email || ''
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = async () => {
    await signOut()
  }

  const isActive = (path) => pathname === path

  return (
    <>
      <CreatePostModal 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
      />
      <Sidebar collapsible="icon" className={`${open ? 'w-60' : 'w-16'} transition-all duration-300 border-r border-cyber-border bg-cyber-darker/95 backdrop-blur-xl`}>
      {/* Header with Logo and Hamburger */}
      <SidebarHeader className="border-b border-cyber-border p-2">
        <div className={`flex items-center gap-0 ${open ? 'justify-between' : 'justify-center'}`}>
          {open && (
            <Link href="/" className="flex items-center gap-2 flex-1">
              <Image 
                src="/logo.svg" 
                alt="Kluster Logo" 
                width={28} 
                height={28}
                className="flex-shrink-0"
              />
              <span className="text-lg font-semibold font-space bg-gradient-to-r from-soft-cyan to-soft-violet bg-clip-text text-transparent">
                KLUSTER
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground p-2"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Create Post Button */}
              <SidebarMenuItem>
                <Button 
                  onClick={() => setIsCreatePostOpen(true)}
                  className={`${open ? 'w-full' : 'w-10 h-10 p-0'} bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold`}
                >
                  <Plus className="w-4 h-4" />
                  {open && <span className="ml-2">Create Post</span>}
                </Button>
              </SidebarMenuItem>

              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      ${isActive(item.path)
                        ? 'bg-neon-cyan/20 text-neon-cyan border-l-2 border-neon-cyan'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                      transition-all duration-200
                    `}
                  >
                    <Link href={item.path} className="flex items-center gap-4 px-3 py-4">
                      <item.icon className="w-5 h-5" />
                      {open && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t border-cyber-border p-4">
        <div className="space-y-3">
          {/* User Profile Section */}
          {open ? (
            <div className="space-y-3">
              <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.profile?.profile_picture} />
                  <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </Link>
              <Separator className="bg-cyber-border" />
            </div>
          ) : (
            <Link href="/profile" className="flex justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profile?.profile_picture} />
                <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            className={`${open ? 'w-full justify-start' : 'w-full justify-center'} text-muted-foreground hover:text-foreground`}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {open && <span className="ml-3">Change Theme</span>}
          </Button>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={`${open ? 'w-full justify-start' : 'w-full justify-center'} text-destructive hover:text-destructive hover:bg-destructive/10`}
          >
            <LogOut className="w-4 h-4" />
            {open && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
    </>
  )
}
