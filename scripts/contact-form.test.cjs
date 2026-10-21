const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function formHarness(fetch) {
  const events = {}, classes = new Set();
  const form = { addEventListener(type, callback) { events[type] = callback; }, reportValidity: () => true, resets: 0, reset() { this.resets++; } };
  const status = { textContent: '', classList: { add: name => classes.add(name), remove: name => classes.delete(name) } };
  const button = { disabled: false };
  const nodes = { '#contact-form': form, '#form-status': status, '#send-button': button };
  vm.runInNewContext(readFileSync(require.resolve('../pages/contact.js'), 'utf8'), {
    document: { querySelector: selector => nodes[selector] },
    FormData: class { *[Symbol.iterator]() { yield* Object.entries({ name: 'Visitor', email: 'visitor@example.com', subject: 'Hello', message: 'A complete test message.' }); } },
    fetch, AbortSignal
  });
  return { form, status, button, classes, submit: () => events.submit({ preventDefault() {} }) };
}

test('failed or non-JSON submissions keep form text and re-enable the button', async () => {
  for (const response of [
    { ok: false, status: 503, json: async () => ({ error: 'Not configured' }) },
    { ok: true, status: 200, json: async () => { throw new Error('HTML response'); } }
  ]) {
    const h = formHarness(async () => response); await h.submit();
    assert.equal(h.form.resets, 0); assert.equal(h.button.disabled, false);
    assert.equal(h.classes.has('error'), true);
  }
});

test('accepted submissions reset the form and show submission confirmation', async () => {
  const h = formHarness(async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }));
  await h.submit(); assert.equal(h.form.resets, 1); assert.equal(h.button.disabled, false);
  assert.match(h.status.textContent, /Message submitted/);
});

test('double submission cannot send a second request while the first is pending', async () => {
  let resolve, calls = 0;
  const h = formHarness(() => { calls++; return new Promise(done => { resolve = done; }); });
  const first = h.submit(); await h.submit();
  assert.equal(calls, 1);
  resolve({ ok: true, status: 200, json: async () => ({ ok: true }) });
  await first; assert.equal(h.form.resets, 1);
});
