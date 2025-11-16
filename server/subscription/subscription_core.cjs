const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'subscriptions.json');

// Carga de suscriptores
function load(){
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

// Guardar
function save(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

module.exports = {

  list(){
    return load();
  },

  checkStatus(email){
    let list = load();
    let user = list.find(x => x.email.toLowerCase() === email.toLowerCase());
    if(!user) return { subscribed:false };
    return {
      subscribed:true,
      expires:user.expires,
      plan:user.plan,
      id:user.id
    };
  },

  add(email){
    let list = load();
    let existing = list.find(x => x.email.toLowerCase() === email.toLowerCase());

    // Si ya existe lo renovamos
    if(existing){
      const newDate = Date.now() + (365*24*60*60*1000);
      existing.expires = newDate;
      save(list);
      return { ok:true, renewed:true, expires:newDate };
    }

    // Alta nueva
    const entry = {
      id: 'SUB-' + Date.now(),
      email: email,
      plan: 'NeuralGPT Premium — 50€/año',
      created: Date.now(),
      expires: Date.now() + (365*24*60*60*1000)
    };

    list.push(entry);
    save(list);
    return { ok:true, entry };
  }
};
