const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'database');
const USERS_FILE = 'users.json';
const CHAT_FILE = 'chatlog.json';
const STATS_FILE = 'stats.json';
const MODELS_FILE = 'agents.json';

function read(file, fallback) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return fallback; }
}

module.exports = function(app) {
  console.log('[stats] Stats module loaded.');

  app.get('/api/stats/overview', (req, res) => {
    const stats = read(STATS_FILE, {});
    res.json({ ok: true, stats });
  });

  app.get('/api/stats/users', (req, res) => {
    const users = read(USERS_FILE, []);
    res.json({
      ok: true,
      count: users.length,
      active: users.filter(u => u.status !== 'deleted').length
    });
  });

  app.get('/api/stats/chat', (req, res) => {
    const chat = read(CHAT_FILE, []);
    res.json({
      ok: true,
      messages: chat.length
    });
  });

  app.get('/api/stats/models', (req, res) => {
    const models = read(MODELS_FILE, []);
    res.json({
      ok: true,
      total: models.length,
      featured: models.filter(m => m.isFeatured).length
    });
  });

  console.log('[stats] Routes ready at /api/stats/*');
};
