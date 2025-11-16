require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

// AUTH
const { newSession } = require("./auth.js");
const authModule = require("./auth.js");

// OAUTH GOOGLE
const oauthModule = require("./oauth_google.js");

// reCAPTCHA
const recaptcha = require("./recaptcha")(process.env.RECAPTCHA_SECRET_KEY || "");
async function verifyRecaptchaToken(token) {
  try {
    return await recaptcha.verify(token);
  } catch (err) {
    console.error("[reCAPTCHA ERROR]", err);
    return false;
  }
}

function requireCaptcha(req) {
  return (req.body && (req.body.recaptcha || req.body["g-recaptcha-response"])) || "";
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public_html")));

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Load auth
authModule(app);

// reCAPTCHA protected AUTH routes
app.post("/api/auth/register", async (req, res) => {
  const token = requireCaptcha(req);
  const ok = await verifyRecaptchaToken(token);
  if (!ok) {
    return res.status(401).json({ ok: false, message: "reCAPTCHA failed" });
  }
  return require("./auth.js").register(req, res);
});

app.post("/api/auth/login", async (req, res) => {
  const token = requireCaptcha(req);
  const ok = await verifyRecaptchaToken(token);
  if (!ok) {
    return res.status(401).json({ ok: false, message: "reCAPTCHA failed" });
  }
  return require("./auth.js").login(req, res);
});

// Load OAuth
oauthModule(app, newSession);

// TEST endpoint
app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    service: "NeuralGPT.Store backend",
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "..", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
