const fetch = require('node-fetch');

module.exports = function(secretKey) {
  return {
    async verify(token) {
      if (!token) return false;

      try {
        const res = await fetch(
          'https://www.google.com/recaptcha/api/siteverify?secret=' +
            secretKey +
            '&response=' +
            token,
          { method: 'POST' }
        );

        const data = await res.json();
        return data.success === true;
      } catch (err) {
        console.error('[reCAPTCHA] Error verifying token:', err);
        return false;
      }
    }
  };
};
