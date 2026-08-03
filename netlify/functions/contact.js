const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, subject, message } = data || {};
  if (!name || !subject || !message) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  // SMTP configuration via environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.TO_EMAIL || 'zscott1212@gmail.com';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('SMTP credentials are not configured');
    return { statusCode: 500, body: 'Email sender not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: smtpPort == 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `${name} <${smtpUser}>`,
    to: toEmail,
    subject: subject,
    text: `Name: ${name}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('Error sending email:', err);
    return { statusCode: 500, body: 'Failed to send message' };
  }
};
