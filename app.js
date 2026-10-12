(() => {
  'use strict';

  const routes = {
    arrival: { file: '01_the_cinematic_arrival/code.html', title: "The Departure" },
    universe: { file: '02_the_builder_s_universe/code.html', title: "The Builder's Universe" },
    theater: { file: '03_cinematic_project_theater/code.html', title: 'Project Theater' },
    research: { file: '04_research_landmarks/code.html', title: 'Research Landmarks' },
    about: { file: '05_the_person_behind_the_builds/code.html', title: 'The Person Behind the Builds' }
  };

  const routeOrder = Object.keys(routes);
  const frame = document.querySelector('#portfolio-page');
  const veil = document.querySelector('#veil');
  const progress = document.querySelector('#progress');
  const mobileJourney = document.querySelector('#mobile-journey');
  const journeyToggle = document.querySelector('#journey-toggle');
  let currentRoute = 'arrival';
  let currentSub = null;
  let transitionTimer;

  const validSubPaths = {
    universe: ['eklink']
  };

  function parseHash() {
    const raw = location.hash.slice(1).trim();
    if (!raw) return { base: 'arrival', sub: null, raw: 'arrival' };
    const parts = raw.split('/');
    const base = parts[0].toLowerCase();
    const sub = parts.length > 1 ? parts.slice(1).join('/').toLowerCase() : null;

    if (!routes[base]) {
      return { base: 'arrival', sub: null, raw: 'arrival' };
    }

    if (sub) {
      if (base === 'universe' && !validSubPaths.universe.includes(sub)) {
        return { base, sub: null, raw: base };
      }
      return { base, sub, raw: `${base}/${sub}` };
    }

    return { base, sub: null, raw: base };
  }

  function routeFromHash() {
    return parseHash().base;
  }

  function routeFromLink(link) {
    const dataPath = link.dataset.path;
    const aliases = { archives: 'research' };
    if (dataPath && routes[aliases[dataPath] || dataPath]) return aliases[dataPath] || dataPath;

    const href = link.getAttribute('href') || '';
    if (href === '#' && link.closest('nav') && link.classList.contains('active')) return currentRoute;
    return routeOrder.find(key => href.includes(routes[key].file.split('/')[0])) || null;
  }

  function beginTransition() {
    clearTimeout(transitionTimer);
    frame.classList.remove('ready');
    veil.classList.add('show');
    progress.classList.remove('done');
    progress.classList.add('active');
  }

  function endTransition() {
    requestAnimationFrame(() => {
      frame.classList.add('ready');
      veil.classList.remove('show');
      progress.classList.remove('active');
      progress.classList.add('done');
      transitionTimer = setTimeout(() => progress.classList.remove('done'), 450);
    });
  }

  function notifyTheaterProject(projectId) {
    if (!projectId) return;
    try {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      if (!win || !doc) return;
      const cleanId = projectId.toLowerCase().replace(/[-_]modal$/, '');
      const modalId = cleanId + '-modal';
      const stageId = 'stage-' + cleanId;
      if (doc.getElementById(stageId) && typeof win.switchStage === 'function') {
        win.switchStage(stageId);
      }
      if (typeof win.openModal === 'function' && doc.getElementById(modalId)) {
        win.openModal(modalId);
      }
    } catch (e) {
      console.warn('Theater project activation error:', e);
    }
  }

  function navigate(target, options = {}) {
    let base, sub;
    if (typeof target === 'string') {
      const parts = target.split('/');
      base = parts[0].toLowerCase();
      sub = parts.length > 1 ? parts.slice(1).join('/').toLowerCase() : null;
    } else if (target && typeof target === 'object') {
      base = target.base || 'arrival';
      sub = target.sub || null;
    } else {
      base = 'arrival';
      sub = null;
    }

    if (!routes[base]) base = 'arrival';

    if (sub && base === 'universe' && !validSubPaths.universe.includes(sub)) {
      sub = null;
    }

    const fullPath = sub ? `${base}/${sub}` : base;
    const destination = routes[base];
    const sameBaseRoute = currentRoute === base && frame.dataset.loaded === 'true';
    const sameSub = currentSub === sub;

    if (!options.fromHistory && location.hash !== `#${fullPath}`) {
      history.pushState({ route: base, sub }, '', `#${fullPath}`);
    } else if (options.fromHistory && location.hash !== `#${fullPath}`) {
      history.replaceState({ route: base, sub }, '', `#${fullPath}`);
    }
    updateMobileJourney(base);

    if (sameBaseRoute) {
      if (!sameSub) {
        currentSub = sub;
        if (base === 'universe') {
          frame.contentWindow?.postMessage({ type: 'navigate-sub', sub }, '*');
        } else if (base === 'theater') {
          frame.contentWindow?.postMessage({ type: 'select-project', project: sub }, '*');
          notifyTheaterProject(sub);
        }
      }
      return;
    }

    currentRoute = base;
    currentSub = sub;
    beginTransition();
    frame.dataset.route = base;
    frame.dataset.loaded = 'false';

    const urlObj = new URL(destination.file, location.href);
    if (sub) {
      if (base === 'universe') urlObj.searchParams.set('sub', sub);
      if (base === 'theater') urlObj.searchParams.set('project', sub);
    }

    // Replace child history so only the parent route contributes a Back entry.
    frame.contentWindow.location.replace(urlObj.href);
    document.title = `${destination.title} — Yash Khadgi`;
  }

  function updateMobileJourney(route) {
    const position = routeOrder.indexOf(route) + 1;
    journeyToggle.textContent = `${String(position).padStart(2, '0')} / 05`;
    mobileJourney.querySelectorAll('[data-route]').forEach(button => {
      button.classList.toggle('active', button.dataset.route === route);
    });
    mobileJourney.classList.remove('open');
    journeyToggle.setAttribute('aria-expanded', 'false');
  }

  function wirePage() {
    const doc = frame.contentDocument;
    if (!doc) return;

    frame.dataset.loaded = 'true';
    const route = frame.dataset.route || currentRoute;
    doc.documentElement.dataset.journeyRoute = route;
    doc.addEventListener('keydown', event => {
      if (event.key === 'Escape') updateMobileJourney(currentRoute);
    });
    try {
      window.enhancePortfolioPage(doc, frame.contentWindow, navigate);
    } catch (error) {
      console.error('Portfolio enhancement failed:', error);
    }

    if (currentSub) {
      if (route === 'universe') {
        frame.contentWindow?.postMessage({ type: 'navigate-sub', sub: currentSub }, '*');
      } else if (route === 'theater') {
        frame.contentWindow?.postMessage({ type: 'select-project', project: currentSub }, '*');
        notifyTheaterProject(currentSub);
      }
    }

    doc.querySelectorAll('a').forEach(link => {
      const targetRoute = routeFromLink(link);
      if (!targetRoute) return;

      link.setAttribute('href', new URL(`#${targetRoute}`, location.href).href);
      link.setAttribute('target', '_top');
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(targetRoute);
      });
    });

    endTransition();
  }

  frame.addEventListener('load', wirePage);
  window.addEventListener('hashchange', () => navigate(parseHash(), { fromHistory: true }));
  window.addEventListener('popstate', () => navigate(parseHash(), { fromHistory: true }));

  window.addEventListener('message', (event) => {
    if (event.data?.type === 'hash-update') {
      const hash = event.data.hash;
      const parts = hash.split('/');
      const base = parts[0];
      const sub = parts.length > 1 ? parts.slice(1).join('/') : null;
      currentRoute = base;
      currentSub = sub;
      if (location.hash !== `#${hash}`) {
        history.pushState({ route: base, sub }, '', `#${hash}`);
      }
      updateMobileJourney(base);
    } else if (event.data?.type === 'navigate') {
      navigate(event.data.hash);
    }
  });

  const initial = parseHash();
  currentRoute = initial.base;
  currentSub = initial.sub;
  document.title = `${routes[initial.base].title} — Yash Khadgi`;
  frame.dataset.route = initial.base;
  updateMobileJourney(initial.base);

  if (initial.base !== 'arrival' || initial.sub) {
    const initialUrl = new URL(routes[initial.base].file, location.href);
    if (initial.sub) {
      if (initial.base === 'universe') initialUrl.searchParams.set('sub', initial.sub);
      if (initial.base === 'theater') initialUrl.searchParams.set('project', initial.sub);
    }
    frame.src = initialUrl.href;
    document.title = `${routes[initial.base].title} — Yash Khadgi`;
  } else if (location.hash !== '#arrival') {
    history.replaceState({ route: 'arrival', sub: null }, '', '#arrival');
  }

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
      try {
        frame.contentWindow?.postMessage({ type: 'escape' }, '*');
      } catch (e) {}
    }
  });
})();
