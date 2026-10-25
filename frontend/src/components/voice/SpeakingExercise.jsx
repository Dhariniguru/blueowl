import React, { useState, useCallback } from "react";
import MicButton from "./MicButton";
import VoiceFeedbackCard from "./VoiceFeedbackCard";
import RecordingTimer from "./RecordingTimer";
import useSpeechProvider from "../../hooks/useSpeechProvider";
import { submitVoiceAttempt } from "../../api/voice";

/**
 * "Repeat After Me" exercise.
 *
 * Displays a sentence, user repeats it aloud, transcript is evaluated.
 */
export default function SpeakingExercise({ lessonId, targetText, instructions, onComplete }) {
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
        exercise_type: "repeat",
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

  // If we have a result, show feedback
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

      {/* Target Sentence */}
      <div className="card p-5 text-center">
        <p className="text-xs text-soft-400 uppercase tracking-wide font-semibold mb-2">
          Say this sentence
        </p>
        <p className="text-2xl font-display font-bold text-ink-light dark:text-ink-dark leading-relaxed">
          "{targetText}"
        </p>

        <button
          onClick={() => speak(targetText)}
          className="mt-3 text-sm text-primary-500 dark:text-primary-400 hover:text-warning transition-colors"
        >
          🔊 Hear it
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
            <p className="text-xs text-soft-400 font-semibold mb-1">You said:</p>
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