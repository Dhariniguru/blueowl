import { motion } from "framer-motion";
import { Compass, BookOpen, Award } from "lucide-react";
import Reveal from "./magic/Reveal";
import JourneyArt from "./art/JourneyArt";

const STEPS = [
  {
    step: "explore",
    num: "01",
    icon: Compass,
    title: "Explore",
    body: "Discover your starting level with a magical placement quest. Choose your language world and set off on your adventure with a personalized map.",
  },
  {
    step: "learn",
    num: "02",
    icon: BookOpen,
    title: "Learn",
    body: "Dive into AI-powered lessons that adapt to you. Practice with your AI companion, get instant feedback, and watch your skills grow with every session.",
  },
  {
    step: "master",
    num: "03",
    icon: Award,
    title: "Master",
    body: "Earn achievements, unlock new worlds, and celebrate your progress. From beginner to fluent — your adventure never ends, it only evolves.",
  },
];

export default function LearningJourney() {
  return (
    <section id="journey" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Heading */}
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="kicker mb-4">
            <Compass className="w-3.5 h-3.5" />
            Learning Journey
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-mystic-ink mb-4 text-balance">
            Learn in <span className="text-gradient-accent">3 magical steps</span>
          </h2>
          <p className="text-mystic-ink-soft text-base md:text-lg">
            Your adventure unfolds in three enchanted chapters — each one bringing you closer to fluency.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="relative">
          {/* Connecting path (desktop) */}
          <div
            className="hidden lg:block absolute top-1/2 left-[16%] right-[16%] h-1 -translate-y-1/2 z-0"
            style={{
              background: "linear-gradient(90deg, transparent, var(--mg-accent), var(--mg-accent), transparent)",
              opacity: 0.3,
            }}
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.step} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass-magic p-6 h-full flex flex-col"
                    style={{ borderRadius: 24 }}
                  >
                    {/* Art */}
                    <div className="relative mb-5 rounded-2xl overflow-hidden">
                      <JourneyArt step={s.step} className="w-full h-auto" />
                    </div>

                    {/* Number badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
                        style={{
                          background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))",
                          boxShadow: "0 4px 12px -2px var(--mg-glow)",
                        }}
                      >
                        {s.num}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "var(--mg-glass)", color: "var(--mg-accent)" }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-xl text-mystic-ink mb-2">
                      {s.title}
                    </h3>
                    {/* Body */}
                    <p className="text-sm text-mystic-ink-soft leading-relaxed">
                      {s.body}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}