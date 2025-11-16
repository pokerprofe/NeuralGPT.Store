(() => {
  const API = window.NGPT_API || "http://localhost:4000";
  const form = document.getElementById("uform");
  const msg  = document.getElementById("msg");

  function ok(t){ msg.style.color="#8f8"; msg.textContent=t; }
  function err(t){ msg.style.color="#f66"; msg.textContent=t; }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.style.color="#ddd"; msg.textContent="Subiendo…";
    const data = new FormData(form);
    try{
      const res = await fetch(API + "/api/upload", { method:"POST", body:data });
      const out = await res.json();
      if(!res.ok) throw new Error(out.error || "Error en la subida");
      ok("Publicado ✅  ID: " + out.id);
      form.reset();
    }catch(e){ err("Error: " + e.message); }
  });
})();
