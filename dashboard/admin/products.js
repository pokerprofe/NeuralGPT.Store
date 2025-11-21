(async function(){

  const listBox = document.getElementById('productList');
  const btnSave = document.getElementById('p_save');

  async function load(){
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    listBox.innerHTML = '';

    if(!data.ok) return;

    data.products.forEach(p=>{
      const div = document.createElement('div');
      div.className = 'product-card rgb-frame';

      div.innerHTML = \
        <img src="\" class="p-img">
        <h3>\</h3>
        <p><strong>SKU:</strong> \</p>
        <p><strong>Category:</strong> \</p>
        <p><strong>Price:</strong> \ €</p>
        <p><strong>Stock:</strong> \</p>
        <button data-id="\" class="del">Delete</button>
      \;

      listBox.appendChild(div);
    });

    document.querySelectorAll('.del').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        await fetch('/api/admin/products/delete', {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body:JSON.stringify({ id: btn.dataset.id })
        });
        load();
      });
    });
  }

  btnSave.addEventListener('click', async ()=>{
    const body = {
      title:   document.getElementById('p_title').value,
      sku:     document.getElementById('p_sku').value,
      category:document.getElementById('p_cat').value,
      price:   Number(document.getElementById('p_price').value),
      stock:   Number(document.getElementById('p_stock').value),
      img:     document.getElementById('p_img').value,
      vendor:  document.getElementById('p_vendor').value
    };

    await fetch('/api/admin/products/save', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });

    load();
  });

  load();
})();
