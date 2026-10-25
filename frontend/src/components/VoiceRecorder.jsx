import React, { useEffect } from "react";
import useSpeech from "../hooks/useSpeech";

export default function VoiceRecorder({ targetText, onResult }) {
  const { supported, isListening, transcript, startListening, stopListening, speak, isSpeaking } = useSpeech();

  useEffect(() => {
    if (transcript) {
      onResult(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  if (!supported) {
    return (
      <div className="bg-amber-400/10 text-amber-600 text-sm rounded-xl2 p-4">
        Voice input isn't supported in this browser. Try Chrome or Edge on desktop or Android.
      </div>
    );
  }

  return (
    <div className="card p-6 flex flex-col items-center gap-4">
      <p className="text-xl font-display font-semibold text-ink-light dark:text-ink-dark text-center">"{targetText}"</p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => speak(targetText)}
          className="w-11 h-11 rounded-full bg-soft-100 dark:bg-soft-800 text-primary-500 flex items-center justify-center text-lg hover:bg-soft-200 dark:hover:bg-soft-700 hover:scale-105 transition-all"
          title="Hear it"
        >
          {isSpeaking ? "🔊" : "🔈"}
        </button>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-pop transition-all duration-300 ${
            isListening ? "bg-danger text-white animate-pulse scale-110" : "bg-primary-500 text-white hover:bg-primary-600 hover:scale-105 active:scale-95"
          }`}
          title={isListening ? "Stop" : "Tap to speak"}
        >
          🎙️
        </button>
      </div>

      <p className="text-sm text-soft-400">
        {isListening ? "Listening… speak now" : "Tap the mic and say the sentence aloud"}
      </p>

      {transcript && (
        <div className="w-full bg-soft-50 dark:bg-soft-800/50 rounded-xl2 p-3.5 text-base text-ink-light dark:text-ink-dark">
          <span className="font-semibold text-soft-400">You said: </span>
          {transcript}
        </div>
      )}
    </div>
  );
}
