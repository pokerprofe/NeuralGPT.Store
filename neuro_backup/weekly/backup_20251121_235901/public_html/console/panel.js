document.addEventListener('DOMContentLoaded', () => {

  // ======== 1) STATUS SERVIDOR ========
  fetch('/api/status')
    .then(res => res.json())
    .then(data => {
      document.getElementById('server-status').textContent = JSON.stringify(data, null, 2);
    });

  // ======== 2) AUTOIDIOMAS ========
  document.getElementById('btn-lang-detect').onclick = () => {
    fetch('/api/marketing/detect')
      .then(res => res.json())
      .then(data => {
        document.getElementById('lang-result').textContent = JSON.stringify(data, null, 2);
      });
  };

  // ======== 3) HUNTER AI ========
  document.getElementById('btn-hunter-reports').onclick = () => {
    fetch('/api/hunter/reports')
      .then(res => res.json())
      .then(data => {
        document.getElementById('hunter-result').textContent = JSON.stringify(data, null, 2);
      });
  };

  // ======== 4) LEAD MANAGER ========
  document.getElementById('btn-leads').onclick = () => {
    fetch('/api/leads/all')
      .then(res => res.json())
      .then(data => {
        document.getElementById('leads-result').textContent = JSON.stringify(data, null, 2);
      });
  };

  // ======== 5) VENTAS  NEUROSALES ========
  document.getElementById('btn-sales').onclick = () => {
    fetch('/api/sales/logs')
      .then(res => res.json())
      .then(data => {
        document.getElementById('sales-result').textContent = JSON.stringify(data, null, 2);
      });
  };

  // ======== 6) LANDING MATRIX ========
  document.getElementById('btn-landings').onclick = () => {
    fetch('/api/landing/list')
      .then(res => res.json())
      .then(data => {
        document.getElementById('landing-result').textContent = JSON.stringify(data, null, 2);
      });
  };

  // ======== 7) SEGURIDAD (dummy temporal) ========
  document.getElementById('security-result').textContent =
    'Motor centinela cargado.\nCSP activo.\nFirewall interno ON.\nLogs operativos.';

  // ======== 8) LOGS GLOBALES ========
  document.getElementById('btn-global-logs').onclick = () => {
    Promise.all([
      fetch('/api/hunter/reports').then(r => r.json()),
      fetch('/api/leads/all').then(r => r.json()),
      fetch('/api/sales/logs').then(r => r.json()),
    ]).then(results => {
      const merged = {
        hunter: results[0],
        leads: results[1],
        sales: results[2],
      };
      document.getElementById('global-logs').textContent = JSON.stringify(merged, null, 2);
    });
  };

});
