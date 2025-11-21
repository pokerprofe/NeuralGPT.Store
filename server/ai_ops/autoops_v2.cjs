//////////////////////////////////////////////////////////
// AUTOOPS v2 – Autonomía operativa de NeuralGPT.Store
// Coordina backups, rendimiento, tareas y resumen fiscal.
// No llama a APIs externas, no cobra nada, todo local.
//////////////////////////////////////////////////////////

const path = require('path');

function safeRequire(p){
  try { return require(p); }
  catch { return null; }
}

const BACK = safeRequire('../backup_core/backup_core.cjs');
const PERF = safeRequire('../performance/performance.cjs');
const TASK = safeRequire('../tasks/auto_tasks.cjs');
const TAX  = safeRequire('../tax_engine/tax_engine.cjs');

function runDaily(){
  const out = {
    time: new Date().toISOString(),
    steps: []
  };

  if (BACK && typeof BACK.createSnapshot === 'function') {
    try{
      const r = BACK.createSnapshot();
      out.steps.push({ id:'backup', ok:true, result:r });
    }catch(e){
      out.steps.push({ id:'backup', ok:false, error:String(e) });
    }
  }

  if (PERF && typeof PERF.capture === 'function') {
    try{
      const r = PERF.capture();
      out.steps.push({ id:'perf_capture', ok:true, result:r });
    }catch(e){
      out.steps.push({ id:'perf_capture', ok:false, error:String(e) });
    }
  }

  if (TASK && typeof TASK.runMinimal === 'function') {
    try{
      const r = TASK.runMinimal();
      out.steps.push({ id:'tasks_minimal', ok:true, result:r });
    }catch(e){
      out.steps.push({ id:'tasks_minimal', ok:false, error:String(e) });
    }
  }

  if (TAX && typeof TAX.summary === 'function') {
    try{
      const r = TAX.summary({});
      out.steps.push({ id:'tax_summary', ok:true, result:r });
    }catch(e){
      out.steps.push({ id:'tax_summary', ok:false, error:String(e) });
    }
  }

  return out;
}

function runQuick(){
  const out = {
    time: new Date().toISOString(),
    steps: []
  };

  if (PERF && typeof PERF.capture === 'function') {
    try{
      const r = PERF.capture();
      out.steps.push({ id:'perf_capture', ok:true, result:r });
    }catch(e){
      out.steps.push({ id:'perf_capture', ok:false, error:String(e) });
    }
  }

  return out;
}

module.exports = {
  runDaily,
  runQuick
};
