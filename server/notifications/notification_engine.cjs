const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname,'..','data','notifications','notifications.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function push({ type, message, meta }){
  const list = load();
  const item = {
    id: Date.now(),
    date: new Date().toISOString(),
    type,
    message,
    meta: meta || {}
  };
  list.unshift(item);
  save(list);
  return item;
}

function list(limit=100){
  const list = load();
  return list.slice(0, limit);
}

module.exports = { push, list };
