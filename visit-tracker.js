// Cumulative foreground time: retries/heartbeats update one page-view event.
(() => {
  window.createPortfolioVisitTracker = function ({ sessionId, send, uuid = () => crypto.randomUUID(), now = () => performance.now(), isHidden = () => document.hidden }) {
    let current = null;
    function checkpoint(ended = false) {
      if (!current || current.ended) return;
      const stamp = now();
      if (current.started !== null) current.activeMs = Math.min(86400000, current.activeMs + Math.max(0, stamp - current.started));
      current.started = ended || isHidden() ? null : stamp;
      current.ended = ended;
      send({ route: `#${current.route}`, sessionId, eventId: current.id, activeMs: Math.round(current.activeMs), ended, referrer: document.referrer });
    }
    function enter(route, force = false) {
      if (!force && current?.route === route && !current.ended) return;
      checkpoint(true);
      current = { id: uuid(), route, activeMs: 0, started: isHidden() ? null : now(), ended: false };
      checkpoint();
    }
    return { enter, checkpoint, resume() { if (current?.ended) enter(current.route, true); } };
  };
})();
