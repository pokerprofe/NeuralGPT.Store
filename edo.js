const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'database', 'edo_users.json');
const MASTER = 'Prozerg1@#';

function loadUsers() {
  if (!fs.existsSync(DATA)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA, 'utf8'));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(DATA, JSON.stringify(users, null, 2), 'utf8');
}

module.exports = function(app) {
  console.log('[edo] EDO subscription module loaded.');

  // 1) CHECK EDO STATUS
  app.post('/api/edo/check', (req, res) => {
    const email = (req.body && req.body.email || '').trim().toLowerCase();
    if (!email) return res.json({ ok: false, isEDO: false });

    const users = loadUsers();
    const u = users.find(x => x.email === email);
    if (!u) return res.json({ ok: true, isEDO: false });

    const now = Date.now();
    const exp = new Date(u.expiresAt).getTime();

    if (exp > now) {
      return res.json({ ok: true, isEDO: true, expiresAt: u.expiresAt });
    }

    return res.json({ ok: true, isEDO: false });
  });

  // 2) SET EDO (ADMIN ONLY)
  app.post('/api/edo/set', (req, res) => {
    const pass = req.body && req.body.adminPassword;
    if (pass !== MASTER) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    const emailRaw = req.body.email || '';
    const email = emailRaw.trim().toLowerCase();
    if (!email) return res.json({ ok: false, message: 'Missing email' });

    const users = loadUsers();
    const now = new Date();
    const exp = new Date(now.getTime() + 365 * 24 * 3600 * 1000);

    let u = users.find(x => x.email === email);
    if (!u) {
      users.push({
        email,
        createdAt: now.toISOString(),
        expiresAt: exp.toISOString()
      });
    } else {
      u.expiresAt = exp.toISOString();
    }

    saveUsers(users);

    return res.json({
      ok: true,
      message: 'EDO subscription activated for 1 year.',
      email,
      expiresAt: exp.toISOString()
    });
  });

  // 3) LIST USERS (admin)
  app.post('/api/edo/list', (req, res) => {
    const pass = req.body && req.body.adminPassword;
    if (pass !== MASTER) {
      return res.status(401).json({ ok: false });
    }

    const users = loadUsers();
    res.json({ ok: true, users });
  });

  console.log('[edo] Routes ready at /api/edo/*');
};
