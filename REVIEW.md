# Portfolio review — 7 October 2026

The initial review covered the source, CV content, visual layout, browser behavior, accessibility, bundle output, dependencies, print styles, and GitHub Pages configuration. At that point, the site was local and unpublished; the subsequent deployment and landscape review are recorded below.

## Desktop landscape follow-up

After the initial review, GitHub Pages was switched to the build workflow and the site was published. A further review in response to the user's Chrome/QHD feedback found that the 1240px content cap left too much empty space on wide monitors, the fixed hero height pushed important controls below shorter laptop windows, and stacked dialogs wasted desktop width.

The desktop layout now grows to 1760px with shared header/content alignment, larger QHD typography and scene sizing, height-aware spacing for shorter windows, and side-by-side project dialogs. The dialog close control remains available when its content scrolls. Mobile and enlarged-text layouts remain covered by the regression suite.

Verified with separate automated sessions in the installed Chrome and Microsoft Edge browsers at 1024×600, 1280×720, 1366×640, 1440×900, 1536×730, 1920×900, 2048×1050, 2560×1320, and 3440×1440. These are browser-content viewport sizes, including representative QHD desktop and display-scaled layouts. The complete production-build regression suite now has **16 passing tests**. Testing in Safari/Firefox and physical mobile devices remains separate.

## Assessment

The design has a coherent XR identity, clear hierarchy, useful project summaries, and a restrained interactive hero. The implementation is ready for continued content review. No blocking defect remains in the browser behaviors covered by this review. Real project media is the largest remaining improvement to the portfolio's credibility.

## Findings addressed

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | Enlarging text to 200% caused horizontal overflow, including on narrow phones and tablets. | Allowed grid children to shrink, long words and metadata to wrap, adjusted the tablet breakpoint, and removed decorative overflow. Tested at 320, 390, 768, 1024, and 1440 pixels, including dialogs. |
| High | Eight project/skill metadata labels failed automated contrast checks. | Increased their contrast. Automated WCAG A/AA checks now report zero violations on the desktop page, mobile menu, and open project dialog. |
| Medium | Opening a project repeated its SVG pattern ID in the document. | Generated IDs per component instance with React `useId`; verified no duplicates with a dialog open. |
| Medium | Static fallback retained live interaction instructions and controls; runtime WebGL context loss was not explicitly handled. | Added renderer readiness/failure handling, accurate loading/static labels, and removal of ineffective controls. Tested initial WebGL failure and actual context loss. |
| Medium | Keyboard users could leave the dialog's control cycle; navigation destinations were not consistently focusable. | Added first/last control focus wrapping and focusable section destinations. Verified skip link, mobile menu Escape, destination focus, and dialog focus behavior. |
| Medium | Returning to the hero could retain the previous navigation highlight. | Included the hero and toolkit in section observation; verified the highlight clears at the hero. |
| Medium | Vertical touch scrolling over the scene depended on interaction-library styles. | Explicitly preserved vertical panning on the canvas and wrapper, kept horizontal drag interaction, and verified both with real browser input events. |
| Medium | Visitors without JavaScript had only an unlinked explanatory message. | Added a readable resume summary, functional PDF download, contact link, and portfolio links. Verified under the repository path with JavaScript disabled. |
| Low | A future invalid screenshot path could display a broken image. | Added a fallback to the project's abstract illustration when an image fails to load. |
| Low | Font loading required a CSS import discovery step. | Moved the font stylesheet into the document head and added connection hints. System-font fallbacks remain. |
| Low | Print output carried unnecessary presentation content and light metadata. | Reduced decorative content and spacing, corrected print contrast and stacking, and preserved resume/contact content. |

3D animation also pauses while a project dialog is open, in addition to the existing offscreen, hidden-tab, user-pause, and reduced-motion behavior.

## Validation

- Production TypeScript check and Vite build: passed.
- Chromium browser suite: **13 tests passed** against the production build served under `/Resume/`.
- Automated accessibility: zero detected violations in the three checked states using WCAG A/AA tags, including contrast.
- Normal responsive layouts and 200% text enlargement: checked across phone, tablet, and desktop widths.
- Keyboard, native dialog dismissal/focus restoration, additional projects, navigation, 3D dragging, touch scrolling, reduced motion, and both WebGL failure modes: passed.
- CV: served as a real PDF under `/Resume/`; SHA-256 matches the supplied original.
- Internal anchor destinations: no missing targets found.
- Dependency audit: zero known vulnerabilities reported at review time.
- Print output: generated and visually inspected as a three-page white-background document; verified that the name and email are included and the footer no longer creates an extra page.

Automated accessibility checks are not a complete accessibility certification. Browser automation used Chromium on this Windows machine; physical-device behavior and Safari/Firefox remain separate release checks.

## Performance

| Production asset | Minified size | Gzip estimate |
| --- | --- | --- |
| Main JavaScript | 254.21 kB | 79.82 kB |
| Deferred 3D scene and dependencies | 928.32 kB | 246.41 kB |
| CSS | 20.72 kB | 5.32 kB |

The 3D chunk is the main transfer and runtime cost. It loads separately from the main application, so the text interface does not depend on the scene succeeding. The renderer caps pixel density and pauses unnecessary animation. Its size warning is still visible during builds; it has not been hidden. The icon library also emits non-blocking `use client` bundling warnings in this client-only application.

These sizes are build estimates, not field performance measurements or a Lighthouse score. Real loading speed depends on hosting compression, connection speed, font loading, and the visitor's GPU. Check a physical phone and a slower connection before public launch. Google Fonts remains an external dependency for the selected typography; the page uses system fonts when unavailable.

## Content and design

- Experience dates, roles, skills, education, and project contributions were compared with the CV; no invented achievement metrics or active certification claims were added.
- The 2018–2020 Unity certification retains its dates.
- Four featured projects and three additional projects cover the main CV work; dialogs currently lead to the general playlist where individual videos are unavailable.
- The illustrations are visibly labeled as abstract, rather than presented as screenshots of completed work.
- The hero, page hierarchy, cyan palette, project grid, timeline, and contact section were inspected in desktop/mobile screenshots.
- Real screenshots, individual demo links, and substantiated outcomes would substantially strengthen the project section.
- Metadata and the favicon are present. The complete portfolio remains client-rendered; the no-JavaScript summary is a fallback, not full static prerendering. Full prerendering can be considered if broader crawler compatibility becomes a priority.

## Remaining release items

1. Replace abstract project illustrations with the real media when provided, and connect individual demonstration links.
2. The downloadable PDF is the original supplied CV and includes the full residential address and phone number. Decide whether to provide a public edition before publishing; the webpage itself shows email and city only.
3. Verify the external LinkedIn, ArtStation, and YouTube pages manually. The URLs match the CV, but automated web retrieval could not confirm their contents during this review; this does not establish that those links are broken.
4. Test a physical Android/iOS device and Safari/Firefox, including mobile GPU behavior and downloaded PDFs.
5. Enable GitHub Pages with GitHub Actions and validate the first real deployment. The workflow targets the existing `Master` branch, the build works under the repository path, and the same static output can move to a future server. No remote deployment was executed.

## Reproduce the checks

```sh
npm ci
npm run build
npx playwright install chromium
npx playwright test
npm audit
```

Use `npm.cmd` / `npx.cmd` in Windows PowerShell when script execution is disabled.
