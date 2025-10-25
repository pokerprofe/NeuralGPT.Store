(async function(){
  const r = await fetch("/data/agents.json");
  const list = await r.json();
  const grid = document.getElementById("grid");
  const premiumGrid = document.getElementById("premium-grid");

  function makeCard(a){
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `<h3 style="color:${a.color}">${a.name}</h3>
      <p>${a.blurb}</p>
      <div>${a.category} ${a.displayOnly? "• Exposición" : ""}</div>
      <div style="margin-top:12px">
        ${a.displayOnly ? '<button class="btn ghost" disabled>Exhibición</button>' :
          (a.premium ? `<a class="btn" href="/pay/?sku=${a.id}">Adquirir · €${a.price}</a>` : `<button class="btn" onclick="alert('Acceso con Quantum Pass o gratis')">Acceder</button>`)}
      </div>`;
    return el;
  }

  list.forEach(a=>{
    const node = makeCard(a);
    if(a.premium){
      if(premiumGrid) premiumGrid.appendChild(node);
    } else {
      if(grid) grid.appendChild(node);
    }
  });

})();
