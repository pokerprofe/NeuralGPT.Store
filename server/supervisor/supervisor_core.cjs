const fs = require('fs');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

function checkModule(p){
  try{
    const st = fs.statSync(p).size;
    if(st < 5){
      return { ok:false, file:p, msg:'File too small (possible corruption)' };
    }
    return { ok:true, file:p, msg:'OK' };
  }catch{
    return { ok:false, file:p, msg:'Missing file' };
  }
}

function runSupervisor(){
  const modules = {
    ai_ops: 'C:/NeuralGPT.Store/server/ai_ops/ai_ops.cjs',
    auto_update: 'C:/NeuralGPT.Store/server/updates/auto_update.cjs',
    vendor_engine: 'C:/NeuralGPT.Store/server/vendor_engine/vendor_engine.cjs',
    irene_core: 'C:/NeuralGPT.Store/server/irene_local/irene_core.cjs',
    analytics: 'C:/NeuralGPT.Store/server/app.cjs'
  };

  const out = [];

  for(const k in modules){
    out.push(checkModule(modules[k]));
  }

  ACT.log({
    type:'supervisor',
    detail:'Supervisor scan complete',
    user:'irene_supervisor'
  });

  return out;
}

module.exports = { runSupervisor };
