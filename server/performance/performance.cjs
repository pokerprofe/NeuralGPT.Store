const fs = require('fs');
const os = require('os');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

const DB = path.join(__dirname,'performance.json');

function load(){
  try{ return JSON.parse(fs.readFileSync(DB)); }
  catch{ return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function capture(){
  const list = load();

  const entry = {
    time: new Date().toISOString(),
    cpu_load: os.loadavg()[0],
    free_mem: os.freemem(),
    total_mem: os.totalmem(),
    ram_usage: 1 - (os.freemem() / os.totalmem())
  };

  list.unshift(entry);
  save(list);

  ACT.log({
    type:'performance',
    detail:CPU: RAM:%,
    user:'performance_engine'
  });

  return entry;
}

function getHistory(){
  return load().slice(0,200);
}

module.exports = { capture, getHistory };
