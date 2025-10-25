/* ===== NeuralGPT.store AI – UI lógica ===== */
const $ = (q,ctx=document)=>ctx.querySelector(q);
const $$ = (q,ctx=document)=>[...ctx.querySelectorAll(q)];

const state = { all:[], view:[] };

async function load(){
  try{
    const res = await fetch("data/agents.json?cache="+Date.now());
    state.all = await res.json();
    state.view = [...state.all];
    render();
  }catch(e){ console.error("No se pudo cargar agents.json", e); }
}

function fmtPrice(v){ return Number(v).toLocaleString("es-ES",{style:"currency",currency:"EUR"}) }

function render(){
  const grid = $("#grid"); grid.innerHTML = "";
  state.view.forEach(a=>{
    const premium = a.premium === true;
    const pass = a.plan === "pass" || a.plan === "Quantum Pass";

    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <div class="meta">
        <span class="chip">${a.category||"IA"}</span>
        ${premium ? `<span class="chip chip-premium">Elite</span>`:``}
        ${a.price ? `<span class="chip price">${fmtPrice(a.price)}</span>`:``}
      </div>
      <div class="title">${a.name}</div>
      <div class="desc">${a.blurb||""}</div>
      <div class="cta">
        ${premium
          ? `<a class="btn btn--gold" href="pay/index.html?sku=${encodeURIComponent(a.id)}">Comprar</a>`
          : `<a class="btn" href="quantum-pass/">Acceder con Pass</a>`
        }
        <a class="btn" href="${a.more||'#'}" target="_blank" rel="noopener">Detalles</a>
      </div>
    `;
    grid.appendChild(el);
  });
}

function filter(term){
  const v = term.trim().toLowerCase();
  if(!v){ state.view = [...state.all]; render(); return; }
  state.view = state.all.filter(a=>{
    const pool = [a.name, a.category, a.tags, a.blurb].join(" ").toLowerCase();
    return pool.includes(v);
  });
  render();
}

$("#search").addEventListener("input", e=> filter(e.target.value));
$("#btnClear").addEventListener("click", ()=>{
  $("#search").value=""; filter("");
});

document.addEventListener("DOMContentLoaded", load);
