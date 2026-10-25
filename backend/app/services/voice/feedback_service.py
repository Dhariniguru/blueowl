"""
Voice Feedback Service
======================

Generates structured and user-friendly feedback for voice exercises.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class WordFeedback:
    """Per-word feedback for display."""
    word: str
    correct: bool
    position: int


class VoiceFeedbackService:
    """
    Generates feedback for voice exercise results.

    Separated from evaluation so feedback logic can be extended
    independently (e.g., with AI-generated feedback in the future).
    """

    def generate_word_feedback(
        self,
        expected_words: list[str],
        missing_words: list[str],
        extra_words: list[str],
    ) -> list[WordFeedback]:
        """
        Generate per-word feedback marking each expected word as correct or missing.

        Args:
            expected_words: The list of words that were expected
            missing_words: Words from expected that were not spoken
            extra_words: Words spoken that were not expected

        Returns:
            List of WordFeedback objects for UI display
        """
        missing_set = set(missing_words)
        feedback = []

        for idx, word in enumerate(expected_words):
            feedback.append(
                WordFeedback(
                    word=word,
                    correct=word not in missing_set,
                    position=idx,
                )
            )

        return feedback

    def get_score_color(self, score: float) -> str:
        """Get a display color for a score value."""
        if score >= 80:
            return "green"
        elif score >= 60:
            return "amber"
        elif score >= 40:
            return "orange"
        return "red"

    def get_score_icon(self, score: float) -> str:
        """Get an emoji icon for a score value."""
        if score >= 90:
            return "🌟"
        elif score >= 70:
            return "👍"
        elif score >= 50:
            return "💪"
        return "🔄"