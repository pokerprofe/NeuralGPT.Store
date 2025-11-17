const fs = require('fs');
const path = require('path');

const PROS_DB = path.join(__dirname,'..','b2b','vendor_prospects.json');
const SALES_DB = path.join(__dirname,'neurosales_log.json');

function loadProspects(){
  try { return JSON.parse(fs.readFileSync(PROS_DB,'utf8')); }
  catch { return []; }
}

function loadLogs(){
  try { return JSON.parse(fs.readFileSync(SALES_DB,'utf8')); }
  catch { return []; }
}

function saveLogs(list){
  fs.writeFileSync(SALES_DB, JSON.stringify(list,null,2));
}

function estimateScore(p){
  let s = 0;

  // Países con mayor probabilidad de afiliación tecnológica
  const hot = ['china','japan','korea','taiwan','singapore','usa','germany'];
  if(hot.some(h => (p.country || '').toLowerCase().includes(h))) s += 30;

  // Categorías fuertes en tu plataforma
  const primeCats = ['robotics','chips','pc parts','industrial','ai hardware','dev kits'];
  if(primeCats.some(c => (p.category || '').toLowerCase().includes(c))) s += 40;

  // Email corporativo da más puntuación
  if(p.email && !p.email.includes('gmail') && !p.email.includes('yahoo')) s += 20;

  // Si ya contactaste antes, ajusta
  if(p.status === 'queued') s -= 10;
  if(p.status === 'contacted') s -= 20;

  return Math.min(100, s);
}

function prioritize(){
  const pros = loadProspects();
  const ranked = pros.map(p => ({
    ...p,
    neuroScore: estimateScore(p),
    priority: estimateScore(p) >= 70 ? 'high' :
              estimateScore(p) >= 40 ? 'medium' : 'low'
  }));

  const logs = loadLogs();
  logs.unshift({
    date: new Date().toISOString(),
    total: ranked.length,
    high: ranked.filter(x=>x.priority==='high').length,
    medium: ranked.filter(x=>x.priority==='medium').length,
    low: ranked.filter(x=>x.priority==='low').length
  });
  saveLogs(logs);

  return ranked;
}

module.exports = { prioritize, estimateScore };
