/// ============================================================
/// IRENE_SHELL — Terminal privada para Wilfre (localhost-only)
/// ============================================================
const fs = require('fs');
const path = require('path');

module.exports = {
  exec(cmd){
    const out = {
      time: new Date().toISOString(),
      command: cmd,
      result: ''
    };

    try{
      if(cmd==='scan'){
        const CONS = require('../conscience/conscience_core.cjs');
        out.result = CONS.checkState();
      }
      else if(cmd==='go'){
        const GO = require('../go/irene_go.cjs');
        out.result = GO.run();
      }
      else if(cmd==='logs'){
        const fp = path.join(__dirname,'..','logs');
        out.result = fs.readdirSync(fp);
      }
      else {
        out.result = 'Comando no reconocido';
      }
    }catch(e){
      out.result = 'Error: '+e.message;
    }

    return out;
  }
};
