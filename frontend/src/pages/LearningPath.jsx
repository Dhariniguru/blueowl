import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ModulePath from "../components/ModulePath";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LearningPath() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/lessons/path").then((res) => {
      setModules(res.data);
      setLoading(false);
    });
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl" style={{ color: "var(--mg-ink)" }}>
                Your Adventure Map
              </h1>
              <p className="text-lg mt-2" style={{ color: "var(--mg-ink-soft)" }}>
                Explore worlds, complete lessons, and become fluent.
              </p>
            </div>
            {/* Overall progress ring */}
            <div className="flex items-center gap-3">
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

        {/* Adventure Map */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-t-2 animate-spin" style={{ borderColor: "var(--mg-accent)", borderTopColor: "transparent" }} />
              <p className="text-sm" style={{ color: "var(--mg-ink-soft)" }}>Loading your adventure...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {modules.map((module) => {
              const userLevelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
              const userLevelIdx = userLevelOrder.indexOf(user?.current_level || "A1");
              const moduleLevelIdx = userLevelOrder.indexOf(module.cefr_level);
              const isCurrent = moduleLevelIdx === userLevelIdx;
              const isPast = moduleLevelIdx < userLevelIdx;

              return (
                <ModulePath
                  key={module.id}
                  module={module}
                  isCurrent={isCurrent}
                  isNextWorld={!isCurrent && !isPast}
                  userLevel={user?.current_level}
                />
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}