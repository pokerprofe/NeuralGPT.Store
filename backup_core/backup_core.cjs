const fs = require('fs');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

const ROOT = 'C:/NeuralGPT.Store';
const SNAP = 'C:/NeuralGPT.Store/backups/snapshots';

function copyRecursive(src, dst){
  if(!fs.existsSync(dst)) fs.mkdirSync(dst,{ recursive:true });

  const entries = fs.readdirSync(src);
  for(const e of entries){
    const s = path.join(src,e);
    const d = path.join(dst,e);
    const stat = fs.statSync(s);

    if(stat.isDirectory()){
      copyRecursive(s,d);
    } else {
      fs.copyFileSync(s,d);
    }
  }
}

function createSnapshot(){
  try{
    const stamp = new Date().toISOString().replace(/[:\.]/g,'-');
    const dest = path.join(SNAP, 'snapshot_'+stamp);
    fs.mkdirSync(dest);

    copyRecursive(ROOT, dest);

    ACT.log({
      type:'backup',
      detail:'Snapshot created: '+dest,
      user:'backup_suite'
    });

    return { ok:true, snapshot:dest };
  }catch(e){
    return { ok:false, error:'Snapshot failed' };
  }
}

function listSnapshots(){
  return fs.readdirSync(SNAP).filter(x=>x.startsWith('snapshot_'));
}

function restoreSnapshot(name){
  try{
    const src = path.join(SNAP, name);
    if(!fs.existsSync(src)) return { ok:false, error:'Snapshot not found' };

    // Restauración total
    copyRecursive(src, ROOT);

    ACT.log({
      type:'backup',
      detail:'Snapshot restored: '+name,
      user:'backup_suite'
    });

    return { ok:true };
  }catch(e){
    return { ok:false, error:'Restore failed' };
  }
}

module.exports = { createSnapshot, listSnapshots, restoreSnapshot };
