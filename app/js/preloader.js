window.addEventListener('load', ()=>{
    const p = document.getElementById('preloader-box');
    if(p){ setTimeout(()=> p.classList.add('hide-preloader'), 400); }
});
