import express from 'express';
import NeuroSalesAI from '../neurosales_ai/neurosales_ai.cjs';

const router = express.Router();
const ns = new NeuroSalesAI();

router.post('/proposal', (req, res) => {
    const txt = ns.generateProposal(req.body);
    res.json({ status: 'ok', proposal: txt });
});

router.post('/follow', (req, res) => {
    const { lead, stage } = req.body;
    const msg = ns.generateFollowUp(lead, stage);
    res.json({ status: 'ok', msg });
});

router.post('/funnel', (req, res) => {
    const funnel = ns.createSalesFunnel(req.body);
    res.json({ status: 'ok', funnel });
});

router.get('/logs', (req, res) => {
    res.json(ns.getLogs());
});

export default router;
