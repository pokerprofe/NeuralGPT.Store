import express from 'express';
import IreneLangAI from '../autolang/autolang.cjs';
import AutoMarketingAI from '../automarketing/automarketing.cjs';

const router = express.Router();
const langAI = new IreneLangAI();
const mk = new AutoMarketingAI();

router.get('/detect', (req, res) => {
    const lang = langAI.detect(req.headers['accept-language']);
    res.json({ lang: lang, greeting: langAI.greet(lang) });
});

router.post('/seo', (req, res) => {
    const { title, lang } = req.body;
    const result = mk.generateSEO(title, lang);
    res.json(result);
});

router.post('/ad', (req, res) => {
    const { product, lang } = req.body;
    const text = mk.generateAdvert(product, lang);
    res.json({ ad: text });
});

router.get('/logs', (req, res) => {
    res.json(mk.getLogs());
});

export default router;
