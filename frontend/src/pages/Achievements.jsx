import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import client from "../api/client";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    client.get("/achievements").then((res) => setAchievements(res.data));
  }, []);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalXp = achievements.filter((a) => a.earned).reduce((sum, a) => sum + (a.xp_reward || 0), 0);
  const completionPercent = achievements.length > 0 ? Math.round((earnedCount / achievements.length) * 100) : 0;

  // Group achievements by category
  const categories = {
    beginner: achievements.filter(a => a.category === "beginner" || a.id <= 4),
    progress: achievements.filter(a => a.category === "progress" || (a.id > 4 && a.id <= 8)),
    streak: achievements.filter(a => a.category === "streak" || (a.id > 8 && a.id <= 12)),
    milestone: achievements.filter(a => a.category === "milestone" || (a.id > 12 && a.id <= 16)),
    mastery: achievements.filter(a => a.category === "mastery" || (a.id > 16 && a.id <= 20)),
    special: achievements.filter(a => a.category === "special" || a.id > 20),
  };

  const categoryConfig = {
    beginner: { emoji: "🏅", title: "Beginner Badges", color: "#4CAF7D" },
    progress: { emoji: "⭐", title: "Progress Badges", color: "#FFC857" },
    streak: { emoji: "🔥", title: "Streak Badges", color: "#EF4444" },
    milestone: { emoji: "🚀", title: "Milestone Badges", color: "#38BDF8" },
    mastery: { emoji: "👑", title: "Mastery Badges", color: "#8B5CF6" },
    special: { emoji: "🎁", title: "Special Event Badges", color: "#FF8FB1" },
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--mg-bg)" }}>
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 w-full">
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display font-extrabold text-5xl md:text-6xl" style={{ color: "var(--mg-ink)" }}>
                  Achievements
                </h1>
                <p className="text-xl mt-2" style={{ color: "var(--mg-ink-soft)" }}>
                  {earnedCount} of {achievements.length} unlocked — keep learning to earn more.
                </p>
              </div>
              {/* Overall progress ring */}
              {achievements.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="4" className="text-soft-200 dark:text-soft-700" />
                      <circle
                        cx="32" cy="32" r="26"
                        fill="none" stroke="currentColor" strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - completionPercent / 100)}
                        className="progress-ring-circle"
                        style={{ color: "var(--mg-accent)" }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: "var(--mg-ink)" }}>
                      {completionPercent}%
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>Completion</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--mg-ink)" }}>{earnedCount}/{achievements.length}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Cards */}
          {achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="rounded-2xl p-5" style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))" }}>
                    🏆
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>Total</p>
                    <p className="text-xl font-bold font-display" style={{ color: "var(--mg-ink)" }}>{achievements.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}>
                    ✅
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>Unlocked</p>
                    <p className="text-xl font-bold font-display" style={{ color: "var(--mg-ink)" }}>{earnedCount}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #94A3B8, #64748B)" }}>
                    🔒
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>Remaining</p>
                    <p className="text-xl font-bold font-display" style={{ color: "var(--mg-ink)" }}>{achievements.length - earnedCount}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>XP Earned</p>
                    <p className="text-xl font-bold font-display" style={{ color: "var(--mg-ink)" }}>{totalXp}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievement Categories */}
          <div className="space-y-8">
            {Object.entries(categories).map(([key, categoryAchievements], catIndex) => {
              if (categoryAchievements.length === 0) return null;
              const config = categoryConfig[key];
              const categoryEarned = categoryAchievements.filter(a => a.earned).length;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * catIndex, duration: 0.4 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{config.emoji}</span>
                    <div>
                      <h2 className="font-display font-extrabold text-2xl md:text-3xl" style={{ color: "var(--mg-ink)" }}>
                        {config.title}
                      </h2>
                      <p className="text-sm" style={{ color: "var(--mg-ink-soft)" }}>
                        {categoryEarned} of {categoryAchievements.length} unlocked
                      </p>
                    </div>
                  </div>

                  {/* Achievement Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryAchievements.map((achievement, i) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ scale: achievement.earned ? 1.05 : 1.02, y: -4 }}
                        className={`relative rounded-2xl p-5 text-center transition-all duration-300 ${
                          achievement.earned
                            ? "shadow-lg hover:shadow-xl"
                            : "opacity-60"
                        }`}
                        style={{
                          background: achievement.earned
                            ? `linear-gradient(135deg, ${config.color}15 0%, ${config.color}08 100%)`
                            : "var(--mg-glass)",
                          border: `2px solid ${achievement.earned ? config.color + "40" : "var(--mg-border)"}`,
                          backdropFilter: "blur(20px)",
                        }}
                      >
                        {/* Glow effect for earned achievements */}
                        {achievement.earned && (
                          <div
                            className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
                            style={{ background: `radial-gradient(circle at center, ${config.color}40 0%, transparent 70%)` }}
                          />
                        )}

                        <div className="relative z-10">
                          {/* Achievement Icon */}
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3 transition-all duration-300 ${
                              achievement.earned ? "shadow-lg" : "grayscale"
                            }`}
                            style={{
                              background: achievement.earned
                                ? `linear-gradient(135deg, ${config.color}30 0%, ${config.color}15 100%)`
                                : "var(--mg-glass)",
                              boxShadow: achievement.earned ? `0 8px 20px -4px ${config.color}40` : "none",
                            }}
                          >
                            {achievement.icon}
                          </div>

                          {/* Achievement Info */}
                          <h3 className="font-display font-bold text-base mb-1" style={{ color: "var(--mg-ink)" }}>
                            {achievement.title}
                          </h3>
                          <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--mg-ink-soft)" }}>
                            {achievement.description}
                          </p>

                          {/* XP Reward */}
                          {achievement.xp_reward && (
                            <div
                              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold mb-3"
                              style={{
                                background: `linear-gradient(135deg, ${config.color}25 0%, ${config.color}15 100%)`,
                                color: config.color,
                                border: `1px solid ${config.color}30`
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              +{achievement.xp_reward} XP
                            </div>
                          )}

                          {/* Status Badge */}
                          {achievement.earned ? (
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
                              style={{
                                background: `linear-gradient(135deg, #22C55E25 0%, #22C55E15 100%)`,
                                color: "#22C55E",
                                border: "1px solid #22C55E30"
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Unlocked
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
                              style={{
                                background: "var(--mg-glass)",
                                color: "var(--mg-ink-soft)",
                                border: "1px solid var(--mg-border)"
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Locked
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}