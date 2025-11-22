(function () {
  const DONATE_KEY = 'ng_donation';

  function showMessage(type, text) {
    const box = document.getElementById('donate-message');
    if (!box) return;
    box.className = 'ng-alert';
    if (type === 'error') box.classList.add('ng-alert-error');
    else box.classList.add('ng-alert-success');
    box.textContent = text;
    box.classList.remove('ng-hidden');
  }

  function goToCheckout(amount) {
    try {
      window.localStorage.setItem(DONATE_KEY, JSON.stringify({
        amount: amount,
        createdAt: new Date().toISOString()
      }));
    } catch (e) {}

    window.location.href = '../pay/index.html';
  }

  function setupButtons() {
    const buttons = document.querySelectorAll('.ng-donate-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = Number(btn.dataset.amount);
        if (!amount || amount < 1) {
          showMessage('error', 'Cantidad inválida.');
          return;
        }
        goToCheckout(amount);
      });
    });
  }

  function setupCustom() {
    const btn = document.getElementById('donate-submit');
    const input = document.getElementById('donate-custom');

    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const val = Number(input.value);
      if (!val || val < 1) {
        showMessage('error', 'Introduce una cantidad válida.');
        return;
      }
      goToCheckout(val);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupButtons();
    setupCustom();
  });
})();
