const VEND = require('../vendors/vendor_engine.cjs');

// Categorías base (pueden expandirse)
const CATS = {
  robotics: ['robot','servo','motor','arm','sensor','lidar'],
  chips: ['chip','microcontroller','ic','fpga','asic'],
  'pc parts': ['gpu','cpu','ssd','cooler','motherboard'],
  networking: ['router','switch','ethernet','antenna'],
  industrial: ['relay','pwm','controller','automation'],
  tools: ['solder','multimeter','tool','precision'],
  ai: ['neural','ai','ml','edge','accelerator'],
};

// Detect category by keywords
function autoCategory(name, desc){
  const text = (name + ' ' + desc).toLowerCase();
  for(const cat in CATS){
    if(CATS[cat].some(k => text.includes(k))) return cat;
  }
  return 'general-tech';
}

// Basic cleanup
function clean(t){
  if(!t) return '';
  return t.replace(/\s+/g,' ').trim();
}

// Format a raw product object
function formatRaw(raw){
  const name = clean(raw.name || raw.title || '');
  const desc = clean(raw.desc || raw.description || '');
  const price = Number(raw.price || 0);
  const img = raw.img || raw.image || '';
  const link = raw.link || raw.url || '';

  const category = autoCategory(name, desc);

  return {
    name,
    desc,
    price: isNaN(price) ? 0 : price,
    img,
    link,
    category
  };
}

// Process and add product using vendor API key
function processAndAdd(apiKey, raw){
  const formatted = formatRaw(raw);
  return VEND.addProduct(apiKey, formatted);
}

module.exports = { formatRaw, processAndAdd };
