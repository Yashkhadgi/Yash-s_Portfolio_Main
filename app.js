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
  let transitionTimer;

  function routeFromHash() {
    const requested = location.hash.slice(1).toLowerCase();
    return routes[requested] ? requested : 'arrival';
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

  function navigate(route, options = {}) {
    if (!routes[route]) route = 'arrival';
    const destination = routes[route];
    const sameRoute = currentRoute === route && frame.dataset.loaded === 'true';

    if (!options.fromHistory && location.hash !== `#${route}`) {
      history.pushState({ route }, '', `#${route}`);
    }
    updateMobileJourney(route);
    if (sameRoute) return;

    currentRoute = route;
    beginTransition();
    frame.dataset.route = route;
    frame.dataset.loaded = 'false';
    // Replace child history so only the parent route contributes a Back entry.
    frame.contentWindow.location.replace(new URL(destination.file, location.href).href);
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
  window.addEventListener('hashchange', () => navigate(routeFromHash(), { fromHistory: true }));
  window.addEventListener('popstate', () => navigate(routeFromHash(), { fromHistory: true }));

  const initialRoute = routeFromHash();
  currentRoute = initialRoute;
  document.title = `${routes[initialRoute].title} — Yash Khadgi`;
  frame.dataset.route = initialRoute;
  updateMobileJourney(initialRoute);
  if (initialRoute !== 'arrival') {
    frame.src = routes[initialRoute].file;
    document.title = `${routes[initialRoute].title} — Yash Khadgi`;
  } else if (location.hash !== '#arrival') {
    history.replaceState({ route: 'arrival' }, '', '#arrival');
  }

  journeyToggle.addEventListener('click', () => {
    const open = mobileJourney.classList.toggle('open');
    journeyToggle.setAttribute('aria-expanded', String(open));
  });
  mobileJourney.querySelectorAll('[data-route]').forEach(button => {
    button.addEventListener('click', () => navigate(button.dataset.route));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') updateMobileJourney(currentRoute);
  });
})();
