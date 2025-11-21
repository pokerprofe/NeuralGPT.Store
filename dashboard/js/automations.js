async function fetchList(){
  const res = await fetch("/api/admin/automations/list");
  const data = await res.json();
  if(!data.ok) return;
  const wrap = document.getElementById("auto_list");
  wrap.innerHTML = "";
  data.items.forEach(item=>{
    const div = document.createElement("div");
    div.className = "auto-item";

    const h = document.createElement("h3");
    h.textContent = item.title || "(untitled)";
    div.appendChild(h);

    const pills = document.createElement("div");
    const pType = document.createElement("span");
    pType.className = "auto-pill " + (item.type === "map" ? "map" : "blue");
    pType.textContent = item.type === "map" ? "MAP" : "BLUEPRINT";
    pills.appendChild(pType);

    if(item.visibility === "showcase"){
      const pShow = document.createElement("span");
      pShow.className = "auto-pill showcase";
      pShow.textContent = "SHOWCASE";
      pills.appendChild(pShow);
    }
    div.appendChild(pills);

    const meta = document.createElement("div");
    meta.className = "auto-meta";
    meta.textContent = (item.createdAt || "").replace("T"," ").replace("Z","");
    div.appendChild(meta);

    const notes = document.createElement("div");
    notes.className = "auto-meta";
    notes.textContent = item.notes || "";
    div.appendChild(notes);

    if(item.url){
      const links = document.createElement("div");
      links.className = "auto-links";
      const a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.textContent = "Open file";
      links.appendChild(a);
      div.appendChild(links);
    }
    wrap.appendChild(div);
  });
}

function bindForms(){
  const fm = document.getElementById("form_map");
  const fb = document.getElementById("form_blue");
  const reload = document.getElementById("btn_reload");

  if(fm){
    fm.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const fd = new FormData(fm);
      const res = await fetch("/api/admin/automations/upload-map",{
        method:"POST",
        body:fd
      });
      const data = await res.json();
      if(data.ok) fm.reset();
      fetchList();
    });
  }

  if(fb){
    fb.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const fd = new FormData(fb);
      const res = await fetch("/api/admin/automations/upload-blueprint",{
        method:"POST",
        body:fd
      });
      const data = await res.json();
      if(data.ok) fb.reset();
      fetchList();
    });
  }

  if(reload){
    reload.addEventListener("click", fetchList);
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  bindForms();
  fetchList();
});
