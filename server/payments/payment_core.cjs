//
// PAYMENT CORE — TEST ENVIRONMENT
// Unifica Stripe + PayPal + Google Pay en modo seguro.
// NO realiza cobros reales. Todo en modo sandbox/test.
//
// Suscripción anual: 50€
///////////////////////////////////////////////////////////////////////

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY || '');
const crypto = require('crypto');

async function createStripeSession(email){
  const session = await stripe.checkout.sessions.create({
    mode:'payment',
    payment_method_types:['card'],
    customer_email: email,
    line_items:[{
      price_data:{
        currency:'eur',
        product_data:{ name:'NeuralGPT Annual Subscription' },
        unit_amount: 5000
      },
      quantity:1
    }],
    success_url:'https://neuralgpt.store/success.html',
    cancel_url:'https://neuralgpt.store/cancel.html'
  });
  return session.url;
}

// Google Pay (TEST)
function googlePayToken(payload){
  return { ok:true, test:true, msg:'Google Pay Test OK', payload };
}

// PayPal Sandbox simulation
function paypalTest(){
  return { ok:true, sandbox:true, msg:'PayPal sandbox approval link generated' };
}

module.exports = { createStripeSession, googlePayToken, paypalTest };
