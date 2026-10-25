import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import useSpeechProvider from "../hooks/useSpeechProvider";
import SpeakingExercise from "../components/voice/SpeakingExercise";
import ConversationExercise from "../components/voice/ConversationExercise";
import AIChatPanel from "../components/AIChatPanel";

// ✦ ─── Vocabulary Section ──────────────────────────────────────────
function VocabularySection({ vocab, speak }) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? vocab : vocab.slice(0, 5);

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg text-ink-light dark:text-ink-dark">
          📖 Vocabulary
        </h2>
        <span className="text-xs text-soft-400">{vocab.length} words</span>
      </div>
      <div className="flex flex-col gap-3">
        {display.map((w) => (
          <motion.div
            key={w.id || w.word}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-4 hover:bg-soft-100 dark:hover:bg-soft-800 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display font-bold text-ink-light dark:text-ink-dark">{w.word}</p>
                {w.pronunciation_text && (
                  <span className="text-xs text-soft-400">/{w.pronunciation_text}/</span>
                )}
                {w.part_of_speech && (
                  <span className="badge-primary text-[10px]">{w.part_of_speech}</span>
                )}
              </div>
              <p className="text-sm text-soft-500 mt-0.5">{w.meaning}</p>
              {w.example_sentence && (
                <p className="text-xs text-soft-400 italic mt-1">"{w.example_sentence}"</p>
              )}
            </div>
            <button
              onClick={() => speak(w.word)}
              className="w-9 h-9 rounded-xl2 bg-white dark:bg-surface-dark-alt flex items-center justify-center shrink-0 ml-3 hover:bg-soft-100 dark:hover:bg-soft-700 transition-colors shadow-soft"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-soft-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
      {vocab.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-primary-500 dark:text-primary-400 font-semibold hover:underline"
        >
          {showAll ? "Show less ↑" : `Show all ${vocab.length} words ↓`}
        </button>
      )}
    </div>
  );
}

// ✦ ─── Questions Section ───────────────────────────────────────────
function QuestionsSection({ questions, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);

  const handleAnswer = (answer) => {
    if (submitted) return;
    setAnswers({ ...answers, [currentQ]: answer });
  };

  const submitQuiz = () => {
    const newResults = questions.map((q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
      return { 
        question: q.question_text,
        userAnswer, 
        correctAnswer: q.correct_answer,
        isCorrect 
      };
    });
    setResults(newResults);
    setSubmitted(true);
    const score = Math.round((newResults.filter(r => r.isCorrect).length / questions.length) * 100);
    setTimeout(() => onFinish(score, newResults), 3000);
  };

  if (submitted) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const incorrectCount = questions.length - correctCount;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
        <div className="text-5xl mb-4">{correctCount === questions.length ? "🎉" : "💪"}</div>
        <h3 className="font-display font-extrabold text-3xl text-ink-light dark:text-ink-dark mb-2">
          Lesson Complete!
        </h3>
        <div className="space-y-2 mb-6">
          <p className="text-lg text-soft-500">
            <span className="font-bold text-success">{correctCount}</span> / {questions.length} Correct
          </p>
          <p className="text-base text-soft-400">
            <span className="font-bold text-danger">{incorrectCount}</span> Incorrect
          </p>
          <p className="text-2xl font-bold text-ink-light dark:text-ink-dark">
            {Math.round((correctCount / questions.length) * 100)}% Accuracy
          </p>
        </div>
        <div className="h-3 bg-soft-200 dark:bg-soft-700 rounded-full overflow-hidden mb-6">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(correctCount / questions.length) * 100}%`}} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
        </div>
        <p className="text-sm text-soft-400">Redirecting to results...</p>
      </motion.div>
    );
  }

  const q = questions[currentQ];
  const selected = answers[currentQ];
  const isLastQuestion = currentQ === questions.length - 1;

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-ink-light dark:text-ink-dark">📝 Practice</h2>
          <p className="text-sm text-soft-400">Question {currentQ + 1} of {questions.length}</p>
        </div>
        <span className="badge-primary">Question {currentQ + 1}/{questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-soft-200 dark:bg-soft-700 rounded-full overflow-hidden mb-6">
        <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / questions.length) * 100}%`}} transition={{ duration: 0.4 }} className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
      </div>

      {/* Current question - ONLY ONE AT A TIME */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <div className="mb-6">
            <span className="badge-primary text-xs uppercase tracking-wider mb-3 inline-block">{q.skill_type}</span>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-ink-light dark:text-ink-dark mb-6">{q.question_text}</h3>
            {q.image_url && <img src={q.image_url} alt="" className="w-full max-w-sm h-40 object-cover rounded-xl mb-6" />}
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {q.options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(opt)}
                className={`text-left px-5 py-4 rounded-xl2 border-2 font-medium transition-all ${
                  selected === opt ? "border-primary-500 bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400" : "border-soft-200 dark:border-soft-700 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(currentQ - 1)} className="btn-secondary flex-1">
                ← Back
              </button>
            )}
            <button 
              onClick={isLastQuestion ? submitQuiz : () => setCurrentQ(currentQ + 1)} 
              disabled={!selected} 
              className={isLastQuestion ? "btn-magic flex-[2]" : "btn-magic flex-[2]"}
            >
              {isLastQuestion ? "Finish Lesson ✓" : "Next →"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ✦ ─── Legacy Lesson Types ─────────────────────────────────────────

function ReadingLesson({ lesson, onFinish, speak }) {
  const { passage, questions } = lesson.content;
  const [answers, setAnswers] = useState({});

  const submit = () => {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    onFinish(Math.round((correct / questions.length) * 100));
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-3 mb-6">
        <p className="text-ink-light dark:text-ink-dark leading-relaxed">{passage}</p>
        <button onClick={() => speak(passage)} className="shrink-0 w-9 h-9 rounded-xl2 bg-soft-100 dark:bg-soft-800 flex items-center justify-center hover:bg-soft-200 dark:hover:bg-soft-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-soft-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        </button>
      </div>
      {questions.map((q, i) => (
        <div key={i} className="mb-5">
          <p className="font-semibold text-sm text-ink-light dark:text-ink-dark mb-2">{q.q}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswers({ ...answers, [i]: opt })}
                className={`text-left px-3 py-2 rounded-xl2 border-2 text-sm font-medium transition-all ${
                  answers[i] === opt
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400"
                    : "border-soft-200 dark:border-soft-700 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={submit}
        disabled={Object.keys(answers).length < questions.length}
        className="btn-primary w-full"
      >
        Submit
      </button>
    </div>
  );
}

function VocabularyLegacyLesson({ lesson, onFinish, speak }) {
  const { words, quiz } = lesson.content;
  const [step, setStep] = useState("learn");
  const [answers, setAnswers] = useState({});

  const submit = () => {
    const correct = quiz.filter((q, i) => answers[i] === q.answer).length;
    onFinish(Math.round((correct / quiz.length) * 100));
  };

  if (step === "learn") {
    return (
      <div className="card p-6">
        <h2 className="font-display font-bold text-lg text-ink-light dark:text-ink-dark mb-4">📖 Learn the Words</h2>
        <div className="flex flex-col gap-3 mb-6">
          {words.map((w) => (
            <div key={w.word} className="flex items-center justify-between bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-4">
              <div>
                <p className="font-display font-bold text-ink-light dark:text-ink-dark">{w.word}</p>
                <p className="text-sm text-soft-400">{w.meaning}</p>
                <p className="text-xs text-soft-400 italic mt-1">"{w.example}"</p>
              </div>
              <button onClick={() => speak(w.word)} className="w-9 h-9 rounded-xl2 bg-white dark:bg-surface-dark-alt flex items-center justify-center shadow-soft">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-soft-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setStep("quiz")} className="btn-primary w-full">
          I've got it — quiz me →
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="font-display font-bold text-lg text-ink-light dark:text-ink-dark mb-4">📝 Quiz</h2>
      {quiz.map((q, i) => (
        <div key={i} className="mb-5">
          <p className="font-semibold text-sm text-ink-light dark:text-ink-dark mb-2">{q.q}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswers({ ...answers, [i]: opt })}
                className={`text-left px-3 py-2 rounded-xl2 border-2 text-sm font-medium transition-all ${
                  answers[i] === opt
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/15"
                    : "border-soft-200 dark:border-soft-700 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={submit}
        disabled={Object.keys(answers).length < quiz.length}
        className="btn-primary w-full"
      >
        Submit
      </button>
    </div>
  );
}

function WritingLesson({ lesson, onFinish }) {
  const { prompt, min_words, keywords_hint } = lesson.content;
  const [text, setText] = useState("");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const submit = () => {
    const lengthScore = Math.min(1, wordCount / min_words) * 70;
    const lower = text.toLowerCase();
    const keywordHits = (keywords_hint || []).filter((k) => lower.includes(k)).length;
    const keywordScore = Math.min(1, keywordHits / Math.max(1, (keywords_hint || []).length)) * 30;
    onFinish(Math.round(lengthScore + keywordScore));
  };

  return (
    <div className="card p-6">
      <h2 className="font-display font-bold text-lg text-ink-light dark:text-ink-dark mb-2">✍️ Writing Exercise</h2>
      <p className="text-ink-light dark:text-ink-dark mb-4">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Start writing here…"
        className="input-field resize-none mb-2"
      />
      <div className="flex justify-between items-center mb-6">
        <p className="text-xs text-soft-400">{wordCount} / {min_words} words minimum</p>
        {keywords_hint && keywords_hint.length > 0 && (
          <p className="text-xs text-soft-400">Try to use: {keywords_hint.join(", ")}</p>
        )}
      </div>
      <button
        onClick={submit}
        disabled={wordCount < min_words}
        className="btn-primary w-full"
      >
        Submit
      </button>
    </div>
  );
}

function ListeningLesson({ lesson, onFinish, speak }) {
  const { audio_text, questions } = lesson.content;
  const [played, setPlayed] = useState(false);
  const [answers, setAnswers] = useState({});

  const submit = () => {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    onFinish(Math.round((correct / questions.length) * 100));
  };

  return (
    <div className="card p-6">
      <div className="flex flex-col items-center bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-8 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { speak(audio_text); setPlayed(true); }}
          className="w-16 h-16 rounded-2xl gradient-accent text-white flex items-center justify-center text-2xl shadow-lg shadow-accent-500/30 hover:shadow-accent-500/40 transition-shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        </motion.button>
        <p className="text-xs text-soft-400 mt-3">Tap to play the audio</p>
      </div>

      {questions.map((q, i) => (
        <div key={i} className="mb-5">
          <p className="font-semibold text-sm text-ink-light dark:text-ink-dark mb-2">{q.q}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswers({ ...answers, [i]: opt })}
                className={`text-left px-3 py-2 rounded-xl2 border-2 text-sm font-medium transition-all ${
                  answers[i] === opt
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/15"
                    : "border-soft-200 dark:border-soft-700 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={submit}
        disabled={!played || Object.keys(answers).length < questions.length}
        className="btn-primary w-full"
      >
        Submit
      </button>
    </div>
  );
}

// ✦ ─── Multi-sentence Speaking Wrapper ─────────────────────────────
function SpeakingLessonWrapper({ lesson, lessonId, onFinish }) {
  const { target_sentences } = lesson.content;
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState([]);

  const handleComplete = (result) => {
    const newScores = [...scores, result?.overall_score ?? 0];
    setScores(newScores);
    if (index < target_sentences.length - 1) {
      setIndex(index + 1);
    } else {
      const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length;
      onFinish(Math.round(avg));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-soft-400 text-center">
        Sentence {index + 1} of {target_sentences.length}
      </p>
      <SpeakingExercise
        key={index}
        lessonId={lessonId}
        targetText={target_sentences[index]}
        instructions="Repeat the sentence aloud as accurately as you can"
        onComplete={handleComplete}
      />
    </div>
  );
}

// ✦ ─── Main LessonPlayer ──────────────────────────────────────────
export default function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { speak } = useSpeechProvider();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [showAiChat, setShowAiChat] = useState(false);

  useEffect(() => {
    setResult(null);
    client.get(`/lessons/${lessonId}`).then((res) => {
      setLesson(res.data);
      setLoading(false);
    });
    client.post(`/lessons/${lessonId}/start`);
  }, [lessonId]);

  const finishLesson = async (scorePercent) => {
    const res = await client.post(`/lessons/${lessonId}/complete`, { score_percent: scorePercent });
    refreshUser(res.data.user);
    setResult(res.data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary-200 dark:border-primary-700 border-t-primary-500 dark:border-t-primary-400 animate-spin" />
          <p className="text-sm text-soft-400 animate-pulse-soft">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-md text-center"
        >
          <div className="text-7xl mb-6">
            {result.progress.best_score >= 80 ? "🎉" : result.progress.best_score >= 50 ? "💪" : "📚"}
          </div>
          <h1 className="font-display font-extrabold text-4xl mb-2">Lesson complete!</h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="4" className="opacity-20" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none" stroke="#F59E0B" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - result.progress.best_score / 100)}
                  className="progress-ring-circle"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                {result.progress.best_score}%
              </span>
            </div>
          </div>
          <p className="text-amber-400 font-display font-bold text-xl mb-6">
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              +{result.xp_earned} XP
            </span>
          </p>

          {result.leveled_up && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent-500/20 text-accent-300 rounded-2xl px-4 py-3 mb-6 text-sm font-semibold"
            >
              🚀 You leveled up to {result.new_level}!
            </motion.div>
          )}
          {result.new_achievements.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {result.new_achievements.map((a) => (
                <span key={a.code} className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                  {a.icon} {a.title}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="gradient-warm text-white font-display font-bold px-8 py-3.5 rounded-xl2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Back to path →
          </button>
        </motion.div>
      </div>
    );
  }

   return (
     <div className="min-h-screen bg-surface-light dark:bg-surface-dark px-4 py-5">
       <div className="max-w-2xl mx-auto">
         {/* Top bar */}
         <div className="flex items-center justify-between mb-6">
           <button onClick={() => navigate("/dashboard")} className="btn-ghost flex items-center gap-1.5 text-base">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
             Back to path
           </button>
           <button
             onClick={() => setShowAiChat(!showAiChat)}
             className={`flex items-center gap-1.5 text-base font-semibold px-4 py-2 rounded-xl2 transition-all duration-200 ${
               showAiChat
                 ? "bg-accent-500 text-white"
                 : "bg-accent-50 dark:bg-accent-500/15 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-500/25"
             }`}
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
             </svg>
             AI Tutor
           </button>
         </div>

         {/* Lesson header */}
         <div className="mb-6">
           <span className="badge-primary text-xs uppercase tracking-wider mb-3 inline-block">
             {lesson.lesson_type}
           </span>
           <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink-light dark:text-ink-dark">{lesson.title}</h1>
         </div>

        {/* AI Chat Panel */}
        {showAiChat && <AIChatPanel lessonId={lessonId} />}

        {/* Introduction */}
        {lesson.introduction && (
          <div className="gradient-primary text-white rounded-2xl p-5 mb-5">
            <p className="font-display font-bold text-xl mb-1">{lesson.learning_objective}</p>
            <p className="text-white/70 text-sm flex items-center gap-2 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.estimated_minutes} min · Difficulty: {lesson.difficulty}/5
            </p>
          </div>
        )}

        {/* Tips */}
        {lesson.tips && lesson.tips.length > 0 && (
          <div className="card p-4 mb-5 border-l-4 border-l-warning">
            <p className="font-display font-bold text-ink-light dark:text-ink-dark text-sm mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Learning Tips
            </p>
            {lesson.tips.map((tip, i) => (
              <p key={i} className="text-sm text-soft-500 dark:text-soft-400 mb-1">• {tip.tip_text}</p>
            ))}
          </div>
        )}

        {/* Images */}
        {lesson.images && lesson.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-2 px-2">
            {lesson.images.map((img, i) => (
              <div key={i} className="shrink-0">
                <div className="w-48 h-32 rounded-2xl overflow-hidden">
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                </div>
                {img.caption && <p className="text-xs text-soft-400 mt-1 text-center">{img.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Vocabulary */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <VocabularySection vocab={lesson.vocabulary} speak={speak} />
        )}

        {/* Questions */}
        {lesson.questions && lesson.questions.length > 0 && (
          <QuestionsSection questions={lesson.questions} onFinish={finishLesson} />
        )}

        {/* Legacy lesson type handlers */}
        {(!lesson.questions || lesson.questions.length === 0) && lesson.lesson_type === "reading" && (
          <ReadingLesson lesson={lesson} onFinish={finishLesson} speak={speak} />
        )}
        {(!lesson.questions || lesson.questions.length === 0) && lesson.lesson_type === "vocabulary" && (
          <VocabularyLegacyLesson lesson={lesson} onFinish={finishLesson} speak={speak} />
        )}
        {lesson.lesson_type === "writing" && <WritingLesson lesson={lesson} onFinish={finishLesson} />}
        {(!lesson.questions || lesson.questions.length === 0) && lesson.lesson_type === "listening" && (
          <ListeningLesson lesson={lesson} onFinish={finishLesson} speak={speak} />
        )}
        {lesson.lesson_type === "speaking" && (
          <SpeakingLessonWrapper lesson={lesson} lessonId={Number(lessonId)} onFinish={finishLesson} />
        )}
      </div>
    </div>
  );
}