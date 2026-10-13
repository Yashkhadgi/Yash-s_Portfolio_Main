// ═══════════════════════════════════════════════════════════════
// universe.data.js — Single source of truth for The Builder's Universe
// All text is fact-checked against Yash Khadgi's project notes.
// Loaded via <script src="universe.data.js"> before the engine.
// ═══════════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ── TAG TAXONOMY (filter chips) ──
  const TAGS = {
    all:       'All Systems',
    ai:        'RAG & AI/ML',
    backend:   'Python / FastAPI',
    cloud:     'AWS Cloud',
    fullstack: 'React / Full-Stack',
    research:  'Patents & Research',
    cv:        'Computer Vision'
  };

  // ── TIER CONFIGURATION ──
  const TIERS = {
    flagship:          { orbSize: 64, innerSize: 48, iconSize: 22, alwaysShowSub: true,  glow: true,  dashed: false },
    high:              { orbSize: 56, innerSize: 40, iconSize: 20, alwaysShowSub: true,  glow: false, dashed: false },
    medium:            { orbSize: 40, innerSize: 28, iconSize: 16, alwaysShowSub: false, glow: false, dashed: false },
    'research-concept':{ orbSize: 44, innerSize: 32, iconSize: 16, alwaysShowSub: false, glow: false, dashed: true  },
    portal:            { orbSize: 60, innerSize: 44, iconSize: 22, alwaysShowSub: true,  glow: true,  dashed: true  }
  };

  // ── THREE CONCENTRIC ORBITS (no crossing rings, shared tilt of -8 deg) ──
  // a = semi-major, b = semi-minor, rot = degrees (CW+), zAmp = depth parallax,
  // period = seconds per revolution, dir = +1 CCW / -1 CW, phase = initial offset (rad)
  const ORBITS = [
    { id: 'orbit-flagship',   name: 'Flagship Systems',         a: 250, b: 145, rot: -8, zAmp: 30, period: 75,  dir: 1, color: '#b8a4f8', phase: 0,   dashed: false, tag: '' },
    { id: 'orbit-satellites', name: 'Satellites & Micro-apps',  a: 360, b: 210, rot: -8, zAmp: 42, period: 115, dir: 1, color: '#cac4d2', phase: 0.5, dashed: false, tag: '' },
    { id: 'orbit-research',   name: 'Research & Patents',        a: 465, b: 275, rot: -8, zAmp: 54, period: 160, dir: 1, color: '#62dcad', phase: 1.2, dashed: false, tag: '' }
  ];

  // ── 15 PROJECTS (priority order) ──
  const PROJECTS = [
    {
      id: 'customerpulse', title: 'CustomerPulse', sub: 'Complaint Intelligence', tier: 'flagship', rank: 1,
      orbit: 'orbit-flagship', icon: 'insights', accent: 'secondary',
      tags: ['ai','backend','cloud','fullstack'],
      category: 'FLAGSHIP · COMPLAINT INTELLIGENCE',
      status: 'Completed hackathon prototype',
      role: 'AI/ML, Architecture & Product Contributor · 4-member team',
      recognition: 'Finalist (approx. top 2% of 1,500+ teams) — Union Bank × KJ Somaiya Hackathon 2026',
      metrics: 'Multi-channel complaint intake • NLP classification & sentiment • urgency scoring • duplicate detection (pgvector + hashing) • AI-assisted replies • RBAC',
      stack: ['React','TypeScript','Vite','FastAPI','PostgreSQL','pgvector','AWS Bedrock (Claude)'],
      github: 'https://github.com/Yashkhadgi/CustomerPulse'
    },
    {
      id: 'docflow', title: 'DocFlow', sub: 'Document Automation', tier: 'flagship', rank: 2,
      orbit: 'orbit-flagship', icon: 'account_tree', accent: 'secondary',
      tags: ['backend','fullstack'],
      category: 'FLAGSHIP · DOCUMENT AUTOMATION SaaS',
      status: 'Working prototype · development ongoing',
      role: 'Team Lead, Backend & Infrastructure',
      recognition: 'Born at IEEE NEXUS 2026, Symbiosis Institute of Technology, Nagpur',
      metrics: 'Bulk PDF/image upload • OCR-based extraction • async jobs (Celery + RabbitMQ) • human review of low-confidence fields • CSV/JSON export',
      stack: ['React','TypeScript','FastAPI','PostgreSQL','Celery','RabbitMQ','Docker'],
      github: 'https://github.com/Yashkhadgi/DocFlow'
    },
    {
      id: 'safarsathi', title: 'SafarSathi', sub: 'Multilingual Travel Companion', tier: 'flagship', rank: 3,
      orbit: 'orbit-flagship', icon: 'travel_explore', accent: 'primary',
      tags: ['ai','fullstack'],
      category: 'FLAGSHIP · AGENTIC TRAVELTECH',
      status: 'Completed',
      role: 'Builder / Developer · personal project',
      recognition: 'Completed personal product',
      metrics: 'Multilingual AI assistant • location-aware recommendations • route & trip help • SOS support for hospitals/police',
      stack: ['AI / LLM integration','Multilingual processing','Google Maps','Travel APIs'],
      github: 'https://github.com/Yashkhadgi/SafarSathi'
    },
    {
      id: 'memorylens', title: 'MemoryLens', sub: 'Multimodal Search', tier: 'flagship', rank: 4,
      orbit: 'orbit-flagship', icon: 'saved_search', accent: 'tertiary',
      tags: ['ai','backend','cloud','fullstack','cv'],
      category: 'FLAGSHIP · MULTIMODAL SEARCH',
      status: 'Hackathon prototype completed',
      role: 'Team Lead & Backend Architect · 4-member team',
      recognition: 'AWS-powered AI for Bharat Hackathon 2026 — prototype submission stage (not the Grand Finale)',
      metrics: 'Natural-language document search • face-based photo matching • FAISS vector retrieval • indexing & open-file workflow',
      stack: ['Python','FastAPI','React','FAISS','AWS Textract','AWS Rekognition','AWS Bedrock'],
      github: 'https://github.com/Yashkhadgi/memorylens'
    },
    {
      id: 'lungtwin', title: 'Lung Digital Twin', sub: 'Research Prototype', tier: 'flagship', rank: 5,
      orbit: 'orbit-flagship', icon: 'coronavirus', accent: 'primary',
      tags: ['research','ai','backend','fullstack','cv'],
      category: 'FLAGSHIP · MEDICAL RESEARCH PROTOTYPE',
      status: 'Working research prototype',
      role: 'Team Lead & end-to-end prototype developer',
      recognition: 'Patent reported (exact title/number to be added). Research simulation only, not a clinical device',
      metrics: 'DICOM CT viewing • tumor-mask overlays • 3D lung anatomy • treatment scheduling • Gompertz-style response simulation',
      stack: ['React','Vite','Three.js','React Three Fiber','Recharts','FastAPI','PyDICOM','SimpleITK','PyRadiomics','scikit-learn'],
      github: 'https://github.com/Yashkhadgi/LungTwin_V2'
    },
    {
      id: 'learningpath', title: 'Learning Path Recommender', sub: 'Adaptive Learning AI', tier: 'flagship', rank: 6,
      orbit: 'orbit-flagship', icon: 'route', accent: 'primary',
      tags: ['ai','fullstack'],
      category: 'FLAGSHIP · RECOMMENDATION SYSTEM',
      status: 'Hackathon project (implementation documented in submitted report)',
      role: 'TBC',
      recognition: 'HCL × HackerEarth Amplified Hackathon',
      metrics: 'Conversational onboarding • skill-gap analysis • hybrid course scoring • DAG + Kahn topological path (Foundations → Core → Specialization) • adaptive re-planning • 5-question diagnostics',
      stack: ['Next.js 15','React','Tailwind v4','PostgreSQL','Prisma','Groq','Gemini','Zod'],
      github: 'https://github.com/Yashkhadgi/HCL_hack'
    },
    {
      id: 'skillforge', title: 'SkillForge', sub: 'LMS System', tier: 'flagship', rank: 7,
      orbit: 'orbit-flagship', icon: 'school', accent: 'on-surface',
      tags: ['backend','fullstack'],
      category: 'FLAGSHIP · FULL-STACK LMS',
      status: 'Built',
      role: 'Solo · Python Full Stack Internship, Maincraft Technologies (May–June 2026)',
      recognition: 'Complete internship product',
      metrics: 'Auth + OTP recovery • RBAC • enrollment & progress • reviews • certificates • admin analytics • audit logs • CSV export • API-key REST',
      stack: ['Python','Flask','SQLite','Bootstrap','JavaScript','Chart.js','Flask-WTF','Flask-Limiter'],
      github: 'https://github.com/Yashkhadgi/skilforge'
    },
    {
      id: 'agriprice', title: 'Agri Price ML', sub: 'IEEE TEMSMET 2025', tier: 'high', rank: 8,
      orbit: 'orbit-research', icon: 'psychology_alt', accent: 'secondary',
      tags: ['research','ai'],
      category: 'RESEARCH · PUBLISHED PAPER + PATENT',
      status: 'Published (IEEE Xplore) · patent publication reported June 2026',
      role: 'Research team member · co-author',
      recognition: 'IEEE TEMSMET 2025, NIT Delhi — "An Agricultural Machine Learning Framework for Ensemble Regressor-Based Crop Price Prediction"',
      metrics: 'Historical market data • ensemble regression • published paper with DOI',
      stack: ['Python','Machine Learning','Ensemble Regression'],
      doi: 'https://doi.org/10.1109/TEMSMET65536.2025.11467327'
    },
    {
      id: 'eklink', title: 'EkLink', sub: 'Unified Portal · 4 apps inside', tier: 'portal', rank: 9,
      orbit: null, icon: 'hub', accent: 'primary',
      tags: ['fullstack','backend'],
      category: 'ECOSYSTEM · CENTRAL AUTH PORTAL',
      status: 'Group project · under development',
      role: 'Group project member (personal role TBC)',
      recognition: 'Connects TemplateOS, ApproveIt, SlotIt and Attendie under one identity',
      metrics: 'Central authentication • shared dashboard • role-based access • protected routing',
      stack: ['Stack to be confirmed'],
      github: 'https://github.com/Yashkhadgi/EkLink',
      childSystem: 'eklink'
    },
    {
      id: 'aasb', title: 'AI Air SmartBoard', sub: 'Gesture Whiteboard', tier: 'medium', rank: 10,
      orbit: 'orbit-satellites', icon: 'draw', accent: 'secondary',
      tags: ['cv','backend','fullstack'],
      category: 'EXPERIMENTAL · COMPUTER VISION',
      status: 'Built experimental application',
      role: 'Solo developer',
      recognition: 'Solo experimental application',
      metrics: 'Hand tracking • draw / erase / point gestures • shape correction & snap-to-grid • WebSocket event stream • AI note summary',
      stack: ['Python','OpenCV','MediaPipe','FastAPI WebSockets','React','Vite'],
      github: 'https://github.com/Yashkhadgi/AASB-Ai_Air_Smartboard'
    },
    {
      id: 'bhashayatra', title: 'BhashaYatra', sub: 'Agentic Tourist Assistant', tier: 'medium', rank: 11,
      orbit: 'orbit-satellites', icon: 'translate', accent: 'primary',
      tags: ['ai','backend'],
      category: 'ACADEMIC · MULTI-AGENT RAG',
      status: 'Academic project · feature completion to verify',
      role: 'Individual project',
      recognition: 'Academic project',
      metrics: 'LangGraph 4-agent design • maps / weather / currency APIs • temple & heritage agent • ChromaDB RAG • Indic language via Sarvam AI',
      stack: ['Python','LangGraph','ChromaDB','Sarvam AI','Google Maps API','SQLite'],
      github: 'https://github.com/Yashkhadgi/multilingual_tourist_assistant'
    },
    {
      id: 'trendplus', title: 'TrendPlus', sub: 'Placement Intelligence CLI', tier: 'medium', rank: 12,
      orbit: 'orbit-satellites', icon: 'trending_up', accent: 'tertiary',
      tags: ['ai','backend'],
      category: 'SUPPORTING · PLACEMENT INTELLIGENCE CLI',
      status: 'Built',
      role: 'Individual project',
      recognition: 'Individual CLI application',
      metrics: 'Target-company research via Tavily • Groq analysis • 7/15/30-day prep plans • Markdown reports • Rich terminal UI',
      stack: ['Python','Tavily API','Groq','Pydantic','Rich'],
      github: 'https://github.com/Yashkhadgi/TrendPlus'
    },
    {
      id: 'medminder', title: 'MedMinder AI', sub: 'Medication Adherence', tier: 'medium', rank: 13,
      orbit: 'orbit-satellites', icon: 'medication', accent: 'secondary',
      tags: ['ai','backend'],
      category: 'FEATURED · MULTI-AGENT REMINDERS',
      status: 'Built application / prototype · reminder tool, not medical advice',
      role: 'Solo developer',
      recognition: 'Solo project',
      metrics: 'Prescription parsing (text/PDF) • 4 agents: Parser, Scheduler, Reminder, Adherence • caregiver email escalation • regex fallback when LLM unavailable',
      stack: ['Python','Streamlit','SQLite','Pydantic','PyMuPDF','Groq / Gemini / Claude / OpenAI'],
      github: 'https://github.com/Yashkhadgi/medicine-reminder-agent'
    },
    {
      id: 'sitedubot', title: 'SIT EduBot', sub: 'Student FAQ Chatbot', tier: 'medium', rank: 14,
      orbit: 'orbit-satellites', icon: 'smart_toy', accent: 'on-surface',
      tags: ['ai','backend','fullstack'],
      category: 'ACADEMIC · NLP CHATBOT',
      status: 'Built academic project',
      role: 'Developer (exact contribution TBC)',
      recognition: 'Academic chatbot for Symbiosis Institute of Technology, Nagpur (not an official helpdesk)',
      metrics: 'NLTK preprocessing • TF-IDF retrieval • Logistic Regression intent classification • context tracking • CSV analytics',
      stack: ['Python','Flask','NLTK','TextBlob','scikit-learn','HTML/CSS/JS'],
      github: 'https://github.com/Yashkhadgi/student-faq-chatbot'
    },
    {
      id: 'cyclecura', title: 'CycleCura', sub: 'Cycle & PCOS Risk Concept', tier: 'research-concept', rank: 15,
      orbit: 'orbit-research', icon: 'monitor_heart', accent: 'secondary',
      tags: ['research','ai'],
      category: 'RESEARCH · PATENT-ASSOCIATED CONCEPT',
      status: 'Patent publication reported January 2026 · software implementation unconfirmed',
      role: 'Contribution TBC',
      recognition: '"CycleCura: Smart Menstrual Cycle Prediction and PCOS/PCOD Risk Detection System" (patent publication number to be added)',
      metrics: 'Cycle prediction • risk-indication concept (not clinical diagnosis)',
      stack: ['Predictive analytics (concept)'],
      github: null
    }
  ];

  // ── EKLINK CHILD SYSTEM (ONE SINGLE ORBIT) ──
  const CHILD_SYSTEMS = {
    eklink: {
      title: 'EkLink',
      italic: 'Solar System',
      eyebrow: 'SPATIAL DIMENSION 02.1 // SOLAR SYSTEM · EKLINK',
      description: 'One identity, four institutional apps. EkLink is the central authentication and access layer; TemplateOS, ApproveIt, SlotIt and Attendie are specialised applications being developed to plug into it.',
      core: { label: 'EKLINK', sub: 'CENTRAL SUN · AUTH', github: 'https://github.com/Yashkhadgi/EkLink' },
      orbits: [
        { id: 'c-eklink', name: 'EkLink Unified Apps', a: 280, b: 155, rot: -8, period: 75, dir: 1, color: '#ffd166', zAmp: 35, phase: 0, dashed: false, tag: '' }
      ],
      nodes: [
        {
          id: 'templateos', title: 'TemplateOS', sub: 'Templates & Documents', orbit: 'c-eklink', icon: 'description',
          tier: 'medium', rank: 16, accent: 'primary', tags: [],
          category: 'EKLINK ECOSYSTEM · APPLICATION 1',
          status: 'Under development', role: 'EkLink ecosystem · application 1',
          recognition: 'Part of the EkLink unified portal',
          stack: ['Stack to be confirmed'], github: null,
          metrics: 'Reusable document & report templates • consistent institutional documents • saved outputs'
        },
        {
          id: 'approveit', title: 'ApproveIt', sub: 'Approvals & Tracking', orbit: 'c-eklink', icon: 'fact_check',
          tier: 'medium', rank: 17, accent: 'secondary', tags: [],
          category: 'EKLINK ECOSYSTEM · APPLICATION 2',
          status: 'Under development', role: 'EkLink ecosystem · application 2',
          recognition: 'Part of the EkLink unified portal',
          stack: ['Stack to be confirmed'], github: null,
          metrics: 'Multi-stage approval flows • request tracking • sign-off interactions'
        },
        {
          id: 'slotit', title: 'SlotIt', sub: 'Spaces & Bookings', orbit: 'c-eklink', icon: 'event_seat',
          tier: 'medium', rank: 18, accent: 'tertiary', tags: [],
          category: 'EKLINK ECOSYSTEM · APPLICATION 3',
          status: 'Under development', role: 'EkLink ecosystem · application 3',
          recognition: 'Part of the EkLink unified portal',
          stack: ['Stack to be confirmed'], github: null,
          metrics: 'Classroom / lab booking • availability check • conflict prevention'
        },
        {
          id: 'attendie', title: 'Attendie', sub: 'Attendance Requests & Events', orbit: 'c-eklink', icon: 'how_to_reg',
          tier: 'medium', rank: 19, accent: 'secondary', tags: [],
          category: 'EKLINK ECOSYSTEM · APPLICATION 4',
          status: 'Under development', role: 'EkLink ecosystem · application 4',
          recognition: 'Part of the EkLink unified portal',
          stack: ['Stack to be confirmed'],
          github: 'https://github.com/Yashkhadgi/attendie',
          metrics: 'Attendance-related requests • event-associated workflows • request records (not a biometric attendance system)'
        }
      ],
      plannedLinks: [
        ['templateos', 'approveit'],
        ['slotit', 'approveit']
      ]
    }
  };

  // ── LEGEND CONFIGS ──
  const LEGENDS = {
    main: [
      { color: '#b8a4f8', size: 12, label: 'Orbit 1 · Flagship Systems' },
      { color: '#cac4d2', size: 10, label: 'Orbit 2 · Satellites & Micro-apps' },
      { color: '#62dcad', size:  8, label: 'Orbit 3 · Research & Patents' },
      { color: '#8bd5ff', size: 12, label: 'Shooting Star · EkLink Portal', isStar: true }
    ],
    child: [
      { color: '#ffd166', size: 12, label: 'Central Sun · EkLink (Auth Core)', isSun: true },
      { color: '#8bd5ff', size: 10, label: 'Planets · 4 Unified Apps' },
      { color: '#cac4d2', size:  8, label: 'Planetary Orbit · Synchronized Path', dashed: true }
    ]
  };

  // ── ACCENT → CSS CLASS MAP ──
  const ACCENT_CLASSES = {
    primary:    { bg: 'bg-primary-container/20',  text: 'text-primary',    dot: 'bg-primary' },
    secondary:  { bg: 'bg-secondary/20',           text: 'text-secondary',  dot: 'bg-secondary' },
    tertiary:   { bg: 'bg-tertiary-container/20',  text: 'text-tertiary',   dot: 'bg-tertiary' },
    'on-surface': { bg: 'bg-surface-variant',      text: 'text-on-surface', dot: 'bg-on-surface-variant' }
  };

  // ── VALIDATOR (dev only — logs warnings, never crashes prod) ──
  function validate() {
    const orbitIds = new Set(ORBITS.map(o => o.id));
    const tagKeys = new Set(Object.keys(TAGS));
    const tierKeys = new Set(Object.keys(TIERS));
    const issues = [];

    PROJECTS.forEach(p => {
      if (p.orbit && !orbitIds.has(p.orbit)) issues.push(`Project "${p.id}": orbit "${p.orbit}" not found`);
      if (!tierKeys.has(p.tier))  issues.push(`Project "${p.id}": tier "${p.tier}" unknown`);
      p.tags.forEach(t => {
        if (!tagKeys.has(t)) issues.push(`Project "${p.id}": tag "${t}" not in taxonomy`);
      });
    });

    Object.entries(CHILD_SYSTEMS).forEach(([key, sys]) => {
      const childOrbitIds = new Set(sys.orbits.map(o => o.id));
      sys.nodes.forEach(n => {
        if (!childOrbitIds.has(n.orbit)) issues.push(`Child node "${n.id}" in "${key}": orbit "${n.orbit}" not found`);
      });
    });

    if (issues.length) {
      console.warn('[UNIVERSE DATA] Validation issues:\n' + issues.join('\n'));
    }
    return issues;
  }

  // Run validator in dev
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    validate();
  }

  // ── EXPORT ──
  window.UNIVERSE_DATA = {
    TAGS, TIERS, ORBITS, PROJECTS, CHILD_SYSTEMS, LEGENDS, ACCENT_CLASSES, validate
  };
})();
