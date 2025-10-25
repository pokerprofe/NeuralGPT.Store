(function(){
  // filtro en vivo por nombre/categoría
  const q = document.getElementById("search");
  const grid = document.getElementById("grid");
  const items = [...grid.querySelectorAll(".card")];

  function filter(val){
    const v = (val||"").trim().toLowerCase();
    items.forEach(el=>{
      const name = (el.dataset.name||"").toLowerCase();
      const tags = (el.dataset.tags||"").toLowerCase();
      const show = !v || name.includes(v) || tags.includes(v);
      el.style.display = show ? "" : "none";
    });
  }
  q.addEventListener("input", e=>filter(e.target.value));

  // efecto luz siguiendo el ratón (seguro y sutil)
  grid.addEventListener("pointermove", e=>{
    const g = e.target.closest(".card");
    if(!g) return;
    const r = g.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 100;
    g.style.setProperty("--mx", x+"%");
  }, {passive:true});
})();
