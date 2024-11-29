import { Card } from '@/components/ui/card';
import { Trophy, Calendar, Ticket } from 'lucide-react';

export default function WinnersPage() {
  const winners = [
    {
      id: 1,
      raffle: 'Premium Tech Bundle',
      winner: 'John Smith',
      ticket: '12345',
      date: '2024-02-15',
      prize: 'MacBook Pro Bundle',
    },
    {
      id: 2,
      raffle: 'Dream Vacation',
      winner: 'Sarah Johnson',
      ticket: '67890',
      date: '2024-02-01',
      prize: 'Luxury Resort Package',
    },
    {
      id: 3,
      raffle: 'Gaming Paradise',
      winner: 'Mike Brown',
      ticket: '11223',
      date: '2024-01-15',
      prize: 'PS5 Gaming Setup',
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Recent Winners</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Congratulations to all our lucky winners! Check out who won our recent raffles
          and get inspired for your next entry.
        </p>
      </div>

      <div className="grid gap-6">
        {winners.map((winner) => (
          <Card key={winner.id} className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{winner.raffle}</h3>
                <p className="text-muted-foreground mb-4">
                  Congratulations to {winner.winner} for winning the {winner.prize}!
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Draw Date: {winner.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ticket className="h-4 w-4" />
                    <span>Winning Ticket: #{winner.ticket}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}