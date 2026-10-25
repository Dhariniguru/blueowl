import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Reveal from "./magic/Reveal";

const TESTIMONIALS = [
  {
    name: "Aisha K.",
    role: "Medical Student",
    avatar: "#8B5CF6",
    initial: "A",
    quote: "I went from struggling with medical English to confidently reading research papers. The AI companion feels like a friend who never judges me.",
    rating: 5,
  },
  {
    name: "Marco R.",
    role: "Software Engineer",
    avatar: "#FF8FB1",
    initial: "M",
    quote: "Learning Japanese felt impossible until Neo Learning. The gamification kept me coming back every single day for 6 months straight.",
    rating: 5,
  },
  {
    name: "Sofia L.",
    role: "Teacher",
    avatar: "#FFC857",
    initial: "S",
    quote: "As a teacher, I recommend Neo Learning to all my students. The adaptive lessons meet each learner exactly where they are.",
    rating: 5,
  },
  {
    name: "Kenji T.",
    role: "Designer",
    avatar: "#4CAF7D",
    initial: "K",
    quote: "The pronunciation feedback is incredibly accurate. My French colleagues noticed the improvement within just three weeks.",
    rating: 5,
  },
  {
    name: "Priya N.",
    role: "Marketing Lead",
    avatar: "#9DADF0",
    initial: "P",
    quote: "Beautiful, magical, and genuinely effective. This is what language learning should feel like in 2025. I'm hooked.",
    rating: 5,
  },
  {
    name: "David O.",
    role: "Researcher",
    avatar: "#FF6B9D",
    initial: "D",
    quote: "The streak system and achievements turned learning from a chore into a daily adventure. 180 days and counting!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Heading */}
        <Reveal className="text-center max-w-3xl mx-auto mb-10">
          <span className="kicker mb-4">
            <Quote className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-mystic-ink mb-4 text-balance">
            Loved by learners <span className="text-gradient-accent">everywhere</span>
          </h2>
          <p className="text-xl md:text-2xl text-mystic-ink-soft">
            Real stories from real adventurers on their language learning journey.
          </p>
        </Reveal>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.1}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-magic p-6 h-full flex flex-col group relative overflow-hidden"
                style={{ borderRadius: 28 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg, var(--mg-accent), var(--mg-gold))" }}
                />
                {/* Quote icon */}
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
                  style={{ background: "var(--mg-glass)", color: "var(--mg-accent)" }}
                >
                  <Quote className="w-5 h-5" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-2.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4"
                      style={{ color: "var(--mg-gold)", fill: "var(--mg-gold)" }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base text-mystic-ink leading-relaxed mb-4 flex-1">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3.5 border-t" style={{ borderColor: "var(--mg-border)" }}>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-white/30"
                    style={{ background: t.avatar }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-mystic-ink">{t.name}</p>
                    <p className="text-sm text-mystic-ink-soft">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}