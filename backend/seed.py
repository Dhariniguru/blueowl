"""
Run once after the database is created:
    python seed.py
Safe to re-run — it clears and re-inserts content tables (never touches users).
"""
from app import create_app
from app.extensions import db
from app.models import (
    Module,
    Lesson,
    AssessmentQuestion,
    Achievement,
    PronunciationModule,
)

app = create_app()

MODULES = [
    {"title": "First Steps", "cefr_level": "A1", "order": 1, "theme": "spring",
     "description": "Greetings, everyday objects, and simple sentences."},
    {"title": "Everyday Life", "cefr_level": "A2", "order": 2, "theme": "summer",
     "description": "Talking about routines, family, and shopping."},
    {"title": "Real Conversations", "cefr_level": "B1", "order": 3, "theme": "autumn",
     "description": "Opinions, past experiences, and short stories."},
    {"title": "Confident Communicator", "cefr_level": "B2", "order": 4, "theme": "winter",
     "description": "Debate, workplace English, and nuanced writing."},
]

LESSONS_BY_MODULE_ORDER = {
    1: [
        {
            "title": "Meet & Greet", "lesson_type": "reading", "difficulty": 1, "order": 1, "xp_reward": 10,
            "content": {
                "passage": "Hi! My name is Meera. I am from Chennai. I am a student. Nice to meet you!",
                "questions": [
                    {"q": "What is the speaker's name?", "options": ["Meera", "Priya", "Anjali", "Divya"], "answer": "Meera"},
                    {"q": "Where is she from?", "options": ["Delhi", "Chennai", "Mumbai", "Pune"], "answer": "Chennai"},
                ],
            },
        },
        {
            "title": "Everyday Objects", "lesson_type": "vocabulary", "difficulty": 1, "order": 2, "xp_reward": 10,
            "content": {
                "words": [
                    {"word": "book", "meaning": "something you read", "example": "I am reading a book."},
                    {"word": "chair", "meaning": "something you sit on", "example": "Please sit on the chair."},
                    {"word": "water", "meaning": "a drink, H2O", "example": "I drink water every day."},
                ],
                "quiz": [{"q": "Which word means 'something you sit on'?", "options": ["book", "chair", "water"], "answer": "chair"}],
            },
        },
        {
            "title": "Write About Yourself", "lesson_type": "writing", "difficulty": 1, "order": 3, "xp_reward": 15,
            "content": {
                "prompt": "Write 2-3 sentences introducing yourself: your name, where you're from, and one thing you like.",
                "min_words": 10,
                "keywords_hint": ["my name is", "i am from", "i like"],
            },
        },
        {
            "title": "Listen: A New Friend", "lesson_type": "listening", "difficulty": 1, "order": 4, "xp_reward": 15,
            "content": {
                "audio_text": "Hello! My name is Arjun. I like cricket and music. What is your name?",
                "questions": [
                    {"q": "What does Arjun like?", "options": ["Cricket and music", "Dance and art", "Reading"], "answer": "Cricket and music"},
                ],
            },
        },
        {
            "title": "Say Hello", "lesson_type": "speaking", "difficulty": 1, "order": 5, "xp_reward": 15,
            "content": {
                "target_sentences": [
                    "Hello, my name is Meera.",
                    "Nice to meet you.",
                    "I am from Chennai.",
                ],
            },
        },
    ],
    2: [
        {
            "title": "My Daily Routine", "lesson_type": "reading", "difficulty": 2, "order": 1, "xp_reward": 15,
            "content": {
                "passage": "Every morning I wake up at six o'clock. I brush my teeth and eat breakfast. Then I go to work by bus.",
                "questions": [
                    {"q": "What time does the speaker wake up?", "options": ["Six o'clock", "Seven o'clock", "Eight o'clock"], "answer": "Six o'clock"},
                    {"q": "How does the speaker go to work?", "options": ["By car", "By bus", "By bike"], "answer": "By bus"},
                ],
            },
        },
        {
            "title": "At the Market", "lesson_type": "vocabulary", "difficulty": 2, "order": 2, "xp_reward": 15,
            "content": {
                "words": [
                    {"word": "vegetable", "meaning": "a plant food like carrot or onion", "example": "I bought fresh vegetables."},
                    {"word": "price", "meaning": "how much something costs", "example": "What is the price of this?"},
                ],
                "quiz": [{"q": "Which word means 'how much something costs'?", "options": ["vegetable", "price"], "answer": "price"}],
            },
        },
        {
            "title": "Describe Your Family", "lesson_type": "writing", "difficulty": 2, "order": 3, "xp_reward": 20,
            "content": {
                "prompt": "Write about your family. Who are they? What do they do?",
                "min_words": 25,
                "keywords_hint": ["my family", "my mother", "my father", "brother", "sister"],
            },
        },
        {
            "title": "Listen: At the Shop", "lesson_type": "listening", "difficulty": 2, "order": 4, "xp_reward": 20,
            "content": {
                "audio_text": "Excuse me, how much is this shirt? It is three hundred rupees. Can I pay by card?",
                "questions": [
                    {"q": "How much is the shirt?", "options": ["Two hundred rupees", "Three hundred rupees", "Four hundred rupees"], "answer": "Three hundred rupees"},
                ],
            },
        },
        {
            "title": "Order Food", "lesson_type": "speaking", "difficulty": 2, "order": 5, "xp_reward": 20,
            "content": {
                "target_sentences": [
                    "Can I have a cup of coffee, please?",
                    "How much does this cost?",
                    "Thank you very much.",
                ],
            },
        },
    ],
    3: [
        {
            "title": "A Short Story", "lesson_type": "reading", "difficulty": 3, "order": 1, "xp_reward": 20,
            "content": {
                "passage": "Last year, Ravi decided to learn painting. At first it was difficult, but he practiced every weekend. Now he sells his paintings online.",
                "questions": [
                    {"q": "What did Ravi decide to learn?", "options": ["Painting", "Singing", "Dancing"], "answer": "Painting"},
                    {"q": "What does Ravi do now?", "options": ["Teaches painting", "Sells paintings online", "Stopped painting"], "answer": "Sells paintings online"},
                ],
            },
        },
        {
            "title": "Sharing Opinions", "lesson_type": "writing", "difficulty": 3, "order": 2, "xp_reward": 25,
            "content": {
                "prompt": "Do you prefer reading books or watching movies? Explain why in a short paragraph.",
                "min_words": 40,
                "keywords_hint": ["i prefer", "because", "for example"],
            },
        },
        {
            "title": "Give a Recommendation", "lesson_type": "speaking", "difficulty": 3, "order": 3, "xp_reward": 25,
            "content": {
                "target_sentences": [
                    "I would recommend visiting the museum on weekends.",
                    "In my opinion, this is the best option.",
                ],
            },
        },
    ],
    4: [
        {
            "title": "Workplace Email", "lesson_type": "writing", "difficulty": 4, "order": 1, "xp_reward": 30,
            "content": {
                "prompt": "Write a short professional email requesting a meeting with your manager next week.",
                "min_words": 50,
                "keywords_hint": ["dear", "i would like to", "please let me know", "regards"],
            },
        },
        {
            "title": "Debate: Technology in Schools", "lesson_type": "speaking", "difficulty": 4, "order": 2, "xp_reward": 30,
            "content": {
                "target_sentences": [
                    "I strongly believe technology improves learning outcomes.",
                    "On the other hand, we must consider screen time concerns.",
                ],
            },
        },
    ],
}

ASSESSMENT_QUESTIONS = [
    # difficulty roughly maps to CEFR band: 1=A1 2=A2 3=B1 4=B2 5=C1 6=C2
    {"skill_type": "reading", "difficulty": 1, "question_text": "Choose the correct word: 'I ___ a student.'",
     "options": ["am", "is", "are", "be"], "correct_answer": "am"},
    {"skill_type": "reading", "difficulty": 2, "question_text": "Choose the correct word: 'She ___ to school every day.'",
     "options": ["go", "goes", "going", "gone"], "correct_answer": "goes"},
    {"skill_type": "reading", "difficulty": 3, "question_text": "Choose the best synonym for 'happy'.",
     "options": ["sad", "joyful", "angry", "tired"], "correct_answer": "joyful"},
    {"skill_type": "reading", "difficulty": 4, "question_text": "Which sentence uses the passive voice correctly?",
     "options": ["The cake was eaten by them.", "They was eating cake.", "The cake eating them.", "Them ate the cake."],
     "correct_answer": "The cake was eaten by them."},
    {"skill_type": "reading", "difficulty": 5, "question_text": "Choose the word closest in meaning to 'meticulous'.",
     "options": ["careless", "careful", "quick", "loud"], "correct_answer": "careful"},

    {"skill_type": "writing", "difficulty": 1, "question_text": "Fill in: 'This is ___ book.' (a/an)",
     "options": ["a", "an"], "correct_answer": "a"},
    {"skill_type": "writing", "difficulty": 2, "question_text": "Choose the correctly punctuated sentence.",
     "options": ["Where are you going", "Where are you going?", "where are you going.", "Where are you, going?"],
     "correct_answer": "Where are you going?"},
    {"skill_type": "writing", "difficulty": 3, "question_text": "Pick the sentence with correct tense: Yesterday, I ___ to the market.",
     "options": ["go", "goed", "went", "gone"], "correct_answer": "went"},
    {"skill_type": "writing", "difficulty": 4, "question_text": "Choose the best linking word: 'I was tired, ___ I finished the report.'",
     "options": ["so", "but", "or", "nor"], "correct_answer": "but"},

    {"skill_type": "listening", "difficulty": 1, "question_text": "Which greeting would you hear in the morning?",
     "options": ["Good night", "Good morning", "Goodbye", "See you"], "correct_answer": "Good morning"},
    {"skill_type": "listening", "difficulty": 2, "question_text": "If someone says 'It's raining heavily', what should you carry?",
     "options": ["Sunglasses", "Umbrella", "Fan", "Nothing"], "correct_answer": "Umbrella"},
    {"skill_type": "listening", "difficulty": 3, "question_text": "'I'm running late' most likely means the speaker is:",
     "options": ["Exercising", "Not on time", "Very fast", "Confused"], "correct_answer": "Not on time"},

    {"skill_type": "vocabulary", "difficulty": 1, "question_text": "What is the opposite of 'big'?",
     "options": ["small", "tall", "wide", "heavy"], "correct_answer": "small"},
    {"skill_type": "vocabulary", "difficulty": 2, "question_text": "Which word means a place where you buy food?",
     "options": ["hospital", "market", "school", "library"], "correct_answer": "market"},
    {"skill_type": "vocabulary", "difficulty": 3, "question_text": "Which word means 'to make something better'?",
     "options": ["improve", "damage", "ignore", "delay"], "correct_answer": "improve"},
    {"skill_type": "vocabulary", "difficulty": 4, "question_text": "Which word means 'existing in large amounts'?",
     "options": ["scarce", "abundant", "minimal", "rare"], "correct_answer": "abundant"},
]

ACHIEVEMENTS = [
    {"code": "first_lesson", "title": "First Steps", "description": "Complete your first lesson.",
     "icon": "🌱", "criteria_type": "lessons_completed", "criteria_value": 1},
    {"code": "ten_lessons", "title": "Building Momentum", "description": "Complete 10 lessons.",
     "icon": "📚", "criteria_type": "lessons_completed", "criteria_value": 10},
    {"code": "streak_3", "title": "On a Roll", "description": "Keep a 3-day learning streak.",
     "icon": "🔥", "criteria_type": "streak", "criteria_value": 3},
    {"code": "streak_7", "title": "Week Warrior", "description": "Keep a 7-day learning streak.",
     "icon": "🏅", "criteria_type": "streak", "criteria_value": 7},
    {"code": "xp_100", "title": "Century Club", "description": "Earn 100 XP.",
     "icon": "⭐", "criteria_type": "xp", "criteria_value": 100},
    {"code": "xp_500", "title": "XP Champion", "description": "Earn 500 XP.",
     "icon": "🏆", "criteria_type": "xp", "criteria_value": 500},
    {"code": "reach_a2", "title": "Level Up: A2", "description": "Reach CEFR level A2.",
     "icon": "🚀", "criteria_type": "level", "criteria_value": 1},
    {"code": "reach_b1", "title": "Level Up: B1", "description": "Reach CEFR level B1.",
     "icon": "🚀", "criteria_type": "level", "criteria_value": 2},
]


def seed():
    with app.app_context():
        db.create_all()

        LessonProgress = __import__("app.models", fromlist=["LessonProgress"]).LessonProgress
        LessonProgress.query.delete()
        Lesson.query.delete()
        Module.query.delete()
        AssessmentQuestion.query.delete()
        Achievement.query.delete()
        db.session.commit()

        module_objs = {}
        for m in MODULES:
            module = Module(**m)
            db.session.add(module)
            db.session.flush()
            module_objs[m["order"]] = module

        for order, lessons in LESSONS_BY_MODULE_ORDER.items():
            module = module_objs[order]
            for l in lessons:
                db.session.add(Lesson(module_id=module.id, **l))

        for q in ASSESSMENT_QUESTIONS:
            db.session.add(AssessmentQuestion(**q))

        for a in ACHIEVEMENTS:
            db.session.add(Achievement(**a))

        db.session.commit()
        print(f"Seeded {len(MODULES)} modules, "
              f"{sum(len(v) for v in LESSONS_BY_MODULE_ORDER.values())} lessons, "
              f"{len(ASSESSMENT_QUESTIONS)} assessment questions, "
              f"{len(ACHIEVEMENTS)} achievements.")

        if PronunciationModule.query.count() == 0:
            from seed_new_pronunciation import seed as seed_pronunciation

            seed_pronunciation()
        else:
            print("Pronunciation content already present; leaving it unchanged.")


if __name__ == "__main__":
    seed()
