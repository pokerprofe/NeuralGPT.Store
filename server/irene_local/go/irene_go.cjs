/// ============================================================
/// IRENE_GO — Motor autónomo de tareas diarias
/// ============================================================
const fs = require('fs');
const path = require('path');

module.exports = {
  run(){
    const log = {
      time: new Date().toISOString(),
      actions: []
    };

    // Limpieza ligera
    try{
      const CLEAN = require('../clean_core.cjs');
      CLEAN.cleanTemp(); CLEAN.cleanLogs();
      log.actions.push('cleanup');
    }catch{}

    // Revisión proveedores nuevos
    try{
      const vendorsFile = path.join(__dirname,'..','data','vendor_leads.json');
      if(fs.existsSync(vendorsFile)){
        const arr = JSON.parse(fs.readFileSync(vendorsFile,'utf8'));
        if(arr.length>0){
          log.actions.push('vendors_pending:'+arr.length);
        }
      }
    }catch{}

    // Revisión clientes pendientes
    try{
      const cust = path.join(__dirname,'..','data','customer_questions.json');
      if(fs.existsSync(cust)){
        const a = JSON.parse(fs.readFileSync(cust,'utf8'));
        if(a.length>0){
          log.actions.push('customer_questions:'+a.length);
        }
      }
    }catch{}

    return log;
  }
};
