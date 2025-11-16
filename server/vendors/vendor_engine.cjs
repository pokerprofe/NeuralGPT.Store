const fs = require('fs');
const path = require('path');

const DB_VEND = path.join(__dirname,'..','data','vendors','vendors.json');
const DB_PROD = path.join(__dirname,'..','data','vendors','vendor_products.json');

function loadVendors(){
  try { return JSON.parse(fs.readFileSync(DB_VEND,'utf8')); }
  catch { return []; }
}
function saveVendors(list){
  fs.writeFileSync(DB_VEND, JSON.stringify(list,null,2));
}

function loadProducts(){
  try { return JSON.parse(fs.readFileSync(DB_PROD,'utf8')); }
  catch { return []; }
}
function saveProducts(list){
  fs.writeFileSync(DB_PROD, JSON.stringify(list,null,2));
}

function generateApiKey(){
  return 'vend_' + Math.random().toString(36).substring(2) +
         Math.random().toString(36).substring(2) +
         Date.now().toString(36);
}

function approveVendor(p){
  const vendors = loadVendors();

  const v = {
    id: Date.now(),
    name: p.name || '',
    email: p.email || '',
    country: p.country || '',
    website: p.website || '',
    category: p.category || '',
    created: new Date().toISOString(),
    apiKey: generateApiKey(),
    commission: 8,        // % default
    balance: 0,
    status: 'active',
    blocked: false
  };

  vendors.unshift(v);
  saveVendors(vendors);

  return v;
}

function listVendors(){
  return loadVendors();
}

function blockVendor(id){
  const list = loadVendors();
  const v = list.find(x => String(x.id) === String(id));
  if(!v) return null;
  v.blocked = true;
  saveVendors(list);
  return v;
}

function unblockVendor(id){
  const list = loadVendors();
  const v = list.find(x => String(x.id) === String(id));
  if(!v) return null;
  v.blocked = false;
  saveVendors(list);
  return v;
}

function addProduct(vendorApi, product){
  const vendors = loadVendors();
  const v = vendors.find(x => x.apiKey === vendorApi);
  if(!v) throw new Error('Vendor not found');

  if(v.blocked) throw new Error('Vendor blocked');

  const prods = loadProducts();
  const p = {
    id: Date.now(),
    vendorId: v.id,
    name: product.name,
    desc: product.desc,
    img: product.img || '',
    price: product.price || 0,
    link: product.link || '',
    category: product.category || '',
    created: new Date().toISOString(),
    active: true
  };

  prods.unshift(p);
  saveProducts(prods);

  return p;
}

function vendorProducts(vendorId){
  const prods = loadProducts();
  return prods.filter(p => String(p.vendorId) === String(vendorId));
}

module.exports = {
  approveVendor,
  listVendors,
  blockVendor,
  unblockVendor,
  addProduct,
  vendorProducts
};
