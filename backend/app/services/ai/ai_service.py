"""
AI Learning Assistant Service.

Acts as a language tutor - explains concepts, provides hints,
generates examples, creates quizzes, and summarizes lessons.
Personalized responses based on learner context.
"""
import traceback
from datetime import datetime, timedelta
from app.extensions import db
from app.models import User, Lesson, LessonProgress, Vocabulary, VoiceAttempt, AIChatLog, CEFR_LEVELS
from app.services.ai.providers import get_provider, AIProvider


class AIService:
    """AI-powered learning assistant service."""

    # Number of conversation history messages to include in context.
    # We keep the last 14 messages (7 user/assistant pairs) so the AI
    # can remember the conversation within a lesson for follow-ups.
    HISTORY_LIMIT = 14

    def __init__(self, provider_name: str = "gemini"):
        self.provider: AIProvider = get_provider(provider_name)

    def chat(self, user_id: int, message: str, lesson_id: int = None) -> dict:
        """Process a learner's message and return AI response with context."""
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}

        # Build context for the AI
        context = self._build_context(user, lesson_id)
        
        # Build system prompt
        system_prompt = self._build_system_prompt(user, context, lesson_id)
        
        # Get conversation history (last N messages for context)
        # Keep the last ~14 messages so the assistant remembers prior
        # questions within the same lesson (conversation memory).
        history = AIChatLog.query.filter_by(
            user_id=user_id, lesson_id=lesson_id
        ).order_by(AIChatLog.created_at.desc()).limit(self.HISTORY_LIMIT).all()
        history = list(reversed(history))
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add history
        for h in history:
            messages.append({"role": h.role, "content": h.message})
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        # Get AI response
        try:
            response_text = self.provider.chat(messages, temperature=0.7, max_tokens=1000)
        except Exception as e:
            print("=" * 70)
            print(f"[AIService] ERROR calling provider chat:")
            traceback.print_exc()
            print("=" * 70)
            response_text = f"I apologize, but I encountered an error: {str(e)}. Please try again."

        # Log the interaction
        self._log_interaction(user_id, lesson_id, "user", message, context)
        self._log_interaction(user_id, lesson_id, "assistant", response_text, None)

        return {
            "response": response_text,
            "context": {
                "lesson_id": lesson_id,
                "provider": self.provider.get_provider_name(),
            }
        }

    def generate_report(self, user_id: int) -> dict:
        """Generate a personalized AI-powered learning report."""
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}

        analytics = self._get_analytics_context(user)
        
        prompt = f"""You are a supportive language learning tutor creating a personalized progress report.

LEARNER PROFILE:
- Name: {user.full_name}
- Current CEFR Level: {user.current_level}
- Preferred Language: {user.preferred_language}
- Total XP: {user.xp_points}
- Daily Streak: {user.streak_count} days

PERFORMANCE DATA:
- Lessons Completed: {analytics['lessons_completed']}
- Average Quiz Score: {analytics['avg_quiz']}%
- Speaking Accuracy: {analytics['avg_speaking']}%
- Reading Accuracy: {analytics['avg_reading']}%
- Vocabulary Score: {analytics['vocab_score']}%
- Improvement Trend: {analytics['trend']}
- Study Consistency: {analytics['consistency']}%

WEAK AREAS: {', '.join(analytics['weak_topics']) if analytics['weak_topics'] else 'None detected yet'}
STRONG AREAS: {', '.join(analytics['strong_topics']) if analytics['strong_topics'] else 'Building foundation'}

Generate a personalized report with these sections. Be encouraging and specific. Do NOT use templates:

1. OVERALL PROGRESS: 2-3 sentences about their journey
2. PERFORMANCE ANALYSIS: Specific feedback on their scores and what they mean
3. STRENGTHS: What they're doing well (specific, not generic)
4. AREAS FOR IMPROVEMENT: What needs work (specific, actionable)
5. PERSONALIZED RECOMMENDATIONS: 3-4 specific next steps
6. MOTIVATIONAL SUMMARY: 2-3 sentences of encouragement

Format the response as JSON with keys: overall_progress, performance_analysis, strengths, areas_for_improvement, recommendations (array), motivational_summary"""

        try:
            messages = [{"role": "user", "content": prompt}]
            response_text = self.provider.chat(messages, temperature=0.8, max_tokens=1500)
            
            # Try to parse as JSON
            import json
            try:
                # Find JSON in response
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                if start >= 0 and end > start:
                    json_str = response_text[start:end]
                    report_data = json.loads(json_str)
                else:
                    raise ValueError("No JSON found")
            except (json.JSONDecodeError, ValueError):
                # Fallback: structure the raw response
                report_data = {
                    "overall_progress": response_text[:300],
                    "performance_analysis": "Based on your learning data...",
                    "strengths": "Keep up the good work!",
                    "areas_for_improvement": "Focus on consistency.",
                    "recommendations": [
                        "Review weak vocabulary regularly",
                        "Practice speaking exercises daily",
                        "Complete one lesson per day"
                    ],
                    "motivational_summary": "You're making progress! Every lesson counts."
                }
        except Exception as e:
            print("=" * 70)
            print(f"[AIService] ERROR generating report:")
            traceback.print_exc()
            print("=" * 70)
            report_data = {
                "overall_progress": f"Analysis in progress. Your learning journey is unique!",
                "performance_analysis": "Data available for analysis.",
                "strengths": "Active learner",
                "areas_for_improvement": "Continue consistent practice",
                "recommendations": [
                    "Set a daily learning goal",
                    "Review previous lessons",
                    "Practice speaking aloud"
                ],
                "motivational_summary": "Every expert was once a beginner. Keep going!"
            }

        return report_data

    def _build_context(self, user: User, lesson_id: int = None) -> dict:
        """Build relevant context for the AI."""
        context = {
            "user_level": user.current_level,
            "xp": user.xp_points,
            "streak": user.streak_count,
        }
        
        # Completed lessons count
        completed = user.lesson_progress.filter_by(status="completed").count()
        context["completed_lessons"] = completed
        
        # Recent mistakes from voice attempts
        recent_voice = user.voice_attempts.order_by(
            VoiceAttempt.created_at.desc()
        ).limit(5).all()
        
        weak_words = []
        for va in recent_voice:
            if va.missing_words:
                weak_words.extend(va.missing_words)
        context["weak_vocabulary"] = list(set(weak_words))[:10]
        
        # Current lesson context
        if lesson_id:
            lesson = Lesson.query.get(lesson_id)
            if lesson:
                context["current_lesson"] = {
                    "title": lesson.title,
                    "type": lesson.lesson_type,
                    "difficulty": lesson.difficulty,
                }
                # Vocabulary for this lesson
                vocab = Vocabulary.query.filter_by(lesson_id=lesson_id).all()
                if vocab:
                    context["lesson_vocabulary"] = [
                        {"word": v.word, "meaning": v.meaning} for v in vocab[:10]
                    ]
        
        return context

    def _build_system_prompt(self, user: User, context: dict, lesson_id: int = None) -> str:
        """Build the system prompt for the AI tutor."""
        prompt = f"""You are Neo, a friendly, encouraging AI language tutor for the NeoLearn platform. Your goal is to help learners improve their language skills through interactive, personalised guidance.

LEARNER PROFILE:
- Name: {user.full_name}
- Level: {user.current_level} (CEFR scale: A1=Beginner to C2=Mastery)
- XP: {user.xp_points} points
- Streak: {user.streak_count} days
- Completed Lessons: {context.get('completed_lessons', 0)}

TUTORING STYLE:
1. FRIENDLY & ENCOURAGING: Always be warm, positive, and supportive. Celebrate small wins.
2. INTERACTIVE: Ask follow-up questions to keep the learner engaged and thinking.
3. AGE-APPROPRIATE: Use language and examples suitable for a young learner (ages 8-15).
4. NEVER GIVE DIRECT QUIZ ANSWERS: When the learner asks about a quiz or assessment question, DO NOT reveal the answer. Instead, give hints, explain the concept, and guide them to discover the answer themselves.
5. EXPLAIN VOCABULARY: For each new word, give a simple definition, 1-2 example sentences, and ask the learner to try using it.
6. EXPLAIN GRAMMAR SIMPLY: Break grammar rules into small, clear steps with 2-3 relatable examples.
7. ADAPT TO CEFR LEVEL: 
   - A1: Very simple words, short sentences, basic vocabulary
   - A2: Simple sentences, common phrases
   - B1: More complex sentences, some idioms
   - B2: Near-native, complex discussions
   - C1/C2: Advanced, nuanced language
8. CONCISE RESPONSES: Keep responses short - 2-4 paragraphs max. Avoid long, rambling answers.
9. PRONUNCIATION TIPS: When teaching new words, give a simple pronunciation tip (e.g., "it sounds like...") using the learner's native language reference when known.
10. NEVER HALLUCINATE: Only reference lesson content that was actually provided in the context below. If the learner asks about content not in this lesson, say "That's beyond this lesson - let me help you with what we're learning now!" and redirect.

MARKDOWN FORMATTING REQUIREMENTS - ALWAYS follow these:
- Use **bold** for key terms and vocabulary words
- Use *italics* for emphasis on important concepts
- Use bullet points (- ) for lists of tips or steps
- Use numbered lists (1. 2. 3.) for step-by-step explanations
- Use ## for section headings when breaking down a topic
- Use `code` style for individual vocabulary words or phrases
- Use ```code blocks``` for example sentences, dialogues, or grammar patterns
- Use tables when comparing things (like two words, or verb tenses)
- Use > blockquotes for example sentences or quotes
- Keep paragraphs short and readable
- Never use raw ** characters without turning them into proper Markdown formatting
- Never use plain text where Markdown would be clearer and more engaging

CURRENT LESSON CONTEXT:
- If the learner asks about anything in this lesson, reference the lesson title, vocabulary, and concepts below.
- If the learner asks about something NOT in this lesson, gently guide them back to the current lesson topic."""

        if context.get("weak_vocabulary"):
            weak = ", ".join(context["weak_vocabulary"][:5])
            prompt += f"\n\nWORDS TO PRACTICE: The learner struggles with: {weak}. Help them practice these with examples and encouragement."

        if context.get("current_lesson"):
            lesson = context["current_lesson"]
            prompt += f"\n\nCURRENT LESSON: '{lesson['title']}' ({lesson['type']}, difficulty {lesson['difficulty']}/5)"
            if context.get("lesson_vocabulary"):
                vocab_list = ", ".join([f"{v['word']} ({v['meaning']})" for v in context["lesson_vocabulary"]])
                prompt += f"\nLESSON VOCABULARY: {vocab_list}"

        return prompt

    def _get_analytics_context(self, user: User) -> dict:
        """Get analytics data for report generation."""
        from app.services.analytics import AnalyticsService
        analytics = AnalyticsService.get_user_progress(user.id)
        
        completed = user.lesson_progress.filter_by(status="completed").all()
        
        return {
            "lessons_completed": len(completed),
            "avg_quiz": analytics.get("performance_metrics", {}).get("quiz_accuracy", 0),
            "avg_speaking": analytics.get("performance_metrics", {}).get("speaking_accuracy", 0),
            "avg_reading": analytics.get("performance_metrics", {}).get("reading_accuracy", 0),
            "vocab_score": analytics.get("performance_metrics", {}).get("vocabulary_score", 0),
            "trend": analytics.get("learning_analytics", {}).get("improvement_trend", "not_enough_data"),
            "consistency": analytics.get("learning_analytics", {}).get("study_consistency", 0),
            "weak_topics": [t["topic"] for t in analytics.get("weak_topics", [])],
            "strong_topics": [t["topic"] for t in analytics.get("strong_topics", [])],
        }

    def _log_interaction(self, user_id: int, lesson_id: int, role: str, message: str, context: dict = None):
        """Log an AI chat interaction."""
        log = AIChatLog(
            user_id=user_id,
            lesson_id=lesson_id,
            role=role,
            message=message,
            context_snapshot=context,
        )
        db.session.add(log)
        db.session.commit()