//
// HARDENING ENGINE V1.0 – Anti-inyección, Anti-exploits, Sanitización profunda
//

function clean(str){
    if(!str) return "";
    return String(str)
        .replace(/<script.*?>.*?<\\/script>/gi,'')
        .replace(/['"]/g,'')
        .replace(/(;|--|\\/\\*|\\*\\/)/g,'')
        .replace(/[<>]/g,'')
        .trim();
}

function sanitize(req,res,next){

    if(req.body){
        for(let k in req.body){
            req.body[k] = clean(req.body[k]);
        }
    }

    if(req.query){
        for(let k in req.query){
            req.query[k] = clean(req.query[k]);
        }
    }

    next();
}

module.exports = { sanitize };
