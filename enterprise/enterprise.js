async function requestEnterprise(){
  const email = document.getElementById('corpEmail').value.trim();
  const msg   = document.getElementById('corpMsg').value.trim();
  const out   = document.getElementById('result');

  if(!email || !msg){
    out.textContent = 'Please fill all fields.';
    return;
  }

  try{
    const res = await fetch('/api/enterprise/request',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, message: msg })
    });
    out.textContent = JSON.stringify(await res.json(),null,2);
  }catch(e){
    out.textContent = 'Error submitting the request.';
  }
}
