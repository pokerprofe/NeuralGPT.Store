const express = require('express');
const router  = express.Router();
const Core    = require('../../neuralcore/core.cjs');

router.get('/', (req,res)=>{
    res.json(Core.getStatus());
});

module.exports = router;
