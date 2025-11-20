const fs = require('fs');
const path = require('path');

const analyticsPath = path.join(__dirname, '../analytics.json');
const vendorsPath   = path.join(__dirname, '../database/vendors_inbox.enc');
const usersPath     = path.join(__dirname, '../database/users.json');
const subsPath      = path.join(__dirname, '../database/edo_users.json');
const modelsPath    = path.join(__dirname, '../database/models.json');

function readJSON(p){
  if(!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p)); }
  catch { return []; }
}

function decryptVendors(){
  if(!fs.existsSync(vendorsPath)) return [];
  const crypto = require('crypto');
  const KEY = 'neuralgpt_sellers_256_key__';
  const IV = Buffer.alloc(16, 0);

  const enc = fs.readFileSync(vendorsPath);
  const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
  let dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(dec.toString());
}

module.exports = (app)=>{

  app.get('/api/admin/analytics', (req,res)=>{

    const analytics = readJSON(analyticsPath);
    const users     = readJSON(usersPath);
    const subs      = readJSON(subsPath);
    const models    = readJSON(modelsPath);
    const vendors   = decryptVendors();

    const stats = {
      visits: analytics.reduce((t,x)=>t + (x.visits||0), 0),
      users: users.length,
      subscribers: subs.length,
      vendors: vendors.length,
      models: models.filter(m=>m.isActive).length,
      dailyTraffic: analytics.slice(-14) // últimos 14 días
    };

    res.json({ ok:true, stats });
  });

};
