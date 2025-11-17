import React from 'react';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Globe 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Globe,
      title: 'College & Global Feeds',
      description: 'Stay connected with your college community and explore discussions from students worldwide.',
      color: 'neon-purple',
      gradient: 'from-neon-purple to-neon-pink',
    },
    {
      icon: MessageSquare,
      title: 'Q&A Community',
      description: 'Ask questions, share knowledge, and get help from peers and professors across all subjects.',
      color: 'neon-cyan',
      gradient: 'from-neon-cyan to-neon-green',
    },
    {
      icon: Users,
      title: 'Study Groups & Chat',
      description: 'Join subject-specific groups and collaborate with classmates in real-time discussions.',
      color: 'neon-pink',
      gradient: 'from-neon-pink to-neon-purple',
    },
    {
      icon: BookOpen,
      title: 'Shared Notes Library',
      description: 'Access and contribute to a vast collection of study materials and course notes.',
      color: 'neon-green',
      gradient: 'from-neon-green to-neon-cyan',
    },
    {
      icon: GraduationCap,
      title: 'Professor Corner',
      description: 'Connect with faculty members and access exclusive academic resources and insights.',
      color: 'neon-purple',
      gradient: 'from-neon-purple to-neon-cyan',
    },
    {
      icon: Calendar,
      title: 'Events & Clubs',
      description: 'Discover campus events, join clubs, and participate in academic and social activities.',
      color: 'neon-cyan',
      gradient: 'from-neon-cyan to-neon-pink',
    },
  ];

  return (
    <section className="py-20 cyber-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-neon-cyan mb-6">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
            <span className="text-sm font-medium uppercase tracking-wider">
              Advanced Features
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-foreground">for Academic Success</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover powerful tools and features designed to enhance your learning experience 
            and connect you with a vibrant academic community across the digital frontier.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 bg-cyber-card/50 backdrop-blur-sm rounded-xl border border-cyber-border hover:border-opacity-60 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-black" />
                </div>
                <h3 className={`text-xl font-semibold text-${feature.color} mb-4 group-hover:neon-text transition-all duration-300`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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

export default FeaturesSection;