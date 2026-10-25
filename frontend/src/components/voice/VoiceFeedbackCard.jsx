import React from "react";

/**
 * Displays voice exercise evaluation results with word-level feedback.
 *
 * @param {{
 *   result: {
 *     overall_score: number,
 *     accuracy_percent: number,
 *     word_match_percent: number,
 *     sentence_similarity: number,
 *     missing_words: string[],
 *     extra_words: string[],
 *     word_feedback: Array<{word: string, correct: boolean}>,
 *     feedback: string
 *   },
 *   onRetry: () => void,
 *   onContinue: () => void,
 *   showContinueButton: boolean,
 * }} props
 */
export default function VoiceFeedbackCard({ result, onRetry, onContinue, showContinueButton }) {
  if (!result) return null;

  const {
    overall_score = 0,
    accuracy_percent = 0,
    word_match_percent = 0,
    sentence_similarity = 0,
    missing_words = [],
    extra_words = [],
    word_feedback = [],
    feedback = "",
  } = result;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    if (score >= 40) return "text-orange-500";
    return "text-danger";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-success-light border-success/30";
    if (score >= 60) return "bg-warning-light border-warning/30";
    if (score >= 40) return "bg-orange-500/10 border-orange-500/30";
    return "bg-danger-light border-danger/30";
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return "🌟";
    if (score >= 70) return "👍";
    if (score >= 50) return "💪";
    return "🔄";
  };

  return (
    <div className="card p-6 space-y-5">
      {/* Overall Score */}
      <div className={`text-center p-5 rounded-xl2 border-2 ${getScoreBg(overall_score)}`}>
        <span className="text-4xl">{getScoreEmoji(overall_score)}</span>
        <p className={`font-display font-extrabold text-5xl mt-2 ${getScoreColor(overall_score)}`}>
          {Math.round(overall_score)}%
        </p>
        <p className="text-sm text-soft-500 mt-1">Overall Score</p>
      </div>

      {/* Feedback Message */}
      <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-4">
        <p className="text-sm text-ink-light dark:text-ink-dark leading-relaxed">{feedback}</p>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3 text-center">
          <p className={`text-lg font-bold ${getScoreColor(accuracy_percent)}`}>
            {Math.round(accuracy_percent)}%
          </p>
          <p className="text-xs text-soft-400 mt-1">Accuracy</p>
        </div>
        <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3 text-center">
          <p className={`text-lg font-bold ${getScoreColor(word_match_percent)}`}>
            {Math.round(word_match_percent)}%
          </p>
          <p className="text-xs text-soft-400 mt-1">Word Match</p>
        </div>
        <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3 text-center">
          <p className={`text-lg font-bold ${getScoreColor(sentence_similarity)}`}>
            {Math.round(sentence_similarity)}%
          </p>
          <p className="text-xs text-soft-400 mt-1">Similarity</p>
        </div>
      </div>

      {/* Word-Level Feedback */}
      {word_feedback.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-soft-400 mb-2">
            Word Breakdown
          </p>
          <div className="flex flex-wrap gap-1.5">
            {word_feedback.map((wf, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  wf.correct
                    ? "bg-success-light text-success dark:text-success"
                    : "bg-danger-light text-danger"
                }`}
              >
                {wf.word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing & Extra Words */}
      {(missing_words.length > 0 || extra_words.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {missing_words.length > 0 && (
            <div className="bg-danger-light dark:bg-danger/10 rounded-xl2 p-3">
              <p className="text-xs font-semibold text-danger mb-1">Missing Words</p>
              <p className="text-sm text-soft-500">{missing_words.join(", ")}</p>
            </div>
          )}
          {extra_words.length > 0 && (
            <div className="bg-warning-light dark:bg-warning/10 rounded-xl2 p-3">
              <p className="text-xs font-semibold text-warning mb-1">Extra Words</p>
              <p className="text-sm text-soft-500">{extra_words.join(", ")}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 btn-ghost py-3 font-semibold flex items-center justify-center gap-1"
        >
          <span>🔄</span> Try Again
        </button>
        {showContinueButton && (
          <button
            onClick={onContinue}
            className="flex-1 btn-primary py-3"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}