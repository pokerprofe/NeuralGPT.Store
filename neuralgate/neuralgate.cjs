//
// NEURALGATE — USER ACCESS LAYER
// Control universal de:
// – Autenticación
// – Roles (user, vendor, premium, enterprise, admin, root)
// – Idioma
// – Región
// – Estado de suscripción
//

const fs = require('fs');
const path = require('path');

const USERS = path.join(__dirname, '..', 'data', 'users_accounts.json');

function loadUsers(){
  try { return JSON.parse(fs.readFileSync(USERS,'utf8')); }
  catch { return []; }
}

function saveUsers(list){
  fs.writeFileSync(USERS, JSON.stringify(list,null,2));
}

function registerUser(data){
  const list = loadUsers();
  const exists = list.find(u => u.email === data.email);
  if(exists) return { ok:false, msg:'User already exists' };

  const obj = {
    email: data.email,
    pass: data.pass, 
    role: data.role || 'user',
    lang: data.lang || 'en',
    region: data.region || 'global',
    subscribed: data.subscribed || false,
    created: new Date().toISOString()
  };

  list.push(obj);
  saveUsers(list);
  return { ok:true };
}

function login(email,pass){
  const list = loadUsers();
  const u = list.find(x => x.email === email && x.pass === pass);
  if(!u) return null;
  return u;
}

module.exports = { loadUsers, saveUsers, registerUser, login };
