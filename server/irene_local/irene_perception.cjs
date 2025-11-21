//////////////////////////////////////////////////////////////
// IRENE_PERCEPTION v1
// Sistema nervioso global: señales, eventos, anomalías
//////////////////////////////////////////////////////////////
const fs = require('fs');
const path = require('path');

module.exports = {
  sense(){
    try{
      return {
        time: new Date().toISOString(),
        cpu: process.cpuUsage(),
        mem: process.memoryUsage(),
        uptime: process.uptime()
      };
    }catch(e){
      return { error: e.message };
    }
  },

  anomalyCheck(){
    try{
      const m = process.memoryUsage().rss / 1024 / 1024;
      const u = process.uptime();
      const alerts = [];
      if(m > 900) alerts.push('mem_high');
      if(u > 86400*3) alerts.push('uptime_excess');

      return { ok:true, alerts };
    }catch(e){
      return { ok:false, error:e.message };
    }
  }
}
