async function loadSubs(){
  const body = document.getElementById('subs-body');
  const filter = document.getElementById('filter').value.toLowerCase();

  try{
    const res = await fetch('/api/subscription/list');
    const data = await res.json();
    const arr = data.subscribers || [];

    body.innerHTML = '';

    arr.filter(s => 
      s.email.toLowerCase().includes(filter) ||
      s.country.toLowerCase().includes(filter)
    ).forEach(s=>{
      const tr = document.createElement('tr');
      tr.innerHTML = 
        <td>\</td>
        <td>\</td>
        <td>\</td>
        <td>\</td>
      ;
      body.appendChild(tr);
    });

    if(body.innerHTML.trim()===''){
      body.innerHTML = "<tr><td colspan='4'>No matches</td></tr>";
    }

  }catch(err){
    body.innerHTML = "<tr><td colspan='4'>Error</td></tr>";
  }
}

document.getElementById('filter').addEventListener('input', loadSubs);

loadSubs();
setInterval(loadSubs,5000);
