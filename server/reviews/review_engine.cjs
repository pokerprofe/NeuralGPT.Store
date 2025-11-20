const fs = require('fs');
const path = require('path');
const DB = path.join(__dirname,'reviews.json');

function load(){
  try { return JSON.parse(fs.readFileSync(DB)); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function addReview(data){
  const list = load();

  const obj = {
    id: Date.now(),
    productId: data.productId,
    user: data.user || 'anonymous',
    stars: data.stars || 5,
    text: data.text || '',
    photos: data.photos || [],
    helpful: 0,
    date: Date.now()
  };

  list.push(obj);
  save(list);
  return obj;
}

function getReviews(productId){
  const list = load();
  return list.filter(r => String(r.productId) === String(productId));
}

function markHelpful(id){
  const list = load();
  const r = list.find(x=>String(x.id)===String(id));
  if(r){
    r.helpful++;
    save(list);
    return true;
  }
  return false;
}

module.exports = { addReview, getReviews, markHelpful };
