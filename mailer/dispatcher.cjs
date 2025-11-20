const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const queuePath = path.join(__dirname, 'mail_queue.json');

function loadQueue(){
  try { return JSON.parse(fs.readFileSync(queuePath, 'utf8')); }
  catch { return []; }
}

function saveQueue(list){
  fs.writeFileSync(queuePath, JSON.stringify(list, null, 2));
}

function createTransport(){
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if(!host || !user || !pass){
    throw new Error('SMTP configuration missing in .env');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

// Envía los mensajes con status = 'queued'
async function sendQueued(limit = 20){
  const list = loadQueue();
  const transporter = createTransport();

  let sent = 0;
  let errors = 0;

  for(const mail of list){
    if(mail.status !== 'queued') continue;
    if(sent >= limit) break;

    try{
      await transporter.sendMail({
        from: mail.from || 'wilfre@neuralgpt.store',
        to: mail.to,
        subject: mail.subject,
        text: mail.body
      });
      mail.status = 'sent';
      mail.sentAt = new Date().toISOString();
      sent++;
    }catch(e){
      mail.status = 'error';
      mail.error = String(e);
      errors++;
    }
  }

  saveQueue(list);
  return { sent, errors, total:list.length };
}

module.exports = { sendQueued };
