import {
  Award, BarChart3, BookOpen, Briefcase, ClipboardCheck, Cpu, FilePlus2, GaugeCircle,
  GraduationCap, Home, Inbox, LayoutGrid, Megaphone, Rocket, Search, Server, ServerCog,
  Shield, ShieldCheck, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FounderNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// =============================================================================
// Single source of truth for founder/admin navigation. Previously FounderNav
// (founder authorities) and WorkforceNav (AI Workforce agents) carried two
// divergent lists; both now render THIS list so the founder sees one consistent
// navigation across every /founder and /admin surface. The union is deduped and
// every existing destination is preserved (no admin route loses its entry).
// =============================================================================
export const FOUNDER_NAV_ITEMS: FounderNavItem[] = [
  { to: '/founder', label: 'Founder Home', icon: Home },
  { to: '/founder/control-center', label: 'Control Center', icon: LayoutGrid },
  { to: '/founder/readiness', label: 'Curriculum Readiness', icon: GaugeCircle },
  { to: '/founder/localization', label: 'Localization Factory', icon: Sparkles },
  { to: '/founder/curriculum', label: 'Question Review', icon: ClipboardCheck },
  { to: '/admin/command-center', label: 'CEO', icon: Sparkles },
  { to: '/admin/ai-workforce', label: 'AI Workforce', icon: LayoutGrid },
  { to: '/admin/agent-os', label: 'Agent OS', icon: Cpu },
  { to: '/admin/curriculum-excellence', label: 'Curriculum', icon: Award },
  { to: '/admin/content', label: 'Authoring', icon: FilePlus2 },
  { to: '/admin/production', label: 'Production', icon: Server },
  { to: '/admin/marketing-agent', label: 'Marketing', icon: Megaphone },
  { to: '/admin/seo-agent', label: 'SEO', icon: Search },
  { to: '/admin/product-agent', label: 'Product', icon: BookOpen },
  { to: '/admin/qa-agent', label: 'QA Authority', icon: ShieldCheck },
  { to: '/admin/security', label: 'Security', icon: Shield },
  { to: '/admin/admissions-agent', label: 'Admissions', icon: GraduationCap },
  { to: '/admin/student-success', label: 'Student Success', icon: Rocket },
  { to: '/admin/placement-agent', label: 'Placement', icon: Briefcase },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/operations', label: 'Operations', icon: ServerCog },
  { to: '/admin/approvals', label: 'Approval Queue', icon: Inbox },
  { to: '/admin', label: 'Admin', icon: ServerCog },
  { to: '/portal', label: 'Student Portal', icon: BookOpen },
];
