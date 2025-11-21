const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname,'vendor_scores.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB)); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function scoreVendor(data){
  let score = 0;

  // Empresa y responsable
  if(data.company && data.company.length >= 3) score += 10;
  if(data.responsible && data.responsible.length >= 3) score += 10;

  // Email de empresa
  if(data.email && data.email.includes('@') && !data.email.includes('gmail')) score += 15;

  // País
  const trusted = ['spain','portugal','france','germany','italy','usa','canada','japan','korea','uk'];
  if(trusted.includes((data.country || '').toLowerCase())) score += 10;

  // Categorías ofrecidas
  const categories = data.categories || [];
  score += categories.length * 3; // más catálogo, más puntos

  // Certificaciones
  const certs = (data.certs || '').toLowerCase();
  if(certs.includes('ce')) score += 5;
  if(certs.includes('fcc')) score += 5;
  if(certs.includes('rohs')) score += 5;

  // Web
  if(data.web && data.web.startsWith('http')) score += 10;

  // Descripción coherente
  if((data.description || '').length > 30) score += 10;

  // Cumplimiento legal
  if(data.legal === true) score += 15;

  // Bloquear si faltan datos críticos
  if(!data.email || !data.company) score -= 20;

  // Registro final
  const entry = {
    id: Date.now(),
    company: data.company || '',
    score,
    date: new Date().toISOString(),
    approved: score >= 40
  };

  const list = load();
  list.unshift(entry);
  save(list);

  return entry;
}

module.exports = { scoreVendor };
