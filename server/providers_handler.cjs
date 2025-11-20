const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data', 'vendor_leads.json');

function load(){
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file));
  return raw.map((x,i)=>({
    id: x.id || ('V'+(i+1)),
    company: x.company || x.empresa || '',
    email: x.email || x.emailEmpresa || '',
    country: x.country || x.pais || '',
    categories: x.categories || x.categorias || '',
    status: x.status || 'pending',
    _raw: x
  }));
}

function save(list){
  const out = list.map(i=>({
    ...i._raw,
    id: i.id,
    status: i.status
  }));
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
}

function listByStatus(status){
  const all = load();
  if (status === 'all') return all;
  return all.filter(x=>x.status === status);
}

function updateStatus(id,status){
  const all = load();
  const idx = all.findIndex(x=>x.id === id);
  if (idx === -1) return { ok:false };
  all[idx].status = status;
  save(all);
  return { ok:true };
}

module.exports = { listByStatus, updateStatus };
