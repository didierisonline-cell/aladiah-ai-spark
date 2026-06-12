import { Link, useLocation } from 'react-router-dom';
import {
  Award, BarChart3, Briefcase, ClipboardCheck, GraduationCap, Home, Inbox,
  LayoutGrid, Rocket, Server, Shield, ShieldCheck, Sparkles, BookOpen, FilePlus2,
} from 'lucide-react';

// Founder Portal navigation — home, control center, and the founder authorities.
const LINKS = [
  { to: '/founder', label: 'Founder Home', icon: Home, exact: true },
  { to: '/founder/control-center', label: 'Control Center', icon: LayoutGrid },
  { to: '/founder/curriculum', label: 'Review & Readiness', icon: ClipboardCheck },
  { to: '/admin/command-center', label: 'CEO Dashboard', icon: Sparkles },
  { to: '/admin/curriculum-excellence', label: 'Curriculum', icon: Award },
  { to: '/admin/content', label: 'Authoring', icon: FilePlus2 },
  { to: '/admin/production', label: 'Production', icon: LayoutGrid },
  { to: '/admin/qa-agent', label: 'QA Authority', icon: ShieldCheck },
  { to: '/admin/security', label: 'Security', icon: Shield },
  { to: '/admin/admissions-agent', label: 'Admissions', icon: GraduationCap },
  { to: '/admin/student-success', label: 'Student Success', icon: Rocket },
  { to: '/admin/placement-agent', label: 'Placement', icon: Briefcase },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/operations', label: 'Operations', icon: Server },
  { to: '/admin/approvals', label: 'Approval Queue', icon: Inbox },
  { to: '/portal', label: 'Student Portal', icon: BookOpen },
];

/** Cross-navigation across every Founder Portal surface. Drop under <Header/>. */
const FounderNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-wrap items-center gap-1.5 mb-6">
      {LINKS.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? pathname === to : pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default FounderNav;
