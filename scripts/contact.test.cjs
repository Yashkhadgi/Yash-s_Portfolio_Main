const { test } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/contact');
const response = () => ({ headers: {}, code: 200, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
const request = { method: 'POST', headers: { host: 'portfolio.example', origin: 'https://portfolio.example' }, body: { name: 'Test Visitor', email: 'visitor@example.com', subject: 'Project enquiry', message: 'Hello, I would like to discuss a project.' } };

test('contact email submission', async t => {
  const original = global.fetch;
  const keys = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL'];
  const before = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  try {
    await t.test('missing email setup reports unavailable without sending anything', async () => {
      delete process.env.RESEND_API_KEY; delete process.env.CONTACT_FROM_EMAIL;
      global.fetch = () => { throw new Error('Must not send'); };
      const res = response(); await handler(request, res);
      assert.equal(res.code, 503); assert.equal(res.body.code, 'CONTACT_NOT_CONFIGURED');
      assert.equal(res.headers['Cache-Control'], 'no-store');
    });
    process.env.RESEND_API_KEY = 'test-only';
    process.env.CONTACT_FROM_EMAIL = 'Portfolio <hello@example.com>';
    process.env.CONTACT_TO_EMAIL = 'owner@example.com';
    await t.test('valid submissions target the owner with visitor email as reply-to', async () => {
      global.fetch = async (url, options) => {
        assert.equal(url, 'https://api.resend.com/emails');
        const body = JSON.parse(options.body);
        assert.deepEqual(body.to, ['owner@example.com']);
        assert.equal(body.reply_to, 'visitor@example.com');
        assert.equal(body.from, process.env.CONTACT_FROM_EMAIL);
        assert.ok(options.signal);
        return { ok: true, json: async () => ({ id: 'email-test' }) };
      };
      const res = response(); await handler(request, res);
      assert.equal(res.code, 200); assert.equal(res.body.ok, true);
    });
    await t.test('provider rejection never reports success or exposes its error message', async () => {
      global.fetch = async () => ({ ok: false, status: 403, json: async () => ({ name: 'validation_error', message: 'Private provider details' }) });
      const res = response(); await handler(request, res);
      assert.equal(res.code, 502); assert.equal(res.body.ok, undefined);
      assert.ok(!JSON.stringify(res.body).includes('Private provider details'));
    });
    await t.test('a non-JSON or missing-id provider response cannot claim success', async () => {
      global.fetch = async () => ({ ok: true, status: 200, json: async () => { throw new Error('Invalid JSON'); } });
      const res = response(); await handler(request, res); assert.equal(res.code, 502);
    });
    await t.test('invalid, foreign-origin and bot submissions never call the provider', async () => {
      global.fetch = () => { throw new Error('Must not send'); };
      const invalid = response(); await handler({ ...request, body: { ...request.body, email: 'invalid' } }, invalid);
      assert.equal(invalid.code, 400);
      const foreign = response(); await handler({ ...request, headers: { ...request.headers, origin: 'https://other.example' } }, foreign);
      assert.equal(foreign.code, 403);
      const bot = response(); await handler({ ...request, body: { ...request.body, website: 'spam' } }, bot);
      assert.equal(bot.code, 200);
    });
    await t.test('network failures are reported without clearing the submission', async () => {
      global.fetch = async () => { throw new TypeError('fetch failed'); };
      const res = response(); await handler(request, res);
      assert.equal(res.code, 502); assert.equal(res.body.code, 'CONTACT_DELIVERY_FAILED');
    });
  } finally {
    global.fetch = original;
    for (const key of keys) { if (before[key] === undefined) delete process.env[key]; else process.env[key] = before[key]; }
  }
});
