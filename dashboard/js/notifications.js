(function(){
    let lastTime = null;
    const rootId = 'toast-root';

    function ensureRoot(){
        let r = document.getElementById(rootId);
        if(!r){
            r = document.createElement('div');
            r.id = rootId;
            r.className = 'toast-root';
            document.body.appendChild(r);
        }
        return r;
    }

    function showToast(ev){
        const root = ensureRoot();
        const box = document.createElement('div');
        box.className = 'toast-box toast-' + (ev.type || 'generic');

        const t = document.createElement('div');
        t.className = 'toast-title';
        t.textContent = (ev.type || 'event').toUpperCase();

        const m = document.createElement('div');
        m.className = 'toast-msg';
        m.textContent = ev.message || '';

        const meta = document.createElement('div');
        meta.className = 'toast-meta';
        meta.textContent = ev.time || '';

        box.appendChild(t);
        box.appendChild(m);
        box.appendChild(meta);

        root.appendChild(box);

        setTimeout(()=>{ box.classList.add('toast-hide'); }, 3500);
        setTimeout(()=>{ if(box.parentNode){ box.parentNode.removeChild(box); } }, 4500);
    }

    async function poll(){
        try{
            const res = await fetch('/api/admin/notify/feed');
            const data = await res.json();
            if(!data || !data.ok) return;
            const events = data.events || [];
            if(events.length === 0) return;

            const fresh = [];
            for(const ev of events){
                if(!lastTime || ev.time > lastTime){
                    fresh.push(ev);
                }
            }
            if(events.length > 0){
                lastTime = events[events.length - 1].time;
            }
            fresh.forEach(showToast);
        }catch(e){
            console.error('notify poll error', e);
        }
    }

    document.addEventListener('DOMContentLoaded', ()=>{
        setInterval(poll, 5000);
        poll();
    });
})();
