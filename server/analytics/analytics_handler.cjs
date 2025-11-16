const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'analytics.json');

function load(){
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

function save(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

function registerEvent(ev){
  const list = load();
  list.push({ ...ev, t: Date.now() });
  save(list);
  return true;
}

function getStats(){
  const list = load();
  const total = list.length;
  const last100 = list.slice(-100);
  return { total, last100 };
}

module.exports = { registerEvent, getStats };
