const fs = require('fs');
const path = require('path');

const DB_CLICKS = path.join(__dirname,'..','data','inventoryless','clicks.json');
const DB_PROD   = path.join(__dirname,'..','data','vendors','vendor_products.json');
const DB_VEND   = path.join(__dirname,'..','data','vendors','vendors.json');

function load(file){
  try { return JSON.parse(fs.readFileSync(file,'utf8')); }
  catch { return []; }
}
function save(file,data){
  fs.writeFileSync(file, JSON.stringify(data,null,2));
}

// Registrar clic hacia proveedor
function registerClick(productId){
  const clicks = load(DB_CLICKS);
  const entry = {
    id: Date.now(),
    productId,
    date: new Date().toISOString()
  };
  clicks.unshift(entry);
  save(DB_CLICKS,clicks);
  return entry;
}

// Resolver enlace
function resolveLink(productId){
  const prods = load(DB_PROD);
  const p = prods.find(x => String(x.id) === String(productId));
  if(!p) return null;

  return { link: p.link };
}

// Guardar comisión básica (local)
function commission(productId, amount){
  const vendors = load(DB_VEND);
  const prods   = load(DB_PROD);

  const p = prods.find(x => String(x.id) === String(productId));
  if(!p) return null;

  const v = vendors.find(x => x.id === p.vendorId);
  if(!v) return null;

  v.balance = (v.balance || 0) + amount;
  save(DB_VEND, vendors);

  return { vendorId:v.id, newBalance:v.balance };
}

module.exports = { registerClick, resolveLink, commission };
