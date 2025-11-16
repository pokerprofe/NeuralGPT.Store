const banned = ['insulto1','insulto2','palabrota']; // editable

function moderate(text){
  const t = (text || '').toLowerCase();
  const hit = banned.find(w => t.includes(w));
  if (hit) {
    return { ok:false, flag:true, reason:'Lenguaje inapropiado detectado' };
  }
  return { ok:true, flag:false };
}

module.exports = { moderate };
