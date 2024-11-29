"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Gift, Calendar } from "lucide-react";

const wins = [
  {
    id: 1,
    raffle: "Premium Tech Bundle",
    prize: "MacBook Pro + iPad Pro",
    ticketNumber: "A123",
    drawDate: "2024-02-15",
    status: "claimed",
    value: "$3,500",
  },
  {
    id: 2,
    raffle: "Gaming Paradise",
    prize: "PS5 Gaming Setup",
    ticketNumber: "B456",
    drawDate: "2024-01-20",
    status: "claimed",
    value: "$1,200",
  },
  {
    id: 3,
    raffle: "Travel Dreams",
    prize: "Luxury Vacation Package",
    ticketNumber: "C789",
    drawDate: "2023-12-10",
    status: "claimed",
    value: "$5,000",
  },
];

export default function WinsPage() {
  const totalWinnings = wins.reduce((total, win) => {
    return total + parseInt(win.value.replace(/[^0-9]/g, ""));
  }, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Wins</h2>
        <p className="text-muted-foreground">
          View all your raffle wins and prizes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Wins</p>
              <h3 className="text-2xl font-bold">{wins.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <h3 className="text-2xl font-bold">
                ${totalWinnings.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Win</p>
              <h3 className="text-2xl font-bold">{wins[0].drawDate}</h3>
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
                <TableHead>Prize</TableHead>
                <TableHead>Ticket Number</TableHead>
                <TableHead>Draw Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wins.map((win) => (
                <TableRow key={win.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{win.raffle}</p>
                    </div>
                  </TableCell>
                  <TableCell>{win.prize}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{win.ticketNumber}</Badge>
                  </TableCell>
                  <TableCell>{win.drawDate}</TableCell>
                  <TableCell>
                    <Badge variant="default">{win.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{win.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
