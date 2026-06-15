// =============================================================================
// Shared navigation helpers — one active-state rule for every nav surface
// (Header, PortalSidebar, FounderNav, WorkforceNav, StudentPortal). Replaces the
// inconsistent exact-match logic that left sub-routes failing to highlight their
// parent. activeHref picks the LONGEST matching href so e.g. /portal/courses
// highlights "Courses", not the shorter "/portal" home item.
// =============================================================================

/** True if `href` matches `pathname` as an exact route or a parent prefix. */
export function matchesPath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

/** The single active href from a set, resolved by longest prefix match. */
export function activeHref(pathname: string, hrefs: string[]): string | null {
  let best: string | null = null;
  for (const h of hrefs) {
    if (matchesPath(pathname, h) && (best === null || h.length > best.length)) best = h;
  }
  return best;
}
