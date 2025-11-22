const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const p = path.join(__dirname, '../../public_html/data/products.json');
    const raw = fs.readFileSync(p, 'utf8');
    const data = JSON.parse(raw);
    res.json({ ok:true, products:data });
  } catch (e) {
    res.status(500).json({ ok:false, error:'Error leyendo productos' });
  }
});

module.exports = router;
