const fs = require('fs');
const path = require('path');

function loadJsonArray(p){
  try{
    if(!fs.existsSync(p)) return [];
    const raw = fs.readFileSync(p,'utf8') || '[]';
    const data = JSON.parse(raw);
    if(Array.isArray(data)) return data;
    if(data && typeof data === 'object') return Object.values(data);
    return [];
  }catch(e){
    return [];
  }
}

module.exports = (app)=>{
  const paymentsPath = path.join(__dirname,'../database/payments.json');
  const invoicesPath = path.join(__dirname,'../database/invoices.json');
  const ingresosDir  = path.join(__dirname,'../contabilidad/ingresos');
  const balancesDir  = path.join(__dirname,'../contabilidad/balances');

  if(!fs.existsSync(ingresosDir)) fs.mkdirSync(ingresosDir, {recursive:true});
  if(!fs.existsSync(balancesDir)) fs.mkdirSync(balancesDir, {recursive:true});

  // Resumen simple para el panel
  app.get('/api/admin/accounting/summary',(req,res)=>{
    const payments = loadJsonArray(paymentsPath);
    const invoices = loadJsonArray(invoicesPath);

    let totalIncome = 0;
    let totalExpense = 0;

    for(const p of payments){
      const amount = Number(p.amount || 0);
      if(!amount || isNaN(amount)) continue;
      if((p.type||'').toLowerCase() === 'gasto') totalExpense += amount;
      else totalIncome += amount;
    }

    const balance = totalIncome - totalExpense;
    const lastFive = payments.slice(-5).reverse();

    return res.json({
      ok:true,
      totals:{
        income: totalIncome,
        expense: totalExpense,
        balance
      },
      last: lastFive
    });
  });

  // Exportación CSV lista para abrir en Excel / Word / PDF
  app.get('/api/admin/accounting/export/csv',(req,res)=>{
    const payments = loadJsonArray(paymentsPath);
    const headers = ['date','type','amount','currency','source','user','description'];
    const lines = [];
    lines.push(headers.join(';'));

    for(const p of payments){
      const row = headers.map(h=>{
        const v = (p[h] !== undefined && p[h] !== null) ? String(p[h]) : '';
        return '"'+v.replace(/"/g,'""')+'"';
      }).join(';');
      lines.push(row);
    }

    const csv = lines.join('\n');
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.setHeader('Content-Disposition','attachment; filename="neuralgpt_contabilidad.csv"');
    return res.send(csv);
  });
};
