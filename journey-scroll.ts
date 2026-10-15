type Direction = 1 | -1;

type JourneyScrollOptions = {
  routeOrder: readonly string[];
  getRoute: () => string;
  navigate: (route: string, direction: Direction) => void;
};

type JourneyScrollController = {
  wire: (doc: Document, win: Window) => void;
  lock: (durationMs?: number) => void;
};

function createJourneyScroll(options: JourneyScrollOptions): JourneyScrollController {
  let lockedUntil = 0;
  let wheelTotal = 0;
  let lastWheelAt = 0;

  function lock(durationMs = 1100): void {
    lockedUntil = performance.now() + durationMs;
    wheelTotal = 0;
  }

  function nextRoute(direction: Direction): string | null {
    return options.routeOrder[options.routeOrder.indexOf(options.getRoute()) + direction] || null;
  }

  function isBlockedTarget(target: EventTarget | null, doc: Document): boolean {
    if (!target || (target as Node).nodeType !== 1) return false;
    const element = target as Element;
    if (element.closest('dialog[open], [role="dialog"], #project-modal, #arch-drawer, button, a, input, textarea, select, [contenteditable="true"], #filmstrip-scroller')) return true;

    for (let node: Element | null = element; node && node !== doc.documentElement; node = node.parentElement) {
      const style = doc.defaultView!.getComputedStyle(node);
      if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 4) return true;
    }
    return false;
  }

  function isAtEdge(doc: Document, direction: Direction): boolean {
    const root = doc.scrollingElement || doc.documentElement;
    if (direction === -1) return root.scrollTop <= 3;
    return root.scrollTop + root.clientHeight >= root.scrollHeight - 3;
  }

  function travel(direction: Direction): void {
    const route = nextRoute(direction);
    if (!route || performance.now() < lockedUntil) return;
    lock();
    options.navigate(route, direction);
  }

  function wire(doc: Document, win: Window): void {
    let touchStart: { x: number; y: number; direction: Direction | null } | null = null;

    doc.addEventListener('wheel', event => {
      if (event.defaultPrevented) return;
      if (performance.now() < lockedUntil) {
        event.preventDefault();
        return;
      }
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const direction: Direction = event.deltaY > 0 ? 1 : -1;
      if (!event.deltaY || !nextRoute(direction) || isBlockedTarget(event.target, doc) || !isAtEdge(doc, direction)) {
        wheelTotal = 0;
        return;
      }
      event.preventDefault();
      const now = performance.now();
      wheelTotal = now - lastWheelAt > 450 ? Math.abs(event.deltaY) : wheelTotal + Math.abs(event.deltaY);
      lastWheelAt = now;
      if (wheelTotal >= 80) travel(direction);
    }, { passive: false });

    doc.addEventListener('touchstart', event => {
      if (event.touches.length !== 1 || isBlockedTarget(event.target, doc)) return;
      const touch = event.touches[0];
      touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        direction: isAtEdge(doc, 1) ? 1 : isAtEdge(doc, -1) ? -1 : null
      };
    }, { passive: true });

    doc.addEventListener('touchend', event => {
      if (!touchStart || !event.changedTouches.length) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      const direction = dy < 0 ? 1 : -1;
      if (touchStart.direction === direction && Math.abs(dy) > 65 && Math.abs(dy) > Math.abs(dx) * 1.3 && isAtEdge(doc, direction)) {
        travel(direction);
      }
      touchStart = null;
    }, { passive: true });

    doc.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isBlockedTarget(event.target, doc)) return;
      const direction: Direction | null = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : null;
      if (direction && nextRoute(direction) && isAtEdge(doc, direction)) {
        event.preventDefault();
        travel(direction);
      }
    });

    win.addEventListener('scroll', () => { wheelTotal = 0; }, { passive: true });
  }

  return { wire, lock };
}

(window as Window & { createJourneyScroll: typeof createJourneyScroll }).createJourneyScroll = createJourneyScroll;
