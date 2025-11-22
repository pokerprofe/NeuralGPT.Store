(function() {
  const TICKETS_KEY = 'ng_tickets';

  function showAlert(type, msg) {
    const box = document.getElementById('c-alert');
    if (!box) return;
    box.className = 'ng-alert';
    box.classList.add(type === 'error' ? 'ng-alert-error' : 'ng-alert-success');
    box.textContent = msg;
    box.classList.remove('ng-hidden');
  }

  function saveTicket(ticket) {
    try {
      const raw = window.localStorage.getItem(TICKETS_KEY);
      let arr = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) arr = parsed;
      }
      arr.push(ticket);
      window.localStorage.setItem(TICKETS_KEY, JSON.stringify(arr));
    } catch(e) {
      console.error('Error guardando ticket', e);
    }
  }

  function validate() {
    const name = document.getElementById('c-name');
    const email = document.getElementById('c-email');
    const type = document.getElementById('c-type');
    const msg  = document.getElementById('c-msg');

    if (!name.value.trim()) return {ok:false,err:'Introduce tu nombre.'};
    if (!email.value.trim() || !email.value.includes('@')) return {ok:false,err:'Correo inválido.'};
    if (!type.value) return {ok:false,err:'Selecciona el motivo del contacto.'};
    if (!msg.value.trim()) return {ok:false,err:'Escribe tu mensaje.'};

    return {
      ok: true, 
      data: {
        name: name.value.trim(),
        email: email.value.trim(),
        type: type.value,
        message: msg.value.trim(),
        createdAt: new Date().toISOString()
      }
    };
  }

  function setupSubmit() {
    const btn = document.getElementById('c-submit');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const check = validate();
      if (!check.ok) {
        showAlert('error', check.err);
        return;
      }

      saveTicket(check.data);
      showAlert('success', 'Tu mensaje se ha registrado correctamente.');

      setTimeout(() => {
        window.location.href = '../user/dashboard.html';
      }, 2000);
    });
  }

  document.addEventListener('DOMContentLoaded', setupSubmit);
})();
