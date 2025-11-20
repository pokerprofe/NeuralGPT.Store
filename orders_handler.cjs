const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data', 'orders', 'orders.json');

function loadOrders(){
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

function saveOrders(list){
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

function createOrder(data){
  const orders = loadOrders();
  const id = 'ORD-' + Date.now();
  orders.push({ id, ...data, created: Date.now(), status:'TEST' });
  saveOrders(orders);
  return { ok:true, id };
}

module.exports = { createOrder, loadOrders };
