import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { generarHashLicencia, registrarAcceso } from "./licencias.mjs";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));

app.get("/api/status", (req,res)=>{
  res.json({ estado:"online", dominio:"neuralgpt.store", timestamp: Date.now() });
});

app.post("/api/licencia", (req,res)=>{
  const { email, producto } = req.body;
  const hash = generarHashLicencia(email, producto);
  registrarAcceso(email, producto, hash);
  res.json({ status:"OK", hash });
});

app.listen(4000, ()=>console.log("🌐 NeuralGPT.store activo en modo producción – puerto 4000"));
