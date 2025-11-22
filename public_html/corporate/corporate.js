(async function(){
    try{
        const slot = document.getElementById("menu-slot");
        if(!slot) return;
        const res = await fetch("../components/menu.html", {cache:"no-store"});
        if(res.ok){
            slot.innerHTML = await res.text();
        }
    }catch(e){}
})();
