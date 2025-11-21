const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'database');
const SYSTEM_DIR = path.join(__dirname, '..', '.system');
const ENC_FILE = path.join(DATA_DIR, 'payout.enc');
const KEY_FILE = path.join(SYSTEM_DIR, 'payout_key.txt');

// Same master password as admin panel
const MASTER_PASSWORD = 'Prozerg1@#';

function loadKey() {
  if (!fs.existsSync(KEY_FILE)) {
    throw new Error('[payout] Missing key file');
  }
  const hex = fs.readFileSync(KEY_FILE, 'utf8').trim();
  return Buffer.from(hex, 'hex');
}

function encryptPayload(payloadObj) {
  const key = loadKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  const json = JSON.stringify(payloadObj);
  const enc = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    data: enc.toString('hex'),
    hasData: true
  };
}

function decryptPayload() {
  if (!fs.existsSync(ENC_FILE)) return null;
  let raw = fs.readFileSync(ENC_FILE, 'utf8') || '{}';
  let obj = {};
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!obj.hasData) return null;
  const key = loadKey();
  const iv = Buffer.from(obj.iv, 'hex');
  const enc = Buffer.from(obj.data, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  try {
    return JSON.parse(dec.toString('utf8'));
  } catch {
    return null;
  }
}

function requirePayoutAdmin(req, res, next) {
  const body = req.body || {};
  const pass =
    body.adminPassword ||
    req.headers['x-admin-password'] ||
    (req.query && req.query.adminPassword);

  if (pass !== MASTER_PASSWORD) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  next();
}

module.exports = function(app) {
  console.log('[payout] Payout module loaded.');

  // Save IBAN (encrypted)
  app.post('/api/payout/save', requirePayoutAdmin, (req, res) => {
    const body = req.body || {};
    const iban = String(body.iban || '').trim();
    const note = String(body.note || '').trim();

    if (!iban) {
      return res.status(400).json({ ok: false, message: 'IBAN is required' });
    }
    if (iban.length > 64) {
      return res
        .status(400)
        .json({ ok: false, message: 'IBAN too long. Please check.' });
    }

    const payload = {
      iban,
      note,
      updatedAt: new Date().toISOString()
    };

    const encrypted = encryptPayload(payload);
    fs.writeFileSync(ENC_FILE, JSON.stringify(encrypted, null, 2), 'utf8');

    res.json({ ok: true, message: 'Payout data stored securely.' });
  });

  // Get IBAN (full, for owner)
  app.post('/api/payout/get', requirePayoutAdmin, (req, res) => {
    const payload = decryptPayload();
    if (!payload) {
      return res.json({ ok: true, hasData: false });
    }
    const masked =
      payload.iban.length > 8
        ? payload.iban.substring(0, 4) +
          ' **** **** ' +
          payload.iban.substring(payload.iban.length - 4)
        : payload.iban;

    res.json({
      ok: true,
      hasData: true,
      iban: payload.iban,
      ibanMasked: masked,
      note: payload.note || '',
      updatedAt: payload.updatedAt || null
    });
  });

  console.log('[payout] Routes ready at /api/payout/*');
};
