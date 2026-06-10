import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Briefcase, Cpu, GraduationCap, LayoutGrid, Megaphone, Rocket, Search, ServerCog, ShieldCheck, Sparkles } from 'lucide-react';

const LINKS = [
  { to: '/admin/ai-workforce', label: 'Control Center', icon: LayoutGrid },
  { to: '/admin/command-center', label: 'CEO', icon: Sparkles },
  { to: '/admin/agent-os', label: 'Agent OS', icon: Cpu },
  { to: '/admin/marketing-agent', label: 'Marketing', icon: Megaphone },
  { to: '/admin/seo-agent', label: 'SEO', icon: Search },
  { to: '/admin/product-agent', label: 'Product', icon: BookOpen },
  { to: '/admin/qa-agent', label: 'QA', icon: ShieldCheck },
  { to: '/admin/admissions-agent', label: 'Admissions', icon: GraduationCap },
  { to: '/admin/student-success', label: 'Success', icon: Rocket },
  { to: '/admin/placement-agent', label: 'Placement', icon: Briefcase },
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
