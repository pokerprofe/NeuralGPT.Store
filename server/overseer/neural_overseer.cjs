//////////////////////////////////////////////////////////
// NEURAL_OVERSEER v1
// Supervisor cuántico global del ecosistema NeuralGPT.Store
// Autoridad máxima después de Irene.
// Irene reporta, Overseer verifica.
//////////////////////////////////////////////////////////

const fs = require('fs');
const os = require('os');
const path = require('path');

const WATCHED = [
  '../server',
  '../server/data',
  '../server/irene_local',
  '../server/pokerkernel',
  '../public_html',
  '../dashboard'
];

// Estado interno
let STATE = {
  cpu: 0,
  ram: 0,
  alerts: [],
  events: [],
  lastCheck: null
};

function scanSystem(){
  STATE.cpu = os.loadavg()[0];
  STATE.ram = (os.totalmem() - os.freemem()) / os.totalmem();
  STATE.lastCheck = new Date().toISOString();
}

function watchDirs(){
  WATCHED.forEach(dir=>{
    try{
      const full = path.join(__dirname, dir);
      if(fs.existsSync(full)){
        fs.watch(full, {recursive:true}, (event, file)=>{
          STATE.events.push({
            t: Date.now(),
            type: event,
            file: file
          });
        });
      }
    }catch(e){}
  });
}

function detectAnomalies(){
  if(STATE.cpu > 2){
    STATE.alerts.push({ t: Date.now(), alert:'CPU_HIGH' });
  }
  if(STATE.ram > 0.90){
    STATE.alerts.push({ t: Date.now(), alert:'RAM_CRITICAL' });
  }
}

function getStatus(){
  return {
    ok: true,
    cpu: STATE.cpu,
    ram: STATE.ram,
    alerts: STATE.alerts.slice(-10),
    events: STATE.events.slice(-15),
    lastCheck: STATE.lastCheck
  };
}

// Inicio
scanSystem();
watchDirs();
setInterval(scanSystem, 5000);
setInterval(detectAnomalies, 7000);

// API pública
module.exports = { getStatus };

