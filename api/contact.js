const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const origin = request.headers?.origin;
  const host = request.headers?.['x-forwarded-host'] || request.headers?.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return response.status(403).json({ error: 'Forbidden origin' });
    } catch {
      return response.status(403).json({ error: 'Forbidden origin' });
    }
  }
  let body = request.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return response.status(400).json({ error: 'Invalid request' }); }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return response.status(400).json({ error: 'Invalid request' });
  if (body.website) return response.status(200).json({ ok: true });
  const clean = key => typeof body[key] === 'string' ? body[key].trim() : '';
  const name = clean('name');
  const email = clean('email');
  const subject = clean('subject');
  const message = clean('message');
  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 254 || !subject || subject.length > 150 || message.length < 10 || message.length > 5000) {
    return response.status(400).json({ error: 'Please check the form fields' });
  }
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL) return response.status(503).json({ error: 'Contact delivery is not configured' });
  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL || 'yashkhadgi4@gmail.com'],
        reply_to: email,
        subject: `Portfolio contact: ${subject.replace(/[\r\n]/g, ' ')}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
      })
    });
    if (!delivery.ok) {
      console.error('Portfolio contact delivery failed:', delivery.status);
      return response.status(502).json({ error: 'Email delivery failed' });
    }
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Portfolio contact network error:', error.message);
    return response.status(502).json({ error: 'Email delivery failed' });
  }
};
