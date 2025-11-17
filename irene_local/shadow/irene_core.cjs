const fs = require('fs');
const path = require('path');

const KB = JSON.parse(
  fs.readFileSync(path.join(__dirname,'kb_intents.json'),'utf8')
);

const LANGS = ['en','es','fr','de','pt','ja','zh-cn','zh-tw','ar'];

function detectLanguage(text){
  const t = (text || '').toLowerCase();

  // Árabe (rango unicode)
  if(/[\u0600-\u06FF]/.test(text)) return 'ar';

  // Japonés (hiragana/katakana/kanji)
  if(/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text) && /[\u3040-\u30FF]/.test(text)) return 'ja';

  // Chino simplificado/tradicional (kanji sin hiragana)
  if(/[\u4E00-\u9FFF]/.test(text)){
    // si hay vocabulario típico de zh-cn
    if(t.includes('的') || t.includes('了') || t.includes('在')) return 'zh-cn';
    return 'zh-tw';
  }

  // Español
  if(/[ñáéíóúü]/.test(t) || /\bqué\b|\bpor qué\b|\bporque\b/.test(t)) return 'es';
  // Francés
  if(/\ble\b|\bla\b|\bles\b|\bpour\b|\bavec\b/.test(t)) return 'fr';
  // Alemán
  if(/\bund\b|\bder\b|\bdie\b|\bdas\b/.test(t)) return 'de';
  // Portugués
  if(/\bo que\b|\bpara\b|\bcom\b/.test(t)) return 'pt';

  return 'en';
}

function pickLanguage(requested, text){
  if(requested && LANGS.includes(requested)) return requested;
  return detectLanguage(text);
}

function findIntent(text){
  const t = (text || '').toLowerCase();
  let best = null;
  let bestScore = 0;

  for(const intent of KB.intents){
    const kws = (intent.keywords || []).map(x=>String(x).toLowerCase());
    if(kws.length === 0) continue;
    let score = 0;
    for(const k of kws){
      if(t.includes(k)) score += 2;
    }
    if(score > bestScore){
      bestScore = score;
      best = intent;
    }
  }

  if(!best || bestScore === 0){
    best = KB.intents.find(i=>i.id === 'default');
  }
  return { intent: best, confidence: bestScore };
}

function formatReasoning(question, baseAnswer, lang){
  const q = (question || '').toLowerCase();
  const isWhy = q.includes('why') || q.includes('por qué') || q.includes('porque');
  const isHow = q.includes('how') || q.includes('cómo') || q.includes('comment') || q.includes('wie');

  if(!isWhy && !isHow) return baseAnswer;

  if(lang === 'es'){
    return [
      "Te lo explico en pasos:",
      "1) El sistema identifica qué módulo interno responde mejor a tu pregunta.",
      "2) Cruza la información con la arquitectura NeuroCommerce (suscripciones, proveedores, seguridad, pagos, paneles).",
      "3) Resume la lógica en una respuesta clara sin exponer datos sensibles.",
      "",
      baseAnswer
    ].join('\n');
  }

  if(lang === 'en'){
    return [
      "Let me break it down:",
      "1) The system identifies which internal module is relevant to your question.",
      "2) It cross-checks that with the NeuroCommerce architecture (subscriptions, vendors, security, payments, dashboards).",
      "3) It produces a clear answer without exposing sensitive details.",
      "",
      baseAnswer
    ].join('\n');
  }

  return baseAnswer;
}

function ask(question, options = {}){
  const lang = pickLanguage(options.lang, question);
  const { intent, confidence } = findIntent(question);

  const answers = intent.answers || {};
  const base = answers[lang] || answers['en'] || '';
  const finalAnswer = formatReasoning(question, base, lang);

  return {
    answer: finalAnswer,
    lang,
    intent: intent.id,
    confidence
  };
}

module.exports = { ask };
