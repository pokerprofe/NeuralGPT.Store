//// ============================================================
// TraffixBrain™ — Núcleo de Inteligencia de Tráfico (v1)
// 100% local. No usa APIs externas. No envía datos.
// Clasifica tráfico en HUMANO / BOT / RIESGO / DESCONOCIDO
// ============================================================

function normalize(str){
    if(!str) return '';
    return String(str).toLowerCase();
}

function classify(req){
    const ua  = normalize(req.headers['user-agent']);
    const ip  = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    
    // Patrones de humano (móvil + navegadores reales)
    const humanUA = ['chrome','safari','edge','firefox','iphone','android'];
    if(humanUA.some(x=> ua.includes(x))) return 'HUMANO';

    // Patrones de bot
    const bots = ['bot','crawler','spider','scan','sqlmap','curl','wget','python'];
    if(bots.some(x=> ua.includes(x))) return 'BOT';

    // Patrones de riesgo (VPN/Proxy/Cloud)
    const risky = ['amazonaws','digitalocean','googleusercontent','azure','ovh','hetzner','contabo'];
    if(risky.some(x=> normalize(ip).includes(x))) return 'RIESGO';

    return 'DESCONOCIDO';
}

module.exports = {
    classify
};
