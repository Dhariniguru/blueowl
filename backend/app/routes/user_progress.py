"""
User Progress & Analytics API Routes.

GET /api/user/progress - Get comprehensive user progress
GET /api/user/analytics - Get analytics data
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.analytics import AnalyticsService

bp = Blueprint("user_progress", __name__, url_prefix="/api/user")


@bp.get("/progress")
@jwt_required()
def user_progress():
    """Get comprehensive user progress data."""
    user_id = int(get_jwt_identity())
    analytics = AnalyticsService.get_user_progress(user_id)
    
    if not analytics:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(analytics)


@bp.get("/analytics")
@jwt_required()
def user_analytics():
    """Get user analytics data for the dashboard."""
    user_id = int(get_jwt_identity())
    analytics = AnalyticsService.get_user_progress(user_id)
    
    if not analytics:
        return jsonify({"error": "User not found"}), 404
    
    # Format for frontend consumption
    return jsonify({
        "user": analytics.get("user", {}),
        "overall_progress": analytics.get("overall_progress", {}),
        "performance_metrics": analytics.get("performance_metrics", {}),
        "learning_analytics": analytics.get("learning_analytics", {}),
        "weak_topics": analytics.get("weak_topics", []),
        "strong_topics": analytics.get("strong_topics", []),
    })