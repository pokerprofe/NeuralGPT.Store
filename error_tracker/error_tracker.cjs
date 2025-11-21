const fs = require('fs');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

const DB = path.join(__dirname,'errors.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB)); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function logError(err){
  const list = load();

  const item = {
    id: Date.now(),
    time: new Date().toISOString(),
    msg: err.msg || '',
    type: err.type || 'backend',
    file: err.file || '',
    stack: err.stack || ''
  };

  list.unshift(item);
  save(list);

  ACT.log({
    type:'error',
    detail:'Error captured: '+item.msg,
    user:'error_tracker'
  });

  return item;
}

function listErrors(){
  return load();
}

module.exports = { logError, listErrors };
