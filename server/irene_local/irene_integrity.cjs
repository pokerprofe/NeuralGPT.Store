const fs = require('fs');
const path = require('path');

module.exports = {
    check(){
        const seal = path.join(__dirname,'Irene.seal.lock');
        const core = path.join(__dirname,'irene_core.cjs');
        const notify = path.join(__dirname,'irene_notify.cjs');

        if(!fs.existsSync(seal)) return { ok:false, msg:'seal-missing' };
        if(!fs.existsSync(core)) return { ok:false, msg:'core-missing' };
        if(!fs.existsSync(notify)) return { ok:false, msg:'notify-missing' };

        try{
            fs.accessSync(core, fs.constants.R_OK);
            fs.accessSync(notify, fs.constants.R_OK);
        }catch(e){
            return { ok:false, msg:'core-unreadable' };
        }

        return { ok:true, msg:'integrity-ok' };
    }
};
