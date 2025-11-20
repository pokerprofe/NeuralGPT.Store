//////////////////////////////////////////////////////////////
// IRENE SHIELD X v4
// Defensa activa + Autocorrección + Integridad del núcleo
//////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

module.exports = {

  verify(){
    const base = __dirname;
    const files = [
      'irene_core.cjs',
      'irene_notify.cjs',
      'irene_scheduler.cjs',
      'irene_diag.cjs',
      'irene_guardian.cjs',
      'irene_health.cjs',
      'irene_logics.cjs',
      'irene_prediction.cjs',
      'irene_planner.cjs',
      'irene_brain.cjs',
      'kb_intents.json',
      'irene_perception.cjs'
    ];

    const missing = [];
    for(const f of files){
      const full = path.join(base, f);
      if(!fs.existsSync(full)) missing.push(f);
    }

    return { ok: missing.length===0, missing };
  },

  autocorrect(){
    try{
      const check = this.verify();
      const m = check.missing;
      if(m.length===0) return { ok:true, repaired:false };

      const templates = {
        'irene_logics.cjs': "module.exports={ think(){return{ok:true,out:'baseline-logic'}} }",
        'irene_prediction.cjs': "module.exports={ forecast(){return{ok:true,forecast:'baseline'}} }",
        'irene_perception.cjs': "module.exports={ sense(){return{}}, anomalyCheck(){return{}} }"
      };

      for(const f of m){
        if(templates[f]){
          fs.writeFileSync(path.join(__dirname,f), templates[f]);
        }
      }

      return { ok:true, repaired:true, repaired_files:m };
    }catch(e){
      return { ok:false, error:e.message };
    }
  },

  firewall(req){
    try{
      const url = (req.url||'').toLowerCase();
      if(url.includes('..') || url.includes('%') || url.includes('delete') || url.includes('drop')){
        return false;
      }
      return true;
    }catch(e){
      return false;
    }
  }

}
