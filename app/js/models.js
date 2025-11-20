function renderBadges(badges){
  if(!badges || !Array.isArray(badges)) return "";
  return badges.map(b=>{
    const cls = b.toLowerCase();
    return <div class="model-badge badge-\">\</div>;
  }).join('');
}
(async function(){

  const wrap = id => document.getElementById(id);

  async function loadModels(){
    try{
      const res = await fetch("/api/models");
      const data = await res.json();
      if(!data.ok) return [];
      return data.agents || [];
    }catch(e){ return []; }
  }

  function cardTemplate(m){
    const locked = m.locked ? "locked" : "";
    const badge = m.isFeatured ? `<div class="badge">FEATURED</div>` : "";
    const lockOverlay = m.locked ? `<div class="lock-tag">Premium</div>` : "";
    const tags = m.category ? `<span class="tag">${m.category}</span>` : "";

    return `
    <div class="model-card ${locked} rgb-frame">
      ${badge}
      ${lockOverlay}
      <div class="model-header">
        <img src="${m.logoUrl}" class="model-logo"/>
        <h2 class="model-name">${m.name}</h2>
      </div>

      <p class="model-desc">${m.shortDescription}</p>

      <div class="model-tags">${tags}</div>

      <button class="model-btn" data-slug="${m.slug}">
        ${m.locked ? "Unlock" : "Open"}
      </button>
    </div>
    `;
  }

  function render(models){
    const box = wrap("models_grid");
    box.innerHTML = models.map(cardTemplate).join("");
  }

  const models = await loadModels();
  render(models);

})();

