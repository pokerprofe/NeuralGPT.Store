import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 4000;

// 🔐 Seguridad básica
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

// Genera hash cuántico simbólico (proteger integridad)
function quantumHash(payload) {
  return crypto.createHash("sha512").update(JSON.stringify(payload)).digest("hex");
}

// 🧾 Endpoint principal: PayPal / GPay webhook sandbox
app.post("/api/payhook", (req, res) => {
  const data = req.body;
  const signature = quantumHash(data);
  console.log("🛰️  Pago recibido:", data);
  console.log("🔒 Hash cuántico:", signature);

  // Simula validación exitosa
  if (data.status === "COMPLETED" || data.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    return res.status(200).json({ ok: true, message: "Pago validado en sandbox", signature });
  } else {
    return res.status(400).json({ ok: false, message: "Pago no válido" });
  }
});

// 🧠 Endpoint de estado del servidor
app.get("/api/status", (req, res) => {
  res.json({ status: "online", timestamp: Date.now() });
});

app.listen(PORT, () => console.log(`🚀 NeuralGPT.store backend escuchando en puerto ${PORT}`));
