import { useAuth } from './useAuth';
import { Role, roleForEmail } from '@/lib/roles';

/**
 * Canonical role hook. Resolves the signed-in user's role (founder | student)
 * from their email via the role middleware. `role` is null while unauthenticated.
 */
export function useRole() {
  const { user, loading } = useAuth();
  const role: Role | null = user ? roleForEmail(user.email) : null;
  return {
    role,
    isFounder: role === 'founder',
    isStudent: role === 'student',
    loading,
  };
}
