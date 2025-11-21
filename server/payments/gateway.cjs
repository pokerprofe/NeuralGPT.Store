const fs = require('fs');
const path = require('path');
const SUBS = require('../subscriptions/subscriptions.cjs');

// Carga del .env pero sin claves LIVE
function env(name){
  return process.env[name] || '';
}

// Objeto de validación
function checkKeys(){
  return {
    stripe: !!env('STRIPE_SECRET_KEY'),
    paypal: !!env('PAYPAL_CLIENT_ID'),
    googlepay: !!env('GPAY_MERCHANT_ID')
  };
}

// Crear suscripción tras pago exitoso (modo TEST)
function createTestSubscription(email){
  return SUBS.createSubscription({
    email,
    planId: 'neuralgpt_annual',
    source: 'test_payment'
  });
}

// STRIPE — modo TEST
function stripeIntent(amountCents, email){
  if(!env('STRIPE_SECRET_KEY')){
    return { test:true, message:'Stripe TEST mode. LIVE key missing.' };
  }
  return {
    ok:true,
    type:'stripe',
    clientSecret:'test_secret_'+Date.now(),
    email
  };
}

// PAYPAL — modo TEST
function paypalOrder(amount, email){
  if(!env('PAYPAL_CLIENT_ID')){
    return { test:true, message:'PayPal TEST mode. LIVE key missing.' };
  }
  return {
    ok:true,
    type:'paypal',
    orderId:'PAYPAL_TEST_'+Date.now(),
    email
  };
}

// Google Pay — modo TEST
function googlePaySession(amount, email){
  if(!env('GPAY_MERCHANT_ID')){
    return { test:true, message:'GooglePay TEST mode. LIVE key missing.' };
  }
  return {
    ok:true,
    type:'googlepay',
    token:'GPAY_TEST_'+Date.now(),
    email
  };
}

module.exports = {
  checkKeys,
  createTestSubscription,
  stripeIntent,
  paypalOrder,
  googlePaySession
};
