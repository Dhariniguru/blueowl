import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ArrowRight, Star, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import HeroArt from "./art/HeroArt";
import { Aurora, StarField, Fireflies, Clouds, Butterflies, FloatingBooks } from "./magic/Atmosphere";

export default function Hero() {
  const { dark } = useTheme();
  const { user } = useAuth();

  return (
    <section id="top" className="relative min-h-screen flex items-center pt-16 pb-8 overflow-hidden">
      <Aurora />
      {dark ? (
        <>
          <StarField count={80} />
          <Fireflies count={20} />
        </>
      ) : (
        <>
          <Clouds count={5} />
          <Butterflies count={5} />
        </>
      )}
      <FloatingBooks count={4} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            <span className="kicker mb-5">
              <Sparkles className="w-4 h-4" />
              AI-powered language adventures
            </span>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] leading-[1.02] tracking-tight text-mystic-ink mb-6 text-balance">
              Learn languages.
              <br />
              <span className="text-gradient-accent">Live adventures.</span>
            </h1>

            <p className="text-xl sm:text-xl md:text-2xl text-mystic-ink-soft max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Step into a magical world where every language is its own adventure.
              AI-powered lessons, interactive practice, and a learning path that
              adapts to you — designed for students, professionals, and lifelong learners.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to={user ? "/dashboard" : "/register"} className="btn-magic">
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#assistant"
                onClick={(e) => { e.preventDefault(); document.querySelector("#assistant")?.scrollIntoView({ behavior: "smooth" }); }}
                className="btn-magic-ghost"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </a>
            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {["#8B5CF6", "#FF8FB1", "#FFC857", "#4CAF7D", "#9DADF0"].map((c, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-white text-sm font-bold hover:scale-110 transition-transform"
                    style={{ background: c, borderColor: "var(--mg-bg)" }}
                  >
                    {["A", "M", "K", "R", "S"][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ color: "var(--mg-gold)", fill: "var(--mg-gold)" }} />
                  ))}
                </div>
                <p className="text-sm text-mystic-ink-soft">
                  Loved by <span className="font-semibold text-mystic-ink">10,000+</span> learners
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative parallax-medium"
          >
            <div
              className="absolute inset-0 rounded-[2.5rem] blur-3xl opacity-40"
              style={{ background: "radial-gradient(circle, var(--mg-glow), transparent 70%)" }}
            />
            <HeroArt className="w-full h-auto relative drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-mystic-border flex items-start justify-center p-1.5 animate-bob">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--mg-accent)" }}
          />
        </div>
      </motion.div>
    </section>
  );
}