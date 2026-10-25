import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.identifier, form.password);
      navigate(user.has_completed_onboarding ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
            {["📚", "✨", "🌟", "🎓", "💡", "🎯"][i]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))",
              boxShadow: "0 8px 24px -4px var(--mg-glow)"
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl text-ink-light dark:text-ink-dark mb-2">
            Welcome back
          </h1>
          <p className="text-lg text-soft-500 dark:text-soft-400">
            Continue your learning adventure
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-premium">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              placeholder="Username or email"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className="input-field"
              required
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger bg-danger-light dark:bg-danger/10 px-3 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-magic w-full py-3.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Logging in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="text-base text-soft-400 text-center mt-6">
            New here?{" "}
            <Link to="/register" className="text-primary-500 dark:text-primary-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}