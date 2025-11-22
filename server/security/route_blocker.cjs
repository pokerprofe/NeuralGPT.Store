module.exports = function(app) {

    const blocked = [
        "/admin",
        "/Console",
        "/supervisor",
        "/neuro_*",
        "/backup",
        "/backups",
        "/logs",
        "/server_example"
    ];

    app.use((req, res, next) => {
        const url = req.originalUrl.toLowerCase();
        for (let r of blocked) {
            if (url.includes(r.toLowerCase().replace("*",""))) {
                return res.status(403).json({ error: "Acceso denegado" });
            }
        }
        next();
    });
};
