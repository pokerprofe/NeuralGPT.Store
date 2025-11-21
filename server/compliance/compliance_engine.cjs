const fs = require('fs');
const path = require('path');

const DB_VEND = path.join(__dirname,'..','data','vendors','vendors.json');
const DB_LOG  = path.join(__dirname,'..','data','compliance','compliance_logs.json');

function loadVendors(){
  try { return JSON.parse(fs.readFileSync(DB_VEND,'utf8')); }
  catch { return []; }
}
function saveVendors(list){
  fs.writeFileSync(DB_VEND, JSON.stringify(list,null,2));
}

function loadLogs(){
  try { return JSON.parse(fs.readFileSync(DB_LOG,'utf8')); }
  catch { return []; }
}
function saveLogs(list){
  fs.writeFileSync(DB_LOG, JSON.stringify(list,null,2));
}

function registerLog(entry){
  const logs = loadLogs();
  logs.unshift(entry);
  saveLogs(logs);
}

function runCompliance(){
  const vendors = loadVendors();
  const now = new Date();

  let summary = [];

  vendors.forEach(v => {
    // Regla 1: comisiones negativas (no pagadas)
    if(v.balance < 0 && !v.blocked){
      v.blocked = true;

      registerLog({
        date: now.toISOString(),
        vendorId: v.id,
        issue: 'commission_unpaid',
        action: 'auto_block',
        balance: v.balance
      });
    }

    // Regla 2: proveedor inactivo durante > 6 meses
    const created = new Date(v.created);
    const diff = (now - created) / (1000*60*60*24*30);

    if(diff > 6 && !v.blocked){
      registerLog({
        date: now.toISOString(),
        vendorId: v.id,
        issue: 'long_inactivity',
        action: 'warn_only'
      });
    }

    summary.push({
      id: v.id,
      name: v.name,
      blocked: v.blocked,
      balance: v.balance
    });
  });

  saveVendors(vendors);
  return summary;
}

module.exports = { runCompliance, registerLog };
