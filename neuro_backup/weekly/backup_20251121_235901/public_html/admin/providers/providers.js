async function loadProviders(){
  const status = document.getElementById('statusFilter').value;
  const res = await fetch('/api/providers/list?status='+status);
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = '';
  data.list.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = 
      <b></b> — <span class='badge'></span><br>
      Email: <br>
      País: <br>
      Categorías: <br>
      <button onclick="updateProv('','approved')">Aprobar</button>
      <button onclick="updateProv('','rejected')">Rechazar</button>
    ;
    list.appendChild(div);
  });
}

async function updateProv(id,status){
  await fetch('/api/providers/update', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ id, status })
  });
  loadProviders();
}

loadProviders();
