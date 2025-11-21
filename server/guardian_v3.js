const fs = require('fs');
const path = require('path');

const LOG = path.join(__dirname, '../logs/guardian.log');

// Ventana de tiempo (ms) y límites
const WINDOW_MS = 60 * 1000;      // 1 minuto
const MAX_REQ   = 120;            // 120 requests/min por IP
const MAX_BURST = 40;             // ráfaga máxima

// Listas en memoria
const hits = new Map();
const blacklist = new Set();

function log(msg){
  const line = '['+new Date().toISOString()+'] [G3] '+msg+' \n';
  try{ fs.appendFileSync(LOG, line); }catch(_){}
}

function isBot(req){
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if(!ua) return true;
  const bad = ['curl','python','scrapy','bot','spider','crawler'];
  return bad.some(k=>ua.includes(k));
}

function check(ip){
  const now = Date.now();
  if(!hits.has(ip)){
    hits.set(ip, {count:1, first:now, last:now});
    return {ok:true};
  }
  const h = hits.get(ip);
  h.count++;
  h.last = now;

  // reset ventana
  if(now - h.first > WINDOW_MS){
    h.first = now;
    h.count = 1;
  }

  if(h.count > MAX_REQ){
    blacklist.add(ip);
    log('IP bloqueada por exceso: '+ip+' ('+h.count+'/min)');
    return {ok:false, reason:'rate'};
  }

  if(h.count > MAX_BURST && (now - h.first) < 5000){
    // ráfaga sospechosa en 5s
    log('Ráfaga sospechosa desde '+ip+' ('+h.count+' en '+(now-h.first)+'ms)');
  }

  return {ok:true};
}

function middleware(req,res,next){
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString();

  if(blacklist.has(ip)){
    log('Petición bloqueada de IP en blacklist: '+ip+' '+req.method+' '+req.url);
    return res.status(429).json({ok:false, error:'Too many requests / blocked'});
  }

  // Ignorar estáticos básicos
  if(req.url.startsWith('/assets/') || req.url.startsWith('/uploads/')){
    return next();
  }

  // Bot muy descarado
  if(isBot(req)){
    log('User-Agent sospechoso desde '+ip+': '+(req.headers['user-agent'] || 'none'));
  }

  const r = check(ip);
  if(!r.ok){
    return res.status(429).json({ok:false, error:'Rate limit exceeded'});
  }

  return next();
}

module.exports = {
  mount(app){
    log('Guardian V3 montado (Shield activo)');
    app.use(middleware);
  }
};
