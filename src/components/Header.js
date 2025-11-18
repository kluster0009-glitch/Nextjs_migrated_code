'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Moon,
  Sun
} from 'lucide-react'

const Header = () => {
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

            {/* Sign In Button */}
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
