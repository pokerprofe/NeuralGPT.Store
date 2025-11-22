import express from 'express';
import LeadManagerAI from '../lead_manager/lead_manager.cjs';

const router = express.Router();
const lm = new LeadManagerAI();

router.post('/new', (req, res) => {
    const lead = lm.addLead(req.body);
    res.json({ status: 'ok', lead });
});

router.get('/all', (req, res) => {
    res.json(lm.getLeads());
});

router.get('/category/:cat', (req, res) => {
    const { cat } = req.params;
    res.json(lm.getByCategory(cat));
});

export default router;
