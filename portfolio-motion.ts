/* Shared interaction layer. Native wheel/touch scrolling remains untouched. */
type PortfolioMotionWindow = Window & typeof globalThis & {
  openModal?: (id: string) => void;
  closeModal?: () => void;
};
type MotionHost = Window & { installPortfolioMotion?: (doc: Document, win: PortfolioMotionWindow) => void };
const PORTFOLIO_MOTION = Object.freeze({ reveal: 1050, panel: 620, close: 360, anchor: 1050, ease: 'cubic-bezier(.22,1,.36,1)' });
(window as MotionHost).installPortfolioMotion = (doc, win) => {
  if (doc.documentElement.dataset.motionSystem) return;
  doc.documentElement.dataset.motionSystem = 'ready';
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = win.matchMedia('(hover: hover) and (pointer: fine)');
  const cleanups: (() => void)[] = [];
  const surfaces = [...doc.querySelectorAll<HTMLElement>('.project-visual, .paper, .patent, .evidence, .work-entry')];
  let stopGlide = () => {};
  let hovered: HTMLElement | null = null;
  let frame = 0, currentX = 0, currentY = 0, targetX = 0, targetY = 0;
  function resetSurface() {
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
    if (hovered) { hovered.classList.remove('motion-hovered'); hovered.style.removeProperty('transform'); }
    hovered = null; currentX = currentY = targetX = targetY = 0;
  }
  function draw(time: number) {
    frame = 0;
    if (!hovered || reduced.matches || !fine.matches || doc.hidden) { resetSurface(); return; }
    const delta = Math.min(48, time - previousTime || 16);
    previousTime = time;
    const damping = 1 - Math.exp(-delta / 100);
    currentX += (targetX - currentX) * damping;
    currentY += (targetY - currentY) * damping;
    hovered.style.transform = `perspective(1200px) rotateX(${-currentY * 3.2}deg) rotateY(${currentX * 3.2}deg) translateY(-4px)`;
    hovered.style.setProperty('--light-x', `${50 + currentX * 45}%`);
    hovered.style.setProperty('--light-y', `${50 + currentY * 45}%`);
    if (Math.abs(targetX-currentX) + Math.abs(targetY-currentY) > .002) frame = win.requestAnimationFrame(draw);
  }
  let previousTime = 0;
  surfaces.forEach(surface => {
    surface.classList.add('motion-surface');
    const move = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
      if (hovered !== surface) { resetSurface(); hovered = surface; surface.classList.add('motion-hovered'); }
      const rect = surface.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX-rect.left)/rect.width*2-1));
      targetY = Math.max(-1, Math.min(1, (event.clientY-rect.top)/rect.height*2-1));
      if (!frame) {previousTime=0;frame=win.requestAnimationFrame(draw);}
    };
    surface.addEventListener('pointermove', move, {passive:true});
    surface.addEventListener('pointerleave', resetSurface);
    cleanups.push(()=>{surface.removeEventListener('pointermove',move);surface.removeEventListener('pointerleave',resetSurface);});
  });
  const revealObserver = new win.IntersectionObserver(entries => {
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('motion-entered');revealObserver.unobserve(entry.target);}});
  }, {threshold:.12,rootMargin:'0px 0px -3% 0px'});
  doc.querySelectorAll<HTMLElement>('.catalog-group-heading, .catalog-hero, .profile-section-header, .contact-hero, .section-head').forEach(element=>{
    element.classList.add('motion-section-intro');revealObserver.observe(element);
  });
  function glideTo(top: number) {
    stopGlide();
    if (reduced.matches) { win.scrollTo(0,top);return; }
    const start = win.scrollY, distance = top-start, duration = Math.min(PORTFOLIO_MOTION.anchor, 650+Math.abs(distance)*.08);
    const started = win.performance.now(); let id = 0;
    const stop = () => {win.cancelAnimationFrame(id);win.removeEventListener('wheel',stop);win.removeEventListener('touchstart',stop);win.removeEventListener('keydown',stop);};
    stopGlide=stop;
    const tick = (time:number) => {const p=Math.min(1,(time-started)/duration);win.scrollTo(0,start+distance*(1-Math.pow(1-p,4)));if(p<1)id=win.requestAnimationFrame(tick);else stop();};
    win.addEventListener('wheel',stop,{passive:true,once:true});win.addEventListener('touchstart',stop,{passive:true,once:true});win.addEventListener('keydown',stop,{once:true});
    id=win.requestAnimationFrame(tick);
  }
  doc.querySelectorAll<HTMLAnchorElement>('.catalog-nav a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click',event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=doc.getElementById(anchor.hash.slice(1));if(!target)return;
      event.preventDefault();glideTo(Math.max(0,target.getBoundingClientRect().top+win.scrollY-110));
    });
  });
  // Coordinate existing overlays after their content and focus handling have run.
  const modal=doc.getElementById('project-modal');
  let modalTicket=0;
  if(modal && win.openModal && win.closeModal){
    const open=win.openModal, close=win.closeModal;
    win.openModal=(id:string)=>{
      modalTicket++;modal.getAnimations({subtree:true}).forEach(animation=>animation.cancel());open(id);
      if(reduced.matches)return;
      modal.animate([{opacity:0},{opacity:1}],{duration:420,easing:PORTFOLIO_MOTION.ease});
      modal.firstElementChild?.animate([{opacity:.4,transform:'translateY(28px) scale(.98)'},{opacity:1,transform:'none'}],{duration:PORTFOLIO_MOTION.panel,easing:PORTFOLIO_MOTION.ease});
    };
    win.closeModal=()=>{
      const ticket=++modalTicket;
      if(reduced.matches || modal.classList.contains('hidden')){close();return;}
      modal.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
      const exit=modal.animate([{opacity:1},{opacity:0}],{duration:PORTFOLIO_MOTION.close,easing:'ease-in'});
      modal.firstElementChild?.animate([{transform:'none'},{transform:'translateY(16px) scale(.99)'}],{duration:PORTFOLIO_MOTION.close,easing:'ease-in'});
      exit.finished.then(()=>{if(ticket===modalTicket)close();}).catch(()=>{});
    };
  }
  const onVisibility=()=>{if(doc.hidden){resetSurface();stopGlide();}};
  const onMotionChange=()=>{resetSurface();stopGlide();};
  doc.addEventListener('visibilitychange',onVisibility);reduced.addEventListener('change',onMotionChange);fine.addEventListener('change',onMotionChange);
  win.addEventListener('pagehide',()=>{resetSurface();stopGlide();revealObserver.disconnect();cleanups.forEach(clean=>clean());doc.removeEventListener('visibilitychange',onVisibility);reduced.removeEventListener('change',onMotionChange);fine.removeEventListener('change',onMotionChange);},{once:true});
};
