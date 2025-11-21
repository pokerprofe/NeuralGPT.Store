/////////////////////////////////////////////////////////////////////////
// PROVIDER VERIFICATION ENGINE v1.0
//
// Irene Local analiza proveedores ANTES de permitirles vender:
// • Detección de datos falsos
// • Detección de correos sospechosos
// • Detección de webs trampa
// • Puntuación de riesgo
// • Validación completa offline (sin APIs externas)
// • Marca proveedores confiables para autopublish
/////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

const vendorsFile = path.join(__dirname,'..','data','vendor_leads.json');

function safeJSON(p){
  try { return JSON.parse(fs.readFileSync(p,'utf8')); }
  catch { return []; }
}

// Comprobaciones internas básicas
function isEmailValid(email){
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function isWebSuspicious(url){
  if(!url) return true;
  const bad = ['.xyz','.top','.club','.win','http://','freehosting','blogspot'];
  return bad.some(b=> url.toLowerCase().includes(b));
}

function scoreVendor(v){
  let score = 100;

  if(!isEmailValid(v.email)) score -= 25;
  if(isWebSuspicious(v.website)) score -= 20;
  if((v.company||'').length < 3) score -= 15;
  if(!v.taxid) score -= 20;

  return score < 0 ? 0 : score;
}

function verifyAll(){
  const vendors = safeJSON(vendorsFile);
  return vendors.map(v=>{
    const risk = scoreVendor(v);
    return {
      ...v,
      riskScore: risk,
      status: risk >= 70 ? 'verified' : (risk >= 40 ? 'warning' : 'reject')
    };
  });
}

module.exports = { verifyAll };
