<div align="center">

<h1>VivaMate AI</h1>

<p><strong>Your intelligent academic companion — study smarter, achieve more.</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/License-Open%20Source-green?style=flat-square" />
</p>

<p>VivaMate AI is a full-stack student productivity platform that combines course management, task tracking, mock viva quizzes, document storage, AI study material generation, and an intelligent chat assistant — all in one unified workspace.</p>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Features](#live-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start — Windows](#quick-start--windows)
  - [Quick Start — macOS / Linux](#quick-start--macos--linux)
  - [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [Authentication Flow](#authentication-flow)
- [Database](#database)
- [localStorage Keys](#localstorage-keys)
- [AI Assistant](#ai-assistant)
- [Viva Quiz System](#viva-quiz-system)
- [Document Study Generator](#document-study-generator)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

VivaMate AI is built for students who want to manage their entire academic life in one place. It provides a clean, modern dashboard to:

- Track quiz performance and study activity
- Manage tasks with priorities and deadlines
- Organize courses and generate AI viva questions per subject
- Upload documents and generate summaries, MCQs, flashcards, and viva prompts
- Chat with an AI study assistant for instant academic guidance
- Review full session history with scores and performance trends

All pages are protected behind JWT authentication. The backend supports both MongoDB and a zero-config in-memory fallback, so the app runs instantly without any database setup.

---

## Live Features

| Feature | Description | Storage |
|---|---|---|
| Smart Dashboard | Study stats, weekly activity bar chart, task preview, recent subjects | `localStorage` |
| AI Chat Assistant | Rule-based chat with keyword matching, typing simulation, persistent history | `localStorage` |
| Course Management | Add, edit, delete subjects with level tagging and AI viva generation | `localStorage` |
| Viva Generator | Generate 5-question mock viva sets per subject with MCQ + open answer | `localStorage` |
| Task Management | Create tasks with title, course, deadline, priority; toggle complete/delete | `localStorage` |
| Mock Viva Quizzes | Take AI-generated viva sets, submit answers, get scored, save to history | `localStorage` |
| Document Storage | Upload PDF/DOCX/TXT files (up to 10 MB), manage by subject | `localStorage` |
| Study Material Generator | Paste notes → generate summary, key points, MCQs, viva questions, flashcards | In-memory |
| Session History | View all past quiz attempts with subject, date, score, and activity type | `localStorage` |
| User Profile | Edit name, email, university, program, semester; saved to `localStorage` | `localStorage` |
| Protected Routes | All dashboard pages require a valid JWT token | JWT + `localStorage` |

---

## Tech Stack

### Frontend (`/client`)

| Package | Version | Purpose |
|---|---|---|
| React | 19 | UI library with functional components and hooks |
| React Router DOM | v7 | Client-side routing with nested protected routes |
| Vite | 8 | Dev server and production build tool |
| Tailwind CSS | v4 | Utility-first CSS framework |
| Framer Motion | 13 | Page and component animations |
| Lucide React | 1.47 | Icon library |
| React Hot Toast | 2.6 | Toast notification system |
| Axios | 1.20 | HTTP client (used in `api.js`) |
| oxlint | 1.81 | Fast JavaScript/JSX linter |

### Backend (`/backend`)

| Package | Version | Purpose |
|---|---|---|
| Express | v4 | REST API web framework |
| Mongoose | v8 | MongoDB ODM for schema and queries |
| jsonwebtoken | v9 | JWT signing and verification |
| bcryptjs | v2 | Password hashing with salt rounds |
| dotenv | v16 | Environment variable loading |
| cors | v2 | Cross-origin request handling |

---

## Project Structure

```
VivaMate-AI/
│
├── backend/                        # Express.js REST API
│   ├── config/
│   │   └── db.js                   # MongoDB connection with in-memory fallback
│   ├── data/
│   │   └── store.js                # In-memory users and subjects arrays
│   ├── middleware/
│   │   └── auth.js                 # JWT Bearer token verification middleware
│   ├── models/
│   │   ├── User.js                 # Mongoose User schema (name, email, password)
│   │   └── Subject.js              # Mongoose Subject schema (userId, name, description, level)
│   ├── utils/
│   │   └── jwt.js                  # generateToken() and verifyToken() helpers
│   ├── .env.example                # Environment variable template
│   ├── package.json                # Backend dependencies and scripts
│   └── server.js                   # All Express routes: auth, profile, subjects, health
│
├── client/                         # React + Vite frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── hero.png            # Landing page hero image
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Sidebar + navbar shell for all protected pages
│   │   │   └── ProtectedRoute.jsx  # Redirects to /login if not authenticated
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Public landing page (features, workflow, CTA)
│   │   │   ├── Login.jsx           # Login form → POST /api/auth/login
│   │   │   ├── Signup.jsx          # Registration form → POST /api/auth/signup
│   │   │   ├── Dashboard.jsx       # Stats, weekly chart, task preview, subject preview
│   │   │   ├── Courses.jsx         # Subject CRUD + AI viva question generator
│   │   │   ├── Tasks.jsx           # Task CRUD with priority, deadline, completion toggle
│   │   │   ├── Quizzes.jsx         # Mock viva quiz runner with scoring and history save
│   │   │   ├── Assistant.jsx       # AI chat with keyword matching and localStorage history
│   │   │   ├── Documents.jsx       # File upload manager + AI study material generator
│   │   │   ├── History.jsx         # Quiz session history with scores and stats
│   │   │   └── Profile.jsx         # User profile editor (name, email, university, program)
│   │   │
│   │   ├── utils/
│   │   │   ├── session.js          # SESSION_KEYS, isUserLoggedIn(), clearUserSession()
│   │   │   └── vivaData.js         # defaultSubjects, generatePracticeSet(), evaluateAnswer()
│   │   │
│   │   ├── api.js                  # Fetch-based API client (signup, login, profile, subjects)
│   │   ├── App.jsx                 # BrowserRouter with all public and protected routes
│   │   ├── App.css                 # All component-level styles
│   │   ├── index.css               # Base/reset styles
│   │   └── main.jsx                # React DOM entry point
│   │
│   ├── index.html
│   ├── vite.config.js              # Vite config with React plugin
│   ├── .oxlintrc.json              # oxlint configuration
│   └── package.json
│
├── scripts/
│   └── run-project.js              # Node.js launcher script
│
├── run-project.bat                 # Windows one-click launcher
├── run-project.sh                  # macOS/Linux one-click launcher
├── package.json                    # Root scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- (Optional) [MongoDB](https://www.mongodb.com/) — the app runs without it

```bash
node --version   # v18+
npm --version    # v9+
```

---

### Quick Start — Windows

Double-click `run-project.bat` in the project root.

It installs missing backend and frontend packages, starts both services together, waits until they are ready, and opens **http://localhost:5173/** in your browser. If VivaMate is already running, the launcher reuses it instead of starting duplicates. Keep the launcher terminal open while using the app.

---

### Quick Start — macOS / Linux

```bash
chmod +x run-project.sh
./run-project.sh
```

---

### Manual Setup

#### 1. Clone the repository

```bash
git clone https://github.com/FarmanKhan898/VivaMate-AI.git
cd VivaMate-AI
```

#### 2. Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your JWT_SECRET and optionally MONGO_URI
npm install
npm run dev
```

Backend runs at: **http://localhost:5000**

#### 3. Start the frontend (new terminal)

```bash
cd client
npm install
npm run dev -- --host 0.0.0.0
```

Frontend runs at: **http://localhost:5173**

> The `--host 0.0.0.0` flag makes the app accessible from other devices on the same network via `http://<your-ip>:5173`.

---

## Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
JWT_SECRET=vivamate-super-secret-key
MONGO_URI=mongodb://localhost:27017/vivamate-ai
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Port the Express server listens on |
| `JWT_SECRET` | Yes | fallback string | Secret used to sign and verify JWT tokens. Use a strong random string in production |
| `MONGO_URI` | No | — | MongoDB connection string. If omitted, the app uses in-memory storage |

> Never commit your `.env` file. It is already in `.gitignore`.

---

## API Reference

All routes are prefixed with `/api`. Protected routes require:

```
Authorization: Bearer <jwt_token>
```

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive a JWT |

#### POST `/api/auth/signup`

```json
// Request
{ "name": "Farman Khan", "email": "farman@example.com", "password": "yourpassword" }

// Response 201
{ "token": "<jwt>", "user": { "id": "...", "name": "Farman Khan", "email": "farman@example.com" } }

// Error 409 — user already exists
// Error 400 — missing fields
```

#### POST `/api/auth/login`

```json
// Request
{ "email": "farman@example.com", "password": "yourpassword" }

// Response 200
{ "token": "<jwt>", "user": { "id": "...", "name": "Farman Khan", "email": "farman@example.com" } }

// Error 404 — user not found
// Error 401 — invalid password
```

---

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profile` | Yes | Get the authenticated user's profile |

```json
// Response 200
{ "user": { "id": "...", "name": "Farman Khan", "email": "farman@example.com" } }
```

---

### Subjects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/subjects` | Yes | Get all subjects for the authenticated user |
| `POST` | `/api/subjects` | Yes | Create a new subject |

#### POST `/api/subjects`

```json
// Request
{ "name": "Data Structures", "description": "Arrays, trees, graphs", "level": "Intermediate" }
// level: "Beginner" | "Intermediate" | "Advanced"

// Response 201
{ "subject": { "id": "...", "userId": "...", "name": "Data Structures", ... } }
```

---

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Returns `{ ok: true, message: "VivaMate API is running." }` |
| `GET` | `/api/health-check` | No | Returns `{ ok: true, environment: "backend-ready" }` |

---

## Pages & Routes

### Public Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Landing page with hero, features grid, workflow steps, and CTA |
| `/login` | `Login.jsx` | Login form — calls `POST /api/auth/login`, stores token |
| `/signup` | `Signup.jsx` | Registration form — calls `POST /api/auth/signup`, stores token |
| `/*` | — | All unmatched paths redirect to `/` |

### Protected Routes (require login)

All protected routes are wrapped in `ProtectedRoute` → `Layout` (sidebar + navbar).

| Path | Component | Description |
|---|---|---|
| `/dashboard` | `Dashboard.jsx` | Stats cards, weekly bar chart, upcoming tasks, recent subjects |
| `/courses` | `Courses.jsx` | Subject CRUD, AI viva generator panel, search and level filter |
| `/tasks` | `Tasks.jsx` | Task table with completion toggle, priority badges, deadline |
| `/quizzes` | `Quizzes.jsx` | Mock viva runner — select set, answer questions, view score |
| `/assistant` | `Assistant.jsx` | AI chat with quick prompts, typing animation, clear history |
| `/documents` | `Documents.jsx` | File upload library + AI study material generator workspace |
| `/profile` | `Profile.jsx` | Edit name, email, university, program, semester; toggle preferences |

> `History.jsx` is imported in the app but currently accessible via the sidebar navigation.

---

## Authentication Flow

VivaMate AI uses **stateless JWT authentication**.

```
1. User submits login/signup form
2. Backend validates credentials, hashes password with bcryptjs (10 salt rounds)
3. Server signs a JWT with { id, email, name } — expires in 7 days
4. Frontend stores token in localStorage as "vivaMateToken"
5. All API requests include: Authorization: Bearer <token>
6. authMiddleware on backend calls verifyToken() on every protected request
7. ProtectedRoute on frontend calls isUserLoggedIn() — checks both
   localStorage "isLoggedIn" === "true" AND "vivaMateToken" exists
8. On logout, clearUserSession() removes all session keys from localStorage
```

**JWT payload structure:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1235172690
}
```

**Session keys managed by `session.js`:**

| Key | Value |
|---|---|
| `isLoggedIn` | `"true"` |
| `vivaMateToken` | JWT string |
| `vivaMateUserName` | User's full name |
| `vivaMateUserEmail` | User's email |
| `vivaMateUniversity` | University name |
| `vivaMateProgram` | Degree program |
| `vivaMateSemester` | Current semester |

---

## Database

VivaMate AI supports two storage modes that switch automatically.

### MongoDB Mode (Recommended for production)

Set `MONGO_URI` in `backend/.env`. Mongoose connects on startup via `connectDB()`.

**User Schema** (`models/User.js`):
```
name          String    required, trimmed
email         String    required, unique, lowercase, trimmed
password      String    required, bcrypt hashed
createdAt     Date      auto (timestamps: true)
updatedAt     Date      auto (timestamps: true)
```

**Subject Schema** (`models/Subject.js`):
```
userId        ObjectId  ref: "User", required
name          String    required, trimmed
description   String    default: ""
level         String    enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner"
createdAt     Date      auto
updatedAt     Date      auto
```

### In-Memory Mode (Default / fallback)

If `MONGO_URI` is not set or MongoDB connection fails, `db.js` logs a message and the app continues using `data/store.js`:

```js
// store.js
export const memoryStore = {
  users: [],
  subjects: [],
};
```

- Signup/login writes to `memoryStore.users`
- Subject creation writes to `memoryStore.subjects`
- Data is lost when the server restarts
- Suitable for local development and demos

> Both modes run in parallel — the server tries MongoDB first, then falls back silently.

---

## localStorage Keys

All frontend data is persisted in the browser's `localStorage`. Here is the complete reference:

| Key | Type | Set by | Description |
|---|---|---|---|
| `isLoggedIn` | `"true"` | Login/Signup | Auth flag checked by `ProtectedRoute` |
| `vivaMateToken` | JWT string | Login/Signup | Bearer token for API requests |
| `vivaMateUserName` | string | Login/Signup/Profile | User's display name |
| `vivaMateUserEmail` | string | Login/Signup/Profile | User's email |
| `vivaMateUniversity` | string | Profile | University name |
| `vivaMateProgram` | string | Profile | Degree program |
| `vivaMateSemester` | string | Profile | Current semester |
| `vivaMateSubjects` | JSON array | Courses | All user subjects |
| `vivaMateTasks` | JSON array | Tasks | All user tasks |
| `vivaMateGeneratedSets` | JSON array | Courses/Quizzes | Up to 8 AI-generated viva sets |
| `vivaMateLatestSet` | JSON object | Courses | Most recently generated viva set |
| `vivaMateHistory` | JSON array | Quizzes | Up to 8 quiz session records |
| `vivaMateChatMessages` | JSON array | Assistant | Full AI chat conversation history |
| `vivaMateDocuments` | JSON array | Documents | Uploaded document metadata |

---

## AI Assistant

The AI assistant (`/assistant`) is a built-in rule-based chat system.

**How it works:**

1. User types a message and submits the form
2. `generateResponse(question)` lowercases the input and checks keyword matches
3. A `setTimeout` of 900ms simulates a typing delay
4. The AI response is appended to the messages array
5. The full conversation is saved to `localStorage` under `vivaMateChatMessages`
6. On page load, history is restored from `localStorage`

**Keyword matching rules:**

| Keyword(s) | Response topic |
|---|---|
| `machine learning` | ML definition and overview |
| `study`, `schedule` | Pomodoro technique and study cycle |
| `react`, `javascript` | React components, props, state |
| `data structure`, `dsa` | Arrays, trees, stacks, queues, graphs |
| `exam`, `quiz` | Exam preparation strategy |
| `hello`, `hi` | Greeting response |
| *(anything else)* | Generic academic guidance |

**Quick Prompts (sidebar shortcuts):**
- Explain machine learning
- Create a study plan
- What is React?
- Explain data structures

**Clear conversation** — triggers `window.confirm`, then resets messages to the initial greeting and removes `vivaMateChatMessages` from `localStorage`.

---

## Viva Quiz System

The quiz system is built around AI-generated practice sets created in the Courses page.

### Generating a Practice Set

In `Courses.jsx`, the AI Generator panel calls `generatePracticeSet({ subject, topic, difficulty, language })` from `vivaData.js`.

Each generated set contains:
```js
{
  id: Date.now(),
  subject: "Database Normalization",
  topic: "Normalization Forms",
  difficulty: "Medium",
  language: "English",
  createdAt: "ISO string",
  questions: [
    {
      id: "timestamp-index",
      question: "Explain ...",
      answer: "Model answer ...",
      followUp: "Follow-up question ...",
      difficulty: "Medium",
      type: "viva",
      mcq: ["Option A", "Option B", "Option C", "Option D"],
      correctMcq: "Option A"
    },
    // × 5 questions total
  ]
}
```

Sets are saved to `vivaMateGeneratedSets` (max 8) and `vivaMateLatestSet`.

### Taking a Quiz

In `Quizzes.jsx`:

1. User selects a practice set and clicks **Start Mock Viva**
2. Each question shows the question text, a textarea for open answers, and 4 MCQ options
3. User can type a free-text answer OR click an MCQ option
4. On **Next Question**, the answer is recorded in `submittedAnswers`
5. On the final question, `computeScore()` runs `evaluateAnswer()` for each answer
6. Score is saved to `vivaMateHistory` and the result screen is shown

### Scoring (`evaluateAnswer`)

```
1. Tokenize both the model answer and user answer into unique words
2. Count overlapping words between the two sets
3. score = round((overlap / modelAnswerWords) * 100)
4. Clamped between 45 (minimum) and 100 (maximum)
5. Feedback:
   - ≥ 80% → "Strong answer"
   - ≥ 60% → "Good effort"
   - < 60% → "Needs more depth"
```

---

## Document Study Generator

The Documents page (`/documents`) has two main sections:

### 1. Document Library

- Upload PDF, DOCX, or TXT files (max 10 MB)
- Files are stored as metadata in `localStorage` (not as binary data)
- Filter by subject, search by name
- Delete documents with confirmation

### 2. AI Study Material Generator

Paste notes or upload a `.txt` file, then generate:

| Tab | Output |
|---|---|
| Summary | A paragraph summarizing the topic in the selected language |
| Key Points | Up to 4 numbered sentences extracted from the input |
| MCQs | 3 multiple-choice questions with answers |
| Viva Questions | 4 open-ended viva prompts |
| Flashcards | 4 front/back cards based on keywords from the input |

**Inputs:**
- Subject (dropdown from existing documents)
- Topic (free text)
- Notes (textarea — paste lecture notes or textbook content)
- Difficulty: Beginner / Intermediate / Advanced
- Language: English / Urdu / Hindi
- Optional file upload (`.txt` content is auto-read into the notes field)

---

## Scripts

### Root (`/`)

```bash
npm run dev          # Start frontend with --host 0.0.0.0
npm run start        # Install client deps then start frontend
npm run run-app      # Same as dev
npm run install-client  # Install client dependencies only
```

### Backend (`/backend`)

```bash
npm run dev          # node --watch server.js (auto-restart on file changes)
npm run start        # node server.js (no watch)
```

### Frontend (`/client`)

```bash
npm run dev          # Start Vite dev server on http://localhost:5173
npm run build        # Production build to /dist
npm run preview      # Preview production build locally
npm run lint         # Run oxlint on all source files
```

At the project root, `npm start`, `npm run dev`, and `npm run run-app` all start the full application. Pass `--no-open` to keep the browser closed (for example, `run-project.bat --no-open`).

---

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request against `main`

---

## License

This project is open source. Built for smarter learning.

© 2026 VivaMate AI — [github.com/FarmanKhan898/VivaMate-AI](https://github.com/FarmanKhan898/VivaMate-AI)
