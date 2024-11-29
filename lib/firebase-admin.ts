import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Your service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CERT_URL,
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  try {
    const apps = getApps();
    
    if (!apps.length) {
      console.log('Initializing Firebase Admin...');
      initializeApp({
        credential: cert(serviceAccount as any),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
      console.log('Firebase Admin initialized successfully');
    } else {
      console.log('Firebase Admin already initialized');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

// Initialize on module load
initializeFirebaseAdmin();

// Export the admin services
export const adminAuth = getAuth();
export const adminDb = getFirestore();

// Export utility functions for admin operations
export async function verifyAndGetUser(sessionCookie: string) {
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await adminAuth.getUser(decodedClaims.uid);
    return {
      claims: decodedClaims,
      user,
      role: user.customClaims?.role || 'user'
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    throw error;
  }
}

export async function setUserRole(uid: string, role: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { role });
    await adminDb.collection('users').doc(uid).update({
      role,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}

export async function createSessionCookie(idToken: string, expiresIn: number) {
  try {
    return await adminAuth.createSessionCookie(idToken, { expiresIn });
  } catch (error) {
    console.error('Error creating session cookie:', error);
    throw error;
  }
}

// Verify environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
  'FIREBASE_CERT_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
  }
});