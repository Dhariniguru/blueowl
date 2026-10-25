import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Onboarding() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    client.get("/assessment/start").then((res) => {
      setQuestions(res.data);
      setLoading(false);
    });
  }, []);

  const selectAnswer = (option) => {
    setAnswers({ ...answers, [questions[current].id]: option });
  };

  const next = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }
    setSubmitting(true);
    const payload = {
      assessment_type: "initial",
      answers: Object.entries(answers).map(([question_id, answer]) => ({
        question_id: Number(question_id),
        answer,
      })),
    };
    const res = await client.post("/assessment/submit", payload);
    setResult(res.data);
    refreshUser(res.data.user);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary-200 dark:border-primary-700 border-t-primary-500 dark:border-t-primary-400 animate-spin" />
          <p className="text-sm text-soft-400 animate-pulse-soft">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (result) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500/5 via-accent-500/5 to-secondary-500/5 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-secondary-900/20 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${(i * 17 + 10) % 90}%`,
              top: `${(i * 13 + 5) % 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {["🎯", "🌟", "📝", "💡", "⭐", "🎓"][i]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="font-display font-extrabold text-4xl mb-3">
            You're placed at <span className="text-amber-400">{result.level_assigned}</span>!
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="4" className="opacity-20" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none" stroke="#F59E0B" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - result.score_percent / 100)}
                  className="progress-ring-circle"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{result.score_percent}%</span>
            </div>
          </div>
          <p className="text-primary-100/80 mb-8">
            You scored {result.score_percent}% on the placement quiz. Your learning path is ready.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="gradient-warm text-white font-display font-bold px-8 py-3.5 rounded-xl2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Go to my path →
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];
  const selected = answers[q?.id];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-soft-400 mb-2">
            <span>Placement quiz</span>
            <span>
              <span className="text-primary-500 dark:text-primary-400">{current + 1}</span> / {questions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-soft-200 dark:bg-soft-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            />
          </div>
        </div>

         {/* Question card */}
         <AnimatePresence mode="wait">
           <motion.div
             key={current}
             initial={{ opacity: 0, x: 40 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -40 }}
             transition={{ duration: 0.25 }}
             className="card p-8"
           >
             <span className="badge-primary text-xs uppercase tracking-wider mb-3 inline-block">
               {q.skill_type}
             </span>
             <h2 className="font-display font-bold text-3xl md:text-4xl text-ink-light dark:text-ink-dark mb-6">
               {q.question_text}
             </h2>

            <div className="flex flex-col gap-3">
              {(q.options || []).map((opt) => (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectAnswer(opt)}
                  className={`text-left px-4 py-3.5 rounded-xl2 border-2 font-medium text-sm transition-all ${
                    selected === opt
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400"
                      : "border-soft-200 dark:border-soft-700 hover:border-primary-300 dark:hover:border-primary-600 text-ink-light dark:text-ink-dark"
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={next}
              disabled={!selected || submitting}
              className="btn-primary w-full mt-8"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Scoring…
                </>
              ) : current === questions.length - 1 ? (
                "Finish"
              ) : (
                <>
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}