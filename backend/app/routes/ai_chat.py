"""
AI Learning Assistant API Routes.

POST /api/ai/chat - Chat with the AI tutor
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.ai import AIService

bp = Blueprint("ai", __name__, url_prefix="/api/ai")


@bp.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    """Chat with the AI learning assistant."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    message = data.get("message", "").strip()
    lesson_id = data.get("lesson_id")
    
    if not message:
        return jsonify({"error": "Message is required"}), 400
    
    ai_service = AIService()
    result = ai_service.chat(user_id, message, lesson_id)
    
    if "error" in result:
        return jsonify(result), 404
    
    return jsonify(result)