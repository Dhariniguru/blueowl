"""
AI-Based Personalized Learning Engine
--------------------------------------
This is intentionally a transparent, rule-based "adaptive" model rather than a
black box, which is the right call for a literacy tool: the reasoning behind
"why was I placed at this level / why is this my next lesson" has to be
explainable to learners, teachers, and evaluators.

Swap-in point: replace `score_to_level` and `recommend_next_lessons` internals
with a trained model later (e.g. IRT-based ability estimation) without
changing the API contract other modules rely on.
"""
from app.models import CEFR_LEVELS, Lesson, LessonProgress

# Difficulty bucket (1-6) -> CEFR level
DIFFICULTY_LEVEL_MAP = {1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2"}


def score_to_level(score_percent: float, avg_difficulty: float) -> str:
    """
    Combine raw score with the difficulty of the questions actually answered
    correctly to avoid over- or under-placing a learner who guessed well on
    easy questions or struggled on hard ones.
    """
    base_idx = min(round(avg_difficulty) - 1, len(CEFR_LEVELS) - 1)
    base_idx = max(base_idx, 0)

    if score_percent >= 85:
        base_idx = min(base_idx + 1, len(CEFR_LEVELS) - 1)
    elif score_percent < 50:
        base_idx = max(base_idx - 1, 0)

    return CEFR_LEVELS[base_idx]


def grade_assessment(questions_with_answers):
    """
    questions_with_answers: list of dicts
      {question, given_answer, correct_answer, difficulty}
    Returns (score_percent, avg_difficulty_of_correct, responses_log)
    """
    if not questions_with_answers:
        return 0.0, 1.0, []

    correct_count = 0
    correct_difficulties = []
    responses_log = []

    for item in questions_with_answers:
        is_correct = (
            str(item["given_answer"]).strip().lower()
            == str(item["correct_answer"]).strip().lower()
        )
        if is_correct:
            correct_count += 1
            correct_difficulties.append(item["difficulty"])
        responses_log.append({
            "question_id": item["question_id"],
            "given_answer": item["given_answer"],
            "correct": is_correct,
        })

    score_percent = round((correct_count / len(questions_with_answers)) * 100, 1)
    avg_difficulty = sum(correct_difficulties) / len(correct_difficulties) if correct_difficulties else 1.0
    return score_percent, avg_difficulty, responses_log


def recommend_next_lessons(user, limit=5):
    """
    Personalized lesson recommendation:
    1. Find the user's current module (matching their CEFR level).
    2. Prioritize lessons not yet completed, in module order.
    3. If a lesson was attempted but scored low (<60%), resurface it before
       moving on (remedial reinforcement).
    4. If the whole module is complete, spill over into the next level.
    """
    from app.models import Module  # local import avoids circular import at module load

    completed_ids = {
        lp.lesson_id for lp in user.lesson_progress.filter_by(status="completed").all()
    }
    weak_ids = {
        lp.lesson_id for lp in user.lesson_progress.all()
        if lp.status == "completed" and lp.best_score < 60
    }

    level_order = CEFR_LEVELS.index(user.current_level)
    candidate_modules = (
        Module.query.filter(Module.cefr_level.in_(CEFR_LEVELS[level_order:]))
        .order_by(Module.order)
        .all()
    )

    recommendations = []

    # Remedial lessons first
    if weak_ids:
        remedial = Lesson.query.filter(Lesson.id.in_(weak_ids)).limit(2).all()
        recommendations.extend(remedial)

    for module in candidate_modules:
        for lesson in module.lessons:
            if lesson.id in completed_ids or lesson in recommendations:
                continue
            recommendations.append(lesson)
            if len(recommendations) >= limit:
                return recommendations
    return recommendations


def maybe_advance_level(user):
    """After enough lessons in the current level are completed, bump the learner up."""
    from app.models import Module

    current_module_ids = [m.id for m in Module.query.filter_by(cefr_level=user.current_level).all()]
    if not current_module_ids:
        return False

    total_lessons = Lesson.query.filter(Lesson.module_id.in_(current_module_ids)).count()
    if total_lessons == 0:
        return False

    completed = (
        user.lesson_progress.join(Lesson)
        .filter(Lesson.module_id.in_(current_module_ids), LessonProgress.status == "completed")
        .count()
    )

    if completed / total_lessons >= 0.8:
        idx = CEFR_LEVELS.index(user.current_level)
        if idx < len(CEFR_LEVELS) - 1:
            user.current_level = CEFR_LEVELS[idx + 1]
            return True
    return False
