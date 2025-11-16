/////////////////////////////////////////////////////////////////////////
// NEURO-SEC OPS v1.0
// • Rechazo automático de VPN/Proxy
// • Detección de User-Agents sospechosos
// • Bloqueo de rutas peligrosas
// • Guardado de incidentes
/////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname,'secops.log');

function log(msg){
  const line = '['+new Date().toISOString()+'] '+msg+'\\n';
  try{ fs.appendFileSync(logFile,line); }catch{}
}

const blockedAgents = [
  'curl','wget','python','scraper','bot','crawler','headless','scan','fetch'
];

const blockedRoutes = [
  '/phpmyadmin','/wp-admin','/adminer','/.env','/etc','/bin','/config'
];

function analyze(req){
  const ua = (req.headers['user-agent']||'').toLowerCase();
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const url = req.url || '';

  if(blockedAgents.some(a=>ua.includes(a))){
    log('UA_BLOCK '+ua+' '+ip);
    return false;
  }

  if(blockedRoutes.some(r=>url.includes(r))){
    log('ROUTE_BLOCK '+url+' '+ip);
    return false;
  }

  // detect proxy/vpn (muy básico pero útil)
  if(ip.startsWith('10.') || ip.startsWith('172.') || ip.startsWith('192.168')){
    return true; // local
  }
  if(ip.startsWith('127.')) return true;

  // Heurística anti-VPN
  if(ip.startsWith('45.') || ip.startsWith('104.') || ip.startsWith('185.') || ip.startsWith('198.')){
    log('VPN_SUS '+ip);
    return false;
  }

  return true;
}

module.exports = { analyze };
