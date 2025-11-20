const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendSupportMail({ from, subject, message }) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    replyTo: from,
    subject: '[Soporte NeuralGPT.Store] ' + subject,
    text: message
  });
  return { ok:true };
}

module.exports = { sendSupportMail };
