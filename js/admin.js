(function(){
  const KEY_INPUT = document.getElementById("adminkey");
  const BTN = document.getElementById("btnUse");
  const S = {
    models: document.getElementById("k_models"),
    sales: document.getElementById("k_sales"),
    revenue: document.getElementById("k_revenue"),
    creators: document.getElementById("k_creators"),
    tSales: document.querySelector("#t_sales tbody"),
    tModels: document.querySelector("#t_models tbody"),
  };
  let KEY = localStorage.getItem("NGPT_ADMIN_KEY") || "";

  function fmt(n){try{return (+n).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2});}catch{return n}}
  function td(v){const d=document.createElement("td"); d.textContent=v; return d}
  function tr(cells){const r=document.createElement("tr"); cells.forEach(v=>r.appendChild(td(v))); return r}

  async function load(){
    if(!KEY){ return; }
    const h = { "X-ADMIN-KEY": KEY };
    const res = await fetch("http://localhost:4000/api/admin/stats",{headers:h});
    if(!res.ok){ alert("Clave incorrecta"); return; }
    const data = await res.json();
    S.models.textContent = data.totals.totalModels;
    S.sales.textContent = data.totals.totalSales;
    S.revenue.textContent = fmt(data.totals.gross);
    S.creators.textContent = data.totals.creators;

    S.tSales.innerHTML = "";
    (data.lastSales||[]).forEach(s=>{
      S.tSales.appendChild(tr([s.date?.replace("T"," ").slice(0,19), s.model, s.id, fmt(s.amount), s.buyer_email||"", s.seller_email||""]));
    });

    S.tModels.innerHTML = "";
    (data.recentModels||[]).forEach(m=>{
      S.tModels.appendChild(tr([m.id, m.nombre, (m.creado||"").replace("T"," ").slice(0,19)]));
    });
  }

  BTN.addEventListener("click", ()=>{
    KEY = KEY_INPUT.value.trim();
    if(!KEY){ alert("Introduce la clave"); return; }
    localStorage.setItem("NGPT_ADMIN_KEY", KEY);
    load();
  });

  // autoload si hay clave guardada
  if(KEY){ KEY_INPUT.value = KEY; load(); }
})();
