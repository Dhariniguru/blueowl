import React from "react";

/**
 * Displays a summary card of voice exercise progress for the dashboard.
 *
 * @param {{
 *   stats: {
 *     total_attempts: number,
 *     average_score: number,
 *     best_score: number,
 *     total_exercises_completed: number,
 *     recent_improvement: number,
 *   },
 *   onClick: () => void,
 * }} props
 */
export default function VoiceProgressCard({ stats, onClick }) {
  if (!stats) {
    return (
      <div
        onClick={onClick}
        className="card card-hover p-5 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base text-ink-light dark:text-ink-dark">🎤 Speaking Practice</h3>
          <span className="text-xs text-soft-400">View all →</span>
        </div>
        <p className="text-sm text-soft-400">No speaking practice yet. Start your first exercise!</p>
      </div>
    );
  }

  const {
    total_attempts = 0,
    average_score = 0,
    best_score = 0,
    total_exercises_completed = 0,
    recent_improvement = 0,
  } = stats;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-soft-500";
  };

  return (
    <div
      onClick={onClick}
      className="card card-hover p-5 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base text-ink-light dark:text-ink-dark">🎤 Speaking Practice</h3>
        <span className="text-xs text-soft-400">View all →</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3 text-center">
          <p className="text-lg font-bold text-ink-light dark:text-ink-dark">{total_attempts}</p>
          <p className="text-xs text-soft-400">Attempts</p>
        </div>
        <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3 text-center">
          <p className={`text-lg font-bold ${getScoreColor(average_score)}`}>
            {Math.round(average_score)}%
          </p>
          <p className="text-xs text-soft-400">Avg Score</p>
        </div>
        <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3 text-center">
          <p className={`text-lg font-bold ${getScoreColor(best_score)}`}>
            {Math.round(best_score)}%
          </p>
          <p className="text-xs text-soft-400">Best Score</p>
        </div>
        <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3 text-center">
          <p className="text-lg font-bold text-ink-light dark:text-ink-dark">{total_exercises_completed}</p>
          <p className="text-xs text-soft-400">Exercises</p>
        </div>
      </div>

      {recent_improvement !== 0 && (
        <div className="mt-3 text-center">
          <span
            className={`text-xs font-semibold ${
              recent_improvement > 0 ? "text-success" : "text-danger"
            }`}
          >
            {recent_improvement > 0 ? "↑" : "↓"} {Math.abs(recent_improvement)}% recent change
          </span>
        </div>
      )}
    </div>
  );
}