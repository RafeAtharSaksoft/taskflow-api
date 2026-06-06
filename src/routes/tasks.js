const express = require('express');
const Task = require('../models/task');
const authenticate = require('../middleware/auth');

const router = express.Router();

const TITLE_MAX_LENGTH = 500;

router.use(authenticate);

router.get('/', (req, res) => {
  const tasks = Task.listByUser(req.user.id);
  res.json(tasks);
});

router.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return res.status(400).json({ error: `title must be at most ${TITLE_MAX_LENGTH} characters` });
  }

  const task = Task.create({ title: title.trim(), description, userId: req.user.id });
  res.status(201).json(task);
});

router.get('/:id', (req, res) => {
  const task = Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'not found' });
  }
  if (task.userId !== req.user.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  res.json(task);
});

router.put('/:id', (req, res) => {
  const task = Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'not found' });
  }
  if (task.userId !== req.user.id) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { title, description, done } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
    if (title.length > TITLE_MAX_LENGTH) {
      return res.status(400).json({ error: `title must be at most ${TITLE_MAX_LENGTH} characters` });
    }
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'done must be a boolean' });
  }

  const updated = Task.update(req.params.id, { title: title && title.trim(), description, done });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const task = Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'not found' });
  }
  if (task.userId !== req.user.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  Task.remove(req.params.id);
  res.status(204).end();
});

module.exports = router;
