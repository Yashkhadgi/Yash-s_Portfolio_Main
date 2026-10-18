(() => {
  'use strict';

  const routes = {
    arrival: { file: 'pages/arrival.html', title: 'The Departure' },
    universe: { file: 'pages/universe.html', title: "The Builder's Universe" },
    theater: { file: 'pages/theater.html', title: 'Project Theater' },
    research: { file: 'pages/research.html', title: 'Archives' },
    contact: { file: 'pages/contact.html', title: 'Contact' }
  };
  const routeOrder = Object.keys(routes);
  const legacyFolders = {
    arrival: '01_the_cinematic_arrival',
    universe: '02_the_builder_s_universe',
    theater: '03_cinematic_project_theater',
    research: '04_research_landmarks',
    contact: '05_the_person_behind_the_builds'
  };
  const app = document.querySelector('#app');
  const stage = document.querySelector('#page-stage');
  const mobileJourney = document.querySelector('#mobile-journey');
  const journeyToggle = document.querySelector('#journey-toggle');
  const chapter = document.querySelector('#chapter-cue');
  const chapterNumber = document.querySelector('#chapter-number');
  const chapterTitle = document.querySelector('#chapter-title');
  const frames = new Map();
  let frame = null;
  let currentRoute = 'arrival';
  let currentSub = null;
  let transitionTimer = 0;
  let cueTimer = 0;
  let navigationId = 0;
  const journeyScroll = window.createJourneyScroll({
    routeOrder,
    getRoute: () => currentRoute,
    navigate: (route, direction) => navigate(route, { scrollDirection: direction })
  });

  function recordVisit(route) {
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ route: `#${route || 'arrival'}` }),
      keepalive: true
    }).catch(() => {});
  }

  function parseHash() {
    const raw = location.hash.slice(1).trim();
    const [key, ...rest] = raw.split('/');
    const requested = key?.toLowerCase() === 'about' ? 'contact' : key?.toLowerCase();
    const base = routes[requested] ? requested : 'arrival';
    const sub = rest.join('/').toLowerCase() || null;
    if (sub && !(base === 'universe' && sub === 'eklink') && base !== 'theater') {
      return { base, sub: null, raw: base };
    }
    return { base, sub, raw: sub ? `${base}/${sub}` : base };
  }

  function routeFromLink(link, pageRoute) {
    const aliases = { archives: 'research', about: 'contact' };
    const dataPath = aliases[link.dataset.path] || link.dataset.path;
    if (dataPath && routes[dataPath]) return dataPath;
    const href = link.getAttribute('href') || '';
    if (href === '#' && link.closest('nav') && link.classList.contains('active')) return pageRoute;
    return routeOrder.find(key => href.includes(routes[key].file) || href.includes(`${legacyFolders[key]}/code.html`)) || null;
  }

  function ensureFrame(route) {
    if (frames.has(route)) return frames.get(route);
    const child = document.createElement('iframe');
    child.className = 'page is-hidden';
    child.dataset.route = route;
    child.title = routes[route].title;
    child.setAttribute('aria-hidden', 'true');
    child.tabIndex = -1;
    child.inert = true;
    child.setAttribute('allow', 'fullscreen');
    child.addEventListener('load', () => wirePage(child, route), { once: true });
    frames.set(route, child);
    child.src = routes[route].file;
    stage.appendChild(child);
    return child;
  }

  function preloadPages() {
    const index = routeOrder.indexOf(currentRoute);
    const priority = [routeOrder[index + 1], routeOrder[index - 1]].filter(Boolean);
    [...new Set(priority)].forEach((route, position) => {
      if (route !== currentRoute) setTimeout(() => ensureFrame(route), 120 + position * 180);
    });
  }

  function positionFrame(child, direction) {
    try {
      const scrollingElement = child.contentDocument.scrollingElement;
      child.contentWindow.scrollTo(0, direction === -1 ? scrollingElement.scrollHeight : 0);
    } catch (error) {
      // A direct visit can still be finishing its first layout.
    }
  }

  function showChapter(route) {
    clearTimeout(cueTimer);
    chapterNumber.textContent = `${String(routeOrder.indexOf(route) + 1).padStart(2, '0')} / 05`;
    chapterTitle.textContent = routes[route].title;
    chapter.classList.remove('show');
    void chapter.offsetWidth;
    chapter.classList.add('show');
    cueTimer = setTimeout(() => chapter.classList.remove('show'), 1150);
  }

  function activate(next, route, direction, token) {
    if (token !== navigationId) return;
    clearTimeout(transitionTimer);
    const previous = frame;
    if (previous === next) return;
    frames.forEach(child => {
      if (child === previous || child === next) return;
      child.classList.remove('is-active', 'is-entering', 'is-outgoing');
      child.classList.add('is-hidden');
    });
    const motion = previous && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    positionFrame(next, direction);
    next.classList.remove('is-hidden', 'is-outgoing', 'is-active');
    next.classList.add(motion ? 'is-entering' : 'is-active');
    next.classList.toggle('from-left', direction === -1);
    next.removeAttribute('aria-hidden');
    next.removeAttribute('tabindex');
    next.inert = false;
    frame = next;
    if (previous) {
      previous.inert = true;
      previous.setAttribute('aria-hidden', 'true');
      previous.tabIndex = -1;
    }
    app.classList.toggle('moving-back', direction === -1);
    if (motion) {
      showChapter(route);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (token !== navigationId) return;
        next.classList.add('is-active');
        next.classList.remove('is-entering');
        previous.classList.add('is-outgoing');
        previous.classList.remove('is-active');
      }));
      transitionTimer = setTimeout(() => {
        previous.classList.remove('is-outgoing');
        previous.classList.add('is-hidden');
        app.classList.remove('moving-back');
      }, 760);
      journeyScroll.lock(780);
    } else if (previous) {
      previous.classList.remove('is-active', 'is-outgoing');
      previous.classList.add('is-hidden');
    }
    if (currentSub) notifySubroute(route, currentSub);
  }

  function notifyTheaterProject(projectId) {
    if (!projectId || !frame) return;
    try {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      const cleanId = projectId.toLowerCase().replace(/[-_]modal$/, '');
      if (doc.getElementById(`stage-${cleanId}`) && typeof win.switchStage === 'function') win.switchStage(`stage-${cleanId}`);
      if (doc.getElementById(`${cleanId}-modal`) && typeof win.openModal === 'function') win.openModal(`${cleanId}-modal`);
    } catch (error) {
      console.warn('Theater project activation error:', error);
    }
  }

  function notifySubroute(route, sub) {
    if (!frame || !sub) return;
    if (route === 'universe') frame.contentWindow.postMessage({ type: 'navigate-sub', sub }, '*');
    if (route === 'theater') {
      frame.contentWindow.postMessage({ type: 'select-project', project: sub }, '*');
      notifyTheaterProject(sub);
    }
  }

  function navigate(target, options = {}) {
    const requested = typeof target === 'string' ? target.split('/') : [target?.base || 'arrival', target?.sub];
    const route = requested[0] === 'about' ? 'contact' : requested[0];
    const base = routes[route] ? route : 'arrival';
    let sub = requested[1] || null;
    if (sub && !(base === 'universe' && sub === 'eklink') && base !== 'theater') sub = null;
    const fullPath = sub ? `${base}/${sub}` : base;
    if (location.hash !== `#${fullPath}`) {
      const method = options.fromHistory ? 'replaceState' : 'pushState';
      history[method]({ route: base, sub }, '', `#${fullPath}`);
    }
    updateMobileJourney(base);
    if (base === currentRoute) {
      if (sub !== currentSub) {
        currentSub = sub;
        notifySubroute(base, sub);
      }
      return;
    }
    const direction = options.scrollDirection || (routeOrder.indexOf(base) > routeOrder.indexOf(currentRoute) ? 1 : -1);
    currentRoute = base;
    currentSub = sub;
    recordVisit(fullPath);
    document.title = `${routes[base].title} — Yash Khadgi`;
    const token = ++navigationId;
    const next = ensureFrame(base);
    journeyScroll.lock(780);
    if (next.dataset.loaded === 'true') activate(next, base, direction, token);
  }

  function updateMobileJourney(route) {
    journeyToggle.textContent = `${String(routeOrder.indexOf(route) + 1).padStart(2, '0')} / 05`;
    mobileJourney.querySelectorAll('[data-route]').forEach(button => {
      button.classList.toggle('active', button.dataset.route === route);
    });
    mobileJourney.classList.remove('open');
    journeyToggle.setAttribute('aria-expanded', 'false');
  }

  function wirePage(child, route) {
    const doc = child.contentDocument;
    if (!doc) return;
    child.dataset.loaded = 'true';
    doc.documentElement.dataset.journeyRoute = route;
    doc.addEventListener('keydown', event => {
      if (event.key === 'Escape') updateMobileJourney(currentRoute);
    });
    try {
      window.enhancePortfolioPage(doc, child.contentWindow, navigate);
    } catch (error) {
      console.error('Portfolio enhancement failed:', error);
    }
    journeyScroll.wire(doc, child.contentWindow);
    doc.querySelectorAll('a').forEach(link => {
      const targetRoute = routeFromLink(link, route);
      if (!targetRoute) return;
      link.setAttribute('href', new URL(`#${targetRoute}`, location.href).href);
      link.setAttribute('target', '_top');
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(targetRoute);
      });
    });
    if (route === currentRoute && child !== frame) {
      const direction = frame ? (routeOrder.indexOf(route) > routeOrder.indexOf(frame.dataset.route) ? 1 : -1) : 0;
      activate(child, route, direction, navigationId);
    }
    if (route === initial.base) preloadPages();
  }

  window.addEventListener('hashchange', () => navigate(parseHash(), { fromHistory: true }));
  window.addEventListener('popstate', () => navigate(parseHash(), { fromHistory: true }));
  window.addEventListener('message', event => {
    if (!Array.from(frames.values()).some(child => child.contentWindow === event.source)) return;
    if (event.data?.type === 'hash-update') {
      const [base, ...rest] = String(event.data.hash || '').split('/');
      if (base !== currentRoute) return;
      currentSub = rest.join('/') || null;
      const hash = currentSub ? `${base}/${currentSub}` : base;
      if (location.hash !== `#${hash}`) history.pushState({ route: base, sub: currentSub }, '', `#${hash}`);
    } else if (event.data?.type === 'navigate') {
      navigate(event.data.hash);
    }
  });

  const initial = parseHash();
  currentRoute = initial.base;
  currentSub = initial.sub;
  if (location.hash !== `#${initial.raw}`) history.replaceState({ route: initial.base, sub: initial.sub }, '', `#${initial.raw}`);
  recordVisit(initial.raw);
  document.title = `${routes[initial.base].title} — Yash Khadgi`;
  updateMobileJourney(initial.base);
  ensureFrame(initial.base);
  journeyToggle.addEventListener('click', () => {
    const open = mobileJourney.classList.toggle('open');
    journeyToggle.setAttribute('aria-expanded', String(open));
  });
  mobileJourney.querySelectorAll('[data-route]').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.route));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      updateMobileJourney(currentRoute);
      frame?.contentWindow?.postMessage({ type: 'escape' }, '*');
    }
  });
})();
