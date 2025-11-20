console.log('%cSMART STORE ENGINE 4.1 – TurboCache+LazyLoad cargado','color:#F4C857;font-size:14px');

async function loadProducts(){
    try{
        // --- TurboCache ---
        let cache = localStorage.getItem('storeCache');
        if(cache){
            renderProducts(JSON.parse(cache));
        }
        const res = await fetch('/data/products.json');
        const list = await res.json();

        localStorage.setItem('storeCache', JSON.stringify(list));
        renderProducts(list);
        bindFilters(list);
    }catch(e){
        console.error('Error motor 4.1:', e);
    }
}

function renderProducts(list){
    const wrap = document.getElementById('storeGrid');
    wrap.innerHTML = "";

    list.forEach(p=>{
        const card = document.createElement('div');
        card.className = 'model-card glow card-fade';

        card.innerHTML = 
            <img data-src="" class="model-img lazy" />
            <h2 class="model-title"></h2>
            <p class="model-meta"></p>

            <div class="model-badge-featured">Premium</div>
        ;
        wrap.appendChild(card);
    });

    lazyLoad();
}

function lazyLoad(){
    const imgs = document.querySelectorAll('img.lazy');
    const obs = new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                const img = e.target;
                img.src = img.dataset.src;
                img.classList.add('glow-rgb');
                obs.unobserve(img);
            }
        });
    });
    imgs.forEach(i=>obs.observe(i));
}

function bindFilters(full){
    const sel = document.getElementById('filterCat');
    const ord = document.getElementById('filterSort');

    function apply(){
        let arr = [...full];

        if(sel && sel.value !== 'all'){
            arr = arr.filter(x=>x.category===sel.value);
        }

        if(ord && ord.value!=='none'){
            if(ord.value==='sales') arr.sort((a,b)=>b.sales-a.sales);
            if(ord.value==='price_low') arr.sort((a,b)=>a.price-b.price);
            if(ord.value==='price_high') arr.sort((a,b)=>b.price-a.price);
        }
        renderProducts(arr);
    }

    sel?.addEventListener('change', apply);
    ord?.addEventListener('change', apply);
}

document.addEventListener('DOMContentLoaded', loadProducts);

