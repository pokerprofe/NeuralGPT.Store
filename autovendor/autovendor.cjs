const fs = require('fs');
const path = require('path');
const https = require('https');

const INVENTORY = path.join(__dirname,'..','data','inventory','inventory.json');
const VENDOR_DB = path.join(__dirname,'..','vendor_engine','vendor_scores.json');
const COMPLIANCE = require('../compliance/payment_compliance.cjs');

function loadInventory(){
  try { return JSON.parse(fs.readFileSync(INVENTORY,'utf8')); }
  catch { return []; }
}

function saveInventory(list){
  fs.writeFileSync(INVENTORY, JSON.stringify(list,null,2));
}

function loadVendors(){
  try { return JSON.parse(fs.readFileSync(VENDOR_DB,'utf8')); }
  catch { return []; }
}

function download(url){
  return new Promise((resolve,reject)=>{
    https.get(url,res=>{
      let data='';
      res.on('data',chunk=>data+=chunk);
      res.on('end',()=>resolve(data));
    }).on('error',reject);
  });
}

function parseCSV(raw){
  const lines = raw.split(/\\r?\\n/).map(l=>l.trim()).filter(Boolean);
  if(lines.length === 0) return [];
  const header = lines.shift().split(',');
  return lines.map(l=>{
    const parts = l.split(',');
    let obj = {};
    header.forEach((h,i)=> obj[h.trim()] = parts[i] ? parts[i].trim() : '');
    return obj;
  });
}

async function ingestCatalog({ vendorId, method, payload }){
  let content = '';

  if(method === 'json' || method === 'csv'){
    content = payload || '';
  } else if(method === 'url'){
    content = await download(payload);
  }

  let items = [];

  try{
    if(method === 'json' || (method === 'url' && (payload || '').endsWith('.json'))){
      items = JSON.parse(content);
    } else if(method === 'csv' || (payload || '').endsWith('.csv')){
      items = parseCSV(content);
    }
  }catch(e){
    return { ok:false, error:'Invalid catalog format' };
  }

  const inv = loadInventory();
  const time = new Date().toISOString();

  const enriched = items.map(p=>({
    id: Date.now() + Math.floor(Math.random()*99999),
    vendorId: String(vendorId),
    name: p.name || p.title || 'Unnamed Product',
    price: p.price || 'N/A',
    currency: p.currency || 'EUR',
    link: p.link || '',
    img: p.img || '',
    spec: p.spec || p.description || '',
    date: time
  }));

  inv.push(...enriched);
  saveInventory(inv);

  return { ok:true, count: enriched.length };
}

// Genera tarjetas HTML pero omite vendors bloqueados
function generateCardsHTML(){
  const inv = loadInventory();
  let html = '';
  for(const p of inv){
    const c = COMPLIANCE.getCompliance(p.vendorId);
    if(c.status === 'blocked') continue; // productos ocultos si no paga

    html += 
<div class="product-card">
  <img src="" alt="">
  <h3></h3>
  <p>...</p>
  <span class="price"> </span>
  <a href="" target="_blank" class="btn">View Product</a>
</div>
    ;
  }
  return html;
}

module.exports = {
  ingestCatalog,
  generateCardsHTML
};
