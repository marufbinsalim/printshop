'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Clock,
  Users,
  Trophy,
  Share2,
  Heart,
  Info,
  Timer,
  DollarSign,
  Ticket
} from 'lucide-react';
import { toast } from 'sonner';
import AddToCartButton from '@/components/add-to-cart-button';
import { MonthlyTicketNumberSelector } from '@/components/monthly-ticket-number-selector';
import { getRaffle, MonthlyTicketOperations } from '@/lib/firebase/raffles';
import { useAuth } from '@/contexts/auth-context';

interface RaffleDetails {
  id: string;
  title: string;
  description: string;
  type: 'pool' | 'monthly' | 'instant' | 'sequence';
  price: number;
  endDate: string;
  totalTickets: number;
  soldTickets: number;
  images: string[];
  rules: string[];
  prize: {
    title: string;
    value: string;
    details: string[];
  };
}

export default function RaffleDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [raffle, setRaffle] = useState<RaffleDetails | null>(null);
  const [soldNumbers, setSoldNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const params = useParams();

  useEffect(() => {
    async function fetchRaffleData() {
      try {
        setLoading(true);
        const raffleData = await getRaffle(params.id as string);
        setRaffle({
          ...raffleData,
          endDate: raffleData.endDate.toDate().toISOString(),
        });

        // Eğer aylık çekilişse, satılan numaraları getir
        if (raffleData.type === 'monthly') {
          const currentMonth = format(new Date(), 'yyyy-MM');
          const numbers = await MonthlyTicketOperations.getSoldNumbers(currentMonth);
          setSoldNumbers(numbers);
        }
      } catch (error) {
        console.error('Error fetching raffle:', error);
        toast.error('Çekiliş bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    }

    fetchRaffleData();
  }, [params.id]);

  if (loading || !raffle) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleMonthlyTicketPurchase = async (number: number) => {
    if (!user) {
      toast.error('Lütfen önce giriş yapın');
      return;
    }

    try {
      const currentMonth = format(new Date(), 'yyyy-MM');
      await MonthlyTicketOperations.purchaseTicket(
        raffle.id,
        user.uid,
        currentMonth,
        number
      );
      toast.success('Bilet başarıyla satın alındı');
      
      // Satılan numaraları güncelle
      const updatedNumbers = await MonthlyTicketOperations.getSoldNumbers(currentMonth);
      setSoldNumbers(updatedNumbers);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast.error('Bilet alımı başarısız oldu');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Kolon - Görsel ve Galeri */}
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={raffle.images[selectedImage]}
              alt={raffle.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm">Ends {format(new Date(raffle.endDate), 'dd MMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">${raffle.price}/ticket</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {raffle.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-video w-24 rounded-lg overflow-hidden border-2 
                  ${index === selectedImage ? 'border-primary' : 'border-muted'}`}
              >
                <Image
                  src={image}
                  alt={`${raffle.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sağ Kolon - Detaylar ve Satın Alma */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{raffle.title}</h1>
              <Badge variant="secondary">
                {raffle.type === 'monthly' ? 'Aylık Çekiliş' : 
                 raffle.type === 'pool' ? 'Havuz Çekilişi' :
                 raffle.type === 'instant' ? 'Anında Çekiliş' : 'Sıralı Çekiliş'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{raffle.description}</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Ödül Değeri</p>
                  <p className="text-2xl font-bold">{raffle.prize.value}</p>
                </div>
                <Badge variant="secondary" className="text-lg">
                  ${raffle.price} / bilet
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{raffle.soldTickets} bilet satıldı</span>
                  <span>{raffle.totalTickets - raffle.soldTickets} kalan</span>
                </div>
              </div>

              {raffle.type === 'monthly' ? (
                <MonthlyTicketNumberSelector
                  raffleId={raffle.id}
                  month={format(new Date(), 'yyyy-MM')}
                  soldNumbers={soldNumbers}
                  onNumberSelect={handleMonthlyTicketPurchase}
                  price={raffle.price}
                />
              ) : (
                <AddToCartButton
                  raffleId={raffle.id}
                  raffleName={raffle.title}
                  pricePerTicket={raffle.price}
                />
              )}

              <div className="flex justify-between pt-4 border-t text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{raffle.soldTickets} katılımcı</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Kaydet
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="prize">
            <TabsList className="w-full">
              <TabsTrigger value="prize">Ödül Detayları</TabsTrigger>
              <TabsTrigger value="rules">Kurallar</TabsTrigger>
              {raffle.type === 'monthly' && (
                <TabsTrigger value="numbers">Numaralarım</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="prize">
              <Card>
                <CardHeader>
                  <CardTitle>{raffle.prize.title}</CardTitle>
                  <CardDescription>Ödül içeriği</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {raffle.prize.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Çekiliş Kuralları</CardTitle>
                  <CardDescription>Katılmadan önce lütfen okuyun</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {raffle.rules.map((rule, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {raffle.type === 'monthly' && (
              <TabsContent value="numbers">
                <Card>
                  <CardHeader>
                    <CardTitle>Aldığım Numaralar</CardTitle>
                    <CardDescription>Bu ay için satın aldığınız numaralar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="grid grid-cols-5 gap-2">
                        {/* Kullanıcının numaraları burada listelenecek */}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Numaralarınızı görmek için lütfen giriş yapın
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Benzer Çekilişler */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Benzer Çekilişler</h2>
        {/* Benzer çekilişler komponenti buraya gelecek */}
      </div>
    </div>
  );
}