(function () {
  function qs(id) { return document.getElementById(id); }

  function getUserEmail() {
    return localStorage.getItem('neural_user_email') || '';
  }

  async function loadConfig() {
    try {
      const res = await fetch('/api/edo/pay/config');
      const data = await res.json();
      if (!data.ok) return null;
      return data;
    } catch {
      return null;
    }
  }

  async function manualActivate() {
    const email = getUserEmail();
    const pass = qs('edoAdminPassword').value.trim();
    const box = qs('edoManualStatus');

    if (!email) {
      box.textContent = 'No email detected. Please login first.';
      return;
    }

    try {
      const res = await fetch('/api/edo/pay/manual-activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, adminPassword: pass })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        box.textContent = data.message || 'Error activating EDO.';
        return;
      }
      box.textContent = data.message || 'EDO activated.';
    } catch (err) {
      box.textContent = 'Network error.';
    }
  }

  async function initPage() {
    const email = getUserEmail();
    const statusBox = qs('edoStatusBox');

    if (!email) {
      statusBox.textContent = 'You are not logged in. Please register/login first.';
    } else {
      statusBox.textContent = 'Logged in as ' + email + '.';
    }

    const cfg = await loadConfig();
    if (cfg) {
      const placeholder = qs('gpayButtonPlaceholder');
      if (placeholder) {
        placeholder.textContent =
          'Google Pay TEST ready for ' +
          (cfg.price || '50.00') +
          ' ' +
          (cfg.currencyCode || 'EUR') +
          ' — merchant: ' +
          (cfg.merchantName || 'NeuralGPT.Store');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = qs('edoManualBtn');
    if (btn) btn.addEventListener('click', manualActivate);
    initPage();
  });
})();
