const fs = require('fs');
const path = require('path');

function exists(p){
  try { return fs.existsSync(p); } catch { return false; }
}

function fileInfo(p){
  try{
    const st = fs.statSync(p);
    return { exists:true, size:st.size, mtime:st.mtime };
  }catch{
    return { exists:false, size:0, mtime:null };
  }
}

function getStatus(){
  const root   = path.join(__dirname, '..');
  const server = path.join(root,'server');
  const pub    = path.join(root,'public_html');
  const data   = path.join(root,'data');

  const status = {
    ok: true,
    ts: new Date().toISOString(),
    core: {
      app: exists(path.join(server,'app.cjs')),
      public_html: exists(pub),
      data: exists(data)
    },
    security: {
      firewall: exists(path.join(server,'firewall_vpn.cjs')),
      hardening: exists(path.join(server,'hardening_engine.cjs')),
      logs: exists(path.join(root,'logs'))
    },
    ai: {
      irene_core: exists(path.join(server,'irene_local','irene_core.cjs'))
    },
    vendors: {
      vendor_leads: fileInfo(path.join(root,'data','vendor_leads.json')),
      autovendor_queue: fileInfo(path.join(server,'autovendor','autovendor_queue.json')),
      products: fileInfo(path.join(root,'data','products.json'))
    },
    web: {
      index: fileInfo(path.join(pub,'index.html')),
      dashboard: exists(path.join(root,'dashboard','index.html')),
      cockpit: exists(path.join(pub,'admin','cockpit'))
    }
  };

  status.ok = status.core.app && status.core.public_html && status.core.data;

  return status;
}

module.exports = { getStatus };
