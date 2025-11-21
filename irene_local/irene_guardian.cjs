///////////////////////////////////////////////////////////////
// IRENE_GUARDIAN v1
// Protección absoluta del núcleo Irene + PokerKernel
// Monitoreo de archivos críticos, integridad y avisos locales.
// NO usa APIs externas. 100% local.
///////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

const CRITICAL_DIRS = [
    'C:/NeuralGPT.Store/server/irene_local',
    'C:/NeuralGPT.Store/server/pokerkernel'
];

function scanCritical(){
    const alerts = [];

    for(const dir of CRITICAL_DIRS){
        if(!fs.existsSync(dir)){
            alerts.push({ dir, error:'missing' });
            continue;
        }

        const files = fs.readdirSync(dir);
        for(const f of files){
            const p = path.join(dir,f);
            try{
                const st = fs.statSync(p);
                alerts.push({
                    file: p,
                    size: st.size,
                    modified: st.mtime.toISOString()
                });
            }catch(e){
                alerts.push({ file:p, error:'stat-failed' });
            }
        }
    }

    return {
        ok:true,
        at:new Date().toISOString(),
        alerts
    };
}

module.exports = {
    scanCritical
};
