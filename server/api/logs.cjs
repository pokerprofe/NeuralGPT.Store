const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
  try {
    const logPath = path.join(__dirname,'../../neuro_secintel/reports');
    const files = fs.readdirSync(logPath).filter(f => f.endsWith('.txt'));
    if(!files.length) return res.send('Sin logs disponibles.');

    const last = path.join(logPath, files[files.length-1]);
    const content = fs.readFileSync(last,'utf8');

    res.send(content);
  } catch(e){
    res.send('Error leyendo logs.');
  }
});

module.exports = router;
