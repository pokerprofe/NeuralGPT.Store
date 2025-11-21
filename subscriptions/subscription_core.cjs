const fs = require('fs');
const path = require('path');
const ACT = require('../logs/activity_logger.cjs');

const DB = path.join(__dirname,'subscriptions.json');

function load(){
  try{ return JSON.parse(fs.readFileSync(DB)); }
  catch{ return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function createSubscription(user){
  const list = load();

  const entry = {
    id: Date.now(),
    email: user.email,
    plan: 'annual',
    price: 50,
    active: true,
    created: new Date().toISOString(),
    expires: new Date(new Date().setFullYear(new Date().getFullYear()+1)).toISOString()
  };

  list.unshift(entry);
  save(list);

  ACT.log({
    type:'subscription',
    detail:'New subscription: '+user.email,
    user:'subscription_engine'
  });

  return entry;
}

function listAll(){
  return load();
}

module.exports = { createSubscription, listAll };

function createBusinessSubscription(data){
  const list = load();

  const entry = {
    id: Date.now(),
    email: data.email,
    company: data.company || '',
    employees_allowed: 10,
    plan: 'business',
    price: 100,
    active: true,
    created: new Date().toISOString(),
    expires: new Date(new Date().setFullYear(new Date().getFullYear()+1)).toISOString()
  };

  list.unshift(entry);
  save(list);

  ACT.log({
    type:'subscription_business',
    detail:'New BUSINESS subscription: '+data.email,
    user:'subscription_engine'
  });

  return entry;
}

module.exports = { createSubscription, listAll, createBusinessSubscription };

