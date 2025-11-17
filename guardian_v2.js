const fs = require('fs');
const path = require('path');

const LOG = path.join(__dirname, '../logs/guardian.log');

// Archivos críticos a proteger
const critical = [
  '../server/app.cjs',
  '../public_html/index.html',
  '../dashboard/admin/index.html',
  '../database/users.json',
  '../database/models.json'
];

// Copias internas para restaurar si se corrompen
const shadow = path.join(__dirname, '../.system/shadow');
if(!fs.existsSync(shadow)) fs.mkdirSync(shadow);

// Cargar copias
function ensureCopies(){
    critical.forEach(f=>{
        const full = path.join(__dirname, f);
        const copy = path.join(shadow, path.basename(f)+'.bak');

        if(fs.existsSync(full) && !fs.existsSync(copy)){
            fs.copyFileSync(full, copy);
            write('Copia inicial creada para '+f);
        }
    });
}

// Log
function write(msg){
    const line = '['+new Date().toISOString()+'] '+msg+' \n';
    fs.appendFileSync(LOG, line);
}

// Restaurar archivo si fue manipulado
function restoreIfModified(){
    critical.forEach(f=>{
        const full = path.join(__dirname, f);
        const copy = path.join(shadow, path.basename(f)+'.bak');

        if(!fs.existsSync(full)){
            write('ALERTA CRÍTICA: Archivo eliminado → '+f+' // restaurando');
            fs.copyFileSync(copy, full);
            return;
        }

        const orig = fs.readFileSync(copy,'utf8');
        const curr = fs.readFileSync(full,'utf8');

        if(orig.trim() !== curr.trim()){
            write('ALERTA: Modificación NO autorizada → '+f+' // restaurado');
            fs.copyFileSync(copy, full);
        }
    });
}

// Honeypot anti-hacker
function honeypot(){
    const fake = path.join(__dirname,'../public_html/login_admin.php');
    if(!fs.existsSync(fake)){
        fs.writeFileSync(fake,
            '<?php echo \"Access denied\"; ?>'
        );
    }
    return fake;
}

// Monitoreo continuo
function loop(){
    try{
        restoreIfModified();
        write('Check ok');
    }catch(e){
        write('ERROR en guardian_v2: '+e.message);
    }
}

module.exports = {
    init(){
        write('Guardian V2 activado.');
        ensureCopies();
        honeypot();
        setInterval(loop, 5000); // cada 5s
    }
};
