import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Reveal from "./magic/Reveal";
import FeatureArt from "./art/FeatureArt";

const FEATURES = [
  { feature: "ai", title: "AI Lessons", body: "Personalized lessons powered by AI that adapt to your level, pace, and learning style — so every session feels made just for you." },
  { feature: "practice", title: "Interactive Practice", body: "Speak, listen, read, and write with real-time feedback. Our AI companion guides you through every word with patience and encouragement." },
  { feature: "progress", title: "Real Progress", body: "Track your journey with beautiful progress visualizations. See how far you've come and where your next adventure leads." },
  { feature: "achievements", title: "Achievements", body: "Earn XP, unlock badges, and build streaks that keep you motivated. Every milestone is a celebration of your growth." },
];

export default function WhySection() {
  return (
    <section className="relative py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Reveal className="text-center max-w-3xl mx-auto mb-10">
          <span className="kicker mb-4">
            <Sparkles className="w-4 h-4" />
            Why Neo Learning
          </span>
          <h2 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-mystic-ink mb-4 text-balance">
            Learning that feels like <span className="text-gradient-accent">magic</span>
          </h2>
          <p className="text-xl md:text-2xl text-mystic-ink-soft">
            Four pillars that make every lesson an adventure worth taking.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-magic p-6 h-full flex flex-col items-center text-center group relative overflow-hidden"
                style={{ borderRadius: 28 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 0%, var(--mg-glow), transparent 60%)" }}
                />
                <div
                  className="relative w-28 h-28 mb-5 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "radial-gradient(circle, var(--mg-glow), transparent 70%)" }}
                >
                  <FeatureArt feature={f.feature} className="w-full h-full" />
                </div>
                <h3 className="font-display font-bold text-2xl text-mystic-ink mb-2">{f.title}</h3>
                <p className="text-lg text-mystic-ink-soft leading-relaxed">{f.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}