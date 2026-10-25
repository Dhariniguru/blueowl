"""
Voice History Service
=====================

Handles retrieval of voice attempt history for the user dashboard.
"""

from typing import Optional

from app.extensions import db
from app.models import VoiceAttempt


class VoiceHistoryService:
    """Service for querying voice attempt history."""

    def get_user_history(
        self,
        user_id: int,
        limit: int = 50,
        offset: int = 0,
        exercise_type: Optional[str] = None,
    ) -> list[VoiceAttempt]:
        """
        Get voice attempt history for a user.

        Args:
            user_id: The user's ID
            limit: Maximum number of records to return
            offset: Pagination offset
            exercise_type: Optional filter by exercise type

        Returns:
            List of VoiceAttempt records
        """
        query = VoiceAttempt.query.filter_by(user_id=user_id)

        if exercise_type:
            query = query.filter_by(exercise_type=exercise_type)

        return (
            query.order_by(VoiceAttempt.created_at.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

    def get_user_stats(self, user_id: int) -> dict:
        """
        Get aggregate voice exercise statistics for a user.

        Args:
            user_id: The user's ID

        Returns:
            Dict with total_attempts, average_score, best_score, etc.
        """
        attempts = VoiceAttempt.query.filter_by(user_id=user_id).all()

        if not attempts:
            return {
                "total_attempts": 0,
                "average_score": 0.0,
                "best_score": 0.0,
                "total_exercises_completed": 0,
                "recent_improvement": 0.0,
            }

        scores = [a.overall_score for a in attempts if a.overall_score is not None]

        # Calculate recent improvement (last 5 vs previous 5)
        recent = scores[-5:] if len(scores) >= 5 else scores
        previous = scores[-10:-5] if len(scores) >= 10 else []

        recent_avg = sum(recent) / len(recent) if recent else 0
        previous_avg = sum(previous) / len(previous) if previous else 0
        improvement = recent_avg - previous_avg

        return {
            "total_attempts": len(attempts),
            "average_score": round(sum(scores) / len(scores), 1) if scores else 0.0,
            "best_score": round(max(scores), 1) if scores else 0.0,
            "total_exercises_completed": len(
                set(a.lesson_id for a in attempts if a.lesson_id)
            ),
            "recent_improvement": round(improvement, 1),
        }

    def get_lesson_attempts(
        self, user_id: int, lesson_id: int
    ) -> list[VoiceAttempt]:
        """Get all voice attempts for a specific lesson."""
        return (
            VoiceAttempt.query.filter_by(user_id=user_id, lesson_id=lesson_id)
            .order_by(VoiceAttempt.created_at.desc())
            .all()
        )