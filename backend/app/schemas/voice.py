"""
Pydantic-style schemas for the Voice Learning Module.

Since the project uses Flask (not FastAPI), these are dataclasses
with a validation method rather than actual Pydantic models.
This avoids introducing a new dependency while maintaining
clear API contracts.
"""

from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class VoiceSubmitRequest:
    """Schema for POST /api/voice/submit."""
    lesson_id: int
    exercise_type: str = "repeat"  # repeat|read_aloud|conversation
    spoken_text: str = ""
    duration: Optional[float] = None
    provider: str = "web_speech_api"

    def validate(self) -> list[str]:
        """Validate the request and return a list of error messages."""
        errors = []

        if not self.spoken_text or not self.spoken_text.strip():
            errors.append("spoken_text is required")

        if self.exercise_type not in ("repeat", "read_aloud", "conversation"):
            errors.append(f"Invalid exercise_type: {self.exercise_type}")

        if self.duration is not None and self.duration < 0:
            errors.append("duration cannot be negative")

        return errors

    @classmethod
    def from_dict(cls, data: dict):
        """Create from a dictionary (request JSON body)."""
        return cls(
            lesson_id=data.get("lesson_id"),
            exercise_type=data.get("exercise_type", "repeat"),
            spoken_text=data.get("spoken_text", ""),
            duration=data.get("duration"),
            provider=data.get("provider", "web_speech_api"),
        )


@dataclass
class VoiceSubmitResponse:
    """Schema for the response after submitting a voice attempt."""
    attempt_id: int
    accuracy_percent: float
    word_match_percent: float
    sentence_similarity: float
    overall_score: float
    missing_words: list[str]
    extra_words: list[str]
    word_feedback: list[dict]
    feedback: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class VoiceHistoryResponse:
    """Schema for voice history response."""
    attempts: list[dict]
    stats: dict

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class VoiceLessonResponse:
    """Schema for GET /api/voice/lesson/{lesson_id}."""
    lesson_id: int
    exercise_type: str
    target_text: str
    instructions: str
    difficulty: int

    def to_dict(self) -> dict:
        return asdict(self)


# Exercise type configurations
EXERCISE_INSTRUCTIONS = {
    "repeat": "Listen to the sentence, then repeat it aloud as accurately as you can.",
    "read_aloud": "Read the paragraph aloud clearly. Speak at a natural pace.",
    "conversation": "Answer the question naturally. Speak clearly and confidently.",
}