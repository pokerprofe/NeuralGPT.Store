const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../database/users.json');

function load(){
  if(!fs.existsSync(usersPath)) return [];
  return JSON.parse(fs.readFileSync(usersPath));
}

function save(data){
  fs.writeFileSync(usersPath, JSON.stringify(data,null,2));
}

module.exports = (app)=>{

  app.get('/api/admin/users', (req,res)=>{
    const list = load();
    res.json({ ok:true, users:list });
  });

  app.post('/api/admin/users/toggle', (req,res)=>{
    const list = load();
    const id = req.body.id;
    const u = list.find(x=>x.id === id);
    if(u) u.blocked = !u.blocked;
    save(list);
    res.json({ ok:true });
  });

  app.post('/api/admin/users/delete', (req,res)=>{
    let list = load();
    list = list.filter(x=>x.id !== req.body.id);
    save(list);
    res.json({ ok:true });
  });

};
