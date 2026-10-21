const { createHash, timingSafeEqual } = require('node:crypto');
const { storeConfig } = require('../lib/visit-store');

module.exports = async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.VISITOR_ADMIN_TOKEN;
  if (!secret || secret.length < 32) return response.status(503).json({ error: 'Set VISITOR_ADMIN_TOKEN to at least 32 random characters' });
  const supplied = (request.headers.authorization || '').replace(/^Bearer /, '');
  const hash = value => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(hash(secret), hash(supplied))) return response.status(401).json({ error: 'Incorrect access token' });
  const config = storeConfig();
  if (!config) return response.status(503).json({ error: 'Visit storage is not configured' });
  const page = Number(request.query?.page || 0);
  if (!Number.isSafeInteger(page) || page < 0 || page > 100000) return response.status(400).json({ error: 'Invalid page' });
  const session = request.query?.session;
  const isSession = typeof session === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(session);
  const isEvent = typeof session === 'string' && /^event-[1-9][0-9]{0,18}$/.test(session);
  if (session !== undefined && !isSession && !isEvent) return response.status(400).json({ error: 'Invalid session' });
  const query = new URLSearchParams({
    select: session ? 'id,visited_at,last_seen,active_ms,ended,ip,route,referrer,user_agent' : 'visit_key,first_seen,last_seen,page_views,sections,ip,country,city,referrer,user_agent,routes,active_ms',
    order: session ? 'visited_at.asc,id.asc' : 'last_seen.desc,visit_key.desc', limit: '100', offset: String(page * 100)
  });
  if (session) query.set(isSession ? 'session_id' : 'id', `eq.${isSession ? session : session.slice(6)}`);
  const endpoint = session ? config.url : config.url.replace(/portfolio_visits$/, 'portfolio_visit_sessions');
  try {
    const result = await fetch(`${endpoint}?${query}`, { headers: config.headers, signal: AbortSignal.timeout(8000) });
    if (!result.ok) throw new Error(`Storage status ${result.status}`);
    return response.status(200).json({ visits: await result.json(), page });
  } catch (error) {
    console.error('Visit history unavailable:', error.message);
    return response.status(502).json({ error: 'Could not load visit history' });
  }
};
