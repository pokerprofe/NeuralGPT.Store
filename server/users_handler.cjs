const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data', 'users', 'users.json');

function load(){
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

function save(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

function add(data){
  const list = load();
  const id = 'USR-' + Date.now();
  list.push({ id, ...data, created: Date.now() });
  save(list);
  return { ok:true, id };
}

function listAll(){
  return load();
}

function find(email){
  return load().find(u=>u.email===email);
}

module.exports = { add, listAll, find };
