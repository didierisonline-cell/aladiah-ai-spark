# Agent Spec — Interface & Experience Architect

Status: **Canonical spec for Agent #14 of the Aladiah AI Workforce.**

## 1. Identity & mission
- **Slug:** `interface-experience` · **Cadence:** weekly.
- **Mission:** The authority for **how Aladiah looks, feels, and flows.** Owns the
  Founder Portal interface, student portal interface, dashboard UX, navigation,
  mobile responsiveness, accessibility, design polish, premium visual consistency,
  component hierarchy, and user-journey clarity.

## 2. Ownership surface
Founder Portal (`/founder/*`) · Student Portal (`/portal/*`) · dashboard UX ·
navigation (`src/lib/founderNav.ts` — the single nav source) · mobile
responsiveness · accessibility · design-system tokens (`src/index.css` +
`tailwind.config.ts`) · component hierarchy (shadcn primitives in
`src/components/ui/`) · user-journey clarity.

## 3. UX posture model
`src/services/agents/interfaceExperience/uxPosture.ts` — the securityPosture
pattern applied to UX. Weighted sections: **Visual Consistency (.25) ·
Navigation & Journey Clarity (.20) · Mobile & Responsive (.20) ·
Accessibility (.20) · Hierarchy & Clutter (.15)**. Every check is a verified
structural fact about the codebase; runtime audits (Lighthouse, screen reader,
device matrix) are listed as **unmeasured** until they are actually run — no
aspirational scores.

## 4. What the audit does (v1, read-only)
`runUXAudit()`:
- Computes the UX posture score and open items per section.
- Picks up delegated **UX-gate reviews** on work orders (`payload.gate === 'ux'`)
  and marks them in progress so nothing waits silently.
- Stores the snapshot in agent memory, reports to the CEO Agent, and logs the run.

## 5. Role in orchestration
The Interface & Experience Architect reviews the **UX gate** on every work order
before it can enter the Founder Approval Queue (see
`src/services/aos/orchestration.ts` — `GATE_REVIEWERS.ux`). Design-type work
orders route to this agent first.

## 6. Approval rules
**Read-only.** Findings and redesign recommendations only; never ships UI
changes, never publishes. Permissions: `read:true, write:false, publish:false,
human_approval_required:true`.

## 7. AOS + Control Center
Auto-registers via `bootstrap.ts`; `interfaceExperienceRunner` (default cycle =
UX audit); appears on the Founder cockpit Agent Operating Grid and at
`/admin/interface-agent`; health rolls up through the AOS.
