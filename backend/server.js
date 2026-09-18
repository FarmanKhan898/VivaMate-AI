import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './config/db.js';
import { authMiddleware } from './middleware/auth.js';
import User from './models/User.js';
import Subject from './models/Subject.js';
import { generateToken } from './utils/jwt.js';
import { memoryStore } from './data/store.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'VivaMate API is running.' });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const emailLower = email.toLowerCase();

    const existingUser = memoryStore.users.find((user) => user.email === emailLower)
      || (await User.findOne({ email: emailLower }).catch(() => null));

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      _id: Date.now().toString(),
      name,
      email: emailLower,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    memoryStore.users.push(user);

    const createdUser = await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
    }).catch(() => null);

    const finalUser = createdUser || user;

    return res.status(201).json({
      token: generateToken(finalUser),
      user: {
        id: finalUser._id,
        name: finalUser.name,
        email: finalUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed.', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const emailLower = email.toLowerCase();

    const user = memoryStore.users.find((item) => item.email === emailLower)
      || (await User.findOne({ email: emailLower }).catch(() => null));

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    return res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = memoryStore.users.find((item) => item._id === req.user.id)
      || await User.findById(req.user.id).catch(() => null);

    if (!user) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

app.get('/api/subjects', authMiddleware, async (req, res) => {
  try {
    const userSubjects = memoryStore.subjects.filter((item) => item.userId === req.user.id);
    return res.json({ subjects: userSubjects });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch subjects.' });
  }
});

app.post('/api/subjects', authMiddleware, async (req, res) => {
  try {
    const { name, description, level } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Subject name is required.' });
    }

    const subject = {
      id: Date.now().toString(),
      userId: req.user.id,
      name,
      description: description || '',
      level: level || 'Beginner',
      createdAt: new Date().toISOString(),
    };

    memoryStore.subjects.push(subject);

    return res.status(201).json({ subject });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create subject.' });
  }
});

app.get('/api/health-check', (req, res) => {
  res.json({ ok: true, environment: 'backend-ready' });
});

connectDB();

app.listen(PORT, () => {
  console.log(`VivaMate backend running on http://localhost:${PORT}`);
});
