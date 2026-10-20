// Behavior-only integration for the original exported screens.
window.enhancePortfolioPage = (doc, win, navigate) => {
  if (doc.documentElement.dataset.enhanced) return;
  doc.documentElement.dataset.enhanced = 'true';
  win.addEventListener('error', event => {
    if (event.message) console.error('Portfolio page error:', event.filename, event.lineno, event.error?.stack || event.message);
  });
  const style = doc.createElement('style');
  style.textContent = `
    :focus-visible{outline:2px solid #55b7ff!important;outline-offset:4px}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
    .portfolio-motion-reveal{opacity:0;transform:translate3d(0,24px,0) scale(.985);filter:blur(8px);transition:opacity 1.05s cubic-bezier(.22,1,.36,1),transform 1.05s cubic-bezier(.22,1,.36,1),filter 1.05s ease}
    .portfolio-motion-reveal.is-visible{opacity:1;transform:none;filter:none}
    .portfolio-motion-tilt{transform-style:preserve-3d;will-change:transform;transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s ease}
    .portfolio-motion-tilt:hover{box-shadow:0 24px 70px rgba(0,0,0,.28)}
    .portfolio-magnetic{will-change:translate;transition:translate .35s cubic-bezier(.22,1,.36,1),box-shadow .35s ease}
    .portfolio-motion-reveal h1,.portfolio-motion-reveal h2,.portfolio-motion-reveal h3{text-wrap:balance}
    .portfolio-motion-reveal.is-visible h1,.portfolio-motion-reveal.is-visible h2,.portfolio-motion-reveal.is-visible h3{animation:portfolio-title-focus .9s cubic-bezier(.22,1,.36,1) both}
    @keyframes portfolio-title-focus{from{opacity:.2;filter:blur(10px);letter-spacing:.08em;transform:translateY(12px)}to{opacity:1;filter:none;letter-spacing:0;transform:none}}
    .portfolio-cursor{position:fixed;z-index:9999;width:10px;height:10px;border:1px solid rgba(85,183,255,.9);border-radius:50%;pointer-events:none;opacity:0;transform:translate(-50%,-50%);transition:width .22s ease,height .22s ease,background .22s ease,opacity .22s ease;mix-blend-mode:screen}
    .portfolio-cursor.is-active{opacity:1}
    .portfolio-cursor.is-hovering{width:34px;height:34px;background:rgba(85,183,255,.16)}
    .portfolio-cinema-bar{position:fixed;left:0;right:0;height:18px;background:#07080b;z-index:9998;pointer-events:none;transition:transform .9s cubic-bezier(.22,1,.36,1)}
    .portfolio-cinema-bar.top{top:0}.portfolio-cinema-bar.bottom{bottom:0}
    .portfolio-cinema-bar.settled.top{transform:translateY(-100%)}.portfolio-cinema-bar.settled.bottom{transform:translateY(100%)}
    @media (pointer:coarse),(prefers-reduced-motion:reduce){.portfolio-cursor,.portfolio-cinema-bar{display:none}.portfolio-motion-reveal{opacity:1;transform:none;filter:none}}
    #portfolio-command{background:#171a20;color:#ebe9ef;border:1px solid #434a4f;border-radius:8px;padding:24px;width: min(540px,90vw);max-height:80vh;overflow:auto}
    #portfolio-command::backdrop{background:rgba(0,0,0,.7)}
    #portfolio-command input{width:100%;padding:12px;background:#0c0e12;color:inherit;border:1px solid #434a4f;border-radius:4px;margin:16px 0}
    #portfolio-command button{display:block;text-align:left;width:100%;padding:12px;background:transparent;color:inherit;border:0;cursor:pointer}
    #portfolio-command button:hover{background:#30363a}
    #project-modal>div{max-width:calc(100vw - 24px)}
    .modal-tab-btn{flex-shrink:0}
    @media(max-width:640px){
      html,body{max-width:100%;overflow-x:hidden}
      body{padding-bottom:calc(5rem + env(safe-area-inset-bottom))}
      img,video,canvas,svg{max-width:100%}
      button,a{touch-action:manipulation}
      .portfolio-motion-reveal{filter:none;transform:translate3d(0,12px,0);transition-duration:.45s}
      .portfolio-motion-reveal.is-visible{transform:none}
      .portfolio-cinema-bar{height:8px}
      #portfolio-command{width:calc(100vw - 24px);max-height:80dvh;padding:18px}
      #portfolio-command input,#portfolio-command button{min-height:44px}
      #scene-arrival h1{font-size:clamp(2.35rem,10vw,3.5rem)!important;line-height:.98!important;overflow-wrap:anywhere}
      #scene-arrival .min-h-\\[780px\\]{min-height:0!important;padding-top:5.5rem;padding-bottom:2.5rem}
      #scene-arrival blockquote{font-size:clamp(1.55rem,7vw,2rem);line-height:1.25}
      #scene-arrival .aspect-\\[4\\/5\\]{aspect-ratio:4/4.5}
      #scene-arrival .font-label-caps,#scene-arrival .font-label-tag{overflow-wrap:anywhere}
      #scene-arrival .p-space-sm.flex.items-center.justify-between{display:flex!important;flex-wrap:wrap;align-items:flex-start;gap:.4rem}
      #scene-arrival .p-space-sm.flex.items-center.justify-between>div:first-child{min-width:0;flex:1 1 100%;display:flex;align-items:flex-start;gap:.35rem}
      #scene-arrival .p-space-sm.flex.items-center.justify-between>div:first-child>span:last-child{min-width:0;font-size:10px;line-height:1.35;white-space:normal;overflow-wrap:anywhere}
      #scene-arrival .p-space-sm.flex.items-center.justify-between>span:last-child{max-width:100%;margin-left:28px;white-space:normal;text-align:left;line-height:1.35;overflow-wrap:anywhere}
      #scene-transform h2,#scene-discovery h2{font-size:clamp(2rem,9vw,2.8rem);line-height:1.08}
      .profile-section{padding:52px 0}
      .profile-wrap{width:calc(100% - 36px)}
      .profile-intro img{width:min(100%,280px);height:auto;aspect-ratio:4/4.7}
      .profile-grid{grid-template-columns:1fr}
      .profile-row{grid-template-columns:1fr;gap:7px}
      .profile-skills{grid-template-columns:minmax(0,1fr);gap:16px}
      .skill-categories{display:flex;flex-direction:row;overflow-x:auto;overscroll-behavior-inline:contain}
      .skill-category{flex:0 0 auto;min-height:44px;padding:10px 12px}
      .skill-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}
      .profile-section-header{display:block}
      .profile-section-header p{margin-top:12px}
      .profile-end{align-items:flex-start;flex-direction:column}
      .contact-hero{padding-top:54px;padding-bottom:50px}
      .contact-hero h1{font-size:clamp(2.65rem,11vw,4rem);line-height:1.02;overflow-wrap:anywhere}
      .contact-hero p{font-size:16px;line-height:1.65}
      .contact-grid{padding-top:48px;padding-bottom:56px;gap:48px}
      .links>a{min-height:76px;gap:12px}
      .links strong{font-size:15px;overflow-wrap:anywhere}
      .message input,.message textarea{font-size:16px;min-height:48px}
      .message textarea{min-height:140px}
      .message button{min-height:48px}
      .footer{flex-direction:column;align-items:flex-start;padding-top:28px;padding-bottom:calc(34px + env(safe-area-inset-bottom))}
      .section{padding-top:64px;padding-bottom:64px}
      .section-head{grid-template-columns:minmax(0,1fr);gap:12px;margin-bottom:30px}
      .section-head p{justify-self:start;margin:0}
      .paper-title{font-size:clamp(1.8rem,7vw,2.5rem);overflow-wrap:anywhere}
      .patent{padding:22px}
      .patent-top{flex-wrap:wrap;gap:10px}
      .patent h3{font-size:25px}
      .certificate-info{padding:16px}
      .certificate-info h3{font-size:20px}
      .flow{min-height:0}
      .documents{grid-template-columns:1fr}
      body>aside{display:none!important}
    }
  `;
  doc.head.append(style);
  doc.documentElement.classList.add('portfolio-motion-enabled');

  // A short filmic entrance plus scroll reveals give the exported pages a shared rhythm.
  const topBar = doc.createElement('div'); topBar.className = 'portfolio-cinema-bar top'; topBar.setAttribute('aria-hidden', 'true');
  const bottomBar = doc.createElement('div'); bottomBar.className = 'portfolio-cinema-bar bottom'; bottomBar.setAttribute('aria-hidden', 'true');
  doc.body.append(topBar, bottomBar);
  requestAnimationFrame(() => requestAnimationFrame(() => { topBar.classList.add('settled'); bottomBar.classList.add('settled'); }));

  const revealSelectors = 'main > section, main > div > section, .section, .hero, .stage-panel, .filmstrip-card, .patent, .paper, .answer, .evidence, .interest';
  const revealItems = [...doc.querySelectorAll(revealSelectors)].filter((el, index, all) => all.indexOf(el) === index);
  revealItems.forEach((el, index) => { el.classList.add('portfolio-motion-reveal'); el.style.transitionDelay = `${Math.min(index * 45, 280)}ms`; });
  if ('IntersectionObserver' in win) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else revealItems.forEach(el => el.classList.add('is-visible'));

  // Desktop-only pointer depth: this is intentionally limited to framed content cards.
  if (win.matchMedia('(hover: hover) and (pointer: fine)').matches && !win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cursor = doc.createElement('div'); cursor.className = 'portfolio-cursor'; cursor.setAttribute('aria-hidden', 'true'); doc.body.append(cursor);
    let cursorX = -40, cursorY = -40, targetX = -40, targetY = -40, cursorFrame = 0;
    const drawCursor = () => {
      cursorFrame = 0;
      cursorX += (targetX - cursorX) * .22; cursorY += (targetY - cursorY) * .22;
      cursor.style.left = `${cursorX}px`; cursor.style.top = `${cursorY}px`;
      if (Math.abs(targetX - cursorX) > .2 || Math.abs(targetY - cursorY) > .2) cursorFrame = win.requestAnimationFrame(drawCursor);
    };
    doc.addEventListener('pointermove', event => {
      targetX = event.clientX; targetY = event.clientY; cursor.classList.add('is-active');
      if (!cursorFrame) cursorFrame = win.requestAnimationFrame(drawCursor);
    }, { passive: true });
    doc.querySelectorAll('a,button,.celestial-node,.q,.tech-btn,.filter-chip').forEach(el => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
    });


  }

  // Gentle pointer parallax on the existing hero focal points; no layout or content changes.
  if (win.matchMedia('(hover: hover) and (pointer: fine)').matches && !win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallaxItems = [...doc.querySelectorAll('.hero .portrait, .hero .paper-orbit, .hero .orbit')];
    doc.addEventListener('pointermove', event => {
      const x = (event.clientX / win.innerWidth - .5) * 2;
      const y = (event.clientY / win.innerHeight - .5) * 2;
      parallaxItems.forEach((el, index) => { el.style.translate = `${(x * (index + 1) * 3).toFixed(1)}px ${(y * (index + 1) * 2).toFixed(1)}px`; });
    }, { passive: true });
  }

  // Keep scroll-linked motion lightweight: one RAF update per frame, with a soft depth shift.
  const depthItems = [...doc.querySelectorAll('.hero .portrait-frame, .hero .paper, .hero .answer, .hero .orbit')];
  if (depthItems.length && !win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let scrollFrame = 0;
    const updateDepth = () => {
      scrollFrame = 0;
      const amount = Math.min(win.scrollY, win.innerHeight) * .035;
      depthItems.forEach((el, index) => { el.style.setProperty('--portfolio-depth', `${(amount * (index % 2 ? -1 : 1)).toFixed(1)}px`); el.style.translate = `0 var(--portfolio-depth)`; });
    };
    win.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = win.requestAnimationFrame(updateDepth); }, { passive: true });
    updateDepth();
  }
  doc.querySelector('#btn-tab-overview')?.parentElement.style.setProperty('overflow-x', 'auto');
  doc.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) img.alt = img.dataset.alt || '';
    img.decoding = 'async';
  });
  doc.querySelectorAll('a[href="#"]').forEach(link=>{
    if(link.textContent.includes('GITHUB REPO')){link.href='https://github.com/Yashkhadgi/memorylens';link.target='_blank';link.rel='noopener noreferrer';}
  });
  const dialog = doc.createElement('dialog');
  dialog.id = 'portfolio-command';
  dialog.setAttribute('aria-label', 'Search portfolio');
  const heading = doc.createElement('h2'); heading.textContent = 'Explore the journey';
  const search = doc.createElement('input'); search.type = 'search'; search.placeholder = 'Search pages or projects'; search.setAttribute('aria-label', search.placeholder);
  const results = doc.createElement('div');
  const close = doc.createElement('button'); close.textContent = 'Close'; close.onclick = () => dialog.close();
  dialog.append(heading, search, results, close); doc.body.append(dialog);
  const projectRepos = [
    ['CustomerPulse','CustomerPulse','React TypeScript FastAPI PostgreSQL AWS Bedrock RAG'],
    ['MemoryLens','memorylens','Python FastAPI FAISS React AWS Textract Rekognition Bedrock to confirm'],
    ['DocFlow','DocFlow','React TypeScript FastAPI PostgreSQL Celery Docker'],
    ['Lung Digital Twin','LungTwin_V2','React Three.js FastAPI PyDICOM SimpleITK PyRadiomics scikit-learn'],
    ['SkillForge','skilforge','Python Flask SQLite Bootstrap REST APIs Chart.js'],
    ['MedMinder AI','medicine-reminder-agent','Python Streamlit SQLite Pydantic PDF parsing LLM fallback'],
    ['BhashaYatra','multilingual_tourist_assistant','LangGraph ChromaDB Sarvam AI SQLite travel assistant'],
    ['TrendPulse','TrendPlus','Python Tavily Groq Pydantic Rich CLI'],
    ['SIT EduBot','student-faq-chatbot','Flask NLTK TextBlob TF-IDF Logistic Regression JavaScript'],
    ['AI Air Smartboard','AASB-Ai_Air_Smartboard','Python OpenCV MediaPipe FastAPI WebSockets React Vite'],
    ['SafarSathi','SafarSathi','travel companion in progress'],
    ['Learning Path Recommender','HCL_hack','Next.js 15 React Tailwind v4 PostgreSQL Prisma Groq Gemini Zod DAG']
  ];
  const commands = Object.entries({arrival:'Arrival',universe:'Universe',theater:'Project Theater',research:'Archives',contact:'Contact'}).map(([route,name])=>({name,action:()=>navigate(route)}));
  projectRepos.forEach(([name,repo,tags])=>commands.push({name:`${name} · GitHub`,tags,action:()=>win.open(`https://github.com/Yashkhadgi/${repo}`,'_blank','noopener,noreferrer')}));
  commands.push({name:'Agriculture Price Prediction · IEEE DOI',tags:'IEEE TEMSMET 2025 agriculture price prediction machine learning patent reported publication',action:()=>win.open('https://doi.org/10.1109/TEMSMET65536.2025.11467327','_blank','noopener,noreferrer')});
  commands.push({name:'Contact by email',action:()=>{win.location.href='mailto:yashkhadgi4@gmail.com';}});
  function renderCommands(){
    results.replaceChildren();
    const query = search.value.trim().toLowerCase();
    commands.filter(c=>`${c.name} ${c.tags||''}`.toLowerCase().includes(query)).forEach(c=>{
      const button=doc.createElement('button');button.textContent=c.name;button.onclick=()=>{dialog.close();c.action();};results.append(button);
    });
    if(!results.children.length) results.textContent='No matching pages or projects.';
  }
  function openCommands(){heading.textContent='Explore the journey';search.hidden=false;search.value='';renderCommands();if(!dialog.open)dialog.showModal();search.focus();}
  search.oninput=renderCommands;
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  doc.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();e.stopImmediatePropagation();openCommands();}
  },true);
  doc.querySelectorAll('button').forEach(button=>{
    const label=button.getAttribute('aria-label')||button.textContent.trim();
    if(/Command Center|COMMAND|^MENU$/.test(label)){
      button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();openCommands();},true);
    }
    if(label==='SKIP INTRO') button.onclick=()=>win.switchScene?win.switchScene('C'):navigate('universe');
  });
  dialog.addEventListener('close',()=>{heading.textContent='Explore the journey';search.hidden=false;});
  if (!doc.documentElement.dataset.universeEngine) {
    doc.querySelectorAll('.celestial-node').forEach(node=>{
      node.tabIndex=0;node.setAttribute('role','button');node.setAttribute('aria-label',node.dataset.title||node.textContent.trim());
      const open=()=>node.dispatchEvent(new win.MouseEvent('mouseenter'));
      node.addEventListener('click',open);
      node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    });
  }
  for(const selector of ['.q','.tech-btn','.filter-chip','.node']){
    const buttons=[...doc.querySelectorAll(selector)];
    const sync=()=>buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active')||button.classList.contains('active-chip'))));
    buttons.forEach(button=>button.addEventListener('click',sync));sync();
  }
  doc.querySelector('#close-hud')?.setAttribute('aria-label','Close project preview');
  const progressLabel=[...doc.querySelectorAll('aside span')].find(el=>el.textContent.trim()==='34%');
  if(progressLabel){
    const updateProgress=()=>{const total=doc.documentElement.scrollHeight-win.innerHeight;const ratio=total>0?Math.min(1,Math.max(0,win.scrollY/total)):1;progressLabel.textContent=`${Math.round(ratio*100)}%`;const arc=progressLabel.parentElement.querySelector('circle[stroke-dashoffset]');arc?.setAttribute('stroke-dashoffset',String(81.68*(1-ratio)));};
    win.addEventListener('scroll',updateProgress,{passive:true});win.addEventListener('resize',updateProgress);updateProgress();
  }
  const clockLabel=[...doc.querySelectorAll('aside span')].find(el=>el.textContent.trim()==='IST 02:44:19');
  if(clockLabel){const tick=()=>{clockLabel.textContent=`IST ${new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date())}`;};tick();const timer=win.setInterval(tick,1000);win.addEventListener('pagehide',()=>win.clearInterval(timer),{once:true});}
  doc.querySelectorAll('.patent').forEach(p=>{
    p.setAttribute('role','button');p.setAttribute('aria-expanded',String(p.classList.contains('open')));
    const details=p.querySelector('.details');
    const sync=()=>{p.setAttribute('aria-expanded',String(p.classList.contains('open')));details.style.maxHeight=p.classList.contains('open')?'none':'0';};
    p.addEventListener('click',sync);p.addEventListener('keyup',sync);
    p.addEventListener('keydown',e=>{if(e.key===' ')e.preventDefault();});sync();
  });
  ['#flow-note','#answer-copy','#projects'].forEach(selector=>doc.querySelector(selector)?.setAttribute('aria-live','polite'));
  const modal=doc.querySelector('#project-modal');
  if(modal){
    const content={
      'customerpulse-modal':['CustomerPulse','AI-powered unified complaint intelligence platform for financial-services workflows.','AI/ML, Architecture & Product Contributor · 4-member team','Multi-channel complaint intake • NLP classification & sentiment • urgency scoring • duplicate detection (pgvector + hashing) • AI-assisted replies • RBAC','React, TypeScript, Vite, FastAPI, PostgreSQL, pgvector, AWS Bedrock (Claude)','CustomerPulse','Completed hackathon prototype','Finalist (approx. top 2% of 1,500+ teams) — Union Bank × KJ Somaiya Hackathon 2026',['Intake','Enrichment','Deduplication','Response & RBAC'],['Multi-channel intake','NLP classification & urgency scoring','pgvector duplicate detection','AI-assisted reply drafting & RBAC']],
      'memorylens-modal':['MemoryLens','Multimodal document and photo search using natural-language clues and face matching.','Team Lead & Backend Architect · 4-member team','Natural-language document search • face-based photo matching • FAISS vector retrieval • indexing & open-file workflow','Python, FastAPI, React, FAISS, AWS Textract, AWS Rekognition, AWS Bedrock','memorylens','Hackathon prototype completed','AWS-powered AI for Bharat Hackathon 2026 — prototype submission stage (not the Grand Finale)',['Ingestion','Cloud Extraction','Vector Retrieval','Search Workflow'],['Document & photo intake','Textract & Rekognition extraction','FAISS vector index & matching','Ranked open-file workflow']],
      'docflow-modal':['DocFlow','Document automation platform for bulk uploads, OCR/field extraction, async processing and structured exports.','Team Lead, Backend & Infrastructure','Bulk PDF/image upload • OCR-based extraction • async jobs (Celery + RabbitMQ) • human review of low-confidence fields • CSV/JSON export','React, TypeScript, FastAPI, PostgreSQL, Celery, RabbitMQ, Docker','DocFlow','Working prototype · development ongoing','Born at IEEE NEXUS 2026, Symbiosis Institute of Technology, Nagpur',['Upload','Extraction','Queue Processing','Review & Export'],['Bulk PDF & image upload','OCR field extraction','Celery & RabbitMQ async jobs','Human review & structured export']],
      'digitaltwin-modal':['Lung Digital Twin','Medical research prototype exploring CT imaging, 3D anatomy and mathematical growth/response simulation; not a clinical device.','Team Lead & end-to-end prototype developer','DICOM CT viewing • tumor-mask overlays • 3D lung anatomy • treatment scheduling • Gompertz-style response simulation','React, Vite, Three.js, React Three Fiber, Recharts, FastAPI, PyDICOM, SimpleITK, PyRadiomics, scikit-learn','LungTwin_V2','Working research prototype','Patent reported (exact title/number to be added). Research simulation only, not a clinical device',['DICOM Scans','Segmentation','3D Anatomy','Response Sim'],['DICOM CT scan viewing','Tumor-mask overlay analysis','3D anatomical lung model','Gompertz-style response simulation']],
      'skillforge-modal':['SkillForge','Full-stack learning management system featuring authentication with OTP recovery, RBAC, enrollment progress tracking, admin analytics, and audit logging.','Solo · Python Full Stack Internship, Maincraft Technologies (May–June 2026)','Auth + OTP recovery • RBAC • enrollment & progress • reviews • certificates • admin analytics • audit logs • CSV export • API-key REST','Python, Flask, SQLite, Bootstrap, JavaScript, Chart.js, Flask-WTF, Flask-Limiter','skilforge','Built','Complete internship product',['Auth & Security','Core LMS Engine','Audits & Analytics','Certificates & APIs'],['Auth & OTP recovery / RBAC','Enrollment & course progress','Audit logs & admin analytics','Certificates & API-key REST']],
      'safarsathi-modal':['SafarSathi','Multilingual AI travel assistant providing location-aware recommendations, route assistance, and SOS support for hospitals and police.','Builder / Developer · personal project','Multilingual AI assistant • location-aware recommendations • route & trip help • SOS support for hospitals/police','AI / LLM integration, Multilingual processing, Google Maps, Travel APIs','SafarSathi','Completed','Completed personal product',['User Intake','Multilingual NLP','Maps & Routing','Guidance & SOS'],['User query & location intake','Multilingual NLP processing','Google Maps & travel integration','Contextual advice & SOS support']],
      'learningpath-modal':['Learning Path Recommender','Adaptive learning path engine featuring conversational onboarding, skill-gap diagnostics, and DAG topological course sequencing.','Role to be confirmed','Conversational onboarding • skill-gap analysis • hybrid course scoring • DAG + Kahn topological path (Foundations → Core → Specialization) • adaptive re-planning • 5-question diagnostics','Next.js 15, React, Tailwind v4, PostgreSQL, Prisma, Groq, Gemini, Zod','HCL_hack','Hackathon project (implementation documented in submitted report)','HCL × HackerEarth Amplified Hackathon',['Diagnostics','Skill-Gap Scoring','DAG Sequencing','Adaptive Path'],['5-question conversational diagnostic','Hybrid skill-gap course scoring','DAG + Kahn topological sequencing','Adaptive re-planning roadmap']],
      'agriprice-modal':['Agriculture Price Prediction','An agricultural machine learning framework for ensemble regressor-based crop price forecasting using historical market data.','Research team member · co-author & ML contributor','Historical market data • ensemble regression • published paper with DOI • patent publication reported June 2026','Python, Machine Learning, Ensemble Regression, Data Analytics','https://doi.org/10.1109/TEMSMET65536.2025.11467327','Published (IEEE Xplore) · patent publication reported June 2026','IEEE TEMSMET 2025, NIT Delhi — IEEE Xplore DOI Available',['Market Data','Preparation','Modelling','Prediction'],['Historical crop-market commodity records','Dataset cleaning and feature preparation','Ensemble regression framework','Agricultural commodity price forecasting']]
    };
    content['agri-price-modal'] = content['agriprice-modal'];
    content['lungtwin-modal'] = content['digitaltwin-modal'];
    let opener;
    const templates = new Map([...doc.querySelectorAll('.modal-tab-content')].map(panel=>[panel.id,panel.innerHTML]));
    const oldOpen=win.openModal, oldClose=win.closeModal;
    win.openModal=id=>{
      const data=content[id];if(!data)return;
      opener=doc.activeElement;oldOpen(id);
      templates.forEach((html,id)=>{doc.getElementById(id).innerHTML=html;});
      const setText=(selector,values)=>doc.querySelectorAll(selector).forEach((el,i)=>{el.textContent=values[i]||'';});
      const contextText = data[7] ? `${data[1]} (${data[7]})` : data[1];
      setText('#content-tab-overview p',[contextText,'Personal contribution',data[2],data[6]||'Product scope',data[3]]);
      setText('#content-tab-overview span',['ROLE','STATUS & SCOPE']);
      setText('#content-tab-problem h4',[data[0],'Approach & Key Capabilities']);
      setText('#content-tab-problem p',[data[1],data[3]]);
      const steps = data[8] || ['Input','Processing','Review','Output'];
      const stepDescs = data[9] || steps;
      setText('#content-tab-arch p',[stepDescs[0],stepDescs[1],stepDescs[2],stepDescs[3],'Conceptual overview – not repository-verified. ' + data[3]]);
      setText('#content-tab-arch span:not(.material-symbols-outlined)',['Conceptual overview – not repository-verified',steps[0].toUpperCase(),steps[1].toUpperCase(),steps[2].toUpperCase(),steps[3].toUpperCase()]);
      const stack = Array.isArray(data[4]) ? data[4] : data[4].split(', ');
      const isDoi = data[5] && data[5].includes('doi.org');
      setText('#content-tab-specs p',[stack[0]||'Stack',stack[1]||'Stack',stack[2]||'Stack',stack.slice(3).join(', ')||'Stack', isDoi ? 'IEEE Publication Record' : 'GitHub Source Repository', isDoi ? 'Published IEEE conference paper with DOI record.' : 'Project source and documentation.']);
      setText('#content-tab-specs span.font-label-caps',['TECHNOLOGY','TECHNOLOGY','TECHNOLOGY','TECHNOLOGY']);
      const repo=doc.querySelector('#content-tab-specs a');
      if (data[5]) {
        const repoUrl = data[5].startsWith('http') ? data[5] : `https://github.com/Yashkhadgi/${data[5]}`;
        repo.href = repoUrl.replace(/\.git$/, '');
        repo.style.display = '';
        repo.target = '_blank';
        repo.rel = 'noopener noreferrer';
        if (isDoi) {
          repo.textContent = 'OPEN IEEE DOI ↗';
        } else {
          repo.textContent = 'VIEW ON GITHUB ↗';
        }
      } else {
        repo.style.display = 'none';
      }
      const auditLabel=[...modal.querySelectorAll('span')].find(el=>el.textContent.includes('SYSTEM AUDIT STATUS'));if(auditLabel)auditLabel.textContent='PROJECT OVERVIEW';
      modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','modal-title');
      doc.body.style.overflow='hidden';modal.querySelector('button').focus();
    };
    win.closeModal=()=>{oldClose();doc.body.style.overflow='';opener?.focus();};
    modal.addEventListener('click',e=>{if(e.target===modal)win.closeModal();});
    doc.addEventListener('keydown',e=>{
      if(modal.classList.contains('hidden'))return;
      if(e.key==='Escape')win.closeModal();
      if(e.key==='Tab'){
        const items=[...modal.querySelectorAll('button,a[href]')].filter(el=>el.getClientRects().length);
        const first=items[0],last=items.at(-1);
        if(e.shiftKey&&doc.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&doc.activeElement===last){e.preventDefault();first.focus();}
      }
    });
  }
  // Short transition feedback reuses the existing layout and respects motion settings.
  for(const [name,selector] of [['switchStage','.stage-panel:not(.hidden)'],['switchScene','#scene-arrival:not(.hidden),#scene-transform:not(.hidden),#scene-discovery:not(.hidden)']]){
    if(typeof win[name]!=='function')continue;
    const original=win[name];
    win[name]=(...args)=>{original(...args);if(!win.matchMedia('(prefers-reduced-motion: reduce)').matches)doc.querySelector(selector)?.animate([{opacity:.4},{opacity:1}],{duration:240,easing:'ease-out'});};
  }
  window.installPortfolioMotion?.(doc, win);
  doc.addEventListener('keydown',e=>{if(e.key==='Escape'){doc.querySelector('#arch-drawer')?.classList.add('translate-x-full');doc.querySelector('#close-hud')?.click();}});
};
