const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname,'blocked_ips.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB)); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function isBadIp(ip){
  const list = load();
  return list.includes(ip);
}

function addBadIp(ip){
  const list = load();
  if(!list.includes(ip)){
    list.push(ip);
    save(list);
  }
}

function looksLikeVPN(req){
  const h = req.headers;
  const flags = [
    'x-forwarded-for',
    'via',
    'x-real-ip',
    'cf-connecting-ip',
    'fly-client-ip'
  ];

  return flags.some(f => h[f] !== undefined);
}

function looksLikeBot(req){
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const bad = ['curl','wget','python','bot','scraper','headless'];
  return bad.some(b => ua.includes(b));
}

module.exports = { isBadIp, addBadIp, looksLikeVPN, looksLikeBot };
