(function(){
  const canvas=document.createElement('canvas');
  canvas.style.position='fixed';canvas.style.left=0;canvas.style.top=0;
  canvas.style.pointerEvents='none';canvas.style.width='100%';canvas.style.height='100%';
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d'); const flakes=[];
  const colors=['#ffd166','#06d6a0','#118ab2','#ef476f','#d9b65c'];
  for(let i=0;i<120;i++){flakes.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,s:Math.random()*1+0.3,c:colors[(Math.random()*colors.length)|0]});}
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const f of flakes){
      ctx.beginPath();ctx.fillStyle=f.c;ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fill();
      f.y+=f.s; f.x+=Math.sin(f.y*0.01); if(f.y>canvas.height){f.y=-5; f.x=Math.random()*canvas.width;}
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize',()=>{canvas.width=innerWidth;canvas.height=innerHeight;});
  tick();
})();
