const fs = require('fs');
const path = require('path');

// Bases de datos del sistema
const DB_VEND   = path.join(__dirname,'..','data','vendors','vendors.json');
const DB_PROD   = path.join(__dirname,'..','data','vendors','vendor_products.json');
const DB_SUBS   = path.join(__dirname,'..','data','subscriptions','subscriptions.json');
const DB_PROS   = path.join(__dirname,'..','b2b','vendor_prospects.json');
const DB_TRENDS = path.join(__dirname,'..','data','neuroanalytics','market_trends.json');

function load(file){
  try { return JSON.parse(fs.readFileSync(file,'utf8')); }
  catch { return []; }
}

function match(obj, term){
  const t = term.toLowerCase();
  return Object.values(obj).some(v =>
    typeof v === 'string' && v.toLowerCase().includes(t)
  );
}

function search(term){
  const vendors   = load(DB_VEND);
  const products  = load(DB_PROD);
  const subs      = load(DB_SUBS);
  const prospects = load(DB_PROS);
  const trends    = load(DB_TRENDS);

  return {
    vendors:   vendors.filter(v => match(v, term)),
    products:  products.filter(p => match(p, term)),
    subs:      subs.filter(s => match(s, term)),
    prospects: prospects.filter(p => match(p, term)),
    trends:    trends.slice(0,5)
  };
}

module.exports = { search };
