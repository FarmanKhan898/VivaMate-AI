# VivaMate AI

> Your intelligent academic companion — study smarter, achieve more.

VivaMate AI is a full-stack student productivity platform that combines course management, task tracking, quizzes, document storage, and an AI-powered study assistant into one unified workspace.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (One Click)](#quick-start-one-click)
  - [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [Authentication](#authentication)
- [Database](#database)
- [AI Assistant](#ai-assistant)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

VivaMate AI is designed for students who want to manage their entire academic life in one place. It provides a clean, modern dashboard to track study hours, manage tasks, organize courses, take quizzes, store documents, and interact with an AI study assistant — all behind a secure JWT-authenticated system.

---

## Features

| Feature | Description |
|---|---|
| Smart Dashboard | View study hours, task completion, weekly progress, and upcoming deadlines at a glance |
| AI Learning Assistant | Chat-based assistant that answers questions on programming, data science, study planning, and more |
| Course Management | Add and organize subjects with name, description, and difficulty level |
| Task Management | Create, track, and complete academic assignments and responsibilities |
| Quiz System | Practice quizzes to test and reinforce your knowledge |
| Document Storage | Upload and manage study documents and notes |
| Session History | Review past study sessions and activity |
| User Profile | Manage your student profile and account settings |
| Protected Routes | All dashboard pages are secured and require authentication |
| Persistent Chat | AI conversation history is saved to localStorage across sessions |

---

## Tech Stack

### Frontend
- **React 19** — UI library with functional components and hooks
- **React Router DOM v7** — Client-side routing with protected route support
- **Axios** — HTTP client for API communication
- **Vite 8** — Fast development server and build tool
- **Tailwind CSS v4** — Utility-first CSS framework
- **Framer Motion** — Animations and transitions
- **Lucide React** — Icon library
- **React Hot Toast** — Toast notifications
- **oxlint** — Fast JavaScript/JSX linter

### Backend
- **Node.js** — JavaScript runtime
- **Express.js v4** — Web framework for REST API
- **MongoDB + Mongoose** — Database and ODM (optional, falls back to in-memory)
- **JWT (jsonwebtoken)** — Stateless authentication tokens
- **bcryptjs** — Password hashing
- **dotenv** — Environment variable management
- **CORS** — Cross-origin resource sharing

---

## Project Structure

```
VivaMate-AI/
├── backend/                    # Express.js REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection (with in-memory fallback)
│   ├── data/
│   │   └── store.js            # In-memory data store
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # Mongoose User schema
│   │   └── Subject.js          # Mongoose Subject schema
│   ├── utils/
│   │   └── jwt.js              # Token generation and verification
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Main Express server and all API routes
│
├── client/                     # React + Vite frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/             # Static images and SVGs
│   │   ├── components/
│   │   │   ├── Layout.jsx      # Shared app layout (sidebar/navbar)
│   │   │   └── ProtectedRoute.jsx  # Auth guard for private pages
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Public landing page
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Registration page
│   │   │   ├── Dashboard.jsx   # Main student dashboard
│   │   │   ├── Courses.jsx     # Course/subject management
│   │   │   ├── Tasks.jsx       # Task management
│   │   │   ├── Quizzes.jsx     # Quiz practice
│   │   │   ├── Assistant.jsx   # AI chat assistant
│   │   │   ├── Documents.jsx   # Document storage
│   │   │   ├── History.jsx     # Study session history
│   │   │   └── Profile.jsx     # User profile settings
│   │   ├── utils/
│   │   │   ├── session.js      # Auth session helpers
│   │   │   └── vivaData.js     # Static/mock data utilities
│   │   ├── api.js              # Axios API client configuration
│   │   ├── App.jsx             # Root component with all routes
│   │   ├── App.css             # Global component styles
│   │   ├── index.css           # Base styles
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── run-project.bat             # One-click launcher for Windows
├── run-project.sh              # One-click launcher for macOS/Linux
└── package.json                # Root scripts
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- (Optional) [MongoDB](https://www.mongodb.com/) — the app runs without it using in-memory storage

Verify your installation:
```bash
node --version
npm --version
```

---

### Quick Start (One Click)

#### Windows
Double-click `run-project.bat` in the project root.

This will automatically:
1. Open a terminal for the backend and run `npm install && npm run dev`
2. Open a terminal for the frontend and run `npm install && npm run dev`
3. The app will be available at **http://localhost:5173/**

#### macOS / Linux
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

#### 2. Set up the backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Backend runs at: **http://localhost:5000**

#### 3. Set up the frontend (new terminal)
```bash
cd client
npm install
npm run dev -- --host 0.0.0.0
```
Frontend runs at: **http://localhost:5173**

---

## Environment Variables

Create a `.env` file inside the `backend/` folder based on `.env.example`:

```env
PORT=5000
JWT_SECRET=vivamate-super-secret-key
MONGO_URI=mongodb://localhost:27017/vivamate-ai
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port for the Express server (default: `5000`) |
| `JWT_SECRET` | Yes | Secret key used to sign and verify JWT tokens |
| `MONGO_URI` | No | MongoDB connection string. If omitted, the app uses in-memory storage |

> **Important:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## API Reference

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive a JWT token |

#### POST `/api/auth/signup`
```json
// Request body
{
  "name": "Farman Khan",
  "email": "farman@example.com",
  "password": "yourpassword"
}

// Response 201
{
  "token": "<jwt_token>",
  "user": { "id": "...", "name": "Farman Khan", "email": "farman@example.com" }
}
```

#### POST `/api/auth/login`
```json
// Request body
{
  "email": "farman@example.com",
  "password": "yourpassword"
}

// Response 200
{
  "token": "<jwt_token>",
  "user": { "id": "...", "name": "Farman Khan", "email": "farman@example.com" }
}
```

---

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profile` | Yes | Get the authenticated user's profile |

---

### Subjects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/subjects` | Yes | Get all subjects for the authenticated user |
| `POST` | `/api/subjects` | Yes | Create a new subject |

#### POST `/api/subjects`
```json
// Request body
{
  "name": "Data Structures",
  "description": "Arrays, trees, graphs and more",
  "level": "Intermediate"
}
// level options: "Beginner" | "Intermediate" | "Advanced"
```

---

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Check if the API is running |
| `GET` | `/api/health-check` | No | Alternate health check endpoint |

---

## Pages & Routes

### Public Routes
| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page with features, workflow, and CTA |
| `/login` | Login | User login form |
| `/signup` | Signup | New user registration form |

### Protected Routes (require login)
| Path | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Overview of study stats, tasks, and progress |
| `/courses` | Courses | Manage subjects and course materials |
| `/tasks` | Tasks | Create and track academic tasks |
| `/quizzes` | Quizzes | Practice quizzes and self-assessment |
| `/assistant` | Assistant | AI-powered study chat assistant |
| `/documents` | Documents | Upload and manage study documents |
| `/profile` | Profile | View and edit user profile |

All unmatched routes redirect to `/`.

---

## Authentication

VivaMate AI uses **JWT (JSON Web Tokens)** for stateless authentication.

- On login or signup, the server returns a signed JWT valid for **7 days**
- The token is stored client-side (via `session.js` utility)
- All protected API calls include the token as `Authorization: Bearer <token>`
- The `authMiddleware` on the backend verifies the token on every protected request
- The `ProtectedRoute` component on the frontend redirects unauthenticated users to `/login`

Token payload structure:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1235172690
}
```

---

## Database

VivaMate AI supports two storage modes:

### MongoDB Mode (Recommended for production)
Set `MONGO_URI` in your `.env` file. The app will connect to MongoDB and persist all user and subject data using Mongoose models.

**User Schema:**
```
name        String  (required, trimmed)
email       String  (required, unique, lowercase)
password    String  (required, bcrypt hashed)
createdAt   Date    (auto)
updatedAt   Date    (auto)
```

**Subject Schema:**
```
userId      ObjectId  (ref: User, required)
name        String    (required, trimmed)
description String    (default: '')
level       String    (enum: Beginner | Intermediate | Advanced)
createdAt   Date      (auto)
updatedAt   Date      (auto)
```

### In-Memory Mode (Default / fallback)
If `MONGO_URI` is not set or the MongoDB connection fails, the app automatically falls back to an in-memory store (`data/store.js`). Data is lost when the server restarts. This is useful for quick local development without needing MongoDB installed.

---

## AI Assistant

The AI assistant (`/assistant`) is a built-in rule-based chat system that responds to student questions.

**Supported topics:**
- Machine Learning concepts
- Study schedules and planning (Pomodoro technique)
- React and JavaScript
- Data Structures and Algorithms (DSA)
- Exam and quiz preparation
- General academic guidance

**How it works:**
1. User types a question in the chat input
2. The frontend matches keywords in the message against predefined response rules
3. A simulated typing delay of ~900ms is applied for a natural feel
4. The AI response is displayed in the chat
5. The full conversation is persisted in `localStorage` under the key `vivaMateChatMessages`
6. Users can clear the conversation at any time via the "Clear conversation" button

**Quick Prompts** available in the sidebar:
- Explain machine learning
- Create a study plan
- What is React?
- Explain data structures

---

## Scripts

### Root
```bash
npm run dev          # Start the frontend (client) with host 0.0.0.0
npm run start        # Install client deps and start frontend
```

### Backend (`/backend`)
```bash
npm run dev          # Start backend with --watch (auto-restart on changes)
npm run start        # Start backend without watch mode
```

### Frontend (`/client`)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run oxlint linter
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is open source. Built for smarter learning. © 2026 VivaMate AI.
