const fs = require('fs');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

const DB = path.join(__dirname,'expenses.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function addExpense(data){
  const list = load();

  const d = new Date(data.date || Date.now());
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const quarter = Math.floor((month-1)/3)+1;

  const item = {
    id: Date.now(),
    date: d.toISOString().substring(0,10),
    year,
    quarter,
    month,
    concept: data.concept || '',
    category: data.category || 'other',
    provider: data.provider || '',
    base: Number(data.base || 0),
    vat: Number(data.vat || 0),
    total: Number(data.total || 0),
    note: data.note || ''
  };

  list.push(item);
  save(list);

  ACT.log({
    type: 'tax',
    detail: 'New expense registered: '+item.concept+' ('+item.total+' EUR)',
    user: 'tax_engine'
  });

  return item;
}

function listExpenses(filter){
  const list = load();
  let out = list;

  if(filter.year){
    out = out.filter(e=>e.year === Number(filter.year));
  }
  if(filter.quarter){
    out = out.filter(e=>e.quarter === Number(filter.quarter));
  }
  if(filter.category){
    out = out.filter(e=>e.category === filter.category);
  }

  return out.sort((a,b)=> (a.date < b.date ? -1 : 1));
}

function summary(filter){
  const list = listExpenses(filter);
  let base = 0, vat = 0, total = 0;

  list.forEach(e=>{
    base += e.base;
    vat += e.vat;
    total += e.total;
  });

  return { base, vat, total, count:list.length };
}

function exportCSV(filter){
  const list = listExpenses(filter);
  const header = 'date;year;quarter;month;concept;category;provider;base;vat;total;note';
  const lines = [header];

  list.forEach(e=>{
    lines.push([
      e.date,
      e.year,
      e.quarter,
      e.month,
      (e.concept || '').replace(/;/g,','),
      (e.category || '').replace(/;/g,','),
      (e.provider || '').replace(/;/g,','),
      e.base,
      e.vat,
      e.total,
      (e.note || '').replace(/;/g,',')
    ].join(';'));
  });

  return lines.join('\n');
}

module.exports = { addExpense, listExpenses, summary, exportCSV };
