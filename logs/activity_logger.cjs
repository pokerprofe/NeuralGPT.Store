const fs = require('fs');
const path = require('path');
const DB = path.join(__dirname,'activity_log.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB)); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function log(event){
  const list = load();
  const entry = {
    id: Date.now(),
    type: event.type || 'event',
    detail: event.detail || '',
    user: event.user || 'system',
    ip: event.ip || '',
    date: new Date().toISOString()
  };
  list.unshift(entry);
  save(list);
  return entry;
}

function listAll(limit=200){
  const list = load();
  return list.slice(0,limit);
}

module.exports = { log, listAll };
