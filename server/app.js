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