const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'vendor_leads.json');

function load(){
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}
function save(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

module.exports = {
  list(){
    return load();
  },

  search(q){
    q = q.toLowerCase();
    return load().filter(v =>
      (v.company && v.company.toLowerCase().includes(q)) ||
      (v.email && v.email.toLowerCase().includes(q)) ||
      (v.country && v.country.toLowerCase().includes(q)) ||
      (v.categories && v.categories.toLowerCase().includes(q))
    );
  },

  add(data){
    let list = load();
    const id = 'SUP-' + Date.now();
    const entry = { id, t:Date.now(), approved:false, ...data };
    list.push(entry);
    save(list);
    return { ok:true, id, entry };
  },

  approve(id){
    let list = load();
    let i = list.findIndex(v=>v.id==id);
    if(i<0) return { ok:false, msg:'Proveedor no encontrado' };
    list[i].approved = true;
    save(list);
    return { ok:true, entry:list[i] };
  },

  edit(id, data){
    let list = load();
    let i = list.findIndex(v=>v.id==id);
    if(i<0) return { ok:false, msg:'Proveedor no encontrado' };
    list[i] = { ...list[i], ...data };
    save(list);
    return { ok:true, updated:list[i] };
  }
};
