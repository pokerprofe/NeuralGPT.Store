//////////////////////////////////////////////////////////
// IRENE_CONSCIENCE v1
// Conciencia cuántica del ecosistema NeuralGPT.Store
// Supervisa servidor local + versión en GitHub Pages.
// No ejecuta cambios automáticamente: solo reporta y prepara acciones.
// Decide rutas de reparación y comunica al núcleo IRENE_CORE.
//////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const https = require('https');

const LOCAL_ROOT = path.join(__dirname, '..', 'public_html');
const REMOTE_URL = 'https://pokerprofe.github.io/NeuralGPT.Store/';

function fetchRemote(file){
    return new Promise((resolve)=>{
        https.get(REMOTE_URL + file, res=>{
            let data='';
            res.on('data',d=>data+=d);
            res.on('end',()=>resolve({ok:true,data}));
        }).on('error',()=>resolve({ok:false}));
    });
}

function readLocal(file){
    try{
        return fs.readFileSync(path.join(LOCAL_ROOT,file),'utf8');
    }catch{
        return null;
    }
}

async function compareFile(file){
    const local = readLocal(file);
    const remote = await fetchRemote(file);

    if(!local) return { file, status:'LOCAL_MISSING' };
    if(!remote.ok) return { file, status:'REMOTE_MISSING' };

    if(local.trim() !== remote.data.trim()){
        return { file, status:'DESYNC' };
    }

    return { file, status:'OK' };
}

async function scan(){
    // Archivos críticos a vigilar en ambas versiones
    const critical = [
        'index.html',
        'assets/js/main.js',
        'assets/css/main.css',
        'dashboard/index.html'
    ];

    const results = [];
    for(const f of critical){
        results.push(await compareFile(f));
    }

    return {
        t: new Date().toISOString(),
        results
    };
}

// API Pública
module.exports = {
    scan
};
