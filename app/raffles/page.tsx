'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Timer, DollarSign } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { TicketSelector } from '@/components/ticket-selector';

// Çekiliş türleri ve açıklamaları
const RAFFLE_TYPES = {
  pool: {
    label: 'Havuz Çekilişleri',
    description: 'Ortak havuzda biletler toplanır, kazanan şanslı bilet seçilir',
    badge: 'Havuz'
  },
  monthly: {
    label: 'Aylık Çekilişler',
    description: 'Her ay düzenli olarak yapılan çekilişler',
    badge: 'Aylık'
  },
  instant: {
    label: 'Anında Çekilişler',
    description: 'Hemen sonuç alın, anında kazanma şansı',
    badge: 'Anında'
  },
  sequence: {
    label: 'Sıralı Numaralar',
    description: 'Şanslı numaranızı seçin ve kazanma şansı yakalayın',
    badge: 'Sıralı'
  }
};

interface RaffleData {
  id: string;
  title: string;
  description: string;
  type: keyof typeof RAFFLE_TYPES;
  price: number;
  endDate: Date;
  totalTickets: number;
  soldTickets: number;
  status: 'active' | 'completed' | 'upcoming';
  images?: string[];
}

export default function RafflesPage() {
  const [raffles, setRaffles] = useState<RaffleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | keyof typeof RAFFLE_TYPES>('all');
  const [sortBy, setSortBy] = useState<'price' | 'endDate' | 'popularity'>('endDate');

  useEffect(() => {
    async function fetchRaffles() {
      try {
        setLoading(true);
        console.log('Fetching raffles...');
        
        const rafflesRef = collection(db, 'raffles');
        let q = query(rafflesRef);

        if (selectedType !== 'all') {
          q = query(q, where('type', '==', selectedType));
        }

        const querySnapshot = await getDocs(q);
        console.log('Found documents:', querySnapshot.size);

        const raffleData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Document data:', data);
          return {
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            type: data.type || 'pool',
            price: data.price || 0,
            endDate: data.endDate?.toDate() || new Date(),
            totalTickets: data.totalTickets || 1000,
            soldTickets: data.soldTickets || 0,
            status: data.status || 'active',
            images: data.images || []
          };
        });

        console.log('Processed raffle data:', raffleData);
        setRaffles(raffleData);
      } catch (error) {
        console.error('Error fetching raffles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRaffles();
  }, [selectedType, sortBy]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Aktif Çekilişler</h1>
          <p className="text-muted-foreground">İstediğiniz çekiliş türünü seçin</p>
        </div>
        
        {/* Sıralama Seçimi */}
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sıralama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Fiyat: Düşükten Yükseğe</SelectItem>
            <SelectItem value="endDate">Bitiş Tarihi</SelectItem>
            <SelectItem value="popularity">En Popüler</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Çekiliş Türü Sekmeleri */}
      <Tabs 
        defaultValue="all" 
        value={selectedType} 
        onValueChange={(value: any) => setSelectedType(value)}
        className="space-y-4"
      >
        <div className="border-b">
          <TabsList className="w-full h-auto p-0 bg-transparent gap-6">
            <TabsTrigger 
              value="all"
              className="border-b-2 border-transparent data-[state=active]:border-primary pb-4 rounded-none"
            >
              Tüm Çekilişler
            </TabsTrigger>
            {Object.entries(RAFFLE_TYPES).map(([type, info]) => (
              <TabsTrigger
                key={type}
                value={type}
                className="border-b-2 border-transparent data-[state=active]:border-primary pb-4 rounded-none"
              >
                {info.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all">
          <p className="text-muted-foreground mb-6">
            Tüm aktif çekilişleri görüntüleyin
          </p>
        </TabsContent>

        {Object.entries(RAFFLE_TYPES).map(([type, info]) => (
          <TabsContent key={type} value={type}>
            <p className="text-muted-foreground mb-6">{info.description}</p>
          </TabsContent>
        ))}
      </Tabs>

      {/* Çekilişler Listesi */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : raffles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedType === 'all' 
              ? 'Henüz aktif çekiliş bulunmuyor.' 
              : 'Bu tipte aktif çekiliş bulunmuyor.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raffles.map((raffle) => (
            <Card key={raffle.id} className="flex flex-col hover:shadow-lg transition-shadow group">
              {/* Çekiliş Görseli ve Başlık */}
              <Link href={`/raffles/${raffle.id}`} className="contents">
                <div className="aspect-video bg-muted relative">
                  <Badge 
                    className="absolute top-4 left-4" 
                    variant="secondary"
                  >
                    {RAFFLE_TYPES[raffle.type]?.badge || raffle.type}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        <span className="text-sm">
                          {raffle.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">${raffle.price}/bilet</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{raffle.title}</h2>
                  <p className="text-muted-foreground mb-4 flex-1">
                    {raffle.description}
                  </p>
                </div>
              </Link>
              
              {/* İlerleme ve Bilet Seçimi */}
              <div className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-2 transition-all"
                      style={{ 
                        width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{raffle.soldTickets} bilet satıldı</span>
                    <span>{raffle.totalTickets - raffle.soldTickets} kalan</span>
                  </div>
                </div>
                
                <TicketSelector
                  raffleId={raffle.id}
                  raffleName={raffle.title}
                  pricePerTicket={raffle.price}
                  maxTickets={50}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}