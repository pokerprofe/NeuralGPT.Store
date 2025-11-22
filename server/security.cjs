const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

module.exports = function(app) {

    // Blindaje de cabeceras HTTP
    app.use(helmet({
        xssFilter: true,
        noSniff: true,
        hidePoweredBy: true,
        frameguard: { action: 'deny' }
    }));

    // Límite de peticiones (evita ataques DDoS pequeños)
    const limiter = rateLimit({
        windowMs: 60 * 1000,
        max: 200
    });
    app.use(limiter);

    // Bloqueo de rutas sensibles
    app.use((req,res,next)=>{
        if (req.url.includes('..') || req.url.includes('%00')) {
            return res.status(403).json({ ok:false, error:'Bloqueado por seguridad interna' });
        }
        next();
    });

};
