// app/api/admin/set-role/route.ts
import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    
    // Custom claims'i güncelle
    await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting custom claims:', error);
    return NextResponse.json({ error: "Failed to set custom claims" }, { status: 500 });
  }
}