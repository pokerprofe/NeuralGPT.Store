const fs = require('fs');
const path = require('path');

module.exports = {
  scan(){
    try{
      const base = path.resolve('C:/NeuralGPT.Store');
      const out = [];

      function walk(dir){
        const items = fs.readdirSync(dir);
        for(const it of items){
          const p = path.join(dir,it);
          const st = fs.statSync(p);

          out.push({
            file: p,
            size: st.size,
            mtime: st.mtimeMs
          });

          if(st.isDirectory()) walk(p);
        }
      }

      walk(base);

      return { ok:true, total: out.length, map: out };
    }catch(e){
      return { ok:false };
    }
  }
};
