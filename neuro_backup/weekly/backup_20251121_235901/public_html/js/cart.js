(function() {
  const CART_KEY = 'ng_cart';

  function formatPrice(value) {
    const num = Number(value) || 0;
    return num.toFixed(2).replace('.', ',') + ' €';
  }

  function loadCart() {
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.error('Error leyendo carrito', e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error guardando carrito', e);
    }
  }

  function renderCart() {
    const cart = loadCart();
    const emptyBox = document.getElementById('cart-empty');
    const list = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (!list || !emptyBox || !subtotalEl || !totalEl) return;

    list.innerHTML = '';

    if (!cart.length) {
      emptyBox.classList.remove('ng-hidden');
      subtotalEl.textContent = formatPrice(0);
      totalEl.textContent = formatPrice(0);
      return;
    }

    emptyBox.classList.add('ng-hidden');

    let subtotal = 0;

    cart.forEach((item, index) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty || 1) || 1;
      const lineTotal = price * qty;
      subtotal += lineTotal;

      const row = document.createElement('div');
      row.className = 'ng-cart-row';

      const nameCol = document.createElement('div');
      nameCol.className = 'ng-cart-col ng-cart-name';
      nameCol.textContent = item.name || 'Producto sin nombre';

      const priceCol = document.createElement('div');
      priceCol.className = 'ng-cart-col ng-cart-price';
      priceCol.textContent = formatPrice(price);

      const qtyCol = document.createElement('div');
      qtyCol.className = 'ng-cart-col ng-cart-qty';
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = '1';
      qtyInput.value = qty.toString();
      qtyInput.className = 'ng-input ng-input-qty';
      qtyInput.addEventListener('change', () => {
        let newVal = Number(qtyInput.value);
        if (!newVal || newVal < 1) newVal = 1;
        cart[index].qty = newVal;
        saveCart(cart);
        renderCart();
      });
      qtyCol.appendChild(qtyInput);

      const subtotalCol = document.createElement('div');
      subtotalCol.className = 'ng-cart-col ng-cart-subtotal';
      subtotalCol.textContent = formatPrice(lineTotal);

      const removeCol = document.createElement('div');
      removeCol.className = 'ng-cart-col ng-cart-remove';
      const btnRemove = document.createElement('button');
      btnRemove.className = 'ng-btn ng-btn-ghost ng-btn-xs';
      btnRemove.textContent = 'Quitar';
      btnRemove.addEventListener('click', () => {
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
      });
      removeCol.appendChild(btnRemove);

      row.appendChild(nameCol);
      row.appendChild(priceCol);
      row.appendChild(qtyCol);
      row.appendChild(subtotalCol);
      row.appendChild(removeCol);

      list.appendChild(row);
    });

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal); // sin impuestos extra por ahora
  }

  function setupCheckoutButton() {
    const btn = document.getElementById('btn-go-checkout');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cart = loadCart();
      if (!cart.length) {
        alert('Tu carrito está vacío. Añade al menos un producto antes de continuar.');
        return;
      }
      window.location.href = '../pay/index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    setupCheckoutButton();
  });
})();
