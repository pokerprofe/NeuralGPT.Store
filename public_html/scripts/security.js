(function() {
  // 1) Limpieza de parámetros sospechosos en URL
  const bad = ['<', '>', 'script', '%3C', '%3E', 'onerror=', 'onload='];
  const url = window.location.href.toLowerCase();
  if (bad.some(b => url.includes(b))) {
    window.location.href = '/';
  }

  // 2) Desactivar eval()
  window.eval = function() {
    console.warn('Eval bloqueado por seguridad.');
    return null;
  };

  // 3) Proteger innerHTML
  const setHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
  Object.defineProperty(Element.prototype, 'innerHTML', {
    set: function(value) {
      if (String(value).includes('<script')) {
        console.warn('Intento XSS bloqueado.');
        return;
      }
      setHTML.call(this, value);
    }
  });

})();
