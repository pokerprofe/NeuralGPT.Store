const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA = path.join(__dirname, '..', 'database', 'sellers.enc');
const KEY = path.join(__dirname, '..', '.system', 'seller_key.txt');

const MASTER = 'Prozerg1@#';
const REF_CODE = 'neuralGPT.store';

function loadKey() {
  const hex = fs.readFileSync(KEY, 'utf8').trim();
  return Buffer.from(hex, 'hex');
}

function decryptFile() {
  if (!fs.existsSync(DATA)) return { messages: [] };
  const raw = fs.readFileSync(DATA, 'utf8') || '{}';
  const obj = JSON.parse(raw);
  if (!obj.iv) return { messages: [] };
  const key = loadKey();
  const iv = Buffer.from(obj.iv, 'hex');
  const enc = Buffer.from(obj.data, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(dec.toString('utf8'));
}

function encryptFile(json) {
  const key = loadKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  const raw = JSON.stringify(json);
  const enc = Buffer.concat([cipher.update(raw, 'utf8'), cipher.final()]);
  const obj = {
    iv: iv.toString('hex'),
    data: enc.toString('hex')
  };
  fs.writeFileSync(DATA, JSON.stringify(obj, null, 2), 'utf8');
}

module.exports = function(app) {
  console.log('[sellers] Seller contact module active.');

  // Anti-bot honeypot field: “companyUrl”
  // If filled → bot detected → ignore silently.

  app.post('/api/sellers/contact', (req, res) => {
    const body = req.body || {};

    if (body.companyUrl && String(body.companyUrl).trim() !== '') {
      return res.json({ ok: true });
    }

    const seller = {
      id: Date.now(),
      ref: REF_CODE,
      vendor: body.vendor || 'Unknown',
      email: body.email || 'noemail',
      msg: body.msg || '',
      ts: new Date().toISOString()
    };

    const db = decryptFile();
    db.messages.push(seller);
    encryptFile(db);

    res.json({ ok: true, stored: true });
  });

  app.post('/api/sellers/list', (req, res) => {
    if ((req.body && req.body.adminPassword) !== MASTER) {
      return res.status(401).json({ ok: false });
    }
    const db = decryptFile();
    res.json({ ok: true, messages: db.messages });
  });
};
