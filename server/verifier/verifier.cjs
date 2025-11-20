//
// Neural-Verifier v1.0
// Sistema anti-fraude totalmente local (sin APIs externas)
// Evalúa el riesgo del vendedor y devuelve:
// score: 0–100  /  status: ok | risk | blocked
//

const fs = require('fs');
const path = require('path');
const db = path.join(__dirname,'vendors_score.json');

function load(){
  return JSON.parse(fs.readFileSync(db));
}

function save(list){
  fs.writeFileSync(db, JSON.stringify(list,null,2));
}

// Algoritmo básico (rápido, privado, sin coste)
function evaluate(vendor){
  let score = 100;

  if(!vendor.name) score -= 20;
  if(!vendor.website) score -= 15;
  if(!vendor.companyId) score -= 25;
  if(vendor.reports && vendor.reports > 0) score -= vendor.reports * 10;

  let status = 'ok';
  if(score < 60) status = 'risk';
  if(score < 30) status = 'blocked';

  return { score, status };
}

function verifyVendor(vendor){
  const list = load();
  const evaluation = evaluate(vendor);

  list.push({
    name: vendor.name,
    website: vendor.website,
    companyId: vendor.companyId,
    score: evaluation.score,
    status: evaluation.status,
    date: Date.now()
  });

  save(list);
  return evaluation;
}

module.exports = { verifyVendor };
