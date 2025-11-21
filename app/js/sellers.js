(function(){
  async function sendSellerForm(){
    const vendor = document.getElementById('slr_vendor').value.trim();
    const email = document.getElementById('slr_email').value.trim();
    const msg = document.getElementById('slr_msg').value.trim();
    const honeypot = document.getElementById('slr_hp').value.trim();

    const res = await fetch('/api/sellers/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        vendor,email,msg,
        companyUrl:honeypot
      })
    });

    const data = await res.json();
    const box = document.getElementById('slr_status');
    if(data.ok) box.textContent = 'Message sent successfully.';
    else box.textContent = 'Error.';
  }

  document.addEventListener('DOMContentLoaded',function(){
    const btn=document.getElementById('slr_send');
    if(btn) btn.addEventListener('click',sendSellerForm);
  });
})();
