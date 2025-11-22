const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    agents: [
      'Irene Local v3',
      'Guardian V5',
      'NeuroSales',
      'MotherCore',
      'AtlasMind',
      'LexOracle',
      'DataOracle',
      'AutoVendor',
      'Enterprise AI'
    ]
  });
});

module.exports = router;
