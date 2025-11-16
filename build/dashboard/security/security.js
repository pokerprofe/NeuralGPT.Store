async function loadSecurity(){
  const body = document.getElementById('sec-body');

  try{
    const res = await fetch('/api/security/logs');
    const data = await res.json();

    body.innerHTML = '';

    (data.logs || []).forEach(e=>{
      const tr = document.createElement('tr');
      tr.innerHTML = 
        <td>\</td>
        <td>\</td>
        <td>\</td>
        <td>\</td>
      ;
      body.appendChild(tr);
    });

  }catch(err){
    body.innerHTML = "<tr><td colspan='4'>Error loading security logs.</td></tr>";
  }
}

loadSecurity();
setInterval(loadSecurity, 5000);
