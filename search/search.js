async function doSearch(){
  const q = document.getElementById('query').value;
  const res = await fetch('/api/search?q='+encodeURIComponent(q));
  const data = await res.json();
  const box = document.getElementById('results');
  box.innerHTML='';
  data.results.forEach(r=>{
    const div = document.createElement('div');
    div.className='item';
    div.innerHTML='<b>'+r.name+'</b> ['+r.type+']';
    box.appendChild(div);
  });
}
