'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import SplashScreen from '@/components/SplashScreen'
import LandingHero from '@/components/landing/LandingHero'
import ConnectionsSection from '@/components/landing/ConnectionsSection'
import IntelligenceSection from '@/components/landing/IntelligenceSection'
import VerifiedSection from '@/components/landing/VerifiedSection'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true)
  const [hasVisited, setHasVisited] = useState(false)
  

  useEffect(() => {
 

    const visited = sessionStorage.getItem('hasVisitedKluster')
    if (visited) {
      setShowSplash(false)
      setHasVisited(true)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    sessionStorage.setItem('hasVisitedKluster', 'true')
  }

  if (showSplash && !hasVisited) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="min-h-screen immersive-bg">
      <Header />
      <main>
        <LandingHero />
        <ConnectionsSection />
        <IntelligenceSection />
        <VerifiedSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
