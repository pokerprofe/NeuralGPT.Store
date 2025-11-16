const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname,'enterprise_requests.json');

function load(){
  try{ return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch{ return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function score(entry){
  let s = 0;

  if(entry.company && entry.company.length >= 3) s += 10;
  if(entry.sector && entry.sector.length >= 3) s += 5;
  if(entry.size){
    const z = entry.size.toLowerCase();
    if(z.includes('50') || z.includes('100')) s += 10;
    if(z.includes('500')) s += 20;
    if(z.includes('1000')) s += 30;
  }

  if(entry.country){
    const trusted = ['spain','portugal','france','germany','usa','canada','japan','korea','uae','singapore'];
    if(trusted.includes(entry.country.toLowerCase())) s += 10;
  }

  if(entry.usecase && entry.usecase.length > 20) s += 10;
  if(entry.automation && entry.automation.length > 20) s += 10;

  return s;
}

function register(entry){
  const list = load();
  const sc = score(entry);

  const out = {
    id: Date.now(),
    ...entry,
    score: sc,
    tier: sc >= 60 ? 'platinum' : sc >= 40 ? 'gold' : 'standard',
    date: new Date().toISOString()
  };

  list.unshift(out);
  save(list);

  return out;
}

module.exports = { register, load };
