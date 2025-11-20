//////////////////////////////////////////////////////////
// IRENE_SOVEREIGN_LOCK v3
// Verifica la integridad de Irene (irene_local + pokerkernel)
// usando el manifiesto generado por PowerShell.
// Si algo cambia, lo reporta como 'tampered'.
//////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const manifestPath = path.join(__dirname, 'irene_manifest.json');

function loadManifest(){
  try{
    const raw = fs.readFileSync(manifestPath,'utf8');
    return JSON.parse(raw);
  }catch(e){
    return [];
  }
}

function hashFile(file){
  const data = fs.readFileSync(file);
  const h = crypto.createHash('sha256');
  h.update(data);
  return h.digest('hex').toUpperCase();
}

function verify(){
  const man = loadManifest();
  const tampered = [];

  for(const entry of man){
    try{
      if(!fs.existsSync(entry.file)){
        tampered.push({ file: entry.file, status:'MISSING' });
        continue;
      }
      const h = hashFile(entry.file);
      if(h !== entry.hash){
        tampered.push({ file: entry.file, status:'CHANGED', expected: entry.hash, got: h });
      }
    }catch(e){
      tampered.push({ file: entry.file, status:'ERROR', error: String(e) });
    }
  }

  return {
    ok: tampered.length === 0,
    tampered,
    total: man.length,
    time: new Date().toISOString()
  };
}

module.exports = {
  verify
};
