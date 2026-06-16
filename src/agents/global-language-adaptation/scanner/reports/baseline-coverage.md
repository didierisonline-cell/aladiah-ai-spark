# Translation Coverage — Baseline Report

_Generated 2026-06-16T14:13:32.788Z · scanner v0.1_
_Scope: static-source (LanguageContext keys + t() refs + hardcoded JSX heuristic)_

- **Baseline (en) keys:** 571
- **Declared languages:** 21
- **Languages with a translation block:** en, es, zh, ar, fr, de, ja, pt, hi, ko, it, ru, nl, pl, tr, sw, yo, ha, ig, vi, th
- **t()-referenced keys missing from baseline:** 83
- **Hardcoded-English JSX candidates (heuristic):** 1013

## Per-language key coverage (UI strings only)

| Lang | Block? | Defined keys | Baseline covered | Coverage % | Active-eligible (static) |
|---|---|---|---|---|---|
| en | yes | 571 | 571/571 | 100% | ✅ |
| es | yes | 571 | 571/571 | 100% | ✅ |
| zh | yes | 562 | 562/571 | 98.4% | ❌ |
| ar | yes | 562 | 562/571 | 98.4% | ❌ |
| fr | yes | 571 | 571/571 | 100% | ✅ |
| de | yes | 570 | 570/571 | 99.8% | ❌ |
| ja | yes | 562 | 562/571 | 98.4% | ❌ |
| pt | yes | 379 | 379/571 | 66.4% | ❌ |
| hi | yes | 371 | 371/571 | 65% | ❌ |
| ko | yes | 371 | 371/571 | 65% | ❌ |
| it | yes | 379 | 379/571 | 66.4% | ❌ |
| ru | yes | 379 | 379/571 | 66.4% | ❌ |
| nl | yes | 371 | 371/571 | 65% | ❌ |
| pl | yes | 371 | 371/571 | 65% | ❌ |
| tr | yes | 371 | 371/571 | 65% | ❌ |
| sw | yes | 371 | 371/571 | 65% | ❌ |
| yo | yes | 271 | 271/571 | 47.5% | ❌ |
| ha | yes | 371 | 371/571 | 65% | ❌ |
| ig | yes | 371 | 371/571 | 65% | ❌ |
| vi | yes | 371 | 371/571 | 65% | ❌ |
| th | yes | 371 | 371/571 | 65% | ❌ |

> ⚠️ "Active-eligible (static)" reflects ONLY UI-string key coverage. Full activation per
> the Language Completeness Rules also requires 100% DB content (courses/lessons/quizzes)
> and translated diagrams — measured in later scanner phases.

## Hardcoded-English candidates — top files (heuristic)

- `src/components/simulation/ArchitectureDiagramViewer.tsx` — 29 (e.g. "VPC: 10.0.0.0/16 — nebula-prod-vpc", "Public Subnet — AZ us-east-1a", "Auth Service")
- `src/pages/AdminDashboard.tsx` — 24 (e.g. "Loading command center...", "Command Center", "Aladiah Academy · Live Dashboard")
- `src/components/admin/content/ContentAuthoringCenter.tsx` — 23 (e.g. "Content Authoring Center", "Single source of truth for curriculum creation · curriculum ", "No programs")
- `src/components/admin/curriculum/CurriculumExcellenceDashboard.tsx` — 23 (e.g. "Curriculum Excellence", "Refresh", "Run Audit")
- `src/components/admin/operations/OperationsDashboard.tsx` — 23 (e.g. "No components.", "No findings.", "Acknowledge")
- `src/components/admin/curriculum/AcademyProduction.tsx` — 21 (e.g. "Academy Production", "Lifecycle status · completion heatmap · production queue · f", "Refresh")
- `src/components/simulation/TicketDetailModal.tsx` — 21 (e.g. "User Story", "Details", "Description")
- `src/pages/InterviewSimulator.tsx` — 19 (e.g. "AI Interview Coach", "Access your AI Interview Simulator below.", "View Plans")
- `src/components/portal/CareerTools.tsx` — 18 (e.g. "Career Roadmap", "Track your path to career readiness", "AI Resume Builder")
- `src/components/founder/CurriculumReadinessDashboard.tsx` — 17 (e.g. "Launch Ready", "In Development", "Program-level readiness · launch gate · live Supabase")
- `src/components/portal/StatDetailModals.tsx` — 17 (e.g. "Your Progress Details", "Overall Completion", "Chapter Progress")
- `src/components/admin/analytics/AnalyticsDashboard.tsx` — 16 (e.g. "Analytics &amp; Executive Intelligence", "Source of truth · master KPI: Career Transformation Impact S", "Refresh")
- `src/components/simulation/EmailInbox.tsx` — 16 (e.g. "SM Guidance", "How to Register This Risk", "Send Reply")
- `src/components/admin/curriculum/AcademyReadinessPanel.tsx` — 15 (e.g. "Module readiness", "Missing content by module", "All modules have lessons + quiz.")
- `src/pages/MyCareerPath.tsx` — 15 (e.g. "CAREER FOCUS", "My Career Path", "Choose your target program. See your full roadmap, resources")
- `src/pages/Certifications.tsx` — 14 (e.g. "Seven Levels of", "Verified Mastery.", "Not a participation certificate. Multi-modal evaluation at e")
- `src/components/admin/marketing/ContentGeneratorPanel.tsx` — 13 (e.g. "Promise", "Content Generator", "One idea in — assets out, straight to the approval queue.")
- `src/pages/Auth.tsx` — 13 (e.g. "Check your email", "If an account exists for that address, a reset link is on it", "The link opens the reset page and expires after a single use")
- `src/pages/Enroll.tsx` — 13 (e.g. "Back to Home", "Aladiah Academy", "Professional Enrollment Application")
- `src/components/portal/PortalCareerPanel.tsx` — 12 (e.g. "Career Path Recommendations", "Based on your Talent Score™ and course progress, Prof. Didie", "Skill Gap Analysis")
