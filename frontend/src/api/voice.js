/**
 * Voice Learning Module API Service
 *
 * Provides functions for all voice-related API interactions.
 * Keeps API logic separate from UI components.
 */

import client from "./client";

/**
 * Get speaking exercise data for a lesson.
 * @param {number} lessonId
 * @returns {Promise<{lesson_id: number, exercise_type: string, target_text: string, instructions: string, difficulty: number}>}
 */
export async function getVoiceLesson(lessonId) {
  const res = await client.get(`/voice/lesson/${lessonId}`);
  return res.data;
}

/**
 * Submit a voice attempt for evaluation.
 * @param {{
 *   lesson_id: number,
 *   exercise_type: string,
 *   spoken_text: string,
 *   duration?: number,
 *   provider?: string
 * }} data
 * @returns {Promise<{
 *   attempt_id: number,
 *   accuracy_percent: number,
 *   word_match_percent: number,
 *   sentence_similarity: number,
 *   overall_score: number,
 *   missing_words: string[],
 *   extra_words: string[],
 *   word_feedback: Array<{word: string, correct: boolean, position: number}>,
 *   feedback: string
 * }>}
 */
export async function submitVoiceAttempt(data) {
  const res = await client.post("/voice/submit", {
    lesson_id: data.lesson_id,
    exercise_type: data.exercise_type || "repeat",
    spoken_text: data.spoken_text,
    duration: data.duration || null,
    provider: data.provider || "web_speech_api",
  });
  return res.data;
}

/**
 * Get the user's voice attempt history.
 * @param {Object} params
 * @param {number} [params.limit=50]
 * @param {number} [params.offset=0]
 * @param {string} [params.exercise_type]
 * @returns {Promise<{attempts: Array, stats: Object}>}
 */
export async function getVoiceHistory(params = {}) {
  const res = await client.get("/voice/history", { params });
  return res.data;
}

/**
 * Get aggregate voice statistics.
 * @returns {Promise<{
 *   total_attempts: number,
 *   average_score: number,
 *   best_score: number,
 *   total_exercises_completed: number,
 *   recent_improvement: number
 * }>}
 */
export async function getVoiceStats() {
  const res = await client.get("/voice/stats");
  return res.data;
}

/**
 * Legacy: submit a simple text assessment (for backward compatibility).
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function assessVoice(data) {
  const res = await client.post("/voice/assess", data);
  return res.data;
}