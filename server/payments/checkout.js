const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {

  // Load Google Pay placeholder config
  const confPath = path.join(__dirname, './gpay_config.json');
  let gconf = {};
  try { gconf = JSON.parse(fs.readFileSync(confPath)); } catch(e){ gconf = {}; }

  // Endpoint: return config to frontend (safe subset)
  app.get('/api/pay/config', (req,res)=>{
    res.json({
      ok:true,
      merchantName: gconf.merchantName || "NeuralGPT.Store",
      merchantId: gconf.merchantId ? "active" : "not_set",
      gateway: gconf.gateway
    });
  });

  // Manual checkout placeholder (activated when merchantId pasted)
  app.post('/api/pay/checkout', (req,res)=>{
    const body = req.body || {};
    // If no merchantId installed, block real actions
    if(!gconf.merchantId || gconf.merchantId.trim()===""){
      return res.status(401).json({ok:false, error:"Merchant not configured"});
    }
    res.json({ ok:true, message:"Checkout skeleton ready. Activate after merchant config."});
  });

};
