const fs = require('fs');
const path = require('path');

const idx = path.join(__dirname, 'search_index.json');

function load(){
  return JSON.parse(fs.readFileSync(idx));
}

function save(data){
  fs.writeFileSync(idx, JSON.stringify(data, null, 2));
}

function rebuild(products, agents, suppliers){
  const data = {
    products: products.map(p=>({ type:'product', name:p.name, ref:p.id })),
    agents: agents.map(a=>({ type:'agent', name:a.name, ref:a.id })),
    suppliers: suppliers.map(s=>({ type:'supplier', name:s.company, ref:s.id }))
  };
  save(data);
  return { ok:true };
}

function search(term){
  const all = load();
  const q = term.toLowerCase();
  let out = [];
  Object.keys(all).forEach(k=>{
    out = out.concat(all[k].filter(x=>x.name.toLowerCase().includes(q)));
  });
  return out;
}

module.exports = { rebuild, search };
