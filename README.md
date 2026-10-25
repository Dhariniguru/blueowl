# NeoLearn — AI-Powered Literacy Assistant for NeoLearners

A full-stack implementation of the PRD: adaptive placement, personalized
lesson recommendations, voice-based speaking/listening practice, progress
dashboards, and gamification — built as a Duolingo-style learning path.

**Stack:** React (Vite + Tailwind) frontend · Flask + SQLAlchemy + JWT backend
· SQLite for local dev (swap to Postgres for production) · Web Speech API for
voice, no external API key required.

---

## 1. Backend setup (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # then edit SECRET_KEY / JWT_SECRET_KEY
python seed.py                    # creates the DB and loads all learning and pronunciation content
python run.py                     # runs on http://localhost:5000
```

Re-running `python seed.py` is safe — it refreshes lesson/assessment/
achievement content and adds the structured pronunciation content when it is
missing, without touching user accounts or progress. The pronunciation seed can
also be run directly with `python seed_new_pronunciation.py`.

### Switching to PostgreSQL for production

1. `pip install psycopg2-binary` (add it to requirements.txt)
2. In `.env`, set:
   ```
   DATABASE_URL=postgresql://neolearn_user:password@localhost:5432/neolearn
   ```
3. Re-run `python seed.py` against the new database.

## 2. Frontend setup (React)

```bash
cd frontend
npm install
npm run dev                       # runs on http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://127.0.0.1:5000` (see
`vite.config.js`), so just run both servers side by side and open
`http://localhost:5173`.

For production: `npm run build` outputs static files to `frontend/dist/`,
which you can serve from any static host or from Flask itself.

---

## 3. How the PRD modules map to the code

| PRD Module | Where it lives |
|---|---|
| Learning Content Management & Assessment Framework | `backend/app/models.py` (Module, Lesson, AssessmentQuestion), `backend/seed.py` |
| AI-Based Personalized Learning Engine | `backend/app/services/adaptive_engine.py` — placement scoring, next-lesson recommendation, auto level-up |
| Voice Learning & Progress Monitoring Dashboard | `backend/app/services/voice_scoring.py` + `backend/app/routes/voice.py` (scoring), `frontend/src/hooks/useSpeech.js` (browser mic/TTS), `backend/app/routes/progress.py` + `frontend/src/pages/Progress.jsx` (dashboard) |
| Gamification / Achievements | `backend/app/services/gamification.py`, `frontend/src/pages/Achievements.jsx` |
| System flow (Registration → Assessment → Skill Evaluation → Personalized Plan → Activities → Voice Assessment → Progress → Reports) | `Register` → `Onboarding` (quiz) → `Dashboard` (path + recommendations) → `LessonPlayer` (all 5 lesson types) → `Progress` |

## 4. Voice features — how they actually work

Speech-to-text and text-to-speech run **in the browser** via the native Web
Speech API (`SpeechRecognition` / `speechSynthesis`) — this needs no API key
and works out of the box in Chrome/Edge. The backend never touches raw
audio; it receives the browser's transcript and scores pronunciation with a
Levenshtein word-alignment algorithm (the same core metric commercial
pronunciation APIs report on), giving per-word right/wrong feedback.

**To upgrade to a cloud STT/pronunciation API later** (Azure Pronunciation
Assessment, Google Speech-to-Text, etc.), you only need to change
`backend/app/services/voice_scoring.py` — the route and frontend contract
stay the same.

## 5. Default accounts

There are none — register a new account from the landing page, and you'll
be walked through the placement quiz (Onboarding) automatically the first
time.

## 6. Project structure

```
neolearn/
├── backend/
│   ├── app/
│   │   ├── models.py            # User, Module, Lesson, Assessment, Progress, Voice, Achievements
│   │   ├── routes/               # auth, assessment, lessons, voice, progress, achievements
│   │   ├── services/              # adaptive_engine, voice_scoring, gamification
│   │   ├── config.py / extensions.py / __init__.py
│   ├── seed.py                   # sample CEFR A1–B2 content, quiz bank, achievements
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── src/
    │   ├── pages/                 # Landing, Login, Register, Onboarding, Dashboard, LessonPlayer, Progress, Achievements
    │   ├── components/            # Sidebar, StatCard, ModulePath, VoiceRecorder, ProtectedRoute
    │   ├── hooks/useSpeech.js     # Web Speech API wrapper
    │   ├── context/AuthContext.jsx
    │   └── api/client.js          # Axios + JWT interceptor
    └── package.json
```

## 7. What's seeded vs. what you'll want to expand

Seeded now: 4 CEFR modules (A1–B2), 15 lessons across all 5 lesson types
(reading, vocabulary, writing, listening, speaking), a 16-question adaptive
placement quiz, and 8 achievements. This is enough to demo the entire PRD
flow end-to-end. To go further:

- Add C1/C2 modules and more lessons per level in `seed.py`.
- Add real regional-language content by populating `Module.language` /
  translated `Lesson.content` and switching `useSpeech`'s `lang` to match.
- Swap the rule-based `adaptive_engine.py` for a trained ability-estimation
  model once you have real usage data to train on.
