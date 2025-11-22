const express  = require('express');
const router   = express.Router();
const matrix   = require('./autolanding.cjs');

router.post('/generate', (req, res) => {
    const body = req.body || {};
    const product = body.product || {};
    const lang    = body.lang || 'es';

    if (!product.title) {
        return res.status(400).json({ ok: false, error: 'Falta product.title' });
    }

    try {
        const landing = matrix.generateLanding(product, lang);
        return res.json({ ok: true, landing });
    } catch (e) {
        console.error('Error generando landing:', e);
        return res.status(500).json({ ok: false, error: 'Error interno generando landing' });
    }
});

router.get('/list', (req, res) => {
    try {
        const list = matrix.listLandings();
        res.json({ ok: true, landings: list });
    } catch (e) {
        console.error('Error listando landings:', e);
        res.status(500).json({ ok: false, error: 'Error interno listando landings' });
    }
});

module.exports = router;
