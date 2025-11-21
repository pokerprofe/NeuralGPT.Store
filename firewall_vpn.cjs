//
// FIREWALL LÓGICO ANTI-VPN / ANTI-BOT v1.0
//
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname,'..','logs','firewall.log');

// Lista negra de ASN, redes VPN y proxies conocidos
const blockedASN = [
    'AS9009','AS12389','AS20473','AS14061',
    'AS12876','AS16276','AS6939','AS396982'
];

// Detector simple de IP sospechosa
function looksSuspicious(ip){
    return (
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        ip.startsWith('172.16.') ||
        ip === '127.0.0.1'
    );
}

// Mock de análisis ASN (sin API externa)
function fakeASN(ip){
    let sum = 0;
    for(let c of ip) sum += c.charCodeAt(0);
    const idx = sum % blockedASN.length;
    return blockedASN[idx];
}

// Middleware principal
function firewall(req,res,next){

    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').replace('::ffff:','');

    const asn = fakeASN(ip);

    const suspicious =
        blockedASN.includes(asn) ||
        looksSuspicious(ip) ||
        ip.includes('proxy') ||
        ip.includes('vpn');

    if(suspicious){
        const msg = [] BLOCKED  (ASN:);
        fs.appendFileSync(logFile, msg + "\n");

        res.status(403).json({
            ok:false,
            msg:"Access restricted. VPN/Proxy detected."
        });
        return;
    }

    next();
}

module.exports = { firewall };
