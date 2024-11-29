import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

// İlk admin için güvenli bir endpoint
const ADMIN_EMAILS = ['anl@anl.com']; // Admin email adresleri

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      console.log('GET - No email provided');
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    console.log('GET - Checking admin status for email:', email);

    try {
      const user = await adminAuth.getUserByEmail(email);
      console.log('GET - Found user:', user.uid);

      const { customClaims } = await adminAuth.getUser(user.uid);
      console.log('GET - User claims:', customClaims);

      return NextResponse.json({
        isAdmin: customClaims?.role === 'admin',
        claims: customClaims,
        email: email
      });
    } catch (error: any) {
      console.error('GET - Error getting user:', error);
      return NextResponse.json({ 
        error: error.message,
        code: error.code
      }, { status: 404 });
    }
  } catch (error: any) {
    console.error('GET - Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('POST - Attempting to set admin for email:', email);

    if (!email) {
      console.log('POST - No email provided');
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Development mode: allow any email
    if (process.env.NODE_ENV === 'development') {
      console.log('POST - Development mode: allowing any email');
    } else if (!ADMIN_EMAILS.includes(email)) {
      console.log('POST - Unauthorized email attempt:', email);
      return NextResponse.json({ error: "Unauthorized email" }, { status: 401 });
    }

    try {
      // Get user by email
      const user = await adminAuth.getUserByEmail(email);
      console.log('POST - Found user:', user.uid);

      // Check current claims
      const { customClaims } = await adminAuth.getUser(user.uid);
      console.log('POST - Current claims:', customClaims);

      // Set admin role in Auth
      await adminAuth.setCustomUserClaims(user.uid, { role: 'admin' });
      console.log('POST - Set admin claims for user:', user.uid);

      // Update or create user document in Firestore
      const userRef = adminDb.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // Create new user document
        await userRef.set({
          email: user.email,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('POST - Created new user document');
      } else {
        // Update existing document
        await userRef.update({
          role: 'admin',
          updatedAt: new Date()
        });
        console.log('POST - Updated existing user document');
      }

      // Force token refresh
      await adminAuth.revokeRefreshTokens(user.uid);
      console.log('POST - Revoked refresh tokens');

      return NextResponse.json({ 
        success: true,
        message: `${email} is now an admin`,
        user: {
          uid: user.uid,
          email: user.email,
          role: 'admin'
        }
      });

    } catch (error: any) {
      console.error('POST - Error setting admin:', error);
      return NextResponse.json({ 
        error: error.message,
        code: error.code
      }, { status: error.code === 'auth/user-not-found' ? 404 : 500 });
    }

  } catch (error: any) {
    console.error('POST - Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}