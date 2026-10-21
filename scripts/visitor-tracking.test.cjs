const { test } = require('node:test');
const assert = require('node:assert/strict');
const record = require('../api/visit');
const history = require('../api/visits');

function response() {
  return { headers: {}, code: 200, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; }, end() { this.ended = true; } };
}

test('visit storage and private history', async t => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
  process.env.VISITOR_ADMIN_TOKEN = 'a'.repeat(64);
  const request = { method: 'POST', headers: { host: 'portfolio.example', origin: 'https://portfolio.example', 'x-forwarded-for': '203.0.113.5', 'x-vercel-ip-city': 'New%20Delhi' }, body: { route: '#theater', referrer: 'https://search.example/path?private=value', sessionId: 'd41530bf-0c35-43e1-8987-576d59308e5a', eventId: '80e94f3b-7aee-4a54-98ae-679e471b1b5a', activeMs: 15000, ended: false } };
  try {
    await t.test('saves server metadata and strips referral query parameters', async () => {
      let saved;
      global.fetch = async (url, options) => {
        assert.equal(url, 'https://example.supabase.co/rest/v1/rpc/record_portfolio_visit');
        assert.equal(options.headers.apikey, 'sb_secret_test');
        saved = JSON.parse(options.body).p_visit; return { ok: true };
      };
      const res = response(); await record(request, res);
      assert.equal(res.code, 204); assert.equal(saved.ip, '203.0.113.5');
      assert.equal(saved.city, 'New Delhi'); assert.equal(saved.referrer, 'https://search.example');
      assert.ok(Number.isFinite(Date.parse(saved.visited_at)));
      assert.equal(saved.session_id, request.body.sessionId);
      assert.equal(saved.active_ms, 15000); assert.equal(saved.event_id, request.body.eventId);
    });
    await t.test('rejects foreign origins and malformed visits before storage', async () => {
      global.fetch = () => { throw new Error('Must not call database'); };
      const forbidden = response();
      await record({ ...request, headers: { ...request.headers, origin: 'https://other.example' } }, forbidden);
      assert.equal(forbidden.code, 403);
      const invalid = response(); await record({ ...request, body: null }, invalid);
      assert.equal(invalid.code, 400);
    });
    await t.test('database failure never reports a saved visit', async () => {
      global.fetch = async () => ({ ok: false, status: 503 });
      const res = response(); await record(request, res); assert.equal(res.code, 502);
    });
    await t.test('rejects impossible or unbounded page timings before storage', async () => {
      global.fetch = () => { throw new Error('Must not query storage'); };
      for (const activeMs of [-1, 86400001, null, '1000', 1.2]) {
        const res = response(); await record({ ...request, body: { ...request.body, activeMs } }, res);
        assert.equal(res.code, 400);
      }
    });
    await t.test('history denies unauthenticated access without querying database', async () => {
      global.fetch = () => { throw new Error('Must not call database'); };
      const res = response(); await history({ method: 'GET', headers: {} }, res);
      assert.equal(res.code, 401); assert.equal(res.headers['Cache-Control'], 'private, no-store');
    });
    await t.test('authorized history requests use bounded pagination', async () => {
      global.fetch = async url => {
        const parsed = new URL(url);
        assert.equal(parsed.pathname, '/rest/v1/portfolio_visit_sessions');
        assert.equal(parsed.searchParams.get('order'), 'last_seen.desc,visit_key.desc');
        assert.equal(parsed.searchParams.get('limit'), '100'); assert.equal(parsed.searchParams.get('offset'), '200');
        return { ok: true, json: async () => [{ id: 1 }] };
      };
      const res = response();
      await history({ method: 'GET', headers: { authorization: `Bearer ${process.env.VISITOR_ADMIN_TOKEN}` }, query: { page: '2' } }, res);
      assert.equal(res.code, 200); assert.deepEqual(res.body.visits, [{ id: 1 }]);
      const invalid = response();
      await history({ method: 'GET', headers: { authorization: `Bearer ${process.env.VISITOR_ADMIN_TOKEN}` }, query: { page: '-1' } }, invalid);
      assert.equal(invalid.code, 400);
    });
    await t.test('journey query isolates the selected session and orders pages chronologically', async () => {
      const session = request.body.sessionId;
      global.fetch = async url => {
        const parsed = new URL(url);
        assert.equal(parsed.pathname, '/rest/v1/portfolio_visits');
        assert.equal(parsed.searchParams.get('session_id'), `eq.${session}`);
        assert.equal(parsed.searchParams.get('order'), 'visited_at.asc,id.asc');
        return { ok: true, json: async () => [{ route: '#arrival' }, { route: '#theater' }] };
      };
      const res = response();
      await history({ method: 'GET', headers: { authorization: `Bearer ${process.env.VISITOR_ADMIN_TOKEN}` }, query: { session } }, res);
      assert.equal(res.code, 200); assert.equal(res.body.visits.length, 2);
    });
    await t.test('rejects injected session filters before querying storage', async () => {
      global.fetch = () => { throw new Error('Must not call database'); };
      const res = response();
      await history({ method: 'GET', headers: { authorization: `Bearer ${process.env.VISITOR_ADMIN_TOKEN}` }, query: { session: 'eq.anything&select=*' } }, res);
      assert.equal(res.code, 400);
    });
    await t.test('legacy ungrouped rows open only their own event', async () => {
      global.fetch = async url => {
        const parsed = new URL(url);
        assert.equal(parsed.searchParams.get('id'), 'eq.42');
        assert.equal(parsed.searchParams.has('session_id'), false);
        return { ok: true, json: async () => [{ id: 42 }] };
      };
      const res = response();
      await history({ method: 'GET', headers: { authorization: `Bearer ${process.env.VISITOR_ADMIN_TOKEN}` }, query: { session: 'event-42' } }, res);
      assert.equal(res.code, 200);
    });
  } finally {
    global.fetch = originalFetch;
    for (const name of ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'VISITOR_ADMIN_TOKEN']) {
      if (originalEnv[name] === undefined) delete process.env[name]; else process.env[name] = originalEnv[name];
    }
  }
});
