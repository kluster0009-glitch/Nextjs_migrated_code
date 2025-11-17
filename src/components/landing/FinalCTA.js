'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const FinalCTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Ambient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-soft-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-soft-violet/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-soft-cyan/10 rounded-full border border-soft-cyan/20 backdrop-blur-sm mb-4">
            <span className="text-sm text-soft-cyan font-medium">Early Access Available</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-light leading-tight">
            <span className="block mb-2">Step Into</span>
            <span className="bg-gradient-to-r from-soft-cyan via-soft-violet to-soft-blue bg-clip-text text-transparent font-medium">
              Kluster.
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
            Join thousands of students and professors already transforming their 
            academic experience. Be part of the connected campus revolution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-soft-cyan to-soft-violet text-white font-medium px-10 py-6 text-base hover:shadow-xl hover:shadow-soft-cyan/25 transition-all duration-300 group"
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
