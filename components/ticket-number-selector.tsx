"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface TicketNumberSelectorProps {
  raffleId: number;
  onSelect: (numbers: number[]) => void;
  selectedCount: number;
}

// Simulated sold tickets - in a real app, this would come from your database
const soldTickets = new Set([1, 5, 10, 15, 20, 25, 30, 35, 40, 45]);

export function TicketNumberSelector({
  raffleId,
  onSelect,
  selectedCount,
}: TicketNumberSelectorProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [customNumber, setCustomNumber] = useState('');

  const handleNumberSelect = (number: number) => {
    if (soldTickets.has(number)) {
      toast.error(`Ticket number ${number} is already sold`);
      return;
    }

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else if (selectedNumbers.length < selectedCount) {
      setSelectedNumbers([...selectedNumbers, number].sort((a, b) => a - b));
    } else {
      toast.error(`You can only select ${selectedCount} numbers`);
    }
  };

  const handleCustomNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const number = parseInt(customNumber);
    if (isNaN(number) || number < 1 || number > 999) {
      toast.error('Please enter a valid number between 1 and 999');
      return;
    }
    handleNumberSelect(number);
    setCustomNumber('');
  };

  useEffect(() => {
    onSelect(selectedNumbers);
  }, [selectedNumbers, onSelect]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleCustomNumberSubmit} className="flex gap-2">
        <Input
          type="number"
          min="1"
          max="999"
          value={customNumber}
          onChange={(e) => setCustomNumber(e.target.value)}
          placeholder="Enter ticket number (1-999)"
          className="flex-1"
        />
        <Button type="submit">Add Number</Button>
      </form>

      <div className="border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-2">
          Selected Numbers ({selectedNumbers.length}/{selectedCount}):
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedNumbers.map((number) => (
            <Badge
              key={number}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleNumberSelect(number)}
            >
              #{number}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[300px] border rounded-lg p-4">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: 999 }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={selectedNumbers.includes(number) ? "default" : "outline"}
              size="sm"
              className={`${soldTickets.has(number) ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleNumberSelect(number)}
              disabled={soldTickets.has(number)}
            >
              {number}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}