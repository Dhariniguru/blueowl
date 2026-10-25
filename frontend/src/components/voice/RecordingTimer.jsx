import React, { useState, useEffect, useRef } from "react";

/**
 * Displays elapsed recording time.
 * Updates every 100ms for smooth display.
 */
export default function RecordingTimer({ isRecording, onDurationUpdate }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startRef.current = Date.now();
      setElapsed(0);
      intervalRef.current = setInterval(() => {
        const seconds = (Date.now() - startRef.current) / 1000;
        setElapsed(seconds);
        if (onDurationUpdate) onDurationUpdate(seconds);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording, onDurationUpdate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!isRecording && elapsed === 0) return null;

  return (
    <span
      className={`font-mono text-sm font-semibold ${
        isRecording ? "text-danger animate-pulse" : "text-soft-400"
      }`}
    >
      {formatTime(elapsed)}
    </span>
  );
}