import { Link, useLocation } from 'react-router-dom';
import { Award, BarChart3, BookOpen, Briefcase, Cpu, GraduationCap, Inbox, LayoutGrid, Megaphone, Rocket, Search, Server, ServerCog, Shield, ShieldCheck, Sparkles } from 'lucide-react';

const LINKS = [
  { to: '/admin/ai-workforce', label: 'Control Center', icon: LayoutGrid },
  { to: '/admin/command-center', label: 'CEO', icon: Sparkles },
  { to: '/admin/agent-os', label: 'Agent OS', icon: Cpu },
  { to: '/admin/marketing-agent', label: 'Marketing', icon: Megaphone },
  { to: '/admin/seo-agent', label: 'SEO', icon: Search },
  { to: '/admin/product-agent', label: 'Product', icon: BookOpen },
  { to: '/admin/curriculum-excellence', label: 'Curriculum', icon: Award },
  { to: '/admin/qa-agent', label: 'QA', icon: ShieldCheck },
  { to: '/admin/security', label: 'Security', icon: Shield },
  { to: '/admin/admissions-agent', label: 'Admissions', icon: GraduationCap },
  { to: '/admin/student-success', label: 'Success', icon: Rocket },
  { to: '/admin/placement-agent', label: 'Placement', icon: Briefcase },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/operations', label: 'Operations', icon: Server },
  { to: '/admin/approvals', label: 'Approvals', icon: Inbox },
  { to: '/admin', label: 'Admin', icon: ServerCog },
];

/** Cross-navigation across every AI Workforce surface. Drop under <Header/>. */
const WorkforceNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-wrap items-center gap-1.5 mb-6">
      {LINKS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
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

export default WorkforceNav;
