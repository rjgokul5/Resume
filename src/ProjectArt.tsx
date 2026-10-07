import { useId, useState } from 'react';
import type { Project } from './data';

// Abstract technical diagrams, replaced by actual project media when supplied.
export default function ProjectArt({ project }: { project: Project }) {
  const gridId = `grid-${useId().replace(/:/g, '')}`;
  const [failedImage, setFailedImage] = useState<string>();
  if (project.image && failedImage !== project.image) return <img className="project-image" src={`${import.meta.env.BASE_URL}${project.image}`} alt={project.imageAlt || project.name} loading="lazy" onError={() => setFailedImage(project.image)} />;
  const city = project.kind === 'city';
  const space = project.kind === 'space';
  return <div className={`project-art art-${project.kind}`} style={{ '--art-accent': project.accent } as React.CSSProperties} aria-hidden="true">
    <span className="art-coordinate">{city ? 'BIM / REAL-TIME' : space ? 'MULTI-USER / XR' : project.kind === 'rehab' ? 'INTERACTION / VR' : 'SIMULATION / XR'}</span>
    <svg viewBox="0 0 600 310" fill="none">
      <defs><pattern id={gridId} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" stroke="currentColor" opacity=".1" /></pattern></defs>
      <rect width="600" height="310" fill={`url(#${gridId})`} />
      <g transform="translate(300 165)">
        <path d="M-205 25 0-90 205 25 0 140Z" stroke="currentColor" opacity=".25" />
        <path d="M-160 50 45-65M-110 78 95-37M-60 106 145-9M-155-3 50 112M-105-31 100 84M-55-59 150 56" stroke="currentColor" opacity=".1" />
        {city ? Array.from({ length: 11 }, (_, i) => {
          const x = (i % 4 - 1.5) * 60 + Math.floor(i / 4) * 20;
          const y = Math.floor(i / 4) * 33 - 10;
          const h = 35 + i % 4 * 22;
          return <g key={i} transform={`translate(${x} ${y})`}><path d={`M-20 0 0 11 20 0V-${h}L0-${h + 11} -20-${h}Z`} fill="currentColor" fillOpacity=".07" stroke="currentColor" opacity=".65" /><path d={`M0 11V-${h - 11}L20-${h}M0-${h - 11} -20-${h}`} stroke="currentColor" opacity=".35" /></g>;
        }) : project.kind === 'forklift' ? <g transform="translate(-5 4)">
          <path d="M-95 8-30-29 55 19-10 56Z M-95 8V-36L-30-73 55-25V19 M-95-36-10 12 55-25M-10 12V56" stroke="currentColor" fill="currentColor" fillOpacity=".05" />
          <path d="M-55-50V-114L-1-145 43-120V-35M-55-114-9-87 43-120M-9-87V-24M55-25V-125L70-133V35L117 62 140 49M70 35 93 22 140 49" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="-66" cy="18" rx="15" ry="21" transform="rotate(-25 -66 18)" stroke="currentColor" strokeWidth="3" /><ellipse cx="17" cy="49" rx="15" ry="21" transform="rotate(-25 17 49)" stroke="currentColor" strokeWidth="3" />
          <path d="M105 12 149-13 185 7 141 32ZM105 12V-23L149-48 185-28V7M105-23 141-3 185-28M141-3V32" stroke="currentColor" opacity=".5" />
        </g> : space ? <g>
          <path d="M-115 50V-85L0-150 115-85V50L0 115ZM-115-85 0-20 115-85M0-20V115" stroke="currentColor" opacity=".6" />
          {[-62, 0, 62].map((x, i) => <g transform={`translate(${x} ${i === 1 ? 25 : -5})`} key={x}><ellipse cy="-28" rx="12" ry="16" stroke="currentColor" /><path d="M-20 30V5Q-20-10 0-10T20 5V30M-30 36Q0 53 30 36" stroke="currentColor" /><ellipse cy="38" rx="32" ry="13" stroke="currentColor" opacity=".3" /></g>)}
        </g> : <g>
          <path d="M-110 24-15-30 90 29-5 83ZM-110 24V-9L-15-63 90-4V29M-110-9-5 50 90-4M-5 50V83" stroke="currentColor" opacity=".5" />
          <path d="M-42-16V-78L0-102 42-78V-16L0 8ZM-42-78 0-54 42-78M0-54V8" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity=".05" />
          <circle cx="0" cy="-115" r="53" stroke="currentColor" strokeDasharray="3 9" opacity=".5" /><path d="m85-98 10-17 10 17-10 17Z M-92-42-82-59-72-42-82-25Z" stroke="currentColor" />
        </g>}
      </g>
    </svg>
    <span className="art-caption">ABSTRACT PROJECT ILLUSTRATION</span><span className="art-index">0{['forklift', 'city', 'rehab', 'space', 'clinical', 'pipeline', 'engine'].indexOf(project.kind) + 1}</span>
  </div>;
}
