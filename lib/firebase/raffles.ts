import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export type RaffleType = 'pool' | 'monthly' | 'instant' | 'sequence';

export interface Raffle {
  id: string;
  title: string;
  description: string;
  type: RaffleType;
  price: number;
  endDate: Date;
  totalTickets: number;
  soldTickets: number;
  status: 'active' | 'completed' | 'upcoming';
  images: string[];
  rules: string[];
  prize: {
    title: string;
    value: number;
    details: string[];
  };
  drawType: {
    type: RaffleType;
    details: {
      poolSize?: number;
      drawDate?: Date;
      sequence?: number[];
      interval?: 'monthly' | 'weekly';
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Monthly ticket interface
export interface MonthlyTicket {
  id: string;
  raffleId: string;
  userId: string;
  month: string; // Format: YYYY-MM
  number: number;
  purchaseDate: Date;
  status: 'active' | 'used' | 'expired';
  transactionId: string;
}

// Raffle oluşturma
export async function createRaffle(raffleData: Omit<Raffle, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const raffleRef = await addDoc(collection(db, 'raffles'), {
      ...raffleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      soldTickets: 0,
      status: 'upcoming'
    });

    return raffleRef.id;
  } catch (error) {
    console.error('Error creating raffle:', error);
    throw error;
  }
}

// Tek bir raffle getir
export async function getRaffle(raffleId: string) {
  try {
    const raffleDoc = await getDoc(doc(db, 'raffles', raffleId));
    if (!raffleDoc.exists()) {
      throw new Error('Raffle not found');
    }
    return { id: raffleDoc.id, ...raffleDoc.data() } as Raffle;
  } catch (error) {
    console.error('Error fetching raffle:', error);
    throw error;
  }
}

// Aktif raffleleri getir
export async function getActiveRaffles(type?: RaffleType, sortBy: string = 'endDate') {
  try {
    let q = query(
      collection(db, 'raffles'),
      where('status', '==', 'active')
    );

    if (type) {
      q = query(q, where('type', '==', type));
    }

    switch (sortBy) {
      case 'price':
        q = query(q, orderBy('price', 'asc'));
        break;
      case 'endDate':
        q = query(q, orderBy('endDate', 'asc'));
        break;
      case 'popularity':
        q = query(q, orderBy('soldTickets', 'desc'));
        break;
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Raffle[];
  } catch (error) {
    console.error('Error fetching active raffles:', error);
    throw error;
  }
}

// Raffle güncelle
export async function updateRaffle(raffleId: string, updateData: Partial<Raffle>) {
  try {
    const raffleRef = doc(db, 'raffles', raffleId);
    await updateDoc(raffleRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating raffle:', error);
    throw error;
  }
}

// Bilet satın alma
export async function purchaseTickets(raffleId: string, numberOfTickets: number) {
  try {
    const raffleRef = doc(db, 'raffles', raffleId);
    const raffleDoc = await getDoc(raffleRef);

    if (!raffleDoc.exists()) {
      throw new Error('Raffle not found');
    }

    const raffleData = raffleDoc.data();
    const newSoldTickets = (raffleData.soldTickets || 0) + numberOfTickets;

    if (newSoldTickets > raffleData.totalTickets) {
      throw new Error('Not enough tickets available');
    }

    await updateDoc(raffleRef, {
      soldTickets: newSoldTickets,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error purchasing tickets:', error);
    throw error;
  }
}

// Raffle tipine göre özel işlemler
export const RaffleTypeOperations = {
  pool: {
    validatePurchase: (raffle: Raffle, ticketCount: number) => {
      return ticketCount <= (raffle.drawType.details.poolSize || 0);
    },
    processTickets: async (raffleId: string, userId: string, ticketCount: number) => {
      // Pool tipi için özel işlemler
    }
  },
  monthly: {
    validatePurchase: (raffle: Raffle, ticketCount: number) => {
      return true; // Aylık çekilişlerde özel kısıtlama yok
    },
    processTickets: async (raffleId: string, userId: string, ticketCount: number) => {
      // Aylık çekiliş için özel işlemler
    }
  },
  instant: {
    validatePurchase: (raffle: Raffle, ticketCount: number) => {
      return ticketCount === 1; // Anında çekilişlerde tek bilet
    },
    processTickets: async (raffleId: string, userId: string, ticketCount: number) => {
      // Anında çekiliş için özel işlemler
    }
  },
  sequence: {
    validatePurchase: (raffle: Raffle, ticketNumbers: number[]) => {
      return ticketNumbers.every(num => 
        raffle.drawType.details.sequence?.includes(num)
      );
    },
    processTickets: async (raffleId: string, userId: string, ticketNumbers: number[]) => {
      // Sıralı numara için özel işlemler
    }
  }
};

// Monthly Ticket Operations - Aylık bilet işlemleri
export const MonthlyTicketOperations = {
  // Belirli bir ay için satılmış numaraları getir
  getSoldNumbers: async (month: string) => {
    try {
      const ticketsRef = collection(db, 'monthlyTickets');
      const q = query(
        ticketsRef,
        where('month', '==', month),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data().number);
    } catch (error) {
      console.error('Error fetching sold numbers:', error);
      throw error;
    }
  },

  // Kullanıcının belirli bir aydaki biletlerini getir
  getUserTickets: async (userId: string, month: string) => {
    try {
      const ticketsRef = collection(db, 'monthlyTickets');
      const q = query(
        ticketsRef,
        where('userId', '==', userId),
        where('month', '==', month),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MonthlyTicket[];
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  },

  // Aylık bilet satın al
  purchaseTicket: async (
    raffleId: string, 
    userId: string, 
    month: string,
    number: number
  ) => {
    try {
      // Transaction ile atomic işlem yap
      return await runTransaction(db, async (transaction) => {
        // Numara müsait mi kontrol et
        const ticketsRef = collection(db, 'monthlyTickets');
        const q = query(
          ticketsRef,
          where('month', '==', month),
          where('number', '==', number),
          where('status', '==', 'active')
        );
        
        const ticketSnapshot = await transaction.get(q);
        if (!ticketSnapshot.empty) {
          throw new Error('Bu numara daha önce alınmış');
        }

        // Yeni bilet oluştur
        const newTicketRef = doc(ticketsRef);
        transaction.set(newTicketRef, {
          id: newTicketRef.id,
          raffleId,
          userId,
          month,
          number,
          purchaseDate: serverTimestamp(),
          status: 'active',
          transactionId: uuidv4()
        });

        // Raffle dökümanını güncelle
        const raffleRef = doc(db, 'raffles', raffleId);
        const raffleDoc = await transaction.get(raffleRef);
        if (!raffleDoc.exists()) {
          throw new Error('Raffle not found');
        }

        transaction.update(raffleRef, {
          soldTickets: increment(1),
          updatedAt: serverTimestamp()
        });

        return newTicketRef.id;
      });
    } catch (error) {
      console.error('Error purchasing monthly ticket:', error);
      throw error;
    }
  },

  // Bilet durumunu güncelle
  updateTicketStatus: async (ticketId: string, status: MonthlyTicket['status']) => {
    try {
      const ticketRef = doc(db, 'monthlyTickets', ticketId);
      await updateDoc(ticketRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  },

  // Ay sonu çekilişi için tüm aktif biletleri getir
  getActiveTicketsForDraw: async (month: string) => {
    try {
      const ticketsRef = collection(db, 'monthlyTickets');
      const q = query(
        ticketsRef,
        where('month', '==', month),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MonthlyTicket[];
    } catch (error) {
      console.error('Error fetching tickets for draw:', error);
      throw error;
    }
  }
};