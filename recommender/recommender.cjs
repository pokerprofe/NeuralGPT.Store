const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const EVENTS_FILE = path.join(DATA_DIR, 'user_events.json');

function loadProducts(){
  try { return JSON.parse(fs.readFileSync(PRODUCTS_FILE,'utf8')); }
  catch { return []; }
}

function loadEvents(){
  try { return JSON.parse(fs.readFileSync(EVENTS_FILE,'utf8')); }
  catch { return []; }
}

function saveEvents(list){
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(list,null,2));
}

// Registra un evento de usuario (view, click, favorite, etc.)
function trackEvent(e){
  const list = loadEvents();
  list.push({
    userId: e.userId || 'anonymous',
    productId: e.productId || null,
    type: e.type || 'view',
    date: Date.now()
  });
  saveEvents(list);
  return { ok:true };
}

// Ranking de popularidad general por producto
function getPopularityMap(){
  const events = loadEvents();
  const map = {};
  for(const ev of events){
    if(!ev.productId) continue;
    map[ev.productId] = (map[ev.productId] || 0) + 1;
  }
  return map;
}

// Recomendaciones basadas en un producto (similar category + tags)
function recommendByProduct(productId, limit=8){
  const products = loadProducts();
  const pop = getPopularityMap();
  const base = products.find(p => String(p.id) === String(productId));
  if(!base) return [];

  const baseCat = base.category || '';
  const baseTags = (base.tags || []).map(t=>String(t).toLowerCase());

  const scored = products
    .filter(p => String(p.id) !== String(productId))
    .map(p => {
      let score = 0;
      if(p.category === baseCat) score += 40;

      const tags = (p.tags || []).map(t=>String(t).toLowerCase());
      const common = tags.filter(t => baseTags.includes(t)).length;
      score += common * 10;

      score += (pop[p.id] || 0); // popularidad
      return { product:p, score };
    })
    .sort((a,b)=> b.score - a.score)
    .slice(0, limit)
    .map(x => x.product);

  return scored;
}

// Recomendaciones para un usuario concreto (categorías favoritas)
function recommendByUser(userId, limit=8){
  const products = loadProducts();
  const events = loadEvents().filter(e => e.userId === userId);
  if(events.length === 0) return []; // sin historial

  const catCount = {};
  for(const ev of events){
    const p = products.find(x => String(x.id) === String(ev.productId));
    if(!p || !p.category) continue;
    catCount[p.category] = (catCount[p.category] || 0) + 1;
  }

  const favCats = Object.entries(catCount)
    .sort((a,b)=>b[1]-a[1])
    .map(e=>e[0]);

  const pop = getPopularityMap();

  const scored = products
    .map(p => {
      let score = 0;
      if(favCats.includes(p.category)) score += 40;
      score += (pop[p.id] || 0);
      return { product:p, score };
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0, limit)
    .map(x=>x.product);

  return scored;
}

module.exports = { trackEvent, recommendByProduct, recommendByUser };
