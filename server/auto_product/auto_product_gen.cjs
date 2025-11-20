const fs = require('fs');
const path = require('path');
const CATALOG = require('../catalog_engine.cjs');
const vendorsFile = path.join(__dirname,'..','data','vendor_leads.json');

function vendorList(){
  try { return JSON.parse(fs.readFileSync(vendorsFile)); }
  catch { return []; }
}

function pickVendor(){
  const v = vendorList();
  if(!v.length) return 'unknown';
  const idx = Math.floor(Math.random()*v.length);
  return v[idx].company || 'vendor';
}

function randomPrice(){
  return (Math.random()*490 + 10).toFixed(2);
}

function randomCategory(){
  const c = ['AI Tools','Robotics','PC Hardware','Components','Networking','Storage','Gadgets','Dev Boards'];
  return c[Math.floor(Math.random()*c.length)];
}

function randomName(){
  const base = ['Quantum','Neuro','Apex','Titan','Pulse','Node','Matrix','Ultra','Omega','Nova'];
  const item = ['Module','Board','Chip','Controller','Drive','Interface','Device','Unit','System'];
  return base[Math.floor(Math.random()*base.length)] + ' ' + item[Math.floor(Math.random()*item.length)];
}

function randomDesc(){
  return 'Advanced technology designed for high-performance ecosystems. Fully compatible with the NeuroCommerce model.';
}

function randomImage(){
  const imgs = [
    '/assets/autoimg/tech1.png',
    '/assets/autoimg/tech2.png',
    '/assets/autoimg/tech3.png',
    '/assets/autoimg/tech4.png'
  ];
  return imgs[Math.floor(Math.random()*imgs.length)];
}

function generateProduct(){
  const p = {
    name: randomName(),
    description: randomDesc(),
    price: randomPrice(),
    category: randomCategory(),
    vendor: pickVendor(),
    image: randomImage(),
    link: '#'
  };

  return CATALOG.addProduct(p);
}

module.exports = { generateProduct };
