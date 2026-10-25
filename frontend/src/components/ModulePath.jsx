import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─── World themes per CEFR level ─────────────────────────────── */
const WORLD_THEMES = {
  A1: {
    name: "Forest Village",
    emoji: "🌲",
    desc: "A cozy village hidden in the trees where friendly characters teach you first words.",
    gradient: "from-emerald-500/15 via-teal-400/10 to-transparent",
    border: "border-emerald-300 dark:border-emerald-600/50",
    accent: "#4CAF7D",
    accentStrong: "#2E7D5B",
    nodeBg: "bg-emerald-50 dark:bg-emerald-500/15",
    reward: "Forest Explorer Badge",
    unlockXp: 100,
  },
  A2: {
    name: "Everyday Town",
    emoji: "🏘️",
    desc: "A lively town full of cafés, markets and friendly neighbors ready for daily conversations.",
    gradient: "from-amber-500/15 via-orange-400/10 to-transparent",
    border: "border-amber-300 dark:border-amber-600/50",
    accent: "#FFC857",
    accentStrong: "#E5A800",
    nodeBg: "bg-amber-50 dark:bg-amber-500/15",
    reward: "Town Hero Badge",
    unlockXp: 150,
  },
  B1: {
    name: "City of Conversations",
    emoji: "🌆",
    desc: "A bustling city where every street is a new dialogue waiting to happen.",
    gradient: "from-sky-500/15 via-blue-400/10 to-transparent",
    border: "border-sky-300 dark:border-sky-600/50",
    accent: "#38BDF8",
    accentStrong: "#0284C7",
    nodeBg: "bg-sky-50 dark:bg-sky-500/15",
    reward: "City Conversationalist Badge",
    unlockXp: 200,
  },
  B2: {
    name: "Knowledge Castle",
    emoji: "🏰",
    desc: "A grand castle of wisdom where complex ideas and debates come alive.",
    gradient: "from-violet-500/15 via-purple-400/10 to-transparent",
    border: "border-violet-300 dark:border-violet-600/50",
    accent: "#8B5CF6",
    accentStrong: "#6D28D9",
    nodeBg: "bg-violet-50 dark:bg-violet-500/15",
    reward: "Castle Scholar Badge",
    unlockXp: 250,
  },
  C1: {
    name: "Innovation Kingdom",
    emoji: "⚡",
    desc: "A futuristic kingdom where advanced fluency sparks brilliant ideas.",
    gradient: "from-pink-500/15 via-rose-400/10 to-transparent",
    border: "border-pink-300 dark:border-pink-600/50",
    accent: "#FF8FB1",
    accentStrong: "#E8458C",
    nodeBg: "bg-pink-50 dark:bg-pink-500/15",
    reward: "Kingdom Innovator Badge",
    unlockXp: 300,
  },
  C2: {
    name: "World Explorer",
    emoji: "🌍",
    desc: "The final frontier — roam the whole world with mastery and confidence.",
    gradient: "from-amber-400/15 via-teal-400/10 to-transparent",
    border: "border-amber-300 dark:border-amber-600/50",
    accent: "#FFC857",
    accentStrong: "#D4A72C",
    nodeBg: "bg-amber-50 dark:bg-amber-500/15",
    reward: "World Master Badge",
    unlockXp: 350,
  },
};

const FALLBACK_THEME = WORLD_THEMES.A1;

/* ─── Lesson destination icons by type ─────────────────────────── */
const LESSON_DESTINATIONS = {
  reading: { icon: "📖", label: "Library" },
  writing: { icon: "🖋️", label: "Scribble Studio" },
  listening: { icon: "🎧", label: "Music Hall" },
  speaking: { icon: "🎙️", label: "Stage" },
  vocabulary: { icon: "🌸", label: "Word Garden" },
};

const DESTINATION_NAMES = [
  "🏡 Cottage",
  "📚 Library",
  "🌸 Garden",
  "☕ Café",
  "🏰 Castle",
  "🌉 Bridge",
  "🎈 Balloon",
  "🎭 Theatre",
  "🎵 Music Hall",
  "🏕 Camp",
  "🌊 Harbor",
  "🛍️ Market",
  "🚉 Station",
  "🏛️ Museum",
  "🌳 Grove",
  "✨ Shrine",
];

/* ─── Title-based destination guesser ──────────────────────────── */
function guessDestination(title, type, index) {
  const t = (title || "").toLowerCase();
  const typeDest = LESSON_DESTINATIONS[type];
  if (typeDest && /meet|greet|hello|first/.test(t)) {
    return { icon: "🏡", label: "Village Entrance" };
  }
  if (/restaurant|food|eat|kitchen|dinner|lunch/.test(t)) return { icon: "☕", label: "Café" };
  if (/shop|buy|market|store|purchase/.test(t)) return { icon: "🛍️", label: "Market" };
  if (/travel|station|train|trip|journey|airport/.test(t)) return { icon: "🚉", label: "Station" };
  if (/music|song|listen|audio/.test(t)) return { icon: "🎵", label: "Music Hall" };
  if (/story|read|book|library/.test(t)) return { icon: "📖", label: "Library" };
  if (/garden|nature|flower|tree|park/.test(t)) return { icon: "🌸", label: "Garden" };
  if (/family|home|house|village/.test(t)) return { icon: "🏡", label: "Cottage" };
  if (/castle|king|queen|royal/.test(t)) return { icon: "🏰", label: "Castle" };
  if (/bridge|cross|path/.test(t)) return { icon: "🌉", label: "Bridge" };
  if (/theater|theatre|play|stage/.test(t)) return { icon: "🎭", label: "Theatre" };
  if (/camp|tent|outdoor/.test(t)) return { icon: "🏕", label: "Camp" };
  if (typeDest) return typeDest;
  return DESTINATION_NAMES[index % DESTINATION_NAMES.length].split(" ");
}

/* ─── Progress bar ─────────────────────────────────────────────── */
function WorldProgressBar({ progress }) {
  const blocks = 10;
  const filled = Math.round((progress / 100) * blocks);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[3px] flex-1">
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i < filled
                ? "bg-gradient-to-r from-accent-500 to-accent-400 shadow-sm shadow-accent-500/40"
                : "bg-soft-200 dark:bg-soft-700/60"
            }`}
          />
        ))}
      </div>
      <span className="font-display font-bold text-sm text-mystic-ink dark:text-ink-dark shrink-0">{progress}%</span>
    </div>
  );
}

/* ─── Floating decorative particles (GPU-friendly) ────────────── */
export function FloatingDecor({ count = 6 }) {
  try {
  const items = useRef(
    Array.from({ length: count }).map(() => ({
      left: Math.random() * 90 + 5,
      top: Math.random() * 80 + 10,
      size: Math.random() * 8 + 6,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 4,
      char: Math.random() > 0.5 ? "✨" : "🍂",
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute opacity-40 anim-floaty"
          style={{
            left: `${it.left}%`,
            top: `${it.top}%`,
            fontSize: `${it.size}px`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.duration}s`,
          }}
        >
          {it.char}
        </span>
      ))}
    </div>
  );
  } catch (error) {
    console.error('FloatingDecor error:', error);
    return null;
  }
}

/* ─── Winding path SVG ─────────────────────────────────────────── */
function WindingPath({ len, accent }) {
  const points = [];
  for (let i = 0; i < len; i++) {
    const y = i * 110 + 55;
    points.push(i % 2 === 0 ? `0 ${y}` : `100% ${y}`);
  }
  return (
    <svg
      className="absolute left-0 top-0 w-full h-[calc(100%-20px)] pointer-events-none hidden md:block"
      fill="none"
      preserveAspectRatio="none"
      viewBox={`0 0 600 ${Math.max(len, 1) * 110}`}
      aria-hidden="true"
    >
      <path
        d={points
          .map((p, i) => {
            const [x, y] = p.split(" ");
            const nx = (i + 1) % 2 === 0 ? "600" : "0";
            const ny = (i + 1) * 110 + 55;
            const mx = "300";
            return `${i === 0 ? "M" : "L"}${x === "0" ? "0" : "600"} ${y} ${i < len - 1 ? `Q ${mx} ${(Number(y) + ny) / 2}, ${nx} ${ny}` : ""}`;
          })
          .join(" ")}
        stroke={accent}
        strokeOpacity="0.25"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="2 14"
      />
    </svg>
  );
}

/* ─── Locked world card ────────────────────────────────────────── */
function LockedWorld({ theme, cefr, title }) {
  return (
    <div
      className={`relative rounded-xl3 border-2 ${theme.border} border-dashed bg-gradient-to-b ${theme.gradient} p-5 opacity-70 backdrop-blur-[2px]`}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-soft-100 dark:bg-soft-800 flex items-center justify-center text-3xl grayscale select-none">
          🔒
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-soft-400 uppercase tracking-wider">{cefr}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-soft-300 dark:bg-soft-600" />
          </div>
          <h4 className="font-display font-bold text-lg text-soft-500 dark:text-soft-400 truncate">{title}</h4>
          <p className="text-xs text-soft-400 mt-0.5">
            Unlock after completing {cefr === "A2" ? "Forest Village" : "the previous world"}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-soft-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Locked
        </div>
      </div>
    </div>
  );
}

/* ─── Main ModulePath — one themed world ───────────────────────── */
export default function ModulePath({ module, isCurrent = false, onWorldComplete, userLevel, isNextWorld = false }) {
  const navigate = useNavigate();
  const [celebrate, setCelebrate] = useState(false);
  const world = WORLD_THEMES[module.cefr_level] || FALLBACK_THEME;

  const completedCount = module.lessons.filter((l) => l.status === "completed").length;
  const total = module.lessons.length;
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const totalXp = module.lessons.reduce((sum, l) => sum + (l.xp_reward || 0), 0);
  const isFullyComplete = completedCount === total && total > 0;

  // Visibility logic: show current world and all future worlds (locked)
  const userLevelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const userLevelIdx = userLevelOrder.indexOf(userLevel || "A1");
  const moduleLevelIdx = userLevelOrder.indexOf(module.cefr_level);
  const isPastWorld = moduleLevelIdx < userLevelIdx; // Past world
  const isFutureWorld = moduleLevelIdx > userLevelIdx; // Future world (locked)

  /* Find first incomplete lesson for current highlight */
  const firstIncompleteIdx = module.lessons.findIndex((l) => l.status !== "completed");
  const currentLessonIdx = firstIncompleteIdx === -1 ? 0 : firstIncompleteIdx;

  /* Trigger celebration when world just completed */
  const prevComplete = useRef(isFullyComplete);
  useEffect(() => {
    if (isFullyComplete && !prevComplete.current) {
      setCelebrate(true);
      onWorldComplete?.(module);
    }
    prevComplete.current = isFullyComplete;
  }, [isFullyComplete, module, onWorldComplete]);

  /* Show: current world, OR future world (locked preview), OR completed world */
  const shouldShow = isCurrent || isFutureWorld || isFullyComplete;
  if (!shouldShow) {
    return null; // Hide past incomplete worlds
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-[28px] border-[3px] ${world.border} bg-gradient-to-b ${world.gradient} overflow-hidden shadow-xl`}
      style={{
        background: `linear-gradient(180deg, ${world.accent}08 0%, ${world.accent}18 100%)`
      }}
    >
      {/* Enhanced floating decorations */}
      <FloatingDecor count={isCurrent ? 15 : 8} />

      {/* ═══ World header - compact ═══ */}
      <div className="relative z-10 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Large emoji with circle background */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-xl ${
                isCurrent ? "anim-breathe" : ""
              }`}
              style={{
                background: `radial-gradient(circle, ${world.accent}40 0%, ${world.accent}15 70%, transparent 100%)`,
                boxShadow: `0 8px 32px ${world.accent}30`
              }}
            >
              <span className="drop-shadow-lg filter">{world.emoji}</span>
            </div>
            {isCurrent && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-accent-400 to-accent-500 border-3 border-white dark:border-surface-dark animate-pulse shadow-lg" />
            )}
          </div>

          {/* World info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="badge-primary text-[11px] uppercase tracking-wider px-3 py-1">{module.cefr_level}</span>
              {isFullyComplete ? (
                <span className="badge-success text-[11px] px-3 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  World Complete
                </span>
              ) : isCurrent ? (
                <span className="badge-warning text-[11px] px-3 py-1">✦ Current World</span>
              ) : null}
            </div>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-mystic-ink dark:text-ink-dark mb-1.5">
              {world.name}
            </h3>
            <p className="text-sm md:text-base text-mystic-ink-soft dark:text-soft-400 leading-relaxed max-w-2xl">{world.desc}</p>
          </div>

          {/* Progress */}
          <div className="shrink-0 text-center md:text-right">
            <p className="text-xs font-semibold text-soft-500 uppercase tracking-wider mb-2">Progress</p>
            <div className="flex items-center gap-2 justify-center md:justify-end">
              <WorldProgressBar progress={progress} />
            </div>
            <p className="text-sm text-soft-500 mt-2 font-medium">
              {completedCount} / {total} Adventures
            </p>
          </div>
        </div>

        {/* Reward badges - compact */}
        <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold text-xs shadow-md"
            style={{ 
              background: `linear-gradient(135deg, ${world.accent}25 0%, ${world.accent}15 100%)`,
              color: world.accentStrong || world.accent,
              border: `1px solid ${world.accent}30`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {totalXp} XP
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold text-xs shadow-md"
            style={{ 
              background: `linear-gradient(135deg, ${world.accent}25 0%, ${world.accent}15 100%)`,
              color: world.accentStrong || world.accent,
              border: `1px solid ${world.accent}30`
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            {world.reward}
          </span>
          {isFullyComplete && (
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold text-sm shadow-md bg-gradient-to-r from-success-light to-success/20 text-success border-2 border-success/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              +{world.unlockXp} XP Bonus
            </span>
          )}
        </div>
      </div>

      {/* ═══ Winding adventure path ═══ */}
      <div className="relative z-10 px-4 md:px-8 pb-6 pt-3">
        <div className="relative max-w-3xl mx-auto">
          <WindingPath len={total} accent={world.accent} />

          <div className="relative flex flex-col gap-3">
            {module.lessons.map((lesson, idx) => {
              const isCompleted = lesson.status === "completed";
              // Within a world, first lesson is unlocked; later lessons unlock sequentially
              const isLocked = !isCompleted && !isPastWorld && idx > 0 && module.lessons[idx - 1].status !== "completed";
              const isCurrent = !isCompleted && !isLocked;
              const alignLeft = idx % 2 === 0;

              const dest = guessDestination(lesson.title, lesson.lesson_type, idx);
              const icon = typeof dest === "object" ? dest.icon : dest[0];
              const label = typeof dest === "object" ? dest.label : dest[1];

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className={`relative flex ${alignLeft ? "justify-start md:pr-[30%]" : "justify-end md:pl-[30%]"}`}
                >
                  {/* Connecting line */}
                  {idx < total - 1 && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-b md:hidden`}
                      style={{
                        background: `linear-gradient(to bottom, ${world.accent}60, transparent)`
                      }}
                    />
                  )}

                  <button
                    disabled={isLocked}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    className={`group relative flex items-center gap-3 rounded-xl border-2 transition-all duration-300 text-left w-full md:w-[280px] shadow-md
                      ${isCompleted
                        ? "border-success/40 bg-gradient-to-r from-success-light to-success/5 dark:from-success/15 dark:to-success/5 hover:shadow-lg hover:border-success/60 hover:scale-[1.02]"
                        : isLocked
                          ? "border-soft-300 dark:border-soft-600 bg-soft-100/80 dark:bg-soft-800/60 blur-[0.5px] opacity-50 grayscale cursor-not-allowed"
                          : "border-white/70 dark:border-soft-600 bg-white/95 dark:bg-surface-dark-alt hover:shadow-xl hover:-translate-y-1 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer"
                      }
                      ${isCurrent ? "ring-[3px] ring-primary-400/80 dark:ring-primary-400/70 shadow-xl shadow-primary-500/30 scale-[1.03]" : ""}
                    `}
                    title={lesson.title}
                  >
                    {/* Node icon - larger and more colorful */}
                    <div
                      className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 shadow-md ${
                        isCompleted
                          ? "bg-gradient-to-br from-success to-success/80 text-white shadow-success/30"
                          : isLocked
                            ? "bg-soft-200 dark:bg-soft-700 text-soft-400"
                            : "bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-500/20 dark:to-accent-500/20 group-hover:scale-110 group-hover:rotate-3"
                      }`}
                    >
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isLocked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 002 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : (
                        <span className="drop-shadow-md filter">{icon}</span>
                      )}
                    </div>

                    {/* Lesson info */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                            {label}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className={`font-display font-bold text-sm leading-tight truncate mb-0.5 ${isLocked ? "text-soft-400 dark:text-soft-500" : "text-ink-light dark:text-ink-dark"}`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-soft-500 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            +{lesson.xp_reward} XP
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                              Start →
                            </span>
                          )}
                        </div>
                      </div>

                    {/* Current lesson pulsing indicator */}
                    {isCurrent && (
                      <div className="absolute -top-2.5 -right-2.5">
                        <span className="relative flex w-5 h-5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full w-5 h-5 bg-gradient-to-r from-primary-500 to-accent-500 border-2 border-white dark:border-surface-dark shadow-lg" />
                        </span>
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ Completion celebration modal ═══ */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setCelebrate(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative max-w-md w-full rounded-3xl bg-white dark:bg-surface-dark-alt border border-soft-100 dark:border-soft-700 p-8 text-center shadow-premium overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti sparkles */}
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-xl anim-floaty"
                  style={{
                    left: `${(i * 10 + 5) % 90}%`,
                    top: `${(i * 7) % 50}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  {["🎉", "✨", "⭐", "🎊"][i % 4]}
                </span>
              ))}

              <div className="text-7xl mb-4 anim-bounce">🎉</div>
              <h3 className="font-display font-extrabold text-3xl text-ink-light dark:text-ink-dark mb-2">
                {world.name} Complete!
              </h3>
              <p className="text-base text-soft-500 dark:text-soft-400 mb-6">
                You helped every character in the village. Amazing journey!
              </p>

              <div className="space-y-3 mb-7">
                <div className="flex items-center gap-3 rounded-2xl bg-warning-light dark:bg-warning/10 p-3.5">
                  <span className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center text-xl">⚡</span>
                  <div className="text-left">
                    <p className="text-xs text-soft-400">Reward</p>
                    <p className="font-display font-bold text-lg text-warning">+{world.unlockXp} XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-accent-50 dark:bg-accent-500/10 p-3.5">
                  <span className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-xl">🏅</span>
                  <div className="text-left">
                    <p className="text-xs text-soft-400">Badge Earned</p>
                    <p className="font-display font-bold text-lg text-accent-600 dark:text-accent-400">{world.reward}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCelebrate(false)}
                className="btn-primary w-full"
              >
                Continue Adventure
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}