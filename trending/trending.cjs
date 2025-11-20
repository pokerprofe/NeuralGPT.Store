const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname,'..','data');
const EVENTS = path.join(DATA,'user_events.json');
const PRODUCTS = path.join(DATA,'products.json');

function loadEvents(){
  try { return JSON.parse(fs.readFileSync(EVENTS)); }
  catch { return []; }
}

function loadProducts(){
  try { return JSON.parse(fs.readFileSync(PRODUCTS)); }
  catch { return []; }
}

// Calcular tendencia global
function trending(limit=10){
  const events = loadEvents();
  const products = loadProducts();

  const last24 = Date.now() - (24*60*60*1000);

  const map = {};

  for(const ev of events){
    if(!ev.productId) continue;
    if(ev.date > last24){
      map[ev.productId] = (map[ev.productId] || 0) + 1;
    }
  }

  const scored = Object.entries(map)
    .map(([id,score])=>{
      const p = products.find(x=>String(x.id)===String(id));
      if(!p) return null;
      return { product:p, score };
    })
    .filter(Boolean)
    .sort((a,b)=>b.score - a.score)
    .slice(0,limit)
    .map(x=>x.product);

  return scored;
}

module.exports = { trending };
