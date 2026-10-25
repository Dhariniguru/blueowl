import { motion } from "framer-motion";
import { Users, BookOpen, Trophy, Smile } from "lucide-react";
import Reveal from "./magic/Reveal";
import useCountUp from "../../hooks/useCountUp";

const STATS = [
  { icon: Users, target: 10000, suffix: "+", label: "Happy Learners", color: "#8B5CF6" },
  { icon: BookOpen, target: 50, suffix: "+", label: "Language Courses", color: "#FF8FB1" },
  { icon: Trophy, target: 1000000, suffix: "+", label: "Lessons Completed", color: "#FFC857" },
  { icon: Smile, target: 95, suffix: "%", label: "Satisfaction Rate", color: "#4CAF7D" },
];

function StatCard({ stat, index }) {
  const [value, ref] = useCountUp(stat.target);
  const Icon = stat.icon;

  const formatNum = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0", "") + "M";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
    return n.toString();
  };

  return (
    <Reveal delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-magic p-5 text-center h-full group relative overflow-hidden"
        style={{ borderRadius: 24 }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, var(--mg-glow), transparent 60%)" }}
        />
        <div
          ref={ref}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
          style={{
            background: "radial-gradient(circle, " + stat.color + "30, transparent 70%)",
            color: stat.color,
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
        <div className="font-display font-extrabold text-3xl md:text-4xl text-mystic-ink mb-0.5">
          {formatNum(value)}{stat.suffix}
        </div>
        <p className="text-base text-mystic-ink-soft">{stat.label}</p>
      </motion.div>
    </Reveal>
  );
}

export default function StatsStrip() {
  return (
    <section className="relative py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}