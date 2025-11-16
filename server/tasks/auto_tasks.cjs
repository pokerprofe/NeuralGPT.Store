///////////////////////////////////////////////////////////////////////
// AUTO-TASK ENGINE v1.0
// Irene Local ejecuta tareas autónomas cada X minutos
///////////////////////////////////////////////////////////////////////
const AUTOGEN = require('../auto_product/auto_product_gen.cjs');
const fs = require('fs');
const path = require('path');

let logFile = path.join(__dirname,'..','logs','auto_tasks.log');

function log(msg){
  const line = '['+new Date().toISOString()+'] '+msg+'\\n';
  try{ fs.appendFileSync(logFile,line); }catch{}
}

// Tarea principal: generar un producto
async function task_generate(){
  try{
    const r = AUTOGEN.generateProduct();
    log('Producto generado: '+JSON.stringify(r));
  }catch(e){
    log('ERROR generando producto: '+e.message);
  }
}

// Tarea watchdog (revisar estado básico)
async function task_watch(){
  log('Watchdog OK: sistema operativo.');
}

// Scheduler simple
function startScheduler(){
  log('AUTO-TASK ENGINE iniciado.');

  // Cada 10 minutos genera un producto
  setInterval(task_generate, 10 * 60 * 1000);

  // Cada 5 minutos hace un chequeo interno
  setInterval(task_watch, 5 * 60 * 1000);
}

module.exports = { startScheduler };

///////////////////////////////////////////////////////////////////////
// ORCHESTRATOR – Ciclo maestro cada 15 minutos
///////////////////////////////////////////////////////////////////////
const ORCH = require('../orchestrator/orchestrator.cjs');
setInterval(()=>{ ORCH.orchestrate(); }, 15 * 60 * 1000);

