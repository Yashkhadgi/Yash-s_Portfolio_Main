(() => {
  const projects = new Map(window.UNIVERSE_DATA.PROJECTS.map(project => [project.id, project]));
  const groups = [
    ['hackathon-project-grid', 'hackathon', ['customerpulse', 'memorylens', 'docflow', 'learningpath']],
    ['standout-project-grid', 'standout', ['agriprice', 'lungtwin', 'cyclecura', 'skillforge', 'safarsathi']],
    ['experimental-project-grid', 'experimental', ['aasb', 'bhashayatra', 'trendplus', 'medminder', 'sitedubot', 'eklink']]
  ];
  const context = {
    customerpulse: ['Union Bank × KJ Somaiya · 4-person team', 'Finalist · approximately top 2% of 1,500+ teams'],
    memorylens: ['AI for Bharat · Hack2skill × AWS', 'Prototype submission · team lead & backend architect'],
    docflow: ['IEEE NEXUS 2026 · SIT Nagpur', 'Working prototype · development ongoing'],
    learningpath: ['HCL × HackerEarth Amplified Hackathon', 'Hackathon project · adaptive learning paths'],
    agriprice: ['Research & Project-Based Learning', 'Published IEEE paper + published patent application'],
    lungtwin: ['Research & Project-Based Learning', 'Published patent application · research prototype'],
    cyclecura: ['Research & intellectual property', 'Published patent application'],
    skillforge: ['Maincraft Technologies · solo internship build', 'Completed internship project · full-stack LMS'],
    safarsathi: ['Independent project', 'Multilingual AI travel companion'],
    aasb: ['Independent experiment', 'Computer vision · gesture-based whiteboard'],
    bhashayatra: ['Academic project', 'Multi-agent tourist assistant'],
    trendplus: ['Independent tool', 'Placement research & preparation CLI'],
    medminder: ['Independent prototype', 'Medication reminder & adherence workflows'],
    sitedubot: ['Academic project', 'Student FAQ chatbot'],
    eklink: ['Ongoing team project', 'Shared identity for four institutional applications']
  };
  const descriptions = {"customerpulse": "An AI-powered complaint intelligence platform for financial-services workflows. It brings complaints from multiple channels into one place, classifies topic and sentiment, detects related submissions and supports response drafting.", "memorylens": "A multimodal search tool for finding documents and photos using natural-language clues and face matching. The prototype combines cloud extraction, vector retrieval and an open-file workflow to make scattered information easier to find.", "docflow": "A document automation platform for turning bulk PDF and image uploads into structured data. OCR extraction, asynchronous workers and a human review step support low-confidence fields before CSV or JSON export.", "learningpath": "An adaptive learning path engine that starts with conversational onboarding and skill-gap diagnostics. Hybrid course scoring and graph-based sequencing organise a roadmap that can adapt as a learner progresses.", "agriprice": "A research-led machine learning project for forecasting agricultural commodity prices from historical market data. The work explores ensemble regression and resulted in an IEEE paper and a published patent application.", "lungtwin": "A digital twin research prototype exploring CT imaging, 3D lung anatomy and mathematical treatment-response simulation. The project combines visualisation and modelling in a virtual research environment and resulted in a published patent application.", "cyclecura": "A research project focused on menstrual health and PCOS support. Its intellectual-property outcome is documented in a published patent application.", "skillforge": "A full-stack learning management platform built independently during an internship at Maincraft Technologies. The project brings learning content, user workflows and backend services together in a complete application.", "safarsathi": "An independent multilingual AI travel companion that combines location-aware recommendations, route and trip guidance, and SOS support. It connects language processing with maps and travel services."};
  const titles = { agriprice: 'Agriculture Price Prediction', lungtwin: 'LungTwin' };
  const caseStudies = new Set(['customerpulse', 'memorylens', 'docflow', 'learningpath', 'agriprice', 'lungtwin', 'skillforge', 'safarsathi']);
  const patentFiles = {
    agriprice: '../more data abt me/Patent_Agriculture_Price_Prediction_202621048319.pdf',
    lungtwin: '../more data abt me/Patent_LungTwin_202621080930.pdf',
    cyclecura: '../more data abt me/Patent_CycleCura_202621011705.pdf'
  };
  const originalImages = {"customerpulse": "https://lh3.googleusercontent.com/aida-public/AB6AXuCxeOlXzOWwts8TZA9XzNYObL6FGmSk5b5OdseO0YxLnvif0-7mu98aeQhkk0bmr3wbbXeDhFCsZe9900FoY6zDGpNnYnCvITxANtApC6JQ7uvNfQRtbijr-uYntF7s1RaMTlqwA8TGQ7G54KtvaeBnOYZ4sXAcSS6d60TosUA1PNT3wMGfafbbC2mN8SZ_FsLGxqsfAi6E8nRX9L2yV9Hj0_pAyqxff3mWZ3w4mk8F", "memorylens": "https://lh3.googleusercontent.com/aida-public/AB6AXuB4tVci4ipQmCRmRhBv_qjWBIJcfzy801Fe37OQ25p18VHF7E7rJ0UyP4nVPJkT06zgXtObLWF1HjsawKnfM8YArqKwM-m8NTrLM6KwhkSx5XFNN-aqf3jD2t-7NOISi4m1pLh2D2LhSX5_zh_Ckkwk4GhJvc8UF0tF1ymV7-AlSNqR-kztUK8MTmWS7ECHHZsOQZCX46XUwCY4aOk9Jz4g35zPNweu1UA2D8NT82pR"};
  const suppliedImages = {cyclecura: 'assets/cyclecura-interface-concept.png', bhashayatra: 'assets/bhashayatra-interface-concept.png'};
  const generatedTiles = {cyclecura:[0,0],aasb:[50,0],bhashayatra:[100,0],trendplus:[0,50],medminder:[50,50],sitedubot:[100,50],eklink:[0,100]};
  const artwork = {docflow:'03',lungtwin:'04',skillforge:'05',safarsathi:'06',learningpath:'07',agriprice:'08'};
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function externalLink(label, href) {
    const link = element('a', '', label);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }
  for (const [targetId, group, ids] of groups) {
    const grid = document.getElementById(targetId);
    for (const id of ids) {
      const project = projects.get(id);
      const card = element('article', 'catalog-card stage-panel');
      card.id = `stage-${id}`;
      card.dataset.group = group;
      const top = element('div', 'catalog-card-top');
      const icon = element('span', 'material-symbols-outlined catalog-icon', project.icon);
      icon.setAttribute('aria-hidden', 'true');
      const identity = element('div', '');
      identity.append(element('h3', '', titles[id] || project.title), element('p', 'catalog-context', context[id][0]));
      top.append(icon, identity);
      const copy = element('div', 'project-copy');
      copy.append(element('p', 'project-number', `${String(ids.indexOf(id)+1).padStart(2,'0')} / ${group === 'hackathon' ? 'HACKATHON BUILD' : group === 'standout' ? 'RESEARCH & PRODUCT' : 'EXPERIMENTAL BUILD'}`));
      copy.append(top, element('p', 'catalog-subtitle', project.sub), element('p', 'catalog-outcome', context[id][1]));
      copy.append(element('p', 'catalog-description', descriptions[id] || project.metrics.split('•').slice(0, 4).map(item => item.trim()).join(' · ')));
      if (project.role && !/TBC|to be confirmed/i.test(project.role)) {
        const role = element('p', 'catalog-role');
        role.append(element('b', '', 'MY ROLE'), document.createTextNode(project.role));
        copy.append(role);
      }
      const stack = element('div', 'catalog-stack');
      project.stack.filter(tech => !/to be confirmed/i.test(tech)).slice(0, 5).forEach(tech => stack.append(element('span', '', tech)));
      copy.append(stack);
      const actions = element('div', 'catalog-actions');
      if (caseStudies.has(id)) {
        const button = element('button', '', 'View details →');
        button.id = `${id}-modal`;
        button.type = 'button';
        button.setAttribute('aria-label', `View ${titles[id] || project.title} details`);
        button.addEventListener('click', () => window.openModal(`${id}-modal`));
        actions.append(button);
      }
      if (project.github) actions.append(externalLink('GitHub ↗', project.github));
      if (project.doi) actions.append(externalLink('Read paper ↗', project.doi));
      if (patentFiles[id]) actions.append(externalLink('Patent record ↗', patentFiles[id]));
      if (id === 'eklink') {
        const portal = element('a', '', 'Explore ecosystem →');
        portal.href = '../index.html#universe/eklink';
        portal.target = '_top';
        portal.addEventListener('click', event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          window.parent.postMessage({ type: 'navigate', hash: 'universe/eklink' }, '*');
        });
        actions.append(portal);
      }
      copy.append(actions);
      const visual = element('figure', 'project-visual');
      const bar = element('div', 'visual-bar');
      bar.append(element('span', 'visual-dots', '● ● ●'),element('span','', `${titles[id] || project.title} / ${suppliedImages[id] ? 'interface concept' : originalImages[id] || artwork[id] || generatedTiles[id] ? 'conceptual visual' : 'project workflow'}`));
      visual.append(bar);
      const scene = element('div', 'visual-scene');
      if (suppliedImages[id]) {
        scene.classList.add('supplied-scene');
        const image = element('img','restored-project-image supplied-project-image');
        image.src = suppliedImages[id]; image.alt = `${project.title} interface concept supplied by Yash`; image.loading = 'lazy'; image.width = 1672; image.height = 941;
        scene.append(image);
      } else if (originalImages[id]) {
        const image = element('img', 'restored-project-image');
        image.src = originalImages[id]; image.alt = `${project.title} conceptual artwork; not an application screenshot`; image.loading = 'lazy';
        scene.append(image);
      } else if (artwork[id]) {
        const image = element('div', `project-artwork project-artwork-${artwork[id]}`);
        image.setAttribute('role','img'); image.setAttribute('aria-label',`${project.title} conceptual artwork; not an application screenshot`);
        scene.append(image);
      } else if (generatedTiles[id]) {
        scene.classList.add('generated-scene');
        const image = element('div','generated-artwork');
        image.style.backgroundPosition = generatedTiles[id].map(value=>`${value}%`).join(' ');
        image.setAttribute('role','img');image.setAttribute('aria-label',`${project.title} AI-generated conceptual artwork; not an application screenshot`);
        scene.append(image,element('span','generated-label','CONCEPT ART'));
      } else {
        scene.classList.add('workflow-scene');
        scene.append(element('span','material-symbols-outlined workflow-icon',project.icon));
        const flow = element('div','workflow-steps');
        project.metrics.split('•').slice(0,3).forEach((item,index)=>{const step=element('div','workflow-step');step.append(element('span','',`0${index+1}`),element('p','',item.trim()));flow.append(step);});
        scene.append(flow);
      }
      visual.append(scene,element('figcaption','',id === 'cyclecura' ? context[id][1] : project.status));
      card.append(copy,visual);
      grid.append(card);
    }
  }
  const section = document.getElementById('experimental-builds');
  const track = document.getElementById('experimental-project-grid');
  const sticky = element('div','experimental-sticky');
  section.prepend(sticky);
  sticky.append(section.querySelector('.catalog-group-heading'));
  const controls = element('div','reel-controls');
  const progress = element('span','reel-count','01 / 06');
  controls.append(element('span','reel-hint','SCROLL TO EXPLORE →'),progress);
  for (const [label,direction] of [['Previous project',-1],['Next project',1]]) {
    const button=element('button','',direction<0?'←':'→');button.type='button';button.setAttribute('aria-label',label);
    button.addEventListener('click',()=>{
      const cards=[...track.children], step=cards[0].getBoundingClientRect().width+24;
      const current=Math.round(track.scrollLeft/step),next=Math.max(0,Math.min(cards.length-1,current+direction));
      if(section.classList.contains('reel-pinned')) window.scrollTo({top:section.offsetTop + next/(cards.length-1)*(section.offsetHeight-window.innerHeight),behavior:'smooth'});
      else track.scrollTo({left:next*step,behavior:'smooth'});
    });controls.append(button);
  }
  sticky.append(controls,track);
  track.tabIndex=0;track.setAttribute('aria-label','Personal and experimental projects horizontal reel');
  const media=window.matchMedia('(min-width: 900px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)');
  let scheduled=false;
  function drawReel(){
    scheduled=false;
    if(!media.matches) return;
    const range=section.offsetHeight-window.innerHeight;
    const progressValue=Math.max(0,Math.min(1,(window.scrollY-section.offsetTop)/range));
    track.scrollLeft=progressValue*(track.scrollWidth-track.clientWidth);
    progress.textContent=`${String(Math.min(6,Math.floor(progressValue*5+.5)+1)).padStart(2,'0')} / 06`;
  }
  function sizeReel(){section.classList.toggle('reel-pinned',media.matches);section.style.height=media.matches?`${window.innerHeight+Math.max(0,track.scrollWidth-track.clientWidth)}px`:'';drawReel();}
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(drawReel);}},{passive:true});
  track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();controls.querySelectorAll('button')[event.key==='ArrowLeft'?0:1].click();}});
  track.addEventListener('scroll',()=>{if(!media.matches){const width=track.children[0].getBoundingClientRect().width+24;progress.textContent=`${String(Math.min(6,Math.round(track.scrollLeft/width)+1)).padStart(2,'0')} / 06`;}},{passive:true});
  media.addEventListener('change',sizeReel);window.addEventListener('resize',sizeReel);document.fonts.ready.then(sizeReel);requestAnimationFrame(sizeReel);
})();
