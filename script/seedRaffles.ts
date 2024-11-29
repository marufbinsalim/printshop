// scripts/seedRaffles.ts
import { createRaffle, RaffleType } from '@/lib/firebase/raffles';

const sampleRaffles = [
  {
    title: "Premium Tech Bundle",
    description: "MacBook Pro, iPad ve AirPods Pro dahil en son teknoloji ürünlerini kazanma şansı yakalayın!",
    type: "pool" as RaffleType,
    price: 25,
    endDate: new Date("2024-04-15"),
    totalTickets: 1000,
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
    type: "monthly" as RaffleType,
    price: 50,
    endDate: new Date("2024-05-01"),
    totalTickets: 500,
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
  },
  {
    title: "Anında iPhone 15 Pro",
    description: "Hemen katıl, anında kazan! iPhone 15 Pro kazanma şansını yakala.",
    type: "instant" as RaffleType,
    price: 10,
    endDate: new Date("2024-04-10"),
    totalTickets: 2000,
    images: ["/api/placeholder/800/600"],
    rules: [
      "Anında sonuç öğrenme",
      "Her bilet tek şans",
      "Maksimum 10 bilet alınabilir",
      "Kazanan aynı gün açıklanır"
    ],
    prize: {
      title: "iPhone 15 Pro",
      value: 1200,
      details: [
        "iPhone 15 Pro 256GB",
        "Apple Care+",
        "Orijinal kılıf",
        "Hızlı şarj adaptörü"
      ]
    },
    drawType: {
      type: "instant",
      details: {}
    }
  },
  {
    title: "Şanslı Numaralar",
    description: "Kendi şanslı numaranızı seçin, büyük ödülü kazanın!",
    type: "sequence" as RaffleType,
    price: 15,
    endDate: new Date("2024-04-20"),
    totalTickets: 1000,
    images: ["/api/placeholder/800/600"],
    rules: [
      "1-1000 arası numara seçimi",
      "Her numara benzersizdir",
      "Birden fazla numara alınabilir",
      "Çekiliş canlı yayında yapılır"
    ],
    prize: {
      title: "Para Ödülü",
      value: 5000,
      details: [
        "50.000 TL nakit ödül",
        "Anında hesaba transfer",
        "Vergiler dahil"
      ]
    },
    drawType: {
      type: "sequence",
      details: {
        sequence: Array.from({length: 1000}, (_, i) => i + 1)
      }
    }
  }
];

// Verileri Firebase'e ekleyen fonksiyon
export async function seedRaffles() {
  try {
    for (const raffle of sampleRaffles) {
      await createRaffle(raffle);
      console.log(`Created raffle: ${raffle.title}`);
    }
    console.log('All raffles created successfully!');
  } catch (error) {
    console.error('Error seeding raffles:', error);
  }
}