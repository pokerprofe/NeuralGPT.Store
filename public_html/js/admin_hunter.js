document.addEventListener('DOMContentLoaded', () => {
  const urlInput      = document.getElementById('hunter-url');
  const htmlInput     = document.getElementById('hunter-html');
  const scanBtn       = document.getElementById('btn-scan');
  const scanResultBox = document.getElementById('scan-result');

  const businessInput = document.getElementById('hunter-business');
  const emailInput    = document.getElementById('hunter-email');
  const msgBtn        = document.getElementById('btn-message');
  const msgBox        = document.getElementById('hunter-message');

  const reportsBtn    = document.getElementById('btn-reports');
  const reportsBox    = document.getElementById('hunter-reports');

  async function scanProvider() {
    const url  = urlInput.value.trim();
    const html = htmlInput.value.trim();

    if (!url) {
      scanResultBox.textContent = 'Introduce al menos la URL.';
      return;
    }

    try {
      const res = await fetch('/api/hunter/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, html })
      });
      const data = await res.json();
      scanResultBox.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      scanResultBox.textContent = 'Error analizando proveedor.';
      console.error(e);
    }
  }

  async function generateMessage() {
    const businessName = businessInput.value.trim();
    const email        = emailInput.value.trim();

    if (!businessName || !email) {
      msgBox.value = 'Rellena nombre del negocio y email.';
      return;
    }

    try {
      const res = await fetch('/api/hunter/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, email })
      });
      const data = await res.json();
      msgBox.value = data.message || 'No se pudo generar el mensaje.';
    } catch (e) {
      msgBox.value = 'Error generando mensaje.';
      console.error(e);
    }
  }

  async function loadReports() {
    try {
      const res = await fetch('/api/hunter/reports');
      const data = await res.json();
      reportsBox.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      reportsBox.textContent = 'Error cargando informes.';
      console.error(e);
    }
  }

  if (scanBtn)    scanBtn.addEventListener('click', scanProvider);
  if (msgBtn)     msgBtn.addEventListener('click', generateMessage);
  if (reportsBtn) reportsBtn.addEventListener('click', loadReports);
});
