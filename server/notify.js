const fs = require('fs');
const path = require('path');

const LOG = path.join(__dirname, '../logs/notify.log');
const FEED = path.join(__dirname, '../database/notify_feed.json');
const MAIL_CFG = path.join(__dirname, '../database/mail_config.json');
const MAIL_QUEUE = path.join(__dirname, '../database/email_queue.json');
const WA_QUEUE = path.join(__dirname, '../database/whatsapp_queue.json');

function ensureDir(p){
  const d = path.dirname(p);
  if (!fs.existsSync(d)){ fs.mkdirSync(d, { recursive:true }); }
}

function log(msg){
  ensureDir(LOG);
  const line = new Date().toISOString() + ' :: ' + msg + "\n";
  fs.appendFileSync(LOG, line);
}

function readJson(p, defVal){
  try{
    if(!fs.existsSync(p)) return defVal;
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw || 'null') || defVal;
  }catch(e){
    return defVal;
  }
}

function writeJson(p, data){
  ensureDir(p);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function pushFeed(ev){
  const now = new Date().toISOString();
  const full = Object.assign({ time: now }, ev);
  let list = readJson(FEED, []);
  list.push(full);
  if(list.length > 100){ list = list.slice(-100); }
  writeJson(FEED, list);
}

function queueMailForSale(ev){
  if(ev.type !== 'sale') return;

  let cfg = readJson(MAIL_CFG, {
    to: "willfre@neuralgpt.store",
    currency: "EUR"
  });
  writeJson(MAIL_CFG, cfg);

  let queue = readJson(MAIL_QUEUE, []);
  queue.push({
    time: new Date().toISOString(),
    to: cfg.to,
    subject: "[NeuralGPT.Store] New sale",
    payload: ev
  });
  writeJson(MAIL_QUEUE, queue);
  log("SALE queued for mail to " + cfg.to);
}

function queueWhatsApp(ev){
  if(ev.type !== 'vendor' && ev.type !== 'advertiser') return;
  let queue = readJson(WA_QUEUE, []);
  queue.push({
    time: new Date().toISOString(),
    channel: "whatsapp",
    payload: ev
  });
  writeJson(WA_QUEUE, queue);
  log("WA event queued (" + ev.type + ")");
}

function handleEvent(ev){
  pushFeed(ev);
  queueMailForSale(ev);
  queueWhatsApp(ev);
}

module.exports = (app) => {

  app.post('/api/admin/notify', (req, res) => {
    const body = req.body || {};
    const ev = {
      type: body.type || 'generic',
      message: body.message || '',
      meta: body.meta || {}
    };
    handleEvent(ev);
    res.json({ ok:true });
  });

  app.post('/api/admin/notify/vendor', (req, res) => {
    const body = req.body || {};
    handleEvent({
      type: 'vendor',
      message: body.message || 'New vendor contact',
      meta: body.meta || {}
    });
    res.json({ ok:true });
  });

  app.post('/api/admin/notify/advertiser', (req, res) => {
    const body = req.body || {};
    handleEvent({
      type: 'advertiser',
      message: body.message || 'New advertiser contact',
      meta: body.meta || {}
    });
    res.json({ ok:true });
  });

  app.post('/api/admin/notify/sale', (req, res) => {
    const body = req.body || {};
    handleEvent({
      type: 'sale',
      message: body.message || 'New sale',
      meta: body.meta || {}
    });
    res.json({ ok:true });
  });

  app.get('/api/admin/notify/feed', (req, res) => {
    const list = readJson(FEED, []);
    res.json({ ok:true, events:list });
  });

  log("Notify module loaded.");
};
