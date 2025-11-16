const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const fetch = require("node-fetch");

// === Paths ===
const DATA_DIR = path.join(__dirname, "..", "database");
const USERS_FILE = "users.json";

// === Sessions ===
const sessions = new Map();
const SESSION_TTL_MINUTES = 120;

// === Admins ===
const ADMIN_EMAILS = [];

// === reCAPTCHA ===
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";

// === Helpers ===
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir(DATA_DIR);

function readJson(file, fallback) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try {
    const raw = fs.readFileSync(p, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function newId() {
  return crypto.randomBytes(16).toString("hex");
}

function newSession(userId) {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MINUTES * 60 * 1000;
  sessions.set(token, { userId, expiresAt });
  return token;
}

function cleanupSessions() {
  const now = Date.now();
  for (const [token, info] of sessions.entries()) {
    if (!info || info.expiresAt <= now) sessions.delete(token);
  }
}

// === Verify reCAPTCHA ===
async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET_KEY) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });

    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("[reCAPTCHA] Error:", err);
    return false;
  }
}

// === Middleware (future protected routes) ===
function requireUser(req, res, next) {
  cleanupSessions();
  const token =
    req.headers["x-user-token"] ||
    (req.query && req.query.token) ||
    (req.body && req.body.token);

  if (!token || !sessions.has(token))
    return res.status(401).json({ ok: false, message: "Not authenticated" });

  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ ok: false, message: "Session expired" });
  }

  const users = readJson(USERS_FILE, []);
  const user = users.find((u) => u.id === session.userId);
  if (!user)
    return res.status(401).json({ ok: false, message: "User not found" });

  req.user = user;
  next();
}

// === Export routes ===
module.exports = function (app) {
  console.log("[auth] Routes loaded");

  // === Register ===
  app.post("/api/auth/register", async (req, res) => {
    const { email, nick, token } = req.body || {};

    if (!token)
      return res.status(400).json({ ok: false, message: "Missing token" });

    const valid = await verifyRecaptcha(token);
    if (!valid)
      return res.status(400).json({ ok: false, message: "Invalid reCAPTCHA" });

    if (!isValidEmail(email))
      return res.status(400).json({ ok: false, message: "Invalid email" });

    const users = readJson(USERS_FILE, []);
    if (users.find((u) => u.email === normalizeEmail(email)))
      return res.status(409).json({ ok: false, message: "Already registered" });

    const user = {
      id: newId(),
      email: normalizeEmail(email),
      nick: String(nick || "").trim().substring(0, 40),
      role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
      createdAt: new Date().toISOString(),
      status: "active"
    };

    users.push(user);
    writeJson(USERS_FILE, users);

    return res.json({ ok: true, user });
  });

  // === Login ===
  app.post("/api/auth/login", async (req, res) => {
    const { email, token } = req.body || {};

    if (!token)
      return res.status(400).json({ ok: false, message: "Missing token" });

    const valid = await verifyRecaptcha(token);
    if (!valid)
      return res.status(400).json({ ok: false, message: "Invalid reCAPTCHA" });

    if (!isValidEmail(email))
      return res.status(400).json({ ok: false, message: "Invalid email" });

    const users = readJson(USERS_FILE, []);
    const user = users.find((u) => u.email === normalizeEmail(email));

    if (!user)
      return res.status(404).json({ ok: false, message: "User not found" });

    const sessionToken = newSession(user.id);

    return res.json({
      ok: true,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        nick: user.nick,
        role: user.role
      },
      expiresInMinutes: SESSION_TTL_MINUTES
    });
  });

  // === Me ===
  app.get("/api/auth/me", requireUser, (req, res) => {
    res.json({ ok: true, user: req.user });
  });

  console.log("[auth] Ready at /api/auth/*");
};
