(async function(){
  async function loadVendors(){
    const res = await fetch('/api/admin/vendors');
    const data = await res.json();
    const box = document.getElementById('vendorsList');
    box.innerHTML = '';

    if(!data.ok || data.vendors.length === 0){
      box.innerHTML = '<div class=\"empty\">No vendor applications yet.</div>';
      return;
    }

    data.vendors.forEach(v=>{
      const item = document.createElement('div');
      item.className = 'vendor-item';
      item.innerHTML = 
        <h3>\</h3>
        <p><strong>Email:</strong> \</p>
        <p><strong>Message:</strong><br>\</p>
        <p class=\"date\">Received: \</p>
        <button class=\"mark-btn\" data-id=\"\\">Mark as reviewed</button>
      ;
      box.appendChild(item);
    });

    document.querySelectorAll('.mark-btn').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        await fetch('/api/admin/vendors/mark', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({ id:btn.dataset.id })
        });
        loadVendors();
      });
    });
  }

  loadVendors();
})();
