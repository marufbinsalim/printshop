// lib/hooks/useRole.ts
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export type UserRole = 'admin' | 'affiliate' | 'user';

export function useRole() {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        const userRole = token.claims.role as UserRole || 'user';
        setRole(userRole);
      }
      setLoading(false);
    };

    checkRole();
  }, [user]);

  return { role, loading, isAdmin: role === 'admin', isAffiliate: role === 'affiliate' };
}