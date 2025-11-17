'use client'

import { Twitter, Linkedin, Github } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle bg-card-bg/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © Kluster 2025
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8">
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
      </div>
    </footer>
  )
}

export default Footer
