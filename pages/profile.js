(() => {
  const groups = [
    { name: 'Languages', note: 'Code & queries', skills: [
      ['Python', 'Backend, ML and automation', 'MemoryLens', 'SkillForge', 'Agriculture Price Prediction'],
      ['JavaScript', 'Interactive web applications', 'SkillForge', 'AI Air Smartboard'],
      ['TypeScript', 'Typed product interfaces', 'CustomerPulse', 'DocFlow'],
      ['SQL', 'Relational data and queries', 'CustomerPulse', 'DocFlow', 'SkillForge'],
      ['HTML / CSS', 'Responsive interfaces', 'SkillForge', 'Portfolio']
    ] },
    { name: 'Frontend', note: 'Interfaces', skills: [
      ['React', 'Application interfaces', 'CustomerPulse', 'DocFlow', 'MemoryLens'],
      ['Next.js', 'Full-stack web applications', 'Learning Path Recommender'],
      ['Tailwind CSS', 'Responsive UI styling', 'Learning Path Recommender'],
      ['Three.js', 'Interactive 3D interface', 'Lung Digital Twin']
    ] },
    { name: 'Backend', note: 'Services & APIs', skills: [
      ['FastAPI', 'Python services and APIs', 'MemoryLens', 'DocFlow', 'AI Air Smartboard'],
      ['Flask', 'Database-backed web apps', 'SkillForge', 'SIT EduBot'],
      ['REST APIs', 'Application integration', 'MemoryLens', 'DocFlow', 'SkillForge'],
      ['WebSockets', 'Real-time interaction', 'AI Air Smartboard']
    ] },
    { name: 'AI / ML', note: 'Models & retrieval', skills: [
      ['Machine Learning', 'Prediction and classification', 'Agriculture Price Prediction', 'SIT EduBot'],
      ['RAG', 'Retrieval-augmented workflows', 'CustomerPulse', 'BhashaYatra'],
      ['LangGraph', 'Agent orchestration', 'BhashaYatra'],
      ['OpenCV / MediaPipe', 'Computer vision interaction', 'AI Air Smartboard'],
      ['scikit-learn', 'Applied ML experiments', 'Agriculture Price Prediction', 'SIT EduBot']
    ] },
    { name: 'Databases', note: 'Storage & search', skills: [
      ['PostgreSQL', 'Relational persistence', 'CustomerPulse', 'DocFlow'],
      ['SQLite', 'Local application data', 'SkillForge', 'MedMinder AI'],
      ['ChromaDB', 'Vector retrieval', 'BhashaYatra'],
      ['FAISS', 'Similarity search', 'MemoryLens']
    ] },
    { name: 'Cloud & Tools', note: 'Build & delivery', skills: [
      ['AWS', 'AI and storage services', 'MemoryLens', 'CustomerPulse'],
      ['Docker', 'Containerized services', 'DocFlow'],
      ['Git & GitHub', 'Source control and collaboration', 'DocFlow', 'MemoryLens', 'Portfolio']
    ] }
  ];

  const categories = document.querySelector('#skill-categories');
  const heading = document.querySelector('#skill-panel-heading');
  const tiles = document.querySelector('#skill-tiles');
  const evidenceName = document.querySelector('#skill-evidence-name');
  const evidenceCopy = document.querySelector('#skill-evidence-copy');
  const projects = document.querySelector('#skill-projects');
  if (!categories || !tiles) return;

  function showSkill(skill, button) {
    tiles.querySelectorAll('button').forEach(tile => tile.setAttribute('aria-pressed', String(tile === button)));
    evidenceName.textContent = skill[0];
    evidenceCopy.textContent = skill[1];
    projects.replaceChildren();
    skill.slice(2).forEach(project => {
      const link = document.createElement('a');
      link.href = '../index.html#theater';
      link.dataset.path = 'theater';
      link.textContent = project + ' ↗';
      projects.append(link);
    });
  }

  function showGroup(index) {
    const group = groups[index];
    categories.querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    heading.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = group.name;
    heading.append(strong, document.createTextNode(' — ' + group.note));
    tiles.replaceChildren();
    group.skills.forEach((skill, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'skill-tile';
      button.setAttribute('aria-pressed', String(i === 0));
      const label = document.createElement('b');
      label.textContent = skill[0];
      const note = document.createElement('span');
      note.textContent = skill[1];
      button.append(label, note);
      button.addEventListener('click', () => showSkill(skill, button));
      tiles.append(button);
    });
    showSkill(group.skills[0], tiles.firstElementChild);
  }

  groups.forEach((group, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'skill-category';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(i === 0));
    button.setAttribute('aria-controls', 'skill-panel');
    button.innerHTML = '';
    button.append(document.createTextNode(group.name));
    const note = document.createElement('small');
    note.textContent = group.skills.length + ' technologies · ' + group.note;
    button.append(note);
    button.addEventListener('click', () => showGroup(i));
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? i + 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? i - 1 : null;
      if (next === null) return;
      event.preventDefault();
      const target = (next + groups.length) % groups.length;
      showGroup(target);
      categories.children[target].focus();
    });
    categories.append(button);
  });
  showGroup(0);
})();
