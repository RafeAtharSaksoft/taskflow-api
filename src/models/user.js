const bcrypt = require('bcryptjs');

const BCRYPT_ROUNDS = 12;

// In-memory user store — fine for the demo, not for production.
const users = [];
let nextId = 1;

async function create({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = { id: nextId++, email: normalizedEmail, password: hash };
  users.push(user);
  return user;
}

function findByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();
  return users.find(u => u.email === normalizedEmail) || null;
}

function findById(id) {
  return users.find(u => u.id === Number(id)) || null;
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

module.exports = { create, findByEmail, findById, verifyPassword, _users: users };
