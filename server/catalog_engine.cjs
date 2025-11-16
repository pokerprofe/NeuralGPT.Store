const fs = require('fs');
const path = require('path');

const file = path.join(__dirname,'..','data','catalog.json');

function load(){
  try { return JSON.parse(fs.readFileSync(file)); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(file, JSON.stringify(list,null,2));
}

function listProducts(){
  return load();
}

function addProduct(p){
  const list = load();
  const item = {
    id: Date.now(),
    name: p.name || 'Unnamed',
    description: p.description || '',
    price: p.price || 0,
    link: p.link || '',
    image: p.image || '',
    category: p.category || 'general',
    vendor: p.vendor || 'unknown',
    created: new Date().toISOString()
  };
  list.unshift(item);
  save(list);
  return item;
}

function updateProduct(id,data){
  const list = load();
  const item = list.find(x=>String(x.id)===String(id));
  if(!item) return null;

  for(let k in data){
    if(data[k]!==undefined){
      item[k] = data[k];
    }
  }

  save(list);
  return item;
}

module.exports = { listProducts, addProduct, updateProduct };
