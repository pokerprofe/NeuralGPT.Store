const crypto = require('crypto');

const SECRET = 'super_secret_local_key_change_later';

function sign(payload) {
  const header = Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const data = header + '.' + body;
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return data + '.' + sig;
}

function verify(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h,b,sig] = parts;
  const data = h + '.' + b;
  const check = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  if (check !== sig) return null;
  return JSON.parse(Buffer.from(b,'base64url').toString());
}

module.exports = { sign, verify };
