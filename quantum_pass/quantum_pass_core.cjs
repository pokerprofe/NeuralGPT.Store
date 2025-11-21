/////////////////////////////////////////////////////////////////////////
// QUANTUM PASS CORE v1.0
// Sistema premium 100% local:
// • Generación de llaves cifradas para acceso premium
// • Validación local sin APIs externas
// • Fecha de expiración
// • Modo offline / sin pagos reales
// • Integración con GooglePay / PayPal / Stripe (sandbox)
/////////////////////////////////////////////////////////////////////////

const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');

const subsFile = path.join(__dirname,'..','data','subscriptions.json');

function safeJSON(p){
  try { return JSON.parse(fs.readFileSync(p,'utf8')); }
  catch { return []; }
}

function saveJSON(p,obj){
  fs.writeFileSync(p, JSON.stringify(obj,null,2),'utf8');
}

// Generar llave cifrada premium
function generateKey(email){
  const payload = {
    email,
    created: new Date().toISOString(),
    expires: new Date(Date.now() + 365*24*60*60*1000).toISOString(), // 1 año
    plan: 'quantum-pass'
  };
  const raw = JSON.stringify(payload);
  const key = crypto.randomBytes(32).toString('hex');
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key,'hex'), Buffer.alloc(16,0));
  const encrypted = Buffer.concat([cipher.update(raw), cipher.final()]).toString('hex');

  const entry = { email, encrypted, key, created:payload.created, expires:payload.expires };

  const subs = safeJSON(subsFile);
  subs.push(entry);
  saveJSON(subsFile,subs);

  return entry;
}

// Validar llave premium
function validate(token,key){
  try{
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(key,'hex'), Buffer.alloc(16,0));
    const raw = Buffer.concat([decipher.update(Buffer.from(token,'hex')), decipher.final()]).toString();
    const obj = JSON.parse(raw);
    const now = Date.now();
    if(now > Date.parse(obj.expires)) return { ok:false, msg:'expired' };
    return { ok:true, data:obj };
  }catch(e){
    return { ok:false, msg:'invalid' };
  }
}

module.exports = { generateKey, validate };
