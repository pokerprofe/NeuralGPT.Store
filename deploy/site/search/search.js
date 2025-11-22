(async function(){
    try{
        const slot = document.getElementById("menu-slot");
        if(slot){
            const res = await fetch("../components/menu.html",{cache:"no-store"});
            if(res.ok){ slot.innerHTML = await res.text(); }
        }
    }catch(e){}
})();

const input = document.getElementById("searchInput");
const btn   = document.getElementById("searchBtn");
const box   = document.getElementById("results");

async function loadProducts(){
    try{
        const res = await fetch("../data/products.json",{cache:"no-store"});
        if(!res.ok) return [];
        return await res.json();
    }catch(e){ return []; }
}

async function performSearch(){
    const q = input.value.trim().toLowerCase();
    if(!q){ box.innerHTML = ""; return; }

    const products = await loadProducts();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.short && p.short.toLowerCase().includes(q))
    );

    box.innerHTML = filtered.map(p => `
        <div class="result-card" onclick="window.location.href='../product/index.html?id=${p.id}'">
            <h3>${p.name}</h3>
            <p>${p.category}</p>
        </div>
    `).join("");
}

btn.addEventListener("click", performSearch);
input.addEventListener("keyup", e => {
    if(e.key === "Enter") performSearch();
});
