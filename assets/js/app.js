(function(){
  const grid = document.getElementById("grid");
  const q = document.getElementById("search");

  fetch("/data/agents.json",{cache:"no-store"})
    .then(r=>r.json())
    .then(list=>{
      render(list);
      q.addEventListener("input", e=>{
        const v = (e.target.value||"").toLowerCase().trim();
        const f = !v ? list : list.filter(a =>
          a.name.toLowerCase().includes(v) ||
          a.category.toLowerCase().includes(v) ||
          (a.blurb||"").toLowerCase().includes(v)
        );
        render(f);
      });
    })
    .catch(err=>{
      grid.innerHTML = '<div class="card"><h3>Error</h3><p>No se pudieron cargar los agentes.</p></div>';
      console.error(err);
    });

  function render(items){
    grid.innerHTML = items.map(cardHTML).join("");
    // efecto luz
    grid.querySelectorAll(".card").forEach(el=>{
      el.addEventListener("pointermove", e=>{
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width * 100;
        el.style.setProperty("--mx", x+"%");
      },{passive:true});
    });
  }

  function cardHTML(a){
    const isPremium = a.premium && (a.plan==="premium" || a.plan==="oneoff");
    const badge = isPremium ? `<span class="chip chip-premium">Elite</span>` : `<span class="chip">Pass</span>`;
    const price = isPremium ? `<span class="price">€${a.price}</span>` : `<span class="price price-pass">Quantum Pass</span>`;
    const cta = isPremium
      ? `<a class="btn" href="/pay/?sku=${a.id}">Adquirir · €${a.price}</a>`
      : `<a class="btn btn-ghost" href="/quantum-pass/">Acceder con Pass</a>`;
    return `
      <article class="card" style="--ink:${a.color||"#b78a1f"}" data-name="${escapeHtml(a.name)}" data-tags="${escapeHtml(a.category)}">
        <div class="card-glow"></div>
        <div class="badge-row">${badge}${price}</div>
        <h3>${escapeHtml(a.name)}</h3>
        <p>${escapeHtml(a.blurb)}</p>
        <div class="chip">${escapeHtml(a.category)}</div>
        <div class="cta">${cta}</div>
      </article>`;
  }

  function escapeHtml(s){return (s||"").replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
})();
