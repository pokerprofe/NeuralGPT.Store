const fs = require('fs');
const path = require('path');

module.exports = {
  seal(){
    try{
      const base = __dirname;
      const files = fs.readdirSync(base);

      for(const f of files){
        const p = path.join(base,f);
        try{ fs.chmodSync(p,0o444); }catch(e){}
      }

      return { ok:true };
    }catch(e){
      return { ok:false };
    }
  }
};
