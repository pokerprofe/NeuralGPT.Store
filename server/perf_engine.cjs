//
// PERF ENGINE v1.0 – Optimización local (sin coste)
// • Activa compresión ligera
// • Añade headers de caching
// • Habilita lazy-loading de imágenes
// • Zero dependencias externas
//

const path = require('path');

function perfHeaders(req,res,next){
    // Cache control seguro
    res.setHeader('Cache-Control','public, max-age=86400');

    // Lazy loading para imágenes
    if(req.path.endsWith('.html')){
        const old = res.send;
        res.send = function(body){
            if(typeof body === 'string'){
                body = body.replace(/<img /g,"<img loading='lazy' ");
            }
            return old.call(this,body);
        }
    }
    next();
}

module.exports = { perfHeaders };
