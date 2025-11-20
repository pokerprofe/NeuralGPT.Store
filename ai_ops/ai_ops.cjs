const fs = require('fs');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

function loadCfg(){
  try{
    return JSON.parse(fs.readFileSync(path.join(__dirname,'ops_config.json'),'utf8'));
  }catch{
    return { critical_files:[], backup_root:'' };
  }
}

function exists(file){
  try{ return fs.statSync(file).size > 5; }
  catch{ return false; }
}

function repair(file, backup_root){
  try{
    const name = path.basename(file);
    const backup = path.join(backup_root, 'critical', name);

    if(fs.existsSync(backup)){
      fs.copyFileSync(backup, file);
      ACT.log({
        type: 'ai_ops',
        detail: 'Repaired critical file from backup: '+file,
        user: 'ai_ops'
      });
      return { repaired:true, msg:'Repaired from backup' };
    } else {
      ACT.log({
        type: 'ai_ops',
        detail: 'Missing critical file and no backup: '+file,
        user: 'ai_ops'
      });
      return { repaired:false, msg:'No backup found' };
    }
  }catch(e){
    ACT.log({
      type: 'ai_ops',
      detail: 'Repair error on '+file,
      user: 'ai_ops'
    });
    return { repaired:false, msg:'Repair error' };
  }
}

function runCheck(){
  const out=[];
  const cfg = loadCfg();

  for(const f of cfg.critical_files){
    if(!exists(f)){
      const r = repair(f, cfg.backup_root);
      out.push({ file:f, ok:false, msg:r.msg, repaired:r.repaired });
    }else{
      out.push({ file:f, ok:true, msg:'OK', repaired:false });
    }
  }

  ACT.log({
    type: 'ai_ops',
    detail: 'AI OPS check completed',
    user: 'ai_ops'
  });

  return out;
}

module.exports = { runCheck };
