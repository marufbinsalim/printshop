// app/api/analytics/dashboard/route.ts
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Demo data - gerçek veriyi Firestore'dan çekeceğiz
    const mockData = {
      stats: {
        totalUsers: 2456,
        totalRevenue: 45678,
        activeRaffles: 12,
        totalTickets: 8965,
      },
      salesData: [
        { date: "Mon", amount: 1200 },
        { date: "Tue", amount: 1800 },
        { date: "Wed", amount: 2400 },
        { date: "Thu", amount: 1600 },
        { date: "Fri", amount: 2800 },
        { date: "Sat", amount: 3200 },
        { date: "Sun", amount: 2600 },
      ],
      latestActivities: [
        {
          title: 'Premium Tech Bundle',
          date: '2024-03-15',
          ticketCount: 5,
          totalTickets: 1000,
          soldTickets: 456,
        },
        {
          title: 'Dream Vacation Package',
          date: '2024-03-20',
          ticketCount: 2,
          totalTickets: 500,
          soldTickets: 289,
        },
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}