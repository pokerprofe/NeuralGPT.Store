import crypto from "crypto";
import fs from "fs";

const SECRET_KEY = "pokershadow_ink_quantum_core_2025";
const LOG_PATH = "./server/logs/access.log";

// Función para generar hash cuántico único por licencia
export function generarHashLicencia(email, producto) {
  const data = `${email}:${producto}:${Date.now()}:${SECRET_KEY}`;
  return crypto.createHash("sha512").update(data).digest("hex");
}

// Función para registrar acceso en log seguro
export function registrarAcceso(email, producto, hash) {
  const logEntry = `[${new Date().toISOString()}] ${email} | ${producto} | ${hash}\n`;
  fs.appendFileSync(LOG_PATH, logEntry, "utf8");
  console.log("🔐 Registro seguro añadido:", logEntry);
}
