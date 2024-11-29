// lib/auth-helpers.ts
import { auth } from './firebase';

export const setAuthCookie = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    document.cookie = `auth-token=${token}; path=/;`;
  }
};

export const clearAuthCookie = () => {
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};