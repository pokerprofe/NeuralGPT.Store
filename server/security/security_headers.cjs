const helmet = require("helmet");

module.exports = function applySecurity(app) {

    // Cabeceras seguras base
    app.use(helmet({
        frameguard: { action: "deny" },
        xssFilter: true,
        noSniff: true,
        hidePoweredBy: true
    }));

    // CSP local + dominio neuralgpt.store
    app.use((req, res, next) => {
        res.setHeader("Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data:; " +
            "font-src 'self'; " +
            "connect-src 'self' https://neuralgpt.store; " +
            "object-src 'none'; frame-src 'none';"
        );
        next();
    });

    // Prevención básica XSS
    app.use((req, res, next) => {
        if (typeof req.query === "object") {
            for (let k in req.query) {
                if (/<script/i.test(req.query[k])) {
                    return res.status(400).json({ error: "Entrada bloqueada" });
                }
            }
        }
        next();
    });
};
