const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/products.json');

function load(){
  if(!fs.existsSync(dbPath)) return [];
  return JSON.parse(fs.readFileSync(dbPath));
}

function save(list){
  fs.writeFileSync(dbPath, JSON.stringify(list,null,2));
}

module.exports = (app)=>{

  app.get('/api/admin/products', (req,res)=>{
    const list = load();
    res.json({ ok:true, products:list });
  });

  app.post('/api/admin/products/save', (req,res)=>{
    const list = load();
    const id = 'p_' + Date.now();

    list.push({
      id,
      title:req.body.title,
      sku:req.body.sku,
      category:req.body.category,
      price:req.body.price,
      stock:req.body.stock,
      img:req.body.img,
      vendor:req.body.vendor
    });

    save(list);
    res.json({ ok:true });
  });

  app.post('/api/admin/products/delete', (req,res)=>{
    let list = load();
    list = list.filter(p => p.id !== req.body.id);
    save(list);
    res.json({ ok:true });
  });

};
