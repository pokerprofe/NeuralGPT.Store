/////////////////////////////////////////////////////////////////////////
// NEURO LINGUA ENGINE v1.0 – Traductor 100% LOCAL, sin APIs externas.
// Soporta: ES, EN, FR, PT, DE, IT, AR, ZH (simplificado).
// Método: glosarios + reglas + expansión semántica.
/////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

// Cargar glosarios básicos
function loadDict(lang){
  try{
    const p = path.join(__dirname,'dict_'+lang+'.json');
    return JSON.parse(fs.readFileSync(p,'utf8'));
  }catch{ return {}; }
}

// Traducción básica palabra a palabra
function translateBase(text, dict){
  const words = text.split(/\\s+/g);
  return words.map(w=>{
    const key = w.toLowerCase();
    return dict[key] ? dict[key] : w;
  }).join(' ');
}

// Expansión semántica leve (modo “Irene”)
function semanticBoost(str){
  return str
    .replace(/tecnolog(i|ía)/gi,'advanced technology')
    .replace(/sistema/gi,'system module')
    .replace(/alta calidad/gi,'premium-grade')
    .replace(/rapido/gi,'high-speed')
    .replace(/cuantico/gi,'quantum-level')
}

// Traducción final
function translate(text, target){
  const dict = loadDict(target);
  let out = translateBase(text, dict);
  out = semanticBoost(out);
  return out;
}

module.exports = { translate };
