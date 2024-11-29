// app/draw-results/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Trophy, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DrawResult {
  id: string;
  title: string;
  date: string;
  winningNumbers: string[];
  prize: {
    title: string;
    value: string;
  };
  winners: {
    name: string;
    ticketNumber: string;
    prize: string;
  }[];
  totalParticipants: number;
  totalTickets: number;
}

const MOCK_RESULTS: DrawResult[] = [
  {
    id: '1',
    title: 'Premium Tech Bundle',
    date: '2024-03-15',
    winningNumbers: ['123456', '789012', '345678'],
    prize: {
      title: 'iPhone 15 Pro Max',
      value: '$1,199'
    },
    winners: [
      { name: 'John Doe', ticketNumber: '123456', prize: '1st Prize' },
      { name: 'Jane Smith', ticketNumber: '789012', prize: '2nd Prize' },
      { name: 'Mike Johnson', ticketNumber: '345678', prize: '3rd Prize' }
    ],
    totalParticipants: 1250,
    totalTickets: 5000
  },
  // ... daha fazla örnek veri eklenebilir
];

export default function DrawResultsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Draw Results</h1>
          <p className="text-muted-foreground">View all past raffle results and winners</p>
        </div>
        
        <div className="flex gap-4">
          <div className="w-[200px]">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="march">March 2024</SelectItem>
                <SelectItem value="february">February 2024</SelectItem>
                <SelectItem value="january">January 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search draws..." />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {MOCK_RESULTS.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{result.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(result.date).toLocaleDateString()}</span>
                    <Users className="h-4 w-4 ml-2" />
                    <span>{result.totalParticipants} participants</span>
                    <Trophy className="h-4 w-4 ml-2" />
                    <span>{result.totalTickets} tickets</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {result.prize.value}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Winning Numbers</h3>
                  <div className="flex gap-2">
                    {result.winningNumbers.map((number, index) => (
                      <Badge key={index} variant="outline" className="text-lg px-4 py-1">
                        {number}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Winners</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prize</TableHead>
                        <TableHead>Winner</TableHead>
                        <TableHead>Ticket Number</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.winners.map((winner, index) => (
                        <TableRow key={index}>
                          <TableCell>{winner.prize}</TableCell>
                          <TableCell>{winner.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{winner.ticketNumber}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}