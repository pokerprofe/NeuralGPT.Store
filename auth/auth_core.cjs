const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

const DB = path.join(__dirname,'sessions.json');
const SECRET = 'NeuralGPT-LocalKey-OnlyYours';

function load(){
  try{ return JSON.parse(fs.readFileSync(DB)); }
  catch{ return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function createToken(email){
  const raw = email + '|' + Date.now() + '|' + SECRET;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function createSession(user){
  const list = load();
  const token = createToken(user.email);

  const session = {
    token,
    email: user.email,
    role: user.role,
    created: new Date().toISOString()
  };

  list.unshift(session);
  save(list);

  ACT.log({
    type:'auth',
    detail:'Session created for: '+user.email,
    user:'auth_core'
  });

  return session;
}

function validate(token){
  const list = load();
  const session = list.find(s => s.token === token);
  return session || null;
}

function requireRole(role){
  return function(req,res,next){
    const token = req.headers['x-session'];
    const s = validate(token);

    if(!s) return res.status(401).json({ ok:false, error:'no-session' });
    if(s.role !== role && s.role !== 'superadmin')
      return res.status(403).json({ ok:false, error:'forbidden' });

    next();
  }
}

module.exports = { createSession, validate, requireRole };
