const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'client_leads.json');

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
    return load().filter(c => 
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.country && c.country.toLowerCase().includes(q))
    );
  },

  add(data){
    let list = load();
    const id = 'CL-' + Date.now();
    const entry = { id, t:Date.now(), ...data };
    list.push(entry);
    save(list);
    return { ok:true, id, entry };
  },

  edit(id, data){
    let list = load();
    let i = list.findIndex(c=>c.id==id);
    if(i<0) return { ok:false, msg:'Cliente no encontrado' };
    list[i] = { ...list[i], ...data };
    save(list);
    return { ok:true, updated:list[i] };
  }
};
