import { useEffect } from "react";
import Lenis from "lenis";
import CursorGlow from "../components/landing/magic/CursorGlow";
import LandingNav from "../components/landing/LandingNav";
import Hero from "../components/landing/Hero";
import TrustBar from "../components/landing/TrustBar";
import WhySection from "../components/landing/WhySection";
import LanguageWorlds from "../components/landing/LanguageWorlds";
import LearningJourney from "../components/landing/LearningJourney";
import AIAssistantSection from "../components/landing/AIAssistantSection";
import StatsStrip from "../components/landing/StatsStrip";
import Testimonials from "../components/landing/Testimonials";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

/**
 * Landing — the magical Neo Learning landing page.
 * Composes all sections with Lenis smooth scrolling and a cursor glow.
 */
export default function Landing() {
  useEffect(() => {
    // Lenis smooth scroll — buttery, magical scrolling
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="landing-root min-h-screen">
      <CursorGlow />
      <LandingNav />
      <main>
        <Hero />
        <TrustBar />
        <WhySection />
        <LanguageWorlds />
        <LearningJourney />
        <AIAssistantSection />
        <StatsStrip />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}