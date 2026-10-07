# Gokul RJ — XR portfolio

A responsive, single-page CV and portfolio built with React, TypeScript, Vite, and React Three Fiber. Includes an interactive 3D core, accessible project dialogs, career timeline, PDF download, print styles, and reduced-motion support. The 3D animation pauses when offscreen or the tab is hidden and falls back to a static diagram if WebGL fails.

## Local development

Use Node.js 22.12+ and npm. On Windows PowerShell, use `npm.cmd` if script execution is disabled.

```sh
npm ci
npm run dev
```

Open the localhost URL shown in the terminal.

```sh
npm run build
npm run preview
```

## Content and media

- Edit `src/data.ts` for your profile, experience, skills, project descriptions, and links.
- The supplied CV is at `public/Gokul_RJ_CV.pdf`; replace it to update downloads. The PDF is the supplied original, including its contact details.
- Project illustrations are explicitly labeled abstract diagrams, not screenshots of delivered projects.
- Add real screenshots to `public/projects/`, then set each project's `image` to a relative path such as `projects/nexus.webp` and supply a descriptive `imageAlt`.
- Add `videoUrl` to link a project to its own demonstration. Until then, dialogs link to the general portfolio playlist.
- Use compressed WebP/AVIF screenshots where possible. No backend or environment secrets are required.
- Fonts load from Google Fonts, with local system fallbacks when unavailable. The site works without that external font service.
- Public page contact details show only email and city, not the full residential address.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys pushes to this repository's existing `Master` branch. In GitHub, select **Settings → Pages → Source → GitHub Actions** before deploying. Push or run the workflow manually after configuration. The expected project URL is `https://rjgokul5.github.io/Resume/` once deployment succeeds.

Vite uses relative asset paths so the same build also works under a custom domain or a future server. Copy the contents of `dist/` to any static web server. Do not use Vite's preview server as your public production server.

## Browser verification

```sh
npx playwright install chromium
npx playwright test
```

The checks run against the production build, including under `/Resume/`, and cover project dialogs, mobile navigation, reduced motion, CV downloads, and horizontal overflow. Build before running them.

The expanded review checks also cover automated accessibility, 200% text enlargement, keyboard focus, 3D context loss, drag interaction, touch scrolling, and the summary available without JavaScript. See `REVIEW.md` for findings and remaining release checks.

Landscape checks cover shorter laptop windows, QHD and scaled desktop width, and project-dialog controls while scrolling.

After GitHub Pages is configured, pushes to `Master` trigger the deployment workflow.
