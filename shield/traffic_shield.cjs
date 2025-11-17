//// =========================================================
// TrafficShield™ v1
// Capa de seguridad sobre TraffixBrain
// Reglas actuales:
//  - HUMANO: permitir
//  - BOT: permitir pero loguear
//  - RIESGO: permitir pero loguear en rojo
//  - DESCONOCIDO: permitir y registrar
//// =========================================================

module.exports = function(req, res, next){

    const cls = req.trafficClass || "DESCONOCIDO";
    const ip  = req.ip || req.connection.remoteAddress || "0.0.0.0";
    const ua  = req.headers['user-agent'] || "UA_UNKNOWN";

    const line = "[" + new Date().toISOString() + "] (" + cls + ") " + ip + " - " + ua;

    try{
        if(cls === "BOT"){
            console.warn("[BOT] " + line);
        } else if(cls === "RIESGO"){
            console.error("[RIESGO] " + line);
        } else {
            console.log("[OK] " + line);
        }
    }catch(e){
        console.error("TrafficShield ERROR:", e && e.message ? e.message : e);
    }

    next();
}
