(async function(){
  const params = new URLSearchParams(window.location.search);
  const id   = params.get("id");
  const slug = params.get("slug");

  if(!id && !slug){
    document.body.innerHTML = "<h2>Invalid model reference</h2>";
    return;
  }

  try{
    const res = await fetch("/api/models");
    const data = await res.json();
    const list = data.models || data.agents || data.list || [];
    if(!Array.isArray(list) || !list.length){
      document.body.innerHTML = "<h2>No models available</h2>";
      return;
    }

    const model = list.find(m =>
      (id   && (m.id === id || m._id === id)) ||
      (slug && (m.slug === slug))
    ) || list.find(m => m.slug === slug) || list[0];

    if(!model){
      document.body.innerHTML = "<h2>Model not found</h2>";
      return;
    }

    const title   = model.title || model.name || "Untitled model";
    const img     = model.logoUrl || model.img || "/assets/img/default_model.png";
    const desc    = model.longDescription || model.description || model.shortDescription || model.desc || "No detailed description yet.";
    const author  = model.vendor || model.author || model.createdBy || "NeuralGPT.Store";
    const cat     = model.category || "General";
    const created = model.createdAt ? new Date(model.createdAt) : null;
    const price   = typeof model.price === "number" ? model.price : 19.95;
    const badges  = model.badges || [];
    const locked  = !!model.locked;

    document.getElementById("mp_title").innerText  = title;
    document.getElementById("mp_img").src         = img;
    document.getElementById("mp_desc").innerText  = desc;
    document.getElementById("mp_author").innerText= author;
    document.getElementById("mp_cat").innerText   = cat;
    document.getElementById("mp_date").innerText  = created ? created.toLocaleDateString() : "N/A";
    document.getElementById("mp_price").innerText = price.toFixed(2) + " €";

    // Badges
    document.getElementById("mp_badges").innerHTML =
      badges.map(b=>{
        const cls = b.toLowerCase();
        return `<span class="badge badge-\${cls}">\${b}</span>`;
      }).join("");

    // EDO Tag
    const edoTag = document.getElementById("mp_edoTag");
    if(locked){
      edoTag.innerText = "EDO only · PRO access";
      edoTag.classList.add("mp-edo-locked");
    }else{
      edoTag.innerText = "Available as single purchase";
      edoTag.classList.add("mp-edo-open");
    }

    // Actions
    const chatUrl = model.publicUrl || model.link || model.url || "";
    const btnUse  = document.getElementById("mp_use");
    const btnBuy  = document.getElementById("mp_buy");

    btnUse.onclick = ()=>{
      if(chatUrl){
        window.open(chatUrl, "_blank");
      }else{
        alert("This model does not have a public ChatGPT link yet. You can still sell it as a service.");
      }
    };

    btnBuy.onclick = ()=>{
      if(locked){
        // EDO skeleton (Google Pay) que ya tienes
        window.location = "/app/sections/edo.html";
      }else{
        // Futuro checkout individual. De momento, página EDO también.
        window.location = "/app/sections/edo.html";
      }
    };

  }catch(e){
    document.body.innerHTML = "<h2>Error loading model details</h2>";
  }
})();
