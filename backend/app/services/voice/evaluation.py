"""
Voice Evaluation Engine
=======================

Core scoring logic for speaking exercises.

Uses rapidfuzz for:
- Sentence similarity (token sort ratio)
- Word-level alignment (missing/extra words)
- Overall accuracy scoring

Text normalisation removes:
- Case differences
- Punctuation
- Extra whitespace
"""

import re
from dataclasses import dataclass
from typing import Optional

from rapidfuzz import fuzz


def normalize(text: str) -> str:
    """Normalise text by lowercasing and removing punctuation."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s']", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def tokenize(text: str) -> list[str]:
    """Split normalised text into word tokens."""
    return normalize(text).split()


@dataclass
class EvaluationResult:
    """Structured result from voice evaluation."""

    accuracy_percent: float
    word_match_percent: float
    missing_words: list[str]
    extra_words: list[str]
    sentence_similarity: float
    overall_score: float
    feedback: str


class VoiceEvaluationService:
    """
    Evaluates spoken transcripts against expected text.

    Scoring methodology:
    - Word Match %:   Proportion of expected words present in transcript
    - Missing Words:  Expected words not found in transcript
    - Extra Words:    Transcript words not in expected text
    - Similarity:     Token sort ratio from rapidfuzz
    - Overall Score:  Weighted combination of all metrics
    """

    def __init__(self):
        self._weights = {
            "similarity": 0.40,
            "word_match": 0.35,
            "accuracy": 0.25,
        }

    def evaluate(
        self,
        expected: str,
        transcript: str,
        exercise_type: str = "repeat",
    ) -> EvaluationResult:
        """
        Evaluate a spoken transcript against expected text.

        Args:
            expected: The expected/correct text
            transcript: The student's spoken transcript
            exercise_type: One of 'repeat', 'read_aloud', 'conversation'

        Returns:
            EvaluationResult with scores and feedback
        """
        if not transcript or not transcript.strip():
            return EvaluationResult(
                accuracy_percent=0.0,
                word_match_percent=0.0,
                missing_words=tokenize(expected),
                extra_words=[],
                sentence_similarity=0.0,
                overall_score=0.0,
                feedback="No speech detected. Please try again.",
            )

        expected_norm = normalize(expected)
        transcript_norm = normalize(transcript)

        expected_tokens = tokenize(expected)
        transcript_tokens = tokenize(transcript)

        # Sentence similarity (token sort ratio)
        similarity = fuzz.token_sort_ratio(expected_norm, transcript_norm) / 100.0

        # Word match: what percentage of expected words appear in transcript
        expected_set = set(expected_tokens)
        transcript_set = set(transcript_tokens)

        matched_words = expected_set & transcript_set
        word_match_percent = (len(matched_words) / max(len(expected_set), 1)) * 100.0

        # Missing words (expected but not present)
        missing_words = [w for w in expected_tokens if w not in transcript_set]

        # Extra words (spoken but not expected)
        extra_words = [w for w in transcript_tokens if w not in expected_set]

        # Accuracy based on word error rate
        word_error_rate = (len(missing_words) + len(extra_words)) / max(
            len(expected_tokens), 1
        )
        accuracy_percent = max(0.0, 1.0 - word_error_rate) * 100.0

        # Overall weighted score
        overall_score = (
            self._weights["similarity"] * (similarity * 100)
            + self._weights["word_match"] * word_match_percent
            + self._weights["accuracy"] * accuracy_percent
        )

        # Clamp overall score
        overall_score = min(100.0, max(0.0, round(overall_score, 1)))

        # Generate feedback
        feedback = self._generate_feedback(
            overall_score, similarity, word_match_percent, missing_words, exercise_type
        )

        return EvaluationResult(
            accuracy_percent=round(accuracy_percent, 1),
            word_match_percent=round(word_match_percent, 1),
            missing_words=missing_words,
            extra_words=extra_words,
            sentence_similarity=round(similarity * 100, 1),
            overall_score=overall_score,
            feedback=feedback,
        )

    def _generate_feedback(
        self,
        overall_score: float,
        similarity: float,
        word_match: float,
        missing_words: list[str],
        exercise_type: str,
    ) -> str:
        """Generate human-readable feedback based on performance."""
        if overall_score >= 90:
            return "Excellent pronunciation! You sound very natural."

        if overall_score >= 70:
            return "Good job! A few minor differences, but clearly understandable."

        if overall_score >= 50:
            if missing_words:
                hint = "Try saying: " + " ".join(missing_words[:3])
                if len(missing_words) > 3:
                    hint += "..."
                return f"Keep practicing. Some words need attention. {hint}"
            return "Keep practicing. Try speaking a bit slower and clearer."

        if overall_score >= 30:
            return "Most words need improvement. Try listening to the example again and repeat."

        return "This was difficult to understand. Try again and speak each word clearly."