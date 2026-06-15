import { Link, useLocation } from 'react-router-dom';
import { activeHref } from '@/lib/nav';
import { FOUNDER_NAV_ITEMS } from '@/lib/founderNav';

/** AI Workforce / Admin cross-navigation. Renders the single shared founder nav
 *  config (lib/founderNav) — identical to FounderNav — so the founder experience
 *  is consistent across every /founder and /admin surface. */
const WorkforceNav = () => {
  const { pathname } = useLocation();
  const current = activeHref(pathname, FOUNDER_NAV_ITEMS.map((l) => l.to));
  return (
    <nav className="flex flex-wrap items-center gap-1.5 mb-6">
      {FOUNDER_NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = to === current;
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
