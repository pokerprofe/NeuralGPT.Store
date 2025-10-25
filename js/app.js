const DATA_URL = "data/models.json";
const catalog = document.getElementById("catalog");
const search = document.getElementById("search");

function card(item){
  const div = document.createElement("div");
  div.className="card";
  div.innerHTML = `
    <h3>${escapeHtml(item.nombre||"Untitled")}</h3>
    <p>${escapeHtml(item.descripcion||"")}</p>
    <div class="meta">
      <a class="btn" href="upload.html">Submit your model</a>
      <span></span>
    </div>`;
  return div;
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));}

async function load(){
  try{
    const res = await fetch(DATA_URL,{cache:"no-store"});
    const data = await res.json();
    window._models = Array.isArray(data)?data:[];
    render(window._models);
  }catch(e){
    catalog.innerHTML = "<p style='color:#8e8e8e'>No models available.</p>";
  }
}

function render(list){
  catalog.innerHTML = "";
  list.forEach(m => catalog.appendChild(card(m)));
}

search?.addEventListener("input", e=>{
  const q = (e.target.value||"").toLowerCase();
  const f = (window._models||[]).filter(m =>
    (m.nombre||"").toLowerCase().includes(q) ||
    (m.descripcion||"").toLowerCase().includes(q)
  );
  render(f);
});

load();
