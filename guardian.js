const fs = require('fs');
const path = require('path');

const LOGFILE = path.join(__dirname, '../logs/guardian.log');

function write(msg){
    const line = "[" + new Date().toISOString() + "] " + msg + "\n";
    fs.appendFileSync(LOGFILE, line);
}

module.exports = (app) => {

    // Log inicio
    write("Guardian iniciado — monitoreo activado.");

    // 1) Monitorizar errores del servidor
    process.on('uncaughtException', (err)=>{
        write("UNCAUGHT_EXCEPTION: " + err.stack);
    });

    process.on('unhandledRejection', (reason)=>{
        write("UNHANDLED_REJECTION: " + reason);
    });

    // 2) Endpoint de chequeo interno
    app.get('/api/system/guardian', (req,res)=>{
        write("Chequeo manual del guardian ejecutado.");
        res.json({ ok:true, status:"Guardian online", time:Date.now() });
    });

    // 3) Monitor básico de archivos críticos
    const criticalFiles = [
        '../server/app.cjs',
        '../public_html/index.html',
        '../dashboard/admin/index.html'
    ];

    setInterval(()=>{
        criticalFiles.forEach(f=>{
            const full = path.join(__dirname, f);
            if(!fs.existsSync(full)){
                write("ALERTA: Archivo crítico perdido → " + full);
            }
        });
    }, 7000); // Cada 7 segundos

};
