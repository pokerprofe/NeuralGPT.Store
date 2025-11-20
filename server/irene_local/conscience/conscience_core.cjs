/// ============================================================
/// IRENE_CONSCIENCE_CORE — Autocorrección y coherencia global
/// ============================================================
const fs = require('fs');
const path = require('path');

module.exports = {
  checkState(){
    const report = {
      time: new Date().toISOString(),
      warnings: [],
      ok: true
    };

    // Comprobación de archivos vitales de Irene
    const critical = ['irene_core.cjs','irene_notify.cjs','irene_scheduler.cjs','irene_guardian.cjs'];
    critical.forEach(f=>{
      const fp = path.join(__dirname,'..',f);
      if(!fs.existsSync(fp)){
        report.ok = false;
        report.warnings.push('Missing '+f);
      }
    });

    // Comprobación de integridad
    try{
      const INT = require('../irene_integrity.cjs');
      const out = INT.verify();
      if(!out.ok){
        report.ok = false;
        report.warnings.push('Integrity mismatch in Irene core');
      }
    }catch(e){
      report.ok = false;
      report.warnings.push('Integrity module error: '+e.message);
    }

    return report;
  }
};
