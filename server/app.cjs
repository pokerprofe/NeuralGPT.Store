const applySecurity
const applyRouteBlocker = require('./security/route_blocker.cjs'); = require('./security/security_headers.cjs');
const express = require("express");
const path = require("path");
const app = express();

// Seguridad básica
app.disable("x-powered-by");

// Public folder
app.use(express.static(path.join(__dirname, "..", "public_html")));

// Endpoint básico para comprobar que funciona
app.get("/api/status", (req, res) => {
  res.json({ ok: true, status: "NeuralGPT.Store server running" });
});

// Arranque
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
app.use('/api/products', require('./api/products.cjs'));

app.use('/api/agents', require('./api/agents.cjs'));

app.use('/api/logs', require('./api/logs.cjs'));

app.use('/api/run', require('./api/run.cjs'));

require('./security.cjs')(app);

const NeuralCore = require('../neuralcore/core.cjs');

NeuralCore.finalize();

app.use('/api/core', require('./api/core.cjs'));

import mayordomoAPI from './mayordomo/api.cjs';
app.use('/api/butler', mayordomoAPI);

import providerHunterAPI from './provider_hunter/api.cjs';
app.use('/api/hunter', providerHunterAPI);

import leadManagerAPI from './lead_manager/api.cjs';
app.use('/api/leads', leadManagerAPI);

import neuroSalesAPI from './neurosales_ai/api.cjs';
app.use('/api/sales', neuroSalesAPI);

import automarketingAPI from './automarketing/api.cjs';
app.use('/api/marketing', automarketingAPI);

app.use('/api/landing', require('./landing_engine/api.cjs'));


