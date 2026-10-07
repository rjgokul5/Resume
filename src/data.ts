export const profile = {
  name: 'Gokul RJ',
  role: 'Lead XR Engineer',
  email: 'rjtecgokul@gmail.com',
  location: 'Thiruvananthapuram, India',
  resume: 'Gokul_RJ_CV.pdf',
  links: {
    linkedin: 'https://www.linkedin.com/in/gokul-r-j-668113151/',
    artstation: 'https://www.artstation.com/rjgokul',
    portfolio: 'https://youtube.com/playlist?list=PLJxM4p-Rw2xSgex7pABQ1YyINEEa9Eoll',
  },
};

export type Project = {
  id: string;
  name: string;
  category: string;
  role: string;
  description: string;
  details: string;
  technologies: string[];
  platform: string;
  kind: 'forklift' | 'city' | 'rehab' | 'space' | 'clinical' | 'pipeline' | 'engine';
  accent: string;
  featured: boolean;
  // Add paths under public/projects/ when real media becomes available.
  image?: string;
  imageAlt?: string;
  videoUrl?: string;
};

export const projects: Project[] = [
  {
    id: 'nexus', name: 'Virtual Forklift', category: 'IMMERSIVE TRAINING', role: 'Lead Engineer',
    description: 'Turning real-world operations into hands-on virtual training.',
    details: 'Led architecture, feature implementation, team coordination, and code reviews for Nexus, a VR forklift training platform. Built scoring, custom-controller and steering-wheel input, alongside a portal for licenses, users, and training progress.',
    technologies: ['Unity', 'OpenXR', 'VIVEPORT SDK'], platform: 'HTC Vive Focus 3 · SteamVR · Windows',
    kind: 'forklift', accent: '#dabb77', featured: true,
  },
  {
    id: 'harbour', name: 'Harbour Digital Twin', category: 'REAL-TIME VISUALIZATION', role: 'Unreal Developer',
    description: 'Bringing complex city data into an interactive, browser-accessible world.',
    details: 'Integrated BIM models through Datasmith, enhanced city visualization with Nanite, and implemented Pixel Streaming for browser access to server-hosted Unreal Engine builds.',
    technologies: ['Unreal Engine', 'Datasmith', 'Nanite', 'Pixel Streaming'], platform: 'Web · Server-hosted Unreal Engine',
    kind: 'city', accent: '#83e9de', featured: true,
  },
  {
    id: 'ulysses', name: 'Neuromersiv · Ulysses', category: 'HEALTHCARE & REHABILITATION', role: 'Lead Engineer',
    description: 'Building everyday confidence through guided immersive experiences.',
    details: 'Led architecture and feature development for VR-assisted life-skills rehabilitation. Combined everyday task scenarios, hand-tracked interactions, scoring, rewards, and guided activities.',
    technologies: ['Unity', 'Flutter', 'Hand Tracking'], platform: 'Meta Quest · Web',
    kind: 'rehab', accent: '#b6a0e8', featured: true,
  },
  {
    id: 'meta-space', name: 'Meta Reality Space', category: 'COLLABORATIVE XR', role: 'Senior Unity Developer',
    description: 'Shared virtual spaces where people can create and connect.',
    details: 'Led architecture and feature development for customizable virtual spaces with multi-user access, avatars, real-time asset modification, hand interactions, and voice communication.',
    technologies: ['Unity', 'Socket.IO', 'Multi-user XR'], platform: 'Meta Quest',
    kind: 'space', accent: '#8eaee8', featured: true,
  },
  {
    id: 'clinical', name: 'VR Clinical Training', category: 'CLINICAL SIMULATION', role: 'Lead Engineer',
    description: 'Interactive emergency airway-management training.',
    details: 'Led engineering for emergency airway-management training with interactive equipment, guided procedures, and tracking of user actions, response times, and technique effectiveness.',
    technologies: ['Unity', 'VR Interaction'], platform: 'Meta Quest', kind: 'clinical', accent: '#83e9de', featured: false,
  },
  {
    id: 'pipeline', name: 'Gas Pipeline Repair VR', category: 'INDUSTRIAL TRAINING', role: 'Lead Engineer',
    description: 'Hands-on underwater pipeline repair in virtual reality.',
    details: 'Led architecture, feature implementation, and code reviews for underwater pipeline-repair training, including hand-tracked welding and fastening interactions with voice guidance.',
    technologies: ['Unity', 'Blender', 'Substance Painter'], platform: 'Meta Quest', kind: 'pipeline', accent: '#8eaee8', featured: false,
  },
  {
    id: 'engine', name: 'MiG-29K Engine Training', category: 'AUGMENTED REALITY', role: 'Senior Unity Developer',
    description: 'Exploring complex engine systems through augmented reality.',
    details: 'Developed an Indian Navy AR training application for the RD-33MK engine. Built part exploration, scaling, rotation, dismantling, and reassembly, with audio narration, subtitles, and Android device testing.',
    technologies: ['Unity', 'Vuforia SDK'], platform: 'Android', kind: 'engine', accent: '#dabb77', featured: false,
  },
];

export const experience = [
  { period: 'JUN 2026 — PRESENT', title: 'Consultant AR Developer', company: 'AIONOS India', summary: 'Developing AR experiences for HoloSports, an athlete-training platform supporting immersive practice and coach collaboration. Integrating AI models through APIs and Agora video calling.' },
  { period: 'JAN 2021 — DEC 2025', title: 'Lead Engineer · Software Systems', company: 'Travancore Analytics', summary: 'Led architecture, development, code reviews, and engineering teams across industrial training, healthcare rehabilitation, collaborative XR, and Unreal Engine digital twins.' },
  { period: 'SEP 2017 — OCT 2020', title: 'Game Developer / Trainer', company: 'Toonz Media Group', summary: 'Combined hands-on game development with a training role.' },
];

export const skillGroups = [
  { title: 'Real-time development', items: ['Unity · C#', 'Unreal Engine · C++ & Blueprint', 'Software architecture', 'Scene & asset optimization'] },
  { title: 'Immersive platforms', items: ['OpenXR', 'Meta XR · Wave XR', 'ARCore · ARKit · Vuforia', 'SceneView · RealityKit'] },
  { title: '3D production', items: ['Blender', 'Autodesk Maya', 'Substance Painter', 'BIM · Datasmith'] },
  { title: 'Engineering leadership', items: ['Team coordination', 'Code reviews', 'Project management', 'Customer communication'] },
];
