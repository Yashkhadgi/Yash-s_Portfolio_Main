// Behavior-only integration for the original exported screens.
window.enhancePortfolioPage = (doc, win, navigate) => {
  if (doc.documentElement.dataset.enhanced) return;
  doc.documentElement.dataset.enhanced = 'true';
  win.addEventListener('error', event => {
    if (event.message) console.error('Portfolio page error:', event.filename, event.lineno, event.error?.stack || event.message);
  });
  const style = doc.createElement('style');
  style.textContent = `
    :focus-visible{outline:2px solid #c3b2ff!important;outline-offset:4px}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
    #portfolio-command{background:#171a20;color:#ebe9ef;border:1px solid #49434f;border-radius:8px;padding:24px;width: min(540px,90vw);max-height:80vh;overflow:auto}
    #portfolio-command::backdrop{background:rgba(0,0,0,.7)}
    #portfolio-command input{width:100%;padding:12px;background:#0c0e12;color:inherit;border:1px solid #49434f;border-radius:4px;margin:16px 0}
    #portfolio-command button{display:block;text-align:left;width:100%;padding:12px;background:transparent;color:inherit;border:0;cursor:pointer}
    #portfolio-command button:hover{background:#30303a}
    #project-modal>div{max-width:calc(100vw - 24px)}
    .modal-tab-btn{flex-shrink:0}
  `;
  doc.head.append(style);
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
    ['SafarSathi','SafarSathi','travel companion in progress']
  ];
  const commands = Object.entries({arrival:'Arrival',universe:'Universe',theater:'Project Theater',research:'Research / Agriculture Price Prediction',about:'About'}).map(([route,name])=>({name,action:()=>navigate(route)}));
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
    // Retain the supplied palette; make unfinished controls explicit on activation.
    if(label==='Toggle Theme Mode'||label==='Toggle Ambience Audio'){
      button.onclick=()=>{heading.textContent=label==='Toggle Theme Mode'?'Light theme is not supplied yet':'Ambience audio is not supplied yet';search.hidden=true;results.replaceChildren();dialog.showModal();};
    }
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
      'customerpulse-modal':['CustomerPulse','AI-powered unified complaint intelligence platform for financial-services workflows.','AI/ML and product architecture contributor in a four-person team.','Email and website complaint intake, AI enrichment, duplicate/similarity detection, customer communication history, response assistance, permissions and lifecycle tracking.','React/TypeScript, FastAPI, PostgreSQL, AWS Bedrock, RAG','CustomerPulse'],
      'memorylens-modal':['MemoryLens','Multimodal document and photo search using natural-language clues and face matching.','Team Lead & Backend Architect in a four-person team.','Document parsing/indexing, embeddings and vector retrieval with FAISS, face-related photo matching, progress/status updates and local open-file workflows; AWS versus offline architecture details to be confirmed.','Python, FastAPI, FAISS, React, AWS Textract/Rekognition/Bedrock references','memorylens'],
      'docflow-modal':['DocFlow','Document processing and automation SaaS for invoices, forms and contracts.','Team Lead, Backend & Infrastructure for IEEE NEXUS 2026 work that is still improving.','Bulk upload, OCR/field extraction, async jobs, queueing/retries, human review, exports, authentication and deployment planning; advanced SaaS features remain to be verified.','React/TypeScript, FastAPI, PostgreSQL, Celery, Docker/deployment planning','DocFlow'],
      'digitaltwin-modal':['Lung Digital Twin v2','Medical research prototype exploring CT imaging, 3D anatomy and treatment-response simulation; not a clinically validated device.','Team Lead & end-to-end prototype developer.','DICOM scan views where data is available, tumor masks, anatomical 3D representation, treatment scheduling and Gompertz-style growth/response simulation.','React/Vite, Three.js/React Three Fiber, Recharts, FastAPI, PyDICOM, SimpleITK, PyRadiomics, scikit-learn','LungTwin_V2']
    };
    let opener;
    const templates = new Map([...doc.querySelectorAll('.modal-tab-content')].map(panel=>[panel.id,panel.innerHTML]));
    const oldOpen=win.openModal, oldClose=win.closeModal;
    win.openModal=id=>{
      const data=content[id];if(!data)return;
      opener=doc.activeElement;oldOpen(id);
      templates.forEach((html,id)=>{doc.getElementById(id).innerHTML=html;});
      const setText=(selector,values)=>doc.querySelectorAll(selector).forEach((el,i)=>{el.textContent=values[i]||'';});
      setText('#content-tab-overview p',[data[1],'Personal contribution',data[2],'Product scope',data[3]]);
      setText('#content-tab-overview span',['ROLE','WORKFLOW']);
      setText('#content-tab-problem h4',[data[0],'Approach']);
      setText('#content-tab-problem p',[data[1],data[3]]);
      setText('#content-tab-arch p',['Input','Processing','Review','Output',data[3]]);
      setText('#content-tab-arch span:not(.material-symbols-outlined)',['CONCEPTUAL WORKFLOW','INPUT','PROCESSING','REVIEW','OUTPUT']);
      const stack=data[4].split(', ');
      setText('#content-tab-specs p',[stack[0],stack[1],stack[2],stack.slice(3).join(', '),'GitHub Source Repository','Project source and documentation.']);
      setText('#content-tab-specs span.font-label-caps',['TECHNOLOGY','TECHNOLOGY','TECHNOLOGY','TECHNOLOGY']);
      const repo=doc.querySelector('#content-tab-specs a');repo.href=`https://github.com/Yashkhadgi/${data[5]}`;repo.target='_blank';repo.rel='noopener noreferrer';
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
  doc.addEventListener('keydown',e=>{if(e.key==='Escape'){doc.querySelector('#arch-drawer')?.classList.add('translate-x-full');doc.querySelector('#close-hud')?.click();}});
};
