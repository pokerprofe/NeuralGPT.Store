const fs = require('fs');
const path = require('path');

const MASTER = 'Prozerg1@#';
const CONFIG = path.join(__dirname, '..', '.system', 'edo_gpay_config.json');
const EDO_DB = path.join(__dirname, '..', 'database', 'edo_users.json');

function loadConfig() {
  if (!fs.existsSync(CONFIG)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  } catch {
    return null;
  }
}

function loadUsers() {
  if (!fs.existsSync(EDO_DB)) return [];
  try {
    return JSON.parse(fs.readFileSync(EDO_DB, 'utf8'));
  } catch {
    return [];
  }
}

function saveUsers(list) {
  fs.writeFileSync(EDO_DB, JSON.stringify(list, null, 2), 'utf8');
}

module.exports = function(app) {
  console.log('[edo_pay] EDO payment module loaded.');

  // Expose config for frontend (no secrets, just public info)
  app.get('/api/edo/pay/config', (req, res) => {
    const cfg = loadConfig();
    if (!cfg) return res.json({ ok: false });
    res.json({
      ok: true,
      environment: cfg.environment || 'TEST',
      merchantName: cfg.merchantName || 'NeuralGPT.Store',
      price: cfg.price || '50.00',
      currencyCode: cfg.currencyCode || 'EUR'
    });
  });

  // Local/manual activation endpoint (for tests, not real payment)
  app.post('/api/edo/pay/manual-activate', (req, res) => {
    const body = req.body || {};
    if (body.adminPassword !== MASTER) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }
    const email = String(body.email || '').trim().toLowerCase();
    if (!email) {
      return res.json({ ok: false, message: 'Missing email' });
    }

    const users = loadUsers();
    const now = new Date();
    const exp = new Date(now.getTime() + 365 * 24 * 3600 * 1000);

    let u = users.find(u => u.email === email);
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
      message: 'EDO activated manually for testing.',
      email,
      expiresAt: exp.toISOString()
    });
  });

  console.log('[edo_pay] Routes ready at /api/edo/pay/*');
};
