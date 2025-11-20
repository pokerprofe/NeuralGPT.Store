const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/model_stats.json');

function load() {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath));
}

function save(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = (app) => {

    // Registrar vista
    app.post('/api/stats/view', (req,res)=>{
        const id = req.body.id;
        const db = load();
        db[id] = db[id] || { views:0, clicks:0 };
        db[id].views++;
        save(db);
        res.json({ ok:true });
    });

    // Registrar click (abrir modelo)
    app.post('/api/stats/click', (req,res)=>{
        const id = req.body.id;
        const db = load();
        db[id] = db[id] || { views:0, clicks:0 };
        db[id].clicks++;
        save(db);
        res.json({ ok:true });
    });

    // Obtener todas las estadísticas (panel admin)
    app.get('/api/admin/stats/models', (req,res)=>{
        const db = load();
        res.json({ ok:true, stats:db });
    });
};
