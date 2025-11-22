(async function(){
    try{
        const slot = document.getElementById("menu-slot");
        if(slot){
            const res = await fetch("../components/menu.html",{cache:"no-store"});
            if(res.ok){ slot.innerHTML = await res.text(); }
        }
    }catch(e){}
})();

document.getElementById("contactForm").addEventListener("submit", function(e){
    e.preventDefault();
    document.getElementById("contact-ok").style.display = "block";
});
