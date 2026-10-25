"""
Pronunciation Module API Routes
===============================

Endpoints:
  GET  /api/pronunciation/modules              — List all pronunciation modules
  GET  /api/pronunciation/modules/<id>         — Get a specific module with lessons
  GET  /api/pronunciation/lessons/<id>         — Get a specific lesson with exercises
  GET  /api/pronunciation/exercises/<id>       — Get a specific exercise
  POST /api/pronunciation/submit               — Submit a pronunciation attempt
  GET  /api/pronunciation/progress             — Get user's pronunciation progress
  GET  /api/pronunciation/history              — Get user's attempt history
  POST /api/pronunciation/lesson/<id>/complete — Mark lesson as complete
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import (
    User, PronunciationModule, PronunciationLessonNew, PronunciationExercise,
    PronunciationExerciseAttempt, PronunciationLessonProgress, PronunciationModuleProgress,
    PronunciationLessonLegacy
)
from app.services.voice.evaluation import VoiceEvaluationService

bp = Blueprint("pronunciation", __name__, url_prefix="/api/pronunciation")
evaluation_service = VoiceEvaluationService()


@bp.route("/resume", methods=["GET"])
@jwt_required()
def get_resume():
    """Get the user's current pronunciation position (module, lesson, exercise)."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Find the first in-progress module
    module_progress = PronunciationModuleProgress.query.filter_by(
        user_id=user.id, status="in_progress"
    ).order_by(PronunciationModuleProgress.last_attempt_at.desc()).first()

    if not module_progress:
        # Find first not-started module
        first_module = PronunciationModule.query.order_by(PronunciationModule.order).first()
        if not first_module:
            return jsonify({"resume": None}), 200
        return jsonify({
            "resume": {
                "module_id": first_module.id,
                "lesson_id": None,
                "exercise_id": None,
            }
        }), 200

    module = PronunciationModule.query.get(module_progress.module_id)
    if not module:
        return jsonify({"resume": None}), 200

    # Find the current lesson based on progress
    lesson_progress = PronunciationLessonProgress.query.filter_by(
        user_id=user.id, module_id=module.id, status="in_progress"
    ).order_by(PronunciationLessonProgress.last_attempt_at.desc()).first()

    if not lesson_progress:
        # Find first not-started lesson in this module
        first_lesson = module.lessons.order_by(PronunciationLessonNew.order).first()
        if not first_lesson:
            return jsonify({"resume": None}), 200
        return jsonify({
            "resume": {
                "module_id": module.id,
                "lesson_id": first_lesson.id,
                "exercise_id": None,
            }
        }), 200

    lesson = PronunciationLessonNew.query.get(lesson_progress.lesson_id)
    if not lesson:
        return jsonify({"resume": None}), 200

    # Find the current exercise based on progress
    exercises = lesson.exercises.order_by(PronunciationExercise.order).all()
    if not exercises:
        return jsonify({"resume": None}), 200

    current_exercise = None
    current_order = lesson_progress.current_exercise_order or 1
    for ex in exercises:
        if ex.order >= current_order:
            current_exercise = ex
            break
    if not current_exercise:
        current_exercise = exercises[-1]

    return jsonify({
        "resume": {
            "module_id": module.id,
            "lesson_id": lesson.id,
            "exercise_id": current_exercise.id,
        }
    }), 200


@bp.route("/modules", methods=["GET"])
@jwt_required()
def list_modules():
    """List all pronunciation modules with progress."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    modules = PronunciationModule.query.order_by(PronunciationModule.order).all()
    result = []

    for module in modules:
        module_data = module.to_dict()

        # Get module progress
        progress = PronunciationModuleProgress.query.filter_by(
            user_id=user.id, module_id=module.id
        ).first()

        if progress:
            module_data["progress"] = progress.to_dict()
        else:
            module_data["progress"] = {
                "status": "not_started",
                "lessons_completed": 0,
                "lessons_total": module.lessons.count(),
                "xp_earned": 0,
                "best_score": 0.0,
            }

        # Get lessons with their progress
        lessons_data = []
        for lesson in module.lessons.all():
            lesson_data = lesson.to_dict()

            lesson_progress = PronunciationLessonProgress.query.filter_by(
                user_id=user.id, lesson_id=lesson.id
            ).first()

            if lesson_progress:
                lesson_data["progress"] = lesson_progress.to_dict()
            else:
                lesson_data["progress"] = {
                    "status": "not_started",
                    "exercises_completed": 0,
                    "exercises_total": lesson.exercises.count(),
                    "xp_earned": 0,
                    "best_score": 0.0,
                }

            lessons_data.append(lesson_data)

        module_data["lessons"] = lessons_data
        result.append(module_data)

    return jsonify(result)


@bp.route("/modules/<int:module_id>", methods=["GET"])
@jwt_required()
def get_module(module_id):
    """Get a specific pronunciation module with lessons."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    module = PronunciationModule.query.get_or_404(module_id)
    module_data = module.to_dict()

    # Get module progress
    progress = PronunciationModuleProgress.query.filter_by(
        user_id=user.id, module_id=module.id
    ).first()

    if progress:
        module_data["progress"] = progress.to_dict()

    # Get lessons with their progress
    lessons_data = []
    for lesson in module.lessons.all():
        lesson_data = lesson.to_dict()

        lesson_progress = PronunciationLessonProgress.query.filter_by(
            user_id=user.id, lesson_id=lesson.id
        ).first()

        if lesson_progress:
            lesson_data["progress"] = lesson_progress.to_dict()

        lessons_data.append(lesson_data)

    module_data["lessons"] = lessons_data
    return jsonify(module_data)


@bp.route("/lessons/<int:lesson_id>", methods=["GET"])
@jwt_required()
def get_lesson(lesson_id):
    """Get a specific pronunciation lesson with exercises."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    lesson = PronunciationLessonNew.query.get_or_404(lesson_id)
    lesson_data = lesson.to_dict()

    # Get lesson progress
    progress = PronunciationLessonProgress.query.filter_by(
        user_id=user.id, lesson_id=lesson.id
    ).first()

    if progress:
        lesson_data["progress"] = progress.to_dict()

    # Get exercises with best scores
    exercises_data = []
    for exercise in lesson.exercises.all():
        exercise_data = exercise.to_dict()

        # Get best attempt for this exercise
        best_attempt = PronunciationExerciseAttempt.query.filter_by(
            user_id=user.id, exercise_id=exercise.id
        ).order_by(PronunciationExerciseAttempt.overall_score.desc()).first()

        if best_attempt:
            exercise_data["best_score"] = best_attempt.overall_score
            exercise_data["attempts"] = PronunciationExerciseAttempt.query.filter_by(
                user_id=user.id, exercise_id=exercise.id
            ).count()

        exercises_data.append(exercise_data)

    lesson_data["exercises"] = exercises_data
    return jsonify(lesson_data)


@bp.route("/lessons/<int:lesson_id>/legacy", methods=["GET"])
@jwt_required()
def get_legacy_lesson(lesson_id):
    """Get a specific legacy pronunciation lesson."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    lesson = PronunciationLessonLegacy.query.get_or_404(lesson_id)
    return jsonify(lesson.to_dict())


@bp.route("/exercises/<int:exercise_id>", methods=["GET"])
@jwt_required()
def get_exercise(exercise_id):
    """Get a specific pronunciation exercise."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    exercise = PronunciationExercise.query.get_or_404(exercise_id)
    exercise_data = exercise.to_dict()

    # Get best attempt
    best_attempt = PronunciationExerciseAttempt.query.filter_by(
        user_id=user.id, exercise_id=exercise.id
    ).order_by(PronunciationExerciseAttempt.overall_score.desc()).first()

    if best_attempt:
        exercise_data["best_score"] = best_attempt.overall_score
        exercise_data["last_attempt"] = best_attempt.to_dict()

    return jsonify(exercise_data)


@bp.route("/audio", methods=["POST"])
@jwt_required()
def submit_audio():
    """
    Submit an audio recording for pronunciation evaluation.

    Expected multipart/form-data:
      audio:  The audio blob (webm/ogg/wav)
      exercise_id: int
      lesson_id: int
      module_id: int
      duration: float (optional)

    The audio is transcribed (via OpenAI Whisper if configured, otherwise
    a fallback message is returned) and evaluated against the expected text.
    """
    import os
    import tempfile

    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    exercise_id = request.form.get("exercise_id", type=int)
    lesson_id = request.form.get("lesson_id", type=int)
    module_id = request.form.get("module_id", type=int)
    duration = request.form.get("duration", type=float)
    form_transcript = (request.form.get("transcript") or "").strip()

    if not exercise_id or not lesson_id or not module_id:
        return jsonify({"error": "exercise_id, lesson_id, and module_id are required"}), 400

    exercise = PronunciationExercise.query.get_or_404(exercise_id)
    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    # Allow browser-provided transcript (Web Speech API) without audio
    audio_file = request.files.get("audio")
    audio_bytes = b""
    if audio_file is not None:
        audio_bytes = audio_file.read()

    if not audio_bytes and not form_transcript:
        return jsonify({"error": "No audio file or transcript provided"}), 400

    # Prefer browser transcript if provided
    transcript = form_transcript or None
    transcription_error = None

    if transcript is None:
        openai_api_key = os.environ.get("OPENAI_API_KEY", "")
        if openai_api_key and audio_bytes:
            try:
                import openai
                client = openai.OpenAI(api_key=openai_api_key)

                content_type = audio_file.content_type or "audio/webm"
                ext_map = {
                    "audio/webm": "webm",
                    "audio/ogg": "ogg",
                    "audio/wav": "wav",
                    "audio/mp3": "mp3",
                    "audio/mpeg": "mp3",
                    "audio/mp4": "mp4",
                    "audio/x-m4a": "m4a",
                }
                ext = ext_map.get(content_type, "webm")

                with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as tmp:
                    tmp.write(audio_bytes)
                    tmp_path = tmp.name

                try:
                    with open(tmp_path, "rb") as f:
                        result = client.audio.transcriptions.create(
                            model="whisper-1",
                            file=f,
                            language="en",
                        )
                    transcript = result.text.strip()
                finally:
                    if os.path.exists(tmp_path):
                        os.unlink(tmp_path)

            except Exception as e:
                transcription_error = str(e)
                transcript = None
        else:
            transcription_error = "No transcript provided and no transcription backend configured."

    # If we couldn't transcribe, return a clear error
    if not transcript:
        return jsonify({
            "error": "Could not transcribe audio. " + (transcription_error or "Unknown error."),
            "transcription_error": transcription_error,
        }), 422

    # Evaluate the transcript against the expected text
    result = evaluation_service.evaluate(
        expected=exercise.expected_text,
        transcript=transcript,
        exercise_type="repeat",
    )

    # Calculate confidence score
    confidence_score = round((result.accuracy_percent + result.sentence_similarity) / 2, 1)

    # Generate detailed suggestions
    suggestions = []
    expected_words = exercise.expected_text.lower().split()
    spoken_words = transcript.lower().split()

    for word in result.missing_words:
        suggestions.append(f"You missed the word '{word}'.")

    for i, expected_word in enumerate(expected_words):
        if i < len(spoken_words):
            spoken_word = spoken_words[i]
            if expected_word != spoken_word and expected_word not in result.missing_words:
                suggestions.append(f"You pronounced '{expected_word}' as '{spoken_word}'.")

    if result.accuracy_percent < 50:
        suggestions.append("Try speaking more slowly and clearly.")
    elif result.accuracy_percent < 70:
        suggestions.append("Focus on the words you missed and try again.")

    # Determine correctly and incorrectly pronounced words
    correctly_pronounced = [w for w in expected_words if w not in result.missing_words]
    incorrect_words = result.missing_words[:]
    mispronounced_words = []

    for i, expected_word in enumerate(expected_words):
        if i < len(spoken_words) and expected_word != spoken_words[i]:
            if expected_word not in result.missing_words:
                mispronounced_words.append(expected_word)

    # Determine grade
    grade = "try_again"
    if result.accuracy_percent >= 90:
        grade = "excellent"
    elif result.accuracy_percent >= 75:
        grade = "very_good"
    elif result.accuracy_percent >= 60:
        grade = "good"
    elif result.accuracy_percent >= 40:
        grade = "needs_improvement"

    # Store the attempt
    attempt = PronunciationExerciseAttempt(
        user_id=user.id,
        exercise_id=exercise_id,
        lesson_id=lesson_id,
        module_id=module_id,
        transcript=transcript,
        confidence_score=confidence_score,
        accuracy_percent=result.accuracy_percent,
        word_match_percent=result.word_match_percent,
        overall_score=result.overall_score,
        words_correct=len(correctly_pronounced),
        words_total=len(expected_words),
        missing_words=result.missing_words,
        extra_words=result.extra_words,
        mispronounced_words=mispronounced_words,
        feedback=result.feedback,
        suggestions=suggestions,
        grade=grade,
        duration_seconds=duration,
    )
    db.session.add(attempt)

    # Update lesson progress
    lesson_progress = PronunciationLessonProgress.query.filter_by(
        user_id=user.id, lesson_id=lesson_id
    ).first()

    if not lesson_progress:
        lesson_progress = PronunciationLessonProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            module_id=module_id,
            exercises_total=PronunciationLessonNew.query.get(lesson_id).exercises.count(),
            total_attempts=0,
            exercises_completed=0,
            best_score=0.0,
            average_score=0.0,
            current_exercise_order=1,
            xp_earned=0,
        )
        db.session.add(lesson_progress)

    # Ensure numeric fields are not None (handle legacy rows)
    if lesson_progress.total_attempts is None:
        lesson_progress.total_attempts = 0
    if lesson_progress.exercises_completed is None:
        lesson_progress.exercises_completed = 0
    if lesson_progress.best_score is None:
        lesson_progress.best_score = 0.0
    if lesson_progress.average_score is None:
        lesson_progress.average_score = 0.0
    if lesson_progress.current_exercise_order is None:
        lesson_progress.current_exercise_order = 1
    if lesson_progress.xp_earned is None:
        lesson_progress.xp_earned = 0

    lesson_progress.total_attempts += 1
    lesson_progress.last_attempt_at = db.func.now()

    if not lesson_progress.started_at:
        lesson_progress.started_at = db.func.now()

    # Update best score
    if result.overall_score > lesson_progress.best_score:
        lesson_progress.best_score = result.overall_score

    # Calculate average score across all attempts
    all_attempts = PronunciationExerciseAttempt.query.filter_by(
        user_id=user.id, lesson_id=lesson_id
    ).all()
    if all_attempts:
        lesson_progress.average_score = sum(a.overall_score for a in all_attempts) / len(all_attempts)

    # Determine if this exercise is passed (score >= 60)
    exercise_completed = result.overall_score >= 60

    # Check if this exercise was already completed before (previous best >= 60)
    previous_best = PronunciationExerciseAttempt.query.filter_by(
        user_id=user.id, exercise_id=exercise_id
    ).order_by(PronunciationExerciseAttempt.overall_score.desc()).first()

    was_already_completed = previous_best is not None and previous_best.id != attempt.id and previous_best.overall_score >= 60

    # Count distinct completed exercises (score >= 60) for accurate progress
    completed_exercise_ids = set()
    completed_rows = db.session.query(
        PronunciationExerciseAttempt.exercise_id,
        db.func.max(PronunciationExerciseAttempt.overall_score)
    ).filter(
        PronunciationExerciseAttempt.user_id == user.id,
        PronunciationExerciseAttempt.lesson_id == lesson_id
    ).group_by(PronunciationExerciseAttempt.exercise_id).all()

    for ex_id, max_score in completed_rows:
        if max_score >= 60:
            completed_exercise_ids.add(ex_id)

    # Only increment if this exercise was not already completed
    if exercise_completed and not was_already_completed and exercise_id not in completed_exercise_ids:
        lesson_progress.exercises_completed = min(
            lesson_progress.exercises_completed + 1,
            lesson_progress.exercises_total
        )

    # Update current exercise order to the next exercise after this one
    lesson = PronunciationLessonNew.query.get(lesson_id)
    exercises_list = lesson.exercises.order_by(PronunciationExercise.order).all()
    total_exercises = len(exercises_list)

    next_order = exercise.order + 1
    lesson_progress.current_exercise_order = next_order
    if lesson_progress.current_exercise_order > total_exercises:
        lesson_progress.current_exercise_order = total_exercises

    # Check if lesson is completed (all distinct exercises passed with score >= 60)
    if exercise_completed:
        completed_exercise_ids.add(exercise_id)
    completed_count = len(completed_exercise_ids)

    lesson_was_completed = lesson_progress.status == "completed"
    is_lesson_completed_now = completed_count >= total_exercises

    if is_lesson_completed_now and not lesson_was_completed:
        lesson_progress.status = "completed"
        lesson_progress.completed_at = db.func.now()
        lesson_progress.xp_earned = lesson.xp_reward

        # Award XP to user for completing the lesson
        user.xp_points += lesson.xp_reward
        user.touch_streak()

        # Update module progress
        module_progress = PronunciationModuleProgress.query.filter_by(
            user_id=user.id, module_id=module_id
        ).first()

        if not module_progress:
            total_lessons_in_module = PronunciationModule.query.get(module_id).lessons.count()
            module_progress = PronunciationModuleProgress(
                user_id=user.id,
                module_id=module_id,
                lessons_total=total_lessons_in_module,
                lessons_completed=0,
                total_attempts=0,
                best_score=0.0,
                average_score=0.0,
                current_lesson_order=1,
                xp_earned=0,
            )
            db.session.add(module_progress)

        # Ensure numeric fields are not None
        if module_progress.total_attempts is None:
            module_progress.total_attempts = 0
        if module_progress.lessons_completed is None:
            module_progress.lessons_completed = 0
        if module_progress.best_score is None:
            module_progress.best_score = 0.0
        if module_progress.average_score is None:
            module_progress.average_score = 0.0
        if module_progress.current_lesson_order is None:
            module_progress.current_lesson_order = 1
        if module_progress.xp_earned is None:
            module_progress.xp_earned = 0

        module_progress.total_attempts += 1
        module_progress.last_attempt_at = db.func.now()

        if result.overall_score > module_progress.best_score:
            module_progress.best_score = result.overall_score

        # Check if module is now completed
        module_progress.lessons_completed = min(
            db.session.query(PronunciationLessonProgress).filter_by(
                user_id=user.id, module_id=module_id, status="completed"
            ).count(),
            module_progress.lessons_total,
        )

        if module_progress.lessons_completed >= module_progress.lessons_total:
            module_progress.status = "completed"
            module_progress.completed_at = db.func.now()
            module_progress.xp_earned += PronunciationModule.query.get(module_id).xp_reward
            user.xp_points += PronunciationModule.query.get(module_id).xp_reward
        else:
            module_progress.status = "in_progress"
    else:
        lesson_progress.status = "in_progress"
        if not lesson_progress.started_at:
            lesson_progress.started_at = db.func.now()

        # Update module progress
        module_progress = PronunciationModuleProgress.query.filter_by(
            user_id=user.id, module_id=module_id
        ).first()

        if not module_progress:
            module_progress = PronunciationModuleProgress(
                user_id=user.id,
                module_id=module_id,
                lessons_total=PronunciationModule.query.get(module_id).lessons.count(),
                lessons_completed=0,
                total_attempts=0,
                best_score=0.0,
                average_score=0.0,
                current_lesson_order=1,
                xp_earned=0,
            )
            db.session.add(module_progress)

        # Ensure numeric fields are not None
        if module_progress.total_attempts is None:
            module_progress.total_attempts = 0
        if module_progress.lessons_completed is None:
            module_progress.lessons_completed = 0
        if module_progress.best_score is None:
            module_progress.best_score = 0.0
        if module_progress.average_score is None:
            module_progress.average_score = 0.0
        if module_progress.current_lesson_order is None:
            module_progress.current_lesson_order = 1
        if module_progress.xp_earned is None:
            module_progress.xp_earned = 0

        module_progress.total_attempts += 1
        module_progress.last_attempt_at = db.func.now()

        if result.overall_score > module_progress.best_score:
            module_progress.best_score = result.overall_score

        if module_progress.status != "completed":
            module_progress.status = "in_progress"

    db.session.commit()

    # XP earned per exercise attempt (proportional to score, min 1 XP for passing)
    exercise_xp = 0
    if result.overall_score >= 60:
        exercise_xp = max(1, round(exercise.xp_reward * (result.overall_score / 100)))
    elif result.overall_score >= 40:
        exercise_xp = 0

    return jsonify({
        "attempt_id": attempt.id,
        "transcript": transcript,
        "accuracy_percent": result.accuracy_percent,
        "word_match_percent": result.word_match_percent,
        "overall_score": result.overall_score,
        "missing_words": result.missing_words,
        "extra_words": result.extra_words,
        "feedback": result.feedback,
        "confidence_score": confidence_score,
        "correctly_pronounced": correctly_pronounced,
        "incorrect_words": incorrect_words,
        "mispronounced_words": mispronounced_words,
        "suggestions": suggestions,
        "grade": grade,
        "difficulty": exercise.difficulty,
        "xp_earned": lesson_progress.xp_earned if lesson_progress.status == "completed" else exercise_xp,
        "lesson_completed": lesson_progress.status == "completed",
        "exercise_completed": exercise_completed,
        "exercises_completed": completed_count,
        "exercises_total": total_exercises,
        "current_exercise_order": lesson_progress.current_exercise_order,
    })


@bp.route("/submit", methods=["POST"])
@jwt_required()
def submit_attempt():
    """
    Submit a pronunciation attempt for evaluation.

    Expected JSON body:
    {
        "exercise_id": int,
        "lesson_id": int,
        "module_id": int,
        "spoken_text": str (the transcript from speech recognition),
        "duration": float | null (seconds)
    }
    """
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    exercise_id = data.get("exercise_id")
    lesson_id = data.get("lesson_id")
    module_id = data.get("module_id")
    spoken_text = (data.get("spoken_text") or data.get("transcript") or "").strip()
    duration = data.get("duration")

    if not exercise_id or not lesson_id or not module_id:
        return jsonify({"error": "exercise_id, lesson_id, and module_id are required"}), 400
    if not spoken_text:
        return jsonify({"error": "spoken_text is required"}), 400

    exercise = PronunciationExercise.query.get_or_404(exercise_id)
    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    # Evaluate using the existing voice evaluation service
    result = evaluation_service.evaluate(
        expected=exercise.expected_text,
        transcript=spoken_text,
        exercise_type="repeat",
    )

    # Calculate confidence score
    confidence_score = round((result.accuracy_percent + result.sentence_similarity) / 2, 1)

    # Generate detailed suggestions
    suggestions = []
    expected_words = exercise.expected_text.lower().split()
    spoken_words = spoken_text.lower().split()

    for word in result.missing_words:
        suggestions.append(f"You missed the word '{word}'.")

    for i, expected_word in enumerate(expected_words):
        if i < len(spoken_words):
            spoken_word = spoken_words[i]
            if expected_word != spoken_word and expected_word not in result.missing_words:
                suggestions.append(f"You pronounced '{expected_word}' as '{spoken_word}'.")

    if result.accuracy_percent < 50:
        suggestions.append("Try speaking more slowly and clearly.")
    elif result.accuracy_percent < 70:
        suggestions.append("Focus on the words you missed and try again.")

    # Determine correctly and incorrectly pronounced words
    correctly_pronounced = [w for w in expected_words if w not in result.missing_words]
    incorrect_words = result.missing_words[:]
    mispronounced_words = []

    for i, expected_word in enumerate(expected_words):
        if i < len(spoken_words) and expected_word != spoken_words[i]:
            if expected_word not in result.missing_words:
                mispronounced_words.append(expected_word)

    # Determine grade
    grade = "try_again"
    if result.accuracy_percent >= 90:
        grade = "excellent"
    elif result.accuracy_percent >= 75:
        grade = "very_good"
    elif result.accuracy_percent >= 60:
        grade = "good"
    elif result.accuracy_percent >= 40:
        grade = "needs_improvement"

    # Store the attempt
    attempt = PronunciationExerciseAttempt(
        user_id=user.id,
        exercise_id=exercise_id,
        lesson_id=lesson_id,
        module_id=module_id,
        transcript=spoken_text,
        confidence_score=confidence_score,
        accuracy_percent=result.accuracy_percent,
        word_match_percent=result.word_match_percent,
        overall_score=result.overall_score,
        words_correct=len(correctly_pronounced),
        words_total=len(expected_words),
        missing_words=result.missing_words,
        extra_words=result.extra_words,
        mispronounced_words=mispronounced_words,
        feedback=result.feedback,
        suggestions=suggestions,
        grade=grade,
        duration_seconds=duration,
    )
    db.session.add(attempt)

    # Update lesson progress
    lesson_progress = PronunciationLessonProgress.query.filter_by(
        user_id=user.id, lesson_id=lesson_id
    ).first()

    if not lesson_progress:
        lesson_progress = PronunciationLessonProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            module_id=module_id,
            exercises_total=PronunciationLessonNew.query.get(lesson_id).exercises.count(),
            total_attempts=0,
            exercises_completed=0,
            best_score=0.0,
            average_score=0.0,
            current_exercise_order=1,
            xp_earned=0,
        )
        db.session.add(lesson_progress)

    # Ensure numeric fields are not None (handle legacy rows)
    if lesson_progress.total_attempts is None:
        lesson_progress.total_attempts = 0
    if lesson_progress.exercises_completed is None:
        lesson_progress.exercises_completed = 0
    if lesson_progress.best_score is None:
        lesson_progress.best_score = 0.0
    if lesson_progress.average_score is None:
        lesson_progress.average_score = 0.0
    if lesson_progress.current_exercise_order is None:
        lesson_progress.current_exercise_order = 1
    if lesson_progress.xp_earned is None:
        lesson_progress.xp_earned = 0

    lesson_progress.total_attempts += 1
    lesson_progress.last_attempt_at = db.func.now()

    if not lesson_progress.started_at:
        lesson_progress.started_at = db.func.now()

    # Update best score
    if result.overall_score > lesson_progress.best_score:
        lesson_progress.best_score = result.overall_score

    # Calculate average score across all attempts
    all_attempts = PronunciationExerciseAttempt.query.filter_by(
        user_id=user.id, lesson_id=lesson_id
    ).all()
    if all_attempts:
        lesson_progress.average_score = sum(a.overall_score for a in all_attempts) / len(all_attempts)

    # Determine if this exercise is passed (score >= 60)
    exercise_completed = result.overall_score >= 60

    # Check if this exercise was already completed before (previous best >= 60)
    previous_best = PronunciationExerciseAttempt.query.filter_by(
        user_id=user.id, exercise_id=exercise_id
    ).order_by(PronunciationExerciseAttempt.overall_score.desc()).first()

    was_already_completed = previous_best is not None and previous_best.id != attempt.id and previous_best.overall_score >= 60

    # Count distinct completed exercises (score >= 60) for accurate progress
    completed_exercise_ids = set()
    completed_rows = db.session.query(
        PronunciationExerciseAttempt.exercise_id,
        db.func.max(PronunciationExerciseAttempt.overall_score)
    ).filter(
        PronunciationExerciseAttempt.user_id == user.id,
        PronunciationExerciseAttempt.lesson_id == lesson_id
    ).group_by(PronunciationExerciseAttempt.exercise_id).all()

    for ex_id, max_score in completed_rows:
        if max_score >= 60:
            completed_exercise_ids.add(ex_id)

    # Only increment if this exercise was not already completed
    if exercise_completed and not was_already_completed and exercise_id not in completed_exercise_ids:
        lesson_progress.exercises_completed = min(
            lesson_progress.exercises_completed + 1,
            lesson_progress.exercises_total
        )

    # Update current exercise order to the next exercise after this one
    lesson = PronunciationLessonNew.query.get(lesson_id)
    exercises_list = lesson.exercises.order_by(PronunciationExercise.order).all()
    total_exercises = len(exercises_list)

    next_order = exercise.order + 1
    lesson_progress.current_exercise_order = next_order
    if lesson_progress.current_exercise_order > total_exercises:
        lesson_progress.current_exercise_order = total_exercises

    # Check if lesson is completed (all distinct exercises passed with score >= 60)
    if exercise_completed:
        completed_exercise_ids.add(exercise_id)
    completed_count = len(completed_exercise_ids)

    lesson_was_completed = lesson_progress.status == "completed"
    is_lesson_completed_now = completed_count >= total_exercises

    if is_lesson_completed_now and not lesson_was_completed:
        lesson_progress.status = "completed"
        lesson_progress.completed_at = db.func.now()
        lesson_progress.xp_earned = lesson.xp_reward

        # Award XP to user for completing the lesson
        user.xp_points += lesson.xp_reward
        user.touch_streak()

        # Update module progress
        module_progress = PronunciationModuleProgress.query.filter_by(
            user_id=user.id, module_id=module_id
        ).first()

        if not module_progress:
            total_lessons_in_module = PronunciationModule.query.get(module_id).lessons.count()
            module_progress = PronunciationModuleProgress(
                user_id=user.id,
                module_id=module_id,
                lessons_total=total_lessons_in_module,
                lessons_completed=0,
                total_attempts=0,
                best_score=0.0,
                average_score=0.0,
                current_lesson_order=1,
                xp_earned=0,
            )
            db.session.add(module_progress)

        # Ensure numeric fields are not None
        if module_progress.total_attempts is None:
            module_progress.total_attempts = 0
        if module_progress.lessons_completed is None:
            module_progress.lessons_completed = 0
        if module_progress.best_score is None:
            module_progress.best_score = 0.0
        if module_progress.average_score is None:
            module_progress.average_score = 0.0
        if module_progress.current_lesson_order is None:
            module_progress.current_lesson_order = 1
        if module_progress.xp_earned is None:
            module_progress.xp_earned = 0

        # Only increment module lessons_completed if this lesson wasn't already counted
        module_progress.total_attempts += 1
        module_progress.last_attempt_at = db.func.now()

        if result.overall_score > module_progress.best_score:
            module_progress.best_score = result.overall_score

        # Check if module is now completed
        module_progress.lessons_completed = min(
            db.session.query(PronunciationLessonProgress).filter_by(
                user_id=user.id, module_id=module_id, status="completed"
            ).count(),
            module_progress.lessons_total,
        )

        if module_progress.lessons_completed >= module_progress.lessons_total:
            module_progress.status = "completed"
            module_progress.completed_at = db.func.now()
            module_progress.xp_earned += PronunciationModule.query.get(module_id).xp_reward
            user.xp_points += PronunciationModule.query.get(module_id).xp_reward
        else:
            module_progress.status = "in_progress"
    else:
        lesson_progress.status = "in_progress"
        if not lesson_progress.started_at:
            lesson_progress.started_at = db.func.now()

        # Update module progress
        module_progress = PronunciationModuleProgress.query.filter_by(
            user_id=user.id, module_id=module_id
        ).first()

        if not module_progress:
            module_progress = PronunciationModuleProgress(
                user_id=user.id,
                module_id=module_id,
                lessons_total=PronunciationModule.query.get(module_id).lessons.count(),
                lessons_completed=0,
                total_attempts=0,
                best_score=0.0,
                average_score=0.0,
                current_lesson_order=1,
                xp_earned=0,
            )
            db.session.add(module_progress)

        # Ensure numeric fields are not None
        if module_progress.total_attempts is None:
            module_progress.total_attempts = 0
        if module_progress.lessons_completed is None:
            module_progress.lessons_completed = 0
        if module_progress.best_score is None:
            module_progress.best_score = 0.0
        if module_progress.average_score is None:
            module_progress.average_score = 0.0
        if module_progress.current_lesson_order is None:
            module_progress.current_lesson_order = 1
        if module_progress.xp_earned is None:
            module_progress.xp_earned = 0

        module_progress.total_attempts += 1
        module_progress.last_attempt_at = db.func.now()

        if result.overall_score > module_progress.best_score:
            module_progress.best_score = result.overall_score

        if module_progress.status != "completed":
            module_progress.status = "in_progress"

    db.session.commit()

    # XP earned per exercise attempt (proportional to score, min 1 XP for passing)
    exercise_xp = 0
    if result.overall_score >= 60:
        exercise_xp = max(1, round(exercise.xp_reward * (result.overall_score / 100)))
    elif result.overall_score >= 40:
        exercise_xp = 0

    return jsonify({
        "attempt_id": attempt.id,
        "transcript": spoken_text,
        "accuracy_percent": result.accuracy_percent,
        "word_match_percent": result.word_match_percent,
        "overall_score": result.overall_score,
        "missing_words": result.missing_words,
        "extra_words": result.extra_words,
        "feedback": result.feedback,
        "confidence_score": confidence_score,
        "correctly_pronounced": correctly_pronounced,
        "incorrect_words": incorrect_words,
        "mispronounced_words": mispronounced_words,
        "suggestions": suggestions,
        "grade": grade,
        "difficulty": exercise.difficulty,
        "xp_earned": lesson_progress.xp_earned if lesson_progress.status == "completed" else exercise_xp,
        "lesson_completed": lesson_progress.status == "completed",
        "exercise_completed": exercise_completed,
        "exercises_completed": completed_count,
        "exercises_total": total_exercises,
        "current_exercise_order": lesson_progress.current_exercise_order,
    })


@bp.route("/progress", methods=["GET"])
@jwt_required()
def get_progress():
    """Get user's overall pronunciation progress."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get all module progress
    module_progresses = PronunciationModuleProgress.query.filter_by(user_id=user.id).all()

    total_modules = PronunciationModule.query.count()
    completed_modules = sum(1 for p in module_progresses if p.status == "completed")

    total_lessons = sum(p.lessons_total for p in module_progresses)
    completed_lessons = sum(p.lessons_completed for p in module_progresses)

    total_attempts = sum(p.total_attempts for p in module_progresses)
    total_xp = sum(p.xp_earned for p in module_progresses)

    avg_score = 0.0
    if module_progresses:
        avg_score = sum(p.average_score for p in module_progresses if p.average_score > 0) / len(module_progresses)

    return jsonify({
        "total_modules": total_modules,
        "completed_modules": completed_modules,
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "total_attempts": total_attempts,
        "total_xp": total_xp,
        "average_score": round(avg_score, 1),
        "module_progress": [p.to_dict() for p in module_progresses],
    })


@bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    """Get the user's pronunciation attempt history."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    limit = request.args.get("limit", 20, type=int)
    module_id = request.args.get("module_id", type=int)
    lesson_id = request.args.get("lesson_id", type=int)

    query = PronunciationExerciseAttempt.query.filter_by(user_id=user.id)

    if module_id:
        query = query.filter_by(module_id=module_id)
    if lesson_id:
        query = query.filter_by(lesson_id=lesson_id)

    attempts = query.order_by(PronunciationExerciseAttempt.created_at.desc()).limit(limit).all()

    # Calculate aggregate stats
    total_attempts = len(attempts)
    avg_accuracy = 0.0
    avg_score = 0.0

    if total_attempts > 0:
        avg_accuracy = sum(a.accuracy_percent for a in attempts) / total_attempts
        avg_score = sum(a.overall_score for a in attempts) / total_attempts

    return jsonify({
        "attempts": [a.to_dict() for a in attempts],
        "stats": {
            "total_attempts": total_attempts,
            "average_accuracy": round(avg_accuracy, 1),
            "average_score": round(avg_score, 1),
        },
    })


@bp.route("/lesson/<int:lesson_id>/complete", methods=["POST"])
@jwt_required()
def complete_lesson(lesson_id):
    """Mark a pronunciation lesson as complete and award XP."""
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404

    lesson = PronunciationLessonNew.query.get_or_404(lesson_id)

    # Check if all exercises are completed
    total_exercises = lesson.exercises.count()
    completed_exercises = db.session.query(PronunciationExerciseAttempt.exercise_id).filter(
        PronunciationExerciseAttempt.user_id == user.id,
        PronunciationExerciseAttempt.lesson_id == lesson_id,
        PronunciationExerciseAttempt.overall_score >= 60
    ).distinct().count()

    if completed_exercises < total_exercises:
        return jsonify({
            "error": f"Complete all exercises ({completed_exercises}/{total_exercises}) to finish the lesson"
        }), 400

    # Update lesson progress
    lesson_progress = PronunciationLessonProgress.query.filter_by(
        user_id=user.id, lesson_id=lesson_id
    ).first()

    if lesson_progress and lesson_progress.status != "completed":
        # Ensure numeric fields are not None
        if lesson_progress.total_attempts is None:
            lesson_progress.total_attempts = 0
        if lesson_progress.exercises_completed is None:
            lesson_progress.exercises_completed = 0
        if lesson_progress.xp_earned is None:
            lesson_progress.xp_earned = 0

        lesson_progress.status = "completed"
        lesson_progress.completed_at = db.func.now()

        # Award XP
        user.xp_points += lesson.xp_reward
        lesson_progress.xp_earned = lesson.xp_reward

        # Update module progress
        module_progress = PronunciationModuleProgress.query.filter_by(
            user_id=user.id, module_id=lesson.module_id
        ).first()

        if module_progress:
            # Ensure numeric fields are not None
            if module_progress.lessons_completed is None:
                module_progress.lessons_completed = 0
            if module_progress.total_attempts is None:
                module_progress.total_attempts = 0
            if module_progress.xp_earned is None:
                module_progress.xp_earned = 0

            module_progress.lessons_completed += 1

            # Check if module is completed
            module = PronunciationModule.query.get(lesson.module_id)
            total_lessons = module.lessons.count()
            if module_progress.lessons_completed >= total_lessons:
                module_progress.status = "completed"
                module_progress.completed_at = db.func.now()
                user.xp_points += module.xp_reward
                module_progress.xp_earned += module.xp_reward

        db.session.commit()

    return jsonify({
        "success": True,
        "message": "Lesson completed!",
        "xp_earned": lesson.xp_reward,
        "total_xp": user.xp_points,
    })
