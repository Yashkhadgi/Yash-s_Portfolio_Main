module.exports = function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const forwarded = request.headers['x-forwarded-for'];
  const ip = String(forwarded || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  let body = request.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  console.log(JSON.stringify({
    type: 'portfolio_visit',
    timestamp: new Date().toISOString(),
    ip,
    route: typeof body.route === 'string' ? body.route.slice(0, 120) : '/',
    userAgent: request.headers['user-agent'] || 'unknown',
    referrer: request.headers.referer || request.headers.referrer || 'direct'
  }));

  response.status(204).end();
}
