import { useRole } from './useRole';

/**
 * Back-compat shim. "Admin" === founder in the role architecture.
 * Prefer useRole() in new code.
 */
export function useIsAdmin() {
  const { isFounder, loading } = useRole();
  return { isAdmin: isFounder, loading };
}
