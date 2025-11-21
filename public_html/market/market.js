async function loadAll(){

  // Productos
  let r1 = await fetch('/api/products');
  let p = await r1.json();
  let prod = document.getElementById('prod');
  prod.innerHTML='';
  p.forEach(x=>{
    let div = document.createElement('div');
    div.className='item';
    div.innerHTML='<b>'+x.name+'</b> — '+x.price+'€ ('+x.category+')';
    prod.appendChild(div);
  });

  // Agentes IA
  let r2 = await fetch('/api/agents');
  let a = await r2.json();
  let agents = document.getElementById('agents');
  agents.innerHTML='';
  (a.list||[]).forEach(x=>{
    let div = document.createElement('div');
    div.className='item';
    div.innerHTML='<b>'+x.name+'</b><br>'+x.description;
    agents.appendChild(div);
  });

  // Proveedores
  let r3 = await fetch('/api/suppliers/list');
  let s = await r3.json();
  let sup = document.getElementById('sup');
  sup.innerHTML='';
  (s.list||[]).forEach(x=>{
    let div = document.createElement('div');
    div.className='item';
    div.innerHTML='<b>'+x.company+'</b> ('+x.country+') — '+x.category;
    sup.appendChild(div);
  });
}

loadAll();
