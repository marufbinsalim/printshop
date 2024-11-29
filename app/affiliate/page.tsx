'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Users,
  LineChart,
  Share2,
  Gift,
  CheckCircle2,
  Clock,
  Wallet,
  ThumbsUp,
  ChevronRight,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export default function AffiliatePage() {
  const { user } = useAuth();
  const [referralCount, setReferralCount] = useState<number>(10);
  const [avgPurchase, setAvgPurchase] = useState<number>(100);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  // Kazanç hesaplayıcı
  const calculateEarnings = () => {
    const commission = 0.15; // %15 komisyon
    const monthlyEarning = referralCount * avgPurchase * commission;
    const yearlyEarning = monthlyEarning * 12;
    return {
      monthly: monthlyEarning,
      yearly: yearlyEarning
    };
  };

  const earnings = calculateEarnings();

  const handleApplicationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast.error('Başvuru yapabilmek için giriş yapmalısınız');
      return;
    }
    // Başvuru işlemleri burada yapılacak
    toast.success('Başvurunuz başarıyla alındı');
    setIsApplicationDialogOpen(false);
  };

  return (
   
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
              RaffleWin Affiliate Programı
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up delay-150">
              Her başarılı referans için %15 komisyon kazanın. 
              Sınırsız kazanç potansiyeli ile kendi işinizin patronu olun.
            </p>
            <div className="space-x-4 animate-fade-up delay-300">
              <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    Hemen Başvur
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Affiliate Başvurusu</DialogTitle>
                    <DialogDescription>
                      Affiliate programımıza katılmak için formu doldurun. 
                      24 saat içinde başvurunuzu değerlendireceğiz.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="website">Web Siteniz veya Sosyal Medya Hesabınız</Label>
                      <Input id="website" placeholder="https://" required />
                    </div>
                    <div>
                      <Label htmlFor="experience">Deneyiminiz</Label>
                      <Input id="experience" placeholder="Affiliate pazarlama deneyiminiz" required />
                    </div>
                    <div>
                      <Label htmlFor="plans">Planlarınız</Label>
                      <Input id="plans" placeholder="RaffleWin'i nasıl tanıtmayı planlıyorsunuz?" required />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Başvuruyu Gönder</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button size="lg" variant="outline">
                Detaylı Bilgi
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="container mx-auto px-4 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Toplam Affiliate", value: "5,000+", icon: Users },
              { label: "Ödenen Komisyon", value: "₺1.5M+", icon: DollarSign },
              { label: "Ortalama Kazanç", value: "₺5,000/ay", icon: LineChart },
              { label: "Başarı Oranı", value: "%92", icon: ThumbsUp }
            ].map((stat, index) => (
              <Card key={index} className="bg-background/60 backdrop-blur">
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-20" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Share2,
                title: "Davet Et",
                description: "Benzersiz referans kodunuzu paylaşın ve takipçilerinizi RaffleWin'e yönlendirin."
              },
              {
                icon: Users,
                title: "Büyüt",
                description: "Referanslarınız üye olsun ve çekilişlere katılsın. Her katılımdan komisyon kazanın."
              },
              {
                icon: DollarSign,
                title: "Kazan",
                description: "Her işlemden %15 komisyon elde edin. Haftalık ödemelerle kazancınızı hemen alın."
              }
            ].map((step, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kazanç Hesaplayıcı */}
      <section className="py-20 bg-muted/50" id="calculator">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Kazanç Hesaplayıcı
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Potansiyel Kazancınızı Hesaplayın</CardTitle>
                <CardDescription>
                  Referanslarınızdan elde edebileceğiniz tahmini geliri hesaplayın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="referralCount">Aylık Referans Sayısı</Label>
                    <Input
                      id="referralCount"
                      type="number"
                      value={referralCount}
                      onChange={(e) => setReferralCount(Number(e.target.value))}
                      min="1"
                      max="1000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgPurchase">Ortalama Alışveriş Tutarı (₺)</Label>
                    <Input
                      id="avgPurchase"
                      type="number"
                      value={avgPurchase}
                      onChange={(e) => setAvgPurchase(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Aylık Kazanç</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">
                        ₺{earnings.monthly.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Yıllık Kazanç</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">
                        ₺{earnings.yearly.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="py-20" id="benefits">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Affiliate Avantajları</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Yüksek Komisyon",
                description: "Her işlemden %15 komisyon kazancı"
              },
              {
                icon: Clock,
                title: "Hızlı Ödemeler",
                description: "Haftalık düzenli ödemeler"
              },
              {
                icon: Gift,
                title: "Bonus Fırsatları",
                description: "Aylık performans bonusları"
              },
              {
                icon: ThumbsUp,
                title: "Kolay Kullanım",
                description: "Kullanıcı dostu panel ve araçlar"
              },
              {
                icon: LineChart,
                title: "Detaylı Raporlama",
                description: "Gerçek zamanlı performans takibi"
              },
              {
                icon: Users,
                title: "Özel Destek",
                description: "7/24 affiliate destek hizmeti"
              },
              {
                icon: Share2,
                title: "Pazarlama Araçları",
                description: "Hazır promosyon materyalleri"
              },
              {
                icon: Wallet,
                title: "Esnek Ödemeler",
                description: "Minimum ödeme limiti yok"
              }
            ].map((advantage, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </div>
      
    ); // Closing parenthesis for return
} 