import React from 'react';

const SplashScreen = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-cyber-dark dark:to-cyber-dark/90 animate-fade-in">
      <div className="text-center space-y-4 animate-scale-in">
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Kluster" className="h-32 w-auto animate-pulse" />
        </div>
        <h1 className="text-7xl md:text-9xl font-bold text-blue-500 dark:text-neon-cyan">
          KLUSTER
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-muted-foreground">
          Get ready to dive into a whole new world of KLUSTER
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
