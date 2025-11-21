/*
  server_example/index.js - ejemplo de servidor para crear Stripe Checkout + Webhook (Node.js)
  PARA USAR:
    - npm init -y
    - npm i express stripe body-parser @sendgrid/mail
    - configurar .env con STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SENDGRID_API_KEY, FROM_EMAIL, BASE_URL
    - desplegar en Heroku/Render/Vercel(Servidor) o como función y adaptar rutas
*/
require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sg = require('@sendgrid/mail');
sg.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

// crea sesión de checkout
app.post('/server/create-checkout-session', async (req,res)=>{
  try {
    const { productId } = req.body;
    // lee productos desde disco (en producción hazlo desde BD)
    const path = require('path');
    const fs = require('fs');
    const models = JSON.parse(fs.readFileSync(path.join(__dirname,'..','dashboard','data','models.json')));
    const prod = models.find(p=>p.id===productId);
    if(!prod) return res.status(400).json({error:'Producto no encontrado'});

    // precio: aplicamos IVA aquí si quieres (ej: 21%)
    const IVA = 0.21;
    const amount = Math.round((prod.price * (1 + IVA)) * 100); // valor en céntimos - ejemplo EUR

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: prod.title, description: prod.desc },
          unit_amount: amount,
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: (process.env.BASE_URL || 'https://yourdomain.com') + '/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: (process.env.BASE_URL || 'https://yourdomain.com') + '/cancel.html',
      metadata: { productId: prod.id }
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e); res.status(500).json({ error: e.message });
  }
});

// webhook de stripe: en checkout.session.completed envia email con link
app.post('/server/webhook', express.raw({type:'application/json'}), (req,res)=>{
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature error', err.message); return res.status(400).send(Webhook Error: );
  }
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    // traer datos del producto y enviar mail al customer_details.email
    const customerEmail = session.customer_details?.email;
    const productId = session.metadata?.productId;
    // Generar link de uso: en producción crear token único y guardarlo en DB
    const usageLink = (process.env.BASE_URL || 'https://yourdomain.com') + '/usage/' + productId + '?token=' + Math.random().toString(36).slice(2);
    // Enviar email
    sg.send({
      to: customerEmail,
      from: process.env.FROM_EMAIL,
      subject: 'Tu compra en NeuralGPT.Store - acceso al producto',
      html: <p>Gracias por tu compra. Descarga/acceso aquí: <a href=""></a></p>
    }).then(()=> console.log('Email enviado a', customerEmail)).catch(err=>console.error(err));
  }
  res.json({received:true});
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log('Server listening on',port));
