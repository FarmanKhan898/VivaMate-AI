# VivaMate-AI

An AI-powered study companion for students. It combines a React frontend with a Node.js/Express backend and MongoDB to help manage courses, tasks, quizzes, mock vivas, and documents — all behind a secure JWT-authenticated account.

---

## How It Works

### Architecture

```
client/          React 19 + Vite (runs on http://localhost:5173)
backend/         Express + Mongoose (runs on http://localhost:5000)
MongoDB          Local or remote database (default: mongodb://localhost:27017/vivamate-ai)
```

The frontend talks to the backend via Axios (`client/src/api.js`). Every request to a protected endpoint includes a JWT stored in the browser. The backend validates the token using middleware (`backend/middleware/auth.js`) before allowing access.

### Authentication Flow

1. User signs up or logs in at `/signup` or `/login`.
2. Backend hashes the password with bcryptjs, stores the user in MongoDB, and returns a JWT.
3. The JWT is saved client-side and attached to all subsequent API requests.
4. Protected routes (`/dashboard`, `/courses`, etc.) are wrapped in `ProtectedRoute` — unauthenticated users are redirected to `/login`.

### Features & Pages

| Page | Route | What it does |
|---|---|---|
| Home | `/` | Landing page |
| Dashboard | `/dashboard` | Overview of activity and stats |
| Courses | `/courses` | Add and manage subjects (Beginner / Intermediate / Advanced) |
| Documents | `/documents` | Upload and view study documents |
| Tasks | `/tasks` | Create tasks with title, course, due date, priority, and status |
| Quizzes | `/quizzes` | Take AI-generated quizzes and mock vivas |
| History | `/history` | View past quiz and viva attempts with scores |
| Assistant | `/assistant` | AI chat assistant for study help |
| Profile | `/profile` | View and update account details |

### Data Models

- **User** — name, email, hashed password
- **Subject** — linked to a user; name, description, level
- **Task** — title, course, description, due date, priority (Low/Medium/High), status (Pending/Completed)
- **QuizAttempt** — subject, activity type (Quiz or Mock Viva), overall score, per-question answers and scores

---

## Setup

### Prerequisites

- Node.js 20.19+ or 22.12+ (or let the launcher download it automatically)
- MongoDB running locally, or a MongoDB Atlas connection string

### Environment Variables

Copy `backend/.env.example` to `backend/.env`, set `MONGO_URI` to a running local MongoDB server or Atlas deployment, and replace the sample `JWT_SECRET` with a private random secret of at least 32 characters:

```
PORT=5000
JWT_SECRET=replace-with-a-private-random-secret-at-least-32-characters-long
MONGO_URI=mongodb://127.0.0.1:27017/vivamate-ai
MONGO_SERVER_SELECTION_TIMEOUT_MS=10000
```

---

## Run the Project

### One-click launcher (downloads Node.js automatically if missing)

**Windows** — double-click `run-project.bat`

**macOS / Linux:**
```bash
chmod +x run-project.sh
./run-project.sh
```

### Manual

Install dependencies once:
```bash
npm --prefix backend install
npm --prefix client install
```

Start both services in separate terminals:
```bash
npm --prefix backend run dev
npm --prefix client run dev -- --host 0.0.0.0
```

The app is available at **http://localhost:5173**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Axios, Vite |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Linting | oxlint |
