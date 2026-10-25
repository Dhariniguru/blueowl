import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

src = open('seed_new_pronunciation.py', encoding='utf-8').read()
ns = {}
ns['__file__'] = 'seed_new_pronunciation.py'
exec(src.split('def seed()')[0], ns)
OLD = ns['MODULES_DATA']

LEVEL_PLAN = [
    [("Alphabet Sounds", 10)],
    [("Basic Words", 10)],
    [("Numbers & Counting", 10)],
    [("Colors & Shapes", 10)],
    [("Animals", 10)],
    [("Food & Drinks", 10)],
    [("Daily Objects", 10)],
    [("Greetings", 10)],
    [("Travel & Directions", 9), ("Shopping", 1)],
    [("Common Sentences", 6), ("Conversations", 2), ("Advanced Speaking", 2)],
]

LEVEL_TITLES = [
    "Level 1 — Alphabet and sounds",
    "Level 2 — Common words",
    "Level 3 — Numbers and counting",
    "Level 4 — Colors and shapes",
    "Level 5 — Animals",
    "Level 6 — Food and drinks",
    "Level 7 — Daily objects",
    "Level 8 — Greetings and travel",
    "Level 9 — Conversations",
    "Level 10 — Speaking challenge",
]

LEVEL_DESCRIPTIONS = [
    "Master alphabet sounds with picture-based examples.",
    "Practice familiar objects, animals, colors, numbers, and everyday vocabulary.",
    "Practice vowel and consonant contrasts through listening and speaking.",
    "Practice syllable recognition, word stress, and clear articulation.",
    "Practice greetings, requests, introductions, and frequently used expressions.",
    "Practice sentence stress, rhythm, and connected speech.",
    "Listen to short conversational exchanges and respond by speaking.",
    "Listen to short audio passages and answer comprehension questions.",
    "Practice longer sentences, natural pauses, intonation, and expressive speech.",
    "Complete a progressively challenging combination of listening, pronunciation, and spoken-response exercises.",
]

old_by_title = {m['title']: m for m in OLD}

NEW_MODULES = []
for li, title in enumerate(LEVEL_TITLES):
    exercises = []
    for old_title, take in LEVEL_PLAN[li]:
        mod = old_by_title[old_title]
        flat = []
        for lesson in mod['lessons']:
            for ex in lesson['exercises']:
                flat.append(dict(ex))
        exercises.extend(flat[:take])
    exercises = exercises[:10]
    while len(exercises) < 10 and exercises:
        exercises.append(dict(exercises[-1]))
    for i, ex in enumerate(exercises, 1):
        ex['order'] = i
        exercises[i-1] = ex

    lesson = {
        "title": f"Level {li+1} Practice",
        "description": LEVEL_DESCRIPTIONS[li],
        "difficulty": min(5, li+1),
        "order": 1,
        "xp_reward": 20,
        "estimated_minutes": 8,
        "exercises": exercises,
    }
    module = {
        "title": title,
        "description": LEVEL_DESCRIPTIONS[li],
        "difficulty": min(5, li+1),
        "order": li+1,
        "xp_reward": 100,
        "icon": ["\U0001F524","\U0001F4AC","\U0001F522","\U0001F3A8","\U0001F43E","\U0001F37D","\U0001F3E0","\u2708","\U0001F5E3","\U0001F3AF"][li],
        "color": ["#14B8A6","#0EA5E9","#F59E0B","#EC4899","#10B981","#F97316","#6366F1","#14B8A6","#0EA5E9","#EF4444"][li],
        "lessons": [lesson],
    }
    NEW_MODULES.append(module)

header = '''"""
Seed script for the structured Pronunciation Learning System (10 levels x 10 exercises).
Run: python seed_new_pronunciation.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models import (
    PronunciationModule, PronunciationLessonNew, PronunciationExercise
)

app = create_app()

MODULES_DATA = '''

footer = '''

def seed():
    with app.app_context():
        PronunciationExercise.query.delete()
        PronunciationLessonNew.query.delete()
        PronunciationModule.query.delete()
        db.session.commit()

        for module_data in MODULES_DATA:
            lessons_data = module_data.pop("lessons", [])
            exercises_data_by_lesson = []
            for lesson_data in lessons_data:
                exercises = lesson_data.pop("exercises", [])
                exercises_data_by_lesson.append(exercises)

            module = PronunciationModule(**module_data)
            db.session.add(module)
            db.session.flush()

            for idx, lesson_data in enumerate(lessons_data):
                exercises = exercises_data_by_lesson[idx]
                lesson = PronunciationLessonNew(
                    **lesson_data,
                    module_id=module.id
                )
                db.session.add(lesson)
                db.session.flush()

                for exercise_data in exercises:
                    exercise = PronunciationExercise(
                        **exercise_data,
                        lesson_id=lesson.id
                    )
                    db.session.add(exercise)

        db.session.commit()
        total_ex = sum(len(l['exercises']) for m in MODULES_DATA for l in m['lessons'])
        print(f"Seeded {len(MODULES_DATA)} pronunciation modules with {total_ex} exercises.")


if __name__ == "__main__":
    seed()
'''

content = header + repr(NEW_MODULES) + "\n" + footer
open('seed_new_pronunciation.py', 'w', encoding='utf-8').write(content)
print("Rewrote seed_new_pronunciation.py with", len(NEW_MODULES), "modules")
