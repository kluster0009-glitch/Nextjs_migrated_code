import React from 'react';
import { MessageSquare, FileText, Users } from 'lucide-react';

const ConnectionsSection = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Real-Time Chat',
      description: 'Connect instantly with classmates, study groups, and professors through seamless messaging.'
    },
    {
      icon: FileText,
      title: 'Smart Feed',
      description: 'Stay updated with announcements, events, and academic content tailored to your interests.'
    },
    {
      icon: Users,
      title: 'Collaboration Spaces',
      description: 'Work together on projects, share resources, and build meaningful academic relationships.'
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card-bg/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            One Platform.{' '}
            <span className="bg-gradient-to-r from-soft-cyan to-soft-violet bg-clip-text text-transparent font-medium">
              Infinite Connections.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Kluster seamlessly merges communication, content, and collaboration into a unified experience 
            designed for the modern academic environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border-subtle hover:border-soft-cyan/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-soft-cyan/20 to-soft-violet/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-soft-cyan" />
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConnectionsSection;
