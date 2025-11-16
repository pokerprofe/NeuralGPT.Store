const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data', 'products.json');

function load(){
  return JSON.parse(fs.readFileSync(file));
}

function save(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

function add(prod){
  const list = load();
  const id = Date.now();
  list.push({ id, ...prod });
  save(list);
  return { ok:true, id };
}

module.exports = { load, add };
