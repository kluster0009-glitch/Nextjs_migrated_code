'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  MessageSquare, 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Trophy,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react'

const Header = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoFlipping, setIsLogoFlipping] = useState(false)
  const [isThemeChanging, setIsThemeChanging] = useState(false)

  const { theme, setTheme } = useTheme()
  
  const handleThemeToggle = () => {
    setIsLogoFlipping(true)
    setIsThemeChanging(true)
    setTheme(theme === 'dark' ? 'light' : 'dark')
    setTimeout(() => {
      setIsLogoFlipping(false)
      setIsThemeChanging(false)
    }, 800)
  }
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Cluster', path: '/feed' },
    { icon: HelpCircle, label: 'Q&A', path: '/qa' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: BookOpen, label: 'Library', path: '/library' },
    { icon: GraduationCap, label: 'Professor', path: '/professor' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/80 backdrop-blur-xl border-b border-cyber-border">
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5">
            <img 
              src="/logo.svg" 
              alt="Kluster" 
              className={`h-12 w-auto -mr-1 transition-transform duration-600 ${isLogoFlipping ? 'animate-flip' : ''}`}
            />
            <span className="text-2xl font-semibold font-space bg-gradient-to-r from-soft-cyan to-soft-violet bg-clip-text text-transparent">
              KLUSTER
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.filter(item => item.label !== 'Home').map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link key={index} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`
                      ${isActive 
                        ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/30' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                      transition-all duration-200 h-8
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground h-8 relative overflow-hidden"
              onClick={handleThemeToggle}
            >
              <AnimatePresence>
                {isThemeChanging && (
                  <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '100%', opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-soft-cyan/20 to-transparent"
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </span>
            </Button>

            {/* Sign In/Sign Up Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-8"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 h-8"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-muted-foreground hover:text-foreground h-8"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-cyber-darker/95 backdrop-blur-xl border-b border-cyber-border">
          <div className="container mx-auto px-6 py-4">
            <nav className="space-y-2">
              {navItems.filter(item => item.label !== 'Home').map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <Link 
                    key={index} 
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`
                        w-full justify-start
                        ${isActive 
                          ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/30' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }
                        transition-all duration-200
                      `}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              
              {/* Mobile Actions */}
              <div className="pt-4 border-t border-cyber-border space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground relative overflow-hidden"
                  onClick={handleThemeToggle}
                >
                  <AnimatePresence>
                    {isThemeChanging && (
                      <motion.div
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: '100%', opacity: [0, 1, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-soft-cyan/20 to-transparent"
                      />
                    )}
                  </AnimatePresence>
                  {theme === 'dark' ? <Moon className="w-4 h-4 mr-3 relative z-10" /> : <Sun className="w-4 h-4 mr-3 relative z-10" />}
                  <span className="relative z-10">Change Theme</span>
                </Button>
                
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                </Link>
                
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
