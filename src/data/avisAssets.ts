import type { AvisAsset } from '@/types/avis';

// ── SVG URL registry ─────────────────────────────────────────────────────────
// Vite resolves these at build time to hashed asset URLs.
import modernEnterpriseMap from '@/assets/avis/modern-enterprise-map.svg';
import cyberAttackLifecycle from '@/assets/avis/cyber-attack-lifecycle.svg';
import enterpriseDefenseLifecycle from '@/assets/avis/enterprise-defense-lifecycle.svg';
import aiAgentSecurityModel from '@/assets/avis/ai-agent-security-model.svg';
import digitalTrustStack from '@/assets/avis/digital-trust-stack.svg';
import cisoExecutiveDashboard from '@/assets/avis/ciso-executive-dashboard.svg';
import zeroTrustArchitecture from '@/assets/avis/zero-trust-architecture.svg';
import ragSecurityFlow from '@/assets/avis/rag-security-flow.svg';
import cybersecurityTimeline from '@/assets/avis/cybersecurity-timeline.svg';
import futureThreatLandscape from '@/assets/avis/future-threat-landscape.svg';
// Module 19 assets
import m19AutonomousAiSoc from '@/assets/avis/m19-autonomous-ai-soc.svg';
import m19PostQuantumCryptography from '@/assets/avis/m19-post-quantum-cryptography.svg';
import m19AiRedVsBlueTeams from '@/assets/avis/m19-ai-red-vs-blue-teams.svg';
import m19DecentralizedIdentity from '@/assets/avis/m19-decentralized-identity.svg';
import m19CybersecurityCareers from '@/assets/avis/m19-cybersecurity-careers-2030-2050.svg';

export const AVIS_SVG_REGISTRY: Record<string, string> = {
  'modern-enterprise-map': modernEnterpriseMap,
  'cyber-attack-lifecycle': cyberAttackLifecycle,
  'enterprise-defense-lifecycle': enterpriseDefenseLifecycle,
  'ai-agent-security-model': aiAgentSecurityModel,
  'digital-trust-stack': digitalTrustStack,
  'ciso-executive-dashboard': cisoExecutiveDashboard,
  'zero-trust-architecture': zeroTrustArchitecture,
  'rag-security-flow': ragSecurityFlow,
  'cybersecurity-timeline': cybersecurityTimeline,
  'future-threat-landscape': futureThreatLandscape,
  'm19-autonomous-ai-soc': m19AutonomousAiSoc,
  'm19-post-quantum-cryptography': m19PostQuantumCryptography,
  'm19-ai-red-vs-blue-teams': m19AiRedVsBlueTeams,
  'm19-decentralized-identity': m19DecentralizedIdentity,
  'm19-cybersecurity-careers-2030-2050': m19CybersecurityCareers,
};

// ── Asset catalog ─────────────────────────────────────────────────────────────
export const AVIS_ASSETS: AvisAsset[] = [
  // ── Module-level general visuals (cyber-v1) ────────────────────────────────
  {
    id: 'cyber-m1-zero-trust',
    courseId: 'cyber-v1', moduleIndex: 1,
    title: 'Zero Trust Architecture — Never Trust, Always Verify',
    type: 'architecture', format: 'svg',
    description: 'Side-by-side comparison of perimeter model vs. Zero Trust, with 5 implementation pillars.',
    learningObjective: 'Understand why the perimeter model failed and how Zero Trust rebuilds enterprise security.',
    svgKey: 'zero-trust-architecture',
    tags: ['zero-trust', 'architecture', 'identity', 'foundations'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m2-defense-lifecycle',
    courseId: 'cyber-v1', moduleIndex: 2,
    title: 'Enterprise Defense Lifecycle',
    type: 'process_flow', format: 'svg',
    description: 'Circular 6-stage defense cycle with MTTD, MTTR, RTO, and RPO metrics.',
    learningObjective: 'Map security operations to the detect-respond-recover lifecycle.',
    svgKey: 'enterprise-defense-lifecycle',
    tags: ['soc', 'incident-response', 'operations', 'metrics'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m3-enterprise-map',
    courseId: 'cyber-v1', moduleIndex: 3,
    title: 'Modern Enterprise Architecture — 5-Layer Security Model',
    type: 'architecture', format: 'svg',
    description: '5-layer enterprise map from physical infrastructure to the business layer.',
    learningObjective: 'Identify security responsibilities across every layer of the enterprise stack.',
    svgKey: 'modern-enterprise-map',
    tags: ['architecture', 'cloud', 'infrastructure', 'layers'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m4-attack-chain',
    courseId: 'cyber-v1', moduleIndex: 4,
    title: 'Cyber Attack Lifecycle — MITRE ATT&CK Kill Chain',
    type: 'attack_chain', format: 'svg',
    description: '7-stage kill chain with MITRE ATT&CK technique IDs at each stage.',
    learningObjective: 'Trace an attack from initial reconnaissance through data exfiltration.',
    svgKey: 'cyber-attack-lifecycle',
    tags: ['mitre-attack', 'kill-chain', 'threat-intelligence', 'network'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m5-rag-security',
    courseId: 'cyber-v1', moduleIndex: 5,
    title: 'RAG Pipeline Security — AI Application Attack Vectors',
    type: 'framework', format: 'svg',
    description: 'RAG pipeline flow with prompt injection, data leakage, and document poisoning attack paths.',
    learningObjective: 'Identify injection and poisoning vulnerabilities in AI-assisted software systems.',
    svgKey: 'rag-security-flow',
    tags: ['devsecops', 'ai-security', 'rag', 'software'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m6-attack-chain',
    courseId: 'cyber-v1', moduleIndex: 6,
    title: 'Cyber Attack Lifecycle — Forensics & Incident Response View',
    type: 'attack_chain', format: 'svg',
    description: 'Kill chain from a digital forensics and incident response investigator perspective.',
    learningObjective: 'Apply forensic methodology to each stage of the attack lifecycle.',
    svgKey: 'cyber-attack-lifecycle',
    tags: ['dfir', 'forensics', 'incident-response', 'kill-chain'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m7-trust-stack',
    courseId: 'cyber-v1', moduleIndex: 7,
    title: 'Digital Trust Stack — From Technical Controls to Business Trust',
    type: 'framework', format: 'svg',
    description: '6-layer trust stack from Technical Security through GRC to Digital Trust.',
    learningObjective: 'Map GRC controls to the layers of organizational digital trust.',
    svgKey: 'digital-trust-stack',
    tags: ['grc', 'governance', 'trust', 'compliance'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m8-trust-stack-soc2',
    courseId: 'cyber-v1', moduleIndex: 8,
    title: 'Digital Trust Stack — SOC 2 & ISO 27001 Alignment',
    type: 'framework', format: 'svg',
    description: 'Trust stack showing where SOC 2 TSC categories and ISO 27001 Annex A controls map.',
    learningObjective: 'Understand which controls satisfy multiple compliance frameworks simultaneously.',
    svgKey: 'digital-trust-stack',
    tags: ['soc2', 'iso27001', 'compliance', 'trust'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m9-trust-privacy',
    courseId: 'cyber-v1', moduleIndex: 9,
    title: 'Digital Trust Stack — Privacy & Data Protection Layer',
    type: 'framework', format: 'svg',
    description: 'Trust stack with focus on the Privacy & Data Protection tier: GDPR, CCPA, HIPAA alignment.',
    learningObjective: 'Map privacy regulations to the technical and governance controls that satisfy them.',
    svgKey: 'digital-trust-stack',
    tags: ['privacy', 'gdpr', 'data-protection', 'trust'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m10-enterprise-map-vrm',
    courseId: 'cyber-v1', moduleIndex: 10,
    title: 'Modern Enterprise Architecture — Third-Party Risk View',
    type: 'architecture', format: 'svg',
    description: 'Enterprise map highlighting vendor touchpoints, API integrations, and supply chain connections.',
    learningObjective: 'Identify third-party risk exposure across the enterprise architecture.',
    svgKey: 'modern-enterprise-map',
    tags: ['vendor-risk', 'supply-chain', 'third-party', 'architecture'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m11-ai-agent-security',
    courseId: 'cyber-v1', moduleIndex: 11,
    title: 'AI Agent Security Model — LLM Threat Surface',
    type: 'framework', format: 'svg',
    description: 'LLM → Tool → MCP flow diagram with prompt injection, data poisoning, and model theft vectors.',
    learningObjective: 'Identify attack surfaces unique to AI agents and autonomous systems.',
    svgKey: 'ai-agent-security-model',
    tags: ['ai-security', 'llm', 'agents', 'mcp'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m12-zero-trust-identity',
    courseId: 'cyber-v1', moduleIndex: 12,
    title: 'Zero Trust Architecture — Identity as the New Perimeter',
    type: 'architecture', format: 'svg',
    description: 'Zero Trust architecture with emphasis on the Identity pillar: MFA, RBAC, ABAC, JIT access.',
    learningObjective: 'Design identity-centric Zero Trust controls for enterprise access management.',
    svgKey: 'zero-trust-architecture',
    tags: ['identity', 'zero-trust', 'iam', 'access'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m13-threat-landscape',
    courseId: 'cyber-v1', moduleIndex: 13,
    title: 'Future Threat Landscape — 2025→2030 Risk Matrix',
    type: 'framework', format: 'svg',
    description: '2×2 risk matrix with 9 threats plotted at 2025 position with 2030 trajectory arrows.',
    learningObjective: 'Prioritize threat intelligence investments against the evolving threat landscape.',
    svgKey: 'future-threat-landscape',
    tags: ['threat-intelligence', 'cti', 'risk-matrix', 'global-risk'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m14-ciso-dashboard',
    courseId: 'cyber-v1', moduleIndex: 14,
    title: 'CISO Executive Dashboard — Security Operations Metrics',
    type: 'hero_diagram', format: 'svg',
    description: 'Executive dashboard showing MTTD, MTTR, patch coverage, risk score, and program health.',
    learningObjective: 'Build metrics dashboards that translate security operations into executive decisions.',
    svgKey: 'ciso-executive-dashboard',
    tags: ['soar', 'automation', 'metrics', 'operations'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m15-ciso-audit',
    courseId: 'cyber-v1', moduleIndex: 15,
    title: 'CISO Executive Dashboard — Audit & Assurance View',
    type: 'hero_diagram', format: 'svg',
    description: 'Security assurance dashboard with control effectiveness, finding severity, and remediation tracking.',
    learningObjective: 'Present security assurance evidence to auditors and executives in decision-ready format.',
    svgKey: 'ciso-executive-dashboard',
    tags: ['audit', 'assurance', 'executive', 'compliance'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m16-ciso-leadership',
    courseId: 'cyber-v1', moduleIndex: 16,
    title: 'CISO Executive Dashboard — Leadership & Strategy',
    type: 'hero_diagram', format: 'svg',
    description: 'Board-level security program dashboard: risk posture, program maturity, investment ROI.',
    learningObjective: 'Develop a CISO-level security strategy narrative backed by measurable program data.',
    svgKey: 'ciso-executive-dashboard',
    tags: ['leadership', 'strategy', 'ciso', 'board'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m17-enterprise-architecture',
    courseId: 'cyber-v1', moduleIndex: 17,
    title: 'Modern Enterprise Architecture — Security Architecture View',
    type: 'architecture', format: 'svg',
    description: '5-layer enterprise architecture from the security architect lens: controls at each layer.',
    learningObjective: 'Design security controls that span every layer of the enterprise architecture.',
    svgKey: 'modern-enterprise-map',
    tags: ['architecture', 'digital-transformation', 'enterprise', 'design'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m18-timeline',
    courseId: 'cyber-v1', moduleIndex: 18,
    title: 'Cybersecurity Timeline — 1960 to 2045',
    type: 'timeline', format: 'svg',
    description: 'Historical cybersecurity timeline from the 1960s mainframe era through 2045 AI-native forecasts.',
    learningObjective: 'Situate the Digital Twin capstone within the long arc of cybersecurity evolution.',
    svgKey: 'cybersecurity-timeline',
    tags: ['timeline', 'history', 'capstone', 'digital-twin'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },

  // ── Module 19: Masterclass — lesson-level visuals ─────────────────────────
  {
    id: 'cyber-m19-l1-ai-soc',
    courseId: 'cyber-v1', moduleIndex: 19, lessonIndex: 1,
    title: 'Autonomous AI SOC — The Self-Defending Enterprise',
    type: 'architecture', format: 'svg',
    description: '5-layer AI SOC architecture: Detection → Investigation → Containment → Communication → Learning, with Human Oversight sidebar.',
    learningObjective: 'Understand how autonomous AI security operations are architected and governed.',
    svgKey: 'm19-autonomous-ai-soc',
    tags: ['ai-soc', 'autonomous', 'detection', 'future'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m19-l2-pqc',
    courseId: 'cyber-v1', moduleIndex: 19, lessonIndex: 2,
    title: 'Post-Quantum Cryptography — NIST Standards 2024',
    type: 'framework', format: 'svg',
    description: 'Vulnerable vs. quantum-safe algorithm comparison with NIST FIPS 203/204/205 and HNDL threat warning.',
    learningObjective: 'Build a quantum migration roadmap starting with cryptographic inventory.',
    svgKey: 'm19-post-quantum-cryptography',
    tags: ['post-quantum', 'cryptography', 'nist', 'migration'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m19-l3-red-vs-blue',
    courseId: 'cyber-v1', moduleIndex: 19, lessonIndex: 3,
    title: 'AI Red Team vs. AI Blue Team',
    type: 'framework', format: 'svg',
    description: 'Battle layout: AI Red Team capabilities vs. AI Blue Team responses, with AI Governance Framework bar.',
    learningObjective: 'Design governance frameworks for AI security agents on both offensive and defensive sides.',
    svgKey: 'm19-ai-red-vs-blue-teams',
    tags: ['red-team', 'blue-team', 'agentic', 'governance'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m19-l4-did',
    courseId: 'cyber-v1', moduleIndex: 19, lessonIndex: 4,
    title: 'Decentralized Identity — DIDs & Verifiable Credentials',
    type: 'process_flow', format: 'svg',
    description: 'Issuer → Wallet → Verifier flow with Old vs. New identity model comparison.',
    learningObjective: 'Explain how Decentralized Identifiers and Verifiable Credentials replace centralized identity.',
    svgKey: 'm19-decentralized-identity',
    tags: ['did', 'verifiable-credentials', 'identity', 'trust'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
  {
    id: 'cyber-m19-l5-careers',
    courseId: 'cyber-v1', moduleIndex: 19, lessonIndex: 5,
    title: 'Cybersecurity Career Roadmap 2030–2050',
    type: 'roadmap', format: 'svg',
    description: 'Three-era career roadmap: AI-Augmented Roles (2025-30) → AI-Native Security (2030-40) → AI Governance Era (2040-50) with compound skills.',
    learningObjective: 'Make deliberate career decisions with a 25-year time horizon.',
    svgKey: 'm19-cybersecurity-careers-2030-2050',
    tags: ['careers', 'roadmap', 'future', '2050'],
    createdAt: '2026-07-01', updatedAt: '2026-07-01',
  },
];

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export function getAvisAsset(
  courseId: string,
  moduleIndex: number,
  lessonIndex?: number
): AvisAsset | undefined {
  // Prefer lesson-specific asset, fall back to module-level
  if (lessonIndex !== undefined) {
    const lessonAsset = AVIS_ASSETS.find(
      a => a.courseId === courseId && a.moduleIndex === moduleIndex && a.lessonIndex === lessonIndex
    );
    if (lessonAsset) return lessonAsset;
  }
  return AVIS_ASSETS.find(
    a => a.courseId === courseId && a.moduleIndex === moduleIndex && a.lessonIndex === undefined
  );
}

export function getAvisUrl(svgKey: string): string | undefined {
  return AVIS_SVG_REGISTRY[svgKey];
}

// All assets grouped by section for the Studio page
export const AVIS_STUDIO_SECTIONS = [
  {
    title: 'Featured Visuals',
    filter: (a: AvisAsset) => ['cyber-m1-zero-trust', 'cyber-m4-attack-chain', 'cyber-m11-ai-agent-security', 'cyber-m19-l1-ai-soc', 'cyber-m19-l2-pqc'].includes(a.id),
  },
  {
    title: 'Cybersecurity Frameworks',
    filter: (a: AvisAsset) => a.type === 'framework',
  },
  {
    title: 'Attack Chains',
    filter: (a: AvisAsset) => a.type === 'attack_chain',
  },
  {
    title: 'Architecture Diagrams',
    filter: (a: AvisAsset) => a.type === 'architecture',
  },
  {
    title: 'AI Security Systems',
    filter: (a: AvisAsset) => a.tags.some(t => t.startsWith('ai-')),
  },
  {
    title: 'Career Roadmaps',
    filter: (a: AvisAsset) => a.type === 'roadmap' || a.type === 'timeline',
  },
];
