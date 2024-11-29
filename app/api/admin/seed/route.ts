// app/api/admin/seed/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const sampleRaffles = [
  {
    title: "Premium Tech Bundle",
    description: "MacBook Pro, iPad ve AirPods Pro dahil en son teknoloji ürünlerini kazanma şansı yakalayın!",
    type: "pool",
    price: 25,
    endDate: new Date("2024-04-15"),
    totalTickets: 1000,
    soldTickets: 0,
    status: 'active',
    images: ["/api/placeholder/800/600"],
    rules: [
      "18 yaş üzeri katılabilir",
      "Maksimum 50 bilet alınabilir",
      "Çekiliş sonuçları 24 saat içinde açıklanır",
      "Dünya çapında kargo ücretsizdir"
    ],
    prize: {
      title: "Premium Tech Bundle",
      value: 3500,
      details: [
        "MacBook Pro M2 14-inch",
        "iPad Air 5. Nesil",
        "AirPods Pro 2. Nesil",
        "Apple Care+ tüm cihazlar için"
      ]
    },
    drawType: {
      type: "pool",
      details: {
        poolSize: 1000
      }
    }
  },
  {
    title: "Lüks Tatil Paketi",
    description: "Maldivler'de 7 gün her şey dahil 5 yıldızlı tatil fırsatı!",
    type: "monthly",
    price: 50,
    endDate: new Date("2024-05-01"),
    totalTickets: 500,
    soldTickets: 0,
    status: 'active',
    images: ["/api/placeholder/800/600"],
    rules: [
      "18 yaş üzeri katılabilir",
      "Her ay 1 kazanan belirlenir",
      "Rezervasyon 1 yıl içinde kullanılmalıdır",
      "Uçak bileti dahildir"
    ],
    prize: {
      title: "Maldivler Tatili",
      value: 8000,
      details: [
        "7 gece lüks villa konaklama",
        "Her şey dahil konsept",
        "Business class uçak bileti",
        "Özel transfer hizmeti"
      ]
    },
    drawType: {
      type: "monthly",
      details: {
        interval: "monthly"
      }
    }
  }
];

export async function POST() {
  try {
    const rafflesRef = collection(db, 'raffles');
    
    for (const raffle of sampleRaffles) {
      await addDoc(rafflesRef, {
        ...raffle,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Sample raffles added successfully'
    });
  } catch (error: any) {
    console.error('Error seeding raffles:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}