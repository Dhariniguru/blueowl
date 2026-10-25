import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

// ─── MediaRecorder Hook (real audio recording) ────────────────────────
function useMediaRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setSupported(
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia &&
      typeof MediaRecorder !== "undefined"
    );
  }, []);

  const startRecording = useCallback(async () => {
    setError("");
    setAudioBlob(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Pick a supported MIME type
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "audio/wav",
      ];
      let mimeType = "";
      for (const mt of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mt)) {
          mimeType = mt;
          break;
        }
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        setAudioBlob(blob);
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };

      recorder.onerror = () => {
        setError("Couldn't record your pronunciation. Please try again.");
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);

      // Browser speech recognition (Web Speech API) for transcript
      setTranscript("");
      const SpeechRecognitionAPI =
        typeof window !== "undefined" &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);
      if (SpeechRecognitionAPI) {
        try {
          const recognition = new SpeechRecognitionAPI();
          recognition.lang = "en-US";
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;
          recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
          };
          recognition.onerror = () => {};
          recognitionRef.current = recognition;
          recognition.start();
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Microphone permission is required for pronunciation practice.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No microphone was found. Check your device.");
      } else {
        setError("Couldn't access the microphone. Please try again.");
      }
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsRecording(false);
  }, []);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setError("");
    setTranscript("");
    chunksRef.current = [];
  }, []);

  return {
    supported,
    isRecording,
    isProcessing,
    audioBlob,
    error,
    transcript,
    startRecording,
    stopRecording,
    clearRecording,
    setError,
    setIsProcessing,
  };
}

// ─── Helper: error/loading/empty state blocks ──────────────────────────
function LoadingBlock({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-12 h-12 rounded-full border-[3px] animate-spin" style={{ borderColor: "var(--mg-accent)", borderTopColor: "transparent" }} />
      <p className="text-sm font-medium" style={{ color: "var(--mg-ink-soft)" }}>{label || "Loading..."}</p>
    </div>
  );
}

function ErrorBlock({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-8 text-center mx-auto max-w-md"
      style={{ background: "var(--mg-glass)", border: "2px solid rgba(239, 68, 68, 0.25)", backdropFilter: "blur(12px)" }}
    >
      <div className="text-5xl mb-4">😕</div>
      <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--mg-ink)" }}>We couldn't load this</h3>
      <p className="text-sm mb-6" style={{ color: "var(--mg-ink-soft)" }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-full font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 8px 20px -6px var(--mg-glow)" }}
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}

function EmptyBlock({ message }) {
  return (
    <div className="rounded-3xl p-8 text-center mx-auto max-w-md" style={{ background: "var(--mg-glass)", border: "2px solid var(--mg-border)", backdropFilter: "blur(12px)" }}>
      <div className="text-5xl mb-4">📭</div>
      <p className="text-sm" style={{ color: "var(--mg-ink-soft)" }}>{message}</p>
    </div>
  );
}

// ─── Waveform Animation Component ─────────────────────────────────────
function WaveformAnimation() {
  const bars = Array.from({ length: 20 });
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: "linear-gradient(180deg, var(--mg-accent), var(--mg-accent-strong))",
            boxShadow: "0 0 8px var(--mg-glow)"
          }}
          animate={{ height: [8, 24, 8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

// ─── Score Ring ────────────────────────────────────────────────────────
function ScoreRing({ value, color }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="8" />
        <motion.circle
          cx="64" cy="64" r={radius}
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - Math.min(value, 100) / 100) }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-display font-extrabold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          {Math.round(value)}%
        </motion.span>
      </div>
    </div>
  );
}

// ─── Score Card Component ─────────────────────────────────────────────
function ScoreCard({ result, expectedText, spokenText, onRetry, onNext, hasNext, lessonCompleted, moduleCompleted }) {
  if (!result || typeof result !== "object") {
    return <EmptyBlock message="No pronunciation result available." />;
  }

  const {
    overall_score = 0,
    accuracy_percent = 0,
    confidence_score = 0,
    correctly_pronounced = [],
    incorrect_words = [],
    missing_words = [],
    suggestions = [],
    feedback = "",
    difficulty = 1,
    xp_earned = 0,
  } = result;

  const getGradeColor = (score) => {
    if (score >= 80) return "#22C55E";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getGradeEmoji = (score) => {
    if (score >= 80) return "🌟";
    if (score >= 60) return "💪";
    return "📚";
  };

  const getGradeText = (score) => {
    if (score >= 90) return "Excellent Pronunciation!";
    if (score >= 75) return "Very Good!";
    if (score >= 60) return "Good Job!";
    if (score >= 40) return "Keep Practicing";
    return "Try Again";
  };

  const isPassing = overall_score >= 60;
  const color = getGradeColor(overall_score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="mx-auto"
      style={{ maxWidth: 560 }}
    >
      <div className="rounded-[2rem] p-6 md:p-8 text-center relative overflow-hidden" style={{ background: "var(--mg-glass)", border: "2px solid var(--mg-border)", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}>
        {/* Decorative glow */}
        <div className="absolute inset-0 opacity-20 blur-2xl" style={{ background: `radial-gradient(circle at top, ${color}40 0%, transparent 60%)` }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-5">
            <motion.div
              className="text-6xl mb-3"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {getGradeEmoji(overall_score)}
            </motion.div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl" style={{ color: "var(--mg-ink)" }}>
              {getGradeText(overall_score)}
            </h2>
            {feedback && (
              <p className="text-sm mt-2" style={{ color: "var(--mg-ink-soft)" }}>{feedback}</p>
            )}
          </div>

          {/* Score Ring */}
          <div className="mb-5">
            <ScoreRing value={overall_score} color={color} />
            <p className="text-xs font-medium mt-2" style={{ color: "var(--mg-ink-soft)" }}>
              Pronunciation Score
            </p>
          </div>

          {/* You said / Expected */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="rounded-2xl p-4 text-left" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--mg-ink-soft)" }}>You said</p>
              <p className="text-base font-medium break-words" style={{ color: "var(--mg-ink)" }}>
                {spokenText || "—"}
              </p>
            </div>
            <div className="rounded-2xl p-4 text-left" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--mg-ink-soft)" }}>Expected</p>
              <p className="text-base font-medium break-words" style={{ color: "var(--mg-ink)" }}>
                {expectedText || "—"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-2xl p-3 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-[11px] mb-1 uppercase tracking-wide" style={{ color: "var(--mg-ink-soft)" }}>Accuracy</p>
              <p className="text-lg font-bold font-display" style={{ color }}>{Math.round(accuracy_percent)}%</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-[11px] mb-1 uppercase tracking-wide" style={{ color: "var(--mg-ink-soft)" }}>Confidence</p>
              <p className="text-lg font-bold font-display" style={{ color: "var(--mg-accent)" }}>{Math.round(confidence_score || 0)}%</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-[11px] mb-1 uppercase tracking-wide" style={{ color: "var(--mg-ink-soft)" }}>Difficulty</p>
              <p className="text-lg font-display" style={{ color: "var(--mg-ink)" }}>{"⭐".repeat(difficulty || 1)}</p>
            </div>
          </div>

          {/* Correctly pronounced */}
          {isPassing && correctly_pronounced?.length > 0 && (
            <div className="mb-4 text-left">
              <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "#22C55E" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Correct pronunciation
              </p>
              <div className="flex flex-wrap gap-1.5">
                {correctly_pronounced.map((word, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22C55E", border: "1px solid rgba(34, 197, 94, 0.3)" }}>{word}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing / incorrect words */}
          {(missing_words?.length > 0 || incorrect_words?.length > 0) && (
            <div className="mb-4 text-left">
              <p className="text-xs font-semibold mb-2" style={{ color: "#F59E0B" }}>Focus on these words</p>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set([...(incorrect_words || []), ...(missing_words || [])])].map((word, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", border: "1px solid rgba(245, 158, 11, 0.3)" }}>{word}</span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions?.length > 0 && (
            <div className="mb-5 text-left">
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--mg-ink)" }}>Tips</p>
              <ul className="space-y-1.5">
                {suggestions.slice(0, 4).map((s, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--mg-ink-soft)" }}>
                    <span style={{ color: "var(--mg-accent)" }}>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* XP earned */}
          <motion.div
            className="rounded-2xl p-3 mb-6"
            style={{ background: "linear-gradient(135deg, rgba(255,200,87,0.15), rgba(255,200,87,0.06))", border: "1px solid rgba(255,200,87,0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm font-bold" style={{ color: "var(--mg-gold)" }}>
              {xp_earned > 0 ? `+${xp_earned} XP earned` : "Try again to earn XP"}
            </p>
          </motion.div>

          {/* Lesson completed banner */}
          {lessonCompleted && (
            <div className="rounded-2xl p-3 mb-6" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.06))", border: "1px solid rgba(34,197,94,0.3)" }}>
              <p className="text-sm font-bold" style={{ color: "#22C55E" }}>🎉 Lesson Complete! +{xp_earned} XP</p>
            </div>
          )}

          {/* Module completed banner */}
          {moduleCompleted && (
            <div className="rounded-2xl p-3 mb-6" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.06))", border: "1px solid rgba(139,92,246,0.3)" }}>
              <p className="text-sm font-bold" style={{ color: "var(--mg-accent)" }}>🎊 Module Complete!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 rounded-full py-3 flex items-center justify-center gap-1.5 font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", color: "var(--mg-ink)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Try Again
            </button>
            {hasNext && (
              <button
                onClick={onNext}
                className="flex-1 rounded-full py-3 flex items-center justify-center gap-1.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 8px 20px -6px var(--mg-glow)" }}
              >
                Next Exercise
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Lesson Summary / Completion Screen ──────────────────────────────
function LessonSummary({ lesson, stats, onContinue, onRetryLesson }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="mx-auto"
      style={{ maxWidth: 560 }}
    >
      <div className="rounded-[2rem] p-8 text-center relative overflow-hidden" style={{ background: "var(--mg-glass)", border: "2px solid var(--mg-border)", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}>
        <div className="absolute inset-0 opacity-15 blur-2xl" style={{ background: "radial-gradient(circle at top, rgba(34,197,94,0.4) 0%, transparent 60%)" }} />
        <div className="relative z-10">
          <motion.div
            className="text-7xl mb-4"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            🎉
          </motion.div>
          <h2 className="font-display font-extrabold text-3xl mb-2" style={{ color: "var(--mg-ink)" }}>
            Lesson Complete!
          </h2>
          <p className="text-lg mb-6" style={{ color: "var(--mg-ink-soft)" }}>{lesson.title}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--mg-ink-soft)" }}>Exercises</p>
              <p className="text-2xl font-bold font-display" style={{ color: "var(--mg-ink)" }}>
                {stats.completedExercises}/{stats.totalExercises}
              </p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--mg-ink-soft)" }}>Avg. Pronunciation</p>
              <p className="text-2xl font-bold font-display" style={{ color: "var(--mg-accent)" }}>
                {Math.round(stats.averageScore)}%
              </p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--mg-ink-soft)" }}>XP Earned</p>
              <p className="text-2xl font-bold font-display" style={{ color: "var(--mg-gold)" }}>
                +{stats.xpEarned}
              </p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--mg-ink-soft)" }}>Accuracy</p>
              <p className="text-2xl font-bold font-display" style={{ color: "#22C55E" }}>
                {Math.round(stats.accuracy)}%
              </p>
            </div>
          </div>

          {/* Words to practice */}
          {stats.wordsToPractice?.length > 0 && (
            <div className="mb-6 text-left">
              <p className="text-xs font-semibold mb-2" style={{ color: "#F59E0B" }}>Practice these words:</p>
              <div className="flex flex-wrap gap-1.5">
                {stats.wordsToPractice.slice(0, 10).map((word, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>{word}</span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRetryLesson}
              className="flex-1 rounded-full py-3 flex items-center justify-center gap-1.5 font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", color: "var(--mg-ink)" }}
            >
              Practice Again
            </button>
            <button
              onClick={onContinue}
              className="flex-1 rounded-full py-3 flex items-center justify-center gap-1.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 8px 20px -6px var(--mg-glow)" }}
            >
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
          {stats.isModuleComplete && (
            <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.06))", border: "1px solid rgba(139,92,246,0.3)" }}>
              <p className="text-sm font-bold" style={{ color: "var(--mg-accent)" }}>
                🎊 Module Complete! All lessons finished.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Module Complete Screen ───────────────────────────────────────────
function ModuleComplete({ module, stats, onNext, onHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="mx-auto"
      style={{ maxWidth: 560 }}
    >
      <div className="rounded-[2rem] p-8 text-center relative overflow-hidden" style={{ background: "var(--mg-glass)", border: "2px solid var(--mg-border)", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}>
        <div className="absolute inset-0 opacity-15 blur-2xl" style={{ background: "radial-gradient(circle at top, rgba(255,200,87,0.5) 0%, transparent 60%)" }} />
        <div className="relative z-10">
          <motion.div className="text-7xl mb-4" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
            🎊
          </motion.div>
          <h2 className="font-display font-extrabold text-3xl mb-2" style={{ color: "var(--mg-ink)" }}>Module Complete!</h2>
          <p className="text-lg mb-6" style={{ color: "var(--mg-ink-soft)" }}>{module.title}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--mg-ink-soft)" }}>Progress</p>
              <p className="text-xl font-bold font-display" style={{ color: "var(--mg-ink)" }}>{Math.round(stats.progress)}%</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--mg-ink-soft)" }}>Score</p>
              <p className="text-xl font-bold font-display" style={{ color: "var(--mg-accent)" }}>{Math.round(stats.averageScore)}%</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--mg-ink-soft)" }}>XP</p>
              <p className="text-xl font-bold font-display" style={{ color: "var(--mg-gold)" }}>+{stats.xpEarned}</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 mb-6" style={{ background: "linear-gradient(135deg, rgba(255,200,87,0.15), rgba(255,200,87,0.06))", border: "1px solid rgba(255,200,87,0.3)" }}>
            <p className="text-base font-bold" style={{ color: "var(--mg-gold)" }}>
              🌱 Badge earned: {module.title} Master
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onHome}
              className="flex-1 rounded-full py-3 px-4 font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", color: "var(--mg-ink)" }}
            >
              Back to Modules
            </button>
            {onNext && (
              <button
                onClick={onNext}
                className="flex-1 rounded-full py-3 px-4 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 8px 20px -6px var(--mg-glow)" }}
              >
                Next Module
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Exercise Card (picture + word + listen + mic) ───────────────────
function ExerciseContent({ exercise, index, total, isPlaying, onListen, micSupported, isListening, duration, isProcessing, transcript, onMicClick, onSubmit, displayError, hasRecordedTranscript, audioBlob }) {
  const gradientStyles = [
    "linear-gradient(135deg, rgba(76,175,125,0.15), rgba(76,175,125,0.05))",
    "linear-gradient(135deg, rgba(255,200,87,0.15), rgba(255,200,87,0.05))",
    "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.05))",
    "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(56,189,248,0.05))",
  ];
  const bg = gradientStyles[index % gradientStyles.length];

  return (
    <motion.div
      key={exercise?.id || index}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Picture + word card */}
      <motion.div
        className="rounded-[2rem] p-6 md:p-8 text-center relative overflow-hidden"
        style={{ background: "var(--mg-glass)", border: "2px solid var(--mg-border)", backdropFilter: "blur(20px)" }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
      >
        {/* Letter badge for alphabet exercises */}
        {exercise?.category === "alphabet" && exercise?.expected_text && (
          <div className="mb-4">
            <span
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-4xl font-display font-extrabold text-white"
              style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 8px 20px -6px var(--mg-glow)" }}
            >
              {exercise.expected_text.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Image */}
        {exercise?.image_url ? (
          <div className="flex justify-center mb-5">
            <motion.img
              src={exercise.image_url}
              alt={exercise.image_alt || exercise.expected_text}
              className="rounded-2xl object-cover shadow-lg max-h-56"
              style={{ border: "2px solid var(--mg-border)", maxWidth: "100%" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        ) : (
          <div className="flex justify-center mb-5">
            <div className="w-40 h-40 rounded-2xl flex items-center justify-center text-6xl" style={{ background: "var(--mg-bg)", border: "2px solid var(--mg-border)" }}>
              {exercise?.category === "alphabet" && exercise?.expected_text
                ? "🔤"
                : "🖼️"}
            </div>
          </div>
        )}

        {/* Word */}
        <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--mg-accent)" }}>
          {exercise?.category === "alphabet" ? `${exercise.expected_text?.charAt(0)} is for ${exercise.expected_text}` : "Say this aloud"}
        </p>
        <h3 className="text-3xl md:text-4xl font-display font-extrabold mb-3 break-words" style={{ color: "var(--mg-ink)" }}>
          {exercise?.expected_text || "—"}
        </h3>

        {/* Phonetic */}
        {exercise?.phonetic_text && (
          <p className="text-sm mb-3" style={{ color: "var(--mg-ink-soft)" }}>
            /{exercise.phonetic_text}/
          </p>
        )}

        {/* Exercise description / instruction */}
        {exercise?.description && (
          <p className="text-sm mb-4" style={{ color: "var(--mg-ink-soft)" }}>{exercise.description}</p>
        )}

        {/* Difficulty + XP */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-xs font-medium" style={{ color: "var(--mg-ink-soft)" }}>
            Difficulty: {"⭐".repeat(exercise?.difficulty || 1)}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,200,87,0.15)", color: "#B45309", border: "1px solid rgba(255,200,87,0.3)" }}>
            +{exercise?.xp_reward || 5} XP
          </span>
        </div>
      </motion.div>

      {/* Listen + Mic card */}
      <motion.div
        className="rounded-[2rem] p-6 md:p-8 relative overflow-hidden"
        style={{ background: bg, border: "2px solid var(--mg-border)", backdropFilter: "blur(20px)" }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Listen button */}
          <button
            onClick={onListen}
            disabled={isPlaying || isProcessing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))",
              color: "white",
              boxShadow: "0 8px 20px -6px var(--mg-glow)"
            }}
          >
            {isPlaying ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 animate-spin" style={{ borderTopColor: "white" }} />
                Playing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                Listen
              </>
            )}
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-3" style={{ color: "var(--mg-border)" }}>
            <div className="flex-1 h-px" style={{ background: "var(--mg-border)" }} />
            <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--mg-ink-soft)" }}>Speak</span>
            <div className="flex-1 h-px" style={{ background: "var(--mg-border)" }} />
          </div>

          {/* Timer */}
          {isListening && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-3xl font-display font-extrabold tabular-nums" style={{ color: "var(--mg-accent)" }}>
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
            </motion.div>
          )}

          {/* Waveform */}
          {isListening && <WaveformAnimation />}

          {/* Mic button */}
          {micSupported ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onMicClick}
              disabled={isProcessing}
              className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-60"
              style={{
                background: isListening
                  ? "linear-gradient(135deg, #EF4444, #DC2626)"
                  : "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))",
                boxShadow: isListening
                  ? "0 0 30px rgba(239, 68, 68, 0.5)"
                  : "0 8px 24px -6px var(--mg-glow)"
              }}
            >
              {isListening && (
                <>
                  <motion.span className="absolute inset-0 rounded-full" style={{ border: "3px solid rgba(239,68,68,0.4)" }} animate={{ scale: [1, 1.3], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <motion.span className="absolute inset-0 rounded-full" style={{ border: "3px solid rgba(239,68,68,0.3)" }} animate={{ scale: [1, 1.5], opacity: [0.4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                </>
              )}

              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
              )}
            </motion.button>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl opacity-50 mx-auto mb-2" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>🎙️</div>
              <p className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>Microphone not supported in this browser.<br />Use Chrome, Edge, or Safari to practice speaking.</p>
            </div>
          )}

          {/* Status label */}
          <p className="text-xs text-center" style={{ color: "var(--mg-ink-soft)" }}>
            {isListening
              ? "Recording... tap to stop"
              : isProcessing
                ? "Analyzing your pronunciation..."
                : micSupported
                  ? "Tap the microphone and say it aloud"
                  : "Enable microphone access in browser settings"}
          </p>

          {/* Error display */}
          {displayError && (
            <div className="w-full rounded-2xl p-3 text-xs text-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>
              {displayError}
            </div>
          )}

          {/* Transcript display */}
          {transcript && !hasRecordedTranscript && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full rounded-2xl p-4" style={{ background: "var(--mg-bg)", border: "1px solid var(--mg-border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--mg-ink-soft)" }}>You said:</p>
              <p className="text-sm" style={{ color: "var(--mg-ink)" }}>{transcript}</p>
            </motion.div>
          )}

          {/* Submit */}
          {(audioBlob || transcript) && !isListening && !isProcessing && !hasRecordedTranscript && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSubmit}
              className="w-full rounded-full py-3.5 flex items-center justify-center gap-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 8px 24px -6px var(--mg-glow)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Check Pronunciation
            </motion.button>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--mg-ink-soft)" }}>
              <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "var(--mg-accent)", borderTopColor: "transparent" }} />
              Evaluating your pronunciation...
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Pronunciation Page ─────────────────────────────────────────
export default function PronunciationPage() {
  const { user, refreshUser } = useAuth();
  const [view, setView] = useState("modules"); // modules | lessons | exercises | summary
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [fullLesson, setFullLesson] = useState(null); // lesson with exercises loaded from API
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [apiError, setApiError] = useState("");
  const [result, setResult] = useState(null);
  const [duration, setDuration] = useState(0);
  const [lessonStats, setLessonStats] = useState(null);
  const [moduleCompleteData, setModuleCompleteData] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const timerRef = useRef(null);

  const {
    supported: micSupported,
    isRecording: isListening,
    isProcessing,
    audioBlob,
    error: speechError,
    transcript: recordedTranscript,
    startRecording,
    stopRecording,
    clearRecording,
    setError: setSpeechError,
    setIsProcessing: setRecorderProcessing,
  } = useMediaRecorder();

  // ── Load modules ───────────────────────────────────────────────────
  const loadModules = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await client.get("/pronunciation/modules");
      setModules(res.data);
      setLoading(false);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load pronunciation modules.";
      setApiError(msg);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  // ── Select lesson (fetch full lesson with exercises) ──────────────
  const selectLessonById = useCallback(async (lessonId, exerciseId = null, moduleId = null) => {
    setLoadingLesson(true);
    setApiError("");
    try {
      // Fetch module if provided
      let mod = null;
      if (moduleId) {
        const modRes = await client.get(`/pronunciation/modules/${moduleId}`);
        mod = modRes.data;
      }
      setSelectedModule(mod);

      const res = await client.get(`/pronunciation/lessons/${lessonId}`);
      const lessonData = res.data;
      setSelectedLesson({ id: lessonData.id, title: lessonData.title, module_id: lessonData.module_id });
      setFullLesson(lessonData);

      // Determine starting exercise index from resume position
      let startIndex = 0;
      if (exerciseId) {
        const idx = (lessonData.exercises || []).findIndex((e) => e.id === exerciseId);
        if (idx >= 0) startIndex = idx;
      } else if (lessonData.progress?.current_exercise_order) {
        const orderTarget = lessonData.progress.current_exercise_order;
        const idx = (lessonData.exercises || []).findIndex((e) => e.order >= orderTarget);
        if (idx >= 0) startIndex = idx;
      }

      setCurrentExerciseIndex(startIndex);
      setResult(null);
      setLessonStats(null);
      setTranscript("");
      clearRecording();
      setSpeechError("");
      setView("exercises");
      setLoadingLesson(false);
      setLoading(false);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load lesson.";
      setApiError(msg);
      setFullLesson(null);
      setLoadingLesson(false);
      setLoading(false);
    }
  }, [clearRecording, setSpeechError]);

  // ── Resume position (progress persistence) ─────────────────────────
  useEffect(() => {
    if (!loading) return;
    client.get("/pronunciation/resume").then((res) => {
      const r = res.data?.resume;
      if (r?.lesson_id) {
        selectLessonById(r.lesson_id, r.exercise_id, r.module_id);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });
  }, [loading, selectLessonById]);

  // ── Timer for recording duration ───────────────────────────────────
  useEffect(() => {
    if (isListening) {
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  // ── TTS with speaking state ────────────────────────────────────────
  const handleSpeak = useCallback((text) => {
    if (!text) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // ── Computed current exercise ──────────────────────────────────────
  const exercises = fullLesson?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const hasNext = currentExerciseIndex < exercises.length - 1;
  const displayError = speechError || apiError;

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    setApiError("");
    setView("lessons");
  };

  const handleSelectLesson = (lesson) => {
    selectLessonById(lesson.id, null, lesson.module_id);
  };

  // ── Submit pronunciation result (audio upload) ─────────────────────
  const handleSubmit = useCallback(async () => {
    if ((!audioBlob && !recordedTranscript) || !currentExercise || !selectedLesson || !selectedModule) return;

    setRecorderProcessing(true);
    setApiError("");
    setSpeechError("");

    try {
      const formData = new FormData();
      if (audioBlob) formData.append("audio", audioBlob, "recording.webm");
      formData.append("exercise_id", currentExercise.id);
      formData.append("lesson_id", selectedLesson.id);
      formData.append("module_id", selectedModule.id);
      formData.append("duration", duration);
      if (recordedTranscript) formData.append("transcript", recordedTranscript);

      const res = await client.post("/pronunciation/audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
      if (res.data.transcript) {
        setTranscript(res.data.transcript);
      }
      clearRecording();

      // Refresh user XP if changed
      if (res.data.xp_earned > 0) {
        client.get("/auth/me").then((meRes) => {
          if (meRes.data && refreshUser) refreshUser(meRes.data);
        }).catch(() => {});
      }

      // Handle lesson completion
      if (res.data.lesson_completed) {
        // Refresh the lesson to get updated progress
        const lessonRes = await client.get(`/pronunciation/lessons/${selectedLesson.id}`);
        const exercisesData = lessonRes.data.exercises || [];
        const total = exercisesData.length;
        const scores = exercisesData.filter((e) => e.best_score).map((e) => e.best_score);
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const completed = exercisesData.filter((e) => e.best_score && e.best_score >= 60).length;

        const mispronounced = new Set();
        exercisesData.forEach((e) => {
          if (e.best_score && e.best_score < 60) {
            (e.expected_text || "").split(" ").forEach((w) => mispronounced.add(w.toLowerCase()));
          }
        });

        setLessonStats({
          totalExercises: total,
          completedExercises: completed,
          averageScore: avgScore,
          xpEarned: res.data.xp_earned || lessonRes.data.xp_reward || 0,
          perfectWords: Math.round(avgScore / 10),
          wordsToPractice: Array.from(mispronounced),
          accuracy: avgScore,
          isModuleComplete: res.data.exercises_completed >= res.data.exercises_total,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to evaluate. Please try again.";
      setApiError(msg);
    } finally {
      setRecorderProcessing(false);
    }
  }, [audioBlob, recordedTranscript, currentExercise, selectedLesson, selectedModule, duration, refreshUser, clearRecording, setSpeechError, setRecorderProcessing]);

  // ── Recording handlers ────────────────────────────────────────────
  const handleMicClick = () => {
    if (isProcessing) return;
    setApiError("");
    setSpeechError("");
    if (isListening) {
      stopRecording();
    } else {
      setTranscript("");
      clearRecording();
      startRecording();
    }
  };

  // ── Navigation ────────────────────────────────────────────────────
  const handleRetry = () => {
    setResult(null);
    setApiError("");
    setTranscript("");
    clearRecording();
    setSpeechError("");
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentExerciseIndex((i) => i + 1);
      setResult(null);
      setApiError("");
      setTranscript("");
      clearRecording();
      setSpeechError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (lessonStats) {
      // Lesson is complete — show summary
      setView("summary");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Last exercise - check completion status
      setView("summary");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleContinueFromSummary = useCallback(async () => {
    setView("modules");
    setSelectedLesson(null);
    setFullLesson(null);
    setSelectedModule(null);
    setCurrentExerciseIndex(0);
    setResult(null);
    setLessonStats(null);
    setModuleCompleteData(null);
    setTranscript("");
    clearRecording();
    setSpeechError("");
    await loadModules();

    // Check if the module is fully completed
    if (selectedModule) {
      try {
        const res = await client.get(`/pronunciation/modules/${selectedModule.id}`);
        const progress = res.data.progress;
        if (progress?.status === "completed") {
          const totalLessons = progress.lessons_total || 0;
          const moduleInfo = modules.find((m) => m.id === selectedModule.id);
          setModuleCompleteData({
            module: moduleInfo || selectedModule,
            stats: {
              progress: 100,
              averageScore: progress.average_score || 0,
              xpEarned: progress.xp_earned || 0,
            },
          });
          setView("summary");
        }
      } catch (e) {
        // ignore - still show modules page
      }
    }
  }, [loadModules, selectedModule, modules, clearRecording, setSpeechError]);

  const handleRetryLesson = () => {
    setCurrentExerciseIndex(0);
    setResult(null);
    setApiError("");
    setTranscript("");
    clearRecording();
    setSpeechError("");
    setView("exercises");
  };

  const handleBackToModules = () => {
    setView("modules");
    setSelectedModule(null);
    setSelectedLesson(null);
    setFullLesson(null);
    setResult(null);
    setApiError("");
    setTranscript("");
    clearRecording();
    setSpeechError("");
  };

  const handleBackToLessons = () => {
    setView("lessons");
    setSelectedLesson(null);
    setFullLesson(null);
    setResult(null);
    setApiError("");
    setTranscript("");
    clearRecording();
    setSpeechError("");
  };

  // ── Go to next module from module complete screen ────────────────
  const handleNextModule = useCallback(async () => {
    if (!selectedModule) {
      setView("modules");
      setModuleCompleteData(null);
      return;
    }
    // Find the next module in the sequence
    const currentIdx = modules.findIndex((m) => m.id === selectedModule.id);
    const nextModule = currentIdx >= 0 ? modules[currentIdx + 1] : null;
    if (nextModule) {
      setModuleCompleteData(null);
      setView("modules");
      // Navigate to next module's lessons
      setSelectedModule(nextModule);
      setApiError("");
      setView("lessons");
    } else {
      setModuleCompleteData(null);
      setSelectedModule(null);
      setView("modules");
    }
  }, [modules, selectedModule]);

  // ── Render loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: "var(--mg-bg)" }}>
        <Sidebar />
        <main className="flex-1 flex items-center justify-center px-4">
          <LoadingBlock label="Loading pronunciation modules..." />
        </main>
      </div>
    );
  }

  // ── Render main ────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen" style={{ background: "var(--mg-bg)" }}>
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 w-full">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "var(--mg-ink)" }}>
                  🎤 Pronunciation Practice
                </h1>
                <p className="text-base mt-2" style={{ color: "var(--mg-ink-soft)" }}>
                  {view === "modules" && "Improve your speaking one sound at a time."}
                  {view === "lessons" && "Choose a lesson to continue your journey."}
                  {view === "exercises" && "Listen, repeat, and perfect your pronunciation."}
                  {view === "summary" && "Great progress!"}
                </p>
              </div>
              {(view === "lessons" || view === "exercises") && (
                <button
                  onClick={view === "lessons" ? handleBackToModules : handleBackToLessons}
                  className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:shadow-md"
                  style={{ color: "var(--mg-accent)", border: "1px solid var(--mg-border)", background: "var(--mg-glass)" }}
                >
                  ← {view === "lessons" ? "Back to Modules" : "Back to Lessons"}
                </button>
              )}
            </div>
          </motion.div>

          {/* Modules View */}
          {view === "modules" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {apiError ? (
                <ErrorBlock message={apiError} onRetry={loadModules} />
              ) : modules.length === 0 ? (
                <EmptyBlock message="No pronunciation modules are available yet." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => {
                    const isInProgress = module.progress?.status === "in_progress";
                    const isCompleted = module.progress?.status === "completed";
                    const progressPct = module.progress && module.progress.lessons_total > 0
                      ? Math.round((module.progress.lessons_completed / module.progress.lessons_total) * 100)
                      : 0;

                    return (
                      <motion.div
                        key={module.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectModule(module)}
                        className="rounded-[2rem] p-6 cursor-pointer relative overflow-hidden transition-shadow"
                        style={{
                          background: "var(--mg-glass)",
                          border: isInProgress ? "2px solid rgba(76,175,125,0.4)" : "2px solid var(--mg-border)",
                          backdropFilter: "blur(20px)",
                          boxShadow: isInProgress ? "0 8px 24px -8px var(--mg-glow)" : "none"
                        }}
                      >
                        {/* Decorative gradient circle */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: module.color || "var(--mg-accent)" }} />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-4xl">{module.icon}</span>
                              <div>
                                <h3 className="font-display font-extrabold text-xl" style={{ color: "var(--mg-ink)" }}>
                                  Level {module.order} · {module.title}
                                </h3>
                                <p className="text-xs font-medium mt-0.5" style={{ color: "var(--mg-accent)" }}>
                                  {["Beginner", "Elementary", "Intermediate", "Upper-Interm.", "Advanced"][Math.min(module.difficulty - 1, 4)] || "Beginner"}
                                </p>
                              </div>
                            </div>
                            {isCompleted && <span className="text-2xl">✅</span>}
                            {isInProgress && <span className="text-2xl">🔥</span>}
                          </div>

                          <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--mg-ink-soft)" }}>
                            {module.description}
                          </p>

                          {/* Progress bar */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-medium" style={{ color: "var(--mg-ink-soft)" }}>
                                {module.progress?.lessons_completed || 0}/{module.progress?.lessons_total || module.lesson_count} lessons
                              </span>
                              <span className="text-xs font-semibold" style={{ color: "var(--mg-accent)" }}>
                                {progressPct}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--mg-border)" }}>
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ background: "linear-gradient(90deg, var(--mg-accent), var(--mg-accent-strong))" }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "var(--mg-bg)", color: "var(--mg-ink-soft)", border: "1px solid var(--mg-border)" }}>
                              {module.lesson_count} lessons
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: "var(--mg-accent)" }}>
                              {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Lessons View */}
          {view === "lessons" && selectedModule && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="mb-6 rounded-[2rem] p-6 relative overflow-hidden" style={{ background: "var(--mg-glass)", border: "2px solid var(--mg-border)", backdropFilter: "blur(20px)" }}>
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: selectedModule.color || "var(--mg-accent)" }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{selectedModule.icon}</span>
                    <div>
                      <h2 className="font-display font-extrabold text-2xl" style={{ color: "var(--mg-ink)" }}>
                        {selectedModule.title}
                      </h2>
                      <p className="text-xs" style={{ color: "var(--mg-accent)" }}>
                        Level {selectedModule.order}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mt-2" style={{ color: "var(--mg-ink-soft)" }}>{selectedModule.description}</p>
                </div>
              </div>

              {selectedModule.lessons?.map((lesson) => {
                const isCompleted = lesson.progress?.status === "completed";
                const isInProgress = lesson.progress?.status === "in_progress";
                const pct = lesson.progress && lesson.progress.exercises_total > 0
                  ? Math.round((lesson.progress.exercises_completed / lesson.progress.exercises_total) * 100)
                  : 0;

                return (
                  <motion.div
                    key={lesson.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSelectLesson(lesson)}
                    className="rounded-[1.5rem] p-5 cursor-pointer"
                    style={{
                      background: "var(--mg-glass)",
                      border: isInProgress ? "2px solid rgba(76,175,125,0.4)" : "2px solid var(--mg-border)",
                      backdropFilter: "blur(20px)"
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-lg mb-1" style={{ color: "var(--mg-ink)" }}>
                          {lesson.title}
                        </h3>
                        <p className="text-xs mb-2 line-clamp-1" style={{ color: "var(--mg-ink-soft)" }}>
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>
                            ⭐ {lesson.difficulty}
                          </span>
                          <span className="text-xs" style={{ color: "var(--mg-ink-soft)" }}>
                            📚 {lesson.exercise_count} exercises
                          </span>
                          <span className="text-xs font-semibold" style={{ color: "var(--mg-accent)" }}>
                            +{lesson.xp_reward} XP
                          </span>
                        </div>
                        {isInProgress && lesson.progress?.exercises_total > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--mg-border)" }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--mg-accent), var(--mg-accent-strong))" }} />
                            </div>
                            <span className="text-[10px] font-semibold" style={{ color: "var(--mg-accent)" }}>
                              {Math.round(pct)}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {isCompleted ? (
                          <span className="text-3xl">✅</span>
                        ) : isInProgress ? (
                          <span className="text-3xl">🔥</span>
                        ) : (
                          <span className="text-3xl opacity-60">▶️</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Exercises View */}
          {view === "exercises" && (
            <>
              {/* Loading lesson */}
              {loadingLesson && (
                <LoadingBlock label="Loading pronunciation exercise..." />
              )}

              {/* Error loading lesson */}
              {!loadingLesson && apiError && !currentExercise && (
                <ErrorBlock
                  message={apiError}
                  onRetry={() => selectedLesson && selectLessonById(selectedLesson.id, null, selectedLesson.module_id)}
                />
              )}

              {/* Empty exercises */}
              {!loadingLesson && !apiError && exercises.length === 0 && (
                <EmptyBlock message="No pronunciation exercises are available for this lesson yet." />
              )}

              {/* Progress bar */}
              {!loadingLesson && exercises.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: "var(--mg-ink-soft)" }}>
                      Exercise {Math.min(currentExerciseIndex + 1, exercises.length)} of {exercises.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: "var(--mg-ink-soft)" }}>
                        {selectedLesson?.title}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--mg-accent)" }}>
                        {exercises.length > 0 ? Math.round(((currentExerciseIndex + 1) / exercises.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--mg-border)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${exercises.length > 0 ? ((currentExerciseIndex + 1) / exercises.length) * 100 : 0}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ background: "linear-gradient(90deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 0 12px var(--mg-glow)" }}
                    />
                  </div>
                </div>
              )}

              {/* Result view */}
              {result ? (
                <ScoreCard
                  result={result}
                  expectedText={currentExercise?.expected_text}
                  spokenText={transcript}
                  onRetry={handleRetry}
                  onNext={handleNext}
                  hasNext={hasNext || Boolean(lessonStats) || result.lesson_completed}
                  lessonCompleted={result.lesson_completed}
                />
              ) : (
                !loadingLesson && currentExercise && (
                  <ExerciseContent
                    exercise={currentExercise}
                    index={currentExerciseIndex}
                    total={exercises.length}
                    isPlaying={isSpeaking}
                    onListen={() => handleSpeak(currentExercise.expected_text)}
                    micSupported={micSupported}
                    isListening={isListening}
                    duration={duration}
                    isProcessing={isProcessing}
                    transcript={recordedTranscript}
                    onMicClick={handleMicClick}
                    onSubmit={handleSubmit}
                    displayError={displayError}
                    hasRecordedTranscript={Boolean(result)}
                    audioBlob={audioBlob}
                  />
                )
              )}
            </>
          )}

          {/* Summary / Lesson Completion View */}
          {view === "summary" && lessonStats && !moduleCompleteData && (
            <LessonSummary
              lesson={selectedLesson}
              stats={lessonStats}
              onContinue={handleContinueFromSummary}
              onRetryLesson={handleRetryLesson}
            />
          )}

          {/* Module Complete View */}
          {view === "summary" && moduleCompleteData && (
            <ModuleComplete
              module={moduleCompleteData.module}
              stats={moduleCompleteData.stats}
              onHome={handleContinueFromSummary}
              onNext={handleNextModule}
            />
          )}
        </div>
      </main>
    </div>
  );
}