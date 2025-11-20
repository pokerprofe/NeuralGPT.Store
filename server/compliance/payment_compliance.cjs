const fs = require('fs');
const path = require('path');
const DB = path.join(__dirname,'payment_compliance.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function setCompliance(vendorId, status, reason){
  const list = load();
  let item = list.find(x => String(x.vendorId) === String(vendorId));
  if(!item){
    item = { vendorId: String(vendorId), status: 'ok', reason: '' };
    list.push(item);
  }
  item.status = status || 'ok';
  item.reason = reason || '';
  save(list);
  return item;
}

function getCompliance(vendorId){
  const list = load();
  return list.find(x => String(x.vendorId) === String(vendorId)) || { vendorId:String(vendorId), status:'ok', reason:'' };
}

function listCompliance(){
  return load();
}

module.exports = { setCompliance, getCompliance, listCompliance };
