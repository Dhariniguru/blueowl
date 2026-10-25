"""
Seed script to add image URLs to existing pronunciation exercises.
Run: python seed_pronunciation_images.py

NON-DESTRUCTIVE: only updates image_url on existing exercises.
No data is deleted or recreated.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models import PronunciationExercise

app = create_app()

# Compact (word, image_url) pairs for the alphabet module (Level 1)
ALPHABET_IMAGES = {
    "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
    "ball": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80",
    "cat": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
    "dog": "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80",
    "elephant": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80",
    "fish": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&q=80",
    "grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80",
    "house": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80",
    "igloo": "https://images.unsplash.com/photo-1516633630848-1d8f9d3b3b3b?w=400&q=80",
    "juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    "kite": "https://images.unsplash.com/photo-1548171915-e79a38a136b2?w=400&q=80",
    "lion": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80",
    "moon": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&q=80",
    "nest": "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=400&q=80",
    "orange": "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80",
    "pen": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80",
    "queen": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400&q=80",
    "rabbit": "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&q=80",
    "sun": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80",
    "tree": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    "umbrella": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80",
    "violin": "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&q=80",
    "water": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
    "xylophone": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80",
    "yo-yo": "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80",
    "zebra": "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&q=80",
    # Common words across other modules
    "table": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&q=80",
    "chair": "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80",
    "book": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    "phone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    "door": "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400&q=80",
    "bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    "rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    "milk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    "bird": "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80",
    "bear": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&q=80",
    "cow": "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=80",
    "pig": "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&q=80",
    "sheep": "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400&q=80",
    "horse": "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80",
    "chicken": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80",
    "monkey": "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&q=80",
    "tiger": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=80",
    "giraffe": "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&q=80",
    "eagle": "https://images.unsplash.com/photo-1486578077620-8a022ddd481f?w=400&q=80",
    "butterfly": "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&q=80",
    "owl": "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=80",
    "strawberry": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
    "carrot": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
    "tomato": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
    "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
    "broccoli": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",
    "coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
    "tea": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
    "sofa": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    "television": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80",
    "lamp": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    "bed": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80",
    "clock": "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&q=80",
    "shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
}


def seed_images():
    """Update existing exercises with image URLs from the curated map."""
    with app.app_context():
        updated = 0
        skipped = 0

        exercises = PronunciationExercise.query.all()
        for exercise in exercises:
            key = exercise.expected_text.strip().lower()
            image_url = ALPHABET_IMAGES.get(key)

            if image_url and not exercise.image_url:
                exercise.image_url = image_url
                updated += 1
            else:
                skipped += 1

        db.session.commit()
        print(f"✅ Updated {updated} exercises with image URLs ({skipped} already had images or no match).")


if __name__ == "__main__":
    seed_images()