(function () {
  async function checkEDO() {
    const email = localStorage.getItem('neural_user_email') || '';
    if (!email) return { isEDO: false };

    try {
      const res = await fetch('/api/edo/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.ok) return { isEDO: false };
      return data;
    } catch {
      return { isEDO: false };
    }
  }

  async function protectEDOContent() {
    const status = await checkEDO();
    if (!status.isEDO) {
      document.querySelectorAll('[data-edo-locked]').forEach(el => {
        el.innerHTML = '<div class=\"edo-locked-box\">EDO access required — 50€/year</div>';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', protectEDOContent);
})();
