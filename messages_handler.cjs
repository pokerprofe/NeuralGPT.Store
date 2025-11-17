const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data', 'messages', 'messages.json');

function load(){
  return JSON.parse(fs.readFileSync(file));
}

function save(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

function sendMessage(data){
  const list = load();
  const id = 'MSG-' + Date.now();
  list.push({ id, ...data, created: Date.now(), read:false });
  save(list);
  return { ok:true, id };
}

function listAll(){
  return load().sort((a,b)=>b.created - a.created);
}

function markRead(id){
  const list = load();
  const m = list.find(x=>x.id===id);
  if(m){ m.read = true; save(list); return {ok:true}; }
  return {ok:false};
}

module.exports = { sendMessage, listAll, markRead };
