import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Kullanıcı rollerini enum olarak tanımlayalım
export type UserRole = 'user' | 'admin' | 'affiliate';

// Kullanıcı profil interface'ini güncelleyelim
export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  role: UserRole;
  status: 'active' | 'inactive';
  tickets: number;
  spent: number;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

// Rol bazlı erişim kontrolü için helper fonksiyon
export const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'analytics', 'users', 'settings', 'tickets', 'wins', 'raffles'],
  affiliate: ['dashboard', 'tickets', 'wins', 'raffles'],
  user: ['dashboard', 'raffles']
} as const;

// Signup fonksiyonunu güncelleyelim
export async function signUp(
  email: string, 
  password: string, 
  firstName: string,
  lastName: string,
  phone: string,
  country: string,
  city: string,
  role: UserRole = 'user'
) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      phone,
      country,
      city,
      role,
      status: 'active',
      tickets: 0,
      spent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// Signin fonksiyonunu güncelleyelim
export async function signIn(email: string, password: string) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() as UserProfile;

    // Son giriş zamanını güncelle
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date()
    });

    return userData;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Önce custom claims'i kontrol et
    const tokenResult = await user.getIdTokenResult();
    console.log('Token claims:', tokenResult.claims);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    
    // Custom claims'deki role ile Firestore'daki role'ü karşılaştır
    const customClaimsRole = tokenResult.claims.role as UserRole;
    if (customClaimsRole && customClaimsRole !== userData.role) {
      await updateDoc(doc(db, 'users', user.uid), {
        role: customClaimsRole,
        updatedAt: new Date()
      });
      userData.role = customClaimsRole;
    }

    return {
      uid: user.uid,
      email: user.email!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      country: userData.country || '',
      city: userData.city || '',
      role: userData.role,
      status: userData.status || 'active',
      tickets: userData.tickets || 0,
      spent: userData.spent || 0,
      createdAt: userData.createdAt?.toDate(),
      updatedAt: userData.updatedAt?.toDate(),
      lastLogin: userData.lastLogin?.toDate()
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUserRole(uid: string, newRole: UserRole) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      role: newRole,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

export async function checkUserPermission(permission: string): Promise<boolean> {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) return false;

    const allowedPermissions = ROLE_PERMISSIONS[userProfile.role];
    return allowedPermissions.includes(permission as any);
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
}

export function onAuthStateChange(callback: (user: User | null, profile: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getCurrentUserProfile();
      callback(user, profile);
    } else {
      callback(null, null);
    }
  });
}

export async function hasRequiredRole(requiredRoles: UserRole[]): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) return false;
    return requiredRoles.includes(profile.role);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}