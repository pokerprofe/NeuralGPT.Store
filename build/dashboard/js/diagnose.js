async function loadSummary(){
    const res = await fetch('/api/diagnose/summary');
    const data = await res.json();
    if(!data.ok) return;

    document.getElementById('val_server').textContent = data.summary.server_errors;
    document.getElementById('val_browser').textContent = data.summary.browser_errors;
    document.getElementById('val_guardian').textContent = data.summary.guardian_lines;

    // RGB alerta
    if(data.summary.server_errors>0) document.getElementById('c_server').classList.add('alert');
    if(data.summary.browser_errors>0) document.getElementById('c_browser').classList.add('alert');
    if(data.summary.guardian_lines>10) document.getElementById('c_guardian').classList.add('alert');
}

async function loadFull(){
    const res = await fetch('/api/diagnose/full');
    const data = await res.json();
    document.getElementById('full_output').textContent = JSON.stringify(data.full,null,2);
}

function exportLogs(){
    window.location.href = '/api/diagnose/export';
}

// Captura errores del navegador
window.onerror = function(msg,url,line){
    fetch('/api/diagnose/js_error',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({msg,url,line})
    });
};

document.addEventListener('DOMContentLoaded',loadSummary);
