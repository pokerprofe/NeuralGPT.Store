(function () {
  function qs(id) { return document.getElementById(id); }

  async function callApi(path, body) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error('Invalid response');
    }
    if (!res.ok || (data && data.ok === false)) {
      throw new Error((data && data.message) || 'Request failed');
    }
    return data;
  }

  async function handleLoad() {
    const status = qs('status');
    status.textContent = 'Loading...';
    const adminPassword = qs('adminPassword').value.trim();
    try {
      const data = await callApi('/api/payout/get', { adminPassword });
      if (!data.hasData) {
        status.textContent = 'No payout data stored yet.';
        qs('iban').value = '';
        qs('note').value = '';
        return;
      }
      qs('iban').value = data.iban || '';
      qs('note').value = data.note || '';
      status.textContent = 'Payout data loaded (' + (data.ibanMasked || '') + ').';
    } catch (err) {
      status.textContent = 'Error: ' + err.message;
    }
  }

  async function handleSave() {
    const status = qs('status');
    status.textContent = 'Saving...';
    const adminPassword = qs('adminPassword').value.trim();
    const iban = qs('iban').value.trim();
    const note = qs('note').value.trim();

    try {
      const data = await callApi('/api/payout/save', {
        adminPassword,
        iban,
        note
      });
      status.textContent = data.message || 'Payout data saved.';
    } catch (err) {
      status.textContent = 'Error: ' + err.message;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const loadBtn = qs('loadBtn');
    const saveBtn = qs('saveBtn');
    if (loadBtn) loadBtn.addEventListener('click', handleLoad);
    if (saveBtn) saveBtn.addEventListener('click', handleSave);
  });
})();
