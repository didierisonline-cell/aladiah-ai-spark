# Aladiah Mobile UX Audit & Redesign Plan
### Student Experience First — iPhone · Android · iPad · Tablet

**Status:** Plan only — no code written (per directive). Founder development frozen.
**Benchmarks:** Duolingo · Coursera · MasterClass · Apple Fitness
**Scope:** the 7 student surfaces, in priority order.

---

## 0. Executive summary

Aladiah's student experience is, today, a **desktop application rendered on a phone**. The portal surfaces are built with hardcoded pixel grids and `height:100vh; overflow:hidden`, and contain **zero responsive media queries**. The viewport meta tag is correct, but nothing below it adapts. On a 375 px iPhone, the dashboard alone declares **510 px of fixed columns** (`200px … 310px`) before content — guaranteeing horizontal overflow, clipped content, and an unscrollable shell.

**Current mobile readiness (my scoring):**

| Surface | Mobile readiness | Root issue |
|---|:--:|---|
| Global shell / navigation | 🔴 15% | Sidebar never collapses; no bottom tab bar; no safe-area insets |
| Student dashboard | 🔴 10% | `100vh overflow:hidden` + `grid 200px 1fr 310px`, inner `repeat(5,1fr)` |
| Course experience | 🟠 25% | Fixed `grid 260px 1fr` |
| Lesson experience | 🟠 25% | Fixed `grid 1fr 340px` |
| Simulation experience | 🟠 30% | Always-visible sidebar in `display:flex`; min-320 px cards |
| AI Mentor experience | 🟡 40% | Modal is `width:92% maxWidth:500` (ok) but entry points are desktop-bound |
| Certification experience | 🟠 30% | Fixed widths `220/160`; no mobile layout |

**Verdict:** The platform needs a **mobile-first foundation layer** (navigation shell, responsive primitives, design tokens, safe areas) before per-surface redesigns. The good news: the visual language (dark, premium, gradient, glass) is already strong and on-benchmark with MasterClass/Apple Fitness — we are fixing **layout and interaction**, not reinventing the brand.

---

## 1. Methodology & device/test matrix

Audit performed by static inspection of the shipped student components (file:line evidence cited throughout). Redesign validated against the four benchmarks.

**Target device matrix (Definition of Done must pass all):**

| Class | Device | Logical width | Notes |
|---|---|:--:|---|
| Small phone | iPhone SE / Android compact | 375 px | hardest constraint; safe-area top/bottom |
| Standard phone | iPhone 15 / Pixel 8 | 390–412 px | notch + home indicator |
| Large phone | iPhone 15 Pro Max | 430 px | one-handed reach zones |
| Small tablet | iPad mini / 8" Android | 744–768 px | 2-column unlock |
| Tablet | iPad / iPad Air | 820–1024 px | split-view, landscape |
| Landscape phone | any | ≤ 430 h | video/sim full-bleed |

**Breakpoint system to adopt:**
`xs < 480` (phone) · `sm 480–767` (large phone) · `md 768–1023` (tablet) · `lg ≥ 1024` (desktop, current).

---

## 2. Systemic findings (root causes — fix these first)

| # | Finding | Evidence | Severity | Impact |
|---|---------|----------|:--------:|--------|
| S1 | **No responsive layer in the portal.** Only `Header.tsx` & `Footer.tsx` contain `@media`. Every portal page uses inline pixel styles that bypass Tailwind's responsive utilities. | `grep @media` → 2 files; portal pages = 0 | 🔴 Critical | Nothing adapts below desktop |
| S2 | **Dashboard locked to viewport.** `height:100vh; overflow:hidden` + `grid 200px 1fr 310px`. | `StudentPortal.tsx:440,499` | 🔴 Critical | Content clipped, page can't scroll on mobile |
| S3 | **Sidebar never collapses.** `<PortalSidebar>` renders inside `display:flex` on 11 pages with no width breakpoint or drawer. | `PortalSidebar.tsx` (no `@media`); 11 pages | 🔴 Critical | Squashes content; unusable on phone |
| S4 | **Desktop-only inner grids.** `repeat(5,1fr)` tool/stat rows; `34px 1fr 125px 85px` rows. | `StudentPortal.tsx:697,775,745` | 🔴 Critical | 5 columns on a 375 px screen |
| S5 | **Fixed two-column lesson/course.** `1fr 340px` (lesson), `260px 1fr` (course). | `ChapterView.tsx:491`, `PortalCourseDetail.tsx:64` | 🟠 High | Side rail forces overflow |
| S6 | **No bottom tab navigation.** Mobile-native primary nav pattern absent. | no tabbar component | 🟠 High | Off-benchmark vs all four apps |
| S7 | **No safe-area handling.** No `env(safe-area-inset-*)`; fixed 70 px headers collide with notch/home indicator. | `grep safe-area` → 0 | 🟠 High | Content under notch/indicator |
| S8 | **Touch targets & tap ergonomics unset.** No 44×44 minimum, no `touch-action`, no `-webkit-tap-highlight`, text-selection on buttons. | `grep` → 0 | 🟡 Medium | Mis-taps, web-not-app feel |
| S9 | **Static type scale.** Fixed `px` font sizes everywhere; no fluid/`clamp()` scale. | inline styles | 🟡 Medium | Too large/small per device |
| S10 | **`100vh` bug on mobile browsers.** Should be `100dvh` to handle dynamic toolbars. | `StudentPortal.tsx:440` etc. | 🟡 Medium | Hidden content behind URL bar |

---

## 3. Benchmark teardown → patterns to adopt

| App | What it nails on mobile | Pattern Aladiah will adopt |
|---|---|---|
| **Duolingo** | Bottom tab bar (5), single-column path, huge tap targets, streak/XP, instant feedback, celebratory motion + haptics, ≤1 idea/screen | Bottom tab nav; gamified streak/Talent-Score header; bite-sized lesson stepper; success animations |
| **Coursera** | "Continue learning" hero, video-first lessons, sticky progress, tabbed course home, offline/reading mode | Continue-learning card on dashboard; tabbed course home; sticky lesson progress bar |
| **MasterClass** | Cinematic full-bleed imagery, edge-to-edge video, immersive dark, large display type, horizontal carousels | Keep premium dark brand; full-bleed program/lesson headers; carousels for schools/sims |
| **Apple Fitness** | Ring/metric visualization, large legible numbers, card stacks, full-screen activity, safe-area aware, motivational | Talent-Score "rings", big readable stats, full-screen simulation mode, safe-area shell |

**Design north star:** *Duolingo's navigation & gamification × Apple Fitness's metric clarity × MasterClass's cinematic polish × Coursera's learning ergonomics.*

---

## 4. Per-surface audit & redesign (priority order)

### 4.1 — Mobile UX foundation *(Priority 1 — prerequisite for all others)*

**Current:** none. **Redesign:**

- **Responsive shell** `AppShell`: on `< md`, replace the left `PortalSidebar` + right rails with a single scrollable column + **bottom tab bar**; on `≥ lg`, keep today's desktop layout.
- **Bottom tab bar (mobile):** 5 tabs — **Home · Learn · Simulations · Mentor · Profile** (Duolingo/Apple Fitness pattern), 44×44+ targets, active state, safe-area padding.
- **Top app bar (mobile):** compact 56 px, title + streak/Talent-Score chip + avatar; collapses on scroll.
- **Design tokens:** fluid type scale (`clamp()`), 4-pt spacing, 44 px min target, radius/elevation, motion durations, `safe-area-inset` utilities, `100dvh`.
- **Primitives:** `useMediaQuery`/`useBreakpoint` hook; `Sheet`/drawer for secondary nav; `Container` with max-width + gutters.

**Acceptance:** no horizontal scroll at 375 px on any student route; bottom tabs reachable one-handed; content clears notch & home indicator.

---

### 4.2 — Student dashboard *(Priority 2)*

**Current:** `StudentPortal.tsx` — `100vh; overflow:hidden`; `grid 200px 1fr 310px`; tools `repeat(5,1fr)`; course rows `34px 1fr 125px 85px`; right rail (Prof. Didier card, streak, momentum) fixed 310 px.

**Problems:** entire dashboard invisible/*broken* on phone (S2, S4); three columns can't coexist < 1024 px.

**Redesign (mobile, single column, scrollable):**
1. **Hero:** greeting + date + **Talent-Score ring** (Apple Fitness) + streak flame (Duolingo).
2. **Continue Learning** card (Coursera) — resume last lesson, progress bar, big CTA.
3. **Today's plan** — 2–3 bite-sized actions (lesson, 1 simulation, 1 drill).
4. **Stats strip** — horizontally scrollable chips (hours-to-employable, points, labs).
5. **Schools/Programs** — horizontal carousels (MasterClass) instead of `repeat(5,1fr)`.
6. **Career tools** — 2-col grid on phone, 3 on tablet (not 5).
7. **Prof. Didier (AI Mentor)** — promoted to its own tab + a dashboard entry card.

**Tablet:** 2-column (main + rail). **Desktop:** unchanged.
**Acceptance:** fully scrollable; no fixed multi-column grid < md; all CTAs ≥ 44 px.

---

### 4.3 — Course experience *(Priority 3)*

**Current:** `PortalCourseDetail.tsx` — `grid 260px 1fr`, no `@media`.

**Redesign:** mobile **tabbed course home** (Coursera): full-bleed program header (MasterClass) → sticky segmented tabs *Overview · Modules · Portfolio · Certification* → vertical module list with progress, lock states, and a persistent **Continue** button. Module → expandable lesson list. Tablet: optional 2-pane. **Acceptance:** single column < md; sticky progress; thumb-reachable continue.

---

### 4.4 — Lesson experience *(Priority 4)*

**Current:** `ChapterView.tsx` — `grid 1fr 340px`, no `@media`.

**Redesign (the core learning loop — make it Duolingo-smooth):**
- **Immersive single column**, content-first, generous line length, fluid type.
- **Sticky top progress bar** (lesson % + module dots).
- **Video-first** where present: edge-to-edge player, landscape full-screen.
- **Stepper navigation:** big bottom **Continue / Next** bar (safe-area), swipe between sections.
- Side-rail content (notes, AI mentor, resources) → **bottom sheets** on demand.
- **Inline checks for understanding** with instant feedback + micro-celebration on completion.

**Acceptance:** no side rail < md; one primary action visible; player respects safe area; lesson completes with feedback animation.

---

### 4.5 — Simulation experience *(Priority 5)*

**Current:** `PortalSimulations.tsx` — `Header + display:flex + PortalSidebar` (always visible); hero `height:340`; cards `minmax(320px,1fr)` (overflows < 375); filter bar wraps awkwardly; `SimEngine` modal.

**Redesign:** simulations become a **bottom-tab destination**. Mobile: full-width sim cards (min 280), filters in a **bottom-sheet** ("Filter" button) not an inline bar, program list as accordions. **`SimEngine` → full-screen immersive mode** (Apple Fitness activity): edge-to-edge, large persona/decision UI, big choice buttons, progress + score ring, haptic feedback on decisions. **Acceptance:** sidebar gone < md; cards never overflow; sim runs full-screen with safe-area controls.

---

### 4.6 — AI Mentor experience *(Priority 6)*

**Current:** Prof. Didier chat modal `width:92% maxWidth:500` (acceptable) but entry is buried in the desktop right rail (`StudentPortal.tsx:794+`).

**Redesign:** AI Mentor becomes a **first-class bottom tab** + a floating action presence. Mobile chat = **full-screen conversational UI** (message bubbles, voice input, suggested prompts, lesson-aware context), not a constrained modal. Per-lesson "Ask Prof. Didier" buttons open the mentor as a bottom sheet pre-loaded with lesson context. **Acceptance:** mentor reachable in 1 tap from anywhere; full-screen chat on phone; keyboard-safe input bar (safe-area).

---

### 4.7 — Certification experience *(Priority 7)*

**Current:** `PortalCertifications.tsx` — fixed widths `220/160`; card grid `minmax(260px,1fr)`; no mobile layout.

**Redesign:** mobile **credential wallet** — vertically stacked certificate cards with progress to unlock, readiness tracks (PSM I/II etc. from the flagship), and a **shareable certificate view** (full-screen, save-to-photos, LinkedIn share — placement integration). Apple-Fitness-style "earn" celebration on completion. **Acceptance:** single-column wallet < md; certificate viewer full-screen & shareable.

---

## 5. Design system / tokens (to be created)

- **Breakpoints:** xs<480 · sm 480 · md 768 · lg 1024.
- **Type scale (fluid):** `clamp()` from 12 → 40; display/title/body/caption roles.
- **Spacing:** 4-pt grid (4/8/12/16/20/24/32/40).
- **Touch:** min target 44×44; min text 15 px in body; tap-highlight off; `touch-action: manipulation`.
- **Safe areas:** `padding: env(safe-area-inset-*)` utilities on shells, tab bar, sticky bars.
- **Viewport:** `100dvh` (not `100vh`).
- **Motion:** 150–300 ms; celebratory springs for completion; honor `prefers-reduced-motion`.
- **Elevation/glass:** keep current dark glass; codify into tokens.

---

## 6. Navigation IA (mobile)

Replace the left sidebar (< md) with a **5-tab bottom bar**:

| Tab | Routes it owns |
|---|---|
| 🏠 Home | `/portal` (dashboard) |
| 📚 Learn | `/portal/courses`, `/portal/flagship`, `/portal/course/:id`, lessons |
| 🌐 Simulations | `/portal/simulations` |
| 🤖 Mentor | AI Mentor (full-screen) |
| 👤 Profile | Talent Score, Portfolio, Certifications, Settings |

Secondary items (Community, Resources, Career tools, Referral, Management) move into **Profile** and contextual entry points. Founder/admin entries stay founder-gated and **hidden on mobile student shell**.

---

## 7. Technical strategy

- **Additive, low-risk:** introduce a mobile shell + tokens; gate new layouts behind `< lg` so **desktop is untouched** (no regression). Current inline desktop styles remain the `lg` path.
- **Primitives:** `useBreakpoint` hook; `AppShell`, `BottomTabBar`, `MobileTopBar`, `Sheet`, `Container`.
- **Conversion approach per surface:** wrap existing desktop render in `if (isDesktop) <currentLayout/> else <mobileLayout/>`, sharing data/handlers — avoids rewriting data logic.
- **Styling:** prefer Tailwind responsive utilities + a few CSS module helpers for safe-area/`dvh`; retire inline fixed grids on the mobile path only.
- **Perf:** lazy-load heavy surfaces (SimEngine, video), image `srcset`, defer right-rail data on mobile.
- **A11y:** focus order, 44 px targets, semantic landmarks, reduced-motion.

---

## 8. Phased delivery roadmap (after you approve this plan)

| Phase | Deliverable | Maps to priority |
|:--:|---|---|
| **M0** | Foundation: tokens, `useBreakpoint`, `AppShell`, bottom tab bar, safe-area, `100dvh`. Ship behind `< lg`. | 1 |
| **M1** | Dashboard mobile redesign (hero/rings, Continue Learning, carousels). | 2 |
| **M2** | Course home (tabbed) + Lesson immersive stepper. | 3, 4 |
| **M3** | Simulations mobile + full-screen SimEngine. | 5 |
| **M4** | AI Mentor full-screen tab + contextual sheets. | 6 |
| **M5** | Certification wallet + shareable certificate. | 7 |
| **M6** | Polish: haptics, motion, landscape, tablet 2-pane, QA across device matrix. | all |

Each phase: build → verify on device matrix → commit → (optional) PR.

---

## 9. Definition of Done (mobile)

A surface passes only when, across the **device matrix (§1)**:
1. **No horizontal scroll / overflow** at 375 px.
2. **No fixed multi-column grid** below `md`.
3. **Bottom tab bar** present, safe-area padded, one-handed reachable.
4. **Primary action** always visible (sticky), ≥ 44 px.
5. Content **clears notch & home indicator**.
6. Uses **`100dvh`**, fluid type, design tokens.
7. **No desktop regression** at `≥ lg`.
8. Honors **reduced-motion**; meets basic a11y.

---

## 10. Metrics to track post-launch
Mobile bounce on `/portal`, lesson completion rate, simulations started/finished, mentor engagements, D1/D7 retention, "continue learning" CTR, time-to-first-lesson. Targets set at M1.

---

*Audit grounded in: `StudentPortal.tsx`, `PortalSidebar.tsx`, `ChapterView.tsx`, `PortalCourseDetail.tsx`, `PortalSimulations.tsx`, `PortalCertifications.tsx`, `Header.tsx`, `index.html`, `tailwind.config`. No code changed — plan for approval before build.*
