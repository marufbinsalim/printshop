import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Timer, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background bg-[url('https://cdn.pixabay.com/photo/2024/04/27/21/17/ai-generated-8724363_960_720.jpg')] bg-cover">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-700">
            Büyük Ödül Kazanmak ister misin?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of winners in our exciting online raffles. Fair,
            transparent, and life-changing prizes await!
          </p>
          <Button size="lg" asChild>
            <Link href="/raffles">Explore Raffles</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Trophy className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Guaranteed Winners</h3>
              <p className="text-muted-foreground">
                Every raffle has a winner. Your chances are better than ever!
              </p>
            </Card>
            <Card className="p-6">
              <Timer className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Regular Draws</h3>
              <p className="text-muted-foreground">
                New raffles every week with exciting prizes to be won.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Growing Community</h3>
              <p className="text-muted-foreground">
                Join thousands of happy winners in our trusted community.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Raffles Preview */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Raffles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted bg-[url('https://cdn.pixabay.com/photo/2023/11/08/13/39/ai-generated-8374775_960_720.jpg')]" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Premium Prize Pack #{i}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Win an amazing collection of premium prizes worth $1,000+
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Tickets from $10
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
