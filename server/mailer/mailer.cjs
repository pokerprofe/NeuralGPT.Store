const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname,'mail_queue.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function enqueueMail(mail){
  const list = load();
  const item = {
    id: Date.now(),
    from: 'wilfre@neuralgpt.store',
    to: mail.to,
    subject: mail.subject,
    body: mail.body,
    lang: mail.lang || 'en',
    status: 'queued',
    date: new Date().toISOString()
  };
  list.unshift(item);
  save(list);
  return item;
}

function listQueue(){
  return load();
}

module.exports = { enqueueMail, listQueue };
