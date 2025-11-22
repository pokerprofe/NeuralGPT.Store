window.addEventListener('DOMContentLoaded', ()=>{
  const box = document.createElement('div');
  box.id = 'onboard';
  box.innerHTML = 
    <div class='onb-content'>
      <h2>Welcome to NeuralGPT.Store</h2>
      <p>Your AI-powered NeuroCommerce ecosystem.</p>
      <ul>
        <li><b>Catalog:</b> Explore external verified products.</li>
        <li><b>Subscription:</b> Access the full AI Suite.</li>
        <li><b>Providers:</b> Apply as certified vendor.</li>
        <li><b>Enterprise:</b> Request corporate access.</li>
        <li><b>Support:</b> Ask questions directly.</li>
      </ul>
      <button id='onb-close'>Start Exploring</button>
    </div>
  ;
  document.body.appendChild(box);

  document.getElementById('onb-close').onclick = ()=> box.remove();
});
