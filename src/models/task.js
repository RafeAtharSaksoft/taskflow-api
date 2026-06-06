// In-memory task store.
const tasks = [];
let nextId = 1;

const ALLOWED_UPDATE_FIELDS = new Set(['title', 'description', 'done']);

function list() {
  return tasks;
}

function listByUser(userId) {
  return tasks.filter(t => t.userId === Number(userId));
}

function create({ title, description, userId }) {
  const task = {
    id: nextId++,
    title,
    description,
    done: false,
    userId,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function findById(id) {
  return tasks.find(t => t.id === Number(id)) || null;
}

function update(id, patch) {
  const task = findById(id);
  if (!task) return null;
  for (const key of Object.keys(patch)) {
    if (ALLOWED_UPDATE_FIELDS.has(key)) {
      task[key] = patch[key];
    }
  }
  return task;
}

function remove(id) {
  const idx = tasks.findIndex(t => t.id === Number(id));
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}

module.exports = { list, listByUser, create, findById, update, remove, _tasks: tasks };
