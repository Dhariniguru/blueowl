from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Module, Lesson, LessonProgress, Vocabulary, Question, QuestionOption, LessonImage, LearningTip

bp = Blueprint("lessons", __name__, url_prefix="/api/lessons")


@bp.get("/path")
@jwt_required()
def learning_path():
    """
    Full Duolingo-style path: every module ('floor') with its lessons and the
    user's progress status on each — exactly what the Dashboard path UI needs.
    """
    user = User.query.get_or_404(int(get_jwt_identity()))
    modules = Module.query.order_by(Module.order).all()
    progress_map = {lp.lesson_id: lp for lp in user.lesson_progress.all()}

    result = []
    for module in modules:
        lessons_out = []
        for lesson in module.lessons:
            lp = progress_map.get(lesson.id)
            lessons_out.append({
                **lesson.to_dict(include_content=False),
                "status": lp.status if lp else "not_started",
                "best_score": lp.best_score if lp else 0,
            })
        result.append({**module.to_dict(), "lessons": lessons_out})

    return jsonify(result)


@bp.get("/recommended")
@jwt_required()
def recommended():
    from app.services.adaptive_engine import recommend_next_lessons
    user = User.query.get_or_404(int(get_jwt_identity()))
    lessons = recommend_next_lessons(user)
    return jsonify([l.to_dict(include_content=False) for l in lessons])


@bp.get("/<int:lesson_id>")
@jwt_required()
def get_lesson(lesson_id):
    """Get lesson with all structured data: vocabulary, questions, images, tips."""
    lesson = Lesson.query.get_or_404(lesson_id)
    
    # Get vocabulary
    vocab = Vocabulary.query.filter_by(lesson_id=lesson.id).all()
    
    # Get questions with options
    questions = Question.query.filter_by(lesson_id=lesson.id).order_by(Question.order).all()
    questions_data = []
    for q in questions:
        opts = QuestionOption.query.filter_by(question_id=q.id).order_by(QuestionOption.order).all()
        questions_data.append({
            "id": q.id,
            "question_type": q.question_type,
            "question_text": q.question_text,
            "options": [o.option_text for o in opts],
            "correct_answer": q.correct_answer,
            "image_url": q.image_url,
            "difficulty": q.difficulty,
            "explanation": q.explanation,
            "xp_reward": q.xp_reward,
            "order": q.order,
        })
    
    # Get images
    images = LessonImage.query.filter_by(lesson_id=lesson.id).order_by(LessonImage.order).all()
    
    # Get tips
    tips = LearningTip.query.filter_by(lesson_id=lesson.id).order_by(LearningTip.order).all()
    
    return jsonify({
        **lesson.to_dict(),
        "vocabulary": [v.to_dict() for v in vocab],
        "questions": questions_data,
        "images": [img.to_dict() for img in images],
        "tips": [t.to_dict() for t in tips],
    })


@bp.post("/<int:lesson_id>/start")
@jwt_required()
def start_lesson(lesson_id):
    user = User.query.get_or_404(int(get_jwt_identity()))
    Lesson.query.get_or_404(lesson_id)

    lp = LessonProgress.query.filter_by(user_id=user.id, lesson_id=lesson_id).first()
    if not lp:
        lp = LessonProgress(user_id=user.id, lesson_id=lesson_id, status="in_progress", attempts=0, best_score=0)
        db.session.add(lp)
    elif lp.status == "not_started":
        lp.status = "in_progress"
    db.session.commit()
    return jsonify(lp.to_dict())


@bp.post("/<int:lesson_id>/complete")
@jwt_required()
def complete_lesson(lesson_id):
    """
    Body: { "score_percent": 0-100 }
    Marks the lesson complete, awards XP, updates streak, checks achievements
    and level-up, and returns everything the frontend needs to celebrate.
    """
    from app.services.adaptive_engine import maybe_advance_level
    from app.services.gamification import award_xp, check_and_grant_achievements
    
    user = User.query.get_or_404(int(get_jwt_identity()))
    lesson = Lesson.query.get_or_404(lesson_id)
    data = request.get_json() or {}
    score_percent = float(data.get("score_percent", 100))

    lp = LessonProgress.query.filter_by(user_id=user.id, lesson_id=lesson_id).first()
    if not lp:
        lp = LessonProgress(user_id=user.id, lesson_id=lesson_id, attempts=0, best_score=0)
        db.session.add(lp)

    lp.attempts += 1
    lp.best_score = max(lp.best_score, score_percent)

    # Only mark as completed if score meets passing threshold (50%)
    PASS_THRESHOLD = 50
    if score_percent >= PASS_THRESHOLD:
        lp.status = "completed"
        lp.completed_at = datetime.utcnow()
        earned_xp = lesson.xp_reward
    else:
        lp.status = "in_progress"
        lp.completed_at = None
        # Reduced XP for attempt even if failed
        earned_xp = max(1, lesson.xp_reward // 4)

    user.touch_streak()
    award_xp(user, earned_xp)

    leveled_up = maybe_advance_level(user)
    new_achievements = check_and_grant_achievements(user)

    db.session.commit()

    return jsonify({
        "progress": lp.to_dict(),
        "xp_earned": earned_xp,
        "leveled_up": leveled_up,
        "new_level": user.current_level,
        "new_achievements": [a.to_dict() for a in new_achievements],
        "user": user.to_dict(),
    })