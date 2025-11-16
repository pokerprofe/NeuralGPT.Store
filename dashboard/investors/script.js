async function loadInv(){
  const body = document.getElementById('i-body');
  try{
    const res = await fetch('/api/investor/list');
    const data = await res.json();
    const arr = data.proposals || [];

    body.innerHTML = '';
    arr.forEach(p=>{
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
      body.innerHTML = "<tr><td colspan='5'>No proposals</td></tr>";
    }

  }catch{
    body.innerHTML = "<tr><td colspan='5'>Error</td></tr>";
  }
}

loadInv();
setInterval(loadInv,5000);
