const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "..", "database");
const ADMIN_PASSWORD = "Prozerg1@#";

let adminToken = null;

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
    console.error("[admin] Failed to read JSON", file, err);
    return fallback;
  }
}

function writeJson(file, data) {
  const p = path.join(DATA_DIR, file);
  try {
    fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[admin] Failed to write JSON", file, err);
  }
}

function newId() {
  return crypto.randomBytes(8).toString("hex");
}

function requireAdmin(req, res, next) {
  if (!adminToken) {
    return res.status(401).json({ ok: false, message: "Admin not logged in" });
  }
  const token = req.headers["x-admin-token"];
  if (!token || token !== adminToken) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
  next();
}

module.exports = function (app) {
  console.log("[admin] Admin module loaded");

  // Login: returns session token if password is correct
  app.post("/api/admin/login", (req, res) => {
    const body = req.body || {};
    const password = body.password || "";
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ ok: false, message: "Invalid password" });
    }
    adminToken = crypto.randomBytes(32).toString("hex");
    return res.json({ ok: true, token: adminToken });
  });

  // Overview stats (simple, extendable)
  app.get("/api/admin/overview", requireAdmin, (req, res) => {
    const agents = readJson("agents.json", []);
    const ads = readJson("ads.json", []);
    const store = readJson("store.json", []);

    const overview = {
      ok: true,
      totals: {
        agents: agents.length,
        ads: ads.length,
        products: store.length,
        // placeholders for future metrics
        visitsToday: 0,
        visitsMonth: 0,
        salesMonth: 0,
        paymentsMonth: 0
      }
    };

    return res.json(overview);
  });

  // ----- Agents CRUD -----
  app.get("/api/admin/agents", requireAdmin, (req, res) => {
    const agents = readJson("agents.json", []);
    res.json({ ok: true, agents });
  });

  app.post("/api/admin/agents", requireAdmin, (req, res) => {
    const agents = readJson("agents.json", []);
    const body = req.body || {};
    const id = body.id || newId();

    const agent = {
      id,
      name: body.name || "Unnamed Agent",
      slug: body.slug || id,
      logoUrl: body.logoUrl || "",
      shortDescription: body.shortDescription || "",
      fullDescription: body.fullDescription || "",
      category: body.category || "General",
      isFeatured: !!body.isFeatured,
      isActive: body.isActive !== false,
      locked: body.locked !== false,          // true => link hidden behind paywall
      encryptedLink: body.encryptedLink || "", // future: encrypted URL
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = agents.findIndex(a => a.id === id);
    if (existingIndex >= 0) {
      agents[existingIndex] = agent;
    } else {
      agents.push(agent);
    }

    writeJson("agents.json", agents);
    res.json({ ok: true, agent });
  });

  app.delete("/api/admin/agents/:id", requireAdmin, (req, res) => {
    const id = req.params.id;
    let agents = readJson("agents.json", []);
    const before = agents.length;
    agents = agents.filter(a => a.id !== id);
    writeJson("agents.json", agents);
    res.json({ ok: true, removed: before - agents.length });
  });

  // ----- Ads CRUD -----
  app.get("/api/admin/ads", requireAdmin, (req, res) => {
    const ads = readJson("ads.json", []);
    res.json({ ok: true, ads });
  });

  app.post("/api/admin/ads", requireAdmin, (req, res) => {
    const ads = readJson("ads.json", []);
    const body = req.body || {};
    const id = body.id || newId();

    const ad = {
      id,
      title: body.title || "Untitled Ad",
      advertiser: body.advertiser || "",
      imageUrl: body.imageUrl || "",
      targetUrl: body.targetUrl || "",
      position: body.position || "sidebar", // sidebar, header, footer, inline
      isActive: body.isActive !== false,
      priority: typeof body.priority === "number" ? body.priority : 1,
      impressions: body.impressions || 0,
      clicks: body.clicks || 0,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = ads.findIndex(a => a.id === id);
    if (existingIndex >= 0) {
      ads[existingIndex] = ad;
    } else {
      ads.push(ad);
    }

    writeJson("ads.json", ads);
    res.json({ ok: true, ad });
  });

  app.delete("/api/admin/ads/:id", requireAdmin, (req, res) => {
    const id = req.params.id;
    let ads = readJson("ads.json", []);
    const before = ads.length;
    ads = ads.filter(a => a.id !== id);
    writeJson("ads.json", ads);
    res.json({ ok: true, removed: before - ads.length });
  });

  // ----- Store CRUD -----
  app.get("/api/admin/store", requireAdmin, (req, res) => {
    const products = readJson("store.json", []);
    res.json({ ok: true, products });
  });

  app.post("/api/admin/store", requireAdmin, (req, res) => {
    const products = readJson("store.json", []);
    const body = req.body || {};
    const id = body.id || newId();

    const product = {
      id,
      name: body.name || "Unnamed Product",
      sku: body.sku || id,
      imageUrl: body.imageUrl || "",
      description: body.description || "",
      category: body.category || "Tech",
      price: typeof body.price === "number" ? body.price : 0,
      currency: body.currency || "EUR",
      supplier: body.supplier || "",
      commissionPercent: typeof body.commissionPercent === "number" ? body.commissionPercent : 0,
      stockStatus: body.stockStatus || "available",
      isFeatured: !!body.isFeatured,
      isActive: body.isActive !== false,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = products.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }

    writeJson("store.json", products);
    res.json({ ok: true, product });
  });

  app.delete("/api/admin/store/:id", requireAdmin, (req, res) => {
    const id = req.params.id;
    let products = readJson("store.json", []);
    const before = products.length;
    products = products.filter(p => p.id !== id);
    writeJson("store.json", products);
    res.json({ ok: true, removed: before - products.length });
  });

  console.log("[admin] Admin API ready at /api/admin/*");
  // Public models listing (safe subset)
  app.get('/api/models', (req, res) => {
    const agents = readJson('agents.json', []);
    const publicAgents = agents
      .filter(a => a.isActive !== false)
      .map(a => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        logoUrl: a.logoUrl,
        shortDescription: a.shortDescription,
        category: a.category,
        isFeatured: !!a.isFeatured,
        locked: a.locked !== false
      }));
    res.json({ ok: true, agents: publicAgents });
  });
};
