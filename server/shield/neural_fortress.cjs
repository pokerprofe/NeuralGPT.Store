//////////////////////////////////////////////////////////
// NEURAL_FORTRESS v1
// Escudo avanzado anti-abuso para NeuralGPT.Store
// - Bloquea patrones de ataque, scrapers y scans
// - Lista negra dinámica
// - Estadísticas de intentos
//////////////////////////////////////////////////////////

const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname,'data','fortress_security.json');

let state = {
  blocked: [],
  hits: {},
  lastUpdate: null
};

function loadState(){
  try{
    if(fs.existsSync(DATA_FILE)){
      const raw = fs.readFileSync(DATA_FILE,'utf8');
      state = JSON.parse(raw);
    }
  }catch{}
}

function saveState(){
  try{
    state.lastUpdate = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(state,null,2));
  }catch{}
}

function mark(ip, reason){
  if(!ip) ip = 'unknown';
  state.hits[ip] = state.hits[ip] || { count:0, reasons:[] };
  state.hits[ip].count++;
  if(!state.hits[ip].reasons.includes(reason)){
    state.hits[ip].reasons.push(reason);
  }
  if(state.hits[ip].count > 20 && !state.blocked.includes(ip)){
    state.blocked.push(ip);
  }
}

function isBlocked(ip){
  return !!state.blocked.find(x=>x===ip);
}

// Heurística básica de ataque/scraper
function looksBad(req){
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const url = (req.url || '').toLowerCase();

  const badUA = ['sqlmap','acunetix','nessus','crawler','spider','scraper','masscan','nmap','python-requests','curl/'];
  const badURL = ['.env','wp-admin','phpmyadmin','/config','/server-status','/.git','/backup','/shell'];

  if(badUA.some(k=>ua.includes(k))) return 'bad-user-agent';
  if(badURL.some(k=>url.includes(k))) return 'bad-path-probe';

  return null;
}

function fortressMiddleware(req,res,next){
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').replace('::ffff:','');

  // cargar estado perezosamente
  if(!state.lastUpdate) loadState();

  if(isBlocked(ip)){
    return res.status(403).send('Access denied · NEURAL_FORTRESS');
  }

  const reason = looksBad(req);
  if(reason){
    mark(ip, reason);
    saveState();
    return res.status(403).send('Blocked by NEURAL_FORTRESS');
  }

  // Conteo suave de hits normales (solo para estadística)
  mark(ip, 'ok');
  if(Math.random() < 0.02){
    saveState();
  }

  return next();
}

function getStats(){
  return {
    blocked: state.blocked,
    hits: state.hits,
    lastUpdate: state.lastUpdate
  };
}

module.exports = {
  fortressMiddleware,
  getStats
};
