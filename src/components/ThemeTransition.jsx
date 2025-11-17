import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeTransition = () => {
  const { theme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousTheme, setPreviousTheme] = useState(undefined);

  useEffect(() => {
    // Only animate if we have a previous theme and it's different from current
    if (previousTheme && theme !== previousTheme) {
      setIsAnimating(true);
      // Reset animation after completion
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPreviousTheme(theme);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!previousTheme) {
      // Initialize previous theme on first render
      setPreviousTheme(theme);
    }
  }, [theme]);

  const isDarkToLight = previousTheme === 'dark' && theme === 'light';
  
  // Colors for the flip animation
  const bgColors = isDarkToLight
    ? {
        from: 'hsl(220, 40%, 8%)', // dark navy
        to: 'hsl(210, 30%, 97%)' // light background
      }
    : {
        from: 'hsl(210, 30%, 97%)', // light background
        to: 'hsl(220, 40%, 8%)' // dark navy
      };

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key={`${previousTheme}-${theme}`}
          initial={{ 
            rotateY: 0,
            backgroundColor: bgColors.from
          }}
          animate={{ 
            rotateY: 180,
            backgroundColor: bgColors.to
          }}
          exit={{ opacity: 0 }}
          transition={{
            rotateY: {
              duration: 1,
              ease: [0.455, 0.03, 0.515, 0.955] // easeInOutQuad
            },
            backgroundColor: {
              duration: 1,
              ease: [0.455, 0.03, 0.515, 0.955]
            },
            opacity: {
              duration: 0.2,
              delay: 0.8
            }
          }}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
};
