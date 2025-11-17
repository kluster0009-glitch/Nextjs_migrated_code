'use client'

import { Shield, Users, Sparkles } from 'lucide-react'

const VerifiedSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card-bg/30 via-transparent to-card-bg/30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              <span className="bg-gradient-to-r from-soft-cyan via-soft-violet to-soft-blue bg-clip-text text-transparent font-medium">
                Verified. Connected. Empowered.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              Join a trusted community where every member is authenticated through their college 
              credentials, ensuring genuine academic connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-soft-cyan/20 to-soft-cyan/5 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-soft-cyan" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium">Verified Authentication</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                College email verification ensures only real students and faculty join your community.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-soft-violet/20 to-soft-violet/5 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-soft-violet" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium">Real Connections</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Build meaningful relationships with peers who share your academic journey.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-soft-blue/20 to-soft-blue/5 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-soft-blue" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium">Empowered Learning</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Access resources, collaborate on projects, and grow together in a safe digital space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VerifiedSection
