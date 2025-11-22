import express from 'express';
import IreneButler from '../mayordomo/mayordomo.cjs';

const router = express.Router();
const butler = new IreneButler();
butler.loadAvatar();

router.get('/status', (req, res) => {
    res.json({ alive: true, avatar: butler.avatar });
});

router.post('/guide', (req, res) => {
    const { section } = req.body;
    res.json({ message: butler.guideUser(section) });
});

router.post('/register-user', (req, res) => {
    butler.registerUser(req.body);
    res.json({ status: 'ok' });
});

router.post('/register-provider', (req, res) => {
    butler.registerProvider(req.body);
    res.json({ status: 'ok' });
});

router.post('/invite-provider', (req, res) => {
    const { email, link } = req.body;
    res.json(butler.autoInviteProvider(email, link));
});

router.get('/activity', (req, res) => {
    res.json(butler.getActivityLog());
});

export default router;
