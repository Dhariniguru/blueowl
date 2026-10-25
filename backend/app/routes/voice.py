"""
Voice Learning Module API Routes
=================================

Endpoints:
  GET  /api/voice/lesson/{lesson_id}  — Get speaking exercise data
  POST /api/voice/submit              — Submit a voice attempt
  GET  /api/voice/history             — Get user's voice attempt history
  GET  /api/voice/stats               — Get aggregate voice stats
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import User, VoiceAttempt, Lesson
from app.schemas.voice import (
    VoiceSubmitRequest,
    VoiceSubmitResponse,
    VoiceLessonResponse,
    EXERCISE_INSTRUCTIONS,
)
from app.services.voice import (
    SpeechProviderFactory,
    VoiceEvaluationService,
    VoiceHistoryService,
    VoiceFeedbackService,
)

bp = Blueprint("voice", __name__, url_prefix="/api/voice")

# Service instances (could be injected in a full DI setup)
evaluation_service = VoiceEvaluationService()
history_service = VoiceHistoryService()
feedback_service = VoiceFeedbackService()


def _get_current_user():
    """Helper to get the authenticated user or return a 404 error response."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return None, (jsonify({"error": "User not found"}), 404)
    return user, None


@bp.route("/lesson/<int:lesson_id>", methods=["GET"])
@jwt_required()
def get_lesson(lesson_id):
    """
    Get speaking exercise data for a lesson.

    Returns the target text, exercise type, and instructions
    based on the lesson's content configuration.
    """
    user, error = _get_current_user()
    if error:
        return error

    lesson = Lesson.query.get_or_404(lesson_id)
    content = lesson.content or {}

    # Determine exercise type from lesson_type or content
    exercise_type = content.get("exercise_type", lesson.lesson_type)

    # Map lesson_type to exercise_type if needed
    type_mapping = {
        "speaking": "repeat",
        "reading": "read_aloud",
        "writing": "conversation",
    }
    if exercise_type not in ("repeat", "read_aloud", "conversation"):
        exercise_type = type_mapping.get(exercise_type, "repeat")

    # Get target text based on exercise type
    if exercise_type == "repeat":
        target_text = content.get("target_sentence", "")
        if not target_text:
            sentences = content.get("target_sentences", [])
            target_text = sentences[0] if sentences else ""
    elif exercise_type == "read_aloud":
        target_text = content.get("passage", "")
    elif exercise_type == "conversation":
        target_text = content.get("prompt", "")
    else:
        target_text = content.get("target_sentence", content.get("text", ""))
        if not target_text:
            sentences = content.get("target_sentences", [])
            target_text = sentences[0] if sentences else ""

    response = VoiceLessonResponse(
        lesson_id=lesson.id,
        exercise_type=exercise_type,
        target_text=target_text,
        instructions=EXERCISE_INSTRUCTIONS.get(
            exercise_type, "Speak the text clearly."
        ),
        difficulty=lesson.difficulty,
    )

    return jsonify(response.to_dict())


@bp.route("/submit", methods=["POST"])
@jwt_required()
def submit_attempt():
    """
    Submit a voice attempt for evaluation.

    Expected JSON body:
    {
        "lesson_id": int,
        "exercise_type": "repeat" | "read_aloud" | "conversation",
        "spoken_text": str (the transcript from speech recognition),
        "duration": float | null (seconds),
        "provider": "web_speech_api" (or future provider names)
    }

    Returns:
    {
        "attempt_id": int,
        "accuracy_percent": float,
        "word_match_percent": float,
        "sentence_similarity": float,
        "overall_score": float,
        "missing_words": [str],
        "extra_words": [str],
        "word_feedback": [{ "word": str, "correct": bool, "position": int }],
        "feedback": str
    }
    """
    user, error = _get_current_user()
    if error:
        return error

    # Parse and validate request
    req = VoiceSubmitRequest.from_dict(request.get_json() or {})
    validation_errors = req.validate()
    if validation_errors:
        return jsonify({"error": "; ".join(validation_errors)}), 400

    # Get the lesson to retrieve target text
    lesson = Lesson.query.get(req.lesson_id)
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404

    content = lesson.content or {}

    # Determine target text based on exercise type
    if req.exercise_type == "repeat":
        target_sentences = content.get("target_sentences", [])
        target_text = content.get("target_sentence", "")
        if not target_text and target_sentences:
            target_text = target_sentences[0]  # Use first sentence as default
    elif req.exercise_type == "read_aloud":
        target_text = content.get("passage", "")
    elif req.exercise_type == "conversation":
        target_text = content.get("prompt", "")
    else:
        target_text = content.get("text", "")
        if not target_text:
            target_sentences = content.get("target_sentences", [])
            if target_sentences:
                target_text = target_sentences[0]

    if not target_text:
        return jsonify({"error": "No target text configured for this lesson"}), 400

    # Use the speech provider abstraction (even though browser handles STT,
    # this ensures the architecture is provider-independent)
    try:
        provider = SpeechProviderFactory.get_provider(req.provider)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # The "audio data" for WebSpeechProvider is the text itself
    audio_bytes = req.spoken_text.encode("utf-8")
    if not provider.validate_audio(audio_bytes):
        return jsonify({"error": "Invalid or empty transcription"}), 400

    # Evaluate the transcript against the target text
    result = evaluation_service.evaluate(
        expected=target_text,
        transcript=req.spoken_text,
        exercise_type=req.exercise_type,
    )

    # Generate per-word feedback for the frontend
    expected_words = target_text.lower().split()
    word_feedback_list = feedback_service.generate_word_feedback(
        expected_words=expected_words,
        missing_words=result.missing_words,
        extra_words=result.extra_words,
    )

    # Store the attempt in the database
    attempt = VoiceAttempt(
        user_id=user.id,
        lesson_id=req.lesson_id,
        exercise_type=req.exercise_type,
        provider=req.provider,
        target_text=target_text,
        transcript=req.spoken_text,
        accuracy_percent=result.accuracy_percent,
        word_match_percent=result.word_match_percent,
        sentence_similarity=result.sentence_similarity,
        overall_score=result.overall_score,
        missing_words=result.missing_words,
        extra_words=result.extra_words,
        feedback=result.feedback,
        duration_seconds=req.duration,
    )
    db.session.add(attempt)
    db.session.commit()

    # Build word feedback as dicts for JSON serialisation
    word_feedback_dicts = [
        {"word": wf.word, "correct": wf.correct, "position": wf.position}
        for wf in word_feedback_list
    ]

    response = VoiceSubmitResponse(
        attempt_id=attempt.id,
        accuracy_percent=result.accuracy_percent,
        word_match_percent=result.word_match_percent,
        sentence_similarity=result.sentence_similarity,
        overall_score=result.overall_score,
        missing_words=result.missing_words,
        extra_words=result.extra_words,
        word_feedback=word_feedback_dicts,
        feedback=result.feedback,
    )

    return jsonify(response.to_dict())


@bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    """
    Get the user's voice attempt history.

    Query params:
      limit (int, default=50): Number of records to return
      offset (int, default=0): Pagination offset
      exercise_type (str, optional): Filter by exercise type

    Returns:
    {
        "attempts": [...],
        "stats": { "total_attempts": int, "average_score": float, ... }
    }
    """
    user, error = _get_current_user()
    if error:
        return error

    limit = request.args.get("limit", 50, type=int)
    offset = request.args.get("offset", 0, type=int)
    exercise_type = request.args.get("exercise_type")

    attempts = history_service.get_user_history(
        user_id=user.id,
        limit=limit,
        offset=offset,
        exercise_type=exercise_type,
    )
    stats = history_service.get_user_stats(user_id=user.id)

    return jsonify({
        "attempts": [a.to_dict() for a in attempts],
        "stats": stats,
    })


@bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    """Get aggregate voice exercise statistics."""
    user, error = _get_current_user()
    if error:
        return error

    stats = history_service.get_user_stats(user_id=user.id)
    return jsonify(stats)


# Keep the legacy /assess endpoint for backward compatibility
@bp.route("/assess", methods=["POST"])
@jwt_required()
def assess():
    """
    Legacy endpoint — kept for backward compatibility.

    Body: { "target_text": "...", "transcript": "...", "lesson_id": optional int }
    """
    user, error = _get_current_user()
    if error:
        return error

    data = request.get_json() or {}
    target_text = data.get("target_text", "").strip()
    transcript = data.get("transcript", "").strip()

    if not target_text:
        return jsonify({"error": "target_text is required"}), 400

    result = evaluation_service.evaluate(
        expected=target_text,
        transcript=transcript,
        exercise_type="repeat",
    )

    word_feedback_list = feedback_service.generate_word_feedback(
        expected_words=target_text.lower().split(),
        missing_words=result.missing_words,
        extra_words=result.extra_words,
    )
    word_feedback_dicts = [
        {"word": wf.word, "correct": wf.correct, "position": wf.position}
        for wf in word_feedback_list
    ]

    attempt = VoiceAttempt(
        user_id=user.id,
        lesson_id=data.get("lesson_id"),
        exercise_type="repeat",
        provider="web_speech_api",
        target_text=target_text,
        transcript=transcript,
        accuracy_percent=result.accuracy_percent,
        word_match_percent=result.word_match_percent,
        sentence_similarity=result.sentence_similarity,
        overall_score=result.overall_score,
        missing_words=result.missing_words,
        extra_words=result.extra_words,
        word_feedback=word_feedback_dicts,
        feedback=result.feedback,
    )
    db.session.add(attempt)
    db.session.commit()

    return jsonify({
        "pronunciation_score": result.overall_score,
        "word_feedback": word_feedback_dicts,
        "attempt_id": attempt.id,
    })