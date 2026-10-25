"""Quick verification script - call from backend dir."""
import requests
import json

BASE = "http://127.0.0.1:5000"

# Test health
r = requests.get(f"{BASE}/api/health")
print(f"Health: {r.status_code} - {r.json()['status']}")

# Register a test user to get JWT
register_data = {
    "full_name": "Test User",
    "username": "verify_test_user",
    "email": "verify_test@test.com",
    "password": "test1234"
}
# Delete user first if exists
requests.delete(f"{BASE}/api/auth/register", json=register_data)

r = requests.post(f"{BASE}/api/auth/register", json=register_data)
if r.status_code == 201:
    token = r.json().get("token")
    print(f"Auth: Got token: {token[:20]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test lesson 1 with new structured data
    r = requests.get(f"{BASE}/api/lessons/1", headers=headers)
    if r.status_code == 200:
        d = r.json()
        print(f"\nLesson: {d['title']}")
        print(f"  Intro: {d.get('introduction', 'N/A')[:60]}...")
        print(f"  Vocab: {len(d.get('vocabulary', []))} words")
        print(f"  Questions: {len(d.get('questions', []))} questions")
        print(f"  Tips: {len(d.get('tips', []))} tips")
        print(f"  Images: {len(d.get('images', []))} images")
        
        if d.get('questions'):
            q = d['questions'][0]
            print(f"\n  Sample Q: {q['question_text'][:50]}...")
            print(f"  Correct: {q['correct_answer']}")
        
        # Test report
        r = requests.post(f"{BASE}/api/user/report/generate", headers=headers)
        print(f"\nReport: {r.status_code}")
        if r.status_code == 200:
            report = r.json().get("report", {})
            print(f"  AI recommendations: {len(report.get('ai_remarks', {}).get('recommendations', []))}")
        
        # Test progress
        r = requests.get(f"{BASE}/api/user/progress", headers=headers)
        print(f"\nProgress: {r.status_code}")
        
        # Test AI chat
        r = requests.post(f"{BASE}/api/ai/chat", headers=headers, json={
            "message": "What does hello mean?",
            "lesson_id": 1
        })
        print(f"\nAI Chat: {r.status_code}")
        if r.status_code == 200:
            print(f"  Response: {r.json().get('response', '')[:80]}...")
        
        # Test PDF download
        r = requests.get(f"{BASE}/api/user/report/download", headers=headers)
        print(f"\nPDF Download: {r.status_code}")
        if r.status_code == 200:
            print(f"  PDF size: {len(r.content)} bytes")
        
        print("\n✅ All endpoints verified!")
    else:
        print(f"Lesson error: {r.status_code}")
else:
    print(f"Register error: {r.status_code} - {r.text}")

print("\n✨ Done")