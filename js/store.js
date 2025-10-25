(async function(){
  const grid = document.getElementById("grid");
  const q = document.getElementById("q");
  let models = [];
  async function load(){ try{ const r = await fetch("data/models.json"); models = await r.json(); render(); }catch(e){ grid.innerHTML = "<div style=\"color:#c69728\">No models available yet.</div>"; } }
  function card(m){
    const img = m.imagen ? `<img src="${m.imagen}" alt="" style="width:100%;height:140px;object-fit:cover;border-radius:10px;border:1px solid #1a1a1a;margin-bottom:10px">` : "";
    return `<div class="card">
      ${img}
      <h3>${m.nombre||"Untitled model"}</h3>
      <p>${m.descripcion||""}</p>
      <div class="btns">
        <a class="btn" href="#" onclick="alert('Demo disabled on static site')">Demo</a>
        <a class="btn" href="#" onclick="alert('Purchase flow enabled on Workspace deployment')">Buy</a>
      </div>
    </div>`;
  }
  function render(){
    const term = (q.value||"").toLowerCase().trim();
    const list = models.filter(m => !term || (m.nombre||"").toLowerCase().includes(term) || (m.descripcion||"").toLowerCase().includes(term));
    grid.innerHTML = list.map(card).join("") || `<div style="grid-column:1/-1;color:#c69728">Nothing found.</div>`;
  }
  q.addEventListener("input", render);
  load();
})();
