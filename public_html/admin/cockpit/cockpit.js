async function log(msg){
  const c = document.getElementById('console');
  c.textContent += '\\n' + msg;
  c.scrollTop = c.scrollHeight;
}

async function callEndpoint(url){
  try{
    const res = await fetch(url);
    const data = await res.json();
    await log('['+url+'] => ' + JSON.stringify(data));
  }catch(e){
    await log('ERROR '+url+': '+e);
  }
}

async function handleModule(mod){
  if(mod==='sistema'){
    await callEndpoint('/api/status');
    await callEndpoint('/api/analytics/monitor');
  } else if(mod==='analytics'){
    await callEndpoint('/api/analytics/stats');
    await callEndpoint('/api/analytics/radar');
  } else if(mod==='productos'){
    await callEndpoint('/api/products');
  } else if(mod==='agentes'){
    await callEndpoint('/api/agents');
  } else if(mod==='proveedores'){
    await callEndpoint('/api/suppliers/list');
  } else if(mod==='clientes'){
    await callEndpoint('/api/customers/list');
  } else if(mod==='seguridad'){
    await callEndpoint('/api/notify/last');
  } else if(mod==='neural'){
    await callEndpoint('/api/neural/status');
    await callEndpoint('/api/neural/pulse');
  } else {
    await log('Módulo no reconocido: '+mod);
  }
}

document.querySelectorAll('.panel').forEach(p=>{
  p.onclick = ()=> handleModule(p.dataset.module);
});
