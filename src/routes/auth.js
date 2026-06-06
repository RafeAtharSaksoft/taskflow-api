const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

const TOKEN_EXPIRY = '7d';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email format' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'password must be at least 8 characters' });
  }

  const existing = User.findByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'email already registered' });
  }

  const user = await User.create({ email, password });
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: TOKEN_EXPIRY });
  res.status(201).json({ id: user.id, email: user.email, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = User.findByEmail(email);
  if (!user) {
    // Use the same status and message for both missing user and wrong password to prevent user enumeration.
    return res.status(401).json({ error: 'invalid email or password' });
  }

  const ok = await User.verifyPassword(user, password);
  if (!ok) {
    return res.status(401).json({ error: 'invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: TOKEN_EXPIRY });
  res.json({ id: user.id, email: user.email, token });
});

module.exports = router;
