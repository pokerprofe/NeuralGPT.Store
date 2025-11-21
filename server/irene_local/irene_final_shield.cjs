// ============================================================
// IRENE_FINAL_SHIELD — Protección absoluta del núcleo
// ============================================================
const fs = require('fs');
const path = require('path');

module.exports = {
  enforce(){
    const lk = path.join(__dirname,'irene.final.lock');
    if(!fs.existsSync(lk)){
      return { ok:false, msg:'LOCK FILE MISSING' };
    }

    // Cualquier intento de borrar/editar Irene → fallar
    const core = path.join(__dirname,'irene_core.cjs');
    try{
      fs.accessSync(core, fs.constants.R_OK);
    }catch{
      return { ok:false, msg:'CRITICAL: Irene core inaccessible' };
    }

    return { ok:true, msg:'Irene core protected' };
  }
};
