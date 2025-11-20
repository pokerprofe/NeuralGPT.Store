//////////////////////////////////////////////////////////
// IRENE SUPERVISOR v3
// Auditor global del ecosistema NeuralGPT.Store
//////////////////////////////////////////////////////////
const fs = require('fs');
const path = require('path');

module.exports = {
  scanModules(base){
    const files = fs.readdirSync(base);
    const broken = [];
    for(const f of files){
      const full = path.join(base,f);
      try{ require(full); }catch(e){ broken.push({file:f, error:e.message}); }
    }
    return { ok:true, broken };
  },

  verifyCore(){
    const required = [
      'irene_core.cjs',
      'irene_notify.cjs',
      'irene_scheduler.cjs',
      'irene_logic.cjs',
      'irene_predictor.cjs',
      'irene_math.cjs',
      'irene_planner.cjs'
    ];
    const missing = required.filter(f=>!fs.existsSync(path.join(__dirname,f)));
    return { ok: missing.length===0, missing };
  }
};
