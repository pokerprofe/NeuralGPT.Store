const fs = require('fs');
const path = require('path');

// Bases existentes del sistema
const PROD_DB = path.join(__dirname,'..','data','vendors','vendor_products.json');
const VEND_DB = path.join(__dirname,'..','data','vendors','vendors.json');
const TREND_DB = path.join(__dirname,'..','data','neuroanalytics','market_trends.json');

function loadProducts(){
  try { return JSON.parse(fs.readFileSync(PROD_DB,'utf8')); }
  catch { return []; }
}
function loadVendors(){
  try { return JSON.parse(fs.readFileSync(VEND_DB,'utf8')); }
  catch { return []; }
}
function loadTrends(){
  try { return JSON.parse(fs.readFileSync(TREND_DB,'utf8')); }
  catch { return []; }
}
function saveTrends(list){
  fs.writeFileSync(TREND_DB, JSON.stringify(list,null,2));
}

function analyze(){
  const prods = loadProducts();
  const vend  = loadVendors();
  const now   = new Date();

  let categories = {};
  let vendors = {};
  let markets = {};

  prods.forEach(p=>{
    // categoría
    const c = (p.category || 'unknown').toLowerCase();
    categories[c] = (categories[c] || 0) + 1;

    // vendor
    const v = vend.find(x=>String(x.id) === String(p.vendorId));
    if(v){
      vendors[v.name] = (vendors[v.name] || 0) + 1;

      // país del vendor → tendencias de mercado
      const country = (v.country || 'unknown').toLowerCase();
      markets[country] = (markets[country] || 0) + 1;
    }
  });

  const trend = {
    date: now.toISOString(),
    categories,
    vendors,
    markets
  };

  const logs = loadTrends();
  logs.unshift(trend);
  saveTrends(logs);

  return trend;
}

function getLatest(){
  const logs = loadTrends();
  return logs[0] || null;
}

module.exports = { analyze, getLatest };
