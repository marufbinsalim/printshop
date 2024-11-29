"use client";

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ticket, Timer } from 'lucide-react';

const tickets = [
  {
    id: 1,
    raffle: 'Premium Tech Bundle',
    ticketNumbers: ['A123', 'A124', 'A125'],
    status: 'active',
    drawDate: '2024-03-15',
    purchaseDate: '2024-02-20',
  },
  {
    id: 2,
    raffle: 'Dream Vacation Package',
    ticketNumbers: ['B456', 'B457'],
    status: 'active',
    drawDate: '2024-03-20',
    purchaseDate: '2024-02-22',
  },
];

export default function TicketsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Tickets</h2>
        <p className="text-muted-foreground">
          View all your active and past raffle tickets.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tickets</p>
              <h3 className="text-2xl font-bold">15</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Timer className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Draw</p>
              <h3 className="text-2xl font-bold">2d 14h</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Raffle</TableHead>
                <TableHead>Ticket Numbers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Draw Date</TableHead>
                <TableHead>Purchase Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.raffle}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.ticketNumbers.length} tickets
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {ticket.ticketNumbers.map((number) => (
                        <Badge key={number} variant="outline">
                          {number}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>{ticket.drawDate}</TableCell>
                  <TableCell>{ticket.purchaseDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}