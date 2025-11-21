/////////////////////////////////////////////////////////////////////////
// QUANTUM PASS ENGINE v1.0
// Suscripción PREMIUM con:
// • Claves cifradas locales
// • Firma HMAC local (sin APIs externas)
// • Validación de acceso
// • Registro de usuario premium
/////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const subsFile = path.join(__dirname,'..','data','subscriptions.json');

function loadSubs(){
  try { return JSON.parse(fs.readFileSync(subsFile,'utf8')); }
  catch { return []; }
}

function saveSubs(d){
  fs.writeFileSync(subsFile, JSON.stringify(d,null,2),'utf8');
}

// Generar clave de acceso
function genKey(email){
  const raw = email + ':' + Date.now();
  const key = crypto.createHash('sha256').update(raw).digest('hex');
  return key;
}

// Firmar clave
function sign(key){
  const secret = 'LOCAL_QUANTUM_SECRET_001';
  const hmac = crypto.createHmac('sha256',secret).update(key).digest('hex');
  return hmac;
}

// Registrar suscripción
function register(email){
  const subs = loadSubs();

  const key = genKey(email);
  const sig = sign(key);

  const record = {
    email,
    key,
    signature: sig,
    created: new Date().toISOString()
  };

  subs.push(record);
  saveSubs(subs);

  return record;
}

// Validar acceso
function validate(key,signature){
  const expected = sign(key);
  return expected === signature;
}

module.exports = { register, validate };
