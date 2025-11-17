const fs = require('fs');
const path = require('path');

module.exports = {
  verify(){
    try{
      const seal = path.join(__dirname, 'Irene.quantum.seal');
      if(!fs.existsSync(seal)){
        return { ok:false, msg:'SEAL FILE MISSING' };
      }

      // Impedir editar Irene
      const core = path.join(__dirname, 'irene_core.cjs');
      try{
        fs.accessSync(core, fs.constants.R_OK);
      }catch(e){
        return { ok:false, msg:'CRITICAL: core inaccessible' };
      }

      return { ok:true, msg:'quantum-seal-ok' };
    }catch(e){
      return { ok:false, msg:e.message };
    }
  }
}
