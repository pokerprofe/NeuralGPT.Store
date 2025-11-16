const fs = require('fs');
const path = require('path');

module.exports = (app)=>{
    const log = (msg)=>{
        fs.appendFileSync(path.join(__dirname,'../logs/guardian_v5.log'),
        new Date().toISOString()+" "+msg+"
");
    };

    // BLOQUEO por frecuencia
    const hits = {};
    setInterval(()=>{ for(const ip in hits){ hits[ip]=0; } },1000);

    app.use((req,res,next)=>{
        const ip = req.ip;
        hits[ip] = (hits[ip]||0)+1;

        if(hits[ip] > 30){               // anti-DDoS
            log("DDoS detectado desde "+ip);
            return res.status(429).send("Too many requests");
        }

        // Anti-scraper (user-agent vacío o raro)
        const ua = req.headers['user-agent']||"";
        if(ua.length -lt 15){
            log("Scraper bloqueado "+ip);
            return res.status(403).send("Forbidden");
        }

        // Delay dinámico
        if(hits[ip] > 20){
            setTimeout(()=>next(), 600);
        }else{
            next();
        }
    });

    log("Guardian V5 cargado — anti-DDoS + anti-scraper listos.");
};

