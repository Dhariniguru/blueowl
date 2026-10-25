import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    preferred_language: "English",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-500/5 via-primary-500/5 to-secondary-500/5 dark:from-accent-900/20 dark:via-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center px-4 py-10 relative overflow-hidden">
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
            {["🎓", "🚀", "⭐", "📝", "💫", "🏆"][i]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card p-8 shadow-premium">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/25">
              N
            </div>
            <h1 className="font-display font-extrabold text-4xl text-ink-light dark:text-ink-dark">Create your account</h1>
            <p className="text-lg text-soft-400 mt-2">Start your literacy journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              placeholder="Full name"
              value={form.full_name}
              onChange={update("full_name")}
              className="input-field"
              required
            />
            <input
              placeholder="Username"
              value={form.username}
              onChange={update("username")}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={update("email")}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Password (min. 8 characters)"
              value={form.password}
              onChange={update("password")}
              minLength={8}
              className="input-field"
              required
            />
            <select
              value={form.preferred_language}
              onChange={update("preferred_language")}
              className="input-field"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

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
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-base text-soft-400 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-500 dark:text-primary-400 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}