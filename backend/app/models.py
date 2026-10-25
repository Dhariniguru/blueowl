from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(60), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    preferred_language = db.Column(db.String(40), default="English")
    current_level = db.Column(db.String(2), default="A1")  # CEFR level
    xp_points = db.Column(db.Integer, default=0)
    streak_count = db.Column(db.Integer, default=0)
    last_active_date = db.Column(db.Date, default=date.today)
    has_completed_onboarding = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    lesson_progress = db.relationship("LessonProgress", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    assessments = db.relationship("Assessment", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    voice_attempts = db.relationship("VoiceAttempt", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    achievements = db.relationship("UserAchievement", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    ai_chat_logs = db.relationship("AIChatLog", backref="user", lazy="dynamic", cascade="all, delete-orphan")

    # Pronunciation specific relationships
    pronunciation_module_progress = db.relationship("PronunciationModuleProgress", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    pronunciation_lesson_progress = db.relationship("PronunciationLessonProgress", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    pronunciation_exercise_attempts = db.relationship("PronunciationExerciseAttempt", backref="user", lazy="dynamic", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def touch_streak(self):
        """Call once per day the user is active; bumps or resets streak."""
        today = date.today()
        if self.last_active_date == today:
            return
        if self.last_active_date and (today - self.last_active_date).days == 1:
            self.streak_count += 1
        else:
            self.streak_count = 1
        self.last_active_date = today

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "username": self.username,
            "email": self.email,
            "preferred_language": self.preferred_language,
            "current_level": self.current_level,
            "xp_points": self.xp_points,
            "streak_count": self.streak_count,
            "has_completed_onboarding": self.has_completed_onboarding,
        }


class Module(db.Model):
    """A 'floor' in the learning path — one CEFR level's worth of lessons."""
    __tablename__ = "modules"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    cefr_level = db.Column(db.String(2), nullable=False)
    language = db.Column(db.String(40), default="English")
    order = db.Column(db.Integer, nullable=False)
    theme = db.Column(db.String(40), default="spring")  # cosmetic, matches biome art

    lessons = db.relationship("Lesson", backref="module", lazy="dynamic", cascade="all, delete-orphan",
                               order_by="Lesson.order")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "cefr_level": self.cefr_level,
            "language": self.language,
            "order": self.order,
            "theme": self.theme,
        }


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey("modules.id"), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    lesson_type = db.Column(db.String(20), nullable=False)  # reading|writing|listening|speaking|vocabulary
    difficulty = db.Column(db.Integer, default=1)  # 1-5
    order = db.Column(db.Integer, nullable=False)
    xp_reward = db.Column(db.Integer, default=10)

    # Flexible content payload — shape depends on lesson_type. See seed.py for examples.
    content = db.Column(db.JSON, nullable=False)

    # New structured fields
    introduction = db.Column(db.Text, default="")
    learning_objective = db.Column(db.String(500), default="")
    estimated_minutes = db.Column(db.Integer, default=10)

    progress_entries = db.relationship("LessonProgress", backref="lesson", lazy="dynamic",
                                        cascade="all, delete-orphan")
    vocabulary = db.relationship("Vocabulary", backref="lesson", lazy="dynamic", cascade="all, delete-orphan")
    images = db.relationship("LessonImage", backref="lesson", lazy="dynamic", cascade="all, delete-orphan")
    questions = db.relationship("Question", backref="lesson", lazy="dynamic", cascade="all, delete-orphan")
    learning_tips = db.relationship("LearningTip", backref="lesson", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self, include_content=True):
        data = {
            "id": self.id,
            "module_id": self.module_id,
            "title": self.title,
            "lesson_type": self.lesson_type,
            "difficulty": self.difficulty,
            "order": self.order,
            "xp_reward": self.xp_reward,
            "introduction": self.introduction,
            "learning_objective": self.learning_objective,
            "estimated_minutes": self.estimated_minutes,
        }
        if include_content:
            data["content"] = self.content
        return data


class Vocabulary(db.Model):
    """Vocabulary words for each lesson."""
    __tablename__ = "vocabulary"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)
    word = db.Column(db.String(100), nullable=False)
    meaning = db.Column(db.Text, nullable=False)
    example_sentence = db.Column(db.Text, default="")
    pronunciation_text = db.Column(db.String(200), default="")
    part_of_speech = db.Column(db.String(30), default="")
    audio_url = db.Column(db.String(500), default="")

    def to_dict(self):
        return {
            "id": self.id,
            "word": self.word,
            "meaning": self.meaning,
            "example_sentence": self.example_sentence,
            "pronunciation_text": self.pronunciation_text,
            "part_of_speech": self.part_of_speech,
            "audio_url": self.audio_url,
        }


class LessonImage(db.Model):
    """Educational images for lessons."""
    __tablename__ = "lesson_images"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(300), default="")
    caption = db.Column(db.String(300), default="")
    image_type = db.Column(db.String(30), default="illustration")  # illustration|object|animal|food|place|body_part|number|color|shape|action
    order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "alt_text": self.alt_text,
            "caption": self.caption,
            "image_type": self.image_type,
            "order": self.order,
        }


class Question(db.Model):
    """Practice questions for lessons."""
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)
    question_type = db.Column(db.String(30), nullable=False)  # multiple_choice|image_recognition|fill_blank|word_matching|sentence_formation|vocabulary_recall|meaning_identification
    question_text = db.Column(db.Text, nullable=False)
    correct_answer = db.Column(db.String(500), nullable=False)
    image_url = db.Column(db.String(500), default="")
    difficulty = db.Column(db.Integer, default=1)
    explanation = db.Column(db.Text, default="")
    xp_reward = db.Column(db.Integer, default=10)
    order = db.Column(db.Integer, default=0)

    options = db.relationship("QuestionOption", backref="question", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self, include_answer=False):
        data = {
            "id": self.id,
            "question_type": self.question_type,
            "question_text": self.question_text,
            "image_url": self.image_url,
            "difficulty": self.difficulty,
            "explanation": self.explanation,
            "xp_reward": self.xp_reward,
            "order": self.order,
            "options": [o.to_dict() for o in self.options.all()],
        }
        if include_answer:
            data["correct_answer"] = self.correct_answer
        return data


class QuestionOption(db.Model):
    """Options for multiple choice questions."""
    __tablename__ = "question_options"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    option_text = db.Column(db.String(500), nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "option_text": self.option_text,
            "order": self.order,
        }


class LearningTip(db.Model):
    """Learning tips for lessons."""
    __tablename__ = "learning_tips"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)
    tip_text = db.Column(db.Text, nullable=False)
    tip_type = db.Column(db.String(30), default="general")  # general|grammar|pronunciation|vocabulary|culture
    order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "tip_text": self.tip_text,
            "tip_type": self.tip_type,
            "order": self.order,
        }


class LessonProgress(db.Model):
    __tablename__ = "lesson_progress"
    __table_args__ = (db.UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)

    status = db.Column(db.String(20), default="not_started")  # not_started|in_progress|completed
    best_score = db.Column(db.Float, default=0)
    attempts = db.Column(db.Integer, default=0)
    completed_at = db.Column(db.DateTime, nullable=True)
    time_spent_seconds = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "lesson_id": self.lesson_id,
            "status": self.status,
            "best_score": self.best_score,
            "attempts": self.attempts,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "time_spent_seconds": self.time_spent_seconds,
        }


class AssessmentQuestion(db.Model):
    __tablename__ = "assessment_questions"

    id = db.Column(db.Integer, primary_key=True)
    skill_type = db.Column(db.String(20), nullable=False)  # reading|writing|listening|vocabulary
    difficulty = db.Column(db.Integer, default=1)  # roughly maps to CEFR level (1=A1 .. 6=C2)
    question_text = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=True)  # list of strings for MCQ, null for free text
    correct_answer = db.Column(db.String(255), nullable=False)

    def to_public_dict(self):
        """Never leak the correct answer to the client before grading."""
        return {
            "id": self.id,
            "skill_type": self.skill_type,
            "difficulty": self.difficulty,
            "question_text": self.question_text,
            "options": self.options,
        }


class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    assessment_type = db.Column(db.String(20), default="initial")  # initial|periodic
    score_percent = db.Column(db.Float, nullable=False)
    level_assigned = db.Column(db.String(2), nullable=False)
    responses = db.Column(db.JSON)  # [{question_id, given_answer, correct}]
    taken_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "assessment_type": self.assessment_type,
            "score_percent": self.score_percent,
            "level_assigned": self.level_assigned,
            "taken_at": self.taken_at.isoformat(),
        }


class VoiceAttempt(db.Model):
    __tablename__ = "voice_attempts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=True)

    # Exercise metadata
    exercise_type = db.Column(db.String(20), default="repeat")  # repeat|read_aloud|conversation
    provider = db.Column(db.String(40), default="web_speech_api")

    # Text fields
    target_text = db.Column(db.Text, nullable=False)
    transcript = db.Column(db.Text, nullable=False)

    # Scoring (all stored for historical analysis)
    accuracy_percent = db.Column(db.Float, default=0.0)
    word_match_percent = db.Column(db.Float, default=0.0)
    sentence_similarity = db.Column(db.Float, default=0.0)
    overall_score = db.Column(db.Float, default=0.0)

    # Word-level details
    missing_words = db.Column(db.JSON)  # list of expected words not found
    extra_words = db.Column(db.JSON)  # list of unexpected words spoken
    word_feedback = db.Column(db.JSON)  # per-word correct/incorrect flags (deprecated, kept for compat)

    # Feedback and timing
    feedback = db.Column(db.Text, default="")
    duration_seconds = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "lesson_id": self.lesson_id,
            "exercise_type": self.exercise_type,
            "provider": self.provider,
            "target_text": self.target_text,
            "transcript": self.transcript,
            "accuracy_percent": self.accuracy_percent,
            "word_match_percent": self.word_match_percent,
            "sentence_similarity": self.sentence_similarity,
            "overall_score": self.overall_score,
            "missing_words": self.missing_words or [],
            "extra_words": self.extra_words or [],
            "word_feedback": self.word_feedback or [],
            "feedback": self.feedback,
            "duration_seconds": self.duration_seconds,
            "created_at": self.created_at.isoformat(),
        }


class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(60), unique=True, nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255))
    icon = db.Column(db.String(10), default="🏆")
    criteria_type = db.Column(db.String(30), nullable=False)  # streak|xp|lessons_completed|level
    criteria_value = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "title": self.title,
            "description": self.description,
            "icon": self.icon,
        }


class UserAchievement(db.Model):
    __tablename__ = "user_achievements"
    __table_args__ = (db.UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey("achievements.id"), nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    achievement = db.relationship("Achievement")

    def to_dict(self):
        return {**self.achievement.to_dict(), "earned_at": self.earned_at.isoformat()}


class AIChatLog(db.Model):
    """Log of AI chat interactions for context."""
    __tablename__ = "ai_chat_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=True)
    role = db.Column(db.String(20), nullable=False)  # user|assistant
    message = db.Column(db.Text, nullable=False)
    context_snapshot = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─────────────────────────────────────────────────────────────────
# NEW PRONUNCIATION LEARNING SYSTEM MODELS
# ─────────────────────────────────────────────────────────────────

class PronunciationModule(db.Model):
    """Top-level pronunciation learning module (e.g., 'Alphabet Sounds', 'Basic Words')."""
    __tablename__ = "pronunciation_modules"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    difficulty = db.Column(db.Integer, default=1)  # 1-5
    order = db.Column(db.Integer, nullable=False)
    xp_reward = db.Column(db.Integer, default=50)
    icon = db.Column(db.String(50), default="🎤")
    color = db.Column(db.String(20), default="#14B8A6")
    is_unlocked = db.Column(db.Boolean, default=True)

    lessons = db.relationship("PronunciationLessonNew", backref="pronunciation_module", lazy="dynamic",
                               cascade="all, delete-orphan", order_by="PronunciationLessonNew.order")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "difficulty": self.difficulty,
            "order": self.order,
            "xp_reward": self.xp_reward,
            "icon": self.icon,
            "color": self.color,
            "is_unlocked": self.is_unlocked,
            "lesson_count": self.lessons.count(),
        }


class PronunciationLessonNew(db.Model):
    """A lesson within a pronunciation module containing multiple exercises."""
    __tablename__ = "pronunciation_lessons_new"

    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey("pronunciation_modules.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    difficulty = db.Column(db.Integer, default=1)
    order = db.Column(db.Integer, nullable=False)
    xp_reward = db.Column(db.Integer, default=10)
    estimated_minutes = db.Column(db.Integer, default=5)
    is_unlocked = db.Column(db.Boolean, default=True)

    exercises = db.relationship("PronunciationExercise", backref="pronunciation_lesson", lazy="dynamic",
                                 cascade="all, delete-orphan", order_by="PronunciationExercise.order")

    def to_dict(self):
        return {
            "id": self.id,
            "module_id": self.module_id,
            "title": self.title,
            "description": self.description,
            "difficulty": self.difficulty,
            "order": self.order,
            "xp_reward": self.xp_reward,
            "estimated_minutes": self.estimated_minutes,
            "is_unlocked": self.is_unlocked,
            "exercise_count": self.exercises.count(),
        }


class PronunciationExercise(db.Model):
    """Individual pronunciation exercise within a lesson."""
    __tablename__ = "pronunciation_exercises"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("pronunciation_lessons_new.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    difficulty = db.Column(db.Integer, default=1)
    order = db.Column(db.Integer, nullable=False)
    xp_reward = db.Column(db.Integer, default=5)

    # Exercise content
    expected_text = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), default="")
    image_alt = db.Column(db.String(300), default="")
    audio_url = db.Column(db.String(500), default="")

    # Difficulty hints
    slow_audio_url = db.Column(db.String(500), default="")
    phonetic_text = db.Column(db.String(300), default="")

    # Metadata
    exercise_type = db.Column(db.String(30), default="word")  # word|phrase|sentence|conversation
    category = db.Column(db.String(50), default="")  # alphabet|numbers|colors|animals|food|objects|greetings|etc

    def to_dict(self):
        return {
            "id": self.id,
            "lesson_id": self.lesson_id,
            "title": self.title,
            "description": self.description,
            "difficulty": self.difficulty,
            "order": self.order,
            "xp_reward": self.xp_reward,
            "expected_text": self.expected_text,
            "image_url": self.image_url,
            "image_alt": self.image_alt,
            "audio_url": self.audio_url,
            "slow_audio_url": self.slow_audio_url,
            "phonetic_text": self.phonetic_text,
            "exercise_type": self.exercise_type,
            "category": self.category,
        }


class PronunciationExerciseAttempt(db.Model):
    """Record of a user's pronunciation attempt on a specific exercise."""
    __tablename__ = "pronunciation_exercise_attempts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey("pronunciation_exercises.id"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("pronunciation_lessons_new.id"), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey("pronunciation_modules.id"), nullable=False)

    # Speech recognition data
    transcript = db.Column(db.Text, nullable=False)
    confidence_score = db.Column(db.Float, default=0.0)

    # Scoring
    accuracy_percent = db.Column(db.Float, default=0.0)
    word_match_percent = db.Column(db.Float, default=0.0)
    overall_score = db.Column(db.Float, default=0.0)
    words_correct = db.Column(db.Integer, default=0)
    words_total = db.Column(db.Integer, default=0)

    # Word-level details
    missing_words = db.Column(db.JSON, default=list)
    extra_words = db.Column(db.JSON, default=list)
    mispronounced_words = db.Column(db.JSON, default=list)

    # Feedback
    feedback = db.Column(db.Text, default="")
    suggestions = db.Column(db.JSON, default=list)
    grade = db.Column(db.String(20), default="")  # excellent|very_good|good|needs_improvement|try_again

    # Timing
    duration_seconds = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    exercise = db.relationship("PronunciationExercise")
    lesson = db.relationship("PronunciationLessonNew")
    pronunciation_module = db.relationship("PronunciationModule")

    def to_dict(self):
        return {
            "id": self.id,
            "exercise_id": self.exercise_id,
            "lesson_id": self.lesson_id,
            "module_id": self.module_id,
            "transcript": self.transcript,
            "confidence_score": self.confidence_score,
            "accuracy_percent": self.accuracy_percent,
            "word_match_percent": self.word_match_percent,
            "overall_score": self.overall_score,
            "words_correct": self.words_correct,
            "words_total": self.words_total,
            "missing_words": self.missing_words or [],
            "extra_words": self.extra_words or [],
            "mispronounced_words": self.mispronounced_words or [],
            "feedback": self.feedback,
            "suggestions": self.suggestions or [],
            "grade": self.grade,
            "duration_seconds": self.duration_seconds,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class PronunciationLessonProgress(db.Model):
    """Track user progress within a pronunciation lesson."""
    __tablename__ = "pronunciation_lesson_progress"
    __table_args__ = (db.UniqueConstraint("user_id", "lesson_id", name="uq_user_pronunciation_lesson"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("pronunciation_lessons_new.id"), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey("pronunciation_modules.id"), nullable=False)

    status = db.Column(db.String(20), default="not_started")  # not_started|in_progress|completed
    current_exercise_order = db.Column(db.Integer, default=1)
    exercises_completed = db.Column(db.Integer, default=0)
    exercises_total = db.Column(db.Integer, default=0)

    # Scores
    best_score = db.Column(db.Float, default=0.0)
    average_score = db.Column(db.Float, default=0.0)
    total_attempts = db.Column(db.Integer, default=0)

    # XP
    xp_earned = db.Column(db.Integer, default=0)

    # Timing
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    last_attempt_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "lesson_id": self.lesson_id,
            "module_id": self.module_id,
            "status": self.status,
            "current_exercise_order": self.current_exercise_order,
            "exercises_completed": self.exercises_completed,
            "exercises_total": self.exercises_total,
            "best_score": self.best_score,
            "average_score": self.average_score,
            "total_attempts": self.total_attempts,
            "xp_earned": self.xp_earned,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "last_attempt_at": self.last_attempt_at.isoformat() if self.last_attempt_at else None,
        }


class PronunciationModuleProgress(db.Model):
    """Track user progress within a pronunciation module."""
    __tablename__ = "pronunciation_module_progress"
    __table_args__ = (db.UniqueConstraint("user_id", "module_id", name="uq_user_pronunciation_module"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey("pronunciation_modules.id"), nullable=False)

    status = db.Column(db.String(20), default="not_started")  # not_started|in_progress|completed
    current_lesson_order = db.Column(db.Integer, default=1)
    lessons_completed = db.Column(db.Integer, default=0)
    lessons_total = db.Column(db.Integer, default=0)

    # Scores
    best_score = db.Column(db.Float, default=0.0)
    average_score = db.Column(db.Float, default=0.0)
    total_attempts = db.Column(db.Integer, default=0)

    # XP
    xp_earned = db.Column(db.Integer, default=0)

    # Timing
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    last_attempt_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "module_id": self.module_id,
            "status": self.status,
            "current_lesson_order": self.current_lesson_order,
            "lessons_completed": self.lessons_completed,
            "lessons_total": self.lessons_total,
            "best_score": self.best_score,
            "average_score": self.average_score,
            "total_attempts": self.total_attempts,
            "xp_earned": self.xp_earned,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "last_attempt_at": self.last_attempt_at.isoformat() if self.last_attempt_at else None,
        }


class PronunciationLessonLegacy(db.Model):
    """Pronunciation practice lessons (legacy - kept for compatibility)."""
    __tablename__ = "pronunciation_lessons_legacy"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # alphabet|common_words|greetings|sentences|difficult_pairs
    target_text = db.Column(db.String(500), nullable=False)
    explanation = db.Column(db.Text, default="")
    difficulty = db.Column(db.Integer, default=1)  # 1-5
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "target_text": self.target_text,
            "explanation": self.explanation,
            "difficulty": self.difficulty,
            "order": self.order,
        }


class PronunciationAttemptLegacy(db.Model):
    """Record of a user's pronunciation attempt (legacy - kept for compatibility)."""
    __tablename__ = "pronunciation_attempts_legacy"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("pronunciation_lessons_legacy.id"), nullable=False)
    transcript = db.Column(db.Text, nullable=False)
    accuracy_percent = db.Column(db.Float, default=0.0)
    word_match_percent = db.Column(db.Float, default=0.0)
    overall_score = db.Column(db.Float, default=0.0)
    missing_words = db.Column(db.JSON, default=list)
    extra_words = db.Column(db.JSON, default=list)
    feedback = db.Column(db.Text, default="")
    confidence_score = db.Column(db.Float, default=0.0)
    duration_seconds = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("pronunciation_attempts_legacy", lazy="dynamic"))

    def to_dict(self):
        return {
            "id": self.id,
            "lesson_id": self.lesson_id,
            "transcript": self.transcript,
            "accuracy_percent": self.accuracy_percent,
            "word_match_percent": self.word_match_percent,
            "overall_score": self.overall_score,
            "missing_words": self.missing_words or [],
            "extra_words": self.extra_words or [],
            "feedback": self.feedback,
            "confidence_score": self.confidence_score,
            "duration_seconds": self.duration_seconds,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }