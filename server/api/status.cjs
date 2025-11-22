const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'NeuralGPT.Store backend',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
