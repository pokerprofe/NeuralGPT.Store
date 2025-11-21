async function load(){
  const res = await fetch('/api/customers/list');
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML='';
  data.list.forEach(c=>{
    const div=document.createElement('div');
    div.innerHTML='<b>'+c.email+'</b><br><span class="id">'+c.id+'</span>';
    list.appendChild(div);
  });
}
load();
