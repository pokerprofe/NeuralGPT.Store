window.NGPT = window.NGPT || {};
NGPT.mailTo = (to, subject, body) => {
  const u = 'mailto:' + encodeURIComponent(to)
    + '?subject=' + encodeURIComponent(subject)
    + '&body=' + encodeURIComponent(body);
  window.location.href = u;
};
// Formatea precio con IVA (25%) informativo
NGPT.priceWithVAT = (n)=> (n*1.25).toFixed(2);
