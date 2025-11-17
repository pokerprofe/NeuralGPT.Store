const fs = require('fs');
const path = require('path');
const DB = path.join(__dirname,'enterprise_requests.json');

function load(){ try { return JSON.parse(fs.readFileSync(DB,'utf8')); } catch { return []; } }
function save(x){ fs.writeFileSync(DB, JSON.stringify(x,null,2)); }

function registerEnterprise(req){
  const list = load();
  const obj = {
    company: req.company,
    email: req.email,
    size: req.size,
    sector: req.sector,
    country: req.country,
    project: req.project,
    budget: req.budget,
    status: 'pending',
    score: calcScore(req),
    date: Date.now()
  };
  list.push(obj);
  save(list);
  return obj;
}

function calcScore(r){
  let s = 100;
  if(!r.company) s -= 15;
  if(!r.email) s -= 20;
  if(r.budget && r.budget < 5000) s -= 30;
  if(r.size === 'small') s -= 10;
  if(r.size === 'startup') s -= 5;
  return s;
}

module.exports = { registerEnterprise, load };
