/* --- Registro de suscripciones y hash cuántico --- */
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/subscribe", (req, res) => {
  const { email, sku } = req.body;
  if (!email || !sku) return res.status(400).json({ error: "Datos incompletos" });

  const hash = crypto.createHash("sha256").update(email + sku + Date.now()).digest("hex");
  console.log(`\n🧬 Nueva suscripción:\nEmail: ${email}\nModelo: ${sku}\nHash cuántico: ${hash}`);

  // simulación de correo
  console.log(`📧 Simulando envío de correo a ${email} con confirmación...`);

  res.json({
    status: "SUCCESS",
    message: "Registro completado. Recibirás el acceso en tu correo.",
    hash
  });
});

app.get("/api/status", (req, res) => {
  res.json({ status: "online", timestamp: Date.now() });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\nNeuralGPT.store backend escuchando en puerto ${PORT}`);
});
import { generarHashLicencia, registrarAcceso } from './licencias.mjs';
app.post('/api/licencia', (req, res) => {
  const { email, producto } = req.body;
  const hash = generarHashLicencia(email, producto);
  registrarAcceso(email, producto, hash);
  res.json({ status: 'OK', hash });
});
