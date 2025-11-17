import React from 'react';

const StatsSection = () => {
  const stats = [
    { number: '50K+', label: 'Active Students', color: 'neon-purple' },
    { number: '125K+', label: 'Questions Answered', color: 'neon-cyan' },
    { number: '25K+', label: 'Study Materials', color: 'neon-pink' },
    { number: '500+', label: 'Campus Events', color: 'neon-green' },
  ];

  return (
    <section className="py-20 bg-cyber-darker/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-cyber-card/30 backdrop-blur-sm rounded-xl border border-cyber-border hover:border-opacity-50 transition-all duration-300 group"
            >
              <div className={`text-4xl lg:text-5xl font-bold text-${stat.color} neon-text mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;