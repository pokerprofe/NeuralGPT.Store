//// =============================================================
// IRENE_HEALTH v1 — Monitor del servidor local
// No usa recursos mientras no se llama explícitamente.
// Revisa estado de carpetas, archivos críticos, RAM, logs, etc.
// =============================================================

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const ROOT  = path.join(__dirname, '..');
const DATA  = path.join(__dirname, '..', 'data');
const SERVER= path.join(__dirname, '..');

function safeStat(p){
  try { return fs.statSync(p); } catch(e){ return null; }
}

function loadLog(){
  const f = path.join(DATA, 'irene_notify.log');
  try{
    if(!fs.existsSync(f)) return '(sin log)';
    const txt = fs.readFileSync(f,'utf8');
    const lines = txt.trim().split(/\\r?\\n/);
    return lines.slice(-20); // últimas 20
  }catch(e){
    return ['error cargando log'];
  }
}

function checkFiles(){
  const critical = [
    'server/app.cjs',
    'server/eco_guardian.cjs',
    'server/products_handler.cjs',
    'server/traffix/traffix_core.cjs',
  ];

  const results = [];

  for(const rel of critical){
    const full = path.join(ROOT, rel);
    const st = safeStat(full);
    if(!st){
      results.push({ file: rel, status:'MISSING' });
    } else if(st.size < 5){
      results.push({ file: rel, status:'EMPTY' });
    } else {
      results.push({ file: rel, status:'OK', size: st.size });
    }
  }

  return results;
}

function health(){
  return {
    timestamp: new Date().toISOString(),
    system: {
      freeRAM: os.freemem(),
      totalRAM: os.totalmem(),
      loadAVG: os.loadavg(),
      uptime: os.uptime()
    },
    storage: {
      logsSize: safeStat(path.join(DATA,'irene_notify.log'))?.size || 0,
    },
    files: checkFiles(),
    recentLog: loadLog()
  };
}

module.exports = {
  health
};
