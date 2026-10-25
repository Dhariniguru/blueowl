import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./magic/Reveal";
import CTAArt from "./art/CTAArt";
import { useAuth } from "../../context/AuthContext";
import { Aurora, StarField, Fireflies, Clouds, Butterflies } from "./magic/Atmosphere";
import { useTheme } from "../../context/ThemeContext";

export default function FinalCTA() {
  const { user } = useAuth();
  const { dark } = useTheme();

  return (
    <section id="cta" className="relative py-10 md:py-12 overflow-hidden">
      <Aurora />
      {dark ? (
        <>
          <StarField count={50} />
          <Fireflies count={15} />
        </>
      ) : (
        <>
          <Clouds count={4} />
          <Butterflies count={4} />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
        <Reveal>
          <div className="relative mb-6">
            <div
              className="absolute inset-0 rounded-[2rem] blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, var(--mg-glow), transparent 70%)" }}
            />
            <CTAArt className="w-full h-auto relative max-w-2xl mx-auto parallax-slow" />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <span className="kicker mb-4">
            <Sparkles className="w-4 h-4" />
            Start Your Adventure
          </span>
          <h2 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[88px] text-mystic-ink mb-5 text-balance">
            Ready for your next <span className="text-gradient-accent">adventure?</span>
          </h2>
          <p className="text-xl md:text-2xl text-mystic-ink-soft max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of learners who've turned language learning into a magical journey.
            Your first lesson is free — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link to={user ? "/dashboard" : "/register"} className="btn-magic" style={{ padding: "1rem 2.5rem", fontSize: "1.125rem" }}>
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-magic-ghost"
            >
              Back to top
            </a>
          </div>

          <p className="text-sm text-mystic-ink-soft mt-5">
            Free forever • No credit card • Cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}