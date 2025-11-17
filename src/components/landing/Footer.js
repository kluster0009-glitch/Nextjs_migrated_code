'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle bg-card-bg/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © Kluster 2025
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
              <a 
                href="#about" 
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                About
              </a>
              <a 
                href="#features" 
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Features
              </a>
              <a 
                href="#contact" 
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Contact
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-border-subtle/50 pt-6">
            <div className="flex flex-wrap gap-6 justify-center text-xs text-muted-foreground">
              <Link 
                href="/privacy" 
                className="hover:text-soft-cyan transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <span className="text-border-subtle">•</span>
              <Link 
                href="/cookies" 
                className="hover:text-soft-cyan transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <span className="text-border-subtle">•</span>
              <Link 
                href="/terms" 
                className="hover:text-soft-cyan transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              <span className="text-border-subtle">•</span>
              <a 
                href="mailto:kluster0009@gmail.com" 
                className="hover:text-soft-cyan transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
