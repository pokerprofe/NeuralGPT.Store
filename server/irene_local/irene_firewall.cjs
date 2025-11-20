const fs = require('fs');
const path = require('path');

module.exports = {
  scan(req){
    try{
      const url = (req.originalUrl || '').toLowerCase();
      const blocked = [
        '/delete', '/remove', '/wipe', 
        'drop', 'truncate', 'format', 
        '/rewrite', '/override', '/kill'
      ];

      for(const b of blocked){
        if(url.includes(b)){
          return { ok:false, rule:b, msg:'blocked' };
        }
      }

      return { ok:true };
    }catch(e){
      return { ok:false, msg:'error' };
    }
  }
};
