const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const KEY = 'neuralgpt_sellers_256_key__';
const IV = Buffer.alloc(16, 0);

const inboxPath = path.join(__dirname, '../database/vendors_inbox.enc');

function decrypt(){
  if(!fs.existsSync(inboxPath)) return [];
  const enc = fs.readFileSync(inboxPath);
  const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
  let dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return JSON.parse(dec.toString());
}

function encrypt(data){
  const cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
  fs.writeFileSync(inboxPath, enc);
}

module.exports = (app)=>{
  app.get('/api/admin/vendors', (req,res)=>{
    const list = decrypt();
    res.json({ ok:true, vendors:list });
  });

  app.post('/api/admin/vendors/mark', (req,res)=>{
    const list = decrypt();
    const id = req.body.id;
    const updated = list.filter(v=>v.id !== id);
    encrypt(updated);
    res.json({ ok:true });
  });
};
