const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const LOG_DIR = path.join(__dirname,'../diagnose/logs');
const EXPORT_DIR = path.join(__dirname,'../diagnose/exports');
const GD_LOG = path.join(__dirname,'../logs'); // guardian logs

function safe(pathFile){ return fs.existsSync(pathFile) ? fs.readFileSync(pathFile,'utf8') : ""; }

module.exports = (app)=>{

    // --- Registrar error JS del navegador ---
    app.post('/api/diagnose/js_error', (req,res)=>{
        const body = req.body || {};
        const line = "["+new Date().toISOString()+"] JS_ERROR: "+JSON.stringify(body)+"\n";
        fs.appendFileSync(path.join(LOG_DIR,'browser.log'),line);
        res.json({ok:true});
    });

    // --- Resumen para panel ---
    app.get('/api/diagnose/summary',(req,res)=>{
        const serverErr = safe(path.join(LOG_DIR,'server.log'));
        const browserErr = safe(path.join(LOG_DIR,'browser.log'));
        const guardian = safe(path.join(GD_LOG,'guardian.log')) + safe(path.join(GD_LOG,'guardian_v2.log')) + safe(path.join(GD_LOG,'guardian_v5.log'));

        res.json({
            ok:true,
            summary:{
                server_errors: serverErr.split("\n").filter(l=>l.trim()!="").length,
                browser_errors: browserErr.split("\n").filter(l=>l.trim()!="").length,
                guardian_lines: guardian.split("\n").filter(l=>l.trim()!="").length
            }
        });
    });

    // --- Recoger todos los logs en bruto ---
    app.get('/api/diagnose/full',(req,res)=>{
        const full = {
            server: safe(path.join(LOG_DIR,'server.log')),
            browser: safe(path.join(LOG_DIR,'browser.log')),
            guardian: safe(path.join(GD_LOG,'guardian.log')) 
                    + safe(path.join(GD_LOG,'guardian_v2.log')) 
                    + safe(path.join(GD_LOG,'guardian_v5.log'))
        };
        res.json({ok:true,full});
    });

    // --- Export ZIP para entregar a Irene ---
    app.get('/api/diagnose/export', (req,res)=>{
        const zipPath = path.join(EXPORT_DIR, "diagnose_"+Date.now()+".zip");
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip');

        archive.pipe(output);
        archive.directory(LOG_DIR,'logs');
        archive.directory(GD_LOG,'guardian_logs');
        archive.finalize();

        output.on('close',()=>{
            res.download(zipPath);
        });
    });

    // --- Captura errores del servidor ---
    process.on('uncaughtException',(err)=>{
        fs.appendFileSync(path.join(LOG_DIR,'server.log'), "["+new Date().toISOString()+"] SERVER_EXC: "+err.stack+"\n");
    });
    process.on('unhandledRejection',(reason)=>{
        fs.appendFileSync(path.join(LOG_DIR,'server.log'), "["+new Date().toISOString()+"] SERVER_REJ: "+reason+"\n");
    });

};
