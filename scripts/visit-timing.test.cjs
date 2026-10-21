const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function harness() {
  const context = { window: {}, document: { referrer: 'https://source.example' } };
  vm.runInNewContext(readFileSync(require.resolve('../visit-tracker.js'), 'utf8'), context);
  let stamp = 0, hidden = false, sequence = 0;
  const sent = [];
  const tracker = context.window.createPortfolioVisitTracker({ sessionId: 'session', send: payload => sent.push(payload), uuid: () => `event-${++sequence}`, now: () => stamp, isHidden: () => hidden });
  return { tracker, sent, at(value) { stamp = value; }, hide(value) { hidden = value; } };
}

test('foreground time excludes hidden intervals and heartbeats reuse one event', () => {
  const h = harness(); h.tracker.enter('arrival');
  h.at(1000); h.tracker.checkpoint();
  h.at(2000); h.hide(true); h.tracker.checkpoint();
  h.at(12000); h.hide(false); h.tracker.checkpoint();
  h.at(15000); h.tracker.checkpoint();
  assert.equal(h.sent.at(-1).activeMs, 5000);
  assert.equal(new Set(h.sent.map(event => event.eventId)).size, 1);
});

test('route changes finalize the old page and start a distinct page event', () => {
  const h = harness(); h.tracker.enter('arrival');
  h.at(2500); h.tracker.enter('theater/project');
  assert.equal(h.sent[1].route, '#arrival'); assert.equal(h.sent[1].activeMs, 2500); assert.equal(h.sent[1].ended, true);
  assert.equal(h.sent[2].route, '#theater/project'); assert.equal(h.sent[2].activeMs, 0);
  assert.notEqual(h.sent[1].eventId, h.sent[2].eventId);
  h.tracker.enter('theater/project'); assert.equal(h.sent.length, 3);
});

test('pagehide finalizes once and back/forward cache resume starts fresh timing', () => {
  const h = harness(); h.tracker.enter('arrival');
  h.at(1000); h.tracker.checkpoint(true); h.tracker.checkpoint(true);
  assert.equal(h.sent.length, 2);
  h.at(20000); h.tracker.resume();
  h.at(21000); h.tracker.checkpoint();
  assert.equal(h.sent.at(-1).activeMs, 1000);
  assert.notEqual(h.sent[0].eventId, h.sent.at(-1).eventId);
});

test('opening in a background tab starts counting only after visibility resumes', () => {
  const h = harness(); h.hide(true); h.tracker.enter('arrival');
  h.at(20000); h.hide(false); h.tracker.checkpoint();
  assert.equal(h.sent.at(-1).activeMs, 0);
  h.at(22000); h.tracker.checkpoint(); assert.equal(h.sent.at(-1).activeMs, 2000);
});
