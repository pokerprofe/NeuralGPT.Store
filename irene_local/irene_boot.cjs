const fs = require('fs');
const path = require('path');

module.exports = {
  boot(){
    try{
      return {
        ok:true,
        core:'Irene v3 online',
        ts: Date.now()
      };
    }catch(e){
      return { ok:false };
    }
  }
};
