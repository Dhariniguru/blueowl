from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Achievement

bp = Blueprint("achievements", __name__, url_prefix="/api/achievements")


@bp.get("")
@jwt_required()
def list_achievements():
    user = User.query.get_or_404(int(get_jwt_identity()))
    earned = {ua.achievement_id: ua for ua in user.achievements}

    all_achievements = Achievement.query.all()
    result = []
    for a in all_achievements:
        ua = earned.get(a.id)
        result.append({
            **a.to_dict(),
            "earned": ua is not None,
            "earned_at": ua.earned_at.isoformat() if ua else None,
        })
    return jsonify(result)
