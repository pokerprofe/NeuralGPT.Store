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
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>NeuralGPT.store AI</title>
  <link rel="stylesheet" href="/assets/css/main.css">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;">
</head>
<body class="page-dark">
  <header class="site-header">
    <h1 id="brand">NeuralGPT.store <span class="mini">AI</span></h1>
    <nav class="top-actions">
      <a href="/quantum-pass/index.html" class="btn">Quantum Pass</a>
      <a href="/premium/index.html" class="btn ghost">Modelos Premium</a>
    </nav>
  </header>

  <main>
    <section class="catalog">
      <h2>Explora tus agentes de IA</h2>
      <div id="grid" class="grid"></div>
    </section>
  </main>

  <footer>
    <small>© 2025 PokerShadow.ink — NeuralGPT.store AI</small>
  </footer>

  <script src="/assets/js/app.js" defer></script>
  <!-- Panel modal de suscripción -->
  <div class="modal-overlay" id="subscribeModal">
    <div class="modal">
      <button class="modal-close" id="closeModal">&times;</button>
      <h2>Activar modelo Premium</h2>
      <p>Introduce tu correo electrónico para recibir tu acceso y recibo.</p>
      <form id="subForm">
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" name="email" required placeholder="tu@email.com">
        <div class="buttons">
          <button type="submit" class="btn gold">Continuar</button>
        </div>
      </form>
      <div id="paymentSection" style="display:none">
        <p style="margin-top:18px">Selecciona método de pago:</p>
        <button id="payGoogle" class="btn">Google Pay</button>
        <button id="payPayPal" class="btn gold">PayPal</button>
      </div>
    </div>
  </div>
</body>' | Set-Content "C:\NeuralGPT_Deploy\index.html"

# Lógica del modal (se agrega al final del app.js)
@'
/* === Modal de suscripción === */
const modal=document.getElementById("subscribeModal");
const closeModal=document.getElementById("closeModal");
const subForm=document.getElementById("subForm");
const paymentSection=document.getElementById("paymentSection");

document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-sku]");
  if(btn){
    modal.style.display="flex";
    subForm.dataset.sku=btn.dataset.sku;
  }
});
closeModal.addEventListener("click",()=>modal.style.display="none");

subForm.addEventListener("submit",e=>{
  e.preventDefault();
  const email=e.target.email.value.trim();
  if(!email)return alert("Introduce un correo válido");
  subForm.style.display="none";
  paymentSection.style.display="block";
});

["payGoogle","payPayPal"].forEach(id=>{
  const el=document.getElementById(id);
  if(el){
    el.addEventListener("click",()=>{
      const sku=subForm.dataset.sku;
      const email=document.getElementById("email").value;
      alert(`(Simulado) Enviando ${sku} y ${email} al servidor para pago seguro...`);
      modal.style.display="none";
      subForm.style.display="block";
      paymentSection.style.display="none";
    });
  }
});
</html>
/* === Envío de correo + pago al servidor === */
function sendSubscription(email, sku){
  fetch("http://localhost:4000/api/subscribe", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email, sku})
  })
  .then(r=>r.json())
  .then(d=>{
    alert(`✅ ${d.message}\nHash: ${d.hash.slice(0,12)}...`);
  })
  .catch(()=>alert("⚠️ Error de conexión al servidor"));
}

["payGoogle","payPayPal"].forEach(id=>{
  const el=document.getElementById(id);
  if(el){
    el.addEventListener("click",()=>{
      const sku=subForm.dataset.sku;
      const email=document.getElementById("email").value;
      sendSubscription(email, sku);
      modal.style.display="none";
      subForm.style.display="block";
      paymentSection.style.display="none";
    });
  }
});
