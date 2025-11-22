//
// NEURALGATE — MULTI-LANG ENGINE
//

async function loadLang(lang){
  try{
    const res = await fetch('/i18n/' + lang + '.json');
    return await res.json();
  }catch(e){
    const fallback = await fetch('/i18n/en.json');
    return await fallback.json();
  }
}

// Reemplaza textos marcados con data-i18n="key"
function applyLang(dict){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.textContent = dict[key];
  });
}

// Auto-detección del navegador
async function initLang(){
  const stored = localStorage.getItem('lang');
  const browser = navigator.language.slice(0,2);
  const finalLang = stored || browser || 'en';

  const dict = await loadLang(finalLang);
  applyLang(dict);
}

window.changeLang = async function(lang){
  localStorage.setItem('lang', lang);
  const dict = await loadLang(lang);
  applyLang(dict);
};

document.addEventListener('DOMContentLoaded', initLang);
