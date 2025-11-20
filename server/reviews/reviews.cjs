const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname,'reviews.json');

function load(){
  try{ return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch{ return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function addReview(data){
  const list = load();
  const review = {
    productId: data.productId,
    user: data.user || 'anonymous',
    stars: Math.max(1, Math.min(5, Number(data.stars)||5)),
    comment: data.comment || '',
    date: Date.now()
  };
  list.push(review);
  save(list);
  return review;
}

function getReviews(productId){
  return load().filter(r => String(r.productId) === String(productId));
}

function avgRating(productId){
  const list = getReviews(productId);
  if(list.length === 0) return 0;
  return list.reduce((s,r)=>s+r.stars,0) / list.length;
}

module.exports = { addReview, getReviews, avgRating };
