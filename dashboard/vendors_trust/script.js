async function loadVendors(){
  const body = document.getElementById('v-body');

  try{
    const res = await fetch('/api/vendors/trust');
    const data = await res.json();

    body.innerHTML = '';

    (data.vendors || []).forEach(v=>{
      const tr = document.createElement('tr');
      tr.innerHTML = 
        <td>\</td>
        <td>\</td>
        <td>\</td>
        <td>\</td>
        <td>\</td>
      ;
      body.appendChild(tr);
    });

    if(body.innerHTML.trim()===''){
      body.innerHTML = "<tr><td colspan='5'>No vendors</td></tr>";
    }

  }catch(err){
    body.innerHTML = "<tr><td colspan='5'>Error</td></tr>";
  }
}

loadVendors();
setInterval(loadVendors,5000);
