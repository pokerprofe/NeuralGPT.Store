const fs = require('fs');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

const UPD_DIR = __dirname;

function applyPatch(patchFile){
  try {
    const patch = JSON.parse(fs.readFileSync(patchFile,'utf8'));

    patch.files.forEach(f => {
      if(f.type === 'append'){
        fs.appendFileSync(f.target, '\\n'+f.content);
      }
      if(f.type === 'replace'){
        fs.writeFileSync(f.target, f.content);
      }
    });

    ACT.log({
      type: 'auto_update',
      detail: 'Applied patch: '+patch.id,
      user: 'irene_local'
    });

    return { ok:true, id:patch.id };
  }catch(e){
    return { ok:false, error:'Patch error' };
  }
}

function listPatches(){
  const files = fs.readdirSync(UPD_DIR).filter(x=>x.endsWith('.json'));
  return files;
}

module.exports = { applyPatch, listPatches };
