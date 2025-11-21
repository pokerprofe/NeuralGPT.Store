//// =============================================================
// IRENE_NOTIFY v1 — Núcleo de avisos y correo masivo local
// Sólo usa disco y sendmail local (nodemailer sendmail:true).
// No depende de APIs externas ni credenciales de terceros.
// =============================================================

const fs   = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Helpers seguros -----------------------------
function readJsonSafe(file){
  try{
    const full = path.join(DATA_DIR, file);
    if(!fs.existsSync(full)) return [];
    const txt = fs.readFileSync(full, 'utf8');
    return JSON.parse(txt || '[]');
  }catch(e){
    console.error('IRENE_NOTIFY readJsonSafe error:', file, e.message || e);
    return [];
  }
}

function logIrene(msg, extra){
  try{
    const logFile = path.join(DATA_DIR, 'irene_notify.log');
    const line = '['+new Date().toISOString()+'] ' + msg + (extra ? ' ' + JSON.stringify(extra) : '');
    fs.appendFileSync(logFile, line + '\\n', 'utf8');
  }catch(e){
    console.error('IRENE_NOTIFY log error:', e.message || e);
  }
}

// Transport básico (sendmail local) ----------
let transport = null;
function getTransport(){
  if(!transport){
    transport = nodemailer.createTransport({ sendmail: true });
  }
  return transport;
}

// Construir audiencias -----------------------
function loadAudience(segment){
  const subs       = readJsonSafe('subscriptions.json');     // {email, plan, expiresAt, ...}
  const vendors    = readJsonSafe('vendors.json');           // {email, ...}
  const affiliates = readJsonSafe('affiliates.json');        // {email, ...}
  const customers  = readJsonSafe('customers.json');         // {email, ...}

  let list = [];

  switch((segment || 'all').toLowerCase()){
    case 'vendors':
      list = vendors;
      break;
    case 'affiliates':
      list = affiliates;
      break;
    case 'customers':
      list = customers;
      break;
    case 'subscribers':
      list = subs;
      break;
    case 'all':
    default:
      list = [].concat(subs, vendors, affiliates, customers);
      break;
  }

  // Normalizar a sólo {email}
  const seen = new Set();
  const out = [];
  for(const x of list){
    const em = (x && x.email || '').trim().toLowerCase();
    if(!em || seen.has(em)) continue;
    seen.add(em);
    out.push({ email: em });
  }
  return out;
}

// Envío real ---------------------------------
async function sendOne(to, subject, text){
  if(!to) return false;
  const t = getTransport();
  const mail = {
    from: 'neuralgpt.store <no-reply@neuralgpt.local>',
    to,
    subject,
    text
  };
  try{
    await t.sendMail(mail);
    logIrene('MAIL_SENT', { to, subject });
    return true;
  }catch(e){
    logIrene('MAIL_ERROR', { to, subject, err: e.message || String(e) });
    return false;
  }
}

// API principal ------------------------------

// 1) Broadcast manual (tú mandas asunto/texto y segmento)
async function broadcast({ segment, subject, message }){
  subject = subject || 'NeuralGPT.Store — Aviso';
  message = message || '(sin contenido)';
  const audience = loadAudience(segment);

  let ok = 0, fail = 0;
  for(const u of audience){
    const done = await sendOne(u.email, subject, message);
    if(done) ok++; else fail++;
  }
  return { total: audience.length, ok, fail };
}

// 2) Buscar suscripciones que vencen en X días
function findExpiring(daysAhead){
  const subs = readJsonSafe('subscriptions.json'); // {email, plan, expiresAt}
  const out = [];
  const now = Date.now();
  const LIM = now + (daysAhead * 24*60*60*1000);

  for(const s of subs){
    if(!s || !s.email || !s.expiresAt) continue;
    const t = Date.parse(s.expiresAt);
    if(isNaN(t)) continue;
    if(t >= now && t <= LIM){
      out.push(s);
    }
  }
  return out;
}

// 3) Buscar comisiones pendientes de pago
function findUnpaidCommissions(){
  const com = readJsonSafe('commissions.json'); // {email, amount, status}
  return com.filter(c => (c.status || '').toLowerCase() !== 'paid');
}

// 4) Generar avisos textuales (sin mandar aún)
function buildReminders(daysAhead){
  const exp = findExpiring(daysAhead || 7);
  const due = findUnpaidCommissions();
  return { expiring: exp, unpaid: due };
}

// 5) Enviar correos de recuerdo (suscripciones + comisiones)
async function sendReminders({ daysAhead, sendEmails }){
  const { expiring, unpaid } = buildReminders(daysAhead || 7);

  let ok = 0, fail = 0;

  if(sendEmails){
    // Suscripciones por caducar
    for(const s of expiring){
      const txt = 
        'Hola,\\n\\n' +
        'Tu suscripción en NeuralGPT.Store está próxima a vencer ('+(s.expiresAt||'fecha desconocida')+').\\n' +
        'Si quieres seguir disfrutando del acceso premium, renueva antes de la fecha límite.\\n\\n' +
        'Un abrazo,\\nIrene · NeuralGPT.Store';
      const done = await sendOne(s.email, 'Tu suscripción está a punto de vencer', txt);
      if(done) ok++; else fail++;
    }

    // Comisiones pendientes (afiliados / vendors que no han pagado)
    for(const c of unpaid){
      const txt = 
        'Hola,\\n\\n' +
        'Tienes comisiones pendientes con NeuralGPT.Store por un importe aproximado de ' + (c.amount || 'N/A') + '.\\n' +
        'Por favor, regulariza la situación para mantener activo el acuerdo de colaboración.\\n\\n' +
        'Irene · NeuralGPT.Store';
      const done = await sendOne(c.email, 'Recordatorio de comisiones pendientes', txt);
      if(done) ok++; else fail++;
    }
  }

  logIrene('REMINDER_RUN', { expiring: expiring.length, unpaid: unpaid.length, sent: ok, failed: fail });

  return {
    expiring: expiring.length,
    unpaid: unpaid.length,
    sent: ok,
    failed: fail
  };
}

module.exports = {
  broadcast,
  buildReminders,
  sendReminders
};
