const { storeConfig } = require('../lib/visit-store');

module.exports = async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (request.headers.origin) {
    try {
      if (new URL(request.headers.origin).host !== request.headers.host) return response.status(403).json({ error: 'Forbidden origin' });
    } catch { return response.status(403).json({ error: 'Forbidden origin' }); }
  }
  const forwarded = request.headers['x-forwarded-for'];
  const ip = String(forwarded || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  let body = request.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return response.status(400).json({ error: 'Invalid JSON' }); }
  }

  if (!body || Array.isArray(body) || typeof body.route !== 'string' || !/^#(arrival|universe|theater|research|contact)(\/[^\s]{1,100})?$/.test(body.route)) {
    return response.status(400).json({ error: 'Invalid visit' });
  }
  const clip = (value, length) => typeof value === 'string' ? value.slice(0, length) : '';
  const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
  if (!uuid(body.eventId) || !Number.isSafeInteger(body.activeMs) || body.activeMs < 0 || body.activeMs > 86400000 || typeof body.ended !== 'boolean') {
    return response.status(400).json({ error: 'Invalid page timing' });
  }
  const geo = value => { try { return decodeURIComponent(clip(value, 180)); } catch { return ''; } };
  let referrer = '';
  try {
    const url = new URL(body.referrer);
    if (['http:', 'https:'].includes(url.protocol)) referrer = url.origin;
  } catch { /* Direct visit. Keep query strings and credentials out of records. */ }
  const visit = {
    visited_at: new Date().toISOString(),
    event_id: body.eventId,
    active_ms: body.activeMs,
    ended: body.ended,
    ip,
    route: body.route,
    session_id: uuid(body.sessionId) ? body.sessionId : null,
    user_agent: clip(request.headers['user-agent'], 500),
    referrer,
    country: clip(request.headers['x-vercel-ip-country'], 8),
    city: geo(request.headers['x-vercel-ip-city'])
  };
  const config = storeConfig();
  if (!config) {
    console.log(JSON.stringify({ type: 'portfolio_visit', ...visit }));
    return response.status(503).json({ error: 'Visit storage is not configured' });
  }
  try {
    const result = await fetch(config.url.replace(/portfolio_visits$/, 'rpc/record_portfolio_visit'), {
      method: 'POST', headers: { ...config.headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ p_visit: visit }), signal: AbortSignal.timeout(8000)
    });
    if (!result.ok) throw new Error(`Storage status ${result.status}`);
    return response.status(204).end();
  } catch (error) {
    console.error('Visit storage failed:', error.message);
    return response.status(502).json({ error: 'Visit could not be saved' });
  }
};
