// carga models from dashboard/data/models.json
async function loadModels(){
  const res = await fetch('/dashboard/data/models.json');
  const data = await res.json();
  const grid = document.querySelector('#grid');
  grid.innerHTML = '';
  data.forEach(m=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = <div class='title'>\</div>
                      <div class='desc'>\</div>
                      <div style='display:flex;align-items:center;justify-content:space-between'>
                        <div class='price'>€\</div>
                        <div class='actions'>
                          <button class='btn' onclick=\"location.href='/products/\.html'\">Ver</button>
                          <button class='cta-buy' onclick=\"location.href='/checkout.html?product=\'\">Comprar</button>
                        </div>
                      </div>;
    grid.appendChild(card);
  });
}
window.addEventListener('load', loadModels);
