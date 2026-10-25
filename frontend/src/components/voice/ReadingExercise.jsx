import React, { useState, useCallback } from "react";
import MicButton from "./MicButton";
import VoiceFeedbackCard from "./VoiceFeedbackCard";
import RecordingTimer from "./RecordingTimer";
import useSpeechProvider from "../../hooks/useSpeechProvider";
import { submitVoiceAttempt } from "../../api/voice";

/**
 * "Read Aloud" exercise.
 *
 * Displays a paragraph, user reads it aloud, transcript is evaluated
 * for reading accuracy and fluency.
 */
export default function ReadingExercise({ lessonId, targetText, instructions, onComplete }) {
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
        exercise_type: "read_aloud",
        spoken_text: transcript,
        duration,
        provider: "web_speech_api",
      });
      setResult(res);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to evaluate. Please try again.";
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
        <VoiceFeedbackCard
          result={result}
          onRetry={handleRetry}
          onContinue={() => onComplete && onComplete(result)}
          showContinueButton={true}
        />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Instructions */}
      <div className="bg-accent-50 dark:bg-accent-500/10 rounded-xl2 p-4 text-center">
        <p className="text-sm text-accent-700 dark:text-accent-400 font-medium">{instructions}</p>
      </div>

      {/* Passage */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-xs text-soft-400 uppercase tracking-wide font-semibold">
            Read this aloud
          </p>
          <button
            onClick={() => speak(targetText)}
            className="w-8 h-8 rounded-full bg-soft-100 dark:bg-soft-800 flex items-center justify-center text-sm hover:bg-soft-200 dark:hover:bg-soft-700 hover:scale-105 transition-all"
            title="Hear the passage"
          >
            🔊
          </button>
        </div>
        <p className="text-ink-light dark:text-ink-dark leading-relaxed text-base">{targetText}</p>
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
            <p className="text-xs text-soft-400 font-semibold mb-1">You read:</p>
            <p className="text-sm text-ink-light dark:text-ink-dark">{transcript}</p>
          </div>
        )}

        {/* Submit Button */}
        {transcript && !isListening && !isProcessing && (
          <button
            onClick={handleSubmit}
            className="w-full btn-primary py-3"
          >
            Submit for Evaluation →
          </button>
        )}
      </div>
    </div>
  );
}