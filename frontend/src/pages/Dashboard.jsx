import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ModulePath from "../components/ModulePath";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const userLevelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const currentLevelIdx = userLevelOrder.indexOf(user?.current_level || "A1");

  useEffect(() => {
    Promise.all([client.get("/lessons/path"), client.get("/lessons/recommended")]).then(
      ([pathRes, recRes]) => {
        setModules(pathRes.data);
        setRecommended(recRes.data);
        setLoading(false);
      }
    );
  }, []);

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.status === "completed").length,
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
                  Your learning path
                </h1>
                <p className="text-xl mt-2" style={{ color: "var(--mg-ink-soft)" }}>
                  Keep going, {user?.full_name?.split(" ")[0]} — every lesson moves you closer to fluency.
                </p>
              </div>
              {/* Overall progress ring */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="4" className="text-soft-200 dark:text-soft-700" />
                    <circle
                      cx="32" cy="32" r="26"
                      fill="none" stroke="currentColor" strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercent / 100)}
                      className="progress-ring-circle"
                      style={{ color: "var(--mg-accent)" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: "var(--mg-ink)" }}>
                    {progressPercent}%
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>Overall progress</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--mg-ink)" }}>{completedLessons}/{totalLessons} lessons</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8"
          >
            <StatCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              label="XP earned"
              value={user?.xp_points ?? 0}
              tone="warning"
            />
            <StatCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
              label="Day streak"
              value={user?.streak_count ?? 0}
              tone="danger"
            />
            <StatCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Lessons done"
              value={`${completedLessons}/${totalLessons}`}
              tone="success"
            />
            <StatCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              label="CEFR level"
              value={user?.current_level ?? "A1"}
              tone="primary"
            />
          </motion.div>

          {/* Recommended lessons */}
          {recommended.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="mb-6"
            >
              <h2 className="font-display font-bold text-xl mb-3" style={{ color: "var(--mg-ink)" }}>Up next for you</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                {recommended.slice(0, 4).map((lesson, i) => (
                  <a
                    key={lesson.id}
                    href={`/lesson/${lesson.id}`}
                    className="shrink-0 w-52 card card-hover p-4 group"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--mg-accent)" }}>
                      {lesson.lesson_type}
                    </p>
                    <p className="font-display font-bold text-sm mb-1 truncate" style={{ color: "var(--mg-ink)" }}>
                      {lesson.title}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--mg-ink-soft)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      +{lesson.xp_reward} XP
                    </p>
                  </a>
                ))}
              </div>
            </motion.section>
          )}

          {/* View full path button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="mt-6"
          >
            <a
              href="/learning-path"
              onClick={(e) => { e.preventDefault(); window.location.href = "/learning-path"; }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))",
                boxShadow: "0 8px 24px -6px var(--mg-glow)"
              }}
            >
              <span>🗺️</span>
              View Full Adventure Map
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}