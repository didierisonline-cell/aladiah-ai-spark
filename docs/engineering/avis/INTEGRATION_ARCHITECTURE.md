# AVIS — Open-Gen-AI Integration Architecture (FD-2026-016)

**Status: DESIGN — returned for Founder review before implementation.**
Registry key: `avis-integration-architecture` · Extends the AVIS Blueprint
(v1.1, scope: the Institutional Visual Intelligence Platform).

**The constitutional rule this document serves (FD-2026-016, verbatim):**
*the rendering engine shall never define institutional standards.* AVIS, the
Design Bible, Brand Standards, and the Company Brain define; **the renderer
executes.** Every section below is written so that replacing the renderer
changes nothing above §15's adapter seam.

---

## 1. Server-side API architecture

New edge function **`avis-render`**, built to the proven `ai-proxy` pattern
(the platform's existing secure AI seam): API keys server-side only
(Supabase secrets, never client-visible — the SEC-002/3 lesson) · JWT-gated:
founder/steward roles for generation requests; students never invoke
generation · request/response logged to the AOS execution-log discipline ·
one function, one responsibility (render), per the M19 one-function-one-spec
finding. Companion function **`avis-register`** (or a second route) finalizes
approved assets into storage + registry mirror queue. Deployment is
founder-applied per canon (Supabase CLI, like every function).

## 2. Prompt compilation pipeline

```
VisualSpecification (governed, from the Engine)
  + taxonomy-class template (§ Blueprint 12)
  + brand tokens by NAME (§6 — never described ad hoc)
  + prohibited-elements list (class + brand + accessibility)
  + audience/purpose framing
  → CompiledPrompt vX.Y  (immutable, registered, attached to every output)
```
Compilation is deterministic from governed inputs — **no raw user text ever
reaches the renderer** (prompt-injection closed at the seam, §11). Prompt
versions live in the prompt library (Blueprint §7); a compilation change is
a reviewed commit.

## 3. Visual asset generation workflow

```
Need (Visual First rubric) → Spec → CompiledPrompt
  → avis-render (renderer executes; N candidates)
  → DRAFT state (quarantined: drafts are never publishable, never public)
  → human review gates (§14) → verdicts recorded (QA/brand/accessibility)
  → APPROVED → registered (genome + storage + Brain) → usable
  → or REJECTED → post-mortem recorded (rejection is knowledge, Blueprint §3)
```
Drafts expire (retention rule, §4) — unreviewed drafts never become shadow
inventory. State machine mirrors the genome lifecycle discipline.

## 4. Asset storage strategy

Supabase Storage (the platform's existing store — nothing parallel):
bucket `avis-assets` with class-scoped folders (`drafts/` private, founder/
steward-only RLS; `approved/<taxonomy-class>/` access per asset
classification: public marketing vs. student lesson vs. founder executive) ·
content-addressed names (hash) so identical outputs dedupe and references
never break · originals + derived renditions (web sizes) stored together;
the genome points, never contains (Blueprint §11) · drafts auto-expire
(30-day rule proposed, founder-settable) — approved assets are immutable
and permanent (Amendment IV for pixels).

## 5. Metadata model

Every asset row (registry + storage metadata, one truth):
`assetId (hash)` · `taxonomyClass` · `specRef` · `promptVersion` ·
`renderer + rendererVersion` (provenance: which engine, which model, when) ·
`requestedBy / approvedBy` (human accountability per act) · `verdicts`
(QA/brand/accessibility, with reviewer + date) · `usageSites` (lessons,
pages, campaigns — added as consumed) · `supersedes/replacedBy` ·
`license/provenance` · `altText` (the textual twin, mandatory) ·
`brainMarker (visual:<assetId>:v<n>)` · `costRecord (§12)`. The
`visual-asset` genome class carries this as its loci extension — one schema,
CI-validated like everything.

## 6. Brand enforcement

Pre-generation: compiled prompts reference brand tokens by name from the
single source (`src/index.css` vocabulary + brand inventory) and inject the
class's visual grammar (risk colors reserved for risk; protected terms
rendered exactly, never translated or restyled). Post-generation: the brand
gate (§14) verifies palette compliance, logo/seal usage rules, and
signature-class restrictions (founder-only, per the Reserved-Powers-for-
imagery rule). Brand standards live in the Design Bible; this pipeline
*executes* them — amendments happen there, never in prompts.

## 7. QA workflow

Per-class checklists (Blueprint §12) executed at the human gates: factual
accuracy (architecture/security diagrams code-reviewed against reality) ·
pedagogical value scored vs. the textual twin · honesty (no decorative
data, no implied precision) · technical quality (resolution, artifacts,
text-in-image legibility). Verdicts recorded on the asset (with reviewer
identity) and to the Brain. QA failures are typed (accuracy/brand/access/
technical) so rejection analytics teach the prompt library.

## 8. Company Brain integration

On approval: the asset mirrors (`visual:<assetId>:v1`) with spec, prompt
version, verdicts, and the alt-text twin — both modalities preserved
(FD Master Order). On rejection: the post-mortem mirrors (typed reason).
On usage: consumption sites append (the Brain knows where every visual
teaches). Retrieval: taxonomy + purpose markers; reuse-before-regenerate is
the recall rule (M03 P4's anti-duplication applied to imagery — cheaper and
more consistent than regenerating).

## 9. Marketing workflow

Marketing assets (social, podcast, web, campaign) flow the SAME pipeline
with their register: marketing-content owns specs; brand gate is mandatory;
**claims discipline applies to imagery** — a visual implying an unverified
claim fails QA (the CEO Truth Dashboard's claim-drift doctrine extended to
pictures) · campaign assets carry usage windows; expired-campaign assets
remain registered (history) but leave active rotation · marketing volume
runs under its per-department budget (§12) with steward-gated bulk
generation as autonomy stage 2 (Blueprint §17) once the founder enables it.

## 10. Portal workflow

Student-facing visuals (lesson diagrams, simulation scenes, portal
graphics): curriculum-excellence stewards specs; accessibility gate is
strict (student surface = the mission surface); assets version WITH their
lessons (a lesson revision re-specs its visuals; stale-diagram drift per
Blueprint §13) · delivery via the approved bucket with student-level access
and CDN caching · **no on-demand student-triggered generation** — students
consume governed assets; they never invoke the renderer (cost, safety, and
consistency all point the same way).

## 11. Security model

Keys server-side in Supabase secrets (rotation discipline per the standing
SEC actions) · no raw user input in prompts (§2 — compilation from governed
specs only) · draft quarantine (private RLS) until human approval ·
provenance mandatory (renderer + model + prompt version on every asset —
nothing enters unattributed) · signature-class assets: founder-only gate,
non-delegable, registry-verifiable (anti-counterfeit by provenance) ·
content-safety: renderer safety systems are a floor, not the standard —
the human gates are the Institution's actual control · the whole surface
inherits M09's (pending) security manual on ratification.

## 12. Cost monitoring

A cost ledger per render call (edge function writes: caller, class, model,
image count/size, unit cost at current published pricing) rolling up to:
per-class and per-department spend vs. budget (budgets founder-set at
enablement; the Blueprint §20 rule governs: **cost per comprehension gain,
not cost per image**) · daily spend visible on the cockpit (computed tile;
unmeasured until the ledger exists — never estimated) · budget breach =
early warning (M06 P4 class) → generation pauses for that budget until
founder/steward release. Unit prices are read from the provider at
implementation time and recorded per call — never hardcoded assumptions.

## 13. Rate limiting

Three layers: per-caller (steward roles have per-hour ceilings;
founder-adjustable) · per-budget (a department at budget cap cannot render —
§12 is also the hard limiter) · per-function (edge-function concurrency
bounds against runaway loops — the 3 a.m. lesson from multi-agent lore:
no unattended loop may spend money silently; retry policies are bounded and
logged). All limits are configuration the founder applies, not code
constants.

## 14. Human review gates

| Gate | Reviewer | Scope | Bypass |
|---|---|---|---|
| QA (accuracy/quality/honesty) | qa-authority steward | every asset | never |
| Accessibility (alt text, contrast, motion) | interface-experience | every asset | never |
| Brand | interface-experience (marketing assets: + marketing steward) | every asset | never |
| Founder approval | founder | signature-class per instance; new class enablement; autonomy stage changes | never — Reserved Powers |

Stage-1 autonomy (launch posture): every asset human-gated. Stage
progression only by founder decision with evidence (Blueprint §17).

## 15. Future renderer plug-in architecture

```ts
interface VisualRenderer {           // the adapter seam — the ONLY place a vendor exists
  id: string; version: string;
  capabilities(): RendererCapabilities;      // sizes, formats, edit/variation support
  render(prompt: CompiledPrompt, opts: RenderOptions): Promise<CandidateSet>;
  cost(opts: RenderOptions): CostEstimate;   // feeds the ledger before spend
}
```
**Open-Gen-AI is the first adapter, not the architecture.** Everything above
this section consumes the interface; adding/replacing a renderer is one
adapter + founder enablement — specs, prompts (recompiled per adapter
dialect), standards, gates, storage, registry, and the Brain are untouched.
The Institution's visual identity survives every vendor.

---

**Review effect:** Founder approval of this architecture (with the
blueprint, PR #104) authorizes the implementation sequence: ① `avis-render`
+ `avis-register` edge functions (genome-first, gate chain pre-declared) ·
② storage bucket + RLS + ledger · ③ prompt library + first class templates ·
④ the Enterprise Diagram Library as first governed content · ⑤ marketing
and portal workflows enabled per department readiness. Each step a work
order through the road (M07). Until approval: not one API call.
