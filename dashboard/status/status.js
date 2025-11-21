async function loadData(){
  const ids = {
    subs: document.getElementById('subs'),
    vendors: document.getElementById('vendors'),
    cust: document.getElementById('cust'),
    invest: document.getElementById('invest'),
    ent: document.getElementById('ent'),
    srv: document.getElementById('srv'),
  };

  try{
    const res = await fetch('/api/status/overview');
    const data = await res.json();

    ids.subs.textContent   = data.subscribers;
    ids.vendors.textContent = data.vendors;
    ids.cust.textContent   = data.customer_questions;
    ids.invest.textContent = data.investor_proposals;
    ids.ent.textContent    = data.enterprise_requests;
    ids.srv.textContent    = data.server;
  }catch(e){
    ids.srv.textContent = 'Error';
  }
}

loadData();
setInterval(loadData, 5000);
