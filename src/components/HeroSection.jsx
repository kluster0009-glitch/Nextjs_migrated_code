import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen cyber-bg flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 border border-neon-purple/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 border border-neon-cyan/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 border border-neon-pink/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 border border-neon-purple/10 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-neon-cyan">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                <span className="text-sm font-medium uppercase tracking-wider">
                  Next-Gen Learning Platform
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent neon-text">
                  Connect.
                </span>
                <br />
                <span className="bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent neon-text">
                  Learn.
                </span>
                <br />
                <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent neon-text">
                  Evolve.
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Join the ultimate academic community where students and professors collaborate, 
                share knowledge, and build lasting connections across the digital universe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold px-8 py-6 text-lg hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Initialize Connection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 px-8 py-6 text-lg glow-border"
              >
                Explore Network
              </Button>
            </div>
          </div>

          {/* Right side - Feature Cards */}
          <div className="space-y-6">
            <div className="p-6 bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border glow-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold text-neon-green">Academic Excellence</h3>
              </div>
              <p className="text-muted-foreground">
                Enhance your learning with peer collaboration and expert guidance in our advanced digital ecosystem.
              </p>
            </div>

            <div className="p-6 bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border glow-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-neon-purple">Real-time Collaboration</h3>
              </div>
              <p className="text-muted-foreground">
                Connect instantly with study groups and academic communities through our quantum-speed network.
              </p>
            </div>

            <div className="p-6 bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border glow-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-green rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-neon-cyan">AI-Powered Learning</h3>
              </div>
              <p className="text-muted-foreground">
                Experience personalized learning paths powered by advanced algorithms and machine intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;