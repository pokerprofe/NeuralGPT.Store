const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "..", "database");
const USERS_FILE = "users.json";

// In-memory sessions (token -> { userId, expiresAt })
const sessions = new Map();

// Config
const SESSION_TTL_MINUTES = 120; // 2 hours
const ADMIN_EMAILS = [
  // Future: add your Google Business admin email here
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(DATA_DIR);

function readJson(file, fallback) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try {
    const raw = fs.readFileSync(p, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error("[auth] Failed to read JSON", file, err);
    return fallback;
  }
}

function writeJson(file, data) {
  const p = path.join(DATA_DIR, file);
  try {
    fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[auth] Failed to write JSON", file, err);
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeNick(nick) {
  return String(nick || "").trim().substring(0, 40);
}

function isValidEmail(email) {
  const e = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function newId() {
  return crypto.randomBytes(10).toString("hex");
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
    if (!info || info.expiresAt <= now) {
      sessions.delete(token);
    }
  }
}

// Middleware for protected routes (future use)
function requireUser(req, res, next) {
  cleanupSessions();
  const token =
    req.headers["x-user-token"] ||
    (req.query && req.query.token) ||
    (req.body && req.body.token);

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ ok: false, message: "User not authenticated" });
  }

  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ ok: false, message: "Session expired" });
  }

  const users = readJson(USERS_FILE, []);
  const user = users.find((u) => u.id === session.userId && u.status !== "deleted");
  if (!user) {
    return res.status(401).json({ ok: false, message: "User not found" });
  }

  req.user = {
    id: user.id,
    email: user.email,
    nick: user.nick,
    role: user.role || "user"
  };

  next();
}

module.exports = function (app) {
  console.log("[auth] Auth module loaded");

  // Public: register with email + nick (no password yet)
  app.post("/api/auth/register", (req, res) => {
    const body = req.body || {};
    const email = normalizeEmail(body.email);
    const nick = sanitizeNick(body.nick);

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid email address" });
    }
    if (!nick) {
      return res
        .status(400)
        .json({ ok: false, message: "Nick is required" });
    }

    const users = readJson(USERS_FILE, []);
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return res
        .status(409)
        .json({ ok: false, message: "User already registered. Please login." });
    }

    const user = {
      id: newId(),
      email,
      nick,
      role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
      status: "active",
      isVerified: false, // Future: email verification
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(user);
    writeJson(USERS_FILE, users);

    return res.json({
      ok: true,
      user: { id: user.id, email: user.email, nick: user.nick, role: user.role },
      info: "User registered. Email verification & payments can be configured later."
    });
  });

  // Public: login with email (no password yet, placeholder for magic link)
  app.post("/api/auth/login", (req, res) => {
    const body = req.body || {};
    const email = normalizeEmail(body.email);

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid email address" });
    }

    const users = readJson(USERS_FILE, []);
    const user = users.find((u) => u.email === email && u.status !== "deleted");

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "User not found. Please register first." });
    }

    const token = newSession(user.id);

    return res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        nick: user.nick,
        role: user.role || "user"
      },
      expiresInMinutes: SESSION_TTL_MINUTES
    });
  });

  // Protected: current user info
  app.get("/api/auth/me", requireUser, (req, res) => {
    return res.json({ ok: true, user: req.user });
  });

  // Expose middleware for future protected routes
  app.locals.requireUser = requireUser;

  console.log("[auth] Routes ready at /api/auth/*");
};
