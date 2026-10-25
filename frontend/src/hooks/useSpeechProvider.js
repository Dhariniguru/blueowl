/**
 * Speech Provider Abstraction (Frontend)
 *
 * Provides a provider-independent interface for speech recognition.
 *
 * Current provider: Browser Web Speech API
 * Future providers: Whisper, Azure, Google, Deepgram, etc.
 *
 * To add a new provider:
 * 1. Create a new provider function or class
 * 2. Register it in the SpeechProviderFactory
 *
 * Business logic depends ONLY on this abstraction.
 */

import { useState, useRef, useCallback } from "react";

// ─── Provider Interface ─────────────────────────────────────────
// Each provider must return an object with:
//   supported: boolean
//   startListening: () => void
//   stopListening: () => void
//   isListening: boolean
//   transcript: string
//   startListening: function
//   stopListening: function
//   error: string

// ─── Web Speech API Provider ─────────────────────────────────────

function createWebSpeechProvider({ onTranscript, onError, onStateChange }) {
  let recognitionRef = null;
  let isListeningState = false;
  let transcriptState = "";

  const SpeechRecognitionAPI =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      isListeningState = true;
      transcriptState = "";
      onStateChange({ isListening: true, error: "" });
    };

    recognition.onerror = (event) => {
      isListeningState = false;
      let errorMsg = "Speech recognition error.";
      if (event.error === "no-speech") errorMsg = "No speech was detected. Please try again.";
      else if (event.error === "audio-capture") errorMsg = "No microphone was found. Check your device.";
      else if (event.error === "not-allowed") errorMsg = "Microphone access was denied. Please allow microphone access in your browser settings.";
      else if (event.error === "aborted") errorMsg = "";
      else errorMsg = `Speech recognition error: ${event.error}`;
      onError(errorMsg);
      onStateChange({ isListening: false, error: errorMsg });
    };

    recognition.onend = () => {
      isListeningState = false;
      onStateChange({ isListening: false });
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      transcriptState = text;
      onTranscript(text);
    };

    recognitionRef = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef) {
      try { recognitionRef.stop(); } catch (e) { /* ignore */ }
    }
    isListeningState = false;
    onStateChange({ isListening: false });
  };

  return {
    supported: Boolean(SpeechRecognitionAPI) && "speechSynthesis" in window,
    startListening,
    stopListening,
    speak,
    isListening: () => isListeningState,
    getTranscript: () => transcriptState,
    providerName: "web_speech_api",
  };
}

// ─── Provider Factory ────────────────────────────────────────────

const providerCreators = {
  web_speech_api: createWebSpeechProvider,
  // Future providers register here:
  // whisper: createWhisperProvider,
  // azure: createAzureProvider,
};

/**
 * Hook for using speech recognition in a provider-independent way.
 *
 * @param {string} providerName - "web_speech_api" (default) or future providers
 * @returns {{
 *   supported: boolean,
 *   isListening: boolean,
 *   transcript: string,
 *   error: string,
 *   startListening: () => void,
 *   stopListening: () => void,
 *   speak: (text: string) => void,
 *   providerName: string,
 *   clearTranscript: () => void,
 *   clearError: () => void,
 * }}
 */
export default function useSpeechProvider(providerName = "web_speech_api") {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const providerRef = useRef(null);

  // Initialize provider once
  if (!providerRef.current) {
    const creator = providerCreators[providerName];
    if (!creator) {
      throw new Error(
        `Unknown speech provider "${providerName}". Available: ${Object.keys(providerCreators).join(", ")}`
      );
    }

    providerRef.current = creator({
      onTranscript: (text) => {
        setTranscript(text);
      },
      onError: (msg) => {
        if (msg) setError(msg);
      },
      onStateChange: ({ isListening: listening, error: err }) => {
        if (listening !== undefined) setIsListening(listening);
        if (err !== undefined) setError(err);
      },
    });
  }

  const provider = providerRef.current;

  const startListening = useCallback(() => {
    setError("");
    setTranscript("");
    provider.startListening();
  }, [provider]);

  const stopListening = useCallback(() => {
    provider.stopListening();
  }, [provider]);

  const speak = useCallback(
    (text) => {
      provider.speak(text);
    },
    [provider]
  );

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    supported: provider.supported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    providerName: provider.providerName,
    clearTranscript,
    clearError,
  };
}