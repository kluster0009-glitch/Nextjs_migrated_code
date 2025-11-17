'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import logo from '@/assets/logo.svg'

const LandingHero = () => {
  return (
    <section className="relative min-h-screen immersive-bg flex items-center overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-soft-cyan/30 rounded-full float-particle"></div>
        <div className="absolute top-40 right-[15%] w-3 h-3 bg-soft-violet/30 rounded-full float-particle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-soft-blue/30 rounded-full float-particle" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 right-[25%] w-1.5 h-1.5 bg-soft-cyan/40 rounded-full float-particle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-[30%] w-2.5 h-2.5 bg-soft-violet/40 rounded-full float-particle" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Ambient blur effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-soft-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-soft-violet/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Kluster" className="h-28 md:h-32 w-auto" />
          </div>

          {/* Main headline */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
              <span className="block text-foreground">Dive into the world of</span>
              <span className="block bg-gradient-to-r from-soft-cyan via-soft-violet to-soft-blue bg-clip-text text-transparent font-medium">
                connected campuses.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Real-time communication meets intelligent community. Kluster unites students, 
              professors, and institutions in one verified digital space.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-soft-cyan to-soft-violet text-white font-medium px-8 py-6 text-base hover:shadow-lg hover:shadow-soft-cyan/20 transition-all duration-300 group"
            >
              Join the Waitlist
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-soft-cyan/30 text-soft-cyan hover:bg-soft-cyan/10 px-8 py-6 text-base subtle-border backdrop-blur-sm"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
