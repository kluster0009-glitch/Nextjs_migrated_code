import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-neon-green">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-sm font-medium uppercase tracking-wider">
                Ready to Transform
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent neon-text">
                Your Academic Journey?
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students and professors who are already building stronger 
              academic communities together in the digital universe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold px-10 py-6 text-lg hover:shadow-2xl hover:shadow-neon-purple/30 transition-all duration-300 group"
            >
              <Rocket className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Launch Your Journey
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20 px-10 py-6 text-lg glow-border hover:shadow-lg hover:shadow-neon-cyan/20 transition-all duration-300"
            >
              Explore Features
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-cyber-card/30 backdrop-blur-sm rounded-xl border border-cyber-border">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-neon-purple mb-2">Instant Access</h4>
              <p className="text-sm text-muted-foreground">
                Start connecting with your academic community in seconds
              </p>
            </div>
            
            <div className="text-center p-6 bg-cyber-card/30 backdrop-blur-sm rounded-xl border border-cyber-border">
              <div className="text-3xl mb-3">🌐</div>
              <h4 className="font-semibold text-neon-cyan mb-2">Global Network</h4>
              <p className="text-sm text-muted-foreground">
                Connect with students and professors worldwide
              </p>
            </div>
            
            <div className="text-center p-6 bg-cyber-card/30 backdrop-blur-sm rounded-xl border border-cyber-border">
              <div className="text-3xl mb-3">🎓</div>
              <h4 className="font-semibold text-neon-pink mb-2">Academic Growth</h4>
              <p className="text-sm text-muted-foreground">
                Accelerate your learning with AI-powered tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;