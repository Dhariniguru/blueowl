from datetime import datetime
from app.extensions import db
from app.models import Achievement, UserAchievement


def award_xp(user, amount):
    user.xp_points += amount


def check_and_grant_achievements(user):
    """Run after any progress-changing action. Returns list of newly earned achievements."""
    earned_codes = {ua.achievement.code for ua in user.achievements}
    newly_earned = []

    completed_lessons = user.lesson_progress.filter_by(status="completed").count()

    for achievement in Achievement.query.all():
        if achievement.code in earned_codes:
            continue

        unlocked = False
        if achievement.criteria_type == "streak" and user.streak_count >= achievement.criteria_value:
            unlocked = True
        elif achievement.criteria_type == "xp" and user.xp_points >= achievement.criteria_value:
            unlocked = True
        elif achievement.criteria_type == "lessons_completed" and completed_lessons >= achievement.criteria_value:
            unlocked = True
        elif achievement.criteria_type == "level":
            from app.models import CEFR_LEVELS
            if CEFR_LEVELS.index(user.current_level) >= achievement.criteria_value:
                unlocked = True

        if unlocked:
            ua = UserAchievement(user_id=user.id, achievement_id=achievement.id, earned_at=datetime.utcnow())
            db.session.add(ua)
            newly_earned.append(achievement)

    return newly_earned
