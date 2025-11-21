///////////////////////////////////////////////////////////////////////
// NEURO L10N ENGINE v1.0
// Traducción local sin APIs externas (ES -> EN, FR, PT, DE, IT, AR, ZH)
///////////////////////////////////////////////////////////////////////
const fs   = require('fs');
const path = require('path');

function loadDict(lang){
  const p = path.join(__dirname,'dict_'+lang+'.json');
  try{ return JSON.parse(fs.readFileSync(p)); }
  catch{ return {}; }
}

const dictionaries = {
  en: loadDict('en'),
  fr: loadDict('fr'),
  pt: loadDict('pt'),
  de: loadDict('de'),
  it: loadDict('it'),
  ar: loadDict('ar'),
  zh: loadDict('zh')
};

function translateSentence(sentence, dic){
  const words = sentence.split(/(\s+)/);
  return words.map(w=>{
    const lw = w.toLowerCase().trim();
    return dic[lw] ? dic[lw] : w;
  }).join('');
}

function translate(text){
  const out = {};
  Object.keys(dictionaries).forEach(lang=>{
    out[lang] = translateSentence(text, dictionaries[lang]);
  });
  return out;
}

module.exports = { translate };
