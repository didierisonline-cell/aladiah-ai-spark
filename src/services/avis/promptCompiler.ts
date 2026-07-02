// =============================================================================
// AVIS — the Prompt Compiler (roadmap step 2, WO-0009).
// Prompts are governed source code for visuals (Blueprint §7): compiled
// DETERMINISTICALLY from a governed VisualSpecification + the taxonomy class
// template + brand tokens BY NAME + merged prohibited elements. No raw user
// text ever reaches a renderer — prompt injection is closed at this seam
// (Integration Architecture §2, §11).
// =============================================================================

/** The canonical educational visual taxonomy (Blueprint §12) — append-only,
 *  like the competency taxonomy. Class creation is an institutional act. */
export const VISUAL_TAXONOMY = [
  'concept-diagram', 'process-flow', 'architecture', 'comparison', 'timeline',
  'data-viz', 'simulation-scene', 'interactive', 'animation', 'worked-example',
  'assessment-visual', 'credential',
] as const;
export type VisualClass = (typeof VISUAL_TAXONOMY)[number];

/** Brand tokens are referenced BY NAME from the single source; the compiler
 *  never accepts free-form color/style descriptions. */
export const BRAND_TOKENS = [
  'brand-primary', 'brand-secondary', 'brand-accent', 'surface-dark',
  'risk-green', 'risk-amber', 'risk-red', 'neutral-slate',
  'font-display', 'font-body',
] as const;
export type BrandToken = (typeof BRAND_TOKENS)[number];

/** Institution-wide prohibitions — merged into EVERY prompt, non-removable. */
export const INSTITUTIONAL_PROHIBITIONS: readonly string[] = [
  'no fabricated data, metrics, or chart values',
  'no implied precision beyond the specification',
  'no text rendered as unreadable decoration',
  'no depictions of real persons',
  'no third-party logos or trademarks',
  'risk colors (green/amber/red) never used decoratively',
];

interface ClassTemplate {
  framing: string;
  requiredElements: string[];
  prohibitions: string[];
}

/** Per-class compilation templates — the engine's decision table, executable. */
export const CLASS_TEMPLATES: Record<VisualClass, ClassTemplate> = {
  'concept-diagram': { framing: 'A clear educational concept diagram', requiredElements: ['labeled elements', 'visual hierarchy of importance'], prohibitions: ['no ornamental clutter'] },
  'process-flow': { framing: 'A step-by-step process flow diagram', requiredElements: ['numbered stages', 'directional flow', 'entry and exit points'], prohibitions: ['no ambiguous arrows'] },
  'architecture': { framing: 'A precise technical architecture diagram', requiredElements: ['named components', 'labeled connections', 'layer boundaries'], prohibitions: ['no components absent from the specification (diagrams are code-reviewed against reality)'] },
  'comparison': { framing: 'A side-by-side educational comparison', requiredElements: ['parallel structure', 'explicit comparison dimensions'], prohibitions: ['no implied winner unless specified'] },
  'timeline': { framing: 'A chronological timeline visualization', requiredElements: ['ordered events', 'time axis'], prohibitions: ['no compressed or distorted intervals without notation'] },
  'data-viz': { framing: 'An honest data visualization', requiredElements: ['axis labels', 'units', 'data source notation'], prohibitions: ['no truncated axes without notation', 'no decorative 3D distortion'] },
  'simulation-scene': { framing: 'A realistic professional scenario scene', requiredElements: ['workplace context', 'role-appropriate setting'], prohibitions: ['no identifiable real persons or brands'] },
  'interactive': { framing: 'A base layer for an interactive diagram', requiredElements: ['distinct interactive regions', 'visual affordances'], prohibitions: ['no meaning carried by hover state alone'] },
  'animation': { framing: 'A keyframe for an educational animation showing change over time or causal sequence', requiredElements: ['clear before/after states'], prohibitions: ['no motion for decoration'] },
  'worked-example': { framing: 'A worked-example walkthrough visual', requiredElements: ['sequential solution steps', 'the reasoning made visible'], prohibitions: ['no skipped steps'] },
  'assessment-visual': { framing: 'An assessment support visual', requiredElements: ['unambiguous depiction', 'no answer leakage'], prohibitions: ['no hints beyond the specification'] },
  'credential': { framing: 'A formal institutional credential design', requiredElements: ['founder-signature vocabulary elements as specified'], prohibitions: ['FOUNDER-GATED CLASS: compilation requires signatureApproved (Reserved Powers)'] },
};

/** The governed input — every field validated; free text confined to fields
 *  the compiler frames, never passed through as instructions. */
export interface VisualSpecification {
  specId: string;
  visualClass: VisualClass;
  purpose: string;               // why this visual exists (framed, not executed)
  audience: 'student' | 'founder' | 'public';
  subject: string;               // what to depict (framed)
  requiredElements: string[];
  prohibitedElements: string[];
  brandTokens: BrandToken[];     // by name only
  altTextIntent: string;         // the textual twin's intent — mandatory
  /** Required true for 'credential' class — the founder's per-instance gate. */
  signatureApproved?: boolean;
}

export interface CompiledPrompt {
  version: string;               // content-derived: same spec → same version
  specId: string;
  visualClass: VisualClass;
  text: string;
  prohibitions: string[];        // full merged list, auditable
  brandTokens: BrandToken[];
  compiledAt: string;
}

export class SpecValidationError extends Error {
  constructor(public violations: string[]) {
    super(`Invalid visual specification: ${violations.join('; ')}`);
    this.name = 'SpecValidationError';
  }
}

/** Pure validation — every violation at once (the proven pattern). */
export function validateSpec(spec: VisualSpecification): string[] {
  const v: string[] = [];
  if (!spec.specId?.trim()) v.push('specId is required');
  if (!VISUAL_TAXONOMY.includes(spec.visualClass)) v.push(`unknown visual class '${spec.visualClass}' (taxonomy is append-only; class creation is an institutional act)`);
  if (!spec.purpose?.trim()) v.push('purpose is required');
  if (!spec.subject?.trim()) v.push('subject is required');
  if (!spec.altTextIntent?.trim()) v.push('altTextIntent is required — the textual twin is mandatory (accessibility floor)');
  for (const t of spec.brandTokens) {
    if (!BRAND_TOKENS.includes(t)) v.push(`unknown brand token '${t}' — tokens are referenced by name from the single source`);
  }
  if (spec.visualClass === 'credential' && spec.signatureApproved !== true) {
    v.push('credential class requires signatureApproved: founder per-instance approval (Reserved Powers applied to imagery)');
  }
  return v;
}

/** Deterministic content hash for prompt versioning (same spec → same version). */
function contentVersion(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  return `v1.${(h >>> 0).toString(36)}`;
}

/**
 * Compile a governed specification into a renderer-ready prompt.
 * Deterministic: identical specs compile to identical prompts and versions.
 * Throws on invalid specs — an ungoverned spec never becomes a prompt.
 */
export function compilePrompt(spec: VisualSpecification, now = '1970-01-01T00:00:00Z'): CompiledPrompt {
  const violations = validateSpec(spec);
  if (violations.length) throw new SpecValidationError(violations);

  const template = CLASS_TEMPLATES[spec.visualClass];
  const prohibitions = [
    ...INSTITUTIONAL_PROHIBITIONS,
    ...template.prohibitions,
    ...spec.prohibitedElements.map((p) => p.trim()).filter(Boolean),
  ];

  const text = [
    `${template.framing} for a ${spec.audience} audience.`,
    `Subject: ${spec.subject.trim()}.`,
    `Purpose: ${spec.purpose.trim()}.`,
    `Required elements: ${[...template.requiredElements, ...spec.requiredElements].join('; ')}.`,
    spec.brandTokens.length ? `Apply institutional brand tokens: ${spec.brandTokens.join(', ')}.` : '',
    `Constraints: ${prohibitions.join('; ')}.`,
  ].filter(Boolean).join('\n');

  return {
    version: contentVersion(text),
    specId: spec.specId,
    visualClass: spec.visualClass,
    text,
    prohibitions,
    brandTokens: spec.brandTokens,
    compiledAt: now,
  };
}
