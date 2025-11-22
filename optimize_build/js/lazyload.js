document.addEventListener('DOMContentLoaded',()=>{
  const imgs=document.querySelectorAll('img');
  imgs.forEach(i=>{
    if(!i.hasAttribute('loading')){
      i.setAttribute('loading','lazy');
    }
  });
});
