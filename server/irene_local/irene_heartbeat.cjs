const fs = require('fs');
const path = require('path');

module.exports = {
  beat(){
    const file = path.join(__dirname,'heartbeat.log');
    try{
      const t = new Date().toISOString();
      fs.writeFileSync(file, 'HEARTBEAT ' + t + '\n', {flag:'a'});
      return { ok:true, time:t };
    }catch(e){
      return { ok:false };
    }
  }
};
