async function loadSummary(){
  try{
    const res = await fetch('/api/admin/accounting/summary');
    const data = await res.json();
    if(!data.ok) return;

    const fmt = v => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(v||0);

    document.getElementById('acc_income').textContent  = fmt(data.totals.income);
    document.getElementById('acc_expense').textContent = fmt(data.totals.expense);
    document.getElementById('acc_balance').textContent = fmt(data.totals.balance);

    const tbody = document.getElementById('acc_rows');
    tbody.innerHTML = '';
    for(const r of data.last){
      const tr = document.createElement('tr');
      const cells = [
        r.date || '',
        r.type || '',
        r.amount || '',
        r.currency || 'EUR',
        r.source || '',
        r.user || '',
        r.description || ''
      ];
      for(const c of cells){
        const td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

  }catch(e){
    console.error('Accounting load error',e);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  loadSummary();
  const btn = document.getElementById('btn_export');
  if(btn){
    btn.addEventListener('click',()=>{
      window.location.href = '/api/admin/accounting/export/csv';
    });
  }
});
