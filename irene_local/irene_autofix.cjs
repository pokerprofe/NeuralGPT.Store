///////////////////////////////////////////////////////////////////////
// IRENE_AUTOFIX v1 – Reparación local de archivos críticos
// Solo trabaja en disco local. Sin APIs externas. Sin borrar datos.
///////////////////////////////////////////////////////////////////////

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const CRITICAL_JSON = [
  { file: path.join(ROOT, 'data', 'vendor_leads.json'),        fallback: [] },
  { file: path.join(ROOT, 'data', 'enterprise_requests.json'), fallback: [] },
  { file: path.join(ROOT, 'data', 'investor_proposals.json'),  fallback: [] },
  { file: path.join(ROOT, 'data', 'customer_questions.json'),  fallback: [] },
  { file: path.join(ROOT, 'data', 'subscribers.json'),         fallback: [] },
  { file: path.join(ROOT, 'data', 'security_logs.json'),       fallback: [] },
  { file: path.join(ROOT, 'data', 'products.json'),            fallback: [] },
];

function ensureDir(p){
  try{
    const dir = path.dirname(p);
    if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive:true });
  }catch(e){}
}

function safeReadJSON(file, fallback){
  try{
    if(!fs.existsSync(file)){
      ensureDir(file);
      fs.writeFileSync(file, JSON.stringify(fallback,null,2));
      return { ok:true, created:true, fixed:false, file };
    }
    const raw = fs.readFileSync(file, 'utf8').trim();
    if(!raw){
      fs.writeFileSync(file, JSON.stringify(fallback,null,2));
      return { ok:true, created:false, fixed:true, file };
    }
    JSON.parse(raw);
    return { ok:true, created:false, fixed:false, file };
  }catch(e){
    try{
      fs.writeFileSync(file, JSON.stringify(fallback,null,2));
      return { ok:true, created:false, fixed:true, file, error:String(e) };
    }catch(err){
      return { ok:false, created:false, fixed:false, file, error:String(err) };
    }
  }
}

function scanAndFix(){
  const out = [];
  for(const entry of CRITICAL_JSON){
    out.push( safeReadJSON(entry.file, entry.fallback) );
  }
  return {
    ok: true,
    ts: new Date().toISOString(),
    results: out
  };
}

// API pública del módulo
module.exports = {
  run: scanAndFix
};
