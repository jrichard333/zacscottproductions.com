const sgMail = require('@sendgrid/mail');

// Note: rate-limiting removed per user request

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, subject, message } = data || {};
  if (!name || !subject || !message) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  // Basic submission logging
  const ip = (event.headers && (event.headers['x-forwarded-for'] || event.headers['client-ip']))
    ? (event.headers['x-forwarded-for'] || event.headers['client-ip']).split(',')[0].trim()
    : (context && context.identity && context.identity.sourceIp) || 'unknown';
  console.info('Contact form submission', { ip, name, subjectLength: (subject || '').length });

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const toEmail = process.env.TO_EMAIL || 'zscott1212@gmail.com';
  const fromEmail = process.env.FROM_EMAIL || `no-reply@${process.env.SITE_DOMAIN || 'zacscottproductions.com'}`;

  if (!SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY not configured');
    return { statusCode: 500, body: 'Email sender not configured' };
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: subject,
    text: `Name: ${name}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.info('Contact email sent', { to: toEmail, from: fromEmail, ip });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('SendGrid error:', err && err.response ? err.response.body : err);
    return { statusCode: 500, body: 'Failed to send message' };
  }
};
