const fs = require('fs');
const crypto = require('crypto');
const ACT = require('../logs/activity_logger.cjs');

const DB = __dirname + '/users.json';

function load(){
  try{ return JSON.parse(fs.readFileSync(DB)); }
  catch{ return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function hash(pwd){
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

function registerUser(data){
  const list = load();

  const exists = list.find(u => u.email === data.email);
  if (exists) return { ok:false, error:'User exists' };

  const entry = {
    id: Date.now(),
    email: data.email,
    pass: hash(data.pass),
    created: new Date().toISOString(),
    role: "user",
    subscription: null
  };

  list.push(entry);
  save(list);

  ACT.log({
    type:"user_register",
    detail:"New user: "+data.email,
    user:"user_core"
  });

  return { ok:true, user:entry };
}

function loginUser(data){
  const list = load();
  const user = list.find(u => u.email === data.email);

  if(!user) return { ok:false };

  if(user.pass !== hash(data.pass)) return { ok:false };

  return { ok:true, user };
}

function allUsers(){
  return load();
}

module.exports = { registerUser, loginUser, allUsers };
