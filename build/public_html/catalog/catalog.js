async function loadCatalog(){
  const box = document.getElementById('catalog');
  try{
    const res = await fetch('/api/catalog/ext/list');
    const data = await res.json();

    box.innerHTML = '';

    (data.list || []).forEach(p=>{
      const div = document.createElement('div');
      div.className = 'card';

      div.innerHTML = 
        <img src='\' alt='thumb'>
        <h3>\</h3>
        <p>Categoría: \</p>
        <p>Proveedor: \</p>
        <p>Comisión: \</p>
        <a href='\' target='_blank'>Ver Producto</a>
      ;

      box.appendChild(div);
    });

  } catch(e){
    box.innerHTML = '<p>Error cargando catálogo.</p>';
  }
}

loadCatalog();
