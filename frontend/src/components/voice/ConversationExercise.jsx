import React, { useState, useCallback } from "react";
import MicButton from "./MicButton";
import RecordingTimer from "./RecordingTimer";
import useSpeechProvider from "../../hooks/useSpeechProvider";
import { submitVoiceAttempt } from "../../api/voice";

/**
 * "Conversation Practice" exercise.
 *
 * System asks an open question, student replies.
 * Stores transcript and duration. No grammar scoring for now.
 * Future AI evaluation can be added through the service layer.
 */
export default function ConversationExercise({ lessonId, targetText, instructions, onComplete }) {
  const {
    supported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    clearTranscript,
    clearError,
  } = useSpeechProvider();

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [duration, setDuration] = useState(0);
  const [apiError, setApiError] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    setApiError("");

    try {
      const res = await submitVoiceAttempt({
        lesson_id: lessonId,
        exercise_type: "conversation",
        spoken_text: transcript,
        duration,
        provider: "web_speech_api",
      });
      setResult(res);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save your response. Please try again.";
      setApiError(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [transcript, lessonId, duration]);

  const handleRetry = () => {
    setResult(null);
    setApiError("");
    clearTranscript();
    clearError();
  };

  const displayError = error || apiError;

  if (result) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-6 space-y-5">
          <div className="text-center">
            <span className="text-4xl">💬</span>
            <p className="font-display font-extrabold text-2xl text-accent-600 dark:text-accent-400 mt-2">
              Response Recorded!
            </p>
            <p className="text-sm text-soft-400 mt-1">
              Duration: {Math.round(duration)}s
            </p>
          </div>

          <div className="bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-4">
            <p className="text-xs text-soft-400 font-semibold mb-1">Your response:</p>
            <p className="text-sm text-ink-light dark:text-ink-dark">{transcript}</p>
          </div>

          <div className="bg-warning-light dark:bg-warning/10 rounded-xl2 p-4 text-sm text-warning dark:text-warning text-center">
            🧠 AI evaluation coming soon — your response has been saved for future analysis.
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 btn-secondary"
            >
              🔄 Record Again
            </button>
            <button
              onClick={() => onComplete && onComplete(result)}
              className="flex-1 btn-primary"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Instructions */}
      <div className="bg-accent-50 dark:bg-accent-500/10 rounded-xl2 p-4 text-center">
        <p className="text-sm text-accent-700 dark:text-accent-400 font-medium">{instructions}</p>
      </div>

      {/* Question */}
      <div className="card p-6 text-center">
        <p className="text-xs text-soft-400 uppercase tracking-wide font-semibold mb-2">
          Answer this question
        </p>
        <p className="text-2xl font-display font-bold text-ink-light dark:text-ink-dark leading-relaxed">
          {targetText}
        </p>

        <button
          onClick={() => speak(targetText)}
          className="mt-3 text-sm text-primary-500 dark:text-primary-400 hover:text-warning transition-colors"
        >
          🔊 Hear the question
        </button>
      </div>

      {/* Error Display */}
      {displayError && (
        <div className="bg-danger-light dark:bg-danger/10 border border-danger/30 rounded-xl2 p-3 text-sm text-danger text-center">
          {displayError}
        </div>
      )}

      {/* Recording Section */}
      <div className="card p-6 flex flex-col items-center gap-4">
        {isListening && (
          <RecordingTimer
            isRecording={isListening}
            onDurationUpdate={setDuration}
          />
        )}

        <MicButton
          supported={supported}
          isListening={isListening}
          isProcessing={isProcessing}
          onStart={startListening}
          onStop={stopListening}
        />

        {/* Transcript Display */}
        {transcript && (
          <div className="w-full bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-4">
            <p className="text-xs text-soft-400 font-semibold mb-1">Your response:</p>
            <p className="text-sm text-ink-light dark:text-ink-dark">{transcript}</p>
          </div>
        )}

        {/* Submit Button */}
        {transcript && !isListening && !isProcessing && (
          <button
            onClick={handleSubmit}
            className="w-full btn-primary py-3"
          >
            Submit Response →
          </button>
        )}
      </div>
    </div>
  );
}