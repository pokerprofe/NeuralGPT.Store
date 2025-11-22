import express from 'express';
import ProviderHunterAI from '../provider_hunter/hunter.cjs';

const router = express.Router();
const hunter = new ProviderHunterAI();

router.post('/scan', (req, res) => {
    const { url, html } = req.body;
    const report = hunter.analyzeSite(url, html);
    res.json(report);
});

router.post('/message', (req, res) => {
    const { businessName, email } = req.body;
    const msg = hunter.generateMessage(businessName, email);
    res.json({ status: 'ok', message: msg });
});

router.get('/reports', (req, res) => {
    res.json(hunter.getReports());
});

export default router;
