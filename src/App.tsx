import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Box, Code2, Download, ExternalLink, Layers3, Mail, Menu, Move, Pause, Play, X } from 'lucide-react';
import { experience, profile, projects, skillGroups, type Project } from './data';
import ProjectArt from './ProjectArt';

const Scene = lazy(() => import('./Scene'));
const sections = ['about', 'projects', 'experience', 'contact'];

function CoreFallback() {
  return <div className="core-fallback" aria-hidden="true"><svg viewBox="0 0 400 400" fill="none"><g stroke="#83e9de"><ellipse cx="200" cy="200" rx="150" ry="65" transform="rotate(-30 200 200)" opacity=".65" /><ellipse cx="200" cy="200" rx="150" ry="65" transform="rotate(40 200 200)" opacity=".35" /><path d="m200 105 85 50v95l-85 50-85-50v-95zM115 155l85 50 85-50M200 205v95M200 105v100" opacity=".8" /></g></svg></div>;
}

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? <CoreFallback /> : this.props.children; }
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog) return;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = oldOverflow; };
  }, [project]);
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={onClose} onKeyDown={e => {
    if (e.key !== 'Tab') return;
    const controls = [...e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]')].filter(node => node.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }} onClick={(e) => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose();
  }}>
    {project && <>
      <button className="dialog-close icon-button" onClick={onClose} aria-label="Close project"><X size={22} /></button>
      <ProjectArt project={project} />
      <div className="dialog-content"><span className="eyebrow">{project.category}</span><h2 id="project-dialog-title">{project.name}</h2><p className="dialog-role">{project.role}</p><p>{project.details}</p><div className="tags">{project.technologies.map(t => <span key={t}>{t}</span>)}</div><p className="platform"><Box size={16} />{project.platform}</p>
        <a className="button button-primary" href={project.videoUrl || profile.links.portfolio} target="_blank" rel="noreferrer"><Play size={16} />{project.videoUrl ? 'Watch project video' : 'Explore portfolio playlist'}<ExternalLink size={15} /></a>
      </div>
    </>}
  </dialog>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneFailure = useCallback(() => setSceneFailed(true), []);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  const sceneRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const animate = !paused && !reduced && sceneVisible && tabVisible && !project && !sceneFailed;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    const visibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    const sceneObserver = new IntersectionObserver(([entry]) => setSceneVisible(entry.isIntersecting));
    if (sceneRef.current) sceneObserver.observe(sceneRef.current);
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-15% 0px -55% 0px' });
    ['home', ...sections, 'toolkit'].forEach(id => {
      const section = document.getElementById(id);
      if (section) { section.tabIndex = -1; sectionObserver.observe(section); }
    });
    return () => { media.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); sceneObserver.disconnect(); sectionObserver.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    const desktop = window.matchMedia('(min-width: 901px)');
    const resize = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', escape);
    desktop.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', escape); desktop.removeEventListener('change', resize); };
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header"><div className="header-inner">
      <a href="#home" className="wordmark" aria-label="Gokul RJ home">gokul<span>.</span><span className="wordmark-rj">rj</span></a>
      <nav id="main-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">{sections.map(section => <a key={section} href={`#${section}`} aria-current={active === section ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{section[0].toUpperCase() + section.slice(1)}</a>)}</nav>
      <a className="header-cv" href={`${import.meta.env.BASE_URL}${profile.resume}`} download><Download size={16} /><span>Download CV</span></a>
      <button ref={menuButton} className="menu-toggle icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </div></header>

    <main id="main" tabIndex={-1}>
      <section className="hero container" id="home" tabIndex={-1} aria-labelledby="hero-title">
        <div className="hero-copy"><div className="hero-label"><span className="tiny-cross">+</span> ENGINEERING IMMERSIVE EXPERIENCES</div>
          <p className="hero-name">Hello, I’m {profile.name}.</p>
          <h1 id="hero-title">Building worlds.<br />Creating <span>possibilities.</span></h1>
          <p className="hero-role">{profile.role} <span>/</span> Unity & Unreal Engine</p>
          <p className="hero-description">I turn complex ideas into immersive training, digital twins, and real-time experiences. From the first prototype to the world people step into.</p>
          <div className="hero-actions"><a href="#projects" className="button button-primary">Explore my work<ArrowDown size={17} /></a><a href={profile.links.portfolio} className="button button-quiet" target="_blank" rel="noreferrer"><Play size={16} />Watch portfolio</a></div>
          <div className="hero-facts"><div><strong>8+</strong><span>Years of experience</span></div><div><strong>Unity <span>&</span> Unreal</strong><span>Real-time expertise</span></div><div><strong>AR <span>/</span> VR <span>/</span> XR</strong><span>Beyond the screen</span></div></div>
        </div>
        <div className="hero-visual" ref={sceneRef}>
          <div className="scene-top"><span><span className="tiny-cross">+</span> SPATIAL EXPLORATION</span><span>01 / {sceneFailed ? 'STATIC' : sceneReady ? 'LIVE' : 'LOADING'}</span></div>
          <div className="scene-canvas" role="img" aria-label={sceneFailed ? 'Static diagram of a geometric core surrounded by orbital rings.' : 'Interactive 3D geometric core surrounded by orbital rings. Drag horizontally to rotate; all resume content is available outside this scene.'}>{sceneFailed ? <CoreFallback /> : <SceneBoundary onFailure={handleSceneFailure}><Suspense fallback={<CoreFallback />}><Scene animate={animate} onReady={handleSceneReady} onFailure={handleSceneFailure} /></Suspense></SceneBoundary>}</div>
          <div className="scene-bottom"><span>{sceneFailed ? <Box size={14} /> : <Move size={14} />}{sceneFailed ? 'Static preview' : sceneReady ? 'Drag sideways to explore' : 'Preparing 3D preview'}</span>{!sceneFailed && <button className="motion-button" aria-pressed={paused || reduced} disabled={reduced || !sceneReady} onClick={() => setPaused(!paused)}>{paused || reduced ? <Play size={13} /> : <Pause size={13} />}{reduced ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion'}</button>}</div>
          <div className="scene-tag"><span className="tag-line" /> REAL-TIME. REAL POSSIBILITIES.</div>
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO DISCOVER</span><ArrowDown size={16} /></a>
      </section>

      <div className="discipline-strip"><div className="container"><span>IMMERSIVE TRAINING</span><span className="strip-plus">+</span><span>DIGITAL TWINS</span><span className="strip-plus">+</span><span>INTERACTIVE EXPERIENCES</span><span className="strip-plus">+</span><span>ENGINEERING LEADERSHIP</span></div></div>

      <section className="section container about" id="about" tabIndex={-1} aria-labelledby="about-title">
        <div className="section-marker"><span>01 / ABOUT</span><span className="marker-line" /></div>
        <div className="about-grid"><div><h2 id="about-title">An engineer’s mindset.<br /><span className="muted-heading">A creator’s perspective.</span></h2><p className="about-location">BASED IN {profile.location.toUpperCase()}</p></div><div className="about-copy"><p>I’m an XR engineer who connects software architecture with hands-on development. Over 8+ years, I’ve built experiences that help people train, recover, collaborate, and understand complex systems.</p><p>My work spans industrial simulations, healthcare rehabilitation, digital twins, and athlete training. I lead teams, review code, optimize real-time scenes, and stay close to the details that make an experience feel right.</p><a className="text-link" href={profile.links.linkedin} target="_blank" rel="noreferrer">More about my journey<ArrowUpRight size={17} /></a></div></div>
        <div className="expertise-row"><div><Box /><h3>Immersive by design</h3><p>Purposeful AR and VR interactions grounded in real-world use.</p></div><div><Code2 /><h3>Built to perform</h3><p>Thoughtful architecture, optimized assets, and reliable real-time systems.</p></div><div><Layers3 /><h3>Led with clarity</h3><p>Hands-on delivery, code reviews, and coordinated engineering teams.</p></div></div>
      </section>

      <section className="section container projects" id="projects" tabIndex={-1} aria-labelledby="projects-title">
        <div className="section-marker"><span>02 / SELECTED WORK</span><span className="marker-line" /></div>
        <div className="section-heading"><div><h2 id="projects-title">Ideas made <span className="muted-heading">immersive.</span></h2><p>A selection of worlds I’ve helped bring to life.</p></div><a className="text-link" href={profile.links.portfolio} target="_blank" rel="noreferrer">Video portfolio<ArrowUpRight size={17} /></a></div>
        <div className="project-grid">{projects.filter(p => p.featured).map((p, i) => <article className="project-card" key={p.id}><button className="project-art-button" onClick={() => setProject(p)} aria-label={`View ${p.name} project details`}><ProjectArt project={p} /><span className="project-open"><ArrowUpRight size={22} /></span></button><div className="project-card-body"><div className="project-meta"><span>{p.category}</span><span>0{i + 1}</span></div><h3><button onClick={() => setProject(p)}>{p.name}</button></h3><p>{p.description}</p><div className="project-card-foot"><div className="tags">{p.technologies.slice(0, 2).map(t => <span key={t}>{t}</span>)}</div><span>{p.role}</span></div></div></article>)}</div>
        <div className="more-work"><button className="button button-outline" aria-expanded={showMore} aria-controls="additional-projects" onClick={() => setShowMore(!showMore)}>{showMore ? 'Show less' : 'More projects'}<span aria-hidden="true">{showMore ? '−' : '+'}</span></button><div id="additional-projects" hidden={!showMore}>{projects.filter(p => !p.featured).map(p => <button className="additional-project" key={p.id} onClick={() => setProject(p)}><span><span className="eyebrow">{p.category}</span><strong>{p.name}</strong></span><span className="additional-tech">{p.technologies.join(' / ')}</span><ArrowUpRight size={20} /></button>)}<p className="additional-note">Additional work includes flight-simulator environments, virtual showrooms, circuit-board training, and game prototypes.</p></div></div>
      </section>

      <section className="section container experience" id="experience" aria-labelledby="experience-title"><div className="section-marker"><span>03 / EXPERIENCE</span><span className="marker-line" /></div><div className="experience-grid"><div className="experience-intro"><h2 id="experience-title">A career in<br /><span className="muted-heading">making it real.</span></h2><p>From game development to leading engineering teams and building immersive systems.</p><a className="text-link" href={`${import.meta.env.BASE_URL}${profile.resume}`} download>Download full CV<Download size={16} /></a></div><div className="timeline">{experience.map((job, i) => <article className="timeline-item" key={job.company}><span className={`timeline-node ${i === 0 ? 'current-node' : ''}`} /><span className="eyebrow">{job.period}</span><h3>{job.title}</h3><p className="company">{job.company}{i === 0 && <span className="current-label">CURRENT</span>}</p><p>{job.summary}</p></article>)}</div></div></section>

      <section className="section container toolkit" aria-labelledby="toolkit-title"><div className="section-marker"><span>04 / TOOLKIT</span><span className="marker-line" /></div><h2 id="toolkit-title">The tools behind <span className="muted-heading">the worlds.</span></h2><div className="skills-grid">{skillGroups.map((group, i) => <div className="skill-group" key={group.title}><span className="skill-number">0{i + 1}</span><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div><div className="education-row"><div><span className="eyebrow">EDUCATION</span><h3>B.E. Computer Science & Engineering</h3><p>Narayanaguru College of Engineering · 2012–2016</p></div><div><span className="eyebrow">FOUNDATIONS</span><h3>Unity Game Development Training</h3><p>Smartway Solutions · 2016–2017</p></div><div><span className="eyebrow">CERTIFICATION</span><h3>Unity Certified Developer</h3><p>Jan 2018 – Jan 2020</p></div></div></section>

      <section className="contact" id="contact" aria-labelledby="contact-title"><div className="container"><div className="section-marker"><span>05 / WHAT’S NEXT</span><span className="marker-line" /></div><div className="contact-grid"><div><h2 id="contact-title">Have a world<br />in <span>mind?</span></h2><p>Let’s talk about your next immersive experience.</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={26} /></a></div><div className="contact-links"><a href={`mailto:${profile.email}`}><Mail size={19} /><span>Get in touch</span><ArrowUpRight size={18} /></a><a href={profile.links.linkedin} target="_blank" rel="noreferrer"><span className="social-symbol">in</span><span>LinkedIn</span><ArrowUpRight size={18} /></a><a href={profile.links.artstation} target="_blank" rel="noreferrer"><Layers3 size={19} /><span>ArtStation</span><ArrowUpRight size={18} /></a><a href={profile.links.portfolio} target="_blank" rel="noreferrer"><Play size={19} /><span>YouTube portfolio</span><ArrowUpRight size={18} /></a></div></div></div></section>
    </main>
    <footer className="container footer"><a href="#home" className="wordmark">gokul<span>.</span><span className="wordmark-rj">rj</span></a><p>© {new Date().getFullYear()} {profile.name}</p><a href="#home">Back to top<ArrowUpRight size={16} /></a></footer>
    <ProjectDialog project={project} onClose={() => setProject(null)} />
  </>;
}
