const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data', 'customers', 'customers.json');

function load(){
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

function save(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

function register(data){
  const list = load();
  const id = 'CUST-' + Date.now();
  list.push({ id, ...data, created: Date.now(), history: [] });
  save(list);
  return { ok:true, id };
}

function profile(id){
  return load().find(c=>c.id===id) || null;
}

function listAll(){
  return load();
}

module.exports = { register, profile, listAll };
