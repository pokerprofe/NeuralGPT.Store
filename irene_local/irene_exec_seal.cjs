const fs = require('fs');
const path = require('path');

const allowed = ['C:\\NeuralGPT.Store', 'C:/NeuralGPT.Store'];

module.exports = {
  verify(reqPath){
    try{
      const norm = path.resolve(reqPath).replace(/\\/g,'/');
      for(const a of allowed){
        if(norm.startsWith(a.replace(/\\/g,'/'))){
          return { ok:true };
        }
      }
      return { ok:false, msg:'blocked-external-path' };
    }catch(e){
      return { ok:false, msg:'exec-seal-error' };
    }
  }
};
