import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      console.log('GET - No session cookie found');
      return NextResponse.json({ error: "No session cookie" }, { status: 401 });
    }

    try {
      console.log('GET - Verifying session cookie...');
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      console.log('GET - Session cookie verified, claims:', decodedClaims);
      
      const user = await adminAuth.getUser(decodedClaims.uid);
      console.log('GET - User fetched:', { uid: user.uid, email: user.email, customClaims: user.customClaims });
      
      const userRole = user.customClaims?.role || 'user';
      console.log('GET - Determined user role:', userRole);

      return NextResponse.json({
        status: "success",
        role: userRole,
        user: {
          uid: user.uid,
          email: user.email,
          role: userRole,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      });
    } catch (verifyError) {
      console.error('GET - Session verification failed:', verifyError);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
  } catch (error) {
    console.error('GET - Auth error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      console.error('POST - No ID token provided');
      return NextResponse.json({ error: "No ID token provided" }, { status: 400 });
    }

    try {
      console.log('POST - Verifying ID token...');
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log('POST - ID token verified, claims:', decodedToken);
      
      const user = await adminAuth.getUser(decodedToken.uid);
      console.log('POST - User fetched:', { uid: user.uid, email: user.email, customClaims: user.customClaims });
      
      const userRole = user.customClaims?.role || 'user';
      console.log('POST - Determined user role:', userRole);
      
      // Create session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      console.log('POST - Creating session cookie...');
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

      // Set session cookie
      cookies().set({
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn / 1000, // Convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      console.log('POST - Session cookie set');

      return NextResponse.json({ 
        status: "success",
        role: userRole,
        user: {
          uid: user.uid,
          email: user.email,
          role: userRole,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    } catch (verifyError) {
      console.error('POST - Token verification failed:', verifyError);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error('POST - Auth error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    console.log('DELETE - Removing session cookie');
    const cookieStore = cookies();
    cookieStore.delete('session');
    
    return NextResponse.json({ status: "success" }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('DELETE - Error during logout:', error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}