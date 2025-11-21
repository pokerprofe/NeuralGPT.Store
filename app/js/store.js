(async function() {

  function getUserEmail() {
    return localStorage.getItem('neural_user_email') || 'anonymous';
  }

  async function loadProducts() {
    const res = await fetch('/api/store/list');
    const data = await res.json();

    if (!data.ok) return;

    const grid = document.getElementById('storeGrid');
    grid.innerHTML = '';

    data.products.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'store-card';

      card.innerHTML = \
        <img src="\" class="store-img" />
        <h3>\</h3>
        <p class="store-desc">\</p>
        <div class="store-info">
          <span class="price">\ €</span>
          <span class="commission">Commission: \</span>
        </div>
        <button class="btn-vendor" data-id="\" data-url="\">
          Go to Vendor
        </button>
      \;

      grid.appendChild(card);
    });

    document.querySelectorAll('.btn-vendor').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.dataset.id;
        const url = btn.dataset.url;

        await fetch('/api/store/click', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            productId: id,
            email: getUserEmail()
          })
        });

        window.open(url, '_blank');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', loadProducts);

})();
