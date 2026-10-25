import React from "react";

/**
 * Microphone button with recording animation states.
 *
 * States:
 * - idle: Default state, tap to start recording
 * - listening: Active recording with pulse animation
 * - processing: Submitting for evaluation
 * - disabled: Browser doesn't support speech recognition
 */
export default function MicButton({
  isListening,
  isProcessing,
  supported,
  disabled,
  onStart,
  onStop,
}) {
  if (!supported) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-soft-200 dark:bg-soft-700 flex items-center justify-center text-2xl opacity-50 cursor-not-allowed">
          🎙️
        </div>
        <p className="text-xs text-soft-400 text-center">Not supported in this browser</p>
      </div>
    );
  }

  const handleClick = () => {
    if (isProcessing || disabled) return;
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isProcessing || disabled}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center text-3xl
          transition-all duration-300 shadow-pop
          ${
            isProcessing
              ? "bg-soft-200 dark:bg-soft-700 cursor-wait animate-pulse"
              : isListening
              ? "bg-danger text-white recording-pulse scale-110"
              : "bg-primary-500 text-white hover:bg-primary-600 hover:scale-105 active:scale-95"
          }
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
        aria-label={isListening ? "Stop recording" : "Start recording"}
        title={isListening ? "Stop recording" : "Click to speak"}
      >
        {isProcessing ? (
          <svg
            className="animate-spin h-8 w-8 text-soft-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        )}

        {/* Pulse rings when listening */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full bg-danger/30 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-danger/20 animate-ping" style={{ animationDelay: "300ms" }} />
          </>
        )}
      </button>

      <p className="text-sm text-soft-400 font-medium">
        {isProcessing
          ? "Evaluating your speech…"
          : isListening
          ? "Listening… tap to stop"
          : "Tap the mic to speak"}
      </p>
    </div>
  );
}

/**
 * CSS for mic pulse animation — add to your index.css if not present:
 *
 * @keyframes mic-pulse {
 *   0%, 100% { transform: scale(1); }
 *   50% { transform: scale(1.08); }
 * }
 * .animate-mic-pulse { animation: mic-pulse 1.5s ease-in-out infinite; }
 * .animation-delay-300 { animation-delay: 300ms; }
 */