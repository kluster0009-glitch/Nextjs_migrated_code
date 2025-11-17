import React from 'react';
import { Brain, FileSearch, Calendar } from 'lucide-react';

const IntelligenceSection = () => {
  const aiFeatures = [
    {
      icon: Brain,
      title: 'Smart Summarizer',
      description: 'AI-powered summaries of lectures, discussions, and documents to help you learn faster.'
    },
    {
      icon: FileSearch,
      title: 'Note Extractor',
      description: 'Automatically extract and organize key points from shared materials and conversations.'
    },
    {
      icon: Calendar,
      title: 'Auto Event Sync',
      description: 'Never miss a deadline or event with intelligent calendar integration and reminders.'
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-soft-violet/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Built with{' '}
              <span className="bg-gradient-to-r from-soft-violet to-soft-blue bg-clip-text text-transparent font-medium">
                Intelligence.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              Powered by advanced AI to enhance your learning experience and keep you 
              focused on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="relative p-8 bg-gradient-to-br from-card-bg to-muted/20 backdrop-blur-sm rounded-2xl border border-border-subtle overflow-hidden group hover:border-soft-violet/30 transition-all duration-300"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-soft-violet/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-soft-violet/20 to-soft-blue/20 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-soft-violet" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceSection;
