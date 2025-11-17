'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen immersive-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link href="/" className="text-neon-cyan underline hover:text-neon-cyan/80">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
