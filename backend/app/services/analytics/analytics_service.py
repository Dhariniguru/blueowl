"""
Learner Analytics Engine.

Tracks and computes comprehensive learner analytics including:
- Completed lessons, quiz accuracy, speaking accuracy, reading accuracy
- Vocabulary mastery, time spent learning, streaks, XP earned
- Achievements, learning consistency, weak/strong topics
- Learning speed, average score, improvement trends
"""
from datetime import datetime, timedelta, date
from collections import defaultdict
from app.extensions import db
from app.models import (
    User, Lesson, LessonProgress, VoiceAttempt, 
    Vocabulary, Question, Assessment, UserAchievement,
    CEFR_LEVELS
)


class AnalyticsService:
    """Service for computing learner analytics."""

    @staticmethod
    def get_user_progress(user_id: int) -> dict:
        """Get comprehensive user progress data."""
        user = User.query.get(user_id)
        if not user:
            return {}

        completed_progress = user.lesson_progress.filter_by(status="completed").all()
        total_lessons = Lesson.query.count()
        completed_lessons = len(completed_progress)
        
        # Module completion
        modules_completed = set()
        for lp in completed_progress:
            lesson = Lesson.query.get(lp.lesson_id)
            if lesson:
                module_lessons = Lesson.query.filter_by(module_id=lesson.module_id).count()
                module_completed = LessonProgress.query.filter(
                    LessonProgress.user_id == user_id,
                    LessonProgress.status == "completed",
                    LessonProgress.lesson_id.in_(
                        db.session.query(Lesson.id).filter(Lesson.module_id == lesson.module_id)
                    )
                ).count()
                if module_completed >= module_lessons:
                    modules_completed.add(lesson.module_id)

        # Quiz accuracy from lesson progress
        quiz_scores = [lp.best_score for lp in completed_progress if lp.best_score > 0]
        avg_quiz_accuracy = round(sum(quiz_scores) / len(quiz_scores), 1) if quiz_scores else 0

        # Speaking accuracy
        voice_attempts = user.voice_attempts.all()
        speaking_scores = [va.overall_score for va in voice_attempts if va.overall_score > 0]
        avg_speaking = round(sum(speaking_scores) / len(speaking_scores), 1) if speaking_scores else 0

        # Reading accuracy (from reading-type lessons)
        reading_progress = [
            lp for lp in completed_progress 
            if Lesson.query.get(lp.lesson_id) and Lesson.query.get(lp.lesson_id).lesson_type == "reading"
        ]
        reading_scores = [lp.best_score for lp in reading_progress if lp.best_score > 0]
        avg_reading = round(sum(reading_scores) / len(reading_scores), 1) if reading_scores else 0

        # Vocabulary mastery
        vocab_mastery = AnalyticsService._compute_vocabulary_mastery(user_id)

        # Time spent
        total_time_seconds = sum(lp.time_spent_seconds for lp in completed_progress)
        
        # Streaks
        daily_streak = user.streak_count
        weekly_streak = AnalyticsService._compute_weekly_streak(user_id)
        monthly_activity = AnalyticsService._compute_monthly_activity(user_id)

        # XP
        xp_earned = user.xp_points

        # Achievements
        achievements_count = user.achievements.count()

        # Learning consistency (days with activity in last 30 days)
        consistency = AnalyticsService._compute_consistency(user_id)

        # Weak/strong topics
        weak_topics, strong_topics = AnalyticsService._analyze_topics(user_id)

        # Improvement trend
        improvement_trend = AnalyticsService._compute_improvement_trend(user_id)

        # Average score
        all_scores = quiz_scores + speaking_scores + reading_scores
        avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0

        # Most active day
        most_active_day = AnalyticsService._compute_most_active_day(user_id)

        # Average daily learning time
        avg_daily_time = AnalyticsService._compute_avg_daily_time(user_id, completed_progress)

        return {
            "user": user.to_dict(),
            "overall_progress": {
                "lessons_completed": completed_lessons,
                "total_lessons": total_lessons,
                "modules_completed": len(modules_completed),
                "completion_percentage": round((completed_lessons / total_lessons) * 100, 1) if total_lessons > 0 else 0,
            },
            "performance_metrics": {
                "quiz_accuracy": avg_quiz_accuracy,
                "speaking_accuracy": avg_speaking,
                "reading_accuracy": avg_reading,
                "vocabulary_score": vocab_mastery,
                "average_score": avg_score,
            },
            "learning_analytics": {
                "most_active_day": most_active_day,
                "average_daily_learning_minutes": round(avg_daily_time / 60, 1),
                "study_consistency": consistency,
                "improvement_trend": improvement_trend,
                "total_time_spent_minutes": round(total_time_seconds / 60, 1),
                "daily_streak": daily_streak,
                "weekly_streak": weekly_streak,
                "monthly_activity": monthly_activity,
                "xp_earned": xp_earned,
                "achievements_count": achievements_count,
            },
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
        }

    @staticmethod
    def _compute_vocabulary_mastery(user_id: int) -> float:
        """Estimate vocabulary mastery based on completed vocabulary lessons."""
        user = User.query.get(user_id)
        completed_vocab = LessonProgress.query.join(Lesson).filter(
            LessonProgress.user_id == user_id,
            LessonProgress.status == "completed",
            Lesson.lesson_type == "vocabulary"
        ).all()
        
        if not completed_vocab:
            return 0.0
        
        avg_score = sum(lp.best_score for lp in completed_vocab) / len(completed_vocab)
        return round(avg_score, 1)

    @staticmethod
    def _compute_weekly_streak(user_id: int) -> int:
        """Compute how many consecutive weeks the user has been active."""
        user = User.query.get(user_id)
        if not user.last_active_date:
            return 0
        
        # Check activity in past 7 days
        week_ago = date.today() - timedelta(days=7)
        recent_activity = LessonProgress.query.filter(
            LessonProgress.user_id == user_id,
            LessonProgress.completed_at >= week_ago
        ).count()
        
        return 1 if recent_activity > 0 else 0

    @staticmethod
    def _compute_monthly_activity(user_id: int) -> list:
        """Get monthly lesson completion counts for last 6 months."""
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        monthly = defaultdict(int)
        
        progress = LessonProgress.query.filter(
            LessonProgress.user_id == user_id,
            LessonProgress.status == "completed",
            LessonProgress.completed_at >= six_months_ago
        ).all()
        
        for lp in progress:
            if lp.completed_at:
                key = lp.completed_at.strftime("%Y-%m")
                monthly[key] += 1
        
        return [{"month": k, "count": v} for k, v in sorted(monthly.items())]

    @staticmethod
    def _compute_consistency(user_id: int) -> float:
        """Compute study consistency as percentage of days active in last 30 days."""
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_days = set()
        
        progress = LessonProgress.query.filter(
            LessonProgress.user_id == user_id,
            LessonProgress.completed_at >= thirty_days_ago
        ).all()
        
        for lp in progress:
            if lp.completed_at:
                active_days.add(lp.completed_at.date())
        
        return round((len(active_days) / 30) * 100, 1)

    @staticmethod
    def _analyze_topics(user_id: int) -> tuple:
        """Identify weak and strong topics based on performance."""
        completed = LessonProgress.query.filter(
            LessonProgress.user_id == user_id,
            LessonProgress.status == "completed"
        ).all()
        
        topic_scores = defaultdict(list)
        for lp in completed:
            lesson = Lesson.query.get(lp.lesson_id)
            if lesson and lp.best_score > 0:
                topic_scores[lesson.lesson_type].append(lp.best_score)
        
        weak = []
        strong = []
        for topic, scores in topic_scores.items():
            avg = sum(scores) / len(scores)
            if avg < 60:
                weak.append({"topic": topic, "score": round(avg, 1)})
            elif avg >= 80:
                strong.append({"topic": topic, "score": round(avg, 1)})
        
        return weak, strong

    @staticmethod
    def _compute_improvement_trend(user_id: int) -> str:
        """Determine if the user is improving, stable, or declining."""
        completed = LessonProgress.query.filter(
            LessonProgress.user_id == user_id,
            LessonProgress.status == "completed"
        ).order_by(LessonProgress.completed_at).all()
        
        if len(completed) < 3:
            return "not_enough_data"
        
        # Compare first half vs second half scores
        mid = len(completed) // 2
        first_half = [lp.best_score for lp in completed[:mid] if lp.best_score > 0]
        second_half = [lp.best_score for lp in completed[mid:] if lp.best_score > 0]
        
        if not first_half or not second_half:
            return "not_enough_data"
        
        first_avg = sum(first_half) / len(first_half)
        second_avg = sum(second_half) / len(second_half)
        
        diff = second_avg - first_avg
        if diff > 5:
            return "improving"
        elif diff < -5:
            return "declining"
        else:
            return "stable"

    @staticmethod
    def _compute_most_active_day(user_id: int) -> str:
        """Find the day of week with most completed lessons."""
        completed = LessonProgress.query.filter(
            LessonProgress.user_id == user_id,
            LessonProgress.status == "completed",
            LessonProgress.completed_at.isnot(None)
        ).all()
        
        day_counts = defaultdict(int)
        for lp in completed:
            if lp.completed_at:
                day_counts[lp.completed_at.strftime("%A")] += 1
        
        if not day_counts:
            return "N/A"
        
        return max(day_counts, key=day_counts.get)

    @staticmethod
    def _compute_avg_daily_time(user_id: int, completed_progress: list) -> float:
        """Compute average daily learning time in seconds."""
        if not completed_progress:
            return 0.0
        
        # Get unique days
        days = set()
        for lp in completed_progress:
            if lp.completed_at:
                days.add(lp.completed_at.date())
        
        if not days:
            return 0.0
        
        total_time = sum(lp.time_spent_seconds for lp in completed_progress)
        return total_time / len(days)