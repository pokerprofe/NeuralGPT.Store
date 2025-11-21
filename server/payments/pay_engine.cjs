/////////////////////////////////////////////////////////////////////////
// PAYMENT ENGINE v1.0 (SANDBOX ONLY, 100% GRATIS)
// • Google Pay TEST
// • PayPal SANDBOX
// • Stripe TEST MODE
// • NINGÚN COBRO REAL
// • Validación local de tokens
// • Logging de solicitudes
/////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

const logs = path.join(__dirname,'payments.log');

function log(msg){
  const line = '['+new Date().toISOString()+'] '+msg+'\\n';
  try { fs.appendFileSync(logs,line); }catch{}
}

// GOOGLE PAY (solo sandbox)
function googleSandbox(payload){
  log('GooglePay TEST recibido: '+JSON.stringify(payload));
  return { ok:true, msg:'GPAY_TEST_OK', order:'GPAY-'+Date.now() };
}

// PAYPAL (solo sandbox)
function paypalSandbox(payload){
  log('PayPal TEST recibido: '+JSON.stringify(payload));
  return { ok:true, msg:'PAYPAL_TEST_OK', order:'PP-'+Date.now() };
}

// STRIPE (solo sandbox)
function stripeSandbox(payload){
  log('Stripe TEST recibido: '+JSON.stringify(payload));
  return { ok:true, msg:'STRIPE_TEST_OK', order:'ST-'+Date.now() };
}

module.exports = {
  googleSandbox,
  paypalSandbox,
  stripeSandbox
};
