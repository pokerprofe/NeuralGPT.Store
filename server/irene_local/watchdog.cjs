const fs = require('fs');
const path = require('path');
const root = __dirname;
const shadow = path.join(root,'shadow');

function restore(){
  const files = JSON.parse(fs.readFileSync(path.join(root,'core_map.json'),'utf8'));
  for(const f of files){
    const src = path.join(shadow,f);
    const dst = path.join(root,f);
    if(!fs.existsSync(dst)){ fs.copyFileSync(src,dst); }
    try{ fs.chmodSync(dst,0o444); }catch(e){}
  }
}

setInterval(()=>{ try{ restore(); }catch(e){} },60000);
