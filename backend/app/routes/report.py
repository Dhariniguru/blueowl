"""
Report Generation API Routes.

GET /api/user/report - Get report data
POST /api/user/report/generate - Generate a new report
GET /api/user/report/download - Download PDF report
"""
import io
from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.report import ReportService

bp = Blueprint("report", __name__, url_prefix="/api/user")


@bp.get("/report")
@jwt_required()
def get_report():
    """Get report data for the current user."""
    user_id = int(get_jwt_identity())
    report_data = ReportService.generate_report_data(user_id)
    
    if "error" in report_data:
        return jsonify(report_data), 404
    
    return jsonify(report_data)


@bp.post("/report/generate")
@jwt_required()
def generate_report():
    """Generate a new report (forces AI re-generation)."""
    user_id = int(get_jwt_identity())
    report_data = ReportService.generate_report_data(user_id)
    
    if "error" in report_data:
        return jsonify(report_data), 404
    
    return jsonify({
        "message": "Report generated successfully",
        "report": report_data,
    })


@bp.get("/report/download")
@jwt_required()
def download_report():
    """Download the report as a PDF."""
    user_id = int(get_jwt_identity())
    pdf_bytes = ReportService.generate_pdf(user_id)
    
    if pdf_bytes is None:
        return jsonify({"error": "Could not generate PDF"}), 500
    
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"neolearn_report_{user_id}.pdf",
    )