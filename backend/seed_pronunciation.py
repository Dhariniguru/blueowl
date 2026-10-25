"""
DEPRECATED: Legacy pronunciation seed script.
This script is for the old pronunciation system and is no longer used.
The new pronunciation system is seeded using seed_new_pronunciation.py

Run: python seed_new_pronunciation.py
"""
import sys
import os

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models import PronunciationLessonLegacy

LESSONS = [
    # ── Alphabet Sounds ──
    {
        "title": "Vowel Sounds: A, E, I, O, U",
        "category": "alphabet",
        "target_text": "Apple, egg, igloo, orange, umbrella",
        "explanation": "Practice the five basic vowel sounds. Say each word clearly, focusing on the first sound.",
        "difficulty": 1,
        "order": 1,
    },
    {
        "title": "Consonant Sounds: B, D, F, G, H",
        "category": "alphabet",
        "target_text": "Big, dog, fish, good, hat",
        "explanation": "Practice these common consonant sounds. Notice how your lips and tongue move for each sound.",
        "difficulty": 1,
        "order": 2,
    },
    {
        "title": "Consonant Sounds: K, L, M, N, P",
        "category": "alphabet",
        "target_text": "Cat, look, milk, nose, pen",
        "explanation": "Continue practicing consonant sounds. Focus on clear enunciation.",
        "difficulty": 1,
        "order": 3,
    },
    {
        "title": "Consonant Sounds: R, S, T, V, W",
        "category": "alphabet",
        "target_text": "Run, sun, top, van, water",
        "explanation": "Practice these sounds that often require careful tongue placement.",
        "difficulty": 1,
        "order": 4,
    },
    # ── Common Words ──
    {
        "title": "Everyday Objects",
        "category": "common_words",
        "target_text": "Table, chair, book, phone, window, door, kitchen, bathroom",
        "explanation": "Practice common words for things you see every day. Say each word slowly and clearly.",
        "difficulty": 1,
        "order": 5,
    },
    {
        "title": "Food and Drinks",
        "category": "common_words",
        "target_text": "Water, bread, rice, chicken, apple, banana, coffee, milk",
        "explanation": "Practice food and drink vocabulary. Pay attention to stress patterns.",
        "difficulty": 1,
        "order": 6,
    },
    {
        "title": "Colors and Shapes",
        "category": "common_words",
        "target_text": "Red, blue, green, yellow, black, white, circle, square, triangle",
        "explanation": "Practice colors and shapes. Focus on the vowel sounds in each word.",
        "difficulty": 1,
        "order": 7,
    },
    {
        "title": "Numbers 1-10",
        "category": "common_words",
        "target_text": "One, two, three, four, five, six, seven, eight, nine, ten",
        "explanation": "Practice pronouncing numbers. Pay special attention to 'three' and 'eight' which have tricky sounds.",
        "difficulty": 1,
        "order": 8,
    },
    # ── Greetings ──
    {
        "title": "Basic Greetings",
        "category": "greetings",
        "target_text": "Hello, how are you? I am fine, thank you.",
        "explanation": "Practice basic greetings. Focus on the rising intonation in the question.",
        "difficulty": 2,
        "order": 9,
    },
    {
        "title": "Introducing Yourself",
        "category": "greetings",
        "target_text": "Hi, my name is John. Nice to meet you.",
        "explanation": "Practice introducing yourself. Say it naturally, as if meeting someone for the first time.",
        "difficulty": 2,
        "order": 10,
    },
    {
        "title": "Polite Expressions",
        "category": "greetings",
        "target_text": "Please, thank you, excuse me, I am sorry, you are welcome",
        "explanation": "Practice polite expressions. These are essential for everyday conversations.",
        "difficulty": 2,
        "order": 11,
    },
    {
        "title": "Morning Greetings",
        "category": "greetings",
        "target_text": "Good morning, good afternoon, good evening, good night",
        "explanation": "Practice time-based greetings. Notice how the stress changes in each phrase.",
        "difficulty": 2,
        "order": 12,
    },
    # ── Short Sentences ──
    {
        "title": "Simple Questions",
        "category": "sentences",
        "target_text": "Where is the bathroom? Can you help me? What time is it?",
        "explanation": "Practice asking simple questions. Focus on the rising pitch at the end of each question.",
        "difficulty": 3,
        "order": 13,
    },
    {
        "title": "Describing Things",
        "category": "sentences",
        "target_text": "The sky is blue. The flower is beautiful. The food tastes good.",
        "explanation": "Practice describing things around you. Focus on linking words together smoothly.",
        "difficulty": 3,
        "order": 14,
    },
    {
        "title": "Talking About Preferences",
        "category": "sentences",
        "target_text": "I like reading books. She enjoys playing tennis. They love watching movies.",
        "explanation": "Practice expressing likes and dislikes. Notice the 'ing' endings.",
        "difficulty": 3,
        "order": 15,
    },
    {
        "title": "Daily Routines",
        "category": "sentences",
        "target_text": "I wake up at seven o'clock. I brush my teeth. I eat breakfast.",
        "explanation": "Practice talking about your daily routine. Focus on clear pronunciation of time expressions.",
        "difficulty": 3,
        "order": 16,
    },
    # ── Difficult Pronunciation Pairs ──
    {
        "title": "Minimal Pairs: Ship vs Sheep",
        "category": "difficult_pairs",
        "target_text": "Ship, sheep, chip, cheap, bit, beat, sit, seat",
        "explanation": "Practice distinguishing between short 'i' and long 'ee' sounds. The length of the vowel changes the meaning!",
        "difficulty": 4,
        "order": 17,
    },
    {
        "title": "Minimal Pairs: Fan vs Van",
        "category": "difficult_pairs",
        "target_text": "Fan, van, fine, vine, fear, veer, leaf, leave",
        "explanation": "Practice the 'f' and 'v' sounds. Notice that 'v' uses your vocal cords while 'f' does not.",
        "difficulty": 4,
        "order": 18,
    },
    {
        "title": "Minimal Pairs: Think vs Sink",
        "category": "difficult_pairs",
        "target_text": "Think, sink, thumb, sum, three, free, thick, sick",
        "explanation": "Practice the 'th' and 's' sounds. Put your tongue between your teeth for 'th'.",
        "difficulty": 4,
        "order": 19,
    },
    {
        "title": "Minimal Pairs: Light vs Right",
        "category": "difficult_pairs",
        "target_text": "Light, right, collect, correct, long, wrong, alive, arrive",
        "explanation": "Practice the 'l' and 'r' sounds. These are often confused by learners. Focus on tongue position.",
        "difficulty": 5,
        "order": 20,
    },
    {
        "title": "Tricky Word Endings",
        "category": "difficult_pairs",
        "target_text": "Walked, wanted, played, started, stopped, needed, called, waited",
        "explanation": "Practice 'ed' endings. Notice that 'ed' can sound like 't', 'd', or 'id' depending on the word.",
        "difficulty": 5,
        "order": 21,
    },
    {
        "title": "Silent Letters",
        "category": "difficult_pairs",
        "target_text": "Knife, write, lamb, castle, listen, Wednesday, island, honest",
        "explanation": "Practice words with silent letters. In these words, some letters are not pronounced at all!",
        "difficulty": 5,
        "order": 22,
    },
]


def seed():
    app = create_app()
    with app.app_context():
        # Clear existing data
        PronunciationLessonLegacy.query.delete()
        db.session.commit()

        # Insert lessons
        for lesson_data in LESSONS:
            lesson = PronunciationLessonLegacy(**lesson_data)
            db.session.add(lesson)

        db.session.commit()
        print(f"✅ Seeded {len(LESSONS)} pronunciation lessons.")


if __name__ == "__main__":
    seed()