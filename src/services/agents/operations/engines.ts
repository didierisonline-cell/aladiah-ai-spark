// =============================================================================
// Operations & Platform Authority — the 8 monitoring engines (code mirror).
// =============================================================================
import { AuditSurfaceArea, OpsEngineDef, Severity } from '@/types/operations';

export const OPS_ENGINES: OpsEngineDef[] = [
  { id: 'platform_monitoring', name: 'Platform Monitoring', purpose: 'Homepage, portal, courses, checkout, login, dashboard — broken links/pages, missing assets, 404s, UI/nav errors.' },
  { id: 'functional_testing', name: 'Functional Testing', purpose: 'Buttons, menus, forms, progress, unlock logic, certifications, talent score, portfolio, AI mentor, community.' },
  { id: 'course_integrity', name: 'Course Integrity', purpose: 'Every program has modules, lessons, quizzes, simulations, labs, projects, assessments, learning paths.' },
  { id: 'simulation_integrity', name: 'Simulation Integrity', purpose: 'Instructions, scoring, completion, feedback, learning objectives — flag broken experiences.' },
  { id: 'payment', name: 'Payment Engine', purpose: 'Enrollment, subscription, checkout, payment success/failure — detect revenue leakage.' },
  { id: 'infrastructure', name: 'Infrastructure', purpose: 'Supabase, database, storage, auth, Vercel, APIs, email services.' },
  { id: 'ai_engine_monitoring', name: 'AI Engine Monitoring', purpose: 'Claude, OpenAI, ElevenLabs — availability, response quality, errors, latency.' },
  { id: 'platform_audit', name: 'Platform Audit', purpose: 'Recurring audits of navigation, UI, courses, simulations, labs, projects, student journey.' },
];

export const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

// ---- Platform Audit Framework (Site Audit Authority) -----------------------
// The complete surface that must be audited before launch. Each finding carries
// Issue · Severity · Screenshot · Fix · Owner · Status.
export const AUDIT_SURFACE: AuditSurfaceArea[] = [
  { category: 'Navigation', items: ['Every menu', 'Every button', 'Every route', 'Every badge'], owner: 'Operations' },
  { category: 'Routes & Pages', items: ['Homepage', 'Portal pages', 'Courses', 'Dashboard', 'Profile pages'], owner: 'Operations' },
  { category: 'Learning', items: ['Every simulation', 'Every lab', 'Every quiz', 'Certifications'], owner: 'Product Builder Agent' },
  { category: 'User Journeys', items: ['Signup → activation', 'Course → completion', 'Placement journey'], owner: 'Student Success' },
  { category: 'Localization', items: ['Every language'], owner: 'Operations' },
  { category: 'Commerce', items: ['Every payment flow', 'Checkout', 'Subscription'], owner: 'Finance / Payments' },
  { category: 'Credentials', items: ['Every certificate flow', 'Talent Score', 'Aladiah Profile'], owner: 'Product Builder Agent' },
];

export function ownerForEngine(engine: string): string {
  if (engine === 'course_integrity' || engine === 'simulation_integrity') return 'Product Builder Agent';
  if (engine === 'payment') return 'Finance / Payments';
  if (engine === 'infrastructure') return 'Operations / DevOps';
  return 'Operations';
}
