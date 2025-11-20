async function loadGuardian(){
    try{
        const r = await fetch('/api/system/guardian');
        const j = await r.json();

        const box = document.getElementById('g-status');
        const logbox = document.getElementById('g-log');

        if(!j.ok){
            box.className = 'g-status g-red';
            box.innerText = 'Guardian: OFFLINE';
        }else{
            box.className = 'g-status g-green';
            box.innerText = 'Guardian: ONLINE – ' + new Date(j.time).toLocaleTimeString();
        }

        // Pedir últimos logs (servidor los entrega)
        const lr = await fetch('/logs/guardian.log');
        const txt = await lr.text();
        logbox.innerText = txt.split('\n').slice(-12).join('\n');
    }
    catch(e){
        const box = document.getElementById('g-status');
        box.className = 'g-status g-red';
        box.innerText = 'Guardian ERROR';
    }
}

setInterval(loadGuardian, 4000);
loadGuardian();
