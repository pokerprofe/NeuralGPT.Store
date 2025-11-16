(async function(){
  const box = document.getElementById('usersList');
  const res = await fetch('/api/admin/users');
  const data = await res.json();

  if(!data.ok){
    box.innerHTML = '<div class=\"empty\">No users found.</div>';
    return;
  }

  data.users.forEach(u=>{
    const div = document.createElement('div');
    div.className = 'user-card';

    div.innerHTML = 
      <h3>\</h3>
      <p><strong>Date:</strong> \</p>
      <p><strong>Status:</strong> \</p>
      <button class=\"toggle\" data-id=\"\\">
        \
      </button>
      <button class=\"delete\" data-id=\"\\">Delete User</button>
    ;

    box.appendChild(div);
  });

  document.querySelectorAll('.toggle').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      await fetch('/api/admin/users/toggle', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:btn.dataset.id})
      });
      location.reload();
    });
  });

  document.querySelectorAll('.delete').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      await fetch('/api/admin/users/delete', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:btn.dataset.id})
      });
      location.reload();
    });
  });

})();
