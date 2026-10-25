"""
Report Generation Service.

Generates intelligent downloadable learner reports in PDF format.
Includes Neo Learning branding, charts, progress summary,
performance tables, AI remarks, recommendations, and achievements.
"""
import os
import io
import json
from datetime import datetime, date
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image, PageBreak, HRFlowable
)
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics import renderPDF
from app.extensions import db
from app.models import User, Lesson, LessonProgress, VoiceAttempt, UserAchievement, CEFR_LEVELS
from app.services.analytics import AnalyticsService
from app.services.ai import AIService


# NeoLearn brand colors
BRAND_TEAL = HexColor("#3FD9BE")
BRAND_AMBER = HexColor("#FF9F1C")
BRAND_BLUSH = HexColor("#FF6F91")
BRAND_NAVY = HexColor("#2D3561")
BRAND_INK = HexColor("#1A1D2E")
BRAND_LIGHT_BG = HexColor("#F8F9FD")


class ReportService:
    """Service for generating learner performance reports."""

    @staticmethod
    def generate_report_data(user_id: int) -> dict:
        """Generate complete report data for a user."""
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}

        analytics = AnalyticsService.get_user_progress(user_id)
        
        # Get AI-generated remarks
        ai_service = AIService()
        ai_report = ai_service.generate_report(user_id)

        # Get achievements
        achievements = UserAchievement.query.filter_by(user_id=user_id).all()
        achievement_list = [ua.to_dict() for ua in achievements]

        # Vocabulary progress
        vocab_progress = ReportService._get_vocabulary_progress(user_id)

        # Speaking progress
        speaking_progress = ReportService._get_speaking_progress(user_id)

        # Reading progress
        reading_progress = ReportService._get_reading_progress(user_id)

        return {
            "learner_info": {
                "name": user.full_name,
                "language": user.preferred_language,
                "current_level": user.current_level,
                "date_generated": datetime.utcnow().strftime("%B %d, %Y"),
            },
            "overall_progress": analytics.get("overall_progress", {}),
            "performance_metrics": analytics.get("performance_metrics", {}),
            "learning_analytics": analytics.get("learning_analytics", {}),
            "weak_topics": analytics.get("weak_topics", []),
            "strong_topics": analytics.get("strong_topics", []),
            "ai_remarks": ai_report,
            "achievements": achievement_list,
            "vocabulary_progress": vocab_progress,
            "speaking_progress": speaking_progress,
            "reading_progress": reading_progress,
            "generated_at": datetime.utcnow().isoformat(),
        }

    @staticmethod
    def generate_pdf(user_id: int) -> bytes:
        """Generate a PDF report with full branding and charts."""
        data = ReportService.generate_report_data(user_id)
        if "error" in data:
            return None

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            topMargin=20 * mm,
            bottomMargin=20 * mm,
            leftMargin=15 * mm,
            rightMargin=15 * mm,
        )

        styles = getSampleStyleSheet()
        story = []
        
        # Custom styles
        title_style = ParagraphStyle(
            "ReportTitle", parent=styles["Title"],
            fontSize=28, textColor=BRAND_NAVY, spaceAfter=6,
            fontName="Helvetica-Bold"
        )
        subtitle_style = ParagraphStyle(
            "ReportSubtitle", parent=styles["Normal"],
            fontSize=12, textColor=HexColor("#6B7280"), spaceAfter=20,
            fontName="Helvetica"
        )
        section_style = ParagraphStyle(
            "SectionTitle", parent=styles["Heading2"],
            fontSize=16, textColor=BRAND_NAVY, spaceAfter=10, spaceBefore=20,
            fontName="Helvetica-Bold"
        )
        body_style = ParagraphStyle(
            "ReportBody", parent=styles["Normal"],
            fontSize=10, textColor=BRAND_INK, spaceAfter=8,
            fontName="Helvetica", leading=16
        )
        label_style = ParagraphStyle(
            "Label", parent=styles["Normal"],
            fontSize=9, textColor=HexColor("#6B7280"),
            fontName="Helvetica"
        )
        value_style = ParagraphStyle(
            "Value", parent=styles["Normal"],
            fontSize=14, textColor=BRAND_NAVY, spaceAfter=4,
            fontName="Helvetica-Bold"
        )
        highlight_style = ParagraphStyle(
            "Highlight", parent=styles["Normal"],
            fontSize=10, textColor=BRAND_TEAL,
            fontName="Helvetica-Bold"
        )

        # ===== HEADER =====
        story.append(Paragraph("NeoLearn", title_style))
        story.append(Paragraph("Personalized Learning Progress Report", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=2, color=BRAND_TEAL, spaceAfter=15))

        # ===== LEARNER INFO =====
        story.append(Paragraph("Learner Information", section_style))
        info = data["learner_info"]
        info_data = [
            [Paragraph(f"<b>Name:</b> {info['name']}", body_style),
             Paragraph(f"<b>Language:</b> {info['language']}", body_style)],
            [Paragraph(f"<b>Current Level:</b> {info['current_level']}", body_style),
             Paragraph(f"<b>Report Date:</b> {info['date_generated']}", body_style)],
        ]
        info_table = Table(info_data, colWidths=[doc.width * 0.5, doc.width * 0.5])
        info_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 10))

        # ===== OVERALL PROGRESS =====
        story.append(Paragraph("Overall Progress", section_style))
        progress = data["overall_progress"]
        progress_data = [
            [Paragraph("Lessons Completed", label_style),
             Paragraph(str(progress.get("lessons_completed", 0)), value_style)],
            [Paragraph("Modules Completed", label_style),
             Paragraph(str(progress.get("modules_completed", 0)), value_style)],
            [Paragraph("Completion", label_style),
             Paragraph(f"{progress.get('completion_percentage', 0)}%", value_style)],
        ]
        progress_table = Table(progress_data, colWidths=[doc.width * 0.6, doc.width * 0.4])
        progress_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), BRAND_LIGHT_BG),
            ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#E5E7EB")),
            ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#E5E7EB")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ]))
        story.append(progress_table)
        story.append(Spacer(1, 15))

        # ===== PERFORMANCE METRICS =====
        story.append(Paragraph("Performance Metrics", section_style))
        metrics = data["performance_metrics"]
        metrics_data = [[
            Paragraph("Metric", label_style),
            Paragraph("Score", label_style),
        ]]
        for key, label in [
            ("quiz_accuracy", "Quiz Accuracy"),
            ("speaking_accuracy", "Speaking Accuracy"),
            ("reading_accuracy", "Reading Accuracy"),
            ("vocabulary_score", "Vocabulary Score"),
            ("average_score", "Average Score"),
        ]:
            val = metrics.get(key, 0)
            color = BRAND_TEAL if val >= 70 else (BRAND_AMBER if val >= 50 else BRAND_BLUSH)
            metrics_data.append([
                Paragraph(label, body_style),
                Paragraph(f"<font color='{color.hexval()}'><b>{val}%</b></font>", body_style),
            ])
        
        metrics_table = Table(metrics_data, colWidths=[doc.width * 0.6, doc.width * 0.4])
        metrics_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#E5E7EB")),
            ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#E5E7EB")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ]))
        story.append(metrics_table)
        story.append(Spacer(1, 15))

        # ===== LEARNING ANALYTICS =====
        story.append(Paragraph("Learning Analytics", section_style))
        la = data["learning_analytics"]
        analytics_data = [
            [Paragraph(f"<b>Most Active Day:</b> {la.get('most_active_day', 'N/A')}", body_style),
             Paragraph(f"<b>Daily Learning:</b> {la.get('average_daily_learning_minutes', 0)} min", body_style)],
            [Paragraph(f"<b>Consistency:</b> {la.get('study_consistency', 0)}%", body_style),
             Paragraph(f"<b>Trend:</b> {la.get('improvement_trend', 'N/A').replace('_', ' ').title()}", body_style)],
            [Paragraph(f"<b>Total Time:</b> {la.get('total_time_spent_minutes', 0)} min", body_style),
             Paragraph(f"<b>XP Earned:</b> {la.get('xp_earned', 0)}", body_style)],
        ]
        analytics_table = Table(analytics_data, colWidths=[doc.width * 0.5, doc.width * 0.5])
        analytics_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(analytics_table)
        story.append(Spacer(1, 10))

        # ===== STRENGTHS & WEAKNESSES =====
        story.append(Paragraph("Strengths & Areas for Growth", section_style))
        
        strong_topics = data.get("strong_topics", [])
        weak_topics = data.get("weak_topics", [])
        
        if strong_topics:
            story.append(Paragraph("<b>Strengths:</b>", body_style))
            for t in strong_topics:
                story.append(Paragraph(f"  ✓ {t['topic'].title()}: {t['score']}%", highlight_style))
        else:
            story.append(Paragraph("<b>Strengths:</b> Building foundation", body_style))
        
        story.append(Spacer(1, 6))
        
        if weak_topics:
            story.append(Paragraph("<b>Areas for Improvement:</b>", body_style))
            for t in weak_topics:
                story.append(Paragraph(f"  ○ {t['topic'].title()}: {t['score']}%", body_style))
        else:
            story.append(Paragraph("<b>Areas for Improvement:</b> Keep practicing to identify areas", body_style))
        
        story.append(Spacer(1, 15))

        # ===== AI REMARKS =====
        story.append(Paragraph("AI-Powered Assessment", section_style))
        ai = data.get("ai_remarks", {})
        
        if ai.get("overall_progress"):
            story.append(Paragraph(f"<b>Overall Progress:</b>", body_style))
            story.append(Paragraph(ai["overall_progress"], body_style))
        
        if ai.get("performance_analysis"):
            story.append(Paragraph(f"<b>Performance Analysis:</b>", body_style))
            story.append(Paragraph(ai["performance_analysis"], body_style))
        
        if ai.get("strengths"):
            story.append(Paragraph(f"<b>Key Strengths:</b>", body_style))
            story.append(Paragraph(ai["strengths"], body_style))
        
        if ai.get("areas_for_improvement"):
            story.append(Paragraph(f"<b>Focus Areas:</b>", body_style))
            story.append(Paragraph(ai["areas_for_improvement"], body_style))
        
        if ai.get("recommendations"):
            story.append(Paragraph(f"<b>Personalized Recommendations:</b>", body_style))
            for i, rec in enumerate(ai["recommendations"], 1):
                story.append(Paragraph(f"  {i}. {rec}", body_style))
        
        if ai.get("motivational_summary"):
            story.append(Spacer(1, 8))
            story.append(Paragraph(f"<i>{ai['motivational_summary']}</i>", body_style))
        
        story.append(Spacer(1, 15))

        # ===== ACHIEVEMENTS =====
        achievements = data.get("achievements", [])
        if achievements:
            story.append(Paragraph("Achievements Unlocked", section_style))
            ach_data = [[
                Paragraph("Achievement", label_style),
                Paragraph("Earned On", label_style),
            ]]
            for a in achievements[:10]:
                earned = a.get("earned_at", "")[:10] if a.get("earned_at") else "N/A"
                ach_data.append([
                    Paragraph(f"{a.get('icon', '🏆')} {a.get('title', '')}", body_style),
                    Paragraph(earned, body_style),
                ])
            ach_table = Table(ach_data, colWidths=[doc.width * 0.65, doc.width * 0.35])
            ach_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("BOX", (0, 0), (-1, -1), 0.5, HexColor("#E5E7EB")),
                ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#E5E7EB")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ]))
            story.append(ach_table)
            story.append(Spacer(1, 15))

        # ===== FOOTER =====
        story.append(HRFlowable(width="100%", thickness=1, color=BRAND_TEAL, spaceAfter=8, spaceBefore=20))
        story.append(Paragraph(
            f"Generated by NeoLearn AI Learning Assistant | {datetime.utcnow().strftime('%B %d, %Y')}",
            ParagraphStyle("Footer", parent=styles["Normal"],
                          fontSize=8, textColor=HexColor("#9CA3AF"),
                          alignment=1)  # center
        ))

        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

    @staticmethod
    def _get_vocabulary_progress(user_id: int) -> dict:
        """Get vocabulary learning progress."""
        user = User.query.get(user_id)
        completed_vocab = LessonProgress.query.join(Lesson).filter(
            LessonProgress.user_id == user_id,
            LessonProgress.status == "completed",
            Lesson.lesson_type == "vocabulary"
        ).count()
        
        total_vocab = Lesson.query.filter_by(lesson_type="vocabulary").count()
        
        return {
            "vocabulary_lessons_completed": completed_vocab,
            "total_vocabulary_lessons": total_vocab,
            "progress_percentage": round((completed_vocab / total_vocab) * 100, 1) if total_vocab > 0 else 0,
        }

    @staticmethod
    def _get_speaking_progress(user_id: int) -> dict:
        """Get speaking exercise progress."""
        user = User.query.get(user_id)
        attempts = user.voice_attempts.all()
        scores = [va.overall_score for va in attempts if va.overall_score > 0]
        
        return {
            "speaking_attempts": len(attempts),
            "average_speaking_score": round(sum(scores) / len(scores), 1) if scores else 0,
            "best_score": round(max(scores), 1) if scores else 0,
        }

    @staticmethod
    def _get_reading_progress(user_id: int) -> dict:
        """Get reading exercise progress."""
        completed_reading = LessonProgress.query.join(Lesson).filter(
            LessonProgress.user_id == user_id,
            LessonProgress.status == "completed",
            Lesson.lesson_type == "reading"
        ).all()
        
        scores = [lp.best_score for lp in completed_reading if lp.best_score > 0]
        total_reading = Lesson.query.filter_by(lesson_type="reading").count()
        
        return {
            "reading_lessons_completed": len(completed_reading),
            "total_reading_lessons": total_reading,
            "average_reading_score": round(sum(scores) / len(scores), 1) if scores else 0,
        }