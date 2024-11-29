// components/auth/role-guard.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
 children: (props: { role: string }) => React.ReactNode;
 allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
 const [role, setRole] = useState<string>('user');
 const [loading, setLoading] = useState(true);
 const router = useRouter();

 useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged(async (user) => {
     if (!user) {
       router.push('/auth/login');
       return;
     }

     try {
       const token = await user.getIdTokenResult();
       const userRole = token.claims.role as string || 'user';

       if (!allowedRoles.includes(userRole)) {
         router.push('/unauthorized');
         return;
       }

       setRole(userRole);
       setLoading(false);
     } catch (error) {
       console.error('Role check error:', error);
       router.push('/unauthorized');
     }
   });

   return () => unsubscribe();
 }, [allowedRoles, router]);

 if (loading) {
   return (
     <div className="flex min-h-screen items-center justify-center">
       <Loader2 className="h-8 w-8 animate-spin" />
     </div>
   );
 }

 return children({ role });
}