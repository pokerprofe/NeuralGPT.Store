(function () {
  const CART_KEY = 'ng_cart';
  const ORDERS_KEY = 'ng_orders';

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
      console.error('Error leyendo carrito en pay.js', e);
      return [];
    }
  }

  function saveOrder(order) {
    try {
      const raw = window.localStorage.getItem(ORDERS_KEY);
      let orders = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) orders = parsed;
      }
      orders.push(order);
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error guardando pedido simulado', e);
    }
  }

  function renderCartSummary() {
    const container = document.getElementById('pay-cart-list');
    const subtotalEl = document.getElementById('pay-subtotal');
    const totalEl = document.getElementById('pay-total');

    if (!container || !subtotalEl || !totalEl) return;

    const cart = loadCart();
    container.innerHTML = '';

    if (!cart.length) {
      const empty = document.createElement('p');
      empty.className = 'ng-text-sm ng-text-muted';
      empty.textContent = 'Tu carrito está vacío. Vuelve al catálogo para añadir productos.';
      container.appendChild(empty);
      subtotalEl.textContent = formatPrice(0);
      totalEl.textContent = formatPrice(0);
      return;
    }

    let subtotal = 0;

    cart.forEach((item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty || 1) || 1;
      const lineTotal = price * qty;
      subtotal += lineTotal;

      const row = document.createElement('div');
      row.className = 'ng-pay-cart-row';

      const name = document.createElement('div');
      name.className = 'ng-pay-cart-name';
      name.textContent = item.name || 'Producto';

      const meta = document.createElement('div');
      meta.className = 'ng-pay-cart-meta';
      meta.textContent = qty + ' x ' + formatPrice(price);

      const line = document.createElement('div');
      line.className = 'ng-pay-cart-line';
      line.textContent = formatPrice(lineTotal);

      row.appendChild(name);
      row.appendChild(meta);
      row.appendChild(line);

      container.appendChild(row);
    });

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal);
  }

  function showMessage(type, text) {
    const box = document.getElementById('pay-message');
    if (!box) return;
    box.className = 'ng-alert';
    if (type === 'error') {
      box.classList.add('ng-alert-error');
    } else {
      box.classList.add('ng-alert-success');
    }
    box.textContent = text;
    box.classList.remove('ng-hidden');
  }

  function validateForm() {
    const name = document.getElementById('pay-name');
    const email = document.getElementById('pay-email');
    const address = document.getElementById('pay-address');
    const city = document.getElementById('pay-city');
    const zip = document.getElementById('pay-zip');
    const country = document.getElementById('pay-country');
    const accept = document.getElementById('pay-accept-terms');

    if (!name || !email || !address || !city || !zip || !country || !accept) return { ok: false, error: 'Formulario incompleto en la plantilla.' };

    if (!name.value.trim()) return { ok: false, error: 'Introduce tu nombre completo.' };
    if (!email.value.trim() || !email.value.includes('@')) return { ok: false, error: 'Introduce un correo electrónico válido.' };
    if (!address.value.trim()) return { ok: false, error: 'Introduce una dirección de facturación.' };
    if (!city.value.trim()) return { ok: false, error: 'Introduce tu ciudad.' };
    if (!zip.value.trim()) return { ok: false, error: 'Introduce tu código postal.' };
    if (!country.value) return { ok: false, error: 'Selecciona un país.' };
    if (!accept.checked) return { ok: false, error: 'Debes aceptar los términos y condiciones para continuar.' };

    return {
      ok: true,
      data: {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: (document.getElementById('pay-phone')?.value || '').trim(),
        address: address.value.trim(),
        city: city.value.trim(),
        zip: zip.value.trim(),
        country: country.value,
        method: (document.querySelector('input[name=\"pay-method\"]:checked')?.value || 'card')
      }
    };
  }

  function setupSubmit() {
    const btn = document.getElementById('pay-submit');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const cart = loadCart();
      if (!cart.length) {
        showMessage('error', 'Tu carrito está vacío. Vuelve al catálogo para añadir productos.');
        return;
      }

      const check = validateForm();
      if (!check.ok) {
        showMessage('error', check.error);
        return;
      }

      const order = {
        id: 'ORD-' + Date.now(),
        createdAt: new Date().toISOString(),
        customer: check.data,
        items: cart,
        total: document.getElementById('pay-total')?.textContent || '',
        status: 'SIMULATED'
      };

      saveOrder(order);

      try {
        window.localStorage.removeItem(CART_KEY);
      } catch (e) {}

      showMessage('success', 'Pedido registrado en modo simulación. No se ha realizado ningún cobro real.');

      setTimeout(() => {
        window.location.href = '../user/dashboard.html';
      }, 2000);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCartSummary();
    setupSubmit();
  });
})();

/* NG_DONATION_INTEGRATION  Patch automático */
try {
  const DONATE_KEY = 'ng_donation';
  const rawDon = window.localStorage.getItem(DONATE_KEY);
  if (rawDon) {
    const donation = JSON.parse(rawDon);
    if (donation && donation.amount) {
      const cartList = document.getElementById("pay-cart-list");
      if (cartList) {
        const block = document.createElement("div");
        block.className = "ng-pay-cart-row ng-donation-block";
        block.innerHTML = `
          <div class="ng-pay-cart-name">Aportación al proyecto</div>
          <div class="ng-pay-cart-meta">1 x ${donation.amount} €</div>
          <div class="ng-pay-cart-line">${donation.amount} €</div>
        `;
        cartList.appendChild(block);
      }
    }
  }
} catch (e) {}
