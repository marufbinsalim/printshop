// contexts/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile } from '@/lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  role: string;
  setSession: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthorized: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  role: 'user',
  setSession: async () => {},
  signOut: async () => {},
  isAuthorized: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  // Tek useEffect ile auth durumunu yönet
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser?.email);

      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken(true);
          const tokenResult = await firebaseUser.getIdTokenResult();

          // Session ve auth durumunu güncelle
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({ idToken }),
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Session data:', data);

            setUser(firebaseUser);
            setUserProfile(data.user);
            setRole(data.role || tokenResult.claims.role || 'user');
          } else {
            throw new Error('Failed to verify session');
          }
        } catch (error) {
          console.error('Auth/Session error:', error);
          // Hata durumunda state'i temizle
          setUser(null);
          setUserProfile(null);
          setRole('user');
        }
      } else {
        // Kullanıcı çıkış yaptığında state'i temizle
        setUser(null);
        setUserProfile(null);
        setRole('user');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setSession = async (idToken: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to set session');
      }

      const data = await response.json();
      console.log('Session data:', data);

      if (data.user) {
        setUserProfile(data.user);
        setRole(data.role || 'user');
      }
    } catch (error) {
      console.error('Set session error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Firebase'den çıkış yap
      await auth.signOut();

      // Session'ı temizle
      await fetch('/api/auth/verify', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      // State'i temizle
      setUser(null);
      setUserProfile(null);
      setRole('user');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const isAuthorized = (allowedRoles: string[]): boolean => {
    if (!allowedRoles?.length) return false;

    const authorized =
      !loading &&
      user !== null &&
      userProfile !== null &&
      allowedRoles.includes(role);

    console.log('Authorization check:', {
      allowedRoles,
      currentRole: role,
      authorized,
      userEmail: user?.email,
      hasUser: !!user,
      hasProfile: !!userProfile,
      isLoading: loading,
    });

    return authorized;
  };

  // Loading durumunda spinner göster
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        role,
        setSession,
        signOut,
        isAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthorization(allowedRoles: string[]) {
  const { isAuthorized, loading } = useAuth();
  const authorized = isAuthorized(allowedRoles);
  return { isAuthorized: authorized, loading };
}
