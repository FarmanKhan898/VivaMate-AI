import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import { authMiddleware } from './middleware/auth.js';
import QuizAttempt from './models/QuizAttempt.js';
import Subject from './models/Subject.js';
import Task from './models/Task.js';
import User from './models/User.js';
import { generateToken } from './utils/jwt.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function serverError(res, message, error) {
  console.error(message, error);
  return res.status(500).json({ message });
}

function isDuplicateKey(error) {
  return error?.code === 11000;
}

app.get('/api/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    ok: connected,
    database: connected ? 'connected' : 'disconnected',
    message: connected ? 'VivaMate API and database are ready.' : 'MongoDB is not connected.',
  });
});

app.post('/api/auth/signup', async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!name || name.length > 100 || !emailPattern.test(email) || password.length < 6 || password.length > 128) {
    return res.status(400).json({ message: 'Enter a valid name and email, and a password between 6 and 128 characters.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: passwordHash });
    return res.status(201).json({
      token: generateToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (isDuplicateKey(error)) return res.status(409).json({ message: 'An account with this email already exists.' });
    if (error.name === 'ValidationError') return res.status(400).json({ message: 'Account information is invalid.' });
    return serverError(res, 'Signup failed.', error);
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const user = await User.findOne({ email }).select('+password');
    const validPassword = user && await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Email or password is incorrect.' });

    return res.json({
      token: generateToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return serverError(res, 'Login failed.', error);
  }
});

app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email');
    if (!user) return res.status(404).json({ message: 'Profile not found.' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return serverError(res, 'Failed to fetch profile.', error);
  }
});

app.get('/api/subjects', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ subjects: subjects.map((subject) => subject.toJSON()) });
  } catch (error) {
    return serverError(res, 'Failed to fetch subjects.', error);
  }
});

app.post('/api/subjects', authMiddleware, async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
  const level = req.body.level || 'Beginner';
  if (!name) return res.status(400).json({ message: 'Subject name is required.' });

  try {
    const subject = await Subject.create({ userId: req.user.id, name, description, level });
    return res.status(201).json({ subject: subject.toJSON() });
  } catch (error) {
    if (isDuplicateKey(error)) return res.status(409).json({ message: 'This subject already exists in your library.' });
    if (error.name === 'ValidationError') return res.status(400).json({ message: 'Subject information is invalid.' });
    return serverError(res, 'Failed to create subject.', error);
  }
});

app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1, createdAt: -1 });
    return res.json({ tasks: tasks.map((task) => ({ ...task.toJSON(), id: task.id })) });
  } catch (error) {
    return serverError(res, 'Failed to fetch tasks.', error);
  }
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    return res.status(201).json({ task: { ...task.toJSON(), id: task.id } });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: 'Task information is invalid.' });
    return serverError(res, 'Failed to create task.', error);
  }
});

app.patch('/api/tasks/:id', authMiddleware, async (req, res) => {
  const allowedFields = ['title', 'course', 'description', 'dueDate', 'priority', 'status'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    return res.json({ task: { ...task.toJSON(), id: task.id } });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: 'Task update is invalid.' });
    return serverError(res, 'Failed to update task.', error);
  }
});

app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    return res.status(204).end();
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Task id is invalid.' });
    return serverError(res, 'Failed to delete task.', error);
  }
});

app.get('/api/quiz-history', authMiddleware, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id }).sort({ completedAt: -1 }).limit(100);
    return res.json({ history: attempts.map((attempt) => ({ ...attempt.toJSON(), id: attempt.id, date: attempt.completedAt })) });
  } catch (error) {
    return serverError(res, 'Failed to fetch quiz history.', error);
  }
});

app.post('/api/quiz-history', authMiddleware, async (req, res) => {
  try {
    const attempt = await QuizAttempt.create({ ...req.body, userId: req.user.id });
    return res.status(201).json({ history: { ...attempt.toJSON(), id: attempt.id, date: attempt.completedAt } });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: 'Quiz result is invalid.' });
    return serverError(res, 'Failed to save quiz result.', error);
  }
});

app.get('/api/health-check', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  return res.status(connected ? 200 : 503).json({ ok: connected, environment: connected ? 'backend-ready' : 'database-disconnected' });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`VivaMate backend running on http://localhost:${PORT}`));
  } catch (error) {
    console.error(`Backend startup failed: ${error.message}`);
    process.exitCode = 1;
  }
}

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.disconnect();
  process.exit(0);
});

startServer();
