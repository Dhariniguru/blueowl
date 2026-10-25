import random
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, AssessmentQuestion, Assessment
from app.services.adaptive_engine import grade_assessment, score_to_level

bp = Blueprint("assessment", __name__, url_prefix="/api/assessment")


@bp.get("/start")
@jwt_required()
def start_assessment():
    """
    Returns a balanced initial-placement quiz: a spread of questions across
    skill types and difficulty bands, without revealing correct answers.
    """
    questions = []
    for skill in ["reading", "writing", "listening", "vocabulary"]:
        pool = AssessmentQuestion.query.filter_by(skill_type=skill).all()
        random.shuffle(pool)
        questions.extend(pool[:3])

    random.shuffle(questions)
    return jsonify([q.to_public_dict() for q in questions])


@bp.post("/submit")
@jwt_required()
def submit_assessment():
    """
    Body: { "assessment_type": "initial"|"periodic", "answers": [{"question_id": 1, "answer": "..."}] }
    """
    user = User.query.get_or_404(int(get_jwt_identity()))
    data = request.get_json() or {}
    answers = data.get("answers", [])
    if not answers:
        return jsonify({"error": "No answers submitted"}), 400

    question_ids = [a["question_id"] for a in answers]
    questions = {q.id: q for q in AssessmentQuestion.query.filter(AssessmentQuestion.id.in_(question_ids)).all()}

    graded_input = []
    for a in answers:
        q = questions.get(a["question_id"])
        if not q:
            continue
        graded_input.append({
            "question_id": q.id,
            "given_answer": a.get("answer", ""),
            "correct_answer": q.correct_answer,
            "difficulty": q.difficulty,
        })

    score_percent, avg_difficulty, responses_log = grade_assessment(graded_input)
    level_assigned = score_to_level(score_percent, avg_difficulty)

    assessment = Assessment(
        user_id=user.id,
        assessment_type=data.get("assessment_type", "initial"),
        score_percent=score_percent,
        level_assigned=level_assigned,
        responses=responses_log,
    )
    db.session.add(assessment)

    user.current_level = level_assigned
    if assessment.assessment_type == "initial":
        user.has_completed_onboarding = True

    db.session.commit()

    return jsonify({
        "score_percent": score_percent,
        "level_assigned": level_assigned,
        "assessment": assessment.to_dict(),
        "user": user.to_dict(),
    }), 201


@bp.get("/history")
@jwt_required()
def history():
    user = User.query.get_or_404(int(get_jwt_identity()))
    records = user.assessments.order_by(Assessment.taken_at.desc()).all()
    return jsonify([r.to_dict() for r in records])
