(function(){
  const lang = (navigator.language || navigator.userLanguage || "en").slice(0,2).toLowerCase();
  const supported = ["en","es"];
  const finalLang = supported.includes(lang) ? lang : "en";

  async function loadDict(){
    try{
      const res = await fetch("/assets/i18n/" + finalLang + ".json");
      if(!res.ok) return;
      const dict = await res.json();
      apply(dict);
    }catch(e){}
  }

  function apply(dict){
    if(!dict) return;
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      if(key && dict[key]){
        el.textContent = dict[key];
      }
    });
  }

  document.addEventListener("DOMContentLoaded", loadDict);
})();
