const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.get('/:script', (req,res)=>{
  const script = req.params.script;

  if(script === 'secintel'){
    return exec('powershell -File \"neuro_secintel/secintel.ps1\"', (err)=>{
      if(err) return res.send('Error ejecutando SecIntel');
      res.send('SecIntel ejecutado correctamente.');
    });
  }

  if(script === 'backup'){
    return exec('powershell -File \"neuro_backup/run_backup.ps1\"', (err)=>{
      if(err) return res.send('Error ejecutando backup');
      res.send('Backup ejecutado correctamente.');
    });
  }

  res.send('Script no reconocido.');
});

module.exports = router;
