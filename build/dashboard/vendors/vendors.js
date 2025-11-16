async function loadVendors(){
  const body = document.getElementById('vendors-body');

  try{
    const res = await fetch('/api/vendor/list'); // debe existir más adelante
    const data = await res.json();

    body.innerHTML = '';

    (data.list || []).forEach(v=>{
      const tr = document.createElement('tr');

      let status = 'PENDING';
      if(v.score >= 80) status = 'APPROVED';
      else if(v.score >= 60) status = 'SAFE';
      else status = 'REJECTED';

      tr.innerHTML = 
        <td>\</td>
        <td>\</td>
        <td>\</td>
        <td>\</td>
        <td>\app.get('/api/neural/status', (req,res)=>{
  res.json(neural.systemHealth());
});</td>
      ;

      body.appendChild(tr);
    });

  }catch(e){
    body.innerHTML = "<tr><td colspan='5'>Error loading vendor data.</td></tr>";
  }
}

loadVendors();
