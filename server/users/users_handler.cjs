const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const file = path.join(__dirname, 'users.json');

// Leer usuarios
function loadUsers() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

// Guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
}

// Crear hash simple (sin bcrypt todavía)
function hashPass(pass) {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

// Registrar usuario
function registerUser(data) {
  const users = loadUsers();
  if (users.find(u => u.email === data.email)) return { ok:false, msg:'Usuario ya existe' };

  const id = crypto.randomUUID();
  users.push({
    id,
    email: data.email,
    pass: hashPass(data.pass),
    role: data.role || 'client',
    created: Date.now()
  });

  saveUsers(users);
  return { ok:true, id };
}

// Login usuario
function loginUser(email, pass) {
  const users = loadUsers();
  const hash = hashPass(pass);
  const u = users.find(x => x.email === email && x.pass === hash);
  if (!u) return { ok:false };

  return { ok:true, id:u.id, role:u.role };
}

module.exports = { registerUser, loginUser, loadUsers };
