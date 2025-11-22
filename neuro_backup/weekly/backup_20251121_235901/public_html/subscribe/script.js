document.getElementById('sub-form').addEventListener('submit', async (e)=>{
  e.preventDefault();

  const email = document.getElementById('email').value;
  const country = document.getElementById('country').value;
  const plan = document.getElementById('plan').value;

  const res = await fetch('/api/subscription/create', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ email, country, plan })
  });

  const data = await res.json();
  if(data.ok){
    window.location.href = '/subscribe/thanks.html';
  }
});
