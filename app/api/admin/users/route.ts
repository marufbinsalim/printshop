import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Get all users
export async function GET(request: Request) {
  try {
    // Verify admin session
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const adminUser = await adminAuth.getUser(decodedClaims.uid);
    
    if (!adminUser.customClaims?.role || adminUser.customClaims.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all users from Firestore
    const usersSnapshot = await adminDb.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update user
export async function PUT(request: Request) {
  try {
    // Verify admin session
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const adminUser = await adminAuth.getUser(decodedClaims.uid);
    
    if (!adminUser.customClaims?.role || adminUser.customClaims.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, userData } = await request.json();

    // Update user in Firestore
    await adminDb.collection('users').doc(userId).update({
      ...userData,
      updatedAt: new Date()
    });

    // Update user role in Firebase Auth if it changed
    if (userData.role) {
      await adminAuth.setCustomUserClaims(userId, { role: userData.role });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}