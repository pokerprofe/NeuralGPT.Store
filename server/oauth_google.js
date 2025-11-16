const { OAuth2Client } = require("google-auth-library");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "..", "database");
const USERS_FILE = "users.json";

function readJson(file, fallback) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

function newId() {
  return require("crypto").randomBytes(16).toString("hex");
}

module.exports = function (app, createSession) {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  );

  // STEP 1: Redirect to Google
  app.get("/oauth/google", (req, res) => {
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "select_account",
      scope: ["profile", "email"]
    });
    res.redirect(url);
  });

  // STEP 2: Google redirects back
  app.get("/oauth/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) return res.status(400).send("Missing code");

      const { tokens } = await client.getToken(code);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const email = String(payload.email || "").toLowerCase();
      const nick = payload.name || email.split("@")[0];

      let users = readJson(USERS_FILE, []);

      let user = users.find((u) => u.email === email);
      if (!user) {
        user = {
          id: newId(),
          email,
          nick,
          role: "user",
          createdAt: new Date().toISOString(),
          status: "active"
        };
        users.push(user);
        writeJson(USERS_FILE, users);
      }

      const token = createSession(user.id);

      return res.redirect(`/dashboard/index.html?token=${token}`);

    } catch (err) {
      console.error("[Google OAuth] ERROR:", err);
      return res.status(500).send("Google OAuth failed.");
    }
  });
};
