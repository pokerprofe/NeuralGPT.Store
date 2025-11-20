const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'database');
const STORE_DIR = path.join(__dirname, '..', 'products');

function readJson(file, fallback) {
  const p = path.join(STORE_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return fallback; }
}

function readClicks() {
  const p = path.join(DATA_DIR, 'store_clicks.json');
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return []; }
}

function writeClicks(data) {
  const p = path.join(DATA_DIR, 'store_clicks.json');
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = function(app) {
  console.log('[store] Store module loaded.');

  // LIST PRODUCTS
  app.get('/api/store/list', (req, res) => {
    const products = readJson('store.json', []);
    res.json({ ok: true, products });
  });

  // REGISTER CLICKS FOR COMMISSIONS
  app.post('/api/store/click', (req, res) => {
    const body = req.body || {};
    const productId = body.productId;
    const email = body.email || 'anonymous';

    if (!productId) {
      return res.status(400).json({ ok: false, message: 'Missing productId' });
    }

    const clicks = readClicks();
    clicks.push({
      id: Date.now(),
      productId,
      email,
      ts: new Date().toISOString()
    });

    writeClicks(clicks);
    res.json({ ok: true });
  });

  console.log('[store] Routes ready at /api/store/*');
};
