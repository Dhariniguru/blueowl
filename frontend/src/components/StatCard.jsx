import React from "react";
import { motion } from "framer-motion";

const STYLES = {
  primary: {
    bg: "bg-primary-50 dark:bg-primary-500/15",
    icon: "text-primary-500 dark:text-primary-400",
    ring: "ring-primary-500/20",
  },
  accent: {
    bg: "bg-accent-50 dark:bg-accent-500/15",
    icon: "text-accent-500 dark:text-accent-400",
    ring: "ring-accent-500/20",
  },
  warning: {
    bg: "bg-warning-light dark:bg-warning/15",
    icon: "text-warning dark:text-warning-400",
    ring: "ring-warning/20",
  },
  success: {
    bg: "bg-success-light dark:bg-success/15",
    icon: "text-success dark:text-success-400",
    ring: "ring-success/20",
  },
  danger: {
    bg: "bg-danger-light dark:bg-danger/15",
    icon: "text-danger dark:text-danger-400",
    ring: "ring-danger/20",
  },
  soft: {
    bg: "bg-soft-100 dark:bg-soft-700/50",
    icon: "text-soft-500 dark:text-soft-400",
    ring: "ring-soft-300/30",
  },
};

export default function StatCard({ icon, label, value, sublabel, tone = "primary" }) {
  const style = STYLES[tone] || STYLES.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="card card-hover p-4 flex items-start gap-3.5 group"
    >
      <div className={`w-11 h-11 rounded-xl2 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-300 ${style.bg} ${style.icon}`}>
        {icon}
      </div>
       <div className="min-w-0">
         <p className="text-3xl font-display font-extrabold text-ink-light dark:text-ink-dark leading-none">
           {value}
         </p>
         <p className="text-base text-soft-500 dark:text-soft-400 font-medium mt-1">{label}</p>
         {sublabel && (
           <p className="text-sm text-soft-400 dark:text-soft-500 mt-0.5">{sublabel}</p>
         )}
       </div>
    </motion.div>
  );
}