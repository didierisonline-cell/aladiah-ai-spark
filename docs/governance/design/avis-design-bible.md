# AVIS Design Bible

**Status: DRAFT v0.1 scaffold.** Registry key: `avis-design-bible`.
**Owner:** interface-experience. The visual-experience authority for every
Aladiah surface. This scaffold indexes what already governs design in
practice; the full Bible is authored under the Interface & Experience
Architect with founder ratification.

## What already governs design (live today)

| Source | Where | Authority |
|---|---|---|
| Design tokens (single source) | `src/index.css` + `tailwind.config.ts` | HSL variables; navy theme; Space Grotesk / Plus Jakarta Sans |
| Component system | `src/components/ui/` (shadcn) | The only primitive kit — no parallel kits |
| UX posture model | `src/services/agents/interfaceExperience/uxPosture.ts` | Scored structural checks: consistency, navigation, responsive, accessibility, hierarchy |
| Risk-color law | cockpit convention | green=go, amber=attention, red=blocked, slate=unmeasured — never decorative |
| Mobile foundation | `src/index.css` | safe-area, dvh, tap targets |

## Reserved chapters (to be authored)

1. Brand-to-interface mapping · 2. Typography scale & voice · 3. Color system
beyond risk states · 4. Motion standards · 5. Accessibility floor (WCAG
target + assistive-tech test protocol) · 6. Student-surface vs founder-surface
idioms · 7. The premium bar — what "executive-grade" means, with examples.
