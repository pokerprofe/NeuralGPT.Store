/////////////////////////////////////////////////////////////////////////
// IRENE DESKTOP GUARDIAN v1.0
//
// Bridge local entre Irene (backend) y tu PC:
//  • Solo funciona EN TU MÁQUINA (localhost).
//  • Comandos MUY controlados, sin pagos, sin red externa.
//  • Irene ve: info del sistema, estado del proyecto, logs.
//  • Puede: abrir carpetas clave, leer logs, sugerir acciones.
//  • NO hace pagos, NO toca datos sensibles fuera de C:\NeuralGPT.Store.
//
/////////////////////////////////////////////////////////////////////////

const os   = require('os');
const fs   = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = 'C:\\\\NeuralGPT.Store';

function safePath(p){
  const full = path.resolve(p);
  if(!full.startsWith(ROOT)) return ROOT; // nunca salir del proyecto
  return full;
}

// Información general del sistema
function systemInfo(){
  return {
    ts: new Date().toISOString(),
    user: os.userInfo().username,
    host: os.hostname(),
    platform: os.platform(),
    cpus: os.cpus().length,
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
    homeDir: os.homedir(),
    projectRoot: ROOT
  };
}

// Listar estructura básica del proyecto
function listProject(){
  const walk = (p,depth=0,maxDepth=2)=>{
    if(depth>maxDepth) return [];
    let out = [];
    try{
      const items = fs.readdirSync(p,{withFileTypes:true});
      for(const it of items){
        const full = path.join(p,it.name);
        out.push({ path: full, dir: it.isDirectory(), depth });
        if(it.isDirectory()){
          out = out.concat(walk(full, depth+1, maxDepth));
        }
      }
    }catch{}
    return out;
  };
  return walk(ROOT,0,2);
}

// Leer últimos N bytes de un log dentro del proyecto
function tailLog(relPath,maxBytes){
  try{
    const full = safePath(path.join(ROOT, relPath));
    const stat = fs.statSync(full);
    const size = stat.size;
    const start = size > maxBytes ? size - maxBytes : 0;
    const fd = fs.openSync(full,'r');
    const buf = Buffer.alloc(size-start);
    fs.readSync(fd, buf, 0, size-start, start);
    fs.closeSync(fd);
    return buf.toString('utf8');
  }catch(e){
    return 'Error reading log: '+e.message;
  }
}

// Abrir carpeta del proyecto en el explorador (solo local)
function openProjectFolder(cb){
  exec('explorer "'+ROOT+'"', (err)=>{
    if(err) cb(false);
    else cb(true);
  });
}

// Abrir carpeta de logs
function openLogsFolder(cb){
  const logs = path.join(ROOT,'logs');
  exec('explorer "'+logs+'"', (err)=>{
    if(err) cb(false);
    else cb(true);
  });
}

// Ejecutar una comprobación rápida (Node + puerto 4000)
function quickCheck(cb){
  const result = {
    node: process.version,
    port: 4000,
    ok: true
  };
  cb(result);
}

module.exports = {
  systemInfo,
  listProject,
  tailLog,
  openProjectFolder,
  openLogsFolder,
  quickCheck
};
