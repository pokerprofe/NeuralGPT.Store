const fs = require('fs');
const path = require('path');

function safeJSON(p){
  try { return JSON.parse(fs.readFileSync(p)); }
  catch { return []; }
}

function safeLines(p){
  try { return fs.readFileSync(p,'utf8').trim().split(/\r?\n/); }
  catch { return []; }
}

function getOverview(){
  const root   = path.join(__dirname,'..');
  const data   = path.join(root,'data');
  const logs   = path.join(root,'logs');

  const catalog = safeJSON(path.join(data,'catalog.json'));
  const vendors = safeJSON(path.join(data,'vendor_leads.json'));
  const subs    = safeJSON(path.join(data,'subscriptions.json')); // opcional
  const firewall= safeLines(path.join(logs,'firewall.log'));
  const tasks   = safeLines(path.join(logs,'auto_tasks.log'));

  const totalProducts = catalog.length;
  const totalVendors  = vendors.length;
  const totalSubs     = subs.length || 0;

  let avgPrice = 0;
  if (catalog.length){
    const sum = catalog.reduce((a,c)=>a+Number(c.price||0),0);
    avgPrice = Number((sum/catalog.length).toFixed(2));
  }

  // Productos por categoría
  const byCat = {};
  for(const p of catalog){
    const c = p.category || 'general';
    byCat[c] = (byCat[c]||0)+1;
  }

  // Timeline sencilla: productos por día
  const byDay = {};
  for(const p of catalog){
    if(!p.created) continue;
    const d = String(p.created).substring(0,10);
    byDay[d] = (byDay[d]||0)+1;
  }

  // Eventos de seguridad y tareas
  const securityEvents = firewall.length;
  const autoTasks      = tasks.length;

  return {
    ok: true,
    ts: new Date().toISOString(),
    kpi: {
      totalProducts,
      totalVendors,
      totalSubs,
      avgPrice,
      securityEvents,
      autoTasks
    },
    byCategory: byCat,
    byDay: byDay
  };
}

module.exports = { getOverview };
