from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, LessonProgress, VoiceAttempt, Lesson, CEFR_LEVELS

bp = Blueprint("progress", __name__, url_prefix="/api/progress")


@bp.get("/dashboard")
@jwt_required()
def dashboard():
    """Everything the Progress/Reports page needs in one call."""
    user = User.query.get_or_404(int(get_jwt_identity()))

    completed = user.lesson_progress.filter_by(status="completed").all()
    total_lessons_completed = len(completed)
    avg_score = round(sum(c.best_score for c in completed) / total_lessons_completed, 1) if completed else 0

    by_type = {}
    for lp in completed:
        lesson = Lesson.query.get(lp.lesson_id)
        if not lesson:
            continue
        by_type.setdefault(lesson.lesson_type, {"count": 0, "avg_score": 0, "_sum": 0})
        by_type[lesson.lesson_type]["count"] += 1
        by_type[lesson.lesson_type]["_sum"] += lp.best_score

    for k, v in by_type.items():
        v["avg_score"] = round(v["_sum"] / v["count"], 1)
        del v["_sum"]

    recent_voice = user.voice_attempts.order_by(VoiceAttempt.created_at.desc()).limit(7).all()
    voice_trend = [
        {"date": v.created_at.strftime("%Y-%m-%d"), "score": v.overall_score}
        for v in reversed(recent_voice)
    ]

    week_ago = datetime.utcnow() - timedelta(days=7)
    weekly_activity = {}
    for lp in completed:
        if lp.completed_at and lp.completed_at >= week_ago:
            day = lp.completed_at.strftime("%a")
            weekly_activity[day] = weekly_activity.get(day, 0) + 1

    return jsonify({
        "user": user.to_dict(),
        "total_lessons_completed": total_lessons_completed,
        "average_score": avg_score,
        "skill_breakdown": by_type,
        "voice_trend": voice_trend,
        "weekly_activity": weekly_activity,
        "level_progress": {
            "current_level": user.current_level,
            "level_index": CEFR_LEVELS.index(user.current_level) + 1,
            "total_levels": len(CEFR_LEVELS),
        },
    })
